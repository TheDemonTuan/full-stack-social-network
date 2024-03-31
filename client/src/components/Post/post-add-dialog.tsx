import React, { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EditPostBody, GetPostResponse, PostResponse, SubmitPostBody, editPost, submitPost } from "@/api/post";
import { ApiErrorResponse } from "@/lib/http";
import { toast } from "react-toastify";
import { getErrorMessage } from "@/lib/get-error-message";
import { EmojiClickData } from "emoji-picker-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { BsEmojiExpressionless, BsThreeDots } from "react-icons/bs";
import dynamic from "next/dynamic";

const Picker = dynamic(
  () => {
    return import("emoji-picker-react");
  },
  { ssr: false }
);

const PostAddDialog = ({ post }: { post?: GetPostResponse }) => {
  const [canResize, setCanResize] = useState(false);
  const [canPost, setCanPost] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { authData } = useAuth();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const queryClient = useQueryClient();

  const { mutate: submitPostMutate, isPending: submitPostIsPending } = useMutation<
    PostResponse,
    ApiErrorResponse,
    SubmitPostBody
  >({
    mutationFn: async (params) => await submitPost(params),
    onSuccess: () => {
      toast.success("Post submitted successfully!");
      textareaRef.current!.value = "";
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
      setIsDialogOpen(false);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Submit post failed!"));
    },
  });

  const { mutate: editPostMutate, isPending: editPostIsPending } = useMutation<
    PostResponse,
    ApiErrorResponse,
    EditPostBody
  >({
    mutationFn: async (params) => await editPost(params),
    onSuccess: () => {
      toast.success("Post edit successfully!");
      textareaRef.current!.value = "";
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
      setIsDialogOpen(false);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Post edit failed!"));
    },
  });

  const handlePost = () => {
    post
      ? editPostMutate({ content: textareaRef.current?.value || "", post_id: post?.id })
      : submitPostMutate({
          content: textareaRef.current?.value || "",
        });
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    textareaRef.current?.value ? setCanPost(true) : setCanPost(false);
    e.target.value.length > 84 ? setCanResize(true) : setCanResize(false);
  };

  const handleDialogChange = () => {
    setIsDialogOpen((prev) => !prev);
  };

  const handleEmojiClick = (e: EmojiClickData) => {
    textareaRef.current!.value += e?.emoji;
  };
  return (
    <Dialog onOpenChange={handleDialogChange} open={isDialogOpen}>
      <DialogTrigger className="w-full ml-4 rounded-full focus:ring-0 ring-0">
        {post ? (
          <BsThreeDots className="cursor-pointer hover:opacity-50" size={28} />
        ) : (
          <Input
            className="rounded-full ring-0 focus-visible:ring-0 bg-white cursor-pointer hover:bg-black/20"
            placeholder={`What's on your mind, ${authData?.last_name}?`}
            readOnly
          />
        )}
      </DialogTrigger>
      <DialogContent className="p-0">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl border-b-2 border-gray p-3">
            {post ? "Edit" : "Create"} post
          </DialogTitle>
          <DialogDescription
            className={`flex flex-col p-3 gap-3 ${submitPostIsPending && "pointer-events-none opacity-50"}`}>
            <div className="flex gap-2 items-center">
              <Avatar className="hover:opacity-70 cursor-pointer shadow-2xl">
                <AvatarImage src="/logo.png" alt="@shadcn" />
                <AvatarFallback>SC</AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-1">
                <span>
                  {authData?.first_name} {authData?.last_name}
                </span>
                <Select defaultValue="public">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Textarea
              className={`flex-auto ring-0 border-0 focus-visible:ring-0 text-2xl resize-none shadow-none p-0 ${
                canResize && "text-base"
              }`}
              placeholder={`What's on your mind, ${authData?.last_name}?`}
              cols={40}
              rows={6}
              ref={textareaRef}
              onChange={(e) => handleContentChange(e)}>
              {post?.content}
            </Textarea>
            <div className="flex justify-between">
              <div className="w-7 h-7 bg-black rounded-md"></div>
              <Popover>
                <PopoverTrigger>
                  <BsEmojiExpressionless size={24} />
                </PopoverTrigger>
                <PopoverContent asChild>
                  <div className="relative w-fit h-fit ">
                    <Picker searchDisabled lazyLoadEmojis height={350} onEmojiClick={(e) => handleEmojiClick(e)} />
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex justify-between items-center ring-1 ring-gray-300 p-4 rounded-sm font-bold">
              <span>Add to your post</span>
              <div className="flex gap-2">
                <div className="w-7 h-7 bg-black rounded-md"></div>
                <div className="w-7 h-7 bg-black rounded-md"></div>
                <div className="w-7 h-7 bg-black rounded-md"></div>
                <div className="w-7 h-7 bg-black rounded-md"></div>
                <div className="w-7 h-7 bg-black rounded-md"></div>
              </div>
            </div>
            <div>
              <Button
                onClick={handlePost}
                className={`w-full flex items-center gap-1 text-xl`}
                disabled={!post && !canPost}>
                {(submitPostIsPending || editPostIsPending) && <span className="loading loading-spinner" />}
                Post
              </Button>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default PostAddDialog;
