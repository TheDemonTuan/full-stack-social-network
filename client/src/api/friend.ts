import http from "@/lib/http";
import { AuthResponse } from "./auth";

export enum FriendStatus {
  NONE = "none",
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REQUESTED = "REQUESTED",
}

export interface FriendResponse {
  from_user_id: string;
  to_user_id: string;
  status: FriendStatus;
  created_at: string;
  updated_at: string;
}

//----------------------------------------------FRIEND GET----------------------------------------------
export const getFriendStatus = async (friendId: string) =>
  http.get<FriendStatus>(`friend/${friendId}`).then((res) => res.data);

//----------------------------------------------FRIEND INTERACT----------------------------------------------
export enum FriendInteractAction {
  ADD = "add",
  ACCEPT = "accept",
  REJECT = "reject",
}

export interface FriendInteractBody {
  friend_id: string;
  action: FriendInteractAction;
}

export const friendInteract = async (params: FriendInteractBody) =>
  http.post(`friend/${params?.friend_id}/${params?.action}`, params).then((res) => res.data);

//----------------------------------------------FRIEND GET ALL REQUEST----------------------------------------------
export interface FriendGetAllRequestResponse extends FriendResponse {
  userid_1: AuthResponse;
}

export const getAllFriendsRequest = async () =>
  http.get<FriendGetAllRequestResponse[]>("friend/get-all-friends-request").then((res) => res.data);

//----------------------------------------------FRIEND GET ALL NOT FRIENDS----------------------------------------------
export interface FriendGetAllNotFriendsResponse extends AuthResponse {}

export const getAllNotFriends = async () =>
  http.get<FriendGetAllNotFriendsResponse[]>("friend/get-all-not-friends").then((res) => res.data);

//----------------------------------------------FRIEND GET ALL PENDING FRIENDS----------------------------------------------
export interface FriendGetAllPendingFriendsResponse extends FriendResponse {
  userid_2: AuthResponse;
}

export const getAllPendingFriends = async () =>
  http.get<FriendGetAllPendingFriendsResponse[]>("friend/get-all-pending-friends").then((res) => res.data);

//----------------------------------------------FRIEND GET ALL FRIENDS----------------------------------------------
export interface FriendGetAllFriendsResponse extends AuthResponse {}

export const getAllFriends = async () =>
  http.get<FriendGetAllFriendsResponse[]>("friend/get-all-friends").then((res) => res.data);