"use client";

import {
  FriendGetAllFriendsResponse,
  FriendInteractAction,
  FriendInteractBody,
  FriendResponse,
  friendInteract,
  getAllFriends,
} from "@/api/friend";
import { getErrorMessage } from "@/lib/get-error-message";
import { ApiErrorResponse } from "@/lib/http";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { toast } from "react-toastify";

const FriendAccept = () => {
  const queryClient = useQueryClient();

  const {
    data: friendsAcceptData,
    error: postsError,
    isError: postsIsError,
    isPending: postsIsPending,
  } = useQuery<FriendGetAllFriendsResponse[], ApiErrorResponse>({
    queryKey: ["friends", "accept"],
    queryFn: async () => getAllFriends(),
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
      {friendsAcceptData?.map((friendAccept) => (
        <div key={friendAccept?.id} className="card card-compact w-64 bg-base-100 shadow-2xl border">
          <figure>
            <Image src="/logo.png" alt="Picture of the author" width={98} height={98} />
          </figure>
          <div className="card-body">
            <Link href={`/${friendAccept?.username}`} className="card-title">
              {friendAccept?.first_name} {friendAccept?.last_name}
            </Link>
            <p>{friendAccept?.bio}</p>
            <div className="card-actions justify-end">
              <button
                className="btn btn-primary"
                onClick={() =>
                  friendInteractMutate({
                    action: FriendInteractAction.REJECT,
                    friend_id: friendAccept?.id,
                  })
                }>
                Huỷ kết bạn
              </button>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default FriendAccept;
