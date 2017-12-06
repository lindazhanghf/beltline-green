// Filter out zipcode of 30312
var fs = require('fs');
var LineByLineReader = require('line-by-line'),
	lineReader = new LineByLineReader('../leaf_left_data/Zip_Zhvi_AllHomes.csv');
var writeStream = fs.createWriteStream('./data/Zillow_Atlanta_data.csv', { flags : 'w' });

var fields = undefined;

lineReader.on('error', function (err) {
	// 'err' contains error object
});

lineReader.on('line', function (line) {
	// 'line' contains the current line without the trailing newline character.
	if (!fields) {
		fields = line;
		writeStream.write(line + '\n');
	}
	if (line.indexOf('Atlanta') !== -1) {
		// console.log(line);
		writeStream.write(line + '\n');
	}
});

lineReader.on('end', function () {
	// All lines are read, file is closed now.
	writeStream.end();
	console.log("Finished reading the entire file!")
});
