// added for the acess logging
const $rdf = require('rdflib')
const fs = require('fs')
const path = require('path')

// Define the root path of the project
const rootPath = path.resolve(__dirname)
const logDirectory = path.join(rootPath, 'log')
const logFilePath = path.join(logDirectory, 'application.log')

// Ensure the log directory exists
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true })
}

// Logger function that appends logs to a file
function fileLogger (message) {
  const logMessage = `${new Date().toISOString()} - ${message}\n`
  fs.appendFileSync(logFilePath, logMessage)
}

/* function logPodAccess(req, res, next) {
  const hostname = req.hostname;
  const mainDomain = req.app.locals.host.hostname;

  if (hostname === mainDomain) {
    return next();  // Skip logging if the request is to the main domain
  }

  const requestURL = new URL(req.originalUrl, `https://${hostname}`);
  const pathname = requestURL.pathname;

  //const fullURL = requestURL.toString().toLowerCase();  // Normalize to lower case for consistent comparison

  // Skip logging if the request URL contains 'access-log' or 'access_logs'
  if (requestURL.toString().includes('access-log.ttl')) {
    return next();
  }

  try {
    //const podName = getPodName(req.hostname, req.originalUrl);
    let podBaseDir = req.app.locals.resourceMapper.resolveFilePath(hostname, pathname);

    //let podBaseDir = req.app.locals.resourceMapper.resolveFilePath(hostname, requestURL.pathname);

    // Dynamically strip the pathname (if it exists)
    const pathnameIndex = podBaseDir.indexOf(pathname);
    if (pathnameIndex !== -1) {
      podBaseDir = podBaseDir.substring(0, pathnameIndex);
    }

    const urlObject = new URL(req.originalUrl, `https://${hostname}`); // Construct URL object
    const cleanPathname = urlObject.pathname; // Extract only the pathname
    podBaseDir = podBaseDir.replace(pathname, cleanPathname); // Update with clean path

    const logsDir = path.join(podBaseDir, 'Access_Logs')
    const logFilePath = path.join(logsDir, 'access-log.ttl');

    // Ensure the logs directory exists and create ACL file if necessary
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
      //createAccessLogsAcl(logsDir, hostname);  // Call function to create ACL file
      fileLogger("Directory created successfully.");
    }

    const logFileURI = `https://${hostname}/Access_Logs/access-log.ttl`;  // Construct a web-accessible URI for RDF
    const store = $rdf.graph();
    const fetcher = new $rdf.Fetcher(store);
    // Load RDF data from the log file, if it exists
    fetcher.load(logFileURI).catch(() => {
      //fileLogger("No existing log file, creating new one.");
    }).finally(() => {
      const logEntry = $rdf.sym(`${requestURL.toString()}#log${Date.now()}`);
      const timestamp = new Date().toISOString();

      store.add(logEntry, $rdf.sym('http://purl.org/dc/terms/date'), $rdf.literal(timestamp));
      store.add(logEntry, $rdf.sym('http://xmlns.com/foaf/0.1/Agent'), $rdf.sym(`${requestURL.origin}/profile/card#me`));
      store.add(logEntry, $rdf.sym('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), $rdf.sym('http://xmlns.com/foaf/0.1/Document'));

      $rdf.serialize(null, store, logFileURI, 'text/turtle', (err, data) => {
        if (err) {
          fileLogger(`Error serializing RDF: ${err}`);
        } else {
          fs.writeFileSync(logFilePath, data);  // Write the RDF data back to the file system
        }
      });
    });
    next();
  } catch (error) {
    fileLogger(`Error processing request: ${error.message}`);
    next(error);
  }
} */

/* function logPodAccess(req, res, next) {
  const hostname = req.hostname;
  const mainDomain = req.app.locals.host.hostname;

  if (hostname === mainDomain) {
    return next();  // Skip logging if the request is to the main domain
  }

  const originHeader = req.get('origin') || '';
  const refererHeader = req.get('referer') || '';

  // Skip logging if the origin or referer header contains the server's hostname
  if (originHeader.includes(mainDomain) || refererHeader.includes(mainDomain)) {
    return next();
  }

  const requestURL = new URL(req.originalUrl, `https://${hostname}`);
  const pathname = requestURL.pathname;

  // Skip logging if the request is for the access log itself or the logs directory
  if (pathname.includes('/Access_Logs/access-log.ttl')) {
    return next();
  }

  try {
    let podBaseDir = req.app.locals.resourceMapper.resolveFilePath(hostname, pathname);
    const logsDir = path.join(podBaseDir, 'Access_Logs');
    const accessLogPath = path.join(logsDir, 'access-log.ttl');

    // Ensure the logs directory exists and create ACL file if necessary
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
      //createAccessLogsAcl(logsDir, hostname);  // Call function to create ACL file
      fileLogger("Directory created successfully.");
    }

    const logFileURI = `https://${hostname}/Access_Logs/access-log.ttl`;
    const store = $rdf.graph();

    // Read existing RDF data directly from the log file if it exists
    if (fs.existsSync(accessLogPath)) {
      const existingData = fs.readFileSync(accessLogPath, 'utf8');
      $rdf.parse(existingData, store, logFileURI, 'text/turtle');
    } else {
      // Initialize prefixes if file is new
      store.add(
        $rdf.sym(''),
        $rdf.sym('http://www.w3.org/2000/01/rdf-schema#label'),
        $rdf.literal('Access Log for Pod')
      );
    }

    const logEntry = $rdf.sym(`${requestURL.toString()}#log${Date.now()}`);
    const timestamp = new Date().toISOString();
    const clientIp = req.ip || 'Unknown IP';
    const clientHost = req.hostname || 'Unknown Host';
    const httpMethod = req.method;
    const accessedPath = req.originalUrl;

    store.add(logEntry, $rdf.sym('http://purl.org/dc/terms/date'), $rdf.literal(timestamp));
    store.add(logEntry, $rdf.sym('http://xmlns.com/foaf/0.1/Agent'), $rdf.sym(`${requestURL.origin}/profile/card#me`));
    store.add(logEntry, $rdf.sym('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), $rdf.sym('http://xmlns.com/foaf/0.1/Document'));
    store.add(logEntry, $rdf.sym('http://www.w3.org/ns/ldp#origin'), $rdf.literal(clientIp));
    store.add(logEntry, $rdf.sym('http://www.w3.org/ns/ldp#host'), $rdf.literal(clientHost));
    store.add(logEntry, $rdf.sym('http://www.w3.org/ns/ldp#method'), $rdf.literal(httpMethod));
    store.add(logEntry, $rdf.sym('http://www.w3.org/ns/ldp#path'), $rdf.literal(accessedPath));

    // Serialize the updated store to Turtle format
    $rdf.serialize(null, store, logFileURI, 'text/turtle', (err, newData) => {
      if (err) {
        fileLogger(`Error serializing RDF: ${err}`);
      } else {
        fs.writeFileSync(accessLogPath, newData);  // Write the updated RDF data back to the file system
      }
    });

    next();
  } catch (error) {
    fileLogger(`Error processing request: ${error.message}`);
    next(error);
  }
}

function getPodName(hostname, pathname) {
  // You might need to refine this logic based on your pod naming conventions
  const hostnameParts = hostname.split('.');
  let podName = hostnameParts[0]; // Assume first part of hostname is the pod

  // Additional check if pathname hints at pod name
  if (pathname.startsWith('/')) {
    const firstPathSegment = pathname.split('/')[1];
    if (firstPathSegment) {
      podName = firstPathSegment;
    }
  }

  return podName;
} */

function logPodAccess (req, res, next) {
  const hostname = req.hostname
  const mainDomain = req.app.locals.host.hostname

  if (hostname === mainDomain) {
    return next() // Skip logging if the request is to the main domain
  }

  const originHeader = req.get('origin') || ''
  const refererHeader = req.get('referer') || ''

  // Skip logging if the origin or referer header contains the server's hostname
  if (originHeader.includes(mainDomain) || refererHeader.includes(mainDomain)) {
    return next()
  }

  const requestURL = new URL(req.originalUrl, `https://${hostname}`)
  const pathname = requestURL.pathname

  // Skip logging if the request is for the access log itself or the logs directory
  if (pathname.includes('/Access_Logs/access-log.ttl') || pathname.includes('/Access_Logs/')) {
    return next()
  }

  try {
    const podBaseDir = req.app.locals.resourceMapper.resolveFilePath(hostname, pathname)
    const logsDir = path.join(podBaseDir, 'Access_Logs')
    const accessLogPath = path.join(logsDir, 'access-log.ttl')

    // Ensure the logs directory exists and create ACL file if necessary
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true })
      createAccessLogsAcl(logsDir, hostname) // Call function to create ACL file
      fileLogger('Directory created successfully.')
    }

    const logFileURI = `https://${hostname}/Access_Logs/access-log.ttl`
    const store = $rdf.graph()
    const fetcher = new $rdf.Fetcher(store)

    // Load RDF data from the log file, if it exists
    fetcher.load(logFileURI).catch(() => {
      // Log file may not exist, hence the catch
    }).finally(() => {
      const logEntry = $rdf.sym(`${requestURL.toString()}#log${Date.now()}`)
      const timestamp = new Date().toISOString()
      const clientIp = req.ip || 'Unknown IP'
      const httpMethod = req.method
      const accessedPath = req.originalUrl

      store.add(logEntry, $rdf.sym('http://purl.org/dc/terms/date'), $rdf.literal(timestamp))
      store.add(logEntry, $rdf.sym('http://xmlns.com/foaf/0.1/Agent'), $rdf.sym(`${requestURL.origin}/profile/card#me`))
      store.add(logEntry, $rdf.sym('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), $rdf.sym('http://xmlns.com/foaf/0.1/Document'))
      store.add(logEntry, $rdf.sym('http://www.w3.org/ns/ldp#origin'), $rdf.literal(clientIp))
      store.add(logEntry, $rdf.sym('http://www.w3.org/ns/ldp#method'), $rdf.literal(httpMethod))
      store.add(logEntry, $rdf.sym('http://www.w3.org/ns/ldp#path'), $rdf.literal(accessedPath))

      // Serialize the updated store to Turtle format
      $rdf.serialize(null, store, logFileURI, 'text/turtle', (err, newData) => {
        if (err) {
          fileLogger(`Error serializing RDF: ${err}`)
        } else {
          fs.writeFileSync(accessLogPath, newData) // Write the updated RDF data back to the file system
        }
      })
    })

    next()
  } catch (error) {
    fileLogger(`Error processing request: ${error.message}`)
    next(error)
  }
}

function createAccessLogsAcl (logsDir, hostname) {
  const aclFilePath = path.join(logsDir, '.acl')
  const aclContent = `
    @prefix acl: <http://www.w3.org/ns/auth/acl#>.
    @prefix foaf: <http://xmlns.com/foaf/0.1/>.

    <#owner>
        a acl:Authorization;
        acl:agent <https://${hostname}/Access_Logs/; 
        acl:accessTo <./>;
        acl:default <./>;
        acl:mode acl:Read, acl:Write, acl:Control.
    
    <#public>
        a acl:Authorization;
        acl:agentClass foaf:Agent;
        acl:accessTo <./>;
        acl:default <./>;
        acl:mode acl:Read.
  `
  fs.writeFileSync(aclFilePath, aclContent)
  fileLogger(`ACL file created at: ${aclFilePath}`)
}

module.exports = {
  fileLogger,
  logPodAccess,
  createAccessLogsAcl
}
