// generate jwt's for authentication
const jwt = require('jsonwebtoken')
const SECRET_KEY = 'kQAOcIgr/r6BI2JXK/OUYvM44JTRuhvWnUdWggBnclc='

/**
 * Generates a JWT token for a given user.
 * @param {string} webId - The WebID of the user.
 * @returns {string} - The generated JWT token.
 */
function generateToken (webId) {
  const payload = { webId }
  const options = { expiresIn: '72h' }
  return jwt.sign(payload, SECRET_KEY, options)
}

/**
 * Middleware to validate JWT token.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 */
function validateToken (req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    return res.status(401).send('Access Denied: No Token Provided!')
  }

  try {
    const verified = jwt.verify(token, SECRET_KEY)
    req.user = verified
    req.session = req.session || {}
    req.session.userId = verified.webId
    next()
  } catch (err) {
    res.status(400).send('Invalid Token')
  }
}

/**
 * Extract user information from the token.
 * @param {object} req - The request object.
 * @returns {object} - The user object from the token.
 */
function getUserFromToken (req) {
  return req.user
}

/**
 * Check if the user is the owner of the pod.
 * @param {object} user - The user object from the token.
 * @param {string} hostname - The hostname of the pod.
 * @returns {boolean} - True if the user is the owner of the pod.
 */
function isOwner (user, hostname) {
  const podOwner = `https://${hostname}/profile/card#me` // Assuming the owner WebID format
  return user.webId === podOwner
}

module.exports = {
  generateToken,
  validateToken,
  getUserFromToken,
  isOwner
}
