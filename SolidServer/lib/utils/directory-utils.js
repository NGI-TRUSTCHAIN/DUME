const fs = require('fs')
const path = require('path')

/**
 * Recursively traverse directories within a specific base directory
 * @param {string} baseDir - The starting directory
 * @param {function} callback - The callback function to handle each directory
 */
function traverseDirectories (baseDir, callback) {
  fs.readdir(baseDir, { withFileTypes: true }, (err, files) => {
    if (err) {
      return callback(err)
    }

    files.forEach(file => {
      if (file.isDirectory()) {
        const fullPath = path.join(baseDir, file.name)
        callback(null, fullPath)
        traverseDirectories(fullPath, callback)
      }
    })
  })
}

/**
 * Get directories created after a certain date within a specific Pod and subdirectory
 * @param {string} baseDir - The base directory to start the search
 * @param {Date} date - The date to compare against
 * @param {function} callback - The callback function to return results
 */
function getDirectoriesAfterDate (baseDir, date, callback) {
  const result = []

  traverseDirectories(baseDir, (err, dir) => {
    if (err) {
      return callback(err)
    }
    if (dir) {
      fs.stat(dir, (err, stats) => {
        if (err) {
          return callback(err)
        }
        if (stats.birthtime > date) {
          result.push(dir)
        }
      })
    }
  })

  // Give some time for asynchronous operations to complete
  setTimeout(() => {
    callback(null, result)
  }, 2000)
}

/**
 * Recursively traverse directories within a specific base directory to collect files
 * @param {string} baseDir - The starting directory
 * @param {function} callback - The callback function to handle each file
 */
function traverseFiles (baseDir, callback) {
  fs.readdir(baseDir, { withFileTypes: true }, (err, files) => {
    if (err) {
      return callback(err)
    }

    files.forEach(file => {
      const fullPath = path.join(baseDir, file.name)
      if (file.isDirectory()) {
        traverseFiles(fullPath, callback)
      } else {
        callback(null, fullPath)
      }
    })
  })
}

/**
 * Get files created after a certain date within a specific Pod and subdirectory
 * @param {string} baseDir - The base directory to start the search
 * @param {Date} date - The date to compare against
 * @param {function} callback - The callback function to return results
 */
function getFilesAfterDate (baseDir, date, callback) {
  const result = []

  traverseFiles(baseDir, (err, file) => {
    if (err) {
      return callback(err)
    }
    if (file) {
      fs.stat(file, (err, stats) => {
        if (err) {
          return callback(err)
        }
        if (stats.birthtime > date) {
          result.push(file)
        }
      })
    }
  })

  // Give some time for asynchronous operations to complete
  setTimeout(() => {
    callback(null, result)
  }, 2000)
}

/**
 * Recursively get all files within a specific base directory
 * @param {string} baseDir - The starting directory
 * @param {function} callback - The callback function to handle each file
 */
function getAllFilesRecursively (baseDir, callback) {
  let results = []

  fs.readdir(baseDir, { withFileTypes: true }, (err, files) => {
    if (err) {
      return callback(err)
    }

    let pending = files.length
    if (!pending) return callback(null, results)

    files.forEach(file => {
      const fullPath = path.join(baseDir, file.name)
      if (file.isDirectory()) {
        getAllFilesRecursively(fullPath, (err, res) => {
          if (err) {
            return callback(err)
          }
          results = results.concat(res)
          if (!--pending) callback(null, results)
        })
      } else {
        results.push(fullPath)
        if (!--pending) callback(null, results)
      }
    })
  })
}

module.exports = {
  getDirectoriesAfterDate,
  getFilesAfterDate,
  getAllFilesRecursively
}
