const http = require("http");
const { randomUUID } = require("crypto");

let users = [
    {
        id: "1",
        name: "John Doe",
        email: "john.doe@example.com",
        age: 30,
    }
];

// Helper: Send JSON response
const sendResponse = (res, statusCode, data) => {
    res.writeHead(statusCode, {
        "Content-Type": "application/json",
    });

    res.end(JSON.stringify(data));
};

// Helper: Read request body
const getRequestBody = (req) => {
    return new Promise((resolve, reject) => {
        let body = "";

        req.on("data", (chunk) => {
            body += chunk;
        });

        req.on("end", () => {
            try {
                const data = body ? JSON.parse(body) : {};
                resolve(data);

            } catch (error) {
                reject(error);
            }
        });

        req.on("error", reject);
    });
};

const server = http.createServer(async (req, res) => {
    const { method, url } = req;
    console.log(`[${new Date().toISOString()}] ${method} ${url}`);

    // =========================
    // CREATE USER
    // POST /api/users
    // =========================
    if (method === "POST" && url === "/api/users") {
        console.log({ method, url });

        try {
            const body = await getRequestBody(req);
            console.log(typeof body, "body");

            const user = {
                // id: randomUUID(),
                id: users.length + 1 + "",
                // ...body,
                name: body.name,
                email: body.email,
                age: body.age,
            };

            users.push(user);

            return sendResponse(res, 201, {
                status: true,
                message: "User created successfully",
                data: user,
            });
        } catch (error) {
            return sendResponse(res, 400, {
                status: false,
                message: "Invalid JSON",
            });
        }
    }

    // =========================
    // GET ALL USERS
    // GET /api/users
    // =========================
    if (method === "GET" && url === "/api/users") {
        return sendResponse(res, 200, {
            status: true,
            message: "Users fetched successfully",
            data: users,
        });
    }

    // =========================
    // GET SINGLE USER
    // GET /api/users/:id
    // =========================
    if (method === "GET" && url.startsWith("/api/users/")) {
        const id = url.split("/")[3];
        const user = users.find((user) => user.id === id);

        if (!user) {
            return sendResponse(res, 404, {
                status: false,
                message: "User not found",
            });
        }

        return sendResponse(res, 200, {
            status: true,
            message: "User fetched successfully",
            data: user,
        });
    }

    // =========================
    // UPDATE USER
    // PUT /api/users/:id
    // =========================
    if (method === "PUT" && url.startsWith("/api/users/")) {
        try {
            const id = url.split("/")[3];

            const user = users.find((user) => user.id === id);

            if (!user) {
                return sendResponse(res, 404, {
                    status: false,
                    message: "User not found",
                });
            }

            const body = await getRequestBody(req);

            user.name = body.name ?? user.name;
            user.email = body.email ?? user.email;
            user.age = body.age ?? user.age;

            return sendResponse(res, 200, {
                status: true,
                message: "User updated successfully",
                data: user,
            });
        } catch (error) {
            return sendResponse(res, 400, {
                status: false,
                message: "Invalid JSON",
            });
        }
    }

    // =========================
    // DELETE USER
    // DELETE /api/users/:id
    // =========================
    if (method === "DELETE" && url.startsWith("/api/users/")) {
        const id = url.split("/")[3];

        const userIndex = users.findIndex((user) => user.id === id);
        console.log(userIndex, "userIndex");

        if (userIndex === -1) {
            return sendResponse(res, 404, {
                status: false,
                message: "User not found",
            });
        }

        const deletedUser = users.splice(userIndex, 1)[0];

        return sendResponse(res, 200, {
            status: true,
            message: "User deleted successfully",
            data: deletedUser,
        });
    }

    // =========================
    // 404
    // =========================
    return sendResponse(res, 404, {
        status: false,
        message: "Route not found",
    });
});

// Start server
const PORT = 5000;

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});