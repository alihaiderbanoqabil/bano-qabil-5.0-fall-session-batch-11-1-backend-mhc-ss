const http = require("http");

const PORT = 5000;

const server = http.createServer((req, res) => {
    console.log("req: ", req);
    console.log("res: ", res);

    res.writeHead(200, {
        "Content-Type": "application/json",
    });
    
    res.end(JSON.stringify({
        message: "Hello"
    }));
})

// const server = http.createServer((req, res) => {
//     console.log("req: ", req);
//     console.log("res: ", res);

//     res.writeHead(200, {
//         "Content-Type": "text/plain",
//     });

//     res.end("Hello from Node.js server!");
// })

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
