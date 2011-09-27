var sys = require("sys");

function timeConsumingNonBlocking(outputFunc) {
	outputFunc("timeConsumingNonBlocking --->");
	setTimeout(function() {outputFunc("timeConsumingNonBlocking: result");
	}, 5000);
	outputFunc("timeConsumingNonBlocking <---");
}

// not really non blocking, but with callback and really fast;-)
function fastNonBlocking(outputFunc) {
	outputFunc("fastNonBlocking -->");
	outputFunc("fastNonBlocking: result");
	outputFunc("fastNonBlocking <---");
}

sys.puts("Start");
timeConsumingNonBlocking(function(message) {
	sys.puts(message);
});
fastNonBlocking(function(message) {
	sys.puts(message);
});
