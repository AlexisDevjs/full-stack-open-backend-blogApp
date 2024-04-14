const mongoose = require('mongoose')
const supertest = require('supertest')

const testHelper = require('./helper')
const Blog = require('../models/blog')
const app = require('../app')

const api = supertest(app)

const { initialBlogs } = testHelper

beforeEach(async () => {
  await Blog.deleteMany({})

  for (const blog of initialBlogs) {
    let blogToSave = new Blog(blog)
    await blogToSave.save()
  }
})

afterAll(() => {
  mongoose.connection.close()
})

describe('testing GET requests', () => {
  test('all blogs quantity', async () => {
    const response = await api
      .get('/api/blogs')
      .expect('Content-Type', /application\/json/)
      .expect(200)

    expect(response.body).toHaveLength(initialBlogs.length)
  })

  test('Is ID field defined as `id` insted of `_id`', async () => {
    const blogs = await testHelper.getAllBlogsOfDb()
    const blogToCheck = blogs[0]

    expect(blogToCheck.id).toBeDefined()
  })
})

describe('testing POST requests', () => {
  test('Adding new blog', async () => {
    const blogToAdd = {
      title: 'Type wars',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
      likes: 2,
    }

    await testHelper.postUser(api)

    const responseLogin = await api
      .post('/login')
      .send({ username: 'root', password: '123' })

    const token = responseLogin.body.token

    await api
      .post('/api/blogs')
      .set({ Authorization: `Bearer ${token}` })
      .send(blogToAdd)
      .expect('Content-Type', /application\/json/)
      .expect(201)

    const blogsInDb = await testHelper.getAllBlogsOfDb()

    expect(blogsInDb).toHaveLength(initialBlogs.length + 1)
  })

  test('if likes is not defined is 0', async () => {
    const blogToAdd = {
      title: 'Type wars',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    }

    await testHelper.postUser(api)

    const responseLogin = await api
      .post('/login')
      .send({ username: 'root', password: '123' })

    const token = responseLogin.body.token

    const response = await api
      .post('/api/blogs')
      .set({ Authorization: `Bearer ${token}` })
      .send(blogToAdd)
      .expect('Content-Type', /application\/json/)
      .expect(201)

    const addedBlog = response.body

    expect(addedBlog.likes).toBe(0)
  })

  test('post blog with incomplete data', async () => {
    const blogToAdd = {
      likes: 20,
    }

    await testHelper.postUser(api)

    const responseLogin = await api
      .post('/login')
      .send({
        username: 'root',
        password: '123',
      })

    const token = responseLogin.body.token

    await api
      .post('/api/blogs')
      .set({ Authorization: `Bearer ${token}` })
      .send(blogToAdd)
      .expect(400)
  })
})
