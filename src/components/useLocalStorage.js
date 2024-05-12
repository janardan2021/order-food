'use client'
import {useState, useEffect} from "react";

export const useLocalStorage = () => {
    const localStorage = (typeof window !== "undefined") ? window.localStorage : null
    const [initialState, setInitialState] = useState({cartItems: []})
    useEffect(() => {
        if(localStorage && localStorage.getItem('order-food-cart')){
            setInitialState(() => JSON.parse(localStorage.getItem('order-food-cart')))
        }else {
            setInitialState(() => {cartItems: []})
        }
        
      }, [])
   
    return initialState
}