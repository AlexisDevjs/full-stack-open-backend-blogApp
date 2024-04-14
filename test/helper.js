const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
]

async function getAllBlogsOfDb() {
  const blogs = await Blog.find({})
  return blogs.map((b) => b.toJSON())
}

async function getAllUsersOfDb() {
  const users = await User.find({})
  return users.map((u) => u.toJSON())
}

async function postUser (api) {
  await User.deleteMany({})

  const user = {
    username: 'root',
    name: 'SuperUser',
    password: '123',
  }

  await api
    .post('/api/users')
    .send(user)
}

module.exports = {
  initialBlogs,
  getAllBlogsOfDb,
  getAllUsersOfDb,
  postUser
}
