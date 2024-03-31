"use client";

import { AuthResponse } from "@/api/auth";
import { getMember } from "@/api/member";
import PostAdd from "@/components/Post/post-add";
import PostView from "@/components/Post/post-view";
import FriendList from "@/components/Profile/friend-list";
import FriendInteract from "@/components/Profile/friend-status";
import { useAuth } from "@/hooks/useAuth";
import { ApiErrorResponse } from "@/lib/http";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const Page = ({ params }: { params: { username: string } }) => {
  const { authData, authIsPending } = useAuth();

  const {
    data: memberData,
    error: postsError,
    isSuccess: memberIsSuccess,
    isError: postsIsError,
    isPending: memberIsPending,
    isFetching: memberIsFetching,
  } = useQuery<AuthResponse, ApiErrorResponse>({
    queryKey: ["profile"],
    queryFn: async () => getMember({ username: params?.username }),
    staleTime: 0,
    enabled: !!params?.username && !authIsPending,
  });

  if (authIsPending || memberIsPending) return <div>Loading...</div>;

  if (!memberIsPending && !memberData) return notFound();

  return (
    <div className="h-screen">
      <div className="shadow bg-white h-screen">
        {/* PROFILE HEADER */}
        <div>
          <div className="flex justify-center w-full">
            <div className="flex flex-col">
              <div
                className="md:relative bg-gray-100 md:rounded-bl-lg md:rounded-br-lg
                        bg-gradient-to-b from-gray-100 via-gray-100 to-gray-400"
                style={{ width: "940px", height: "348px" }}>
                {/* // cover photo */}
                <div className="rounded-full md:absolute top-48 inset-x-96 border-4 border-white w-40 h-40 mt-4">
                  {/* profile photo */}
                  <Image src="/logo.png" alt="Avatar" fill></Image>
                </div>
              </div>
            </div>
          </div>
          {/* // INFOS */}
          <div className="flex justify-center flex-col mt-5 mb-3.5">
            <h1 className="text-center font-bold text-3xl">
              {memberData?.first_name} {memberData?.last_name}
            </h1>
            <a href="#" className="text-center text-blue-700 font-semibold">
              Add Bio
            </a>
            <hr className="full flex self-center w-2/3 mt-2" />
          </div>
          {/* // END INFOS */}
          {/* // TABS */}
          <div className="w-full flex justify-center">
            <div className="flex justify-between mb-2.5">
              <ul className="flex px-5 py-1.5">
                <li className="px-3 font-semibold text-gray-600">
                  <a href="#">Posts</a>
                </li>
                <li className="px-3 font-semibold text-gray-600">
                  <a href="#">About</a>
                </li>
                <li className="px-3 font-semibold text-gray-600">
                  <a href="#">Friends</a>
                </li>
                <li className="px-3 font-semibold text-gray-600">
                  <a href="#">Photos</a>
                </li>
                <li className="px-3 font-semibold text-gray-600">
                  <a href="#">Story Archive</a>
                </li>
                <li className="px-3 font-semibold text-gray-600">
                  <a href="#">More</a>
                </li>
              </ul>
              <ul className="flex mb:pl-14">
                {authData?.id === memberData?.id ? (
                  <>
                    <li className="px-2 font-semibold">
                      <Link href="./story/add" className="bg-blue-600 px-5 py-2 rounded-lg text-white font-semibold">
                        <i className="bx bx-plus-circle text-xl mr-2"></i>
                        Add to Story
                      </Link>
                    </li>
                    <li className="px-2 font-semibold">
                      <Link
                        href="./profile/edit-profile"
                        className="bg-gray-200 px-5 py-2 rounded-lg text-black font-semibold hover:opacity-70">
                        <i className="bx bx-edit-alt mr-2 text-xl"></i>
                        Edit Profile
                      </Link>
                    </li>
                    <li className="px-2 font-semibold">
                      <button className="bg-gray-200 px-3 py-1 rounded-lg text-black font-semibold">...</button>
                    </li>
                  </>
                ) : (
                  <FriendInteract friend_id={memberData?.id} />
                )}
              </ul>
            </div>
          </div>
          {/* // END TABS */}
        </div>
        {/* END PROFILE HEADER */}

        {/* // CONTENT */}
        <div>
          <div className="bg-gray-100 ">
            <div className="flex justify-center h-screen">
              {/* LEFT */}
              <div>
                {/* // INTRO */}
                <div className="mr-12 mt-4">
                  <div className="p-4 shadow rounded-lg bg-white w-80" id="intro">
                    <h1 className="font-bold text-xl">Intro</h1>
                  </div>
                </div>
                {/* // END INTRO */}

                {/* // PHOTOS */}
                <div className="mr-12 mt-4">
                  <div className="p-4 shadow rounded-lg bg-white w-80" id="intro">
                    <div className="flex justify-between">
                      <h1 className="font-bold text-xl">Photos</h1>
                      <a href="#" className="text-lg text-blue-700">
                        See All Photos
                      </a>
                    </div>
                  </div>
                </div>
                {/* // END PHOTOS */}

                {/* // FRIENDS */}
                <FriendList />
                {/* // END FRIENDS */}
              </div>
              {/* END LEFT */}

              {/* // POST LIST */}
              <div className="w-2/5 flex flex-col gap-5 mt-5">
                {/* CREATE POST */}
                {authData?.id === memberData?.id && <PostAdd />}
                {/* END CREATE POST */}
                {/* POST */}
                {!memberIsFetching && <PostView username={memberData?.username} />}
                {/* END POST */}
              </div>
              {/* // END POST LIST */}
            </div>
          </div>
        </div>
        {/* // END CONTENT */}
      </div>
    </div>
  );
};

export default Page;
