"use client"
import { useEffect, useState } from "react"
import toast from 'react-hot-toast';
import Loader from './Loader.js'

import { CartContext } from "@/components/CartContextProvider.js";
import { useContext } from "react";
import Image from 'next/image'

export default function HomeScreenMenu() {
  // const localStorage = (typeof window !== "undefined") ? window.localStorage : null
  const {dispatch} = useContext(CartContext)

  const [menuItems, setMenuItems] = useState([])
  // console.log(menuItems)
  const [menusLoaded, setMenusLoaded] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [modalMenu, setModalMenu] = useState(null)

  const [toCartMenuSize, setToCartMenuSize] = useState(modalMenu?.sizes[0] || null)
  const [toCartMenuAddOns, setToCartMenuAddOns] = useState([])
  const [toCartMenuQty, setToCartMenuQty] = useState(1)

  async function loadMenuItems(){
    const res = await fetch("/api/users/menu")
    if (res.ok){
      const response = await res.json()
      // console.log(response)
      setMenuItems((prev) => response)
      setMenusLoaded((prev) => true)
    }
  }
  
  function prepareModal(index){
    setShowModal(true)
    setModalMenu(() => menuItems[index])
    
  }
  // console.log(modalMenu)

  function closeMenuModal(e){
    e.stopPropagation()
    setShowModal(false)

    setToCartMenuSize(null)
    setToCartMenuAddOns([])
    setToCartMenuQty(1)

    setModalMenu(null)
    
  }
  function doNotPropagate(e){
    console.log(e.target.id)
    e.stopPropagation()
  }
  // console.log(showModal)

  function configureSize(e){
    const foundSize = modalMenu.sizes.find((size) => e.target.value === size.size);
    setToCartMenuSize(foundSize)
  }

  function configureAddOns(e){
    // console.log(e.target.checked)
    // console.log(e.target.value)
    const foundAddOn = modalMenu.addOns.find((addOn) => e.target.value === addOn.addOn)
    if(e.target.checked) {
      setToCartMenuAddOns((toCartMenuAddOns) => [...toCartMenuAddOns, foundAddOn])
    } else if (!e.target.checked && toCartMenuAddOns.length > 0) {
      const filteredAddOns = toCartMenuAddOns.filter((addOn) => addOn.addOn !== e.target.value)
      setToCartMenuAddOns(() => filteredAddOns)
    }
  }

  function addMenuToCart(){
    const toCartMenu = {_id: modalMenu._id,
                        menuName : modalMenu.name,
                        menuSize: toCartMenuSize ? toCartMenuSize : modalMenu.sizes[0],
                        menuAddOns: toCartMenuAddOns,
                        menuQty: toCartMenuQty
                       }
    dispatch({type:'ADDTOCART', payload: toCartMenu})
    toast.success('Menu added into the cart!')
    console.log('Menu added to cart')
  }


  useEffect(()=>{
    if(!menusLoaded){
      loadMenuItems()
    }
   
  },[ menusLoaded])


  // useEffect(()=>{
  //   if(!showModal){
  //     setToCartMenuSize(null)
  //     setToCartMenuAddOns([])
  //     setToCartMenuQty(1)
  //   }
  //  },[showModal])

  //  const modalBG = document.getElementById("modalBG");
  //  modalBG.addEventListener('click', () => {
  //   setShowModal(() => false)
  //   // console.log("body was clicked")
  // })
 
  if (menuItems.length === 0) return  <Loader />
  
  return (
    <div name='menu' className="flex flex-col items-center my-12">
    {showModal && modalMenu && (
      <div onClick={(e) =>closeMenuModal(e)} className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center">
        <div className="relative bg-white p-2 md:p-0 w-3/5 m:w-2/5 h-4/5 rounded-lg overflow-scroll ">
              <button onClick={(e) => closeMenuModal(e)} className="absolute left-1/3 md:left-4 top-0 z-10">
                       Close
              </button>
              <div onClick={(e) =>doNotPropagate(e)}  className="relative flex flex-col items-center mt-10 md:mt-0">
              <p className="text-xl font-medium my-2">{modalMenu.name}</p>
              <div>
              <Image src={modalMenu.image }
                        width={192}
                        height={144}
                        alt="Picture of the menu item"
                        className="object-fit w-48 h-36 rounded-lg shadow-md shadow-gray-200
                          hover:shadow-lg hover:shadow-gray-300"
                      />
              {/* <img src={modalMenu.image } className="object-fit w-48 h-48 rounded-lg shadow-md shadow-gray-200
                          hover:shadow-lg hover:shadow-gray-300"/> */}
              </div>
              <p className="my-2 px-2">{modalMenu.description}</p>

              <p className="text-lg font-medium">Available sizes</p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 my-2">
              {modalMenu.sizes.length > 0 && modalMenu.sizes.map((size, index) => (
                <div key={index} className="flex gap-2 my-1">
                  
                  <input type="radio" name="toCartMenuSize" value={size.size} 
                  onClick={(e) => configureSize(e)} className="-h-4 w-4"/>
                  <p className="font-medium">{size.size}</p>
                  <p className="text-green-700">${size.price}</p>
                </div>
               ))}
              </div>
              
             {/* <div className="h-80"></div> */}

              <p className="text-lg font-medium">Add ons</p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 my-2">
              {modalMenu.addOns.length > 0 && modalMenu.addOns.map((addOn, index) => (
                <div key={index} className="flex gap-2 my-1">
                  <input type="checkbox" name={addOn.addOn} value={addOn.addOn} 
                  onClick={(e) => configureAddOns(e)} className="-h-4 w-4 md:ml-2"/>
                  <p className="font-medium">{addOn.addOn}</p>
                  <p className="text-green-700">${addOn.price}</p>
                </div>
               ))}
              </div>
              
              <div className="flex gap-4">
                <label className="font-medium">Quantity</label>
                <input type="number" id="modalMenuQty" name="modalMenuQty" min="1" max="100" 
                       value={toCartMenuQty} onChange={(e) => setToCartMenuQty(e.target.value)}
                       className="border-2"/>
              </div>
              <button onClick={addMenuToCart} className="flex gap-4">
                       Add menu to cart
              </button>
              
              </div>
        </div>
      </div>
    )}
     <p className="text-4xl font-medium text-green-700 my-4">Our Menus</p>
      { (!menusLoaded) ? <Loader /> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-4/5">
          {menuItems.length > 0 && menuItems.map((menuItem, index) => (
                <div key={index} className="flex flex-col items-center bg-gray-100 shadow-md shadow-gray-200
                                          hover:shadow-lg hover:shadow-gray-400 transition ease-in-out p-4 w-full">
                    <p className="text-xl font-medium my-2">{menuItem.name}</p>
                    <div>
                    <Image
                        src={menuItem.image }
                        width={192}
                        height={144}
                        alt="Picture of the menu item"
                        className="object-fit w-48 h-36 rounded-lg shadow-md shadow-gray-200
                          hover:shadow-lg hover:shadow-gray-300"
                      />
                    {/* <img src={menuItem.image } className="object-fit w-48 h-36 rounded-lg shadow-md shadow-gray-200
                          hover:shadow-lg hover:shadow-gray-300"/> */}
                    </div>
                    <p className="my-2">{menuItem.description}</p>
                    <p>Starting from: <span className="text-green-700">${menuItem.sizes[0].price}</span></p>
                    <button onClick={() => prepareModal(index)} className="flex gap-4">
                       Add to cart
                    </button>
                </div>
            ))}
        </div>
      )}

    </div>
  )
}
