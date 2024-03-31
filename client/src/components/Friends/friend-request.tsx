"use client";
import {
  FriendGetAllRequestResponse,
  FriendInteractAction,
  FriendInteractBody,
  FriendResponse,
  friendInteract,
  getAllFriendsRequest,
} from "@/api/friend";
import { getErrorMessage } from "@/lib/get-error-message";
import { ApiErrorResponse } from "@/lib/http";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { toast } from "react-toastify";

const FriendRequest = () => {
  const queryClient = useQueryClient();

  const {
    data: friendsRequestData,
    error: postsError,
    isError: postsIsError,
    isPending: postsIsPending,
  } = useQuery<FriendGetAllRequestResponse[], ApiErrorResponse>({
    queryKey: ["friends", "request"],
    queryFn: async () => getAllFriendsRequest(),
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
      {friendsRequestData?.map((friendRequest) => (
        <div key={friendRequest?.from_user_id} className="card card-compact w-64 bg-base-100 shadow-2xl border">
          <figure>
            <Image src="/logo.png" alt="Picture of the author" width={98} height={98} />
          </figure>
          <div className="card-body">
            <Link href={`/${friendRequest?.userid_1?.username}`} className="card-title">
              {friendRequest?.userid_1?.first_name} {friendRequest?.userid_1?.last_name}
            </Link>
            <p>{friendRequest?.userid_1?.bio}</p>
            <div className="card-actions justify-end">
              <button
                className="btn"
                onClick={() =>
                  friendInteractMutate({
                    action: FriendInteractAction.REJECT,
                    friend_id: friendRequest?.from_user_id,
                  })
                }>
                Từ chối
              </button>
              <button
                className="btn btn-primary"
                onClick={() =>
                  friendInteractMutate({
                    action: FriendInteractAction.ACCEPT,
                    friend_id: friendRequest?.from_user_id,
                  })
                }>
                Đồng ý
              </button>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default FriendRequest;
