var express = require('express');
var router = express.Router();
var compact = require('underscore');
var SofiaTree = require('sofia-tree');
var fuzzy = require('fuzzy');
var stopwords = ['year', 'live in', 'hq', 'hq version', 'hq video', 'best quality', 'hd colour', 'hd', 'original', 'full cd', 'with lyrics', 'w/ lyrics', 'in stereo', 'hq stereo', 'stereo', 'original version', 'original soundtrack', 'original', 'album version', 'lyrics', 'high quality audio', 'high quality', 'ost', 'promo version', 'promo', 'new stereo remix', 'new stereo', 'great audio quality ', 'great music video', 'audio quality', 'music video', 'official song', 'music quality', 'from mtv', 'lp version', 'official videoclip', 'original videoclip', 'official video', 'original video', 'rare video', 'rare version', 'version', 'itunes']
var typsng = ['ain\'t', 'alone', 'angel', 'arms', 'around', 'away', 'baby', 'bad', 'beautiful', 'believe', 'blue', 'boy', 'change', 'christmas', 'comes', 'crazy', 'cry', 'dance', 'days', 'dear', 'dream', 'ever', 'everybody', 'everything', 'eyes', 'fall', 'feel', 'fire', 'fool', 'forever', 'girl', 'gone', 'gonna', 'goodbye', 'happy', 'heart', 'heaven', 'hey', 'hold', 'kiss', 'la', 'lady', 'leave', 'life', 'light', 'lonely', 'love', 'lover', 'mama', 'man', 'mind', 'mine', 'miss', 'moon', 'moonlight', 'morning', 'mr', 'music', 'night', 'nobody', 'oh', 'people', 'play', 'please', 'rain', 'red', 'remember', 'river', 'rock', 'roll', 'rose', 'sing', 'smile', 'somebody', 'something', 'song', 'soul', 'star', 'stay', 'stop', 'street', 'summer', 'sun', 'sweet', 'sweetheart', 'talk', 'tears', 'theme', 'things', 'think', 'tonight', 'town', 'true', 'walk', 'wanna', 'wish', 'woman', 'wonderful', 'world', 'young']

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

        //mtcharr = song.match(new RegExp(/[\w\'\!\s]+(?:[- ]\w+)*/g));
        mtcharr = song.split(/-|~/g);


        var dd = compact.difference(cnvr2arr(song), stopwords);

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

        if (mtcharr.length < 2) {
            song = retsng(song, stopwords);
            var sngarr = cnvr2arr(song);
            sngarr.forEach(function (m) {
                fndslt = sofiaTree.getCompletions(m);
                if (fndslt.length > 0) {
                    var fndslt = fndslt.map(function (v) {
                        return v.replace(/ & /g, ' and ');
                    });
                    var a = findLongestCommonSubstring_Quick(song, fndslt.join(" "));
                    var retval = fndslt.indexOf(a.trim())
                    if (retval != undefined && retval > -1) {
                        var snglst = a.trim().split(/,|and/g)
                        if (snglst > 0) {
                            sngrlst.forEach(function (sngrvar) {
                                retsngr.push(sngrvar);
                            });
                        } else
                            retsngr.push(a.trim());
                    }
                }
            });
            retsngr = compact.uniq(retsngr);
            res.send('{"song":"' + retsng(song, retsngr) + '","singer":' + JSON.stringify(retsngr) + '}');
        } else {
            for (k = 0; k < mtcharr.length; k++) {
                var sngarr = cnvr2arr(mtcharr[k]);
                sngarr.forEach(function (m, idx) {
                    fndslt = sofiaTree.getCompletions(m);
                    if (fndslt.length > 0) {
                        var fndslt = fndslt.map(function (v) {
                            return v.replace(/ & /g, ' and ');
                        });
                        var a = findLongestCommonSubstring_Quick(song, fndslt.join(" "));
                        var retval = fndslt.indexOf(a.trim())
                        if (retval != undefined && retval > -1) {
                            var snglst = a.trim().split(/,|and/g)
                            if (snglst.length > 0) {
                                snglst.forEach(function (sngrvar) {
                                    retsngr.push(sngrvar.trim());
                                });
                            } else
                                retsngr.push(a.trim());
                        }
                        if (retsngr.length > 0 && retsong === "") {
                            if (k === 0)
                                retsong = mtcharr[1].trim();
                            else if (k === 1)
                                retsong = mtcharr[0].trim();
                            k = mtcharr.length;
                        }
                    }
                });
            }
            retsngr = compact.uniq(retsngr);
            res.send('{"song":"' + retsong + '","singer":' + JSON.stringify(retsngr) + '}');
        }
    }, 3000)

});

module.exports = router;


function cnvr2arr(tmp) {
    if (tmp == null)
        tmp = " ";
    var wrdarry = tmp.split(" ");
    var tmp = wrdarry;

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


function retsng(song, cmprarr) {
    cmprarr.forEach(function (b) {
        var pattern = new RegExp(b, 'gi')
        if (song.match(pattern)) {
            song = song.replace(pattern, "")
        }
    });

    return song.trim();
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