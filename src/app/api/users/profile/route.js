// import User from "@/app/(models)/User.js"
import { getServerSession } from "next-auth"
import {options} from "@/app/api/auth/[...nextauth]/options.js"
import User from "@/models/User"
import { NextResponse } from "next/server"

export async function PUT(req){
    const session = await getServerSession(options)
    // console.log("session in the profile route",session)
    try {
       const body = await req.json() 
       const name = body.name
    //    console.log(name)
       if(session.user.userType === 'credential'){
        await User.updateOne({email: session.user.email}, {name: name})
        return NextResponse.json({message: 'User Profile updated'}, {status: 201})
       } else {
        return NextResponse.json({message: `${session.user.role}'s profile cannot be updated`}, {status: 201})
       }
    } catch (error) {
        // console.log(error)
        return NextResponse.json({message: 'Error', error}, {status: 500})
    }
}