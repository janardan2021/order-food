
import RightArrow from "../icons/RightArrow";
import Link from "next/link";
import Image from 'next/image'


export default function Hero() {
  return (
    <div name='hero' className="flex flex-col w-4/5 mx-auto my-4">

        <p className="text-4xl font-medium my-4 text-center text-green-700">
            Welcome to our flavorful world of supreme food!
        </p>

       <div className="flex flex-col-reverse lg:flex-row w-full space-x-0 lg:space-x-2 ">

       <div className="w-full flex-col justify-center items-center lg:w-1/2
                      bg-gray-100 shadow-md rounded-lg px-2">
            <p className="text-lg mt-8 mb-6">
            We take pride in crafting the perfect blend of crispy, succulent chicken
            nestled between soft, toasted buns. Each bite is a symphony of taste and 
            texture, from the satisfying crunch to the burst of savory goodness.
            </p>
            <p className="text-lg my-6">
              Immerse yourself in the warmth of our hospitality as you savor each bite 
              of our delectable dishes. Our restaurant
              provides the perfect setting for memorable moments shared with loved ones.
            </p>
            <p className="text-lg my-6">
            Can not make it to our restaurant? No problem! Enjoy the same delightful 
            flavors in the comfort of your home with our hassle-free delivery service.
            </p>
            <div className="flex justify-around space-x-1 w-full">
              <Link href={'/menu'} className="">
              <button className="flex justify-center space-x-4 w-full">
                  <p>Order now</p>
                  <RightArrow />
              </button>
              </Link>
              <Link href={'/about'} className="">
              <button className="flex justify-center space-x-4 w-full">
                  <p>About us</p>
                  <RightArrow />
              </button>
              </Link>
            </div>
       </div>
       
       <div className="flex justify-center items-center space-x-1 px-4 w-full lg:w-1/2 mb-4 lg:mb-0">
       <div className="flex flex-col space-y-1 ">
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
        <div className="flex flex-col space-y-1">
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

    </div>
  )
}
