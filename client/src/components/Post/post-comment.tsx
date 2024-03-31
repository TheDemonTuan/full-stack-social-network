import React from "react";
import { BsThreeDots } from "react-icons/bs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GetPostResponse } from "@/api/post";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

const PostComment = ({ post }: { post: GetPostResponse }) => {
  return (
    <div className="flex flex-col gap-2 text-sm text-black">
      <span className="hover:underline cursor-pointer">View more comments</span>
      {post?.post_comments?.map((comment) => (
        <div key={comment?.id} className="flex items-start justify-start w-full gap-2 group">
          <Avatar className="w-8 h-8">
            <AvatarImage src="/logo.png" alt="@shadcn" />
            <AvatarFallback>SC</AvatarFallback>
          </Avatar>
          <div className="flex flex-col justify-center items-start gap-1">
            <div className="flex gap-3 items-center">
              <div className="flex flex-col gap-1 bg-black/15 rounded-2xl p-2 text-black text-xs">
                <Link href={`/${comment?.user?.username}`} className="font-bold">
                  {comment?.user?.first_name} {comment?.user?.last_name}
                </Link>
                <span>{comment?.content}</span>
              </div>
              <BsThreeDots
                className="hidden group-hover:block cursor-pointer hover:bg-black/20 rounded-full"
                size={20}
              />
            </div>
            <div className="flex gap-3 text-xs ml-2">
              <span className="hover:underline cursor-pointer">Like</span>
              <span className="hover:underline cursor-pointer">Reply</span>
              <span className="hover:underline cursor-pointer">Share</span>
              <span className="text-gray-400 hover:underline cursor-pointer">
                {formatDistanceToNow(new Date(comment?.created_at), { addSuffix: true })}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostComment;
