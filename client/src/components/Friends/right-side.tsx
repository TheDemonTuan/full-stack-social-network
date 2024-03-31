import React from "react";
import styles from "@/styles/Friends/right-side.module.css";
import Image from "next/image";
import FriendRequest from "./friend-request";
import FriendMayKnow from "./friend-may-know";
import FriendWait from "./friend-wait";
import FriendAccept from "./friend-accept";

const RightSide = () => {
  return (
    <div className={`${styles["right-side"]} flex flex-col gap-4 flex-auto text-black p-4`}>
      <div className="space-y-4">
        <span className="font-bold text-xl">Lời mời kết bạn</span>
        <div className="grid grid-cols-4 gap-8">
          <FriendRequest />
        </div>
      </div>
      <div className="space-y-4">
        <span className="font-bold text-xl">Lời mời kết bạn đã gửi</span>
        <div className="grid grid-cols-4 gap-8">
          <FriendWait />
        </div>
      </div>
      <div className="space-y-4">
        <span className="font-bold text-xl">Bạn bè</span>
        <div className="grid grid-cols-4 gap-8">
          <FriendAccept />
        </div>
      </div>
      <div className="space-y-4">
        <span className="font-bold text-xl">Người bạn có thể biết</span>
        <div className="grid grid-cols-4 gap-8">
          <FriendMayKnow />
        </div>
      </div>
    </div>
  );
};

export default RightSide;
