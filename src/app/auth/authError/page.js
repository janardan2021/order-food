// components/AuthErrorPage.jsx
"use client"

import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation"
import toast from 'react-hot-toast';

export default function AuthenticationError({ error }){
  const router = useRouter();
  const [someError, setSomeError] = useState(true)


  function goBack() {
    router.refresh()
    router.push('/')
  }

  function notifyError(){
    if(someError) {
      toast.error('Something went wrong!')
      setSomeError((prev) => false)
    }
  }

  useEffect(() => {
    notifyError()
  }, []);

  return (
    <div className="mt-14 mb-80">
     <div className="flex flex-col items-center mt-12 bg-gray-100 shadow-md
                      shadow-gray-200 w-3/5 mx-auto">
      <p className="my-4 text-lg font-medium text-red-700">Authentication Error!!!</p>
      <p className="my-4 text-lg font-medium">Something went wrong during user authentication.</p>
      <button onClick={(e) => goBack()}>
          Go back
        </button>
     </div>
    </div>
  );
};

