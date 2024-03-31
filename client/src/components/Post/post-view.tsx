"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaEarthAfrica } from "react-icons/fa6";
import { GetPostResponse, getPosts } from "@/api/post";
import { formatDistanceToNow } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { ApiErrorResponse } from "@/lib/http";
import PostViewReact from "./post-view-react";
import PostComment from "./post-comment";
import PostCommentAdd from "./post-comment-add";
import PostMore from "./post-more";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

const PostView = ({ username: username }: { username?: string }) => {
  const { authData } = useAuth();

  const {
    data: postsData,
    error: postsError,
    isError: postsIsError,
    isPending: postsIsPending,
  } = useQuery<GetPostResponse[], ApiErrorResponse>({
    queryKey: ["posts"],
    queryFn: async () =>
      getPosts({
        username: username || authData?.username || "",
        withFriends: username ? false : true,
      }),
    staleTime: 0,
  });

  if (postsIsPending) return <div>Loading...</div>;

  if (postsIsError) return <div>Error: {postsError?.message}</div>;

  return (
    <>
      {postsData?.map((post) => (
        <>
          <div key={post?.id} className="flex flex-col rounded-xl w-full max-h-fit bg-white shadow-2xl p-3 px-4 gap-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Avatar className="hover:opacity-70 cursor-pointer shadow-2xl">
                  <AvatarImage src="/logo.png" alt="@shadcn" />
                  <AvatarFallback>SC</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1">
                  <Link href={`/${post?.user?.username}`} className="text-black text-sm font-semibold hover:opacity-75">
                    {post?.user?.first_name} {post?.user?.last_name}
                  </Link>
                  <div className="flex items-center gap-2 text-black">
                    <span className="text-xs">
                      {formatDistanceToNow(new Date(post?.updated_at), { addSuffix: true })}
                    </span>
                    <FaEarthAfrica size={14} />
                  </div>
                </div>
              </div>
              {post?.user_id === authData?.id && <PostMore post={post} />}
            </div>
            <div className="text-black font-light">{post?.content}</div>
            <PostViewReact post={post} />
            <PostComment post={post} />
            <PostCommentAdd post={post} />
          </div>
        </>
      ))}
    </>
  );
};

export default PostView;
