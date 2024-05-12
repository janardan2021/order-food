
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import {options} from "@/app/api/auth/[...nextauth]/options.js"
import Order from "@/models/Order"

const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SK);

export async function POST(req){
    console.log('got the checkout request')
    try {
       
    const {checkoutCart: cart, address} = await req.json() 
    const session = await getServerSession(options)
    console.log('This is the session', session)
    const createOrder = {
        email: session.user.email,
        name: session.user.name,
        menuItems: cart.map((menuItem) => (
            {
              menuName: menuItem.menuName,
              menuQty: menuItem.menuQty,
              menuSize: {
                size: menuItem.menuSize.size,
                price: menuItem.menuSize.price
              },
              menuAddOns: menuItem.menuAddOns.map((menuAddOn) => (
                  {
                    addOn: menuAddOn.addOn,
                    price: Number(menuAddOn.price)
                  }
              )),
              addOnsTotal: menuItem.addOnsTotal,
              menuItemTotal: menuItem.menuItemTotal
            }
        )),
        address: address,
        deliveryFee: 10.00,
        total: 10 + cart.reduce((acc, menuItem)=>( menuItem.menuItemTotal * menuItem.menuQty  + acc), 0)
    }
    const order = new Order(createOrder)
    const createdOrder = await order.save()
    console.log('the created order is', createOrder)

    const line_items = [];
    createdOrder.menuItems.forEach((menuItem) => {
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
    
    const client_reference_id = JSON.stringify(createdOrder._id)
      //  Do not forget to add APP_URL to encirenvenment variable when deploying
      
    const checkoutSession = await stripe.checkout.sessions.create({
        line_items,
        shipping_options,
        mode: 'payment',
        client_reference_id,
        payment_method_types: ["card"],
        success_url: (process.env.NODE_ENV === 'production') ? `${process.env.APP_URL}orders/${createdOrder._id}` 
                                                             : `http://localhost:3000/orders/${createdOrder._id}`,
        cancel_url:(process.env.NODE_ENV === 'production') ? `${process.env.APP_URL}orders/${createdOrder._id}` 
                                                             : `http://localhost:3000/orders/${createdOrder._id}`
      });
      console.log('The checkout session', checkoutSession)
        return NextResponse.json(checkoutSession, {status: 201})
       
    } catch (error) {
        console.log(error)
        return NextResponse.json({message: 'Error in checkout'}, {status: 501})
    }
}

