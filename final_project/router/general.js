const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const {userName, password} = req.body;

    if (!userName || !password){
      return res.status(400).json({message: 'Invalid username of password'})
    } 
  
    if (users.includes(userName)){
      return res.status(400).json({message: 'User already exist'})
    } else {
      users.push({userName, password})
      return res.status(300).json({message: "User registered sucessfully"});
    }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    new Promise((resolve, reject) => {
		resolve(JSON.stringify(books))
	})
		.then((data) => {
			return res.status(200).json({ data })
		})
		.catch((error) => {
			return res.status(400).json({ message: error })
		})

});

public_users.get('/', async function (req, res) {
	try {
		const data = await new Promise((resolve, reject) => {
			resolve(JSON.stringify(books))
		})
		return res.status(200).json({ data })
	} catch (error) {
		return res.status(400).json({ message: error })
	}
})

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  new Promise((resolve, reject) => {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (!book) {
        reject("Book not found")
    } else {
        resolve(book)
    }
    }).then(data => {
        res.status(200).json(data)
    }).catch(err => {
        res.status(404).json({message: err})
    })
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  new Promise((resolve, reject) => {
    const author = req.params.author;
    const bookByAuthor = Object.values(books).filter(b => b.author === author)

    if (bookByAuthor.length > 0){
        resolve(bookByAuthor);
    } else {
        reject("No book found for this author")
    }
  }).then(data => {
    res.status(200).json(data)
  }).catch(err => {
    res.status(404).json({message: err})
  })
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    new Promise((resolve, reject) => {
        const title = req.params.title;
        const booksByTitle = Object.values(books).filter(book => book.title.includes(title))

        if (booksByTitle.length > 0){
            resolve(booksByTitle)
        }else {
            reject("No books found with this title")
        }
    }).then(data => {
        res.status(200).json(data)
    }).catch(err => {
        res.status(404).json({message: err})
    })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn
	const book = books[isbn]
	if (!book || !book.reviews) {
		return res.status(404).json({ message: 'Reviews not found for this book' })
	}
	return res.status(200).json(book.reviews)
});

module.exports.general = public_users;
