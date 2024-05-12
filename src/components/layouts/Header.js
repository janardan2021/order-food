'use client'

import Link from "next/link";
import {useSession} from "next-auth/react"
import { useEffect } from "react";
// import { getServerSession } from "next-auth";
// import {options} from "@/app/api/auth/[...nextauth]/options.js"
import CartIcon from './CartIcon.js'

export default function Header() {
  const { data: session, status, update } = useSession()
  // const session = await getServerSession(options)
  // console.log(session)
  let userName = session?.user.name || session?.user.email
  if (userName && userName.includes(' ')) {
    userName = userName.split(' ')[0]
  }
  
  // useEffect(() => {
  //  update()
  // }, [])

  return (
    <header className="flex items-center justify-between bg-green-700 text-white 
                      h-20 px-6 mb-2">
        <div>
          <Link href='/' className="font-semibold lg:font-bold md:text-2xl lg:text-4xl">Order-Food</Link>
        </div>
        <div className="flex sm:font-semibold lg:text-lg lg:gap-16 md:gap-8 gap-2">
          <Link href="/" className="hover:scale-105 transition ease-in-out">Home</Link>
          <Link href="/menu" className="hover:scale-105 transition ease-in-out">Menus</Link>
          <Link href="/about" className="hover:scale-105 transition ease-in-out">About</Link>
          <Link href="/contact" className="hover:scale-105 transition ease-in-out">Contact</Link>
        </div>
        
        {session && (
           <div className="flex sm:font-semibold lg:text-lg gap-2 md:gap-4">
            <CartIcon />
            <Link href={'/profile'} className="hover:scale-105 transition ease-in-out">{userName}</Link>
            <Link href={"/auth/signOut"} className="hover:scale-105 transition ease-in-out" >SignOut</Link>
            </div>
          )}
          {/* {session && (
           <Link href={"/auth/signOut"} >Logout</Link>
          )} */}
        {!session && (
         <div className="flex sm:font-semibold lg:text-lg gap-2 md:gap-4">
          <CartIcon />
         <Link href={"/auth/signIn"} className="hover:scale-105 transition ease-in-out" >SignIn</Link>
         <Link href="/auth/register" className="hover:scale-105 transition ease-in-out" >Register</Link>
         </div>
       )}
       {/* {!session && (
         <div className="flex text-gray-500 font-semibold gap-3">
         <Link href={"/auth/signIn"} >SignIn</Link>
         <Link href="/auth/register" >Register</Link>
         </div>
       )} */}
      </header>
  )
}
