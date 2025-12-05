"use client";
import { useUser } from "@auth0/nextjs-auth0/client";

import Image from "next/image";
import Link from "next/link";
import { MdBookmark, MdPeople, MdPhoto } from "react-icons/md";

export default function ProfilePage() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <div>💀</div>;
  }

  const listItems = []; // 1. Initialize an empty array

  // 2. Use a for loop to populate the array with JSX elements
  for (let i = 0; i < 9; i++) {
    listItems.push(
      <Image
        key={i}
        src={`https://picsum.photos/id/${i + 50}/512/512`}
        alt={"User image"}
        width={512}
        height={512}
      />
    );
  }

  if (user) {
    return (
      <main>
        <div className="flex gap-10">
          <Image
            className="rounded-full"
            src={user?.picture ?? "/logo.svg"}
            alt={user.name || "User profile"}
            width={128}
            height={128}
          />
          <div>
            <h1 className="text-2xl font-bold">@{user.nickname}</h1>
            <h2>{user.email}</h2>
            <div className="flex gap-5">
              <p className="">10 posts</p>
              <p className="">1.5k followers</p>
              <p className="">0 following</p>
            </div>
            <Link href={"/"} className="text-info underline">
              www.surfbored.app
            </Link>
          </div>
        </div>
        <div className="flex gap-4">
          <button className="w-full bg-primary text-base-200 rounded-md py-2">
            Follow
          </button>
          <button className="w-full border-2 text-primary border-primary rounded-md  py-2">
            Message
          </button>
        </div>
        <div className="mx-auto">
          <div role="tablist" className="tabs tabs-border flex gap-16">
            <a role="tab" className="tab text-2xl tab-active">
              <MdPhoto />
            </a>
            <a role="tab" className="tab text-2xl">
              <MdBookmark />
            </a>
            <a role="tab" className="tab text-2xl">
              <MdPeople />
            </a>
          </div>
        </div>
        <hr className="text-border" />
        <div className="grid grid-cols-3 grid-rows-3 gap-4">
          {listItems.map((item) => item)}
        </div>
      </main>
    );
  }
  return <Link href="/auth/login">Log In</Link>;
}
