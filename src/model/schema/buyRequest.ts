import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const { Schema } = mongoose;

const buyRequestSchema = new Schema({
  phone_name: String,
  category: String,
  description: [
    {
      'Storage Size': String,
      New: String,
      A1: String,
      A2: String,
      B1: String,
      B2: String,
      C: String,
      'C/B': String,
      'C/D': String,
    },
    { timestamps: true },
  ],
});

buyRequestSchema.plugin(mongoosePaginate);

const BuyRequest = mongoose.model('BuyRequest', buyRequestSchema);

export default BuyRequest;
