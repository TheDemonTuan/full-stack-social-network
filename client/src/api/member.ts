// ----------------------------------------------GET MEMBER----------------------------------------------

import http from "@/lib/http";

export interface GetMemberBody {
  username: string;
}

export const getMember = async (params: GetMemberBody) => http.get(`member/${params?.username}`).then((res) => res.data);
