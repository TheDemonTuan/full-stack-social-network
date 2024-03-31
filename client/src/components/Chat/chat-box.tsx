"use client";
import { FriendGetAllFriendsResponse } from "@/api/friend";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Textarea } from "../ui/textarea";

interface MessageResponse {
  sender_id: string;
  text: string;
}

const socket = io("http://localhost:3000");
const ChatBox = ({ friend }: { friend: FriendGetAllFriendsResponse }) => {
  const { authData } = useAuth();
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authData?.id) return;
    socket.emit("addUser", authData?.id);
    socket.on("getUsers", (users) => {
      console.log(users);
    });

    return () => {
      socket.off("getUsers");
    };
  }, [authData?.id]);

  useEffect(() => {
    socket.on("getMessage", (message: MessageResponse) => {
      setMessages([...messages, message]);
    });

    return () => {
      socket.off("getMessage");
    };
  }, [messages]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    socket.emit("sendMessage", {
      sender_id: authData?.id,
      receiver_id: friend?.id,
      text: textareaRef.current?.value,
    });
    textareaRef.current!.value = "";
  };

  return (
    <div className="chat-area flex-1 flex flex-col">
      <div className="flex-3">
        <h2 className="text-xl py-1 mb-8 border-b-2 border-gray-200">
          <span>Đang nhắn tin với </span>
          <Link href={`/${friend?.username}`} className="font-bold">
            {friend?.first_name} {friend?.last_name}
          </Link>
        </h2>
      </div>
      <div className="messages flex-1 overflow-y-auto max-h-screen">
        {messages.map((m, index) =>
          m?.sender_id === friend?.id ? (
            <div key={index} className="message mb-4 flex">
              <div className="flex-2">
                <div className="w-12 h-12 relative">
                  <Image
                    src="/logo.png"
                    className="w-12 h-12 rounded-full mx-auto"
                    alt="chat-user"
                    width={48}
                    height={48}
                  />
                  <span className="absolute w-4 h-4 bg-gray-400 rounded-full right-0 bottom-0 border-2 border-white"></span>
                </div>
              </div>
              <div className="flex-1 px-2">
                <div className="inline-block bg-gray-300 rounded-full p-2 px-6 text-gray-700">
                  <span>{m?.text}</span>
                </div>
                <div className="pl-4">
                  <small className="text-gray-500">15 April</small>
                </div>
              </div>
            </div>
          ) : (
            <div key={index} className="message me mb-4 flex text-right">
              <div className="flex-1 px-2">
                <div className="inline-block bg-blue-600 rounded-full p-2 px-6 text-white">
                  <span>{m?.text}</span>
                </div>
                <div className="pr-4">
                  <small className="text-gray-500">15 April</small>
                </div>
              </div>
            </div>
          )
        )}
      </div>
      <div className="flex-2 pt-4 pb-10">
        <div className="write bg-white shadow flex rounded-lg">
          <div className="flex-3 flex content-center items-center text-center p-4 pr-0">
            <span className="block text-center text-gray-400 hover:text-gray-800">
              <svg
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                stroke="currentColor"
                viewBox="0 0 24 24"
                className="h-6 w-6">
                <path d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </span>
          </div>
          <div className="flex-1">
            <Textarea
              name="message"
              ref={textareaRef}
              placeholder="Type a message..."
              className="w-full block outline-none border-none resize-none focus-visible:ring-transparent py-4 px-4 bg-transparent"
            />
          </div>
          <div className="flex-2 w-32 p-2 flex content-center items-center">
            <div className="flex-1 text-center">
              <span className="text-gray-400 hover:text-gray-800">
                <span className="inline-block align-text-bottom">
                  <svg
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    className="w-6 h-6">
                    <path d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                  </svg>
                </span>
              </span>
            </div>
            <div className="flex-1">
              <button className="bg-blue-400 w-10 h-10 rounded-full inline-block" onClick={handleSendMessage}>
                <span className="inline-block align-text-bottom">
                  <svg
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                    className="w-4 h-4 text-white">
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
