const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const tokenExtractor = (request, response, next) => {
  const auth = request.get('authorization')

  if (auth && auth.startsWith('Bearer')) {
    request.token = auth.replace('Bearer ', '')
  }

  next()
}

const userExtractor = async (request, response, next) => {
  if (request.method === 'POST' || request.method === 'DELETE') {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if (!decodedToken || !decodedToken.id) {
      return response.status(401).end()
    }

    const user = await User.findById(decodedToken.id)

    if (user) request.user = user
  }

  next()
}

const errorHandler = (error, request, response, next) => {
  logger.error('Error del mensaje:////', error.name)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'bad id format' })
  }

  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  if (error.name === 'SyntaxError') {
    return response.status(400).json({ error: error.message })
  }

  if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: error.message })
  }

  if (error.name === 'TokenExpiredError') {
    return response.status(401).json({ error: error.message })
  }

  next(error)
}

module.exports = {
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
}
