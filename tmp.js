// var song_arr;
        // stopwords.forEach(function (a, j) {
        //     var stopwrd_arr = cnvr2arr(a);
        //     song_arr = cnvr2arr(song);
        //     song = frmstrng(song_arr, stopwrd_arr);
        // });
        // song_arr = cnvr2arr(song);


        // mtcharr.forEach(function (mtchstr) {
        //     mtchelem = cnvr2arr(mtchstr);
        //     mtchelem.forEach(function (elemstr) {
        //         var srchval = sofiaTree.getCompletions(elemstr);
        //         srchval.forEach(function (srchstr) {
        //             fndstr.push(srchstr);
        //         });
        //     });
        // });

        mtcharr.forEach(function (mtchstr,i) {
            mtchstr = mtchstr.trim();
            var srchval = sofiaTree.getCompletions(mtchstr);
            if (srchval.length > 0)
                fndstr.push(mtchstr);
                
        });

        // var d_arr;
        // for (var i = 0; i < song_arr.length; i++) {
        //     var srchval = sofiaTree.getCompletions((song_arr[i]));
        //     srchval.forEach(function (d) {
        //         fndstr.push(d);
        //     });
        // }

        // var retarr = [];
        // mtcharr.forEach(function (mtchstr) {
        //     fndstr.forEach(function (d) {
        //         d = d.toLowerCase().replace(/\&/g, "and");
        //         d_arr = cnvr2arr(d);
        //         //                mtchelem=cnvr2arr(mtchstr);
        //         var retval = JSON.parse(arrfunc(cnvr2arr(mtchstr), d_arr, d));

        //         if (retval.bool === true)
        //             retarr.push(retval.value);
        //     });
        // });
        // console.log(retarr);
        // for (k = 0; k < retarr.length; k++) {
        //     if (k === retarr.length - 1)
        //         break;
        //     if (retarr[k].length <= retarr[k + 1].length) {
        //         if (retarr[k + 1].indexOf(retarr[k]) > -1) {
        //             if (retarr[k + 1].indexOf("and") > -1)
        //                 retarr[k + 1] = "";
        //             else
        //                 retarr[k] = "";
        //         }
        //     }
        // };
        // retarr.forEach(function (c, t) {
        //     if (compact.contains(typsng, c))
        //         retarr[t] = "";
        // });
        // retarr = compact.compact(retarr);

        // console.log(retarr);

        // mtcharr = song.match(new RegExp('(.*)(?:\\s[-~]\\s)(.*)'));
        // if (mtcharr == null)
        //     mtcharr = song.match(new RegExp('(?:\")(.*)(?:\"\\sby\\s)(.*)'))

        // tmpstra = mtcharr[1];
        // var retarra = [];
        // retarr.forEach(function (c) {
        //     tmpstr = frmstrng(cnvr2arr(tmpstra), cnvr2arr(c));
        //     if (tmpstr.length < tmpstra.length)
        //         retarra.push(c);
        //     tmpstra = tmpstr;

        // });

        // tmpstrb = mtcharr[2];
        // var retarrb = [];
        // retarr.forEach(function (c) {
        //     tmpstr = frmstrng(cnvr2arr(tmpstrb), cnvr2arr(c))
        //     if (tmpstr.length < tmpstrb.length)
        //         retarrb.push(c);
        //     tmpstrb = tmpstr;
        // });