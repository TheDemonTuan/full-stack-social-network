"use client";
import {
  FriendGetAllNotFriendsResponse,
  FriendInteractAction,
  FriendInteractBody,
  FriendResponse,
  friendInteract,
  getAllNotFriends,
} from "@/api/friend";
import { getErrorMessage } from "@/lib/get-error-message";
import { ApiErrorResponse } from "@/lib/http";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { toast } from "react-toastify";

const FriendMayKnow = () => {
  const queryClient = useQueryClient();

  const {
    data: friendsMayKnowData,
    error: postsError,
    isError: postsIsError,
    isPending: postsIsPending,
  } = useQuery<FriendGetAllNotFriendsResponse[], ApiErrorResponse>({
    queryKey: ["friends", "may-know"],
    queryFn: async () => getAllNotFriends(),
    staleTime: 0,
  });

  const { mutate: friendInteractMutate, isPending: submitPostIsPending } = useMutation<
    FriendResponse,
    ApiErrorResponse,
    FriendInteractBody
  >({
    mutationFn: async (params) => await friendInteract(params),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["friends"],
      });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "failed!"));
    },
  });
  return (
    <>
      {friendsMayKnowData?.map((friendMayKnow) => (
        <div key={friendMayKnow?.id} className="card card-compact w-64 bg-base-100 shadow-2xl border">
          <figure>
            <Image src="/logo.png" alt="Picture of the author" width={98} height={98} />
          </figure>
          <div className="card-body">
            <Link href={`/${friendMayKnow?.username}`} className="card-title">
              {friendMayKnow?.first_name} {friendMayKnow?.last_name}
            </Link>
            <p>{friendMayKnow?.bio}</p>
            <div className="card-actions justify-end">
              <button
                className="btn btn-primary"
                onClick={() =>
                  friendInteractMutate({
                    action: FriendInteractAction.ADD,
                    friend_id: friendMayKnow.id,
                  })
                }>
                Kết bạn
              </button>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default FriendMayKnow;
