# DUME Solid Server
=======

Welcome to the DUME Project repository, an extension of the Node Solid Server.
Our project builds upon the base code of the [Node Solid Server](https://github.com/nodeSolidServer/node-solid-server) to fulfill the needs of the DUME project. 
This README will guide you through deploying and using the server, along with providing detailed information about the DUME project, its use case, added functionalities, and modifications.

Table of Contents
-----------------

1.  [Introduction](#introduction)
2.  [DUME Project Overview](#dume-project-overview)
3.  [Installation](#installation)
4.  [Usage](#usage)
5.  [Testing](#testing)
6.  [Contribution](#contribution)
8.  [DUME - Solid Extension](#dume-solid-extension)
9.  [License](#license)

Introduction
------------

The DUME project is built on the foundation of the [Node Solid Server](https://github.com/nodeSolidServer/node-solid-server). Our primary aim is to extend or adapt the functionalities of the Solid Server implementation to manage large-scale media datasets on decentralized web platforms, specifically tailored for the Theia Vision platform.

DUME Project Overview
---------------------

### Objectives

Project DUME seeks to revolutionize digital platforms like Theia Vision by shifting towards a decentralized, user-centric framework. Key objectives include:

-   Extending or adapting the Solid implementation to handle large-scale media data management.
-   Implementing decentralized user data control.
-   Enhancing AI-driven urban event detection while ensuring data privacy.

### Architecture

![Architecture](Images/Architecture.jpg?raw=true "Title")

### Theia Vision

The Theia Vision is a key component of the DUME project, designed to empower both individuals and organizations in the effective monitoring and management of urban environments through advanced image analysis. 
Theia Vision leverages state-of-the-art AI to enhance the management of public spaces through advanced image analysis. It excels in identifying and tracking various occurrences within public areas, ranging from environmental concerns like improper waste disposal and graffiti to safety issues such as unattended bags or suspicious activities. 
There are three main components of Theia Vision:
-  An mobile app that encourages both professional and citizen contributions by capturing images while they travel in their daily endevours.
-  A server with an AI that analises the captured images to detect anomalies.
-  A web platform that reports the detected anomalies.

Thus far these images were stored in Theia Vision server thus making their owners relinquish any rights over how they were used.

The introduction of personal SOLID pods as hosts for these images tacles this issue by ensuring that the users retain control over their captured images and their usage. 

Installation
------------

## solid-server in Node

The original features of Node Solid Server remain intact in this implementation, and the same applies to the installation guide. 
For convenience we reproduce here the installation instructions.

## Solid Features supported
- [x] [Linked Data Platform](http://www.w3.org/TR/ldp/)
- [x] [Web Access Control](http://www.w3.org/wiki/WebAccessControl)
- [x] [WebID+TLS Authentication](https://www.w3.org/2005/Incubator/webid/spec/tls/)
- [x] [Real-time live updates](https://github.com/solid/solid-spec#subscribing) (using WebSockets)
- [x] Identity provider for WebID
- [x] CORS proxy for cross-site data access
- [x] Group members in ACL
- [x] Email account recovery

## Command Line Usage

### Install

This and the following sections describe the installation using Node.js directly.

**Note**: If using Git for Windows, it is helpful to use the -verbose flag to see the progress of the install.

To install, first install [Node](https://nodejs.org/en/) and then run the following

```bash
$ npm install -g solid-server
```


### Run a single-user server (beginner)

The easiest way to setup `solid-server` is by running the wizard. This will create a `config.json` in your current folder

```bash
$ solid init
```
**Note**: If prompted for an SSL key and certificate, follow the instructions below.

To run your server, simply run `solid start`:

```bash
$ solid start
# Solid server (solid v0.2.24) running on https://localhost:8443/
```

If you prefer to use flags instead, the following would be the equivalent

```bash
$ solid start --port 8443 --ssl-key path/to/ssl-key.pem --ssl-cert path/to/ssl-cert.pem
# Solid server (solid v0.2.24) running on https://localhost:8443/
```

If you want to run `solid` on a particular folder (different from the one you are in, e.g. `path/to/folder`):

```bash
$ solid start --root path/to/folder --port 8443 --ssl-key path/to/ssl-key.pem --ssl-cert path/to/ssl-cert.pem
# Solid server (solid v0.2.24) running on https://localhost:8443/
```

By default, `solid` runs in `debug all` mode. To stop the debug logs, use `-q`, the quiet parameter.

```bash
$ DEBUG="solid:*" solid start -q
# use quiet mode and set debug to all
# DEBUG="solid:ACL" logs only debug.ACL's

```

### Running in development environments

Solid requires SSL certificates to be valid, so you cannot use self-signed certificates. To switch off this security feature in development environments, you can use the `bin/solid-test` executable, which unsets the `NODE_TLS_REJECT_UNAUTHORIZED` flag and sets the `rejectUnauthorized` option.

If you want to run in multi-user mode on localhost, do the following:
* configure the server as such with `bin/solid-test init`
* start the server with `bin/solid-test start`
* visit https://localhost:8443 and register a user, for instance 'myusername'.
* Edit your hosts file and add a line `127.0.0.1 myusername.localhost`
* Now you can visit https://myusername.localhost:8443.

##### How do I get an SSL key and certificate?
You need an SSL certificate from a _certificate authority_, such as your domain provider or [Let's Encrypt!](https://letsencrypt.org/getting-started/).

For testing purposes, you can use `bin/solid-test` with a _self-signed_ certificate, generated as follows:

```
$ openssl req -outform PEM -keyform PEM -new -x509 -sha256 -newkey rsa:2048 -nodes -keyout ../privkey.pem -days 365 -out ../fullchain.pem

```

Note that this example creates the `fullchain.pem` and `privkey.pem` files
in a directory one level higher from the current, so that you don't
accidentally commit your certificates to `solid` while you're developing.

If you would like to get rid of the browser warnings, import your fullchain.pem certificate into your 'Trusted Root Certificate' store.

### Running Solid behind a reverse proxy (such as NGINX)
See [Running Solid behind a reverse proxy](https://github.com/solid/node-solid-server/wiki/Running-Solid-behind-a-reverse-proxy).

### Run multi-user server (intermediate)

You can run `solid` so that new users can sign up, in other words, get their WebIDs _username.yourdomain.com_.

Pre-requisites:
- Get a [Wildcard Certificate](https://en.wikipedia.org/wiki/Wildcard_certificate)
- Add a Wildcard DNS record in your DNS zone (e.g.`*.yourdomain.com`)
- (If you are running locally) Add the line `127.0.0.1 *.localhost` to `/etc/hosts`

```bash
$ solid init
..
? Allow users to register their WebID (y/N) # write `y` here
..
$ solid start
```

Otherwise, if you want to use flags, this would be the equivalent

```bash
$ solid start --multiuser --port 8443 --ssl-cert /path/to/cert --ssl-key /path/to/key --root ./data
```

Your users will have a dedicated folder under `./data` at `./data/<username>.<yourdomain.tld>`. Also, your root domain's website will be in `./data/<yourdomain.tld>`. New users can create accounts on `/api/accounts/new` and create new certificates on `/api/accounts/cert`. An easy-to-use sign-up tool is found on `/api/accounts`.

##### How can I send emails to my users with my Gmail?

> To use Gmail you may need to configure ["Allow Less Secure Apps"](https://www.google.com/settings/security/lesssecureapps) in your Gmail account unless you are using 2FA in which case you would have to create an [Application Specific](https://security.google.com/settings/security/apppasswords) password. You also may need to unlock your account with ["Allow access to your Google account"](https://accounts.google.com/DisplayUnlockCaptcha) to use SMTP.

also add to `config.json`
``` 
  "useEmail": true,
  "emailHost": "smtp.gmail.com",
  "emailPort": "465",
  "emailAuthUser": "xxxx@gmail.com",
  "emailAuthPass": "gmailPass"
```


### Extra flags (expert)
The command line tool has the following options

```
$ solid

  Usage: solid [options] [command]

  Commands:
    init [options]    create solid server configurations
    start [options]   run the Solid server

  Options:
    -h, --help     output usage information
    -V, --version  output the version number


$ solid init --help

  Usage: init [options]
  Create solid server configurations

  Options:
    -h, --help  output usage information
    --advanced  Ask for all the settings


$ solid start --help

  Usage: start [options]

  run the Solid server


  Options:

    --root [value]                Root folder to serve (default: './data')
    --port [value]                SSL port to use
    --server-uri [value]          Solid server uri (default: 'https://localhost:8443')
    --webid                       Enable WebID authentication and access control (uses HTTPS)
    --mount [value]               Serve on a specific URL path (default: '/')
    --config-path [value]
    --config-file [value]
    --db-path [value]
    --auth [value]                Pick an authentication strategy for WebID: `tls` or `oidc`
    --owner [value]               Set the owner of the storage (overwrites the root ACL file)
    --ssl-key [value]             Path to the SSL private key in PEM format
    --ssl-cert [value]            Path to the SSL certificate key in PEM format
    --no-reject-unauthorized      Accept self-signed certificates
    --multiuser                   Enable multi-user mode
    --idp [value]                 Obsolete; use --multiuser
    --no-live                     Disable live support through WebSockets
    --proxy [value]               Obsolete; use --corsProxy
    --cors-proxy [value]          Serve the CORS proxy on this path
    --suppress-data-browser       Suppress provision of a data browser
    --data-browser-path [value]   An HTML file which is sent to allow users to browse the data (eg using mashlib.js)
    --suffix-acl [value]          Suffix for acl files (default: '.acl')
    --suffix-meta [value]         Suffix for metadata files (default: '.meta')
    --secret [value]              Secret used to sign the session ID cookie (e.g. "your secret phrase")
    --error-pages [value]         Folder from which to look for custom error pages files (files must be named <error-code>.html -- eg. 500.html)
    --force-user [value]          Force a WebID to always be logged in (useful when offline)
    --strict-origin               Enforce same origin policy in the ACL
    --use-email                   Do you want to set up an email service?
    --email-host [value]          Host of your email service
    --email-port [value]          Port of your email service
    --email-auth-user [value]     User of your email service
    --email-auth-pass [value]     Password of your email service
    --use-api-apps                Do you want to load your default apps on /api/apps?
    --api-apps [value]            Path to the folder to mount on /api/apps
    --redirect-http-from [value]  HTTP port or ','-separated ports to redirect to the solid server port (e.g. "80,8080").
    --server-name [value]         A name for your server (not required, but will be presented on your server's frontpage)
    --server-description [value]  A description of your server (not required)
    --server-logo [value]         A logo that represents you, your brand, or your server (not required)
    --enforce-toc                 Do you want to enforce Terms & Conditions for your service?
    --toc-uri [value]             URI to your Terms & Conditions
    --support-email [value]       The support email you provide for your users (not required)
    -q, --quiet                   Do not print the logs to console
    -h, --help                    output usage information
```

Instead of using flags, these same options can also be configured via environment variables taking the form of `SOLID_` followed by the `SNAKE_CASE` of the flag. For example `--api-apps` can be set via the `SOLID_API_APPS`environment variable, and `--serverUri` can be set with `SOLID_SERVER_URI`.

CLI flags take precedence over Environment variables, which take precedence over entries in the config file.

Configuring Solid via the config file can be a concise and convenient method and is the generally recommended approach. CLI flags can be useful when you would like to override a single configuration parameter, and using environment variables can be helpful in situations where you wish to deploy a single generic Docker image to multiple environments.


## Library Usage

### Install Dependencies

```
npm install
```

### Library Usage

The library provides two APIs:

- `solid.createServer(settings)`: starts a ready to use
    [Express](http://expressjs.com) app.
- `lnode(settings)`: creates an [Express](http://expressjs.com) that you can
    mount in your existing express app.

In case the `settings` is not passed, then it will start with the following
default settings.

```javascript
{
  cache:        0,           // Set cache time (in seconds), 0 for no cache
  live:         true,        // Enable live support through WebSockets
  root:         './',        // Root location on the filesystem to serve resources
  secret:       'node-ldp',  // Express Session secret key
  cert:         false,       // Path to the ssl cert
  key:          false,       // Path to the ssl key
  mount:        '/',         // Where to mount Linked Data Platform
  webid:        false,       // Enable WebID+TLS authentication
  suffixAcl:    '.acl',      // Suffix for acl files
  corsProxy:    false,       // Where to mount the CORS proxy
  errorHandler: false,       // function(err, req, res, next) to have a custom error handler
  errorPages:   false        // specify a path where the error pages are
}
```

Have a look at the following examples or in the
[`examples/`](https://github.com/solid/node-solid-server/tree/master/examples) folder
for more complex ones

##### Simple Example

You can create a `solid` server ready to use using `solid.createServer(opts)`

```javascript
var solid = require('solid-server')
var ldp = solid.createServer({
    key: '/path/to/sslKey.pem',
    cert: '/path/to/sslCert.pem',
    webid: true
})
ldp.listen(3000, function() {
  // Started Linked Data Platform
})
```

##### Advanced Example

You can integrate `solid` in your existing [Express](https://expressjs.org)
app, by mounting the `solid` app on a specific path using `lnode(opts)`.

```javascript
var solid = require('solid-server')
var app = require('express')()
app.use('/test', solid(yourSettings))
app.listen(3000, function() {
  // Started Express app with ldp on '/test'
})
...
```

##### Logging

Run your app with the `DEBUG` variable set:

```bash
$ DEBUG="solid:*" node app.js
```

Testing Solid Locally
---------------------

## Pre-Requisites

In order to really get a feel for the Solid platform, and to test out `solid`,
you will need the following:

1. A WebID profile and browser certificate from one of the Solid-compliant
    identity providers, such as [solidcommunity.net](bourgeoa
    community.net).

2. A server-side SSL certificate for `solid` to use (see the section below
    on creating a self-signed certificate for testing).

While these steps are technically optional (since you could launch it in
HTTP/LDP-only mode), you will not be able to use any actual Solid features
without them.

## Creating a certificate for local testing

When deploying `solid` in production, we recommend that you go the
usual Certificate Authority route to generate your SSL certificate (as you
would with any website that supports HTTPS). However, for testing it locally,
you can easily [generate a self-signed certificate for whatever domain you're
Working with](https://github.com/solid/node-solid-server#how-do-i-get-an-ssl-key-and-certificate).

## Accessing your server

If you started your `solid` server locally on port 8443 as in the example
above, you would then be able to visit `https://localhost:8443` in the browser
(ignoring the Untrusted Connection browser warnings as usual), where your
`solid` server would redirect you to the default data viewer app.

## Editing your local `/etc/hosts`

To test certificates and account creation on subdomains, `solid`'s test suite
uses the following localhost domains: `nic.localhost`, `tim.localhost`, and
`nicola.localhost`. You will need to create host file entries for these, in
order for the tests to pass.

Edit your `/etc/hosts` file, and append:

```
# Used for unit testing solid
127.0.0.1 nic.localhost
127.0.0.1 tim.localhost
127.0.0.1 nicola.localhost
```

## Running the Unit Tests

```bash
$ npm test
# running the tests with logs
$ DEBUG="solid:*" npm test
```

In order to test a single component, you can run

```javascript
npm run test-(acl|formats|params|patch)
```

## Blacklisted usernames

By default Solid will not allow [certain usernames as they might cause
confusion or allow vulnerabilies for social engineering](https://github.com/marteinn/The-Big-Username-Blacklist).
This list is configurable via `config/usernames-blacklist.json`. Solid does not
blacklist profanities by default.

## Quota

By default, a file `serverSide.ttl.inactive` will be installed to new
PODs. If you rename it to `serverSide.ttl`, it will currently set a
quota for disk usage.  This file is not writeable to users, only
server administrators who are authorized on the backend can modify
it. It is currently adviceable to remove it or set it inactive rather
than set a large quota, because the current implementation will impair
write performance if there is a lot of data.

Help and contribute
-------------------

Solid is only possible because of a large community of [contributors](https://github.com/solid/node-solid-server/blob/master/CONTRIBUTORS.md).
A heartfelt thank you to everyone for all of your efforts!

You can receive or provide help too:

- [Join us in Gitter](https://gitter.im/solid/chat) to chat about Solid or to hang out with us :)
- [NSS Gitter channel](https://gitter.im/solid/node-solid-server) for specific (installation) advice about this code base
- [Create a new issue](https://github.com/solid/node-solid-server/issues/new) to report bugs
- [Fix an issue](https://github.com/solid/node-solid-server/issues)
- Reach out to @bourgeoa at alain.bourgeois10@gmail.com to become more involved in maintaining Node Solid Server

Have a look at [CONTRIBUTING.md](https://github.com/solid/node-solid-server/blob/master/CONTRIBUTING.md).


DUME Solid Extension
----------------------

# Added functionalities and modifications

## New Endpoints

**/new-pod** - Endpoint to handle the creation of new user pods. Although this function Is already possible in the original node solid server, (using the endpoint /api/accounts/new) It was designed to be used In a browser form and failed to return proper error codes with clear messages and included redirection to the user pod. To make the pod created more app friendly, we created this new endpoint that simply returns the standard HTTP codes upon creation or failure to do so.
Added files - create-new-pod.js
Modified files - ldp-middleware.js

The documentation for the creation of new user pods can be found at [Create New POD](https://dume-arditi.com/apidoc/#api-Pod-CreatePod)


**/jwt** - Endpoint to obtain an access token to be used as the user identifier to access resources or do actions.
Added files - jwtoken.js
Modified files - webid-oidc.js | ldp-middleware.js | create-app.js

The documentation for obtaining an access token can be found at [Generate JWT](https://dume-arditi.com/apidoc/#api-Authentication-GenerateJWT)


**/search-logs** - Endpoint as well as the whole logging Infrastructure was also Implemented In our node solid server to document all accesses to resources within a pod. The logs follow the following format:\
timestamp -method - resource - origin - statusCode - duration (in Ms) - userAgent - userWebId

For example, this is a log of a logged user trying to post something In another user's pod without having been granted the permission to do so:

2024-07-15T10:39:27.001Z - PUT - /theia-vision/ledger.json - ::ffff:37.189.223.22 - 403 - 333.302ms - PostmanRuntime/7.37.3 - https://test123.dume-arditi.com/profile/card#me

Added files - access-logging.js | server-logging.js | search-logs.js
Modified files - ldp-middleware.js

The documentation for searching in the logs can be found at [Search Logs](https://dume-arditi.com/apidoc/#api-Logs-SearchLogs)

**/api/metadata-search** - Endpoint that allows for complex queries over various filtering criteria In the Json files that are posted in the scope of theia-vision to detail the image collections.

This endpoint Is rather particular to our concrete use case, as it needed to be specific enough to be useful, and what It does Is lump all json files In the specified subdirectory and search within them, In the specified class for any of the defined parameters (startDate, endDate, coordinates, range (of coordenates), classes (of the anomaly detected), analysed, dateAnalysedStart, dateAnalysedEnd).

All these parameters are optional and can be used to broaden or restrict the search and return the intended set of images and their information (like the url to access them).

Added files - directory-utils.js | metadata-search-handler.js
Modified files - ldp-middleware.js

The documentation for complex metadata searching can be found at [Metadata Search](https://dume-arditi.com/apidoc/#api-Metadata-MetadataSearch)

**/query-folders** - Endpoint used within a pod to traverse all its content within the specified subdirectory (can be /* for the root directory) and then sends a list of the existing folders within that location. This Is a particularly useful functionality In any scope of use for a solid pod, as It allows users to have a complete perception of their pod structure without having to actually "browse" them within the server website.

Added files - directory-utils.js | query-files.js
Modified files - ldp-middleware.js

The documentation for querying folders can be found at [Query Folder](https://dume-arditi.com/apidoc/#api-Query-QueryFolders)

**/query-files** - Endpoint to traverse the content of a pod within the specified subdirectory task but for files, allowing users to have a complete list of files within any specific directory (and subdirectories).

Both of these endpoints have an additional date parameter so that users can limit their search to recent files. This Is particularly useful for our use case, as it allows the AI server to "record" the last access and then query, If granted access, the user pod for what Is new since then.

Added files - directory-utils.js | query-folders.js
Modified files - ldp-middleware.js

The documentation for querying files can be found at [Query Files](https://dume-arditi.com/apidoc/#api-Query-QueryFiles)

**/grantaccess** - Endpoint to grant accesses, to one's pod to other users or apps. This endpoint allows users to grant a specific (or multiple) kinds of access (Read, Write, Append, Control) to a specific resource, being It a file or a folder.

Added files - grant-access.js
Modified files - ldp-middleware.js

The documentation for granting access to a file or folder can be found at [Grant Access](https://dume-arditi.com/apidoc/#api-Access-GrantAccess)

**/revokeaccess** - Endpoint to revoke accesses, to one's pod to other users or apps. This endpoint allows users to revoke a specific kind of access (Read, Write, Append, Control) to a specific resource, being It a file or a folder.

Added files - grant-access.js
Modified files - ldp-middleware.js

The documentation for revoking access to a file or folder can be found at [Revoke Access](https://dume-arditi.com/apidoc/#api-Access-RevokeAccess)

**/apidoc** - Documentation endpoint.
Modified files - All the files with routing.

The general documentation for the API can be found at [Api Documentation](https://dume-arditi.com/apidoc/)

## Improved Features

**Post** - Fixes in the multipart post as it was not working properly.
Modified files - post.js | ldp.js

The documentation for multipart posting (and posting in general) can be found at [POST](https://dume-arditi.com/apidoc/#api-Resource-PostResource)

**Get** - Adition of the batch option to retrieve the content of a whole folder as a zip file.
Modified files - get.js

The documentation for batch get (and retrieving in general) can be found at [GET](https://dume-arditi.com/apidoc/#api-Resource-GetResource)

## WebSocket Notifications
The WebSocket server has been completely overhauled to enable real-time notifications for subscribed resources with actual valid information. 
This allows clients to subscribe to specific folders (both public and private) and receive updates when changes occur.

**Subscription:** Clients can establish a WebSocket connection and subscribe to specific folders by sending a subscription command. Public folders do not require authorization, while private folders require a valid JWT token.

**Notifications:** After a successful subscription, clients will receive real-time notifications for operations such as file updates, uploads, or deletes within the subscribed folder.

**Usage:**

***Public Folders:***

No authorization is required to subscribe to public folders.
```javascript
const ws = new WebSocket('wss://userpod.dume-arditi.com/');
ws.onopen = function() {
    ws.send('sub /public/');
};
ws.onmessage = function(event) {
    console.log('Message from server: ', event.data);
};
```

***Private Folders:***

A JWT token is required to subscribe to private folders.

```javascript
const ws = new WebSocket('wss://userpod.dume-arditi.com/', {
    headers: {
        'Authorization': 'Bearer [token]'
    }
});
ws.onopen = function() {
    ws.send('sub /private-folder/');
};
ws.onmessage = function(event) {
    console.log('Message from server: ', event.data);
};
```

The documentation for the notifications can be found at [https://dume-arditi.com/apidoc/#api-WebSocket-SubscribeWebSocket](https://dume-arditi.com/apidoc/#api-WebSocket-SubscribeWebSocket)



# Theia Vision Use Case

Bellow are some sequence diagrams of the essential use cases for the integration of the Solid pods with the Theia-Vision Infrastructure

### Application

![RegisterSolidServer](Images/RegisterSolidServer.jpg?raw=true "Title")
![PostToSolid](Images/PostToSolid.jpg?raw=true "Title")

### AI Server

![AIServer](Images/AIServer.jpg?raw=true "Title")


### Web platform

![WebApp](Images/WebApp.jpg?raw=true "Title")


License
-------
[The MIT License](https://github.com/solid/node-solid-server/blob/master/LICENSE.md)

