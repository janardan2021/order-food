"use client"
import {produce} from 'immer'
import { CartContext } from "@/components/CartContextProvider.js";
import { useContext, useEffect, useState } from "react";
import { MdDeleteOutline } from "react-icons/md";

import Link from "next/link";

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

function itemTotalPrice (item) {
  const total = addDecimals(( item.menuSize.price + 
                                (item.menuAddOns.length > 0 ?
                                 item.menuAddOns.reduce((acc, addOn) => acc + addOn.price, 0) : 0 )
                                 )
                               * item.menuQty )
  return total
}

export default function Cart() {
  const {state, dispatch} = useContext(CartContext)
  const [cart, setCart] = useState(null)
  const [cartIsChanged , setCartIsChanged] = useState(true)

  // console.log(cart)

  function changeQty(e, index){
    const updatedCart =  produce(cart, draft => {
      draft.cartItems[index].menuQty = e.target.value
     })
     localStorage?.setItem('order-food-cart', JSON.stringify(updatedCart))
     dispatch({type:'UPDATECART', payload: updatedCart})
     setCart(updatedCart)
  }

 function deleteItem(e, id) {
  if (window.confirm("Do you really want to delete the user?")){
    dispatch({type:'REMOVEFROMCART', payload: id})
    setCartIsChanged(true)
  }
 }

 function loadCart() {
  setCart(() => state)
  setCartIsChanged(false)
 }
  
  useEffect(()=>{
     if (cartIsChanged) {
      loadCart()
     }
  },[cartIsChanged])

  return (
    <div className='h-dvh'>
    
       {cart && (

        <div className='flex flex-col around my-12 w-full sm:w-5/6 mx-auto py-8 px-2
                      bg-gray-100 shadow-md shadow-gray-200 hover:shadow-lg
                      hover:shadow-gray-400 transition ease-in-out'>
          <p className='text-2xl font-medium my-4 border-b-2 border-green-700 w-fit mx-auto'>
            Your menu items in the cart
          </p>
          <div className='flex justify-around'>
            <p className='text-lg font-medium w-20 lg:w-40'>Item</p>
            <p className='text-lg font-medium w-20 lg:w-40'>Size</p>
            <p className='text-lg font-medium w-20 lg:w-40'>Add Ons</p>
            <p className='text-lg font-medium w-20 lg:w-40'>Quantity</p>
            <p className='text-lg font-medium w-20 lg:w-40'>Price</p>
            <p className='text-lg font-medium w-20 lg:w-40'>Delete</p>
          </div>
          {cart.cartItems.map((cartItem, index) => (
            <div key={index} className="flex justify-around my-2">
              <p className='w-20 lg:w-40'>{cartItem.menuName}</p>
              <p className='w-20 lg:w-40'>{cartItem.menuSize.size}</p>
              {cartItem.menuAddOns.length === 0 ? <p className='w-20 lg:w-40'>None</p> : (
                <div className='w-20 lg:w-40'>
                  {
                    cartItem.menuAddOns.map((addOn, index) => (
                      <p key={index} >{addOn.addOn}</p>
                    ))
                  }
                </div>
              )}
              
              <div className='w-20 lg:w-40 '>
              <input type="number"  name="modalMenuQty" min="1" max="100" 
                       value={cartItem.menuQty} onChange={(e) => changeQty(e,index)}
                       className="border-2 rounded-lg border-green-700 px-2 py-1"/>
              </div>
              
              <p className='w-20 lg:w-40 text-green-700'>${itemTotalPrice(cartItem)}</p>
              <div className='w-20 lg:w-40 text-red-700 text-2xl cursor-pointer hover:scale-105
                            transition ease-in-out bg-gray-200 rounded-lg flex justify-center
                            items-center' onClick={(e) => deleteItem(e, cartItem._id)}>
                <MdDeleteOutline />
              </div>
            </div>
          ))}
          <div className='flex space-x-6 my-6 w-fit mx-auto'>
            <p className='text-lg font-medium'>Total price</p>
            <p className='text-lg font-medium text-green-700'>${totalPrice(cart)}</p>
          </div>
          {totalPrice(cart) > 0 ? 
                <button className='w-fit mx-auto'>
                 <Link href="/auth/signIn?redirectUrl=/checkout" >Go to checkout</Link>
               </button> : <p></p>}
        </div>

       )}
   
    </div>
  )
}
