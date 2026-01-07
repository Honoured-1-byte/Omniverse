const http = require('http');
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify({ reply: "Test Server Online" }));
});
server.listen(3004, () => console.log("Test server running on 3004"));
