const fs = require('fs')
const http = require('http');
const url = require('url')

const server = http.createServer((req, res) => {
    const pathName = req.url

    if (pathName === '/overview') {
        res.end('This is the OVERVIEW')
    } else if (pathName === '/product') {
        res.end('This is the product')
    } else if (pathName === '/api') {

        fs.readFile(`${__dirname}/dev-data/data.json`, 'utf-8', (err, data) => {
            const productData = JSON.parse(data)
            res.writeHead(200, { 'Content-type': 'application/json'})
        })
        res.end(data)
    } else {
        res.writeHead(404, {
            'Content-type': 'text/html'
        })
        res.end('<h1>Page not found!</h1>')
    }

    res.end('Hello from the server!')
})

server.listen(8000, '127.0.0.1', () => {
    console.log('Listening to requests on port 8000')
})

