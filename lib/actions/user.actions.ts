"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import Thread from "../models/thread.model";
import { FilterQuery, model, SortOrder } from "mongoose";

interface UPDATEUSERPROPS {
  userId: string;
  username: string;
  name: string;
  image: string;
  bio: string;
  path: string;
}

interface SEARCHPARAMSPROPS {
  userId: string;
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}

export async function updateUser({
  userId,
  username,
  name,
  image,
  bio,
  path,
}: UPDATEUSERPROPS): Promise<void> {
  connectToDB();

  try {
    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        image,
        bio,
        onboarded: true,
      },
      {
        upsert: true,
      }
    );

    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error: any) {
    console.log(error);

    throw new Error(`Failed to create/update User: ${error.message}`);
  }
}

export async function fetchUser(userId: string) {
  try {
    connectToDB();

    return await User.findOne({ id: userId });
    // .populate({
    //   path:'communities',
    //   model:Community
    // })
  } catch (error: any) {
    throw new Error(`Failed to fetch user : ${error.message}`);
  }
}

export async function fetchUserPosts(userId: string) {
  try {
    connectToDB();
    //TODO populate Community

    //Find all threads authored by the user with the given userId
    const threads = User.findOne({ id: userId }).populate({
      path: "threads",
      model: Thread,
      populate: {
        path: "children",
        model: Thread,
        populate: {
          path: "author",
          model: User,
          select: "name image id",
        },
      },
    });

    return threads;
  } catch (error: any) {
    throw new Error(`Failed to fetch user posts : ${error.message}`);
  }
}

export async function fetchAllUsers({
  userId,
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: SEARCHPARAMSPROPS) {
  try {
    connectToDB();

    const skipAmount = (pageNumber - 1) * pageSize;

    const regex = new RegExp(searchString, "i");

    const query:FilterQuery<typeof User> = {
      id:{$ne:userId}
    }

    if(searchString.trim() !== ''){
      query.$or = [
        {username:{$regex:regex}}
      ]
    }


    const sortOptions = {createdAt:sortBy};
    const userQuery = User.find(query)
    .sort(sortOptions)
    .skip(skipAmount)
    .limit(pageSize);


    const totalUserCount = await User.countDocuments(query);

    const users = await userQuery.exec();
    const isNext = totalUserCount> skipAmount + users.length;

    return {users,isNext}
  } catch (error:any) {
    throw new Error(`Failed to fetch the users ${error.message}`)
  }
}


export async function getActivity(userId:string){
  try {
    connectToDB();

    //find all the threads created by th user
    const userThreads = await Thread.find({author:userId});


    //collect all the child threads ids (replies) from the 'children 

    const childThreadIds = userThreads.reduce((acc,userThread)=>{
      return acc.concat(userThread.children);
      
    },[]) 

    const replies = await Thread.find({
      _id:{$in:childThreadIds},
      author:{$ne:userId}
    }).populate({
      path:'author',
      model:User,
      select: 'username image _id'
    })


    return replies;

  } catch (error:any) {
    throw new Error(`Failed to fetch activity: ${error.message}`)
  }
}