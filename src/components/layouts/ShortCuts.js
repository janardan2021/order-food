'use client'
import {Link} from 'react-scroll'

export default function ShortCuts() {
  return (
    <div className="hidden md:block flex-col items-center justify-center top-[30%] right-5 fixed 
                    py-2 px-4 bg-green-700 rounded-3xl w-26 ">
         <p className="my-8 font-medium text-md text-center bg-white text-green-700
                      rounded-xl px-2 py-1 hover:scale-105 transition ease-in-out cursor-pointer">
                <Link to="hero" smooth duration={500}>Home</Link>
        </p>
         <p className="my-8 font-medium text-md text-center bg-white text-green-700
                      rounded-xl px-2 py-1 hover:scale-105 transition ease-in-out cursor-pointer">
                <Link to="menu" smooth duration={500}>Menu</Link>
        </p>
         <p className="my-8 font-medium text-md text-center bg-white text-green-700
                      rounded-xl px-2 py-1 hover:scale-105 transition ease-in-out cursor-pointer">
                <Link to="about" smooth duration={500}>About</Link>
        </p>
         <p className="my-8 font-medium text-md text-center bg-white text-green-700
                      rounded-xl px-2 py-1 hover:scale-105 transition ease-in-out cursor-pointer">
                <Link to="contact" smooth duration={500}>Contact</Link>
        </p>
    </div>
  )
}
