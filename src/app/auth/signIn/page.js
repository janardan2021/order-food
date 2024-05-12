'use client'
import { useSession } from "next-auth/react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from "react"
import toast from 'react-hot-toast';

export default function SignIn() {
  const { data: session, status , update} = useSession()
  // console.log(session, status)
  const searchParams = useSearchParams()
  
  const redirectUrl = searchParams.get('redirectUrl')
  // console.log(typeof redirectUrl, redirectUrl)
  const router = useRouter()
 
  useEffect(() =>{
    if(redirectUrl && status === 'authenticated') {
      router.refresh()
      router.push(redirectUrl)
    }else if (status === 'authenticated') {
      router.refresh()
      router.push("/")}
  },[status])
    
  const [formData, setFormData] = useState({
    password: '',
    email:''
  })

  const [errorMessage, setErrorMessage] = useState('')
  
  const handleChange = (e) => {
      const value = e.target.value
      const name = e.target.name
      setFormData((prevState) => ({
          ...prevState,
          [name]: value
      }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToastId = toast.loading('Logging you in!')

    try {
      const result = await signIn("credentials", {
        redirect: false,
        callbackUrl: (redirectUrl) ?  redirectUrl : '/',
        email: formData.email,
        password: formData.password,
      });

      if(!result.ok) {
        toast.remove(loadingToastId)
        toast.error('Something went wrong')
        setErrorMessage('Invalid Email or Password!')
      } else {
        toast.remove(loadingToastId)
        toast.success('Successfully logged in!')
        router.refresh()
        // console.log('the redirect url is ', redirectUrl)
        const redirect = (redirectUrl) ?  redirectUrl : '/'
        router.push(String(redirect))
      }

    } catch (error) {
      router.push('/auth/authError')
      setErrorMessage('Something went wrong. Please try again later!')
    }
  };

  const handleGoogleSignIn = async(e) => {
    // console.log('Trying to log in ')
      try {
        const result = await signIn("google", {
          redirect: true,
          callbackUrl: (!redirectUrl) ? '/' : redirectUrl
        })
      } catch (error) {
        setErrorMessage(error.message)
      }
      
      // console.log(result)
  }


  
  return (
    <div className="mb-44 mt-12">
    <div className="bg-gray-100 shadow-md shadow-gray-200 rounded w-4/5 md:w-3/5 mx-auto p-4">
    <h1 className='text-center text-2xl font-medium'>Sign In</h1>
    <div className="flex flex-col justify-center items-center">
      <form onSubmit={handleSubmit} method='post' 
            className="w-full flex flex-col  px-1 mx-auto">
          <p className="text-red-500">{errorMessage}</p>
          <label className="font-medium">Your email</label>
          <input id='email' name='email' type="email" placeholder="Email"  onChange={handleChange} value={formData.email} />
          <label className="font-medium">Password</label>
          <input id='password' name='password' type="password" placeholder="Password"  onChange={handleChange} value={formData.password} />
          <button type='submit'>SignIn</button>
         
      </form>
      <p>
          Log in with Google
      </p>
      <div className='w-full' onClick={handleGoogleSignIn}>
        <div className="flex justify-center items-center rounded-md my-2 py-2 px-4
                      space-x-2 w-full text-center cursor-pointer shadow-md hover:shadow-gray-500 
                      transition ease-in-out bg-cyan-600 hover:bg-cyan-700">
         <div className="bg-white w-fit rounded-full p-1">
         <img src='/google.png' className='object-fill w-5 h-5'/>
         </div>
         <p className="text-white">Login with google</p>
        </div>
      </div>
    </div>
    </div>
  </div>
  )
}
