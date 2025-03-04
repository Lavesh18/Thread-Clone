import { fetchUser, getActivity } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

const Page = async() => {

  const user = await currentUser();

  if (!user) return null;

  const userInfo = await fetchUser(user?.id);

  if (!userInfo?.onboarded) redirect("/onboarding");

  //getActivity

  const activity = await getActivity(userInfo._id);
  return (
    <section>
      <h1 className="head-text mb-10">Activity</h1>
      <section className="mt-10 flex flex-col gap-5">
        {
          activity.length > 0 ?(
            <>
            {
                activity.map((activity)=>(
                  <Link key={activity._id} href={`/thread/${activity.parentId}`}>
                    <article className="activity-card">
                    <Image src={activity.author.image} width={20} height={20} alt="profile pic" className="rounded-full object-cover"/>
                    <p className="!text-base-regular text-light-1"><span className="mr-1 text-primary-500">{activity.author.username}</span>{" "}
                    replied to your thread
                    </p>
                    </article>
                  </Link>
                ))
            }
            </>
          ):(<p className="!text-base-regular text-light-3"> 
            No Activity Yet
          </p>)
        }
      </section>
    </section>
  );
};

export default Page;
