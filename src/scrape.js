'use strict';
var _ = require('lodash'),
	http = require('http'),
	request = require("request"),
	nycStartupApi = 'http://data.cityofnewyork.us/resource/vdep-penk.json',
	jobTitles = [
		"product manager",
		"project manager",
		"product analyst",
		"product strategist",
		"business analyst",
		"business associate",
		"program manager"
	],
	jobResults = [];

request(nycStartupApi, function(err, res, body) {
	var startupData = JSON.parse(body),
		hiringStartups = _.filter(startupData, function (startup) {
			return startup.hiring;
		});

	_.each(hiringStartups, function (startup) {
		if (startup.jobs_url) {
			if (startup.jobs_url.url) {
				var jobUrl = startup.jobs_url.url;

				request(jobUrl, function (err, res, body) {
					if (res && res.statusCode === 200 && body) {
						var htmlStr = body.toLowerCase(),
							matches = [];

						_.each(jobTitles, function (jobTitle) {
							if (htmlStr.indexOf(jobTitle) > -1) {
								matches.push(jobTitle);
							}
						});

						if (matches.length > 0) {
							jobResults.push([{
								"company": startup.company_name,
								"job_titles": JSON.stringify(matches),
								"careers_url": jobUrl
							}]);
						}

						console.log(jobResults);
					}
				});
			}
		}
	});
});