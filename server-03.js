var sys = require('sys'), http = require('http'), url = require('url'), path = require('path'), fs = require('fs'), io = require('socket.io');
var server = http.createServer(
//This method intercepts all requests to the web server.
function(request, response) {
	var uri = url.parse(request.url).pathname;
	if(uri == "/") {
		uri = "/index-03.html";
	}
	load_static_file(uri, response);
});
var io = io.listen(server);
io.set('log level', 1);

io.sockets.on('connection', function(socket) {
	socket.on('textMessage', function(message) {
		var parseColor = /^#[0-9A-Fa-f]{6}$/;

		if(parseColor.test(message)) {
			console.log('got color');
			socket.emit('backgroundColorEvent', message);
			socket.broadcast.emit('backgroundColorEvent', message);
		} else {
			socket.emit('textMessage', message);
			socket.broadcast.emit('textMessage', message);
		}
	});
	socket.on('orientation', function(a, b, c) {sendColor(socket, calculateColor(a, b, c));
	});
	socket.on('disconnect', function() {
	});
});
function calculateColor(alpha, beta, gamma) {
	var r = Math.round((alpha + 180) / 360 * 256);
	var g = Math.round((beta + 90) / 180 * 256);
	var b = Math.round((gamma + 180) / 360 * 256);
	return '#' + formatColorComponentAsHex(r) + formatColorComponentAsHex(g) + formatColorComponentAsHex(b);
}

function formatColorComponentAsHex(colorComp) {
	var hexStr = colorComp.toString(16);
	if(hexStr.length == 1) {
		hexStr = '0' + hexStr;
	}
	return hexStr;
}

function sendColor(socket, color) {
	socket.emit('addColorEvent', color);
	socket.broadcast.emit('addColorEvent', color);
}

//This method loads files into the response from the file system depending on the uri.
function load_static_file(uri, response) {
	var filename = path.join(process.cwd(), uri);
	path.exists(filename, function(exists) {
		if(!exists) {
			response.writeHead(404, {
				"Content-Type" : "text/plain"
			});
			response.write("404 Not Found\n");
			response.end();
			return;
		}

		fs.readFile(filename, "binary", function(err, file) {
			if(err) {
				response.writeHead(500, {
					"Content-Type" : "text/plain"
				});
				response.write(err + "\n");
				response.end();
				return;
			}

			response.writeHead(200);
			response.write(file, "binary");
			response.end();
		});
	});
}

server.listen(process.env.C9_PORT);
