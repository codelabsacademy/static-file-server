const http = require('http')
const url = require('url')
const fs = require('fs')
const path = require('path')



// mimeType object maps each file extension to its correct content-type
const mimeType = {
  '.ico': 'image/x-icon',
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.json': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.zip': 'application/zip',
  '.doc': 'application/msword',
  '.eot': 'application/vnd-ms-fontobject',
  '.ttf': 'application/x-font-ttf'
}


http.createServer((request, response) => {
  
  // Parse URL
  let parseURL = url.parse(request.url, true)

  // Remove extra characters (for example /index.html/ becomes /index.html)
  let file_path = parseURL.path.replace(/^\/+|\/+$/g, "")


  // Serve index.html as default file
  if(file_path == ""){
    file_path = "index.html"
  }

  // Construct the file path
  let file = __dirname + "/public/" + file_path

  // Read the file and return it on the callback
  fs.readFile(file, function(err, content) {

    // Check for errors (requested file cannot be found in the public folder)
    if(err) {

      // Set the status code as 404 meaning the resource was not found
      response.writeHead(404)

      // Close the response, return an error
      response.end()
    } else {

      // Specify the content type in the response header
      response.setHeader('X-Content-Type-Options', 'nosniff')

      // Extract the extension from the file path
      const extension = path.parse(file).ext

      // Get the corresponding content-type
      const mime = mimeType[extension]

      // Set the correct content type and the status code as 200
      response.writeHead(200, {"Content-type": mime})

      // Close the response, return the page
      response.end(content)
    }
  })
}).listen(3000)