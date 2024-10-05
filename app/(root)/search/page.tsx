import UserCard from "@/components/cards/UserCard";
import { fetchAllUsers, fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

const Page = async () => {
  const user = await currentUser();

  if (!user) return null;

  const userInfo = await fetchUser(user?.id);

  if (!userInfo?.onboarded) redirect("/onboarding");

  //to fetch all the users

  const results = await fetchAllUsers({
    userId: user.id,
    searchString: "",
    pageNumber: 1,
    pageSize: 25,
  });
  return (
    <section>
      <h1 className="head-text mb-10">Search</h1>
      {/* Search Bar */}

      <div className="mt-14 flex flex-col gap-9">
        {
          results.users.length === 0? (
            <p className="no-result">No users</p>
          ):(
            <>
            {
              results.users.map((res)=>(
                <UserCard
                key={res.id}
                id={res.id}
                username = {res.username}
                imgUrl = {res.image}
                personType="User"

                />
              ))
            }
            </>
          )
        }

      </div>
    </section>
  );
};

export default Page;
