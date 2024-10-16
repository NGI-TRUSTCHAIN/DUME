const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')
const $rdf = require('rdflib')

const app = express()
app.use(bodyParser.json())

const aclDirectory = path.join(__dirname, '../data')
const ACL = $rdf.Namespace('http://www.w3.org/ns/auth/acl#')
const RDF = $rdf.Namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#')

// Convert URL to file system path
const urlToFilePath = (url) => {
  const urlObject = new URL(url)
  return path.join(aclDirectory, urlObject.hostname, urlObject.pathname)
}

const loadAclFile = (filePath, baseUri) => {
  const store = $rdf.graph()
  if (fs.existsSync(filePath)) {
    const fileContent = fs.readFileSync(filePath, 'utf8')
    $rdf.parse(fileContent, store, baseUri, 'text/turtle')
  }
  return store
}

const saveAclFile = (filePath, store) => {
  const data = $rdf.serialize(null, store, undefined, 'text/turtle')
  fs.writeFileSync(filePath, data)
}

const getOwnerFromParentAcl = (resource) => {
  const parentUrl = new URL(resource)
  parentUrl.pathname = path.dirname(parentUrl.pathname)
  const parentAclPath = urlToFilePath(parentUrl.toString() + '.acl')
  const store = loadAclFile(parentAclPath, parentUrl.toString())

  const ownerStatements = store.statementsMatching(null, ACL('agent'), null)
  const ownerNodes = ownerStatements
    .filter(statement => store.holds(statement.subject, ACL('mode'), ACL('Control')))
    .map(statement => statement.object)

  return ownerNodes
}

const addOwnerPermissions = (store, resourceNode, ownerNodes) => {
  const ownerAuthNode = $rdf.sym(`${resourceNode.value}#owner`)

  store.add(ownerAuthNode, RDF('type'), ACL('Authorization'))
  store.add(ownerAuthNode, ACL('accessTo'), resourceNode)
  ownerNodes.forEach(ownerNode => {
    store.add(ownerAuthNode, ACL('agent'), ownerNode)
  })
  store.add(ownerAuthNode, ACL('mode'), ACL('Control'))
  store.add(ownerAuthNode, ACL('mode'), ACL('Read'))
  store.add(ownerAuthNode, ACL('mode'), ACL('Write'))
  store.add(ownerAuthNode, ACL('default'), resourceNode)
}

const updateAclFile = (resource, agent, permissions, action, origin = null) => {
  if (!resource || !agent || !permissions || !Array.isArray(permissions)) {
    throw new Error('Invalid input: resource, agent, and permissions are required and permissions must be an array.')
  }

  const aclFilePath = urlToFilePath(resource.endsWith('/') ? `${resource}.acl` : `${resource}.acl`)
  const aclDir = path.dirname(aclFilePath)
  if (!fs.existsSync(aclDir)) {
    fs.mkdirSync(aclDir, { recursive: true })
  }
  const store = loadAclFile(aclFilePath, resource)

  const resourceNode = $rdf.sym(resource)
  const agentNode = $rdf.sym(agent.endsWith('#me') ? agent : `${agent}#me`)

  // Add owner permissions if this is the first creation
  if (!store.any(null, ACL('accessTo'), resourceNode)) {
    const ownerNodes = getOwnerFromParentAcl(resource)
    addOwnerPermissions(store, resourceNode, ownerNodes)
  }

  // Generate a unique identifier for the authorization node
  const authNode = $rdf.blankNode()

  if (action === 'grant') {
    store.add(authNode, RDF('type'), ACL('Authorization'))
    store.add(authNode, ACL('accessTo'), resourceNode)
    store.add(authNode, ACL('default'), resourceNode)
    store.add(authNode, ACL('agent'), agentNode)

    permissions.forEach((perm) => {
      const permNode = ACL(perm)
      if (!store.holds(authNode, ACL('mode'), permNode)) {
        store.add(authNode, ACL('mode'), permNode)
      }
    })

    if (origin) {
      store.add(authNode, ACL('origin'), $rdf.sym(origin))
    }
  } else if (action === 'remove') {
    const existingAuths = store.match(null, ACL('accessTo'), resourceNode)
      .filter(auth => store.holds(auth.subject, ACL('agent'), agentNode))

    existingAuths.forEach(auth => {
      permissions.forEach((perm) => {
        store.removeMany(auth.subject, ACL('mode'), ACL(perm))
      })

      if (origin) {
        store.removeMany(auth.subject, ACL('origin'), $rdf.sym(origin))
      }
    })
  }

  saveAclFile(aclFilePath, store)
}

const grantAccess = (req, res) => {
  try {
    const { resource, agent, permissions, origin = null } = req.body
    if (!resource || !agent || !permissions) {
      return res.status(400).send('Missing required fields: resource, agent, permissions.')
    }
    updateAclFile(resource, agent, permissions, 'grant', origin)
    res.send(`Access granted for ${agent} on ${resource} with ${permissions.join(', ')} permissions.`)
  } catch (error) {
    console.error('Error granting access:', error)
    res.status(500).send(`Error granting access: ${error.message}`)
  }
}

const removeAccess = (req, res) => {
  try {
    const { resource, agent, permissions, origin = null } = req.body
    if (!resource || !agent || !permissions) {
      return res.status(400).send('Missing required fields: resource, agent, permissions.')
    }
    updateAclFile(resource, agent, permissions, 'remove', origin)
    res.send(`Access removed for ${agent} on ${resource} with ${permissions.join(', ')} permissions.`)
  } catch (error) {
    console.error('Error removing access:', error)
    res.status(500).send(`Error removing access: ${error.message}`)
  }
}

module.exports = {
  grantAccess,
  removeAccess
}
