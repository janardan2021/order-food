'use client'
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import Link from "next/link";
import UserNavigation from "@/components/layouts/UserNavigation"

export default function OrderDetails({params}) {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated(){
      redirect("/auth/signIn?callbackUrl=/profile")
    }
  })
  // console.log(session)
 const [order, setOrder] = useState(null)
 const [isPaid, setIsPaid] = useState(false)
 const [isDelivered, setIsDelivered] = useState(false)

 async function markAsDeliverd(e) {
  e.preventDefault()
  // console.log('Marking as delivered')
  const res = await fetch(`/api/users/orders/${order._id}`, {
      method: "PATCH",
      body: JSON.stringify({orderId: order._id}),
      headers: { "Content-Type": "application/json" }
  })

  if(res.ok) {
      setIsDelivered((prev) => true)
      
  } 
 }

 async function goToCheckout(e) {
  e.preventDefault()
  const res = await fetch(`/api/checkout/${order._id}`);
  if (res.ok) {
    const response = await res.json()
    window.location.assign(response.url)
  }
 }

  async function loadOrder() {
    const res = await fetch(`/api/users/orders/${params.orderID}`)
   if (res.ok){
      const response = await res.json()
      // console.log(response)
      setOrder(() => response)
      setIsPaid(response.isPaid)
      setIsDelivered(response.isDelivered)
    }
  }

  useEffect(()=>{
    if(status === 'authenticated') {
        loadOrder()
    }
},[status])

// console.log(order)

  return (
    <div className="mb-96">
      <UserNavigation isAdmin={session?.user.isAdmin}/>
    <div className="w-4/5 md:w-3/5 mx-auto bg-gray-100 shadow-md shadow-gray-200
                    my-12 p-4 rounded-lg">
      <p className="text-2xl font-medium my-4 text-center">Details about order: 
        <span className="text-green-700"> {params.orderID}</span>
      </p>
      {order && (
        <div>
           <div className="flex justify-center space-x-4 p-2 flex-wrap">
              <p className="font-medium">Order ID: {order._id}</p>
              <p className="font-medium">User: {order.name}</p>
              <p className="font-medium">Email: {order.email}</p>
           </div>
           <div>
              <p className="text-lg font-medium text-center my-4" >Ordered Items</p>
              <div>
                {order.menuItems.map((menuItem, index) => (
                  <div key={index} className="bg-gray-100 shadow-md shadow-gray-300 p-2 my-1">
                    <p className="text-lg font-medium text-green-700 text-center my-2">{menuItem.menuName}</p>
                    <div className="flex justify-center space-x-4">
                      <p>Quantity: {menuItem.menuQty}</p>
                      <p>Size: {menuItem.menuSize.size}</p>
                      <p>Item Price: <span className="text-green-700">${menuItem.menuSize.price}</span></p>
                    </div>
                    <div className="">
                      <p className="font-medium text-center mt-4">Addons</p>
                      <div className="flex justify-center space-x-4 flex-wrap">
                      {menuItem.menuAddOns.map((menuAddOn, index) => (
                        <div key={index}>
                             <p>{menuAddOn.addOn}: <span className="text-green-700">${menuAddOn.price}</span></p>
                        </div>
                      ))}
                      </div>
                    </div>
                    <p className="font-medium text-center mb-2">AddOns total: <span className="text-green-700">${menuItem.addOnsTotal}</span></p>
                  </div>
                ))}
              </div>
           </div>
           <p className="text-lg font-medium text-center my-4">Total: <span className="text-green-700">${order.total}</span></p>
           <div className="flex justify-center space-x-8">
            {isPaid ? (
              <div className="my-4 py-2 px-4 text-center bg-green-600 text-white rounded-lg" disabled={true}>Payment Successful</div>
            ) : (
              <div className="my-4 py-2 px-4 text-center bg-sky-600 text-white rounded-lg
               hover:bg-sky-700 cursor-pointer shadow-md hover:shadow-gray-500 transition 
                 ease-in-out" onClick={goToCheckout}>Pay now</div>
            )}
           {/* <button disabled={isPaid ? true : false}
                   onClick={goToCheckout}>
            {order.isPaid ? 'Payment Successful' : 'Pay Now'}
           </button> */}
           {session?.user.isAdmin && isDelivered && (
            <div className="my-4 py-2 px-4 text-center bg-green-600 text-white rounded-lg" 
                 disabled={true}>Delivered</div>)
           }
           {session?.user.isAdmin && !isDelivered && (
            <div className="my-4 py-2 px-4 text-center bg-sky-600 text-white rounded-lg
                           hover:bg-sky-700 cursor-pointer shadow-md hover:shadow-gray-500 transition 
                            ease-in-out" onClick={markAsDeliverd}>Mark as delivered</div>)
           }
            {/* <button disabled={isDelivered ? true : false}
               onClick={markAsDeliverd}>
            {order.isDelivered ? 'Delivered' : 'Mark as delivered'}
            </button> */}
           
           </div>
        </div>
      )}
    </div>
    </div>
  )
}

