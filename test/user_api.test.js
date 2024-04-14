const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app')
const helper = require('./helper')

const api = supertest(app)

beforeEach(async () => {
  await helper.postUser(api)
})

afterAll(() => {
  mongoose.connection.close()
})

describe('Bad request(s) test', () => {
  test('invalid password response with:', async () => {
    const userToAdd = {
      username: 'mluukkai',
      name: 'Matti Lukkainen',
      password: '2',
    }

    await api
      .post('/api/users')
      .send(userToAdd)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })
})
