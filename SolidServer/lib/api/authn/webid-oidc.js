'use strict'

/**
 * OIDC Relying Party API handler module.
 */

const express = require('express')
// const util = require('util')
const { routeResolvedFile } = require('../../utils')
const bodyParser = require('body-parser').urlencoded({ extended: false })
const OidcManager = require('../../models/oidc-manager')
const { LoginRequest } = require('../../requests/login-request')
const { SharingRequest } = require('../../requests/sharing-request')

const restrictToTopDomain = require('../../handlers/restrict-to-top-domain')

const PasswordResetEmailRequest = require('../../requests/password-reset-email-request')
const PasswordChangeRequest = require('../../requests/password-change-request')

const { AuthCallbackRequest } = require('@solid/oidc-auth-manager').handlers

const { generateToken } = require('../../jwtoken')

const authenticateUser = require('./authenticate-user')

/**
 * Sets up OIDC authentication for the given app.
 *
 * @param app {Object} Express.js app instance
 * @param argv {Object} Config options hashmap
 */
function initialize (app, argv) {
  const oidc = OidcManager.fromServerConfig(argv)
  app.locals.oidc = oidc
  oidc.initialize()

  // Attach the OIDC API
  app.use('/', middleware(oidc))

  // Perform the actual authentication
  app.use('/', async (req, res, next) => {
    oidc.rs.authenticate({ tokenTypesSupported: argv.tokenTypesSupported })(req, res, (err) => {
      // Error handling should be deferred to the ldp in case a user with a bad token is trying
      // to access a public resource
      if (err) {
        req.authError = err
        res.status(200)
      }
      next()
    })
  })

  // Expose session.userId
  app.use('/', (req, res, next) => {
    oidc.webIdFromClaims(req.claims)
      .then(webId => {
        if (webId) {
          req.session.userId = webId
        }

        next()
      })
      .catch(err => {
        const error = new Error('Could not verify Web ID from token claims')
        error.statusCode = 401
        error.statusText = 'Invalid login'
        error.cause = err

        console.error(err)

        next(error)
      })
  })
}

/**
 * Returns a router with OIDC Relying Party and Identity Provider middleware:
 *
 * @method middleware
 *
 * @param oidc {OidcManager}
 *
 * @return {Router} Express router
 */
function middleware (oidc) {
  const router = express.Router('/')

  // User-facing Authentication API
  /**
   * @api {get} /login Display login form
   * @apiName GetLoginForm
   * @apiGroup Authentication
   * @apiPermission none
   * @apiSuccess {String} HTML Login form
   * @apiExample {curl} Example usage:
   *    curl -i https://dume-arditi.com/login
   * @apiExample {javascript} Example usage:
   *    fetch('https://dume-arditi.com/login')
   *      .then(response => response.text())
   *      .then(data => console.log(data));
   */
  router.get(['/login', '/signin'], LoginRequest.get)

  /**
   * @api {post} /login/password Authenticate using username and password
   * @apiName LoginPassword
   * @apiGroup Authentication
   * @apiPermission none
   * @apiHeader {String} Content-Type application/x-www-form-urlencoded
   * @apiParam {String} username The username of the account
   * @apiParam {String} password The password of the account
   * @apiSuccess {String} message Success message
   * @apiExample {curl} Example usage:
   *    curl -X POST https://dume-arditi.com/login/password \
   *    -H "Content-Type: application/x-www-form-urlencoded" \
   *    -d 'username=testuser&password=secret'
   * @apiExample {javascript} Example usage:
   *    fetch('https://dume-arditi.com/login/password', {
   *      method: 'POST',
   *      headers: {
   *        'Content-Type': 'application/x-www-form-urlencoded'
   *      },
   *      body: new URLSearchParams({
   *        username: 'testuser',
   *        password: 'secret'
   *      })
   *    })
   *    .then(response => response.text())
   *    .then(data => console.log(data));
   */
  router.post('/login/password', bodyParser, LoginRequest.loginPassword)

  /**
   * @api {post} /login/tls Authenticate using TLS
   * @apiName LoginTLS
   * @apiGroup Authentication
   * @apiPermission none
   * @apiHeader {String} Content-Type application/x-www-form-urlencoded
   * @apiParam {String} username The username of the account
   * @apiParam {String} certificate The TLS certificate
   * @apiSuccess {String} message Success message
   * @apiExample {curl} Example usage:
   *    curl -X POST https://dume-arditi.com/login/tls \
   *    -H "Content-Type: application/x-www-form-urlencoded" \
   *    -d 'username=testuser&certificate=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A...'
   * @apiExample {javascript} Example usage:
   *    fetch('https://dume-arditi.com/login/tls', {
   *      method: 'POST',
   *      headers: {
   *        'Content-Type': 'application/x-www-form-urlencoded'
   *      },
   *      body: new URLSearchParams({
   *        username: 'testuser',
   *        certificate: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A...'
   *      })
   *    })
   *    .then(response => response.text())
   *    .then(data => console.log(data));
   */
  router.post('/login/tls', bodyParser, LoginRequest.loginTls)

  /**
   * @api {get} /sharing Display sharing settings form
   * @apiName GetSharingForm
   * @apiGroup Sharing
   * @apiPermission authenticated
   * @apiSuccess {String} HTML Sharing settings form
   * @apiExample {curl} Example usage:
   *    curl -i https://dume-arditi.com/sharing
   * @apiExample {javascript} Example usage:
   *    fetch('https://dume-arditi.com/sharing')
   *      .then(response => response.text())
   *      .then(data => console.log(data));
   */
  router.get('/sharing', SharingRequest.get)

  /**
   * @api {post} /sharing Update sharing settings
   * @apiName UpdateSharingSettings
   * @apiGroup Sharing
   * @apiPermission authenticated
   * @apiHeader {String} Content-Type application/x-www-form-urlencoded
   * @apiParam {String} access_mode The access mode (read/write)
   * @apiParam {Boolean} consent Whether the user consents
   * @apiParam {String} app_origin The origin of the application
   * @apiSuccess {String} message Success message
   * @apiExample {curl} Example usage:
   *    curl -X POST https://dume-arditi.com/sharing \
   *    -H "Content-Type: application/x-www-form-urlencoded" \
   *    -d 'access_mode=read&consent=true&app_origin=https://app.example.com'
   * @apiExample {javascript} Example usage:
   *    fetch('https://dume-arditi.com/sharing', {
   *      method: 'POST',
   *      headers: {
   *        'Content-Type': 'application/x-www-form-urlencoded'
   *      },
   *      body: new URLSearchParams({
   *        access_mode: 'read',
   *        consent: true,
   *        app_origin: 'https://app.example.com'
   *      })
   *    })
   *    .then(response => response.text())
   *    .then(data => console.log(data));
   */
  router.post('/sharing', bodyParser, SharingRequest.share)

  /**
   * @api {get} /account/password/reset Display password reset form
   * @apiName GetPasswordResetForm
   * @apiGroup Account
   * @apiPermission none
   * @apiSuccess {String} HTML Password reset form
   * @apiExample {curl} Example usage:
   *    curl -i https://dume-arditi.com/account/password/reset
   * @apiExample {javascript} Example usage:
   *    fetch('https://dume-arditi.com/account/password/reset')
   *      .then(response => response.text())
   *      .then(data => console.log(data));
   */
  router.get('/account/password/reset', restrictToTopDomain, PasswordResetEmailRequest.get)

  /**
   * @api {post} /account/password/reset Request password reset email
   * @apiName RequestPasswordResetEmail
   * @apiGroup Account
   * @apiPermission none
   * @apiHeader {String} Content-Type application/x-www-form-urlencoded
   * @apiParam {String} username The username of the account
   * @apiSuccess {String} message Success message
   * @apiExample {curl} Example usage:
   *    curl -X POST https://dume-arditi.com/account/password/reset \
   *    -H "Content-Type: application/x-www-form-urlencoded" \
   *    -d 'username=testuser'
   * @apiExample {javascript} Example usage:
   *    fetch('https://dume-arditi.com/account/password/reset', {
   *      method: 'POST',
   *      headers: {
   *        'Content-Type': 'application/x-www-form-urlencoded'
   *      },
   *      body: new URLSearchParams({
   *        username: 'testuser'
   *      })
   *    })
   *    .then(response => response.text())
   *    .then(data => console.log(data));
   */
  router.post('/account/password/reset', restrictToTopDomain, bodyParser, PasswordResetEmailRequest.post)

  /**
   * @api {get} /account/password/change Display password change form
   * @apiName GetPasswordChangeForm
   * @apiGroup Account
   * @apiPermission none
   * @apiParam {String} token The one-time reset password token
   * @apiSuccess {String} HTML Password change form
   * @apiExample {curl} Example usage:
   *    curl -i https://dume-arditi.com/account/password/change?token=someToken
   * @apiExample {javascript} Example usage:
   *    fetch('https://dume-arditi.com/account/password/change?token=someToken')
   *      .then(response => response.text())
   *      .then(data => console.log(data));
   */
  router.get('/account/password/change', restrictToTopDomain, PasswordChangeRequest.get)

  /**
   * @api {post} /account/password/change Change password
   * @apiName ChangePassword
   * @apiGroup Account
   * @apiPermission none
   * @apiHeader {String} Content-Type application/x-www-form-urlencoded
   * @apiParam {String} token The one-time reset password token
   * @apiParam {String} newPassword The new password for the account
   * @apiSuccess {String} message Success message
   * @apiExample {curl} Example usage:
   *    curl -X POST https://dume-arditi.com/account/password/change \
   *    -H "Content-Type: application/x-www-form-urlencoded" \
   *    -d 'token=someToken&newPassword=newSecret'
   * @apiExample {javascript} Example usage:
   *    fetch('https://dume-arditi.com/account/password/change', {
   *      method: 'POST',
   *      headers: {
   *        'Content-Type': 'application/x-www-form-urlencoded'
   *      },
   *      body: new URLSearchParams({
   *        token: 'someToken',
   *        newPassword: 'newSecret'
   *      })
   *    })
   *    .then(response => response.text())
   *    .then(data => console.log(data));
   */
  router.post('/account/password/change', restrictToTopDomain, bodyParser, PasswordChangeRequest.post)

  /**
   * @api {get} /.well-known/solid/logout/ Redirect to logout procedure
   * @apiName Logout
   * @apiGroup Authentication
   * @apiPermission none
   * @apiSuccess {String} Redirect to logout procedure
   * @apiExample {curl} Example usage:
   *    curl -i https://dume-arditi.com/.well-known/solid/logout/
   * @apiExample {javascript} Example usage:
   *    fetch('https://dume-arditi.com/.well-known/solid/logout/')
   *      .then(response => response.text())
   *      .then(data => console.log(data));
   */
  router.get('/.well-known/solid/logout/', (req, res) => res.redirect('/logout'))

  /**
   * @api {get} /goodbye Display goodbye message
   * @apiName GetGoodbye
   * @apiGroup Authentication
   * @apiPermission none
   * @apiSuccess {String} HTML Goodbye message
   * @apiExample {curl} Example usage:
   *    curl -i https://dume-arditi.com/goodbye
   * @apiExample {javascript} Example usage:
   *    fetch('https://dume-arditi.com/goodbye')
   *      .then(response => response.text())
   *      .then(data => console.log(data));
   */
  router.get('/goodbye', (req, res) => { res.render('auth/goodbye') })

  // The relying party callback is called at the end of the OIDC signin process
  /**
   * @api {get} /api/oidc/rp/:issuer_id OIDC relying party callback
   * @apiName OIDCCallback
   * @apiGroup Authentication
   * @apiPermission none
   * @apiParam {String} issuer_id The OIDC issuer ID
   * @apiSuccess {String} message OIDC callback handled
   * @apiExample {curl} Example usage:
   *    curl -i https://dume-arditi.com/api/oidc/rp/:issuer_id
   * @apiExample {javascript} Example usage:
   *    fetch('https://dume-arditi.com/api/oidc/rp/:issuer_id')
   *      .then(response => response.text())
   *      .then(data => console.log(data));
   */
  router.get('/api/oidc/rp/:issuer_id', AuthCallbackRequest.get)

  // Static assets related to authentication
  const authAssets = [
    ['/.well-known/solid/login/', '../static/popup-redirect.html', false],
    ['/common/', 'solid-auth-client/dist-popup/popup.html']
  ]
  authAssets.map(args => routeResolvedFile(router, ...args))

  // Initialize the OIDC Identity Provider routes/api
  // router.get('/.well-known/openid-configuration', discover.bind(provider))
  // router.get('/jwks', jwks.bind(provider))
  // router.post('/register', register.bind(provider))
  // router.get('/authorize', authorize.bind(provider))
  // router.post('/authorize', authorize.bind(provider))
  // router.post('/token', token.bind(provider))
  // router.get('/userinfo', userinfo.bind(provider))
  // router.get('/logout', logout.bind(provider))
  const oidcProviderApi = require('oidc-op-express')(oidc.provider)
  router.use('/', oidcProviderApi)

  // JWT endpoint
  /**
   * @api {post} /jwt Generate JWT
   * @apiName GenerateJWT
   * @apiGroup Authentication
   * @apiPermission none
   * @apiHeader {String} Content-Type application/x-www-form-urlencoded
   * @apiParam {String} username The username of the account
   * @apiParam {String} password The password of the account
   * @apiParam {String} webId The WebID of the user
   * @apiSuccess {String} token The generated JWT token
   * @apiExample {curl} Example usage:
   *    curl -X POST https://dume-arditi.com/jwt \
   *    -H "Content-Type: application/x-www-form-urlencoded" \
   *    -d 'username=newuser&password=password&webId=https://newuser.dume-arditi.com/profile/card#me'
   * @apiExample {javascript} Example usage:
   *    fetch('https://dume-arditi.com/jwt', {
   *      method: 'POST',
   *      headers: {
   *        'Content-Type': 'application/x-www-form-urlencoded'
   *      },
   *      body: new URLSearchParams({
   *        username: 'newuser',
   *        password: 'password',
   *        webId: 'https://newuser.dume-arditi.com/profile/card#me'
   *      })
   *    })
   *    .then(response => response.json())
   *    .then(data => console.log(data.token));
   */
  router.post('/jwt', bodyParser, async (req, res) => {
    try {
      const { username, password, webId } = req.body // Accept WebID from the client
      // Validate username, password, and WebID against your user database
      const userIsValid = await authenticateUser(username, password, webId, req)
      // console.log('userIsValid:', userIsValid)
      if (userIsValid) {
        // console.log('Success:', userIsValid)
        const token = generateToken(webId) // Use the WebID in token generation
        res.status(200).send({ token })
      } else {
        // console.log('Authentication failed:', userIsValid)
        res.status(401).send('Authentication failed')
      }
    } catch (error) {
      // console.log('Server Error:', userIsValid)
      res.status(500).send('Server error')
    }
  })

  return router
}

/**
 * Sets the `WWW-Authenticate` response header for 401 error responses.
 * Used by error-pages handler.
 *
 * @param req {IncomingRequest}
 * @param res {ServerResponse}
 * @param err {Error}
 */
function setAuthenticateHeader (req, res, err) {
  const locals = req.app.locals

  const errorParams = {
    realm: locals.host.serverUri,
    scope: 'openid webid',
    error: err.error,
    error_description: err.error_description,
    error_uri: err.error_uri
  }

  const challengeParams = Object.keys(errorParams)
    .filter(key => !!errorParams[key])
    .map(key => `${key}="${errorParams[key]}"`)
    .join(', ')

  res.set('WWW-Authenticate', 'Bearer ' + challengeParams)
}

/**
 * Provides custom logic for error status code overrides.
 *
 * @param statusCode {number}
 * @param req {IncomingRequest}
 *
 * @returns {number}
 */
function statusCodeOverride (statusCode, req) {
  if (isEmptyToken(req)) {
    return 400
  } else {
    return statusCode
  }
}

/**
 * Tests whether the `Authorization:` header includes an empty or missing Bearer
 * token.
 *
 * @param req {IncomingRequest}
 *
 * @returns {boolean}
 */
function isEmptyToken (req) {
  const header = req.get('Authorization')

  if (!header) { return false }

  if (header.startsWith('Bearer')) {
    const fragments = header.split(' ')

    if (fragments.length === 1) {
      return true
    } else if (!fragments[1]) {
      return true
    }
  }

  return false
}

module.exports = {
  initialize,
  isEmptyToken,
  middleware,
  setAuthenticateHeader,
  statusCodeOverride
}
