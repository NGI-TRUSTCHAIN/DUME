const path = require('path')
const fs = require('fs')
const { getAllFilesRecursively } = require('../utils/directory-utils')

function parseJSONFiles (files, targetObject, callback) {
  if (!Array.isArray(files)) {
    return callback(new Error('Files parameter is not an array'), [])
  }

  const parsedData = []
  const errors = []

  files.forEach(file => {
    if (path.extname(file) === '.json') {
      try {
        const data = JSON.parse(fs.readFileSync(file, 'utf8'))
        if (data[targetObject] && data[targetObject].length > 0) {
          parsedData.push(...data[targetObject])
        }
      } catch (err) {
        errors.push({ file, error: err.message })
      }
    }
  })

  callback(errors.length > 0 ? errors : null, parsedData)
}

function filterResults (results, filters) {
  console.log('Filtering with:', filters)

  return results.filter(item => {
    const { startDate, endDate, coordinates, range, classes, analysed, dateAnalysedStart, dateAnalysedEnd } = filters

    let match = true

    // console.log('Evaluating item:', item);

    if (startDate && new Date(item.date) < new Date(startDate)) {
      // console.log(`Item ${item.date} is before startDate ${startDate}`);
      match = false
    }
    if (endDate && new Date(item.date) > new Date(endDate)) {
      // console.log(`Item ${item.date} is after endDate ${endDate}`);
      match = false
    }
    if (coordinates && range) {
      const lat = item.coordinates.lat
      const lon = item.coordinates.long
      const filterLat = coordinates[0]
      const filterLon = coordinates[1]
      const distance = Math.sqrt(Math.pow(lat - filterLat, 2) + Math.pow(lon - filterLon, 2))
      // console.log(`Item coordinates ${lat},${lon} with filter coordinates ${filterLat},${filterLon} and distance ${distance}`);
      if (distance > range) {
        match = false
      }
    }
    if (filters.classes && filters.classes.length > 0) {
      const itemClasses = item.classes ? item.classes.split(',') : []
      if (!filters.classes.some((cls) => itemClasses.includes(cls))) {
        return false
      }
    }
    if (analysed !== undefined && Boolean(item.analysed) !== Boolean(analysed)) {
      // console.log(`Item analysed ${item.analysed} does not match filter analysed ${analysed}`);
      match = false
    }
    if (dateAnalysedStart && new Date(item.date_analysed) < new Date(dateAnalysedStart)) {
      // console.log(`Item date_analysed ${item.date_analysed} is before dateAnalysedStart ${dateAnalysedStart}`);
      match = false
    }
    if (dateAnalysedEnd && new Date(item.date_analysed) > new Date(dateAnalysedEnd)) {
      // console.log(`Item date_analysed ${item.date_analysed} is after dateAnalysedEnd ${dateAnalysedEnd}`);
      match = false
    }

    return match
  })
}

async function metadataSearchHandler (req, res) {
  const { subDir, startDate, endDate, coordinates, range, classes, analysed, dateAnalysedStart, dateAnalysedEnd, targetObject = 'images' } = req.query

  const baseDir = path.join(__dirname, '../../data', req.hostname, subDir)

  getAllFilesRecursively(baseDir, (err, files) => {
    if (err) {
      console.error('Error reading directories:', err)
      return res.status(500).json({ error: 'Error reading directories' })
    }

    // console.log('Files found:', files);

    parseJSONFiles(files, targetObject, (parseErrors, results) => {
      if (parseErrors) {
        console.error('Error parsing JSON files:', parseErrors)
        return res.status(500).json({ error: 'Error parsing JSON files', details: parseErrors })
      }

      // console.log('Parsed results:', results);

      const filters = {
        startDate,
        endDate,
        coordinates: coordinates ? coordinates.split(',').map(Number) : null,
        range: range ? parseFloat(range) : null,
        classes: classes ? classes.split(',') : null,
        analysed: analysed !== undefined ? (analysed === 'true') : undefined,
        dateAnalysedStart,
        dateAnalysedEnd
      }

      const filteredResults = filterResults(results, filters)

      // console.log('Filtered results:', filteredResults);

      res.json(filteredResults)
    })
  })
}

module.exports = metadataSearchHandler
