"use client";
import { FriendGetAllFriendsResponse, getAllFriends } from "@/api/friend";
import { ApiErrorResponse } from "@/lib/http";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import React, { memo } from "react";
import ChatBox from "./chat-box";

const ChatList = () => {
  const [isShowChat, setIsShowChat] = React.useState(false);
  const [friend, setFriend] = React.useState<FriendGetAllFriendsResponse>();

  const {
    data: friendListData,
    error: postsError,
    isError: postsIsError,
    isPending: postsIsPending,
  } = useQuery<FriendGetAllFriendsResponse[], ApiErrorResponse>({
    queryKey: ["chat", "list"],
    queryFn: async () => getAllFriends(),
    staleTime: 0,
  });

  const handleShowChat = (friend: FriendGetAllFriendsResponse) => {
    setFriend(friend);
    setIsShowChat(true);
  };
  return (
    <>
      <div className="flex-1 flex h-full">
        <div className="sidebar hidden lg:flex w-1/3 flex-2 flex-col pr-6">
          <div className="search flex-2 pb-6 px-2">
            <input
              type="text"
              className="outline-none py-2 block w-full bg-transparent border-b-2 border-gray-200"
              placeholder="Search"
            />
          </div>
          <div className="flex-1 h-full overflow-auto px-2">
            {friendListData?.map((friend) => (
              <div
                key={friend?.id}
                className="entry cursor-pointer transform hover:scale-105 duration-300 transition-transform bg-white mb-4 rounded p-4 flex shadow-md"
                onClick={() => handleShowChat(friend)}>
                <div className="flex-2">
                  <div className="w-12 h-12 relative">
                    <Image className="rounded-full mx-auto" src="/logo.png" alt="chat-user" width={48} height={48} />
                    <span className="absolute w-4 h-4 bg-green-400 rounded-full right-0 bottom-0 border-2 border-white"></span>
                  </div>
                </div>
                <div className="flex-1 px-2">
                  <div className="truncate w-32">
                    <span className="text-gray-800">
                      {friend?.first_name} {friend?.last_name}
                    </span>
                  </div>
                </div>
                <div className="flex-2 text-right">
                  <div>
                    <small className="text-gray-500">15 April</small>
                  </div>
                  <div>
                    <small className="text-xs bg-red-500 text-white rounded-full h-6 w-6 leading-6 text-center inline-block">
                      23
                    </small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {isShowChat && friend && <ChatBox friend={friend} />}
      </div>
    </>
  );
};

export default ChatList;
