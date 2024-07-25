const fs = require('fs')
const path = require('path')

// Load configuration from config.json
const config = require('../config.json')

// Function to log access
const logAccess = (req, res, next) => {
  const hostname = req.hostname

  // Check if the request is to the main server or a pod
  if (hostname === new URL(config.serverUri).hostname) {
    return next()
  }

  const startTime = process.hrtime()

  // Hook into the response to log the status code and response time
  res.on('finish', () => {
    const duration = process.hrtime(startTime)
    const durationMs = duration[0] * 1000 + duration[1] / 1e6
    const timestamp = new Date().toISOString()
    const method = req.method
    const resource = req.originalUrl
    const origin = req.headers.origin || req.ip
    const statusCode = res.statusCode
    const userAgent = req.headers['user-agent']

    // Extract user WebID from the JWT token or session
    let userWebId = 'Unknown'
    if (req.user && req.user.webId) {
      userWebId = req.user.webId
    } else if (req.session && req.session.userId) {
      userWebId = req.session.userId
    }

    // Skip logging for certain paths if they are internal (no origin header)
    const internalPaths = [
      '/profile/card',
      '/profile/card/'
    ]

    if (internalPaths.includes(req.path) && !req.headers.origin) {
      return
    }

    const logMessage = `${timestamp} - ${method} - ${resource} - ${origin} - ${statusCode} - ${durationMs.toFixed(3)}ms - ${userAgent} - ${userWebId}\n`

    // Determine the log directory based on the pod
    const logDir = path.join(config.root, hostname, 'access_log')
    const logFile = path.join(logDir, 'access.log')

    // Ensure the log directory exists
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true })
    }

    // Append the log message to the access log file
    fs.appendFileSync(logFile, logMessage, 'utf8')
  })

  // Continue to the next middleware or route handler
  next()
}

module.exports = { logAccess }
