/* eslint-disable no-mixed-operators, no-async-promise-executor */

module.exports = handler

const fs = require('fs')
const glob = require('glob')
const _path = require('path')
const $rdf = require('rdflib')
const archiver = require('archiver') // Batch GET
const Negotiator = require('negotiator')
const mime = require('mime-types')

const debug = require('debug')('solid:get')
const debugGlob = require('debug')('solid:glob')
const allow = require('./allow')

const translate = require('../utils.js').translate
const error = require('../http-error')

const RDFs = require('../ldp').mimeTypesAsArray()

async function handler (req, res, next) {
  const ldp = req.app.locals.ldp
  const includeBody = req.method === 'GET'
  const negotiator = new Negotiator(req)
  const baseUri = ldp.resourceMapper.resolveUrl(req.hostname, req.path)
  let path = res.locals.path || req.path
  const requestedType = negotiator.mediaType()
  const possibleRDFType = negotiator.mediaType(RDFs)
  const isBatchRequest = req.query.batch === 'true' // Check for batch query parameter
  const isListRequest = req.query.content === 'list' // Check for list query parameter
  console.log(`Request: ${req.originalUrl}, Batch: ${isBatchRequest}, List: ${isListRequest}`)
  ldp.live(
    //path = path, // Resource path
    iri = req.originalUrl || path, //resource and path
    operation = 'GET', // Operation type
    statusCode = res.statusCode || null, //status of the request
    webid = req.session ? req.session.userId : null, // Pass the user's WebID if authenticated
    origin = req.headers.origin || req.ip, // Pass the origin if available
    userAgent = req.headers['user-agent'] || null // Include the user agent
  );




  // Append a trailing slash if not present and it's a directory request
  if (isBatchRequest || isListRequest) {
    if (path.endsWith('/')) {
      path = path.slice(0, -1)
    }
  }

  // deprecated kept for compatibility
  res.header('MS-Author-Via', 'SPARQL')

  res.header('Accept-Patch', 'text/n3, application/sparql-update, application/sparql-update-single-match')
  res.header('Accept-Post', '*/*')
  if (!path.endsWith('/') && !glob.hasMagic(path)) res.header('Accept-Put', '*/*')

  // Set live updates
  if (ldp.live) {
    res.header('Updates-Via', ldp.resourceMapper.resolveUrl(req.hostname).replace(/^http/, 'ws'))
  }

  debug(req.originalUrl + ' on ' + req.hostname)

  const options = {
    hostname: req.hostname,
    path: path,
    includeBody: includeBody,
    possibleRDFType: possibleRDFType,
    range: req.headers.range,
    contentType: req.headers.accept
  }

  if (isBatchRequest) {
    return handleBatchRequest(ldp, options, req, res, next)
  }

  if (isListRequest) {
    return handleListRequest(ldp, options, req, res, next)
  }

  let ret
  try {
    ret = await ldp.get(options, req.accepts(['html', 'turtle', 'rdf+xml', 'n3', 'ld+json']) === 'html')
  } catch (err) {
    // set Accept-Put if container do not exist
    if (err.status === 404 && path.endsWith('/')) res.header('Accept-Put', 'text/turtle')
    // use globHandler if magic is detected
    if (err.status === 404 && glob.hasMagic(path)) {
      debug('forwarding to glob request')
      return globHandler(req, res, next)
    } else {
      debug(req.method + ' -- Error: ' + err.status + ' ' + err.message)
      return next(err)
    }
  }

  let stream
  let contentType
  let container
  let contentRange
  let chunksize

  if (ret) {
    stream = ret.stream
    contentType = ret.contentType
    container = ret.container
    contentRange = ret.contentRange
    chunksize = ret.chunksize
  }

  // Till here it must exist
  if (!includeBody) {
    debug('HEAD only')
    res.setHeader('Content-Type', ret.contentType)
    return res.status(200).send('OK')
  }

  // Handle dataBrowser
  if (requestedType && requestedType.includes('text/html')) {
    const { path: filename } = await ldp.resourceMapper.mapUrlToFile({ url: options })
    const mimeTypeByExt = mime.lookup(_path.basename(filename))
    const isHtmlResource = mimeTypeByExt && mimeTypeByExt.includes('html')
    const useDataBrowser = ldp.dataBrowserPath && (
      container ||
      RDFs.includes(contentType) && !isHtmlResource && !ldp.suppressDataBrowser)

    if (useDataBrowser) {
      res.set('Content-Type', 'text/html')
      const defaultDataBrowser = require.resolve('mashlib/dist/databrowser.html')
      const dataBrowserPath = ldp.dataBrowserPath === 'default' ? defaultDataBrowser : ldp.dataBrowserPath
      debug('   sending data browser file: ' + dataBrowserPath)
      res.sendFile(dataBrowserPath)
      return
    } else if (stream) {
      res.setHeader('Content-Type', contentType)
      return stream.pipe(res)
    }
  }

  // If request accepts the content-type we found
  if (stream && negotiator.mediaType([contentType])) {
    res.setHeader('Content-Type', contentType)
    if (contentRange) {
      const headers = { 'Content-Range': contentRange, 'Accept-Ranges': 'bytes', 'Content-Length': chunksize }
      res.writeHead(206, headers)
      return stream.pipe(res)
    } else {
      return stream.pipe(res)
    }
  }

  // If it is not in our RDFs we can't even translate,
  // Sorry, we can't help
  if (!possibleRDFType || !RDFs.includes(contentType)) { // possibleRDFType defaults to text/turtle
    return next(error(406, 'Cannot serve requested type: ' + contentType))
  }
  try {
    // Translate from the contentType found to the possibleRDFType desired
    const data = await translate(stream, baseUri, contentType, possibleRDFType)
    debug(req.originalUrl + ' translating ' + contentType + ' -> ' + possibleRDFType)
    res.setHeader('Content-Type', possibleRDFType)
    res.send(data)
    return next()
  } catch (err) {
    debug('error translating: ' + req.originalUrl + ' ' + contentType + ' -> ' + possibleRDFType + ' -- ' + 406 + ' ' + err.message)
    return next(error(500, 'Cannot serve requested type: ' + requestedType))
  }
}

// retrieve folder content in a zip file
async function handleBatchRequest (ldp, options, req, res, next) {
  try {
    const url = ldp.resourceMapper.resolveUrl(options.hostname, options.path)
    const folderPath = (await ldp.resourceMapper.mapUrlToFile({ url, hostname: options.hostname })).path
    console.log(`Folder Path: ${folderPath}`)
    const files = await fs.promises.readdir(folderPath) // Using fs.promises.readdir to read directory contents

    // Extract folder name from path
    const folderName = _path.basename(folderPath)

    // Create a ZIP archive and pipe it to the response
    const archive = archiver('zip', { zlib: { level: 9 } }) // Set the compression level

    archive.on('error', function (err) {
      return next(err)
    })

    res.setHeader('Content-Type', 'application/zip') // Set the content type to application/zip
    // res.attachment('folder-contents.zip'); // Set the response header to indicate a file download
    res.setHeader('Content-Disposition', `attachment; filename=${folderName}.zip`) // Set the response header to indicate a file download with the folder name
    archive.pipe(res)

    for (const file of files) {
      const filePath = _path.join(folderPath, file)
      const fileStats = await fs.promises.stat(filePath) // Using fs.promises.stat to get file stats

      if (fileStats.isDirectory()) {
        archive.directory(filePath, file)
      } else {
        archive.file(filePath, { name: file })
      }
    }

    await archive.finalize() // Finalize the archive (i.e., we are done appending files but streams have to finish yet)
  } catch (err) {
    console.error(`Batch request failed: ${err.message}`)
    return next(error(500, 'Batch request failed: ' + err.message))
  }
}

// List folder content
async function handleListRequest (ldp, options, req, res, next) {
  try {
    const url = ldp.resourceMapper.resolveUrl(options.hostname, options.path)
    const folderPath = (await ldp.resourceMapper.mapUrlToFile({ url, hostname: options.hostname })).path
    console.log(`Folder Path: ${folderPath}`)
    const files = await fs.promises.readdir(folderPath) // Using fs.promises.readdir to read directory contents

    const listData = await Promise.all(files.map(async file => {
      const filePath = _path.join(folderPath, file)
      const fileStats = await fs.promises.stat(filePath) // Using fs.promises.stat to get file stats
      const fileUrl = await ldp.resourceMapper.mapFileToUrl({ path: filePath, hostname: options.hostname })

      return {
        name: file,
        url: fileUrl.url,
        mtime: fileStats.mtime,
        size: fileStats.size,
        isDirectory: fileStats.isDirectory()
      }
    }))

    res.setHeader('Content-Type', 'application/json') // Ensure the response is JSON
    res.json(listData)
  } catch (err) {
    console.error(`List request failed: ${err.message}`)
    return next(error(500, 'List request failed: ' + err.message))
  }
}

async function globHandler (req, res, next) {
  const { ldp } = req.app.locals

  // Ensure this is a glob for all files in a single folder
  // https://github.com/solid/solid-spec/pull/148
  const requestUrl = await ldp.resourceMapper.getRequestUrl(req)
  if (!/^[^*]+\/\*$/.test(requestUrl)) {
    return next(error(404, 'Unsupported glob pattern'))
  }

  // Extract the folder on the file system from the URL glob
  const folderUrl = requestUrl.substr(0, requestUrl.length - 1)
  const folderPath = (await ldp.resourceMapper.mapUrlToFile({ url: folderUrl, searchIndex: false })).path

  const globOptions = {
    noext: true,
    nobrace: true,
    nodir: true
  }

  glob(`${folderPath}*`, globOptions, async (err, matches) => {
    if (err || matches.length === 0) {
      debugGlob('No files matching the pattern')
      return next(error(404, 'No files matching glob pattern'))
    }

    // Matches found
    const globGraph = $rdf.graph()

    debugGlob('found matches ' + matches)
    await Promise.all(matches.map(match => new Promise(async (resolve, reject) => {
      const urlData = await ldp.resourceMapper.mapFileToUrl({ path: match, hostname: req.hostname })
      fs.readFile(match, { encoding: 'utf8' }, function (err, fileData) {
        if (err) {
          debugGlob('error ' + err)
          return resolve()
        }
        // Files should be Turtle
        if (urlData.contentType !== 'text/turtle') {
          return resolve()
        }
        // The agent should have Read access to the file
        hasReadPermissions(match, req, res, function (allowed) {
          if (allowed) {
            try {
              $rdf.parse(fileData, globGraph, urlData.url, 'text/turtle')
            } catch (parseErr) {
              debugGlob(`error parsing ${match}: ${parseErr}`)
            }
          }
          return resolve()
        })
      })
    })))

    const data = $rdf.serialize(undefined, globGraph, requestUrl, 'text/turtle')
    // TODO this should be added as a middleware in the routes
    res.setHeader('Content-Type', 'text/turtle')
    debugGlob('returning turtle')

    res.send(data)
    next()
  })
}

// TODO: get rid of this ugly hack that uses the Allow handler to check read permissions
function hasReadPermissions (file, req, res, callback) {
  const ldp = req.app.locals.ldp

  if (!ldp.webid) {
    // FIXME: what is the rule that causes
    // "Unexpected literal in error position of callback" in `npm run standard`?
    // eslint-disable-next-line
    return callback(true)
  }

  const root = ldp.resourceMapper.resolveFilePath(req.hostname)
  const relativePath = '/' + _path.relative(root, file)
  res.locals.path = relativePath
  // FIXME: what is the rule that causes
  // "Unexpected literal in error position of callback" in `npm run standard`?
  // eslint-disable-next-line
  allow('Read')(req, res, err => callback(!err))
}
