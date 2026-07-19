import rss from "@astrojs/rss";
import { site } from "@/config";
import { getPublishedPosts, postSlug } from "@/utils/content";

export async function GET(context) {
  const posts = await getPublishedPosts();
  return rss({
    title: site.title,
    description: site.description,
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.published,
      link: `/posts/${postSlug(post.id)}/`
    }))
  });
}
