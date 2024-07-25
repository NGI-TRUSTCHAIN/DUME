'use strict'

const express = require('express')
const bodyParser = require('body-parser').urlencoded({ extended: false })
const debug = require('../../debug').accounts

const restrictToTopDomain = require('../../handlers/restrict-to-top-domain')

const CreateAccountRequest = require('../../requests/create-account-request')
const AddCertificateRequest = require('../../requests/add-cert-request')
const DeleteAccountRequest = require('../../requests/delete-account-request')
const DeleteAccountConfirmRequest = require('../../requests/delete-account-confirm-request')

/**
 * Returns an Express middleware handler for checking if a particular account
 * exists (used by Signup apps).
 *
 * @param accountManager {AccountManager}
 *
 * @return {Function}
 */
function checkAccountExists (accountManager) {
  return (req, res, next) => {
    const accountUri = req.hostname

    accountManager.accountUriExists(accountUri)
      .then(found => {
        if (!found) {
          debug(`Account ${accountUri} is available (for ${req.originalUrl})`)
          return res.sendStatus(404)
        }
        debug(`Account ${accountUri} is not available (for ${req.originalUrl})`)
        next()
      })
      .catch(next)
  }
}

/**
 * Returns an Express middleware handler for adding a new certificate to an
 * existing account (POST to /api/accounts/cert).
 *
 * @param accountManager
 *
 * @return {Function}
 */
function newCertificate (accountManager) {
  return (req, res, next) => {
    return AddCertificateRequest.handle(req, res, accountManager)
      .catch(err => {
        err.status = err.status || 400
        next(err)
      })
  }
}

/**
 * Returns an Express router for providing user account related middleware
 * handlers.
 *
 * @param accountManager {AccountManager}
 *
 * @return {Router}
 */
function middleware (accountManager) {
  const router = express.Router('/')

  /**
   * @api {get} / Check if account exists
   * @apiName CheckAccountExists
   * @apiGroup Account
   * @apiPermission none
   * @apiSuccess {String} message Account availability status
   * @apiExample {curl} Example usage:
   *    curl -i https://dume-arditi.com/
   * @apiExample {javascript} Example usage:
   *    fetch('https://dume-arditi.com/')
   *      .then(response => response.text())
   *      .then(data => console.log(data));
   */
  router.get('/', checkAccountExists(accountManager))

  /**
   * @api {post} /api/accounts/new Create a new account
   * @apiName CreateAccount
   * @apiGroup Account
   * @apiPermission none
   * @apiHeader {String} Content-Type application/x-www-form-urlencoded
   * @apiParam {String} username The username for the new account
   * @apiParam {String} password The password for the new account
   * @apiParam {String} repeat_password The repeated password for confirmation
   * @apiParam {String} name The name of the new user
   * @apiParam {String} email The email address of the new user
   * @apiParam {Boolean} acceptToc Confirmation of terms of conditions acceptance
   * @apiSuccess {String} message Success message
   * @apiExample {curl} Example usage:
   *    curl -X POST https://dume-arditi.com/api/accounts/new \
   *    -H "Content-Type: application/x-www-form-urlencoded" \
   *    -d 'username=newuser&password=password&repeat_password=password&name=New User&email=newuser@example.com&acceptToc=true'
   * @apiExample {javascript} Example usage:
   *    fetch('https://dume-arditi.com/api/accounts/new', {
   *      method: 'POST',
   *      headers: {
   *        'Content-Type': 'application/x-www-form-urlencoded'
   *      },
   *      body: new URLSearchParams({
   *        username: 'newuser',
   *        password: 'password',
   *        repeat_password: 'password',
   *        name: 'New User',
   *        email: 'newuser@example.com',
   *        acceptToc: true
   *      })
   *    })
   *    .then(response => response.text())
   *    .then(data => console.log(data));
   */
  router.post('/api/accounts/new', restrictToTopDomain, bodyParser, CreateAccountRequest.post)

  /**
   * @api {get} /register, /api/accounts/new Display registration form
   * @apiName GetRegisterForm
   * @apiGroup Account
   * @apiPermission none
   * @apiSuccess {String} HTML Registration form
   * @apiExample {curl} Example usage:
   *    curl -i https://dume-arditi.com/register
   * @apiExample {javascript} Example usage:
   *    fetch('https://dume-arditi.com/register')
   *      .then(response => response.text())
   *      .then(data => console.log(data));
   */
  router.get(['/register', '/api/accounts/new'], restrictToTopDomain, CreateAccountRequest.get)

  /**
   * @api {post} /api/accounts/cert Add a new certificate
   * @apiName AddCertificate
   * @apiGroup Account
   * @apiPermission none
   * @apiHeader {String} Content-Type application/x-www-form-urlencoded
   * @apiParam {String} spkac The SPKAC certificate request
   * @apiParam {String} username The username of the account
   * @apiSuccess {String} message Success message
   * @apiExample {curl} Example usage:
   *    curl -X POST https://dume-arditi.com/api/accounts/cert \
   *    -H "Content-Type: application/x-www-form-urlencoded" \
   *    -d 'spkac=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA7&username=testuser'
   * @apiExample {javascript} Example usage:
   *    fetch('https://dume-arditi.com/api/accounts/cert', {
   *      method: 'POST',
   *      headers: {
   *        'Content-Type': 'application/x-www-form-urlencoded'
   *      },
   *      body: new URLSearchParams({
   *        spkac: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA7',
   *        username: 'testuser'
   *      })
   *    })
   *    .then(response => response.text())
   *    .then(data => console.log(data));
   */
  router.post('/api/accounts/cert', restrictToTopDomain, bodyParser, newCertificate(accountManager))

  /**
   * @api {get} /account/delete Display account deletion form
   * @apiName GetDeleteAccountForm
   * @apiGroup Account
   * @apiPermission none
   * @apiSuccess {String} HTML Deletion form
   * @apiExample {curl} Example usage:
   *    curl -i https://dume-arditi.com/account/delete
   * @apiExample {javascript} Example usage:
   *    fetch('https://dume-arditi.com/account/delete')
   *      .then(response => response.text())
   *      .then(data => console.log(data));
   */
  router.get('/account/delete', restrictToTopDomain, DeleteAccountRequest.get)

  /**
   * @api {post} /account/delete Request account deletion
   * @apiName RequestAccountDeletion
   * @apiGroup Account
   * @apiPermission none
   * @apiHeader {String} Content-Type application/x-www-form-urlencoded
   * @apiParam {String} username The username of the account to be deleted
   * @apiSuccess {String} message Success message
   * @apiExample {curl} Example usage:
   *    curl -X POST https://dume-arditi.com/account/delete \
   *    -H "Content-Type: application/x-www-form-urlencoded" \
   *    -d 'username=testuser'
   * @apiExample {javascript} Example usage:
   *    fetch('https://dume-arditi.com/account/delete', {
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
  router.post('/account/delete', restrictToTopDomain, bodyParser, DeleteAccountRequest.post)

  /**
   * @api {get} /account/delete/confirm Display account deletion confirmation form
   * @apiName GetDeleteAccountConfirmForm
   * @apiGroup Account
   * @apiPermission none
   * @apiSuccess {String} HTML Deletion confirmation form
   * @apiExample {curl} Example usage:
   *    curl -i https://dume-arditi.com/account/delete/confirm
   * @apiExample {javascript} Example usage:
   *    fetch('https://dume-arditi.com/account/delete/confirm')
   *      .then(response => response.text())
   *      .then(data => console.log(data));
   */
  router.get('/account/delete/confirm', restrictToTopDomain, DeleteAccountConfirmRequest.get)

  /**
   * @api {post} /account/delete/confirm Confirm account deletion
   * @apiName ConfirmAccountDeletion
   * @apiGroup Account
   * @apiPermission none
   * @apiHeader {String} Content-Type application/x-www-form-urlencoded
   * @apiParam {String} token The one-time reset password token
   * @apiParam {String} username The username of the account to be deleted
   * @apiSuccess {String} message Success message
   * @apiExample {curl} Example usage:
   *    curl -X POST https://dume-arditi.com/account/delete/confirm \
   *    -H "Content-Type: application/x-www-form-urlencoded" \
   *    -d 'token=someToken&username=testuser'
   * @apiExample {javascript} Example usage:
   *    fetch('https://dume-arditi.com/account/delete/confirm', {
   *      method: 'POST',
   *      headers: {
   *        'Content-Type': 'application/x-www-form-urlencoded'
   *      },
   *      body: new URLSearchParams({
   *        token: 'someToken',
   *        username: 'testuser'
   *      })
   *    })
   *    .then(response => response.text())
   *    .then(data => console.log(data));
   */
  router.post('/account/delete/confirm', restrictToTopDomain, bodyParser, DeleteAccountConfirmRequest.post)

  return router
}

module.exports = {
  middleware,
  checkAccountExists,
  newCertificate
}
