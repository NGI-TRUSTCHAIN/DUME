module.exports = LdpMiddleware

const express = require('express')
const path = require('path')
// const util = require('util')
const header = require('./header')
const allow = require('./handlers/allow')
const get = require('./handlers/get')
const post = require('./handlers/post')
const put = require('./handlers/put')
const del = require('./handlers/delete')
const patch = require('./handlers/patch')
const index = require('./handlers/index')
const copy = require('./handlers/copy')
const { validateToken, getUserFromToken, isOwner } = require('./jwtoken')
const { grantAccess, removeAccess } = require('./grant-access')
const { logAccess } = require('./access-logging') // Import for logging pod accesses
const { searchLogs } = require('./search-logs') // Import for searching pod accesses log
const { createPod } = require('./create-new-pod') // Import for creating new pods (and new users)
const queryFoldersHandler = require('./handlers/query-folders') // Import for queries to added folders in a directory
const queryFilesHandler = require('./handlers/query-files') // Import the query files handler
const metadataSearchHandler = require('./handlers/metadata-search-handler') // Import the metadata search functionality

function LdpMiddleware (corsSettings) {
  const router = express.Router('/')

  // Add Link headers
  router.use(header.linksHandler)

  if (corsSettings) {
    router.use(corsSettings)
  }

  /*
  // Add JWT validation middleware, but only for specific routes or conditions
  router.use((req, res, next) => {
    // Check if the request has an Authorization header
    if (req.headers.authorization) {
      return validateToken(req, res, next);
    }
    // If no Authorization header, proceed without JWT validation
    next();
  });
  */

  // Serve /apidoc route
  router.use('/apidoc', express.static(path.join(__dirname, '..', 'apidoc')))

  // Create new User Pod - Alternative route app friendly
  // Create new User Pod - Alternative route app friendly
  /**
   * @api {post} /new-pod Create a new user pod
   * @apiName CreatePod
   * @apiGroup Pod
   * @apiPermission none
   * @apiParam {String} username The username for the new account
   * @apiParam {String} password The password for the new account
   * @apiParam {String} repeat_password The repeated password for confirmation
   * @apiParam {String} name The name of the new user
   * @apiParam {String} email The email address of the new user
   * @apiParam {Boolean} acceptToc Confirmation of terms of conditions acceptance
   * @apiSuccess {String} message Success message
   * @apiExample {curl} Example usage:
   *    curl -X POST 'https://dume-arditi.com/new-pod' \
   *    -H 'Content-Type: application/json' \
   *    -d '{
   *      "username": "newuser",
   *      "password": "password",
   *      "repeat_password": "password",
   *      "name": "New User",
   *      "email": "newuser@mail.com",
   *      "acceptToc": true
   *    }'
   * @apiExample {javascript} Example usage:
   *    fetch('https://dume-arditi.com/new-pod', {
   *      method: 'POST',
   *      headers: {
   *        'Content-Type': 'application/json',
   *      },
   *      body: JSON.stringify({
   *        username: 'newuser',
   *        password: 'password',
   *        repeat_password: 'password',
   *        name: 'New User',
   *        email: 'newuser@mail.com',
   *        acceptToc: true
   *      })
   *    })
   *    .then(response => response.json())
   *    .then(data => console.log(data));
   */
  router.post('/new-pod', express.json(), createPod)

  // Conditional JWT validation middleware
  router.use((req, res, next) => {
    // Bypass account-manager routes
    const openRoutes = [
      '/api/accounts/new',
      '/register',
      '/api/accounts/cert',
      '/account/delete',
      '/account/delete/confirm',
      '/new-user',
      '/apidoc/'
    ]

    if (openRoutes.includes(req.path)) {
      return next()
    }
    // console.log(util.inspect(req.session, false, null, true /* enable colors */));
    // console.log(session);
    if (req.session.cookie && req.session.userId) {


      return next() // Session is present, continue without JWT validation
    } else if (req.headers.authorization) {
      return validateToken(req, res, next) // Validate JWT if Authorization header is present
    } else {
      next() // No session or JWT, continue without validation
    }
  })

  // Use access logging middleware
  router.use(logAccess)

  // Route to search access logs within a specific Pod
  /**
   * @api {get} /search-logs Search access logs
   * @apiName SearchLogs
   * @apiGroup Logs
   * @apiPermission owner
   * @apiParam {String} podName The name of the pod
   * @apiParam {String} hostname The hostname of the pod
   * @apiParam {String} criteria The criteria to search for in the logs
   * @apiSuccess {Array} logs The search results
   * @apiHeader {String} Authorization Bearer token for authentication
   * @apiExample {curl} Example usage:
   *    curl -i https://podname.dume-arditi.com/search-logs?hostname=podname.dume-arditi.com&criteria=login \
   *    -H "Authorization: Bearer <token>"
   * @apiExample {javascript} Example usage:
   *    fetch('https://podname.dume-arditi.com/search-logs?hostname=podname.dume-arditi.com&criteria=login', {
   *      headers: {
   *        'Authorization': 'Bearer <token>'
   *      }
   *    })
   *    .then(response => response.json())
   *    .then(data => console.log(data));
   */
  router.get('/search-logs', validateToken, async (req, res) => {
    const { hostname, criteria } = req.query

    if (!hostname || !criteria) {
      return res.status(400).send('Missing required parameters: hostname, criteria')
    }

    // Extract user information from the token
    const user = getUserFromToken(req)

    // Check if the user is the owner of the pod
    if (!isOwner(user, hostname)) {
      return res.status(403).send('Forbidden: You are not the owner of this pod')
    }

    try {
      const results = await searchLogs(hostname, criteria.split(','))
      res.json(results) // Return the results as JSON
    } catch (error) {
      res.status(500).send(`Error searching logs: ${error.message}`)
    }
  })

  // theia-vision json metadata search
  /**
   * @api {get} /api/metadata-search Search metadata
   * @apiName MetadataSearch
   * @apiGroup Metadata
   * @apiPermission authenticated
   * @apiParam {String} podName The name of the pod
   * @apiParam {String} subDir The sub-directory to search in
   * @apiParam {String} [startDate] The start date for the search
   * @apiParam {String} [endDate] The end date for the search
   * @apiParam {String} [coordinates] The coordinates for the search
   * @apiParam {Number} [range] The range for the search
   * @apiParam {String} [classes] The classes to search for
   * @apiParam {Boolean} [analysed] Whether the data is analysed
   * @apiParam {String} [dateAnalysedStart] The start date for analysed data
   * @apiParam {String} [dateAnalysedEnd] The end date for analysed data
   * @apiSuccess {Array} results The search results
   * @apiHeader {String} Authorization Bearer token for authentication
   * @apiExample {curl} Example usage:
   *    curl -i https://podname.dume-arditi.com/api/metadata-search?subDir=theia-vision&targetObject=image&startDate=2024-01-01&endDate=2024-12-31&coordinates=32.7764172%2C-16.9346079&range=0.1&classes=trash%2Cgraffitti&analysed=true&dateAnalysedStart=2024-01-01&dateAnalysedEnd=2024-12-31 \
   *    -H "Authorization: Bearer <token>"
   * @apiExample {javascript} Example usage:
   *    fetch('https://podname.dume-arditi.com/api/metadata-search?subDir=theia-vision&targetObject=image&startDate=2024-01-01&endDate=2024-12-31&coordinates=32.7764172%2C-16.9346079&range=0.1&classes=trash%2Cgraffitti&analysed=true&dateAnalysedStart=2024-01-01&dateAnalysedEnd=2024-12-31', {
   *      headers: {
   *        'Authorization': 'Bearer <token>'
   *      }
   *    })
   *    .then(response => response.json())
   *    .then(data => console.log(data));
   */
  router.get('/api/metadata-search', validateToken, metadataSearchHandler)

  // Grant access endpoint
  /**
   * @api {post} /grantaccess Grant access to a resource
   * @apiName GrantAccess
   * @apiGroup Access
   * @apiPermission none
   * @apiParam {String} podName The name of the pod
   * @apiParam {String} resource The resource to grant access to
   * @apiParam {String} agent The agent to grant access to
   * @apiParam {Array} permissions The permissions to grant
   * @apiParam {String} [origin] The origin for the access
   * @apiSuccess {String} message Success message
   * @apiHeader {String} Authorization Bearer token for authentication
   * @apiHeader {String} Content-Type application/json
   * @apiExample {curl} Example usage:
   *    curl -i https://podname.dume-arditi.com/grantaccess -d '{"resource":"https://podname.dume-arditi.com/theia-vision/","agent":"https://podname2.dume-arditi.com/profile/card#me","permissions":["Read", "Write"],"origin":"https://111.111.211.254"}' \
   *    -H "Content-Type: application/json" -H "Authorization: Bearer <token>"
   * @apiExample {javascript} Example usage:
   *    fetch('https://podname.dume-arditi.com/grantaccess', {
   *      method: 'POST',
   *      headers: {
   *        'Content-Type': 'application/json',
   *        'Authorization': 'Bearer <token>'
   *      },
   *      body: JSON.stringify({"resource":"https://podname.dume-arditi.com/theia-vision/","agent":"https://podname2.dume-arditi.com/profile/card#me","permissions":["Read", "Write"],"origin":"https://111.111.211.254"})
   *    })
   *    .then(response => response.json())
   *    .then(data => console.log(data));
   */
  router.post('/grantaccess', grantAccess)

  // Remove access endpoint
  /**
   * @api {post} /revokeaccess Revoke access to a resource
   * @apiName RevokeAccess
   * @apiGroup Access
   * @apiPermission none
   * @apiParam {String} podName The name of the pod
   * @apiParam {String} resource The resource to revoke access to
   * @apiParam {String} agent The agent to revoke access from
   * @apiSuccess {String} message Success message
   * @apiHeader {String} Authorization Bearer token for authentication
   * @apiHeader {String} Content-Type application/json
   * @apiExample {curl} Example usage:
   *    curl -i https://podname.dume-arditi.com/revokeaccess -d '{"resource":"https://podname.dume-arditi.com/theia-vision/","agent":"https://podname2.dume-arditi.com/profile/card#me","permissions":["Write"],"origin":""}' \
   *    -H "Content-Type: application/json" -H "Authorization: Bearer <token>"
   * @apiExample {javascript} Example usage:
   *    fetch('https://podname.dume-arditi.com/revokeaccess', {
   *      method: 'POST',
   *      headers: {
   *        'Content-Type': 'application/json',
   *        'Authorization': 'Bearer <token>'
   *      },
   *      body: JSON.stringify({"resource":"https://podname.dume-arditi.com/theia-vision/","agent":"https://podname2.dume-arditi.com/profile/card#me","permissions":["Write"],"origin":""})
   *    })
   *    .then(response => response.json())
   *    .then(data => console.log(data));
   */
  router.post('/removeaccess', removeAccess)

  // Route to query folders within a specific Pod
  /**
   * @api {get} /query-folders Query directories within a specific pod
   * @apiName QueryFolders
   * @apiGroup Query
   * @apiPermission authenticated
   * @apiParam {String} podName The name of the pod
   * @apiParam {String} subDir The sub-directory to query
   * @apiSuccess {Array} folders The query results
   * @apiHeader {String} Authorization Bearer token for authentication
   * @apiExample {curl} Example usage:
   *    curl -i https://podname.dume-arditi.com/query-folders?subDir=/&date=2023-01-01T00:00:00Z \
   *    -H "Authorization: Bearer <token>"
   * @apiExample {javascript} Example usage:
   *    fetch('https://podname.dume-arditi.com/query-folders?subDir=/&date=2023-01-01T00:00:00Z', {
   *      headers: {
   *        'Authorization': 'Bearer <token>'
   *      }
   *    })
   *    .then(response => response.json())
   *    .then(data => console.log(data));
   */
  router.get('/query-folders', validateToken, queryFoldersHandler)

  // Route to query files within a specific pod
  /**
   * @api {get} /query-files Query files within a specific pod
   * @apiName QueryFiles
   * @apiGroup Query
   * @apiPermission authenticated
   * @apiParam {String} podName The name of the pod
   * @apiParam {String} subDir The sub-directory to query
   * @apiParam {String} date The date to filter files by
   * @apiSuccess {Array} files The query results
   * @apiHeader {String} Authorization Bearer token for authentication
   * @apiExample {curl} Example usage:
   *    curl -i https://podname.dume-arditi.com/query-files?subDir=theia-vision&date=2024-01-01T00:00:00Z \
   *    -H "Authorization: Bearer <token>"
   * @apiExample {javascript} Example usage:
   *    fetch('https://podname.dume-arditi.com/query-files?subDir=theia-vision&date=2024-01-01T00:00:00Z', {
   *      headers: {
   *        'Authorization': 'Bearer <token>'
   *      }
   *    })
   *    .then(response => response.json())
   *    .then(data => console.log(data));
   */
  router.get('/query-files', validateToken, queryFilesHandler)

  // COPY resource route
  /**
   * @api {copy} /* Copy a resource
   * @apiName CopyResource
   * @apiGroup Resource
   * @apiPermission write
   * @apiHeader {String} Source The URL of the resource to copy
   * @apiSuccess {String} Location The URL of the newly copied resource
   * @apiExample {curl} Example usage:
   *    curl -X COPY 'https://podName.dume-arditi.com/path/to/destination' \
   *    -H 'Source: https://source-podName.dume-arditi.com/path/to/source' \
   *    -H 'Authorization: Bearer <token>'
   * @apiExample {javascript} Example usage:
   *    fetch('https://podName.dume-arditi.com/path/to/destination', {
   *      method: 'COPY',
   *      headers: {
   *        'Source': 'https://source-podName.dume-arditi.com/path/to/source',
   *        'Authorization': 'Bearer <token>'
   *      }
   *    })
   *    .then(response => {
   *      if (response.ok) {
   *        return response.headers.get('Location');
   *      }
   *      throw new Error('Network response was not ok.');
   *    })
   *    .then(location => console.log('Resource copied to:', location))
   *    .catch(error => console.error('There was a problem with the fetch operation:', error));
   */
  router.copy('/*', allow('Write'), copy)

  // Get Resource route
  /**
   * @api {get} /* Retrieve a resource
   * @apiName GetResource
   * @apiGroup Resource
   * @apiPermission read
   * @apiParam {Boolean} [batch] Indicates if it is a batch request
   * @apiHeader {String} Authorization Bearer token for authentication
   * @apiExample {curl} Example usage:
   *    curl -i https://podName.dume-arditi.com/path/to/resource?batch=true \
   *    -H "Authorization: Bearer <token>"
   * @apiExample {javascript} Example usage:
   *    fetch('https://podName.dume-arditi.com/path/to/resource?batch=true', {
   *      headers: {
   *        'Authorization': 'Bearer <token>'
   *      }
   *    })
   *    .then(response => response.json())
   *    .then(data => console.log(data));
   */
  router.get('/*', index, allow('Read'), header.addPermissions, get)

  // Post Resource route
  /**
   * @api {post} /* Create a resource
   * @apiName PostResource
   * @apiGroup Resource
   * @apiPermission append
   * @apiHeader {String} Content-Type The content type of the resource
   * @apiHeader {String} Authorization Bearer token for authentication
   * @apiExample {curl} Example usage:
   *    curl -X POST https://podName.dume-arditi.com/path/to/resource \
   *    -H "Content-Type: multipart/form-data" \
   *    -H "Authorization: Bearer <token>" \
   *    -F 'file=@/path/to/file'
   *    -F 'file=@/path/to/file2'
   *    -F 'file=@/path/to/file3'
   *    -F 'file=@/path/to/file4'
   * @apiExample {javascript} Example usage:
   *    fetch('https://podName.dume-arditi.com/path/to/resource', {
   *      method: 'POST',
   *      headers: {
   *        'Content-Type': 'multipart/form-data',
   *        'Authorization': 'Bearer <token>'
   *      },
   *      body: formData // Assuming formData is created elsewhere
   *    })
   *    .then(response => response.json())
   *    .then(data => console.log(data));
   */
  router.post('/*', allow('Append'), post)

  // Patch Resource route
  /**
   * @api {patch} /* Update a resource
   * @apiName PatchResource
   * @apiGroup Resource
   * @apiPermission append
   * @apiHeader {String} Content-Type The content type of the patch document
   * @apiHeader {String} Authorization Bearer token for authentication
   * @apiExample {curl} Example usage:
   *    curl -X PATCH https://podName.dume-arditi.com/path/to/resource \
   *    -H "Content-Type: application/sparql-update" \
   *    -H "Authorization: Bearer <token>" \
   *    -d 'INSERT DATA { <http://example/book1> <http://example/title> "A new title" }'
   * @apiExample {javascript} Example usage:
   *    fetch('https://podName.dume-arditi.com/path/to/resource', {
   *      method: 'PATCH',
   *      headers: {
   *        'Content-Type': 'application/sparql-update',
   *        'Authorization': 'Bearer <token>'
   *      },
   *      body: 'INSERT DATA { <http://example/book1> <http://example/title> "A new title" }'
   *    })
   *    .then(response => response.json())
   *    .then(data => console.log(data));
   */
  router.patch('/*', allow('Append'), patch)

  // Put Resource route
  /**
   * @api {put} /* Replace a resource
   * @apiName PutResource
   * @apiGroup Resource
   * @apiPermission append
   * @apiHeader {String} Content-Type The content type of the resource
   * @apiHeader {String} Authorization Bearer token for authentication
   * @apiExample {curl} Example usage:
   *    curl -X PUT https://podName.dume-arditi.com/path/to/resource \
   *    -H "Content-Type: text/turtle" \
   *    -H "Authorization: Bearer <token>" \
   *    -d '<data>'
   * @apiExample {javascript} Example usage:
   *    fetch('https://podName.dume-arditi.com/path/to/resource', {
   *      method: 'PUT',
   *      headers: {
   *        'Content-Type': 'text/turtle',
   *        'Authorization': 'Bearer <token>'
   *      },
   *      body: '<data>'
   *    })
   *    .then(response => response.json())
   *    .then(data => console.log(data));
   */
  router.put('/*', allow('Append'), put)

  // Delete Resource route
  /**
   * @api {delete} /* Delete a resource
   * @apiName DeleteResource
   * @apiGroup Resource
   * @apiPermission write
   * @apiHeader {String} Authorization Bearer token for authentication
   * @apiExample {curl} Example usage:
   *    curl -X DELETE https://podName.dume-arditi.com/path/to/resource \
   *    -H "Authorization: Bearer <token>"
   * @apiExample {javascript} Example usage:
   *    fetch('https://podName.dume-arditi.com/path/to/resource', {
   *      method: 'DELETE',
   *      headers: {
   *        'Authorization': 'Bearer <token>'
   *      }
   *    })
   *    .then(response => response.json())
   *    .then(data => console.log(data));
   */
  router.delete('/*', allow('Write'), del)

  // OPTIONS method documentation
  /**
   * @api {options} /* Get allowed methods for a resource
   * @apiName OptionsResource
   * @apiGroup Resource
   * @apiPermission none
   * @apiParam {String} path Path of the resource
   * @apiSuccess {Object} headers Allowed methods for the resource
   * @apiExample {curl} Example usage:
   *    curl -X OPTIONS https://dume-arditi.com/path/to/resource
   * @apiExample {javascript} Example usage:
   *    fetch('https://dume-arditi.com/path/to/resource', { method: 'OPTIONS' })
   *      .then(response => response.json())
   *      .then(data => console.log(data));
   */

  // HEAD method documentation
  /**
   * @api {head} /* Get headers for a resource
   * @apiName HeadResource
   * @apiGroup Resource
   * @apiPermission none
   * @apiParam {String} path Path of the resource
   * @apiSuccess {Object} headers Headers for the resource
   * @apiExample {curl} Example usage:
   *    curl -I https://dume-arditi.com/path/to/resource
   * @apiExample {javascript} Example usage:
   *    fetch('https://dume-arditi.com/path/to/resource', { method: 'HEAD' })
   *      .then(response => response.headers)
   *      .then(headers => console.log(headers));
   */
  return router
}
