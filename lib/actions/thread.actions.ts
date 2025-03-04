"use server";

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import { updateUser } from "./user.actions";

interface ThreadParams {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}
export async function createThread({
  text,
  author,
  communityId,
  path,
}: ThreadParams) {
  connectToDB();

  const createdThread = await Thread.create({
    text,
    author,
    community: null,
  });

  await User.findByIdAndUpdate(author, {
    $push: { threads: createdThread._id },
  });

  revalidatePath(path);
}

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
  connectToDB();

  //calculate the number of post to skip in the pagination
  const skipAmount = (pageNumber - 1) * pageSize;

  //Fetch the post that has no parents (that means without comments)
  const postQuery = Thread.find({ parentId: { $in: [null, undefined] } })
    .sort({ createdAt: "desc" })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({ path: "author", model: User })
    .populate({
      path: "children",
      populate: {
        path: "author",
        model: User,
        select: "_id name parentId image",
      },
    });



    const totalPostCount = await Thread.countDocuments({
        parentId: { $in: [null, undefined] }
    });

    const posts = await postQuery.exec();

    const isNext = totalPostCount > skipAmount + posts.length;

    return {posts,isNext}
}


export async function fetchThreadById(id:string){
  connectToDB();

  try {
    
    const thread = await Thread.findById(id).populate({
      path:'author',
      model:User,
      select: "_id id name image"
    }).populate({
      path:'children',
      populate:[
        {
          path:'author',
          model:User,
          select:"_id id name parentId image"
        },
        {
          path:'children',
          model:Thread,
          populate:{
            path:'author',
            model:User,
            select:"_id id name parentId image"
          }
        }
      ]
    }).exec();
    return thread
  } catch (error:any) {
    throw new Error(`Error frtching thread: ${error.message}`)
  }
}

export async function addCommentToThread(threadId:string,commentText:string,
  userId:string,path:string
) {
    connectToDB();
    try {
      // Find the orignal thread by its id

      const orignalThread = await Thread.findById(threadId);


      if(!orignalThread){
        throw new Error("Thread not found")
      }

      const commentThread = new Thread({
        text:commentText,
        author:userId,
        parentId:threadId,
      })

      //Save the new thread

      const saveCommentThread = await commentThread.save();
      orignalThread.children.push(saveCommentThread._id);

      await orignalThread.save();

      revalidatePath(path)
    } catch (error:any) {
      throw new Error (`Error adding to comment to thread: ${error.message}`)
    }
}