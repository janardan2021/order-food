import Order from "@/models/Order"
import { NextResponse } from "next/server"
// import { getServerSession } from "next-auth"
// import {options} from "@/app/api/auth/[...nextauth]/options.js"


export async function GET(req, {params}){
    const orderID  = params.orderID
    // console.log(orderID)
    try {
      // const session = await getServerSession(options)
      const order = await Order.findById({_id: orderID})
      if (order) {
        // console.log(order)
          return NextResponse.json(order, {status: 201})
      } else {
        return NextResponse.json({message: 'No user orders found'}, {status: 501})
      }
    } catch (error) {
      return NextResponse.json({message: 'No user orders found'}, {status: 501})
    }
  }

  export async function PATCH(req, {params}){
    const orderID = params.orderID
    // console.log('Got the patch request')
    try {
      const order = await Order.findByIdAndUpdate({_id: orderID}, { isDelivered: true })
      console.log(order)
      if (order) {
        return NextResponse.json({message: 'Order update successful'}, {status: 201})
      }
      return NextResponse.json({message: 'Error updating the order'}, {status: 501})
    } catch (error) {
      return NextResponse.json({message: 'Something went wrong'}, {status: 501})
    }
  }