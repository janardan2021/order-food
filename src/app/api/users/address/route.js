// import User from "@/app/(models)/User.js"
import Address from "@/models/Address"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import {options} from "@/app/api/auth/[...nextauth]/options.js"

export async function POST(req){
    try {
       const body = await req.json() 
       const addressData = body.addressData
      //  console.log(addressData)
      
       const duplicate = await Address.findOne({user_email: addressData.user_email})
       
       if (duplicate) {
        const updatedAddress = await Address.updateOne({user_email: addressData.user_email}, {...addressData});
        if(updatedAddress) {
            return NextResponse.json({message: 'User Address updated!'}, {status: 201})
        }
      }

       const newAddress = await Address.create({...addressData})
       if(newAddress) {
        return NextResponse.json({message: 'User Address Created'}, {status: 201})
       }
    } catch (error) {
        // console.log(error)
        return NextResponse.json({message: 'Error adding / updating address'}, {status: 501})
    }
}

export async function GET(){

  try {
    const session = await getServerSession(options)
    const userAddress = await Address.findOne({user_email: session.user.email})
    if (userAddress) {
        return NextResponse.json(userAddress, {status: 201})
    } else {
      return NextResponse.json({message: 'No user address found'}, {status: 501})
    }
  } catch (error) {
    return NextResponse.json({message: 'No user address found'}, {status: 501})
  }
}
