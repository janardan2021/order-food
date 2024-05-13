'use client'
import { createContext, useReducer, useState, useEffect} from "react";
import {produce} from 'immer'
// import {useLocalStorage} from '@/components/useLocalStorage'


export const CartContext = createContext()




export const CartContextProvider = ({children}) => {
    // const {initialState} = useLocalStorage()

    const localStorage = (typeof window !== "undefined") ? window.localStorage : null

    const [initialState, setInitialState] = useState(() => {
        try {
          const value = localStorage?.getItem('order-food-cart')
          return value ? JSON.parse(value) : {cartItems: []}
        } catch (error) {
          return {cartItems: []}
        }
      })

    const cartReducer = (state, action) => {
        switch (action.type) {
            case 'ADDTOCART': {
            //   console.log('State before adding items', state)
              const updatedState = produce (state , draft => {
              const item = action.payload
              const existItem = state.cartItems.find((x) => x._id === item._id)
              if(existItem) {
                draft.cartItems = state.cartItems.map((x) => x._id === existItem._id ? item : x)
              } else {
                draft.cartItems = [...state.cartItems, item]
              }})
              // console.log('This is updated state', updatedState)
              localStorage?.setItem('order-food-cart', JSON.stringify(updatedState))
            //   console.log('Saved the local storage', JSON.parse(localStorage.getItem('order-food-cart')))
              return updatedState
            }
    
            case 'REMOVEFROMCART': {
              const updatedState = produce(state, draft =>{
                draft.cartItems = state.cartItems.filter((x) => x._id !== action.payload)
              })
              localStorage?.setItem('order-food-cart', JSON.stringify(updatedState))
             return updatedState
            }
    
            case 'CLEARCART': {
              const updatedState = produce(state, draft =>{
                draft.cartItems = []
              })
              localStorage?.setItem('order-food-cart', JSON.stringify({cartItems: []}))
             return updatedState
            }

            case 'UPDATECART': {
              return action.payload
            }
            
            default:
                return state       
        }
    }
    // useEffect(() => {
    //     if(localStorage && localStorage.getItem('order-food-cart')){
    //         setInitialState(() => JSON.parse(localStorage.getItem('order-food-cart')))
    //     }else {
    //         setInitialState(() => {cartItems: []})
    //     }
        
    //   }, [])

  
  
    // console.log('This is the initial state loaded from local storage', initialState)
    const [state, dispatch] = useReducer(cartReducer, initialState)
     
  
    return(
        <CartContext.Provider value={{state, dispatch}}>
            {children}
        </CartContext.Provider>
    )
}