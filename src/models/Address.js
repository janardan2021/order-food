import mongoose, { Schema } from 'mongoose';
mongoose.connect(process.env.MONGODB_URI)

// Define the Address schema
const addressSchema = new mongoose.Schema({
  user_email: {
        type: String,
        required: true
      },
  street: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  postalCode: {
    type: String,
    required: true
  }
});

// Create the Address model
const Address = mongoose.models.Address || mongoose.model('Address', addressSchema);

export default Address;

