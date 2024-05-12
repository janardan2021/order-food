import User from "@/models/User"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import {options} from "@/app/api/auth/[...nextauth]/options.js"


export async function GET(){

    try {
      const session = await getServerSession(options)
    //   console.log(session)
      if (session.user.isAdmin) {
        const users = await User.find()
      if (users) {
          return NextResponse.json(users, {status: 201})
      } else {
        return NextResponse.json({message: 'No user users found'}, {status: 501})
      }
      } else {
        return NextResponse.json({message: 'Access denied'}, {status: 501})
      }
    } catch (error) {
      return NextResponse.json({message: 'No user users found'}, {status: 501})
    }
  }

  export async function PATCH(req){
    const body = await req.json() 
    console.log(body)
    try {
      const session = await getServerSession(options)
    //   console.log(session)
      if (session.user.isAdmin) {
        const user = await User.findByIdAndUpdate(body._id, body )
      if (user) {
          return NextResponse.json(user, {status: 201})
      } else {
        return NextResponse.json({message: 'No user  found'}, {status: 501})
      }
      } else {
        return NextResponse.json({message: 'Access denied'}, {status: 501})
      }
    } catch (error) {
      return NextResponse.json({message: 'User update failed'}, {status: 501})
    }
  }



  export async function DELETE(req){
    const body = await req.json() 
    // console.log(body)
    try {
      const session = await getServerSession(options)
    //   console.log(session)
      if (session.user.isAdmin) {
        const user = await User.findByIdAndDelete(body._id)
      if (user) {
          return NextResponse.json(user, {status: 201})
      } else {
        return NextResponse.json({message: 'No user  found'}, {status: 501})
      }
      } else {
        return NextResponse.json({message: 'Access denied'}, {status: 501})
      }
    } catch (error) {
      return NextResponse.json({message: 'User deletion failed'}, {status: 501})
    }
  }