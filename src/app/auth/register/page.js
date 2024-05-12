'use client'
import { useSession } from "next-auth/react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import {useState, useEffect} from 'react'
import { useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast';
import Image from 'next/image'

export default function Register() {
  const { data: session, status } = useSession()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get('redirectUrl')
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name:''
  })
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() =>{
    if(status === 'authenticated') {
      router.refresh()
      router.push("/")}
  },[router, status])
  
  const handleChange = (e) => {
      const value = e.target.value
      const name = e.target.name
      setFormData((prevState) => ({
          ...prevState,
          [name]: value
      }))
  }

  const handleSubmit = async (e) => {
    // console.log(formData)
      e.preventDefault()
      const loadingToastId = toast.loading('Registration in process!')
      setErrorMessage('')
      const res = await fetch("/api/users/register", {
          method: "POST",
          body: JSON.stringify({formData}),
          headers: { "Content-Type": "application/json" }
      })

      if(!res.ok) {
          toast.remove(loadingToastId)
          toast.error('Registration failed!') 
          const response = await res.json()
          setErrorMessage(response.message)
      } else {
          toast.remove(loadingToastId)
          toast.success('Successfully registered!')
          router.refresh()
          router.push("/auth/signIn")
      }
  }

  const handleGoogleSignIn = async(e) => {
    try {
      const result = await signIn("google", {
        redirect: true,
        callbackUrl: (!redirectUrl) ? '/' : redirectUrl
      })
    } catch (error) {
      setErrorMessage(error.message)
    }
  }
  
  return (
    <div className="mb-28 mt-12">
      <div className="bg-gray-100 shadow-md shadow-gray-200 rounded w-4/5 md:w-3/5 mx-auto p-4">
      <h1 className='text-center text-2xl font-medium'>Register</h1>
      <div className="flex flex-col justify-center items-center">
        <form onSubmit={handleSubmit} method='post'
              className="w-full flex flex-col px-1 mx-auto">
            <label className="font-medium">Your full name</label>
            <input id='name' name='name' type="text" placeholder="Name"  onChange={handleChange} value={formData.name} />
            <label className="font-medium">Your email</label>
            <input id='email' name='email' type="email" placeholder="Email"  onChange={handleChange} value={formData.email} />
            <label className="font-medium">Password</label>
            <input id='password' name='password' type="password" placeholder="Password"  onChange={handleChange} value={formData.password} />
            <button type='submit'>Register</button>
           
        </form>

        <p>
            Log in with Google
        </p>
        <div className='w-full' onClick={handleGoogleSignIn}>
        <div className="flex justify-center items-center rounded-md my-2 py-2 px-4
                      space-x-2 w-full text-center cursor-pointer shadow-md hover:shadow-gray-500 
                      transition ease-in-out bg-cyan-600 hover:bg-cyan-700">
         <div className="bg-white w-fit rounded-full p-1">
         <Image src='/google.png' width={20} height={20}
                alt="google icon" className='object-fill w-5 h-5' />
         {/* <img src='/google.png' className='object-fill w-5 h-5'/> */}
         </div>
         <p className="text-white">Login with google</p>
        </div>
      </div>
      </div>
      </div>
    </div>
  )
}
