"use client"

import { CartContext } from "@/components/CartContextProvider.js";
import { useContext, useEffect, useState } from "react";
import { FaCartPlus } from "react-icons/fa";

import Link from "next/link";
// const useGetContext = () => {
//     const {state} = useContext(CartContext)
//     return {state};
//   };

export default function CartIcon() {
    const {state} = useContext(CartContext)


    const [numItems, setNumItems] = useState(0)

    function changeState(){
        setNumItems(() => state?.cartItems?.length)  
    }
    
    useEffect(()=>{
       changeState(state)
    },[state, changeState])

  return (
    <div className="flex relative pt-1 ">
        
        <Link href={'/cart'} >
          <FaCartPlus className="hover:scale-110 transition ease-in-out "/>
        </Link> 
        <div className="absolute bottom-3 md:bottom-4 right-4 md:right-5 px-2 text-green-700 bg-white
                         rounded-full flex items-center justify-center font-normal text-sm">
                          {numItems === 0 ? '' : numItems}
                          </div>
    </div>
  )
}
