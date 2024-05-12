
import RightArrow from "../icons/RightArrow";
import Link from "next/link";
import Image from 'next/image'


export default function Hero() {
  return (
    <div name='hero' className="grid grid-cols-1 lg:grid-cols-2 space-x-4 my-12 w-4/5 mx-auto">

       <div className="px-4">
       <p className="text-4xl font-medium my-4 text-green-700">Welcome to our flavorful world of supreme food! </p>
       <div className="bg-gray-100 rounded-lg p-2 shadow-md shadow-gray-200">
       <p className="text-lg my-4 px-4">
       We take pride in crafting the perfect blend of crispy, succulent chicken
       nestled between soft, toasted buns. Each bite is a symphony of taste and 
       texture, from the satisfying crunch to the burst of savory goodness.
       </p>
       <p className="text-lg my-4 px-4">
       Indulge in the ambiance of our inviting restaurant space. Immerse yourself 
       in the warmth of our hospitality as you savor each bite of our delectable 
       dishes. Our restaurant
       provides the perfect setting for memorable moments shared with loved ones.
       </p>
       <p className="text-lg my-4 px-4">
       Can not make it to our restaurant? No problem! Enjoy the same delightful 
       flavors in the comfort of your home with our hassle-free delivery service.
       </p>
       </div>

       <div className="flex gap-4">
        <Link href={'/menu'}>
        <button className="flex gap-4">
            Order now
            <RightArrow />
        </button>
        </Link>
        <Link href={'/about'}>
        <button className="flex gap-4">
            About us
            <RightArrow />
        </button>
        </Link>
       </div>
       </div>

      <div className="flex justify-center items-center gap-2 overflow-hidden w-full">
       <div className="flex flex-col gap-1 ">
       <div className="relative h-52 w-52" >
         <Image src="/burger.jpg" fill={true} sizes="(min-width: 768px) 100vw"  alt='menu item' 
                 style={{objectFit: "cover"}} className="rounded-lg"/>
       </div>
        {/* <img src="/burger.jpg" className="object-fill h-52 w-52 rounded-lg"/> */}
        
        <div className="relative h-52 w-52" >
         <Image src="/chicken.jpg" fill={true} sizes="(min-width: 768px) 100vw"  alt='menu item' 
                 style={{objectFit: "cover"}} className="rounded-lg"/>
       </div>
        {/* <img src="/chicken.jpg" className="object-fill h-52 w-52 rounded-lg"/> */}
        </div >
        <div className="flex flex-col gap-1">
        <div className="relative h-52 w-52" >
         <Image src="/salad.jpg" fill={true} sizes="(min-width: 768px) 100vw"  alt='menu item' 
                 style={{objectFit: "cover"}} className="rounded-lg"/>
       </div>
        {/* <img src="/salad.jpg" className="object-fill h-52 w-52 rounded-lg"/> */}
        <div className="relative h-52 w-52" >
         <Image src="/sandwich.jpg" fill={true} sizes="(min-width: 768px) 100vw"  alt='menu item'  
                 style={{objectFit: "cover"}} className="rounded-lg"/>
       </div>
        {/* <img src="/sandwich.jpg" className="object-fill h-52 w-52 rounded-lg"/> */}
        </div>
       </div>

    </div>
  )
}