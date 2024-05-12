import {v2 as cloudinary} from "cloudinary"

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

export  {
    cloudinary,
    // storage
}