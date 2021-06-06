import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const { Schema } = mongoose;

const sellRequestSchema = new Schema({
  phone_name: String,
  category: String,
  description: [
    {
      storage_size: String,
      new: String,
      a1: String,
      a2: String,
      b1: String,
      b2: String,
      c: String,
      'c/b': String,
      'c/d': String,
    },
    { timestamps: true },
  ],
});

sellRequestSchema.plugin(mongoosePaginate);

export default sellRequestSchema;
