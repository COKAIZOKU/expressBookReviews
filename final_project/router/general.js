const express = require('express');
const axios = require('axios').default;
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

const booksUrl = 'data:application/json,' + encodeURIComponent(JSON.stringify(books));

// Task 10: Get the list of all books using async/await with Axios
public_users.get('/',async function (req, res) {
  try {
    const response = await axios.get(booksUrl);
    const bookData = JSON.parse(response.data.toString());
    res.send(JSON.stringify(bookData,null,4));
  } catch (error) {
    res.status(500).json({message: "Unable to retrieve books"});
  }
});

// Task 11: Get book details based on ISBN using Promise callbacks with Axios
public_users.get('/isbn/:isbn',function (req, res) {
  // Retrieve the isbn parameter from the request URL and send the corresponding book details
  const isbn = req.params.isbn;

  axios.get(booksUrl)
    .then(response => {
      const bookData = JSON.parse(response.data.toString());
      res.send(bookData[isbn]);
    })
    .catch(error => {
      res.status(500).json({message: "Unable to retrieve book"});
    });
 });
  
// Task 12: Get book details based on author using Promise callbacks with Axios
public_users.get('/author/:author',function (req, res) {
  // Retrieve the author parameter from the request URL and send matching book details
  const author = req.params.author;

  axios.get(booksUrl)
    .then(response => {
      const bookData = JSON.parse(response.data.toString());
      let result = {};

      Object.keys(bookData).forEach((key) => {
        if (bookData[key].author === author) {
          result[key] = bookData[key];
        }
      });

      res.send(result);
    })
    .catch(error => {
      res.status(500).json({message: "Unable to retrieve books by author"});
    });
});

// Task 13: Get book details based on title using Promise callbacks with Axios
public_users.get('/title/:title',function (req, res) {
  // Retrieve the title parameter from the request URL and send matching book details
  const title = req.params.title;

  axios.get(booksUrl)
    .then(response => {
      const bookData = JSON.parse(response.data.toString());
      let result = {};

      Object.keys(bookData).forEach((key) => {
        if (bookData[key].title === title) {
          result[key] = bookData[key];
        }
      });

      res.send(result);
    })
    .catch(error => {
      res.status(500).json({message: "Unable to retrieve books by title"});
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  // Retrieve the isbn parameter from the request URL and send the corresponding book reviews
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

module.exports.general = public_users;
