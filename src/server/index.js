const http = require("http");
const fs = require("fs");

const server = http.createServer();

server.on("request", (request, response) => {
	var url = request.url;
	var method = request.method;
	if (method === "GET" && url === "/read") {
		fs.readFile("../log.txt", function (err, data) {
			if (err) {
				return response.end("您访问的资源不存在~");
			}

			response.end(data);
		});
    }
    if(method === "POST" && url === "/write"){

    }
});

server.listen(9090, () => {
	console.log("服务器启动成功，监听端口：", 9090);
});
