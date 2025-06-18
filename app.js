const express = require("express");
const path = require("path");
const app = express();
const books = require("./book-data").books;
const methodOverride = require("method-override");
// Set the view engine to pug

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
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

app.get("/add", (req, res) => {
  res.render("addbook");
});
app.post("/", (req, res) => {
  book.create(req.body);
  res.redirect("/");
});
app.get("/edit/:id", (req, res) => {
  try {
    const isbn = req.params.id;
    const book = books.findOne({isbn: isbn});
    if (book) {
      res.render("update", {book});
    } else {
      res.status(404).send("book not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("server error");
  }
});
app.put("/:id", (req, res) => {
  const isbn = req.params.id;
  books.findOneAndUpdate({isbn: isbn}, req.body);
  res.redirect("/");
});
app.delete("/:id", (req, res) => {
  books.deleteOne({isbn: req.params.id});
  res.redirect("/");
});

// Start the server
app.listen(3000, () => console.log("Server running on port 3000"));
