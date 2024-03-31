"use client";
import {
  FriendGetAllPendingFriendsResponse,
  FriendInteractAction,
  FriendInteractBody,
  FriendResponse,
  friendInteract,
  getAllPendingFriends,
} from "@/api/friend";
import { getErrorMessage } from "@/lib/get-error-message";
import { ApiErrorResponse } from "@/lib/http";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { toast } from "react-toastify";

const FriendWait = () => {
  const queryClient = useQueryClient();

  const {
    data: friendsWaitData,
    error: postsError,
    isError: postsIsError,
    isPending: postsIsPending,
  } = useQuery<FriendGetAllPendingFriendsResponse[], ApiErrorResponse>({
    queryKey: ["friends", "wait"],
    queryFn: async () => getAllPendingFriends(),
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
      {friendsWaitData?.map((friendWait) => (
        <div key={friendWait?.userid_2?.id} className="card card-compact w-64 bg-base-100 shadow-2xl border">
          <figure>
            <Image src="/logo.png" alt="Picture of the author" width={98} height={98} />
          </figure>
          <div className="card-body">
            <Link href={`/${friendWait?.userid_2?.username}`} className="card-title">
              {friendWait?.userid_2?.first_name} {friendWait?.userid_2?.last_name}
            </Link>
            <p>{friendWait?.userid_2?.bio}</p>
            <div className="card-actions justify-end">
              <button
                className="btn btn-primary"
                onClick={() =>
                  friendInteractMutate({
                    action: FriendInteractAction.REJECT,
                    friend_id: friendWait?.userid_2?.id,
                  })
                }>
                Huỷ lời mời
              </button>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default FriendWait;
