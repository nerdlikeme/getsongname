var compact = require('underscore');
var song = "'Barry Manilow can't smile without";

var strarr = cnvr2arr(song);
for (var i = 0; i <= strarr.length; i++) {
    if (i + 1 < strarr.length) {
        var tmpstr = strarr[i] + " " + strarr[i + 1];
    } else {
        break;
    }
}

function cnvr2arr(tmp) {
    if (tmp == null)
        tmp = " ";
    var wrdarry = tmp.replace(/[^a-zA-Z0-9 ]/g, "").split(" ");
    wrdarry = compact.compact(wrdarry);
    return wrdarry;
}