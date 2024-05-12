import Order from "@/models/Order"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import {options} from "@/app/api/auth/[...nextauth]/options.js"


export async function GET(){

    try {
      const session = await getServerSession(options)
      let orders
      if(session.user.isAdmin) {
        orders = await Order.find() 
      } else {
      orders = await Order.find({email: session.user.email})
      }
      if (orders) {
          return NextResponse.json(orders, {status: 201})
      } else {
        return NextResponse.json({message: 'No user orders found'}, {status: 501})
      }
    } catch (error) {
      return NextResponse.json({message: 'No user orders found'}, {status: 501})
    }
  }