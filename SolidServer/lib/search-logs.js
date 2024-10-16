const fs = require('fs')
const path = require('path')
const readline = require('readline')

// Function to search logs
const searchLogs = async (hostname, criteria) => {
  const logDir = path.join(__dirname, '../data', hostname, 'access_log')
  const logFile = path.join(logDir, 'access.log')

  if (!fs.existsSync(logFile)) {
    throw new Error('Log file does not exist')
  }

  const fileStream = fs.createReadStream(logFile)
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  })

  const results = []

  for await (const line of rl) {
    if (criteria.some(criterion => line.includes(criterion))) {
      results.push(line)
    }
  }

  return results
}

module.exports = { searchLogs }
