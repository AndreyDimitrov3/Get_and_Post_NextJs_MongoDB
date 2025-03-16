import mongoose from "mongoose";

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  pages: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  genres: {
    type: [String],
    required: true,
  },
  reviews: [
    {
      name: {
        type: String,
        required: true,
      },
      body: {
        type: String,
        required: true,
      },
    },
  ],
});

export default mongoose.models.Book || mongoose.model("Book", BookSchema);
