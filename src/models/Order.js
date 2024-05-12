import mongoose, { Schema } from 'mongoose';
mongoose.connect(process.env.MONGODB_URI)

const OrderSchema = new mongoose.Schema({
    email: {type: String, required: true},
    name: {type: String, required: true},
    menuItems: [
        {
            menuName: {type: String, required: true},
            menuQty: {type: Number, required: true},
            menuSize: {
                size: {type: String, required: true},
                price: {type: Number, required: true},
            },
            menuAddOns: [
                     {
                        addOn: {type: String, required: true},
                        price: {type: Number, required: true},
                     }
                
            ],
            addOnsTotal: {type: Number, required: true},
            menuItemTotal: {type: Number, required: true}
        }
    ],
    address: {
        street: {type: String, required: true},
        city: {type: String, required: true},
        postalCode: {type: String, required: true},
        state: {type: String, required: true},
        country: {type: String, required: true}
    },
    paymentResult: {
        id: {type: String},
        status: {type: String},
        update_time: {type: String},
        email_address: {type: String}
    },
    deliveryFee: {
        type: Number,
        required: true,
        default: 10.00
    },
    total: {
        type: Number,
        required: true,
        default: 0.0
    },
    isPaid: {
        type: Boolean,
        required: true,
        default: false
    },
    paidAt: {
        type: Date
    },
    isDelivered: {
        type: Boolean,
        required: true,
        default: false
    },
    deliveredAt: {
        type: Date
    }


}, {timestamps:true});

const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

export default Order;