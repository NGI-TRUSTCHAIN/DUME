const AccountManager = require('../../models/account-manager')
const { PasswordAuthenticator } = require('../../models/authenticator')
// const { LoginRequest } = require('../../requests/login-request')
// const util = require('util')

/**
 * Authenticates the user using username, password, and WebID.
 * @param {string} username - The username of the user.
 * @param {string} password - The password of the user.
 * @param {string} webId - The WebID of the user.
 * @returns {Promise<boolean>} - Returns true if the user is valid, false otherwise.
 */
async function authenticateUser (username, password, webId, req) {
  const locals = req.app.locals
  try {
    const PASSWORD_AUTH = 'password'
    const host = locals.host // Use the host instance from app.locals
    const userStore = locals.oidc.users

    if (!host) {
      throw new Error('Host serverUri is not defined.')
    }

    if (!userStore) {
      throw new Error('User store is not defined.')
    }

    // Strip the WebID
    const url = new URL(webId)
    const strippedWebId = `${url.origin}`
    host.serverUri = strippedWebId
    console.log('Stripped WebId:', strippedWebId)

    // Initialize AccountManager
    const accountManager = AccountManager.from({ host, store: locals.ldp })

    // Create an instance of PasswordAuthenticator
    const authRequest = { body: { username, password } }
    const options = { authMethod: PASSWORD_AUTH, userStore, accountManager }
    const authenticator = PasswordAuthenticator.fromParams(authRequest, options)

    // Validate the user
    const validUser = await authenticator.findValidUser()

    // Compare the stripped WebID with validUser.webId and also compare the usernames
    const isWebIdValid = validUser && new URL(validUser.webId).origin === strippedWebId
    const isUsernameValid = validUser && validUser.username === username
    const isValid = isWebIdValid && isUsernameValid
    return isValid
  } catch (error) {
    console.error('Error in authenticateUser:', error)
    return false
  }
}

module.exports = authenticateUser
