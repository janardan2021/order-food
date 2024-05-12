"use client"
import {produce} from 'immer'
import Link from "next/link";
import { CartContext } from "@/components/CartContextProvider.js";
import { useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react"
import toast from 'react-hot-toast';
// import Stripe from "stripe";
// import { loadStripe } from '@stripe/stripe-js';

// const stripe = new Stripe(process.env.STRIPE_PK);
// const asyncStripe = loadStripe(String(process.env.STRIPE_PK));



const addDecimals = (num) => {
  return Number((Math.round(num * 100) / 100).toFixed(2))
}

function totalPrice (cart) {
   const total = addDecimals(cart.cartItems.reduce((acc, cartItem) => acc + 
                         ( cartItem.menuSize.price + 
                            (cartItem.menuAddOns.length > 0 ?
                              cartItem.menuAddOns.reduce((acc, addOn) => acc + addOn.price, 0) : 0) )
                          * cartItem.menuQty, 0) ) 
   return total           
}

// const map1 = array1.map((x) => x * 2);
// ['a', 'b', 'c'].reduce((a, v) => ({ ...a, [v]: v}), {}) 
// Object.assign(target, source)

function getCheckoutCart(cart) {
  const checkoutCart = cart.cartItems.map((cartItem) => ({
    menuName: cartItem.menuName,
    menuQty: cartItem.menuQty,
    menuSize: cartItem.menuSize,
    menuAddOns: cartItem.menuAddOns,
    // menuAddOns: cartItem.menuAddOns.length > 0 ? cartItem.menuAddOns.reduce((acc, addOn, index) => ({...acc, [index]: {...addOn}}), {}) : {},
    addOnsTotal: cartItem.menuAddOns.length > 0 ? cartItem.menuAddOns.reduce((acc, addOn) => (acc + addOn.price), 0) : 0,
    menuItemTotal: addDecimals(cartItem.menuSize.price 
               + (cartItem.menuAddOns.length > 0 ? cartItem.menuAddOns.reduce((acc, addOn) => (acc + addOn.price), 0) : 0))
   }))
  // const total = totalPrice(cart)
return checkoutCart
}


export default function Checkout() {
    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated(){
          redirect("/auth/signIn?callbackUrl=/profile")
        }
      })
    // console.log(session)
    const [addressLoaded, setAddressLoaded] = useState(false)
    const {state, dispatch} = useContext(CartContext)
    const [cart, setCart] = useState(null)
    const [cartLoaded, setCartLoaded] = useState(false)
    const [subTotal, setSubTotal] = useState(0)
    const [deliveryFee, setDeliveryFee] = useState(10)

    const [address, setAddress] = useState({
        street: '',
        city: '',
        postalCode:'',
        state: '',
        country: ''
      })

      async function loadUserAddress() {
        const res = await fetch("/api/users/address")
  
        if (res.ok){
          const response = await res.json()
          // console.log(response)
          setAddress((prevState) => ({
            ...prevState,
            city: response.city,
            country: response.country,
            postalCode: response.postalCode,
            street: response.street,
            state: response.state
        }))
          setAddressLoaded(true)
        }
      }

    useEffect(()=>{
        setCart(() => state)
        setCartLoaded(true)
        loadUserAddress()
    },[state])

    useEffect(()=>{
        if (cartLoaded) {
            const calulatedTotal = totalPrice(cart)
            setSubTotal(calulatedTotal)
        }
    },[cartLoaded, cart])


async function processPayment(e) {
  e.preventDefault()
  // const stripe = await asyncStripe;
  const checkoutCart = getCheckoutCart(cart)
  console.log(cart)
 if(addressLoaded){
  const res = await fetch("/api/checkout", {
    method: "POST",
    body: JSON.stringify({checkoutCart, address}),
    headers: { "Content-Type": "application/json" }
})

if(res.ok) {
    const response = await res.json()
    dispatch({type:'CLEARCART'})
    // const result = await stripe.redirectToCheckout({
    //   sessionId: response.id,
    // });
    window.location.assign(response.url)
    console.log('This is result from stripe redirect',result)
    
  } else {
      console.log('Something went wrong')
  }
 }else {
  toast.error('Missing Address information. Please update profile')
 }
}

//   console.log('Your cart',cart)
//   console.log("Your total", total)
  return (
    <div className='h-dvh '>
    <div className='my-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-4/5 mx-auto gap-6'>
      {session && status === 'authenticated' && (
        <div className='bg-gray-100 shadow-md shadow-gray-200 hover:shadow-lg
                        hover:shadow-gray-400 transition ease-in-out px-6 py-4'>
            <p className='text-2xl font-medium my-4 border-b-2 border-green-700'>User Information</p>
            <p className='font-medium my-2'>{session.user.name}</p>
            <p className='font-medium my-2'>{session.user.email}</p>
        </div>
      )}

      <div className='bg-gray-100 shadow-md shadow-gray-200 hover:shadow-lg
                        hover:shadow-gray-400 transition ease-in-out px-6 py-4'>
        <p className='text-2xl font-medium my-4 border-b-2 border-green-700'>Delivery Address</p>
        <p className='font-medium my-2'>{address.street}</p>
        <div className='flex gap-3 font-medium my-2'>
        <p>{address.city}</p>
        <p>{address.postalCode}</p>
        </div>
        <div className='flex gap-3 font-medium y-2'>
        <p>{address.state},</p>
        <p>{address.country}</p>
        </div>
      </div>

      <div className='bg-gray-100 shadow-md shadow-gray-200 hover:shadow-lg
                        hover:shadow-gray-400 transition ease-in-out px-6 py-4'>
        <p className='text-2xl font-medium my-4 border-b-2 border-green-700'>Payment Details</p>
        <p className='font-medium my-2'>Sub total: <span className='text-green-700'>${subTotal}</span></p>
        <p className='font-medium my-2'>Delivery fee: <span className='text-green-700'>${deliveryFee}</span></p>
        <p className='font-medium my-2'>Total: <span className='text-green-700'>${addDecimals(subTotal + deliveryFee)}</span></p>
        <button onClick={processPayment}>Pay now</button>
      </div>
    </div>
    </div>
  )
}
