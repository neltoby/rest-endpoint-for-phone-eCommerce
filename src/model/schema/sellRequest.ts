import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const { Schema } = mongoose;

const sellRequestSchema = new Schema({
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

sellRequestSchema.plugin(mongoosePaginate);

const SellRequest = mongoose.model('SellRequest', sellRequestSchema);

export default SellRequest;
