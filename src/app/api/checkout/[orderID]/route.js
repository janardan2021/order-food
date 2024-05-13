
import { NextResponse } from "next/server"
// import { getServerSession } from "next-auth"
// import {options} from "@/app/api/auth/[...nextauth]/options.js"
import Order from "@/models/Order"

const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SK);

export async function GET(req, {params}){
    const orderID  = params.orderID 
    // console.log(orderID)
    try {
       
    // const {checkoutCart: cart, address} = await req.json() 
    // const session = await getServerSession(options)
    const savedOrder = await Order.findById(orderID).exec();

    
    // console.log(savedOrder)

    const line_items = [];
    savedOrder.menuItems.forEach((menuItem) => {
      line_items.push(
          {
            price_data: {
                currency: "usd",
                product_data: {name: menuItem.menuName },
                unit_amount: Math.floor(menuItem.menuItemTotal * 100),
                },
            quantity: menuItem.menuQty
          }
         )
      }) 
     
     const shipping_options = [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 1000,
              currency: 'usd',
            },
            display_name: 'Delivery fee',
          },
        }
      ]
    
    const client_reference_id = JSON.stringify(savedOrder._id)
       
    const checkoutSession = await stripe.checkout.sessions.create({
        line_items,
        shipping_options,
        mode: 'payment',
        client_reference_id,
        payment_method_types: ["card"],
        success_url: (process.env.NODE_ENV === 'production') ? `${process.env.APP_URL}orders/${savedOrder._id}` 
                                                             : `http://localhost:3000/orders/${savedOrder._id}`,
        cancel_url:(process.env.NODE_ENV === 'production') ? `${process.env.APP_URL}orders/${savedOrder._id}` 
                                                             : `http://localhost:3000/orders/${savedOrder._id}`
      });
    //   console.log(checkoutSession)
        return NextResponse.json(checkoutSession, {status: 201})
       
    } catch (error) {
        // console.log(error)
        return NextResponse.json({message: 'Error in checkout'}, {status: 501})
    }
}

