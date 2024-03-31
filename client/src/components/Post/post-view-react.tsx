"use client";
import { GetPostResponse, LikePostBody, LikePostResponse, likePost } from "@/api/post";
import { useAuth } from "@/hooks/useAuth";
import { getErrorMessage } from "@/lib/get-error-message";
import { ApiErrorResponse } from "@/lib/http";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { FaRegComments, FaShare } from "react-icons/fa";
import { GrLike } from "react-icons/gr";
import { toast } from "react-toastify";

const PostViewReact = ({ post }: { post: GetPostResponse }) => {
  const { authData } = useAuth();
  const queryClient = useQueryClient();
  const [isLiked, setIsLiked] = useState(
    post?.post_likes?.find((like) => like?.user_id === authData?.id && like?.post_id === post?.id) ? true : false
  );

  const { mutate: likePostMutate } = useMutation<LikePostResponse, ApiErrorResponse, LikePostBody>({
    mutationFn: async (params) => await likePost(params),
    onSuccess: (likePostData) => {
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Like post failed!"));
    },
  });

  const handleLikePost = async (postId: number) => {
    setIsLiked((prev) => !prev);
    likePostMutate({ post_id: postId });
  };
  return (
    <>
      <div className="flex justify-between text-black text-sm">
        <span>
          👍❤️😆{" "}
          {isLiked && post?._count.post_likes > 1
            ? `You and ${post?._count?.post_likes - 1} others`
            : post?._count?.post_likes}
        </span>
        <div className="flex gap-3">
          <span>{post?._count?.post_comments} comments</span>
          <span>1 share</span>
        </div>
      </div>
      <div className="border-t border-gray-400" />
      <div className="grid grid-cols-3 text-black">
        <div
          className={`col-span-1 flex items-center justify-center gap-2 hover:bg-black/25 rounded-md cursor-pointer p-1 ${
            isLiked && "text-red-500"
          }`}
          onClick={() => handleLikePost(post?.id)}>
          <GrLike size={21} />
          <span>Like</span>
        </div>
        <div className="col-span-1 flex items-center justify-center gap-2 hover:bg-black/25 rounded-md cursor-pointer p-1">
          <FaRegComments size={21} />
          <span>Comment</span>
        </div>
        <div className="col-span-1 flex items-center justify-center gap-2 hover:bg-black/25 rounded-md cursor-pointer p-1">
          <FaShare size={21} />
          <span>Share</span>
        </div>
      </div>
      <div className="border-t border-gray-400" />
    </>
  );
};

export default PostViewReact;
