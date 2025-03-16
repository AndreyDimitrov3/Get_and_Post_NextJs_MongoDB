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
    reviews: [{ name: "", body: "" }],
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
  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const updatedReviews = [...formData.reviews];
    updatedReviews[index] = { ...updatedReviews[index], [name]: value };

    setFormData((prev) => ({
      ...prev,
      reviews: updatedReviews,
    }));
  };

  const handleAddReview = () => {
    setFormData((prev) => ({
      ...prev,
      reviews: [...prev.reviews, { name: "", body: "" }],
    }));
  };

  // Handle form submission for adding a new book
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newBook = {
      title: formData.title,
      author: formData.author,
      pages: Number(formData.pages),
      rating: Number(formData.rating),
      genres: formData.genres.split(",").map((genre) => genre.trim()),
      reviews: formData.reviews.filter((review) => review.name && review.body),
    };

    try {
      const response = await axios.post("/api/books", newBook);
      if (response.data.success) {
        console.log("Book added successfully:", response.data.data);
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
      reviews: [{ name: "", body: "" }],
    });
  };

  return (
    <div className="p-8">
      <h1 className="text-center text-4xl font-bold mt-4 mb-4">
        Fetched documents from the API:
      </h1>
      <ul className="flex flex-col gap-1">
        {books.map((book) => (
          <li
            key={book._id}
            tabIndex={0}
            className="collapse collapse-plus bg-base-100 border-white border"
          >
            <div className="flex between- collapse-title font-semibold">
              <p className="text-lg">
                {book.title} by {book.author}
              </p>
            </div>
            <div className="collapse-content text-base">
              <p className="font-bold">Pages: {book.pages}</p>
              <p className="font-bold">Rating: {book.rating}</p>
              <p className="font-bold">Genres: {book.genres.join(", ")}</p>
              <p className="font-bold">Reviews:</p>
              <ul>
                {book.reviews && book.reviews.length > 0 ? (
                  book.reviews.map((review, idx) => (
                    <li key={idx}>
                      {review.name}: {review.body}
                    </li>
                  ))
                ) : (
                  <li>No reviews available</li>
                )}
              </ul>
            </div>
          </li>
        ))}
      </ul>

      <button
        className="btn btn-wide max-w-none bg-primary w-full mt-2"
        onClick={() => document.getElementById("my_modal_2").showModal()}
      >
        Add a New Book
      </button>

      <dialog id="my_modal_2" className="modal">
        <div className="modal-box">
          <form onSubmit={handleSubmit}>
            <div className="flex justify-between mb-3">
              <label className="text-lg text-bold ml-1">Title: </label>
              <input
                type="text"
                name="title"
                placeholder="Why We Sleep"
                className="input"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
              />
            </div>
            <div className="flex justify-between mb-3">
              <label className="text-lg text-bold ml-1">Author: </label>
              <input
                type="text"
                name="author"
                placeholder="Matthew Walker"
                className="input"
                value={formData.author}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    author: e.target.value,
                  }))
                }
              />
            </div>
            <div className="flex justify-between mb-3">
              <label className="text-lg text-bold ml-1">Pages: </label>
              <input
                type="number"
                name="pages"
                placeholder="368"
                className="input"
                value={formData.pages}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    pages: e.target.value,
                  }))
                }
              />
            </div>
            <div className="flex justify-between mb-3">
              <label className="text-lg text-bold ml-1">Rating: </label>
              <input
                type="number"
                name="rating"
                placeholder="4.7"
                className="input"
                value={formData.rating}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    rating: e.target.value,
                  }))
                }
              />
            </div>
            <div className="flex justify-between mb-3">
              <label className="text-lg text-bold ml-1">
                Genres (comma-separated):{" "}
              </label>
              <input
                type="text"
                name="genres"
                placeholder="Educational"
                className="input"
                value={formData.genres}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    genres: e.target.value,
                  }))
                }
              />
            </div>

            {/* Review Form */}
            <div>
              <label className="text-lg text-bold ml-1">Reviews: </label>
              {formData.reviews.map((review, index) => (
                <div key={index} className="flex mb-3">
                  <input
                    type="text"
                    name="name"
                    value={review.name}
                    onChange={(e) => handleInputChange(e, index)}
                    placeholder="Reviewer Name"
                    className="input w-1/2"
                  />
                  <input
                    type="text"
                    name="body"
                    value={review.body}
                    onChange={(e) => handleInputChange(e, index)}
                    placeholder="Review Body"
                    className="input w-1/2 ml-2"
                  />
                </div>
              ))}
              <div className="flex justify-between items-center">
                <button
                  type="button"
                  className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700 mt-2"
                  onClick={handleAddReview}
                >
                  Add Review
                </button>

                <button className="btn btn-primary" type="submit">
                  Add Book
                </button>
              </div>
            </div>
          </form>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default Home;
