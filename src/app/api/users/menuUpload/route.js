import { NextResponse } from "next/server"
// import {cloudinary} from "@/utils/cloudinary.js"
import {v2 as cloudinary} from "cloudinary"
import { v4 as uuidv4 } from 'uuid';

import { getServerSession } from "next-auth"
import {options} from "@/app/api/auth/[...nextauth]/options.js"

// import User from "@/models/User"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
})

// const storage = new CloudinaryStorage ({
//     cloudinary,
//     params: {
//         folder: 'Order-Food',
//         allowedFormats: ['jpeg', 'png', 'jpg']
//     }
// })

export async function POST(req){
    // const body = await req.json() 
    const body = await req.formData() 
    const session = await getServerSession(options)
    // console.log(session)
    // const user = await User.findOne({email: session.user.email})
    // // console.log(user)
    
    if(body.get('file') && session.user.isAdmin === true) {
        const file = body.get('file')
        // Get the buffer version of the file
        const arrayBuffer = await file.arrayBuffer()
        const buffer = new Uint8Array(arrayBuffer)
        const imageInfo = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({
                folder:'Order-Food/menu',
                public_id: uuidv4(),
                use_filename: true,
                unique_filename: false,
                overwrite: true
            }, function (error, result) {
                if (error) {
                    reject(error)
                    return NextResponse.json({message: 'Error uploading image!'}, {status: 500})
                }
                
                resolve(result)
            }).end(buffer) 
        })
        // console.log(imageInfo)
        // const updatedUser = await User.updateOne({email: session.user.email}, { image: imageInfo.url });
        // console.log("Updated User from database", updatedUser)
        const url = imageInfo.url
        return NextResponse.json({url, message: 'Menu Item picture successfully added'}, {status: 201})
    }
    return NextResponse.json({message: 'Error uploading image!'}, {status: 500})
}