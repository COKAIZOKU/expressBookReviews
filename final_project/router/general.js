const express = require('express');
const axios = require('axios');
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

const bookApi = axios.create({
  adapter: () => {
    return Promise.resolve({
      data: books,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    });
  }
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  const response = await bookApi.get('/');
  res.send(JSON.stringify(response.data,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  // Retrieve the isbn parameter from the request URL and send the corresponding book details
  const isbn = req.params.isbn;
  
  res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  // Retrieve the author parameter from the request URL and send matching book details
  const author = req.params.author;
  let result = {};

  Object.keys(books).forEach((key) => {
    if (books[key].author === author) {
      result[key] = books[key];
    }
  });

  res.send(result);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  // Retrieve the title parameter from the request URL and send matching book details
  const title = req.params.title;
  let result = {};

  Object.keys(books).forEach((key) => {
    if (books[key].title === title) {
      result[key] = books[key];
    }
  });

  res.send(result);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  // Retrieve the isbn parameter from the request URL and send the corresponding book reviews
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

module.exports.general = public_users;
