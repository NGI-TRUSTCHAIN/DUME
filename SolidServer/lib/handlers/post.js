module.exports = handler

const Busboy = require('@fastify/busboy')
const debug = require('debug')('solid:post')
const path = require('path')
const header = require('../header')
const patch = require('./patch')
const error = require('../http-error')
const { extensions } = require('mime-types')
const getContentType = require('../utils').getContentType

async function handler (req, res, next) {
  const ldp = req.app.locals.ldp
  const contentType = getContentType(req.headers)
  debug('content-type is ', contentType)

  if (contentType === 'application/sparql' || contentType === 'application/sparql-update') {
    debug('switching to sparql query')
    return patch(req, res, next)
  }

  let containerPath = req.path
  if (containerPath[containerPath.length - 1] !== '/') {
    containerPath += '/'
  }

  if (req.is('multipart/form-data')) {
    return multi(req, res, next, ldp, containerPath)
  } else {
    return one(req, res, next, ldp, containerPath)
  }
}

async function multi (req, res, next, ldp, containerPath) {
  debug('receiving multiple files')

  const busboy = new Busboy({ headers: req.headers })
  busboy.on('file', async function (fieldname, file, filename, encoding, mimetype) {
    debug('One file received via multipart: ' + filename)

    // Directly use the constructed URL for the PUT operation
    try {
      const urlPath = `${req.protocol}://${req.hostname}${containerPath}${filename}`
      await ldp.put(urlPath, file, mimetype)
      debug(`File ${filename} stored.`)
    } catch (err) {
      debug('Error storing file: ' + err.message)
      busboy.emit('error', err)
    }
  })

  busboy.on('error', function (err) {
    debug('Error receiving the file: ' + err.message)
    next(error(500, 'Error receiving the file'))
  })

  busboy.on('finish', function () {
    debug('Done storing files')
    res.sendStatus(200)
    next()
  })

  req.pipe(busboy)
}

async function one (req, res, next, ldp, containerPath) {
  debug('Receiving one file')
  const { slug, link, 'content-type': contentType } = req.headers
  const links = header.parseMetadataFromHeader(link)
  const mimeType = contentType ? contentType.replace(/\s*;.*/, '') : ''
  const extension = mimeType in extensions ? `.${extensions[mimeType][0]}` : ''

  try {
    const slugExtension = slug ? (slug + (slug.endsWith(extension) ? '' : extension)) : undefined
    const targetPath = containerPath + (slugExtension || `unnamedResource${extension}`)
    const url = `${req.protocol}://${req.hostname}${targetPath}`
    await ldp.put(url, req, contentType)
    header.addLinks(res, links)
    res.set('Location', targetPath)
    res.sendStatus(201)
    next()
  } catch (err) {
    next(err)
  }
}
