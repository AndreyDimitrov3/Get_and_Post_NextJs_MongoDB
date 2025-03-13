"use client";

import { useEffect, useState } from "react";
import axios from "axios";

const Home = () => {
  const [books, setBooks] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    pages: "",
    rating: "",
    genres: "",
    reviews: "",
  });

  // Fetch the books from the backend
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get("/api/books");
        console.log("API Response:", response.data);
        setBooks(response.data.data || []);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, []);

  // Handle input changes for the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission for adding a new book
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newBook = {
        title: formData.title,
        author: formData.author,
        pages: Number(formData.pages),
        rating: Number(formData.rating),
        genres: formData.genres.split(",").map((genre) => genre.trim()),
        reviews: formData.reviews.split(",").map((review) => review.trim()),
      };

      // Send POST request to add a new book
      const response = await axios.post("/api/books", newBook);

      // Check if the response was successful
      if (response.data.success) {
        console.log("Book added successfully:", response.data.data);
        // Refresh the book list after adding the new book
        setBooks((prevBooks) => [...prevBooks, response.data.data]);
      }
    } catch (error) {
      console.error("Error adding book:", error);
    }

    // Clear the form after submission
    setFormData({
      title: "",
      author: "",
      pages: "",
      rating: "",
      genres: "",
      reviews: "",
    });
  };

  return (
    <div>
      <h1>Fetched documents from the API: </h1>
      <ul>
        {books.map((book) => (
          <li key={book._id}>
            <h2 className="inline">{book.title} </h2>
            <p className="inline">{book.author}</p>
          </li>
        ))}
      </ul>

      <h2>Add a New Book</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Author:</label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Pages:</label>
          <input
            type="number"
            name="pages"
            value={formData.pages}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Rating:</label>
          <input
            type="number"
            name="rating"
            value={formData.rating}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Genres (comma-separated):</label>
          <input
            type="text"
            name="genres"
            value={formData.genres}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Reviews (comma-separated):</label>
          <input
            type="text"
            name="reviews"
            value={formData.reviews}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">Add Book</button>
      </form>
    </div>
  );
};

export default Home;
