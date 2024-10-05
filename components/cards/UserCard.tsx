"use client"

import Image from 'next/image';
import React from 'react'
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';


interface SearchUserPROPS{
  id:string,
  username:string;
  imgUrl:string;
  personType:string
}
const UserCard = ({id,username,imgUrl,personType}:SearchUserPROPS) => {

  const router = useRouter();
  return (
   <article className='user-card'>

    <div className='user-card_avatar'>
      <Image
      src={imgUrl}
      alt='logo'
      height={48}
      width={48}
      className='rounded-full'
      />
      <div className='flex-1 text-ellipsis'>
        <p className='text-small-medium text-gray-500'>@{username}</p>
      </div>
    </div>
    <Button className='user-card_btn' onClick={()=>router.push(`/profile/${id}`)}>
      View 
    </Button>
   </article>
  )
}

export default UserCard