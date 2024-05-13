'use client'
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import UserNavigation from "@/components/layouts/UserNavigation"
import Link from "next/link";
import { MdDelete } from "react-icons/md";
import toast from 'react-hot-toast';

export default function Users() {
    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated(){
          redirect("/auth/signIn?callbackUrl=/profile")
        }
    })

    const [users, setUsers] = useState([])

      // console.log(session)
    
    async function loadUsers() {
    if(session?.user.isAdmin) {
        const res = await fetch("/api/users/user")

        if (res.ok){
            const response = await res.json()
            // console.log(response)
            setUsers(() => response)
        }
    }
    }




    async function handleAdminChange(e, id) {
        
        e.preventDefault()
        if (window.confirm("Do you really want to delete the user?")){
          const loadingToastId = toast.loading('Updating the profile picture')
        const foundUser = users.find((user) => user._id === id);
        // console.log('Initial', foundUser)
        foundUser.admin = e.target.value
        // console.log('Final', foundUser)
        const res = await fetch("/api/users/user", {
            method: "PATCH",
            body: JSON.stringify(foundUser),
            headers: { "Content-Type": "application/json" }
        })

        if(res.ok) {
            const response = await res.json()
            toast.remove(loadingToastId)
            toast.success('Successfully updated user profile!')
            // console.log(response)
        }else {
            toast.remove(loadingToastId)
            toast.error('Error updating user profile!')
        }
      }
    }

    async function handleUserDelete(e, id) {
        e.preventDefault()
        if (window.confirm("Do you really want to delete the user?")){
        const loadingToastId = toast.loading('Updating the profile picture')
        const foundUser = users.find((user) => user._id === id);
        const filteredUser = users.filter((user) => user._id !== id)
        const res = await fetch("/api/users/user", {
            method: "DELETE",
            body: JSON.stringify(foundUser),
            headers: { "Content-Type": "application/json" }
        })

        if(res.ok) {
            const response = await res.json()
            toast.remove(loadingToastId)
            toast.success('Successfully deleted user!')
            console.log(response)
            setUsers((prev) => filteredUser)
        }else {
            toast.remove(loadingToastId)
            toast.error('Error deleting user!')
        } 
    }
    }
    
      useEffect(()=>{
        if(status === 'authenticated') {
            loadUsers()
        }
    },[status])
      
  return (
    <div className="mb-80">
    <UserNavigation isAdmin={session?.user.isAdmin}/>
      
      <div className='flex flex-col mb- my-12 justify-around w-5/6 mx-auto py-8
                      bg-gray-100 shadow-md shadow-gray-200 hover:shadow-lg
                      hover:shadow-gray-400 transition ease-in-out px-1'>
        <div className='flex justify-around my-2'>
          <p className='text-lg font-medium w-16 md:w-20 lg:w-40 border-b-2 border-green-700'>Name</p>
          <p className='text-lg font-medium w-16 md:w-20 lg:w-40 border-b-2 border-green-700'>Email</p>
          <p className='text-lg font-medium w-16 md:w-20 lg:w-40 border-b-2 border-green-700'>Role</p>
          <p className='text-lg font-medium w-16 md:w-20 lg:w-40 border-b-2 border-green-700'>ID</p>
          <p className='text-lg font-medium w-16 md:w-20 lg:w-40 border-b-2 border-green-700'>Delete</p>
        </div>
        {users.length > 0 && users.map((user) => (
                <div key={user._id} className='flex justify-around my-2'>
                    <p className='w-16 md:w-20 lg:w-40'>{user.name}</p>
                    <p className='w-16 md:w-20 lg:w-40 text-ellipsis overflow-hidden'>{user.email}</p>
                    <div className='w-16 md:w-20 lg:w-40'>
                    <select name="admin" id="admin" value={user.isAdmin} onChange={(e) => handleAdminChange(e, user._id)}
                           className="w-full rounded-lg p-1">
                       <option value={user.admin ? true : false}>{user.admin ? 'Admin' : 'User'}</option>
                       <option value={user.admin ? false : true}>{user.admin ? 'User' : 'Admin'}</option>
                    </select>
                    </div>
                    <p className='w-16 md:w-20 lg:w-40 text-ellipsis overflow-hidden'>{user._id}</p>
                    <div className='w-16 md:w-20 lg:w-40'>
                      <MdDelete  onClick={(e) => handleUserDelete(e, user._id)} className="text-xl hover:scale-105
                               cursor-pointer transition ease-in-out text-red-700"/>
                    </div>
                </div>
            ))}
      </div>
    </div>
  )
}
