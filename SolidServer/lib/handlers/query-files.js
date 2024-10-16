const { getFilesAfterDate } = require('../utils/directory-utils')
const path = require('path')

async function queryFilesHandler (req, res, next) {
  const { subDir, date } = req.query
  const parsedDate = new Date(date)

  if (!subDir || isNaN(parsedDate.getTime())) {
    return res.status(400).json({ error: 'Invalid subDir or date parameter' })
  }

  const baseDir = path.join(__dirname, '../../data', req.hostname, subDir)

  getFilesAfterDate(baseDir, parsedDate, (err, files) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }

    // Convert server paths to URLs
    const urls = files.map(file => {
      const relativePath = path.relative(path.join(__dirname, '../../data', req.hostname), file)
      return `https://${req.hostname}/${relativePath.replace(/\\/g, '/')}`
    })

    if (!res.headersSent) {
      res.status(200).json({ files: urls })
    }
  })
}

module.exports = queryFilesHandler
