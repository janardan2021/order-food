import { headers } from "next/headers";
import Stripe from "stripe";
import Order from "@/models/Order"

const stripe = Stripe(process.env.STRIPE_SK, 
            // {
            // apiVersion: "2024-04-10",
            // }
     );

const webHookSecret = process.env.STRIPE_WEBHOOK_SECRET;



export async function POST(request){
if (request.method === "POST") {
    const body = await request.text();
    // console.log('This is the body', body)
    const sig = headers().get("stripe-signature");
    //   console.log('This is the signature', sig)
    let event;

    try {
       event = stripe.webhooks.constructEvent(body, sig, webHookSecret);
    } catch (err) {
        // console.log(err.message)
        return new Response(`Webhook Error: ${err}`, { status: 400});
    }

    // console.log(event)
    
    // Handle the event
    switch (event.type) {
    case 'checkout.session.completed':
        const checkoutSessionCompleted = event.data.object;
        if(checkoutSessionCompleted.status === 'complete' && 
        checkoutSessionCompleted.payment_status === 'paid'){
            const order = await Order.findById(JSON.parse(checkoutSessionCompleted.client_reference_id))
            if (order) {
                order.isPaid = true
                order.paidAt = Date.now()
                order.paymentResult = {
                id: checkoutSessionCompleted.payment_intent,
                status: 'complete',
                update_time:Date.now().toString() ,
                email_address: checkoutSessionCompleted.customer_details.email
                }
                await order.save() 
                }
        }
        break;
    default:
        // console.log(`Unhandled event type ${event.type}`);
        break;
    }

    return new Response({ received: true }, { status: 200});
} else {
    return new Response({ message: "Method Not Allowed"}, { status: 405});
}
};

