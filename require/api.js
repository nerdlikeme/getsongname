var express = require('express');
var router = express.Router();
var compact = require('underscore');
var SofiaTree = require('sofia-tree');
//var lev = require('fast-levenshtein');
//var natural = require('natural');
//var metaphone = natural.Metaphone;
var stopwords = ['year', 'live in', 'hq', 'hq version', 'hq video', 'best quality', 'hd colour', 'hd', 'original', 'full cd', 'with lyrics', 'w/ lyrics', 'in stereo', 'hq stereo', 'stereo', 'original version', 'original soundtrack', 'original', 'album version', 'lyrics', 'high quality audio', 'high quality', 'ost', 'promo version', 'promo', 'new stereo remix', 'new stereo', 'great audio quality ', 'great music video', 'audio quality', 'music video', 'official song', 'music quality', 'from mtv', 'lp version', 'official videoclip', 'original videoclip', 'official video', 'original video', 'rare video', 'rare version', 'version', 'itunes']
var typsng = ['ain\'t', 'alone', 'angel', 'arms', 'around', 'away', 'baby', 'bad', 'beautiful', 'believe', 'blue', 'boy', 'change', 'christmas', 'comes', 'crazy', 'cry', 'dance', 'days', 'dear', 'dream', 'ever', 'everybody', 'everything', 'eyes', 'fall', 'feel', 'fire', 'fool', 'forever', 'girl', 'gone', 'gonna', 'goodbye', 'happy', 'heart', 'heaven', 'hey', 'hold', 'kiss', 'la', 'lady', 'leave', 'life', 'light', 'lonely', 'love', 'lover', 'mama', 'man', 'mind', 'mine', 'miss', 'moon', 'moonlight', 'morning', 'mr', 'music', 'night', 'nobody', 'oh', 'people', 'play', 'please', 'rain', 'red', 'remember', 'river', 'rock', 'roll', 'rose', 'sing', 'smile', 'somebody', 'something', 'song', 'soul', 'star', 'stay', 'stop', 'street', 'summer', 'sun', 'sweet', 'sweetheart', 'talk', 'tears', 'theme', 'things', 'think', 'tonight', 'town', 'true', 'walk', 'wanna', 'wish', 'woman', 'wonderful', 'world', 'young']
//var song = "'Barry Manilow can't smile without you";
//var song = "Lovely Sunny Day - Demis Roussos";
//var song = "Ronettes - Be My Baby - (Remastered Video & Stereo Music - 1965) - Bubblerock - HD"
//var song = "-NEW- Hey Paula Paul & Paula HQ {Stereo}"
//var song = '"Never Gonna Fall in Love Again" by Eric Carmen (iTunes)';
//var song='"I Live My Life For You" - FireHouse (iTunes)';
//var song = '•°*"˜..BILL PURSELL - OUR WINTER LOVE..˜"*°•';
router.get('/qrytitle', function (req, res) {
    var m = require('../server').initnamedb();
    setTimeout(function () {
        var sendstr = require('../server').sendstr
        var sofiaTree = new SofiaTree({
            useCache: true,
            caseSensitive: false
        });
        sendstr.forEach(function (i) {
            sofiaTree.insert(i);
        });
        var fndstr = [];
        var fndlen = 0;
        var fndher = "";
        var song = req.query.title;
        song = song.toLowerCase().replace(/\&/g, "and").replace(/\" by/g, " \-").replace(/\"/g, "");

        mtcharr = song.match(new RegExp(/[\w\'\!\s]+(?:[- ]\w+)*/g));

        mtcharr.forEach(function (mtchstr, i) {
            stopwords.forEach(function (stopstr) {
                if (~mtchstr.indexOf(stopwords)) {
                    mtcharr[i] = "";
                }
            });
        });

        compact.compact(mtcharr);
        var retsngr = [];
        var retsong = "";

        if (mtcharr.length > 1) {
            for (k = 0; k < mtcharr.length; k++) {
                var sngrarr = mtcharr[k].trim().match(/(.*)and(.*)/);
                var fndflg = false;
                if (sngrarr !== null) {
                    sngrarr.forEach(function (sngrstr) {
                        sngrstr = sngrstr.trim();
                        fndrslt = sofiaTree.getCompletions(sngrstr);
                        if (fndrslt.length > 0) {
                            retsngr.push(fndrslt[0]);
                            if (k === 0 && retsong == "") {
                                retsong = mtcharr[1].trim();
                            } else if (k === 1 && retsong == "") {
                                retsong = mtcharr[0].trim();
                            }
                            k = mtcharr.length;
                        }
                    });

                } else {
                    fndrslt = sofiaTree.getCompletions(mtcharr[k].trim());
                    if (fndrslt.length > 0) {
                        retsngr.push(fndrslt[0]);
                        if (k === 0)
                            retsong = mtcharr[1].trim();
                        else if (k === 1)
                            retsong = mtcharr[0].trim();
                        k = mtcharr.length;
                    }
                }
            }

            res.send('{"song":"' + retsong + '","singer":' + JSON.stringify(retsngr) + '}');
        } else
            res.send('{"song":"","singer":""}');
    }, 3000)

});

module.exports = router;

function cnvr2arr(tmp) {
    if (tmp == null)
        tmp = " ";
    // else
    //     tmp = tmp.toLowerCase().replace(/[-]/, " ").replace(/[^a-zA-Z0-9' ]/g, "");
    var wrdarry = tmp.split(" ");
    var tmp = wrdarry;
    // tmp.forEach(function(k,i) {
    //     var t=k.match(new RegExp('(\")(.*)'));
    //     if (t!==null){
    //         t.forEach(function(m,j) {
    //             if ((m!=='"') && (j==0)) {
    //                 wrdarry[i]=m;
    //                 wrdarry.splice(i+1,0,'"');
    //             }
    //             else if ((m!=='"') && (j==1)){
    //                 wrdarry.splice(i+1,0,'"');
    //                 wrdarry
    //             }

    //             });                               
    //     };    
    // });

    wrdarry = compact.compact(wrdarry);

    return wrdarry;
}

findLongestCommonSubstring_Quick = function (a, b) {
    var longest = "";
    // loop through the first string
    for (var i = 0; i < a.length; ++i) {
        // loop through the second string
        for (var j = 0; j < b.length; ++j) {
            // if it's the same letter
            if (a[i] === b[j]) {
                var str = a[i];
                var k = 1;
                // keep going until the letters no longer match, or we reach end
                while (i + k < a.length && j + k < b.length // haven't reached end
                    &&
                    a[i + k] === b[j + k]) { // same letter
                    str = str + a[i + k];
                    ++k;
                }
                // if this substring is longer than the longest, save it as the longest
                if (str.length > longest.length) {
                    longest = str
                }
            }
        }
    }
    return longest;
}

function frmstrng(srcharr, cmprarr) {
    var str = "";
    var fndflg = false;
    var j = 0;
    var m = 0;
    for (var i = 0; i < srcharr.length; i++) {
        if (fndflg === true) {
            if (m >= cmprarr.length) {
                fndflg = false;
                j = 0;
            } else
                j = m;
        } else
            j = 0;
        while (j < cmprarr.length) {

            if (fndflg === true) {
                if (srcharr[i] !== cmprarr[j]) {
                    var k = i - 1;
                    while (k < (i + j)) {
                        str = str + " " + srcharr[k];
                        k = k + 1;
                    }
                    j = cmprarr.length;
                    fndflg = false;
                }
            } else {
                if (srcharr[i] !== cmprarr[j]) {
                    str = str + " " + srcharr[i];
                    j = cmprarr.length;
                }
            }
            if (srcharr[i] === cmprarr[j]) {
                m = j + 1;
                j = cmprarr.length;
                fndflg = true;
            }
        }
    }
    return str.trim();
}

function arrfunc(srcharr, cmprarr, fndval) {
    for (var j = 0; j < srcharr.length; j++) {
        var strs = ""

        if (j + (cmprarr.length - 1) < srcharr.length) {
            k = j + cmprarr.length;
            l = j;
            while (l < k) {
                strs += srcharr[l] + " ";
                l++;
            }

            // if (metaphone.compare(strs, cmprarr.join(" "))) {                
            //     return true;
            // }

            //var a = strs.replace(/\s+/g, ' ').trim();
            var a = strs.trim();
            var b = cmprarr.join(" ").trim();

            if (a === b) {
                return '{"bool":true,"value":"' + a + '"}';
            }
        }
    }
    return '{"bool":false,"value":""}';
}