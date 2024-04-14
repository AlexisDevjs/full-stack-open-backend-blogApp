const Blog = require('./models/blog')
const mongoose = require('mongoose')
require('dotenv').config()

const url = process.env.MONGODB_TEST_URI

mongoose.connect(url).then(() => {
  const blogToSave = new Blog({
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7
  })
  
  blogToSave.save().then((result) => console.log(result))
})


