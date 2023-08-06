"use client";
import {
  PostCreationRequest,
  PostValidator,
  UpdatePostRequest,
  UpdatePostValidator,
} from "@/lib/validators/post";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import TextareaAutoSize from "react-textarea-autosize";
import { zodResolver } from "@hookform/resolvers/zod";
import type EditorJS from "@editorjs/editorjs";
import { uploadFiles } from "@/lib/uploadthing";
import { toast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";

type Props = {
  subredditId: string;
  isEditing: boolean;
  postId?: string | undefined;
};

/**
 * Editor component provides a rich text editor for creating posts.
 * It utilizes the EditorJS library for the editor functionality.
 *
 * @param subredditId - The ID of the subreddit for which the post is being created.
 */
function Editor({ subredditId, postId, isEditing }: Props) {
  const {
    register: register,
    handleSubmit: handleSubmit,
    formState: { errors },
  } = useForm<PostCreationRequest>({
    resolver: zodResolver(PostValidator),
    defaultValues: {
      subredditId,
      title: "",
      content: null,
    },
  });
  const {
    register: register2,
    formState: { errors: errors2 },
    handleSubmit: handleSubmit2,
  } = useForm<UpdatePostRequest>({
    resolver: zodResolver(UpdatePostValidator),
    defaultValues: {
      postId,
      subredditId,
      title: "",
      content: null,
    },
  });
  const ref = useRef<EditorJS>();
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const _titleRef = useRef<HTMLTextAreaElement>(null);
  const _titleRef2 = useRef<HTMLTextAreaElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  /**
   * Initializes the EditorJS instance and sets up the editor tools and options.
   */
  const initializedEditor = useCallback(async () => {
    // Dynamically import the required EditorJS and tool modules
    const EditorJS = (await import("@editorjs/editorjs")).default;
    const Header = (await import("@editorjs/header")).default;
    const Embed = (await import("@editorjs/embed")).default;
    const Table = (await import("@editorjs/table")).default;
    const List = (await import("@editorjs/list")).default;
    const Code = (await import("@editorjs/code")).default;
    const LinkTool = (await import("@editorjs/link")).default;
    const InlineCode = (await import("@editorjs/inline-code")).default;
    const ImageTool = (await import("@editorjs/image")).default;

    if (!ref.current) {
      const editor = new EditorJS({
        holder: "editor",
        onReady() {
          ref.current = editor;
        },
        placeholder: "Start writing your post...",
        inlineToolbar: true,
        data: { blocks: [] },
        tools: {
          header: Header,
          linkTool: {
            class: LinkTool,
            config: {
              endpoint: "/api/link",
            },
          },
          image: {
            class: ImageTool,
            config: {
              uploader: {
                async uploadByFile(file: File) {
                  const [res] = await uploadFiles({
                    files: [file],
                    endpoint: "imageUploader",
                  });

                  return {
                    success: 1,
                    file: {
                      url: res.fileUrl,
                    },
                  };
                },
              },
            },
          },
          list: List,
          code: Code,
          inlineCode: InlineCode,
          table: Table,
          embed: Embed,
        },
        minHeight: 0,
      });
    }
  }, []);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMounted(true);
    }
  }, []);

  useEffect(() => {
    if (Object.keys(errors).length) {
      for (const [_key, value] of Object.entries(errors)) {
        toast({
          title: "Something went wrong",
          description: (value.message as { message: string }).message,
          variant: "destructive",
        });
      }
    }
  }, [errors]);

  useEffect(() => {
    if (Object.keys(errors2).length) {
      for (const [_key, value] of Object.entries(errors2)) {
        toast({
          title: "Something went wrong",
          description: (value.message as { message: string }).message,
          variant: "destructive",
        });
      }
    }
  }, [errors2]);

  useEffect(() => {
    const init = async () => {
      await initializedEditor();

      setTimeout(() => {
        // Set focus to the title input
        _titleRef.current?.focus();
      }, 0);
    };

    if (isMounted) {
      init();
    }

    // Clean up EditorJS instance on unmount
    return () => {
      ref.current?.destroy();
      ref.current = undefined;
    };
  }, [isMounted, initializedEditor]);

  const { mutate: createPost } = useMutation({
    mutationFn: async ({
      title,
      content,
      subredditId,
    }: PostCreationRequest) => {
      const payload = {
        subredditId,
        title,
        content,
      };

      const { data } = await axios.post("/api/subreddit/post/create", payload);
      return data;
    },
    onError: (err) => {
      return toast({
        title: "Something went wrong",
        description: "Your post was not published, please try again later.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      // Redirect to the subreddit after successful post creation

      const newPathname = pathname.split("/").slice(0, -1).join("/");
      router.push(newPathname);

      // Refresh the page to update the post list
      router.refresh();

      return toast({
        description: "Your post has been published.",
      });
    },
  });

  const { mutate: updatePost } = useMutation({
    mutationFn: async ({
      postId,
      title,
      content,
      subredditId,
    }: UpdatePostRequest) => {
      const payload = {
        postId,
        subredditId,
        title,
        content,
      };
      console.log("submitted form");

      const { data } = await axios.post("/api/subreddit/post/edit", payload);
      return data;
    },

    onError: (err) => {
      return toast({
        title: "Something went wrong",
        description: "Your post was not edited, please try again later.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      // Redirect to the subreddit after successful post edit
      console.log(pathname);
      const delimiter = "/";
      const start = 3;
      const newPathname = pathname.split(delimiter).slice(0, start).join("/");
      console.log(newPathname);
      router.push(newPathname);

      // Refresh the page to update the post list
      router.refresh();

      return toast({
        description: "Your post has been edited.",
      });
    },
  });

  /**
   * Handles the form submission.
   * Saves the EditorJS content and calls the createPost mutation.
   *
   * @param data - Form data including the post title and content.
   */

  async function onSubmit(data: PostCreationRequest) {
    const blocks = await ref.current?.save();

    const payload: PostCreationRequest = {
      title: data.title,
      content: blocks,
      subredditId: data.subredditId,
    };

    createPost(payload);
  }
  async function onEdit(data: UpdatePostRequest) {
    const blocks = await ref.current?.save();
    console.log("onedit");
    const payload: UpdatePostRequest = {
      postId: postId as string,
      title: data.title,
      content: blocks,
      subredditId: data.subredditId,
    };

    updatePost(payload);
  }

  if (!isMounted) {
    return null;
  }

  const { ref: titleRef, ...rest } = register("title");
  const { ref: titleRef2, ...rest2 } = register2("title");
  if (!isEditing) {
    return (
      <div className="w-full p-4 bg-zinc-50 rounded-lg border border-zinc-200">
        <form
          id="subreddit-post-form"
          className="w-fit"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="prose prose-stone dark:prose-invert">
            <TextareaAutoSize
              ref={(e) => {
                titleRef(e);
                console.log(postId);
                // Assign the ref to _titleRef for setting focus
                // @ts-ignore
                _titleRef.current = e;
              }}
              {...rest}
              placeholder="Title"
              className="w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none"
            />

            <div id="editor" className="min-h-[200px]" />
          </div>
        </form>
      </div>
    );
  }
  if (isEditing) {
    return (
      <div className="w-full p-4 bg-zinc-50 rounded-lg border border-zinc-200">
        <form id="edit-form" className="w-fit" onSubmit={handleSubmit2(onEdit)}>
          <div className="prose prose-stone dark:prose-invert">
            <TextareaAutoSize
              ref={(e) => {
                titleRef2(e);
                console.log(postId);
                // Assign the ref to _titleRef for setting focus
                // @ts-ignore

                _titleRef2.current = e;
              }}
              {...rest2}
              placeholder="Title"
              className="w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none"
            />
            <div id="editor" className="min-h-[200px]" />
          </div>
        </form>
      </div>
    );
  }
}

export default Editor;
