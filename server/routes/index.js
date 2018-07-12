var express = require('express');
var app = express()

var router = express.Router();

var https = require('https');

router.get('/summoner/info', function(req, res, next) {
	console.log(req.query.summonername)
	var options = {
		host: 'na1.api.riotgames.com',
		path: '/lol/summoner/v3/summoners/by-name/' + req.query.summonername,
		headers: {
			'X-Riot-Token': 'RGAPI-2b97885a-28c1-4cdf-bd28-82f4af937aff'
		}
	};

	var req = https.get(options, function(response) {
		console.log('STATUS: ' + response.statusCode);
		console.log('HEADERS: ' + JSON.stringify(response.headers));

	// Buffer the body entirely for processing as a whole.
	var bodyChunks = [];
	response.on('data', function(chunk) {
	// You can process streamed parts here...
	bodyChunks.push(chunk);
	}).on('end', function() {
		var body = Buffer.concat(bodyChunks);
		console.log('BODY: ' + body);
		console.log(JSON.parse(body).accountId);


		res.json(JSON.parse(body).accountId)
	// ...and/or process the entire body here.
	})
	});

		req.on('error', function(e) {
			console.log('ERROR: ' + e.message);
		});


	})

router.get('/summoner/matches', function(req, res, next) {

	var options = {
		host: 'na1.api.riotgames.com',
		path: '/lol/match/v3/matchlists/by-account/' + req.query.accountid + '?endIndex=9',
		headers: {
			'X-Riot-Token': 'RGAPI-2b97885a-28c1-4cdf-bd28-82f4af937aff'
		}
	};

	var req = https.get(options, function(response) {
		console.log('STATUS: ' + response.statusCode);
		console.log('HEADERS: ' + JSON.stringify(response.headers));

	// Buffer the body entirely for processing as a whole.
	var bodyChunks = [];
	response.on('data', function(chunk) {
	// You can process streamed parts here...
	bodyChunks.push(chunk);
	}).on('end', function() {
		var body = Buffer.concat(bodyChunks);
		console.log('BODY: ' + body);
		

		var jsonarray = JSON.parse(body).matches;
		console.log(jsonarray);
		
		var array = [];

		for (var i = 0; i < jsonarray.length; i++) {
			array[i] = jsonarray[i].gameId;

		
		}


		res.send(array);
	// ...and/or process the entire body here.
	})
	});

		req.on('error', function(e) {
			console.log('ERROR: ' + e.message);
		});


	})




router.get('/message', function(req, res, next) {
	console.log('hello')
	res.json('Welcome To React')
})




module.exports = router;
