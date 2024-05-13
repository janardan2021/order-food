import MenuItem from "@/models/MenuItem"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import {options} from "@/app/api/auth/[...nextauth]/options.js"

export async function POST(req){
    try {
       const body = await req.json() 
       const formData = body.formData
      //  console.log(formData)
      
       const menuItem = await MenuItem.create(formData)
       if(menuItem) {
        return NextResponse.json({message: 'Menu Item Created'}, {status: 201})
       }else {
        return NextResponse.json({message: 'Error adding menu item!'}, {status: 501})
       }
    } catch (error) {
        // console.log(error)
        return NextResponse.json({message: 'Error adding menu item!'}, {status: 501})
    }
}

export async function GET(){

    try {
      const menuItems = await MenuItem.find({})
      if (menuItems) {
          return NextResponse.json(menuItems, {status: 201})
      } else {
        return NextResponse.json({message: 'No menus found.'}, {status: 501})
      }
    } catch (error) {
      return NextResponse.json({message: 'Error fetching menus.'}, {status: 501})
    }
  }

  export async function DELETE(req){
    const body = await req.json() 
    // console.log(body)
    try {
      const session = await getServerSession(options)
    //   console.log(session)
      if (session.user.isAdmin) {
        const menu = await MenuItem.findByIdAndDelete(body._id)
        // console.log(menu)
      if (menu) {
          return NextResponse.json(menu, {status: 201})
      } else {
        return NextResponse.json({message: 'No menu item  found'}, {status: 501})
      }
      } else {
        return NextResponse.json({message: 'Access denied'}, {status: 501})
      }
    } catch (error) {
      return NextResponse.json({message: 'Menu item deletion failed'}, {status: 501})
    }
  }