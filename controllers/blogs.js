const blogsRouter = require('express').Router()

const User = require('../models/user')
const Blog = require('../models/blog')

blogsRouter.post('/', async (request, response) => {
  const { body, user } = request

  if (!user) {
    return response.status(401).json({ error: 'missing or invalid jwt' })
  }

  const userOfDb = await User.findById(user.id)

  const blog = new Blog({
    ...body,
    likes: body.likes || 0,
    user: userOfDb._id,
  })

  userOfDb.blogs = userOfDb.blogs.concat(blog)
  await userOfDb.save()

  const savedBlog = await blog.save()

  response.status(201).json(savedBlog)
})

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blogToReturn = await Blog.findById(request.params.id).populate('user', {
    username: 1,
    name: 1,
  })

  if (blogToReturn) {
    response.json(blogToReturn)
  } else {
    response.status(404).end()
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const id = request.params.id
  const blog = request.body

  if (!blog.title) {
    return response.status(400).send({ error: 'Title missing' })
  }

  if (!blog.author) {
    return response.status(400).send({ error: 'Author  missing' })
  }

  if (!blog.url) {
    return response.status(400).send({ error: 'Url  missing' })
  }

  const options = {
    new: true,
    runValidators: true,
    context: 'query',
  }

  const updatedBlog = await Blog.findByIdAndUpdate(id, blog, options)

  response.json(updatedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const user = request.user

  if (!(user || user.id)) {
    return response.status(401).end()
  }

  const blogToDelete = await Blog.findById(request.params.id)

  if (!blogToDelete) {
    return response.status(404).end()
  }

  if (user._id.toString() !== blogToDelete.user.toString()) {
    return response.status(401).end()
  }

  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

module.exports = blogsRouter
