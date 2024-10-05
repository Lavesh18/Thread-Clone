import { fetchUserPosts } from '@/lib/actions/user.actions'
import { redirect } from 'next/navigation'

import React from 'react'
import ThreadCard from '../cards/ThreadCard'

interface THREADSTABPROPS{
    currentUserId:string
accountId:string
accountType:string
                        
}

const ThreadsTab = async ({currentUserId,accountId,accountType}:THREADSTABPROPS) => {
    let result = await fetchUserPosts(accountId);

    if (!result) redirect('/')
  return (
    <section className='mt-9 flex- flex-col gap-10'>
        {result?.threads.map((thread:any)=>(
             <ThreadCard
             key={thread._id}
             id={thread._id}
             currentUserId={currentUserId}
             parentId={thread.parentId}
             content={thread.text}
             author={accountType === 'User' ? {username:result.username,image:result.image,id:result.id}:{username:thread.author.username,image:thread.author.image,id:thread.author.id}} // TODO
             community={thread.community}
             createdAt={thread.createdAt}
             comments={thread.children}
             isComment
           />
        ))}
    </section>
  )
}

export default ThreadsTab