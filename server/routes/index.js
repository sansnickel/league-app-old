var express = require('express');
var app = express()

var router = express.Router();

var https = require('https');

// class to hold information about a match for one player
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

// retrieves the accound id of a player based on summoner name
router.get('/summoner/info', function(req, res, next) {

	var options = {
		host: 'na1.api.riotgames.com',
		path: '/lol/summoner/v3/summoners/by-name/' + req.query.summonername,
		headers: {
			'X-Riot-Token': 'RGAPI-984cf7a5-d139-4be7-8eed-6b012ce26b11'
		}
	};

	var req = https.get(options, function(response) {
		console.log('STATUS: ' + response.statusCode);
		if (response.statusCode == 404 || response.statusCode == 403) return res.json(0);

		console.log('HEADERS: ' + JSON.stringify(response.headers));

	// Buffer the body entirely for processing as a whole.
	var bodyChunks = [];

	response.on('data', function(chunk) {

	bodyChunks.push(chunk);
	
	}).on('end', function() {

		var body = Buffer.concat(bodyChunks);
		res.json(JSON.parse(body).accountId)

	})
	});

		req.on('error', function(e) {
			console.log('ERROR: ' + e.message);
			res.json(0);
		});

	})

// retrieves a list of match ids based on account id
router.get('/summoner/matchlist', function(req, res, next) {

	var options = {
		host: 'na1.api.riotgames.com',
		path: '/lol/match/v3/matchlists/by-account/' + req.query.accountid + '?endIndex=19',
		headers: {
			'X-Riot-Token': 'RGAPI-984cf7a5-d139-4be7-8eed-6b012ce26b11'
		}
	};

	var req = https.get(options, function(response) {
		console.log('STATUS: ' + response.statusCode);
		if (response.statusCode == 404 || response.statusCode == 403) return res.json(0);

	var bodyChunks = [];
	
	response.on('data', function(chunk) {

	bodyChunks.push(chunk);

	}).on('end', function() {

		var body = Buffer.concat(bodyChunks);
		var jsonarray = JSON.parse(body).matches;
		var array = [];

		for (var i = 0; i < jsonarray.length; i++) {
			array[i] = jsonarray[i].gameId;		
		}
		res.send(array);

	})
	});

		req.on('error', function(e) {
			console.log('ERROR: ' + e.message);
			res.json(0);
		});

	})


router.get('/summoner/match', function(req, res, next) {

	var accountid = req.query.accountid;

	var options = {
		host: 'na1.api.riotgames.com',
		path: '/lol/match/v3/matches/' + req.query.matchid,
		headers: {
			'X-Riot-Token': 'RGAPI-984cf7a5-d139-4be7-8eed-6b012ce26b11'
		}
	};

	var req = https.get(options, function(response) {
		console.log('STATUS: ' + response.statusCode);
		if (response.statusCode == 404 || response.statusCode == 403) return res.json(0);


	var bodyChunks = [];
	
	response.on('data', function(chunk) {

	bodyChunks.push(chunk);

	}).on('end', function() {

		var body = Buffer.concat(bodyChunks);
		var participantid;
		var participants = JSON.parse(body).participantIdentities;

		for (var i = 0; i < participants.length; i++) {
			if (participants[i].player.accountId ==	 accountid) {
				participantid = participants[i].participantId;
				break;
			}
		}

		var partarray = JSON.parse(body).participants;
		var duration = JSON.parse(body).gameDuration;
		var game;
		var champimg = '';

		for (var i = 0; i < partarray.length; i++) {
			// the match info gives us info about everyone
			// we only need the information of the desired player right now

			if (partarray[i].participantId == participantid) {
				var a = partarray[i]; // to shorten
				var s = a.stats; // also to shorten
				
				var champid = a.championId;

				var options = {
					host: 'ddragon.leagueoflegends.com',
					path: '/cdn/8.14.1/data/en_US/champion.json',
				};

				var req = https.get(options, function(response) {
				console.log('STATUS: ' + response.statusCode);
				if (response.statusCode == 404 || response.statusCode == 403) return res.json(0);

				var bodyChunks = [];
				response.on('data', function(chunk) {

					bodyChunks.push(chunk);

				}).on('end', function() {
					
					var body = Buffer.concat(bodyChunks);
					var champs = JSON.parse(body);

					for (var champ in champs.data) {

						if (champs.data[champ].key == champid) {

							champimg = champs.data[champ].image.full;

						}
					}
					game = new Game(s.win, 
								Math.floor(duration/60).toString() + ':' + (duration % 60).toString(), 
								[a.spell1Id + '.png', a.spell2Id + '.png'], 
								champimg, 
								((s.kills+s.assists)/(s.deaths === 0 ? 1 : s.deaths)).toFixed(2),
								[s.item0, s.item1, s.item2, s.item3, s.item4, s.item5, s.item6],
								s.champLevel, 
								s.totalMinionsKilled,
								(s.totalMinionsKilled/(duration/60)).toFixed(2)
								)
					res.json(game);

				})
				});

					req.on('error', function(e) {
						res.json(0);
						console.log('ERROR: ' + e.message);

				});

			}
		}

	})
	});

		req.on('error', function(e) {
			console.log('ERROR: ' + e.message);
			res.json(0);
		});

	})


router.get('/message', function(req, res, next) {
	res.json('League of Legends Match History')
})


module.exports = router;
