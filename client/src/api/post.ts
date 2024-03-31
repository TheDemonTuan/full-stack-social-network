import http from "@/lib/http";
import { AuthResponse } from "./auth";

export interface PostResponse {
  id: number;
  user_id: string;
  content: string;
  status: boolean;
  created_at: string;
  updated_at: string;
}

// ----------------------------------------------SUBMIT POST----------------------------------------------

export interface SubmitPostBody {
  content: string;
}

export const submitPost = async (params: SubmitPostBody) => http.post("post", params).then((res) => res.data);

// ----------------------------------------------EDIT POST----------------------------------------------
export interface EditPostBody {
  post_id: number;
  content: string;
}

export const editPost = async (params: EditPostBody) =>
  http.put(`post/${params?.post_id}`, params).then((res) => res.data);

// ----------------------------------------------GET POST----------------------------------------------

export interface GetPostResponse extends PostResponse {
  user: AuthResponse;
  _count: {
    post_likes: number;
    post_comments: number;
  };
  post_likes: {
    post_id: number;
    user_id: string;
  }[];
  post_comments: {
    id: number;
    content: string;
    user: AuthResponse;
    created_at: Date;
  }[];
}

export interface GetPostBody {
  username: string;
  withFriends: boolean;
}

export const getPosts = async (params: GetPostBody) =>
  http.get(`post/${params?.username}/${params?.withFriends}`).then((res) => res.data);

// ----------------------------------------------DELETE POST----------------------------------------------
export interface DeletePostBody {
  post_id: number;
}

export const deletePost = async (params: DeletePostBody) =>
  http.delete(`post/${params?.post_id}`).then((res) => res.data);

// ----------------------------------------------LIKE POST----------------------------------------------

export interface LikePostResponse {
  post_id: number;
  post_likes: number;
}

export interface LikePostBody {
  post_id: number;
}

export const likePost = async (params: LikePostBody) =>
  http.post(`post/like/${params?.post_id}`).then((res) => res.data);

// ----------------------------------------------COMMENT POST----------------------------------------------

export interface CommentPostResponse {
  id: number;
  post_id: number;
  user_id: string;
  content: string;
  video: string;
  photo: string;
  created_at: string;
  updated_at: string;
}
export interface CommentPostBody {
  post_id: number;
  content: string;
}

export const commentPost = async (params: CommentPostBody) =>
  http.post(`post/comment/${params?.post_id}`, params).then((res) => res.data);
