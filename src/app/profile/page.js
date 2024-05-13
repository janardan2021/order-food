'use client'
import { useSession } from "next-auth/react"

import { redirect } from "next/navigation"
import { useEffect, useState } from "react"
import toast from 'react-hot-toast';
import UserNavigation from '@/components/layouts/UserNavigation'
import Loader from "@/components/layouts/Loader";
import Image from 'next/image'

export default function ProfilePage() {
    const { data: session, status } = useSession({
      required: true,
      onUnauthenticated(){
        redirect("/auth/signIn?callbackUrl=/profile")
      }
    })
    const [name, setName] = useState('')
    const [image, setImage] = useState('')
    const [addressLoaded, setAddressLoaded] = useState(false)
    // const [addressNotFound, setAddressNotFound] = useState(false)
    const [editPicture, setEditPicture] = useState(false)
    const [addressData, setAddressData] = useState({
      user_email: session?.user?.email || '',
      street: '',
      city: '',
      postalCode:'',
      state: '',
      country: ''
    })
    const handleAddressChange = (e) => {
      const value = e.target.value
      const name = e.target.name
      setAddressData((prevState) => ({
          ...prevState,
          [name]: value
      }))
    }

    async function loadUserAddress() {
      const res = await fetch("/api/users/address")

      if (res.ok){
        const response = await res.json()
        // console.log(response)
        setAddressData((prevState) => ({
          ...prevState,
          user_email: response.user_email,
          city: response.city,
          country: response.country,
          postalCode: response.postalCode,
          street: response.street,
          state: response.state
      }))
      setAddressLoaded(true)
      } else {
        setAddressLoaded(true)
      }

    }

    useEffect(()=>{
        if(status === 'authenticated') {
            setName(session.user.name)
            setImage(session.user.image)
            loadUserAddress()
        }
    },[status, session])

    async function updateProfileInfo(e) {
        e.preventDefault()

        const savingProfilePromise = new Promise(async (resolve, reject) => {
          const res = await fetch("/api/users/profile", {
                      method: "PUT",
                      body: JSON.stringify({name}),
                      headers: { "Content-Type": "application/json" }
        })
        if (res.ok) {
          resolve()
        } else {
          reject()
        }
        })

        await toast.promise(savingProfilePromise, {
          loading: 'Updating profile...',
          success: 'Profile successfully updated!',
          error: 'Error updating profile!',
        });
       
    }

    async function updateProfilePicture(e){
      const loadingToastId = toast.loading('Updating the profile picture')
      // console.log(e)
      const files = e.target.files
      if(files.length === 1){
        const formData = new FormData()
        formData.set('file', files[0])
        const res = await fetch("/api/users/upload", {
          method: "POST",
          body: formData
        })

        if(res.ok) {
          const response = await res.json()
          // setMessage(response.message)
          setImage((image) => response.url)
          toast.remove(loadingToastId)
          toast.success('Successfully updated profile!')
          setEditPicture(false)
          // console.log(response)
      } else {
        toast.remove(loadingToastId)
        toast.error('Something went wrong')
      }
      }
    }

    async function updateUserAddress(e){
      e.preventDefault()
      // console.log(addressData)
      const savingAddressPromise = new Promise(async (resolve, reject) => {
        const res = await fetch("/api/users/address", {
          method: "POST",
          body: JSON.stringify({addressData}),
          headers: { "Content-Type": "application/json" }
      })
      if(res.ok) {
          resolve()
      } else {
         reject()
      }
      })

      await toast.promise(savingAddressPromise, {
        loading: 'Updating Address...',
        success: 'Address successfully updated!',
        error: 'Error updating address!',
      });
     
    }

    if(status === 'loading') {
        return <Loader />
    }
    if (status === 'unauthenticated') {
        return redirect('/auth/signin')
    }
  return (
    <div className="flex flex-col justify-center mb-72">
      <UserNavigation isAdmin={session.user.isAdmin}/>

      <div>
      <p className="font-medium text-xl text-center">Profile information</p>
      
      <div className="flex flex-col items-center sm:flex-row sm:justify-center sm:items-end my-4 ">
      <div className="w-3/5 sm:w-1/5 flex flex-col justify-center items-center">
        {image === '' ? <Loader /> : (
          <Image src={image} width={144} height={144} alt='profile image' 
          className="object-fit w-36 h-36 rounded-lg border-2 border-green-700" />
        )}
        {/* <img src={image } className="object-fit w-36 h-36 rounded-lg border-2 border-green-700"/> */}
        <div className="">
        {!editPicture ? (<button className="w-full" onClick={() => setEditPicture(true)}>Edit profile picture</button>) : (
          <div className="">
          <input type="file" onChange={updateProfilePicture} className="my-4 py-1 px-4"/>
           </div>
        )}
        </div>
      </div>

      <form className="flex flex-col w-3/5 sm:w-2/5 px-1" onSubmit={updateProfileInfo}>
       <label className="font-medium">Name</label>
       <input type="text" placeholder="Your name" value={name} 
         onChange={(e) => setName(e.target.value)}/>
      <label className="font-medium">Email</label>
       <input type='email' disabled={true} value={session.user.email} />
       <button type="submit">Update Profile Info</button>
      </form>

      </div>
      
      {!addressLoaded ? (<Loader />) : (
      <div className="flex justify-center my-4">
      <form onSubmit={updateUserAddress} className="flex flex-col w-3/5 px-1" method='post'>
        <p className="font-medium text-xl text-center">Address information</p>
        <label className="font-medium">Street name</label>
        <input id='street' name='street' type="text" placeholder="street"  onChange={handleAddressChange} value={addressData.street} />
        <div className="flex gap-4">
        <div className="w-full">
        <label className="font-medium">City</label>
        <input id='city' name='city' type="text" placeholder="city"  onChange={handleAddressChange} value={addressData.city} />
        </div>
        <div className="w-full">
        <label className="font-medium">ZIP code</label>
        <input id='postalCode' name='postalCode' type="text" placeholder="postalCode"  onChange={handleAddressChange} value={addressData.postalCode} />
        </div>
        </div>
        <label className="font-medium">State</label>
        <input id='state' name='state' type="text" placeholder="state"  onChange={handleAddressChange} value={addressData.state} />
        <label className="font-medium">Country</label>
        <input id='country' name='country' type="text" placeholder="country"  onChange={handleAddressChange} value={addressData.country} />
        <button type='submit'>Update Address</button>
           
      </form>
      </div>
      )}
      </div>
    </div>
  )
}
