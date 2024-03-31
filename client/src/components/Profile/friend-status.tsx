"use client";
import {
  FriendInteractAction,
  FriendInteractBody,
  FriendResponse,
  FriendStatus,
  friendInteract,
  getFriendStatus,
} from "@/api/friend";
import { getErrorMessage } from "@/lib/get-error-message";
import { ApiErrorResponse } from "@/lib/http";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { toast } from "react-toastify";

const FriendInteract = ({ friend_id }: { friend_id: string }) => {
  const queryClient = useQueryClient();
  const { mutate: friendInteractMutate, isPending: submitPostIsPending } = useMutation<
    FriendResponse,
    ApiErrorResponse,
    FriendInteractBody
  >({
    mutationFn: async (params) => await friendInteract(params),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["friend", "status"],
      });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "failed!"));
    },
  });

  const {
    data: friendStatusData,
    error: postsError,
    isSuccess: memberIsSuccess,
    isError: postsIsError,
    isPending: memberIsPending,
    isFetching: memberIsFetching,
  } = useQuery<FriendStatus, ApiErrorResponse>({
    queryKey: ["friend", "status"],
    queryFn: async () => getFriendStatus(friend_id),
    staleTime: 0,
    enabled: !!friend_id,
  });

  const handleFriendInteract = (action: FriendInteractAction) => {
    friendInteractMutate({ friend_id, action });
  };
  return (
    <>
      {friendStatusData === FriendStatus.NONE && (
        <li className="px-2 font-semibold" onClick={() => handleFriendInteract(FriendInteractAction.ADD)}>
          <span className="bg-blue-600 px-5 py-2 rounded-lg text-lg text-white font-semibold cursor-pointer hover:opacity-70">
            <i className="bx bx-plus-circle text-xl mr-2"></i>
            Thêm bạn
          </span>
        </li>
      )}
      {friendStatusData === FriendStatus.PENDING && (
        <>
          <li className="px-2 font-semibold">
            <span className="bg-blue-600 px-5 py-2 rounded-lg text-white font-semibold cursor-pointer hover:opacity-70">
              <i className="bx bx-plus-circle text-xl mr-2"></i>
              Đang đợi phản hồi
            </span>
          </li>
          <li className="px-2 font-semibold" onClick={() => handleFriendInteract(FriendInteractAction.REJECT)}>
            <span className="bg-gray-200 px-5 py-2 rounded-lg text-black font-semibold cursor-pointer hover:opacity-70">
              <i className="bx bx-edit-alt mr-2 text-xl"></i>
              Huỷ yêu cầu
            </span>
          </li>
        </>
      )}
      {friendStatusData === FriendStatus.REQUESTED && (
        <>
          <li className="px-2 font-semibold" onClick={() => handleFriendInteract(FriendInteractAction.ACCEPT)}>
            <span className="bg-blue-600 px-5 py-2 rounded-lg text-white font-semibold cursor-pointer hover:opacity-70">
              <i className="bx bx-plus-circle text-xl mr-2"></i>
              Chấp nhận lời mời
            </span>
          </li>
          <li className="px-2 font-semibold" onClick={() => handleFriendInteract(FriendInteractAction.REJECT)}>
            <span className="bg-gray-200 px-5 py-2 rounded-lg text-black font-semibold cursor-pointer hover:opacity-70">
              <i className="bx bx-edit-alt mr-2 text-xl"></i>
              Từ chối lời mời
            </span>
          </li>
        </>
      )}
      {friendStatusData === FriendStatus.ACCEPTED && (
        <li className="px-2 font-semibold" onClick={() => handleFriendInteract(FriendInteractAction.REJECT)}>
          <span className="bg-blue-600 px-5 py-2 rounded-lg text-white font-semibold cursor-pointer hover:opacity-70">
            <i className="bx bx-plus-circle text-xl mr-2"></i>
            Huỷ kết bạn
          </span>
        </li>
      )}
    </>
  );
};

export default FriendInteract;
