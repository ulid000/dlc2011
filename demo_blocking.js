var sys = require("sys");


function timeConsumingBlocking() {
	sys.puts("timeConsumingBlocking --->");
	function sleep(millis) {
		var startTime = Date.now();
		while(Date.now() < startTime + millis) {
            ;   
		}
		return;
	}

	sleep(5000);
	return "timeConsumingBlocking: result";
}

function fastBlocking() {
	sys.puts("fastBlocking --->");
	return "fastBlocking: result";
}

sys.puts("Start");
sys.puts(timeConsumingBlocking());
sys.puts(fastBlocking());
