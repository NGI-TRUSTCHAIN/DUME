// const express = require('express')
// const bodyParser = require('body-parser')
const CreateAccountRequest = require('./requests/create-account-request')

const createPod = async (req, res) => {
  try {
    // Use the factory method to get the appropriate request object
    const request = CreateAccountRequest.fromParams(req, res)

    // Ensure the request object has the validate and createPod methods
    if (typeof request.validate === 'function' && typeof request.createPod === 'function') {
      request.validate()
      await request.createPod()

      // Attempt to send a welcome email, but do not block or throw if it fails
      /*
      request.accountManager.sendWelcomeEmail(request.userAccount).catch(emailError => {
        console.error('Failed to send welcome email:', emailError);
      });
      */
      // Return only the status code and message
      res.status(201).json({
        message: 'Account created successfully'
      })
    } else {
      throw new Error('Invalid request object')
    }
  } catch (error) {
    if (!res.headersSent) {
      res.status(error.status || 400).json({
        error: error.message
      })
    } else {
      console.error('Failed to send response:', error)
    }
  }
}

module.exports = {
  createPod
}
