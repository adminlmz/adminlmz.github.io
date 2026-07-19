---
title: "H200 掉卡时，先分清三种可见"
description: "PCIe 枚举、NVML 可见和调度可用不是同一层证据。先分层，再决定下一步。"
published: 2026-07-18
category: compute-ops
tags: [H200, GPU, PCIe, NVML]
draft: false
featured: true
project: onsite-compute-ops
---

H200 节点出现“少卡”时，最危险的做法是只看一条 `nvidia-smi` 输出就直接判断硬件损坏。现场需要先回答三个不同问题。

## 物理枚举层

这一层确认系统是否还能在 PCIe 或平台总线上看到设备。常用只读检查包括：

```bash
lspci | grep -i nvidia
lspci -tv
dmesg -T | grep -Ei 'NVRM|Xid|AER|pcie'
```

如果 PCIe 层已经缺少设备，方向通常落在供电、链路、插槽、平台固件或硬件本身。此时不要先在容器和调度器里反复重试。

## NVML 可见层

NVML 是 `nvidia-smi` 和许多监控工具读取 GPU 状态的接口。检查时不要只数行数，还要保留 UUID、序列号和错误信息。

```bash
nvidia-smi -L
nvidia-smi --query-gpu=index,uuid,serial,name --format=csv
nvidia-smi -q
```

PCIe 能看到设备，但 NVML 看不到，常见方向包括驱动绑定、固件状态、设备初始化失败或 GPU 已进入异常状态。

## 调度和容器可用层

物理层和 NVML 都正常，不代表业务任务一定能拿到全部 GPU。还需要检查容器设备映射、MIG、Kubernetes Device Plugin、Slurm GRES 和作业资源声明。

```bash
docker run --rm --gpus all nvidia/cuda:12.2.0-base nvidia-smi -L
kubectl describe node | grep -A4 -i nvidia
scontrol show node
```

这些命令只用于说明证据层。真实环境中的镜像、节点和调度命令必须根据现场版本替换。

## 一个可靠的汇报结构

现场同步可以保持四句话：

1. 物理枚举看到多少张卡。
2. NVML 看到多少张卡，是否有 Xid 或初始化错误。
3. 调度器和容器暴露多少张卡。
4. 当前证据支持什么方向，还缺什么证据。

把三层分开以后，后续动作才不会在错误层面浪费时间。涉及重启、下电、插拔、换槽和更换部件时，必须先确认影响范围、窗口、停止条件和恢复检查。
