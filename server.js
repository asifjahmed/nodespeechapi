
var https = require('https'),
	fs = require('fs'),
	io = require('socket.io');

var credentials = {
	key: fs.readFileSync('./ssl/server.key'),
	cert: fs.readFileSync('./ssl/server.crt'),
	ca: fs.readFileSync('./ssl/ca.crt'),
	requestCert: true,
	rejectUnauthorized: false
};

var currentSpeech = {};
var speechBuffer = [];

var httpsServer = https.createServer(credentials, function(req, res) {
	res.writeHead(200);
	res.end(fs.readFileSync(__dirname + '/speech.html'));
}).listen(8000);

io = io(httpsServer);

function getwordsafterword(splittext, keyword) {
	var findkeyword = splittext.indexOf(keyword);
	if(findkeyword >= 0) {
		return splittext.substring(splittext.indexOf(keyword)+(keyword).length+1);
	} else {
		return '[error]';
	}
}

function getwordsbeforeword(splittext, keyword) {
	var findkeyword = splittext.indexOf(keyword);
	if(findkeyword >= 0) {
		return splittext.substring(0,splittext.indexOf(keyword)).trim();
	} else {
		return '[error]';
	}
}

function processSpeech(speechdata) {
	console.log("data: ", speechdata);
	currentSpeech.confidence = speechdata.confidence; //parseFloat(speechdata[0][0].confidence).toFixed(3);
	currentSpeech.transcript = speechdata.transcript; //speechdata[0][0].transcript;
	currentSpeech.isFinal = speechdata.isFinal; //speechdata[0].isFinal;
	currentSpeech.time = Date.now();

	if(currentSpeech.transcript.indexOf('\n\n') >= 0) {
		console.log('new paragraph!');
		if(currentSpeech.transcript === '\n\n') {
			currentSpeech.transcript = '<br/><br/>';
		} else {
			currentSpeech.transcript = currentSpeech.transcript.replace('\n\n', '<br/><br/>');
		}
	} else if(currentSpeech.transcript.indexOf('\n') >= 0) {
		console.log('new line!');
		if(currentSpeech.transcript === '\n') {
			currentSpeech.transcript = '<br/>';
		} else {
			currentSpeech.transcript = currentSpeech.transcript.replace('\n', '<br/>');
		}
	}

	if(currentSpeech.isFinal) {

		if(currentSpeech.transcript.indexOf('undo') > -1) {
			speechBuffer.splice(speechBuffer.length-1);
		} else if(currentSpeech.transcript.indexOf('clear') > -1 && currentSpeech.transcript.split(' ').length < 3) {
			speechBuffer = [];
		} else if(currentSpeech.transcript.indexOf('change') > -1 && currentSpeech.transcript.indexOf('to') > -1 && currentSpeech.transcript.split(' ').length > 3) {
			console.log(speechBuffer[speechBuffer.length-1].transcript.replace(getwordsbeforeword(getwordsafterword(currentSpeech.transcript, 'change'), 'to'), getwordsafterword(currentSpeech.transcript, 'to')));
			speechBuffer[speechBuffer.length-1].transcript = speechBuffer[speechBuffer.length-1].transcript.replace(getwordsbeforeword(getwordsafterword(currentSpeech.transcript, 'change'), 'to'), getwordsafterword(currentSpeech.transcript, 'to'));
		} else if(currentSpeech.transcript.indexOf('replace') > -1 && currentSpeech.transcript.indexOf('with') > -1 && currentSpeech.transcript.split(' ').length > 3) {
			console.log(speechBuffer[speechBuffer.length-1].transcript.replace(getwordsbeforeword(getwordsafterword(currentSpeech.transcript, 'replace'), 'with'), getwordsafterword(currentSpeech.transcript, 'with')));
			speechBuffer[speechBuffer.length-1].transcript = speechBuffer[speechBuffer.length-1].transcript.replace(getwordsbeforeword(getwordsafterword(currentSpeech.transcript, 'replace'), 'with'), getwordsafterword(currentSpeech.transcript, 'with'));
		} else {
			speechBuffer.push(currentSpeech);
		}


		io.emit('finalspeech', speechBuffer);
		io.emit('confidence', currentSpeech.confidence);
		currentSpeech = {};

		console.log('-----');
		console.log(speechBuffer);
		console.log('-----');
	} else {
		io.emit('unfinalspeech', currentSpeech);
		console.log(currentSpeech.transcript);
	}

}

io.on('connection', function(socket) {
	console.log('socket.io connected');
	io.emit('finalspeech', speechBuffer);

	socket.on('speech', function(data) {
		//console.log(data);
		processSpeech(data);
	});
});
