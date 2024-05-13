'use client'
import { useSession } from "next-auth/react"

import toast from 'react-hot-toast';
import { redirect } from "next/navigation"
import UserNavigation from "@/components/layouts/UserNavigation"
import { useState } from "react"
import Image from 'next/image'

import MenusList from '@/components/layouts/MenusList'

export default function Menus() {
    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated(){
          redirect("/auth/signIn?callbackUrl=/")
        }
      })

    //   console.log(session)
    const [showMenuForm, setShowMenuForm] = useState(false)

     const [name, setName] = useState('')
     const [description, setDescription] = useState('')
     const [addOns, setAddOns] = useState([])
     const [addOn, setAddOn] = useState('')
     const [addOnPrice, setAddOnPrice] = useState(0)
     const [sizes, setSizes] = useState([])
     const [size, setSize] = useState('')
     const [sizePrice, setSizePrice] = useState(0)

     const [imageURL, setImageURL] = useState('')

     const addMenuSize = (e) => {
         setSizes((sizes) => ([
            ...sizes,
            {size: size,
            price: sizePrice}
         ]))
         setSize('')
         setSizePrice(0)
     }
    //  console.log(sizes)
     const deleteMenuSize = (size) =>{
        setSizes((sizes) => (
            sizes.filter(item => item.size !== size)
        ))
     }
     const addAddOn = (e) => {
        setAddOns((addOns) => ([
           ...addOns,
           {addOn: addOn,
           price: addOnPrice}
        ]))
        setAddOn('')
        setAddOnPrice(0)
    }
    // console.log(addOns)
    const deleteAddOn = (addOn) =>{
        setAddOns((addOns) => (
            addOns.filter(item => item.addOn !== addOn)
        ))
     }

     async function updateMenuPicture(e){
        const loadingToastId = toast.loading('Adding menu picture')
        // console.log(e)
        const files = e.target.files
        if(files.length === 1){
          const formData = new FormData()
          formData.set('file', files[0])
          const res = await fetch("/api/users/menuUpload", {
            method: "POST",
            body: formData
          })
  
          if(res.ok) {
            const response = await res.json()
            // setMessage(response.message)
            setImageURL((imageURL) => response.url)
            toast.remove(loadingToastId)
            toast.success('Successfully updated profile!')
            console.log(response)
        } else {
          toast.remove(loadingToastId)
          toast.error('Something went wrong')
        }
        }
      }

    const formData = {name, description, sizes, addOns, image:imageURL}
    const handleCreateMenu = async (e) => {
        const loadingToastId = toast.loading('Creating the menu item....')
        console.log("Form Data", formData)
        e.preventDefault()
        const res = await fetch("/api/users/menu", {
          method: "POST",
          body: JSON.stringify({formData}),
          headers: { "Content-Type": "application/json" }
      })

      if(res.ok) {
        toast.remove(loadingToastId)
        toast.success('Successfully Created Menu!')
        //   const response = await res.json()
        //   setErrorMessage(response.message)
        setName('')
        setDescription('')
        setAddOns([])
        setAddOn('')
        setAddOnPrice(0)
        setSizes([])
        setSize('')
        setSizePrice(0)

     setImageURL('')
      } else {
        toast.remove(loadingToastId)
        toast.error('Something went wrong')
        //   router.refresh()
        //   router.push("/auth/signIn")
      }
    }

    function showForm(e) {
      e.preventDefault()
      setShowMenuForm((prev) => true)
    }
    function closeForm(e) {
      e.preventDefault()
      setShowMenuForm((prev) => false)
    }
  return (
    <div>
      <UserNavigation isAdmin={session?.user.isAdmin}/>

      {!showMenuForm && (
        <div className="flex justify-center items-center">
          <button onClick={(e) => showForm(e)}>Create a new Menu</button>
        </div>
      )}
      
      {showMenuForm && (
      <div className="bg-gray-100 shadow-md shadow-gray-200 w-3/5 mx-auto">
        <div className="flex justify-center items-center">
          <button onClick={(e) => closeForm(e)}>Close the form</button>
        </div>

      <div className="flex flex-col justify-center items-center">
        <label className="font-medium text-lg mb-2">Upload the menu avatar</label>
        <Image src={imageURL === '' ? '/blank.jpg' : imageURL }
                        width={144}
                        height={144}
                        alt="Picture of the menu item"
                        className="object-fit w-36 h-36 rounded-lg shadow-md shadow-gray-200
                          hover:shadow-lg hover:shadow-gray-300"
                      />
        {/* <img src={imageURL } className="object-fit w-36 h-36 rounded-lg border-2 border-green-700"/> */}
        <input className="pl-32 rounded-lg p-1" type="file" onChange={updateMenuPicture}/>
        
        {/* <button type="button" onClick={updateProfilePicture}>Edit</button> */}
      </div>

      <form onSubmit={handleCreateMenu}  className="flex flex-col w-3/5  px-1 mx-auto">
            <label className="font-medium">Name of Menu</label>
            <input id='name' name='name' type="text" placeholder="Name"  value={name}  
                   onChange={(e) => setName(e.target.value)}/>
            <label className="font-medium">Description</label>
            <input id='description' name='description' type="text" placeholder="Description"  value={description}  
                   onChange={(e) => setDescription(e.target.value)}/>

            <label className="font-medium text-lg text-center mt-4">All Sizes</label>

            <div className="flex flex-wrap space-x-2">
            {sizes.length > 0 ? sizes.map((item, index) => (
                <div key={index} className="flex gap-2 border border-green-700 p-1 rounded-lg">
                    <p className="text-green-700">{item.size}</p>
                    <p className="text-green-700">${item.price}</p>
                    <p onClick={(e) => deleteMenuSize(item.size)}
                       className="text-red-700 border border-red-700 rounded-lg px-1">Delete</p>
                </div>
            ))
            : <p className="text-gray-500 px-4 py-1">No menu sizes added yet!</p>}
            </div>

            <label className="">Add size of menu</label>
            <input id='size' name='size' type="text" placeholder="Size"  value={size}  
                   onChange={(e) => setSize(e.target.value)}/>
            <label className="">Set price for the size</label>
            <input id='sizePrice' name='sizePrice' type="number" step="0.01" placeholder="Size Price"  value={sizePrice}  
            onChange={(e) => setSizePrice(e.target.value)}/>
            <p className="button" onClick={addMenuSize}>Add menu size</p>


            <label className="font-medium text-lg text-center mt-4">All AddOns</label>

            <div className="flex flex-wrap space-x-2">
            {addOns.length > 0 ? addOns.map((item, index) => (
                <div key={index} className="flex gap-2 border border-green-700 p-1 rounded-lg">
                    <p className="text-green-700">{item.addOn}</p>
                    <p className="text-green-700">{item.price}</p>
                    <p onClick={(e) => deleteAddOn(item.addOn)}
                    className="text-red-700 border border-red-700 rounded-lg px-1">Delete</p>
                </div>
            ))
            : <p className="text-gray-500 px-4 py-1">No menu addons added yet!</p>}
            </div>

            <label className="">Name of addon</label>
            <input id='addOn' name='addOn' type="text" placeholder="Add On"  value={addOn}  
                   onChange={(e) => setAddOn(e.target.value)}/>
            <label className="">Price for addon</label>
            <input id='addOnPrice' name='addOnPrice' type="number" step="0.01" placeholder="Add On Price"  value={addOnPrice}  
            onChange={(e) => setAddOnPrice(e.target.value)}/>
            <p className="button" onClick={addAddOn}>Add menu addOn</p>



            <div className="my-4">
            <button type='submit'>Create Menu</button>
            </div>
           
      </form>

      </div>
      )}
      <MenusList />

    </div>
  )
}
