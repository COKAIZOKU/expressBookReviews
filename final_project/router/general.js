const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({
        "username": username,
        "password": password
      });

      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }

  return res.status(404).json({message: "Unable to register user."});
});

function getBooksPromise(bookData) {
  return new Promise((resolve, reject) => {
    if (bookData) {
      resolve(bookData);
    } else {
      reject("No books found");
    }
  });
}
// Task 10: Get the list of all books using async/await
public_users.get('/',async function (req, res) {
  try {
    const bookList = await getBooksPromise(books);
    res.send(bookList);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Task 11: Get book details based on ISBN using Promise callbacks
public_users.get('/isbn/:isbn',function (req, res) {
  // Retrieve the isbn parameter from the request URL and send the corresponding book details
  const isbn = req.params.isbn;

  getBooksPromise(books[isbn])
    .then(result => res.send(result))
    .catch(error => res.send(error));
 });
  
// Task 12: Get book details based on author using Promise callbacks
public_users.get('/author/:author',function (req, res) {
  // Retrieve the author parameter from the request URL and send matching book details
  const author = req.params.author;
  let result = {};

  getBooksPromise(books)
    .then(bookList => {
      Object.keys(bookList).forEach((key) => {
        if (bookList[key].author === author) {
          result[key] = bookList[key];
        }
      });

      res.send(result);
    })
    .catch(error => res.send(error));
});

// Task 13: Get book details based on title using Promise callbacks
public_users.get('/title/:title',function (req, res) {
  // Retrieve the title parameter from the request URL and send matching book details
  const title = req.params.title;
  let result = {};

  getBooksPromise(books)
    .then(bookList => {
      Object.keys(bookList).forEach((key) => {
        if (bookList[key].title === title) {
          result[key] = bookList[key];
        }
      });

      res.send(result);
    })
    .catch(error => res.send(error));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  // Retrieve the isbn parameter from the request URL and send the corresponding book reviews
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

module.exports.general = public_users;
