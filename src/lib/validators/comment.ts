import { z } from "zod";

export const commentValidator = z.object({
  postId: z.string(),
  text: z.string(),
  replyToId: z.string().optional(),
});

export type CommentRequest = z.infer<typeof commentValidator>;

export const updateCommentValidator = z.object({
  commentId: z.string(),
  postId: z.string(),
  text: z.string(),
  replyToId: z.string().nullable(),
});

export type UpdateCommentRequest = z.infer<typeof updateCommentValidator>;

export const deleteCommentValidator = z.object({
  commentId: z.string(),
});

export type DeleteCommentRequest = z.infer<typeof deleteCommentValidator>;
