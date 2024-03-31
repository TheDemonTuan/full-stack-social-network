import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "../ui/textarea";
import { IoSend } from "react-icons/io5";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import dynamic from "next/dynamic";
import { BsEmojiExpressionless } from "react-icons/bs";
import { EmojiClickData } from "emoji-picker-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CommentPostBody, CommentPostResponse, GetPostResponse, commentPost } from "@/api/post";
import { ApiErrorResponse } from "@/lib/http";
import { toast } from "react-toastify";
import { getErrorMessage } from "@/lib/get-error-message";

const Picker = dynamic(
  () => {
    return import("emoji-picker-react");
  },
  { ssr: false }
);

const PostCommentAdd = ({ post }: { post: GetPostResponse }) => {
  const queryClient = useQueryClient();
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const { mutate: commentPostMutate } = useMutation<CommentPostResponse, ApiErrorResponse, CommentPostBody>({
    mutationFn: async (params) => await commentPost(params),
    onSuccess: () => {
      toast.success("Post submitted successfully!");
      textareaRef.current!.value = "";
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Submit post failed!"));
    },
  });

  const handleSendComment = (postId: number) => {
    commentPostMutate({ post_id: postId, content: textareaRef.current!.value });
  };

  const handleEmojiClick = (e: EmojiClickData) => {
    textareaRef.current!.value += e?.emoji;
  };
  return (
    <div className="flex gap-2">
      <Avatar className="w-8 h-8">
        <AvatarImage src="/logo.png" alt="@shadcn" />
        <AvatarFallback>SC</AvatarFallback>
      </Avatar>
      <div className="relative w-full">
        <Textarea ref={textareaRef} className="resize-none pr-16" />
        <div className="absolute flex items-center gap-4 right-2 bottom-2">
          <Popover>
            <PopoverTrigger>
              <BsEmojiExpressionless size={22} />
            </PopoverTrigger>
            <PopoverContent asChild>
              <div className="relative w-fit h-fit ">
                <Picker searchDisabled lazyLoadEmojis height={350} onEmojiClick={(e) => handleEmojiClick(e)} />
              </div>
            </PopoverContent>
          </Popover>
          <div onClick={() => handleSendComment(post?.id)}>
            <IoSend className="cursor-pointer hover:opacity-70" size={18} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCommentAdd;
