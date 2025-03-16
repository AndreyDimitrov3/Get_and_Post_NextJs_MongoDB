import dbConnect from "../../lib/dbConnect";
import Book from "../../models/Book";
import Cors from "cors";

// CORS Middleware
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

export default async function handler(req, res) {
  try {
    await runMiddleware(req, res, cors);
    await dbConnect();

    const { method } = req;

    switch (method) {
      case "GET":
        try {
          const books = await Book.find({}).limit(10);
          return res.status(200).json({ success: true, data: books });
        } catch (error) {
          console.error("Error fetching books:", error);
          return res
            .status(500)
            .json({ success: false, error: "Failed to fetch books" });
        }

      case "POST":
        try {
          const { title, author, pages, rating, genres, reviews } = req.body;

          if (!title || !author || !pages) {
            return res
              .status(400)
              .json({ success: false, error: "Missing required fields" });
          }

          const newBook = new Book({
            title,
            author,
            pages,
            rating,
            genres,
            reviews,
          });

          const savedBook = await newBook.save();
          return res.status(201).json({ success: true, data: savedBook });
        } catch (error) {
          return res
            .status(500)
            .json({ success: false, error: "Failed to add book" });
        }

      default:
        return res
          .status(400)
          .json({ success: false, error: "Invalid request method" });
    }
  } catch (error) {
    console.error("API error:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
}
