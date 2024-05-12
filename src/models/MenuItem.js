
import mongoose, { Schema } from 'mongoose';
mongoose.connect(process.env.MONGODB_URI)

const MenuItemSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    image: {
        type: String,
        required: false,
        default: 'none'
      },
    sizes: {
      type: [{
        size: String,
        price: Number
      }],
      required: true
    },
    addOns: {
        type: [{
          addOn: String,
          price: Number
        }],
        required: true
      }
  });
  
//   const MenuItem = mongoose.model('MenuItem', MenuItemSchema);
  // Create the Address model
const MenuItem = mongoose.models.MenuItem || mongoose.model('MenuItem', MenuItemSchema);

export default MenuItem;
