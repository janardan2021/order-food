'use client'
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import Link from "next/link";
import UserNavigation from "@/components/layouts/UserNavigation"

export default function Orders() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated(){
      redirect("/auth/signIn?callbackUrl=/profile")
    }
  })

  const [orders, setOrders] = useState([])

  // console.log(session)

  async function loadOrders() {
    const res = await fetch("/api/users/orders")

    if (res.ok){
      const response = await res.json()
      console.log(response)
      setOrders(() => response)
    }
  }

  useEffect(()=>{
    if(status === 'authenticated') {
        loadOrders()
    }
},[status])
  
  return (
    <div className="h-dvh">
      <UserNavigation isAdmin={session?.user.isAdmin}/>
      <div className='flex flex-col my-12 justify-around  w-5/6 mx-auto py-8
                      bg-gray-100 shadow-md shadow-gray-200 hover:shadow-lg
                      hover:shadow-gray-400 transition ease-in-out'>
        <div className='flex justify-around my-2'>
          <p className='text-lg font-medium w-20 lg:w-40 border-b-2 border-green-700'>Name</p>
          <p className='text-lg font-medium w-20 lg:w-40 border-b-2 border-green-700'>Order ID</p>
          <p className='text-lg font-medium w-20 lg:w-40 border-b-2 border-green-700'>Paid</p>
          <p className='text-lg font-medium w-20 lg:w-40 border-b-2 border-green-700'>Delivered</p>
          <p className='text-lg font-medium w-20 lg:w-40 border-b-2 border-green-700'>Details</p>
        </div>
        {orders.length > 0 && orders.map((order, index) => (
                <div key={index} className='flex justify-around my-2'>
                    <p className='w-20 lg:w-40'>{order.name}</p>
                    <p className='w-20 lg:w-40 text-sm text-ellipsis overflow-hidden'>{order._id}</p>
                    <p className={`w-20 lg:w-40 ${order.isPaid ? 'text-green-700' : ''}`}>{order.isPaid ? 'Yes' : 'No'}</p>
                    <p className={`w-20 lg:w-40 ${order.isDelivered ? 'text-green-700' : ''}`}>{order.isDelivered ? 'Yes' : 'No'}</p>
                    <p className="w-2 lg:w-40">
                    <Link href={`/orders/${order._id}`} className="bg-green-600 text-white px-4 py-1
                            rounded-lg hover:bg-green-700 hover:shadow-md transition ease-in-out">Details</Link>
                    </p>
                    
                    
                </div>
            ))}
      </div>
    </div>
  )
}
