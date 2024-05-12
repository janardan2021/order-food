'use client'
import { signOut } from "next-auth/react"
// import { useRouter } from "next/navigation"
// import { useSearchParams } from 'next/navigation'
// import { useState } from "react"
import toast from 'react-hot-toast';

export default function SignOut() {

   function userSigningOut(){
    toast.loading('Signing you out!')
    signOut({redirect: true, callbackUrl: "/"})
  }
    // const router = useRouter()
    // const [errorMessage, setErrorMessage] = useState('')

    // const handleSignOut = async(e) => {
    //     try {
    //         const result = await signOut({redirect: false, callbackUrl: "/"})
    //         // if(result?.url) {
    //         //   router.refresh()
    //         //   router.push("/")
    //         // }
    //     } catch (error) {
    //       setErrorMessage(error.message)
    //     }
    //   }
      
  return (
    <div className="mt-14 mb-80">
        {/* <p>{errorMessage}</p> */}
       <div className="flex flex-col items-center mt-12 bg-gray-100 shadow-md
                      shadow-gray-200 w-3/5 mx-auto">
        <p className="my-4 text-lg font-medium">Thank you for visiting us.</p>
        <p className="my-4 text-lg font-medium text-green-600">We hope to see you again.</p>
         <button onClick={(e) => userSigningOut()}>
          SignOut
        </button>
       </div>
    </div>
  )
}
