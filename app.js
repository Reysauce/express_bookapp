const express = require("express");
const path = require("path");
const app = express();
const books = require("./book-data").books;

// Set the view engine to pug

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Define routes here
app.get("/", (req, res) => {
  res.render("index", {user: {name: `Rey`}, books});
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

// Start the server
app.listen(3000, () => console.log("Server running on port 3000"));
