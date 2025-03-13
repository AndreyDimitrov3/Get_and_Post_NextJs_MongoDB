import dbConnect from "../../lib/dbConnect";
import Book from "../../models/Post";
import Cors from "cors";

// Set up CORS middleware
const cors = Cors({
  methods: ["GET", "POST", "PUT", "HEAD"],
});

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

// The main handler for API requests
export default async function handler(req, res) {
  // Run the CORS middleware
  await runMiddleware(req, res, cors);

  const { method } = req;

  // Connect to the database
  await dbConnect();

  switch (method) {
    case "GET":
      try {
        // Fetch all books from the database
        const books = await Book.find({});
        res.status(200).json({ success: true, data: books });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
      break;

    case "POST":
      try {
        // Destructure the book details from the request body
        const { title, author, pages, rating, genres, reviews } = req.body;

        // Create a new book instance
        const newBook = new Book({
          title,
          author,
          pages,
          rating,
          genres,
          reviews,
        });

        // Save the new book to the database
        const savedBook = await newBook.save();

        // Respond with the saved book
        res.status(201).json({ success: true, data: savedBook });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
