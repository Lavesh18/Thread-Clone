"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";

import * as z from "zod";
import { commentValidation } from "@/lib/validations/thread";
import Image from "next/image";
import { addCommentToThread } from "@/lib/actions/thread.actions";
// import { createThread } from "@/lib/actions/thread.actions";



interface CommentProps{
    threadId:string,
    currentUserImg:string,
    currentUserid:string,

}
const Comment = ({threadId,currentUserImg,currentUserid}:CommentProps) => {
    
  const router = useRouter();
  const pathname = usePathname();

  const form = useForm({
    resolver: zodResolver(commentValidation),
    defaultValues: {
      thread:"",
    },
  });

    const onSubmit = async(values:z.infer<typeof commentValidation>) =>{
      await addCommentToThread(threadId,values.thread,JSON.parse(currentUserid),pathname)

      form.reset();
     }

  return (
    <Form {...form}>
<form onSubmit={form.handleSubmit(onSubmit)}  className="comment-form">

<FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className='flex items-center w-full'>
            <FormLabel>
              <Image src={currentUserImg} alt="Profile_Img" height={48} width={48} className="rounded-full object-cover"/> 
            </FormLabel>
            <FormControl className='border-none bg-transparent'>
              <Input
              type='text'
              placeholder="Comment...."
                className='no-focus text-light-1 outline-none'
                {...field}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <Button type='submit' className="comment-form_btn" >
        Reply
      </Button>
  </form>

  
  </Form>
  )
}

export default Comment