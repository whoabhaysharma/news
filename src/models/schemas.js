import { z } from "zod";

export const NewsSchema = z.object({
  channelTitle: z.string(),
  articles: z.array(
    z.object({
      title: z.string(),
      link: z.string().url(),
      pubDate: z.string(),
      description: z.string(),
    })
  ),
});

export const FirebaseNewsSchema = z.object({
  id: z.string(),
  data: z.object({
    title: z.string(),
    link: z.string().url(),
    pubDate: z.string(),
    description: z.string(),
    created: z.string().datetime(),
  }),
});
