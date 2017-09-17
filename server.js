var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var d3 = require("d3");
var fs = require("fs");


app.use(bodyParser.
    urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use('/api', require('./require/api'));
app.listen(3000);

var initnamedb = function () {
    var strrs;
    var data = "";
    var readStream = fs.createReadStream('kimonocsv.csv', 'utf8');
    readStream.on('data', function (chunk) {
        data += chunk;                              
    }).on('end', function () {  
        data = d3.csvParse(data);
        strrs = data.map(function (d, i) {
            return d.text;
        });
        exports.sendstr = strrs;
    }).on('error', function () {
        console.log("error");
    });
};

exports.initnamedb = initnamedb;