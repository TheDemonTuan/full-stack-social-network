import { DeletePostBody, GetPostResponse, PostResponse, deletePost } from "@/api/post";
import { getErrorMessage } from "@/lib/get-error-message";
import { ApiErrorResponse } from "@/lib/http";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { BsThreeDots } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import { toast } from "react-toastify";
import PostAdd from "./post-add";
import PostAddDialog from "./post-add-dialog";

const PostMore = ({ post }: { post: GetPostResponse }) => {
  const queryClient = useQueryClient();

  const { mutate: deletePostMutate } = useMutation<PostResponse, ApiErrorResponse, DeletePostBody>({
    mutationFn: async (params) => await deletePost(params),
    onSuccess: () => {
      toast.success("Post delete successfully!");
      queryClient.invalidateQueries({
        queryKey: ["post"],
      });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Delete post failed!"));
    },
  });

  const handleDeletePost = (postId: number) => {
    deletePostMutate({
      post_id: postId,
    });
  };
  return (
    <div className="flex gap-3 justify-center text-black">
      {/* <BsThreeDots className="cursor-pointer hover:opacity-50" onClick={() => handleEditPost(post?.id)} size={28} /> */}
      <PostAddDialog post={post} />
      <IoMdClose className="cursor-pointer hover:opacity-50" onClick={() => handleDeletePost(post?.id)} size={48} />
    </div>
  );
};

export default PostMore;
