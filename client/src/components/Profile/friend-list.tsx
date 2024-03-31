"use client";
import { FriendGetAllFriendsResponse, getAllFriends } from "@/api/friend";
import { ApiErrorResponse } from "@/lib/http";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const FriendList = () => {
  const {
    data: friendListData,
    error: postsError,
    isError: postsIsError,
    isPending: postsIsPending,
  } = useQuery<FriendGetAllFriendsResponse[], ApiErrorResponse>({
    queryKey: ["friend", "list"],
    queryFn: async () => getAllFriends(),
    staleTime: 0,
  });
  return (
    <div className="mr-12 mt-4">
      <div className="p-4 shadow rounded-lg bg-white w-80" id="intro">
        {/* Header */}
        <div className="flex justify-between">
          <h1 className="font-bold text-xl">Friends</h1>
          <Link href="/friends/myId" className="text-lg text-blue-700 hover:bg-blue-200">
            See All Friends
          </Link>
        </div>
        {/* List */}
        <>
          <p className="text-base text-gray-400">{friendListData?.length} friends</p>
          <div className="grid grid-cols-2 gap-2">
            {friendListData?.map((friendList) => (
              <div key={friendList?.id} className="flex flex-col items-center justify-center">
                <Image src="/logo.png" alt="Avatar" className="mt-2 cursor-pointer" width={64} height={64} />
                <Link href={`/${friendList?.username}`} className="font-semibold text-xs">
                  {friendList?.first_name} {friendList?.last_name}
                </Link>
              </div>
            ))}
          </div>
        </>
      </div>
    </div>
  );
};

export default FriendList;
