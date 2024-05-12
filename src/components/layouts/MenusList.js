"use client"
import { useEffect, useState } from "react"
import toast from 'react-hot-toast';
import Loader from './Loader.js'

export default function MenusList() {

  const [menuItems, setMenuItems] = useState([])
  const [menusLoaded, setMenusLoaded] = useState(false)


  async function loadMenuItems(){
    const res = await fetch("/api/users/menu")
    if (res.ok){
      const response = await res.json()
      // console.log(response)
      setMenuItems((prev) => response)
      setMenusLoaded((prev) => true)
    }
  }
  

  async function deleteMenu(e, id){
    // console.log(id)
    e.preventDefault()
    if (window.confirm("Do you really want to delete the user?")){
    const loadingToastId = toast.loading('Updating the profile picture')
    const res = await fetch("/api/users/menu", {
        method: "DELETE",
        body: JSON.stringify({_id: id}),
        headers: { "Content-Type": "application/json" }
    })

    if(res.ok) {
        const response = await res.json()
        toast.remove(loadingToastId)
        toast.success('Successfully deleted menu item!')
        // console.log(response)
        setMenusLoaded((prev) => false)
    }else {
        toast.remove(loadingToastId)
        toast.error('Error deleting menu item!')
    } 
}
  }


  useEffect(()=>{
    if(!menusLoaded){
      loadMenuItems()
    }
   
  },[menusLoaded])
 
  if (menuItems.length === 0) return  <Loader />
  
  return (
    <div name='menu' className="flex flex-col items-center my-4">
     <p className="text-2xl font-medium text-green-700 my-4 border-b-2 border-green-700">List of all menu items</p>
     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-4/5">
     {menuItems.length > 0 && menuItems.map((menuItem, index) => (
                <div key={index} className="flex flex-col items-center bg-gray-100 shadow-md shadow-gray-200
                                          hover:shadow-lg hover:shadow-gray-400 transition ease-in-out p-4 w-full">
                    <p className="text-xl font-medium my-2">{menuItem.name}</p>
                    <div>
                    <img src={menuItem.image } className="object-fit w-48 h-36 rounded-lg shadow-md shadow-gray-200
                          hover:shadow-lg hover:shadow-gray-300"/>
                    </div>
                    <p className="my-2">{menuItem.description}</p>
                    <p>Starting from: <span className="text-green-700">${menuItem.sizes[0].price}</span></p>
                    <button onClick={(e) => deleteMenu(e, menuItem._id)} className="flex gap-4">
                      Delete menu
                    </button>
                </div>
            ))}
     </div>

    </div>
  )
}
