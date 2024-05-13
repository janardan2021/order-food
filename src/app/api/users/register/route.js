// import User from "@/app/(models)/User.js"
import User from "@/models/User"
import { NextResponse } from "next/server"
import { v4 as uuidv4 } from 'uuid';

export async function POST(req){
    // console.log('Request received')
    try {
       const body = await req.json() 
       const userData = body.formData
    //    console.log(userData)

       if(!userData?.email || !userData?.password || !userData?.name){
        return NextResponse.json({message: 'All fields are required'}, {status: 400})
       }

       const duplicate = await User.findOne({email: userData.email})
       

       if (duplicate) {
        return NextResponse.json({message: 'Email already exists!'}, {status: 509})
       }

    //    const hashPassword = await bcrypt.hash(userData.password, 10)
    //    userData.password = hashPassword

       const user = await User.create({...userData, imageId : uuidv4()})
       return NextResponse.json({message: 'User Created'}, {status: 201})
    } catch (error) {
        // console.log(error)
        return NextResponse.json({message: 'Error', error}, {status: 500})
    }
}