var express = require('express');
var app = express()

var router = express.Router();

var https = require('https');

class Game {
	constructor(win, duration, spells, champion, kda, items, level, cs, cspm) {
		this.win = win;
		this.duration = duration;
		this.spells = spells;
		this.champion = champion;
		this.kda = kda;
		this.items = items;
		this.level = level;
		this.cs = cs;
		this.cspm = cspm;
	}

}


router.get('/summoner/info', function(req, res, next) {
	console.log('GETTING ACCOUNT ID FOR' + req.query.summonername);
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

		console.log('RETURNING' + JSON.parse(body).accountId);


		res.json(JSON.parse(body).accountId)
	// ...and/or process the entire body here.
	})
	});

		req.on('error', function(e) {
			console.log('ERROR: ' + e.message);
		});


	})

router.get('/summoner/matchlist', function(req, res, next) {

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

		var jsonarray = JSON.parse(body).matches;
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


router.get('/summoner/match', function(req, res, next) {
	console.log('GETTING MATCH');

	var accountid = req.query.accountid;
	console.log(accountid);
	console.log(req.query.matchid);

	var options = {
		host: 'na1.api.riotgames.com',
		path: '/lol/match/v3/matches/' + req.query.matchid,
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
		//console.log('BODY: ' + body);
		var participantid;
		var participants = JSON.parse(body).participantIdentities;

		//console.log(participants);


		for (var i = 0; i < participants.length; i++) {
			if (participants[i].player.accountId ==	 accountid) {
				participantid = participants[i].participantId;
				break;
			}
		}

		console.log(participantid);

		var partarray = JSON.parse(body).participants;
		var game;

		for (var i = 0; i < partarray.length; i++) {
			if (partarray[i].participantId == participantid) {
				var a = partarray[i]; // to shorten
				var s = a.stats; // also to shorten
				game = new Game(s.win, 
								JSON.parse(body).gameDuration, 
								[a.spell1Id, a.spell2Id], 
								a.championId, 
								(s.kills+s.assists)/s.deaths,
								[s.item0, s.item1, s.item2, s.item3, s.item4, s.item5, s.item6],
								s.champLevel, 
								s.totalMinionsKilled,
								s.totalMinionsKilled/(JSON.parse(body).gameDuration/60)
								)
				console.log(s.win);
				console.log(s.champLevel);
				console.log(s.totalMinionsKilled);
				break;
			}
		}

		console.log(game);
		res.json(game);
	// ...and/or process the entire body here.
	})
	});

		req.on('error', function(e) {
			console.log('ERROR: ' + e.message);
		});


	})



router.get('/message', function(req, res, next) {
	console.log('INITIAL MESSAGE')
	res.json('Welcome To React')
})




module.exports = router;
