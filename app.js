const express = require("express");
const path = require("path");
const app = express();
const books = require("./book-data").books;
const methodOverride = require("method-override");
const Book = require("./models/Books");
const mongoose = require("mongoose");
require("dotenv").config();
// Set the view engine to pug

mongoose.connect(`${process.env.MONGO_DB_API_KEY}`);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
// Define routes here
app.get("/", async function (req, res) {
  const books = await Book.find();
  res.render("index", {books});
});
app.get("/book-detail/:isbn", (req, res) => {
  const book = books.filter(checkBook);

  function checkBook(book) {
    if (book.isbn === req.params.isbn) {
      return book;
    }
  }

  res.render("book-detail", {book: book[0], user: {name: `Rey`}});
});

app.get("/add", (req, res) => {
  res.render("addbook");
});
app.post("/add", async (req, res) => {
  await Book.create(req.body);
  res.redirect("/");
});
app.get("/:isbn/edit", (req, res) => {
  // Fetch the book by ISBN and render the edit form
  const book = books.find((book) => book.isbn === req.params.isbn);
  if (!book) {
    return res.status(404).send("Couldnt Find Book!");
  }
  res.render("update", {book});
});
app.put("/:isbn", (req, res) => {
  const index = books.findIndex((book) => book.isbn === req.params.isbn);
  if (index === -1) {
    return res.status(404).send("Couldnt Find Book!");
  }
  // Handle updating the book
  // Update book in database or array, then redirect
  books[index] = {
    ...books[index],
    ...req.body,
    isbn: req.params.isbn,
  };
  res.redirect("/");
});
app.delete("/:isbn", (req, res) => {
  const index = books.findIndex((book) => book.isbn === req.params.isbn);
  if (index === -1) {
    return res.status(404).send("Couldnt Find Book!");
  }
  // Handle deleting the book
  // Remove book from database or array, then redirect
  books.splice(index, 1);
  res.redirect("/");
});
app.listen(3000, () => console.log("Server running on port 3000"));
