(function (window) {

    // window.downloadURL = function (dataurl, filename) {
    //     var link = document.createElement("a");
    //     link.download = filename;
    //     link.href = dataurl;
    //     document.body.appendChild(link);
    //     link.click();
    //     document.body.removeChild(link);
    //     delete link;
    // }

    // window.downloadURL = function (dataurl, filename) {
    //     var a = document.createElement("a");
    //     a.href = dataurl;
    //     a.setAttribute("download", filename);
    //     a.click();
    // }

    window.downloadURL = function (url, filename) {
        fetch(url).then(function(t) {
            return t.blob().then((b)=>{
                    var a = document.createElement("a");
                    a.href = URL.createObjectURL(b);
                    a.setAttribute("download", filename);
                    a.click();
                }
            );
        });
    }

    // window.downloadURL = function (dataurl, fileName, type="text/plain") {
    //     // Create an invisible A element
    //     var a = document.createElement("a");
    //     a.style.display = "none";
    //     document.body.appendChild(a);
    //
    //     // Set the HREF to a Blob representation of the data to be downloaded
    //     a.href = window.URL.createObjectURL(
    //         new Blob([dataurl], { type })
    //     );
    //
    //     // Use download attribute to set set desired file name
    //     a.setAttribute("download", fileName);
    //
    //     // Trigger the download by simulating click
    //     a.click();
    //     console.log(a.href)
    //     // Cleanup
    //     window.URL.revokeObjectURL(a.href);
    //     document.body.removeChild(a);
    // }

    window.getUTCDateString = function (date, separator) {
        var day = "" + (date.getUTCDate() > 9 ? date.getUTCDate() : "0" + date.getUTCDate()),
            month = "" + (date.getUTCMonth() > 8 ? date.getUTCMonth() + 1 : "0" + (date.getUTCMonth() + 1)),
            year = "" + (date.getUTCFullYear());
        if (date.getMonth == 0) month = '01';

        separator = separator || "";   //Make sure the separator is not null
        return year + separator + month + separator + day;
    };


    window.prevDayTrigger = function (elementId, currentDate) {
        var prevDayDate = new Date(currentDate);
        prevDayDate.setUTCSeconds(prevDayDate.getUTCSeconds() - 86400);

        if ((new Date("2010-04-16")).valueOf() > prevDayDate.valueOf()) return;

        $('#' + elementId).trigger('changeDate', [prevDayDate]);

        console.log("Changed " + elementId + ".value to " + document.getElementById(elementId).value);
        // currentDate = prevDayDate;
    };

    window.currDayTrigger = function (elementId) {

        var currDayDate = new Date();
        currDayDate.setDate(currDayDate.getDate() - 2);
        $('#' + elementId).trigger('changeDate', [currDayDate]);
        console.log("Changed " + elementId + ".value to " + document.getElementById(elementId).value);
        currentDate = currDayDate;
    };

    window.nextDayTrigger = function (elementId, currentDate) {
        var nextDayDate = new Date(currentDate);
        nextDayDate.setUTCSeconds(nextDayDate.getUTCSeconds() + 86400);

        if (nextDayDate.valueOf() > (new Date()).valueOf()) return;
        $('#' + elementId).trigger('changeDate', [nextDayDate]);

        console.log("Changed " + elementId + ".value to " + document.getElementById(elementId).value);
        // currentDate = nextDayDate;
    };

    window.todayTrigger = function (elementId, currentDate) {
        var todayDate = new Date();
        $('#' + elementId).trigger('changeDate', [todayDate]);
        console.log("Changed " + elementId + ".value to " + document.getElementById(elementId).value);
        // currentDate = todayDate;
    };

    window.updateDownloadButtons = function () {
        //Update the download buttons
        //Low Resolution download buttons
        $('button.dl-img-btn-LoRes').off("click").click(function () {
            // var channelValue = $(this).parent().parent().parent().find(".channel-select").attr('chosen');
            var url = $(this).parent().parent().parent().find('img')[0].src.replace(/\/t/, "/l");
            // if (channelValue.startsWith('_eovsa_bd')) {
            //     var url = $(this).parent().parent().parent().find('img')[0].src.replace(/\/t/, "/l");
            // } else {
            //     var url = getHelioviewerURL(1024, channelValue, globalDate);
            // }
            // ;
            console.log("Opening url " + url);
            window.open(url);
        });

        //High Resolution download buttons
        $('button.dl-img-btn-HiRes').off("click").click(function () {
            // var channelValue = $(this).parent().parent().parent().find(".channel-select").attr('chosen');
            var url = $(this).parent().parent().parent().find('img')[0].src.replace(/\/t/, "/f");
            // if (channelValue.startsWith('_eovsa_bd')) {
            //     var url = $(this).parent().parent().parent().find('img')[0].src.replace(/\/t/, "/f");
            // } else {
            //     var url = getHelioviewerURL(4096, channelValue, globalDate);
            // }
            // ;
            console.log("Opening url " + url);
            window.open(url);
        });

        //FITS file download buttons
        $('button.dl-img-btn-fits').off("click").click(function () {
            if ($(this).attr('id') =='eovsaDySpecFits') {
                var channelValue = $(this).parent().parent().parent().find(".dspec-select").attr('chosen');
            } else {
                var channelValue = $(this).parent().parent().parent().find(".channel-select").attr('chosen');
            }
            if (channelValue.startsWith('_eovsa_bd')) {
                var url = getEovsaImgURL(globalDate, "", channelValue, "fits");
                console.log("Opening url " + url);
                // window.open(url);
                window.downloadURL(url, url.substring(url.lastIndexOf('/') + 1));
            } else if (['XP', 'TP'].indexOf(channelValue) >= 0) {
                var url = getEovsaImgURL(globalDate, "", channelValue, "fits");
                console.log("Opening url " + url);
                // window.open(url);
                window.downloadURL(url, url.substring(url.lastIndexOf('/') + 1));
            }
            else {
                alert("FITS file not available for this channel.");
            }
        });

    };

    /**
     * Function that is usually incurred by the next/previous date buttons. Causes
     * the calendar's displayed date to change to match the new globalDate.
     */
    window.updateCalendar = function () {
        document.getElementById("datepicker").value = "   Calendar";
    };


    window.updateFits = function (date) {
        console.log("updateFits");
        document.getElementById("4500-fits").href = "http://suntoday.lmsal.com/sdomedia/SunInTime/" + getUTCDateString(date, "/") + "/f4500.fits";
        document.getElementById("1700-fits").href = "http://suntoday.lmsal.com/sdomedia/SunInTime/" + getUTCDateString(date, "/") + "/f1700.fits";
        document.getElementById("1600-fits").href = "http://suntoday.lmsal.com/sdomedia/SunInTime/" + getUTCDateString(date, "/") + "/f1600.fits";
        document.getElementById("335-fits").href = "http://suntoday.lmsal.com/sdomedia/SunInTime/" + getUTCDateString(date, "/") + "/f0335.fits";
        document.getElementById("304-fits").href = "http://suntoday.lmsal.com/sdomedia/SunInTime/" + getUTCDateString(date, "/") + "/f0304.fits";
        document.getElementById("211-fits").href = "http://suntoday.lmsal.com/sdomedia/SunInTime/" + getUTCDateString(date, "/") + "/f0211.fits";
        document.getElementById("193-fits").href = "http://suntoday.lmsal.com/sdomedia/SunInTime/" + getUTCDateString(date, "/") + "/f0193.fits";
        document.getElementById("171-fits").href = "http://suntoday.lmsal.com/sdomedia/SunInTime/" + getUTCDateString(date, "/") + "/f0171.fits";
        document.getElementById("131-fits").href = "http://suntoday.lmsal.com/sdomedia/SunInTime/" + getUTCDateString(date, "/") + "/f0131.fits";
        document.getElementById("94-fits").href = "http://suntoday.lmsal.com/sdomedia/SunInTime/" + getUTCDateString(date, "/") + "/f0094.fits";
        document.getElementById("blos-fits").href = "http://suntoday.lmsal.com/sdomedia/SunInTime/" + getUTCDateString(date, "/") + "/fblos.fits";

        // check to see whether planning FITS file links should be displayed
        var firstFitsDate = new Date();
        firstFitsDate.setUTCSeconds(firstFitsDate.getUTCSeconds() - 864000);
        if ((date > firstFitsDate) && (checkUrl("http://suntoday.lmsal.com/sdomedia/SunInTime/" + getUTCDateString(date, "/") + "/f0171.fits"))) {
            console.log("Found the link for " + date);
            $('#fits-links').show();
        } else {
            $('#fits-links').hide();
        }

    };

    window.updateDailyMovies = function (date) {
        console.log("updateDailyMovies");
        document.getElementById("304-211-171-movie").href = "http://suntoday.lmsal.com/sdomedia/SunInTime/" + getUTCDateString(date, "/") + "/daily_" + getUTCDateString(date, "") + "_304-211-171.mov";
        document.getElementById("94-335-193-movie").href = "http://suntoday.lmsal.com/sdomedia/SunInTime/" + getUTCDateString(date, "/") + "/daily_" + getUTCDateString(date, "") + "_94-335-193.mov";
        document.getElementById("211-193-171-movie").href = "http://suntoday.lmsal.com/sdomedia/SunInTime/" + getUTCDateString(date, "/") + "/daily_" + getUTCDateString(date, "") + "_211-193-171.mov";
        document.getElementById("171-movie").href = "http://suntoday.lmsal.com/sdomedia/SunInTime/" + getUTCDateString(date, "/") + "/daily_" + getUTCDateString(date, "") + "_171.mov";

        if (!checkUrl("http://suntoday.lmsal.com/sdomedia/SunInTime/" + getUTCDateString(date, "/") + "/daily_" + getUTCDateString(date, "") + "_304-211-171.mov")) {
            $('#daily-movies-links').hide();
            $('#daily-movies-not-available').show();
        } else {
            $('#daily-movies-links').show();
            $('#daily-movies-not-available').hide();
        }
    };

    window.update304171Movies = function (date) {
        document.getElementById("304-171-0-6UT").href = "http://suntoday.lmsal.com/sdomedia/SunInTime/" + getUTCDateString(date, "/") + "/AIA-304-171-" + getUTCDateString(date, "-") + "T0000.mov.mp4";
        document.getElementById("304-171-6-12UT").href = "http://suntoday.lmsal.com/sdomedia/SunInTime/" + getUTCDateString(date, "/") + "/AIA-304-171-" + getUTCDateString(date, "-") + "T0600.mov.mp4";
        document.getElementById("304-171-12-18UT").href = "http://suntoday.lmsal.com/sdomedia/SunInTime/" + getUTCDateString(date, "/") + "/AIA-304-171-" + getUTCDateString(date, "-") + "T1200.mov.mp4";
        document.getElementById("304-171-18-24UT").href = "http://suntoday.lmsal.com/sdomedia/SunInTime/" + getUTCDateString(date, "/") + "/AIA-304-171-" + getUTCDateString(date, "-") + "T1800.mov.mp4";

        if (!checkUrl("http://suntoday.lmsal.com/sdomedia/SunInTime/" + getUTCDateString(date, "/") + "/AIA-304-171-" + getUTCDateString(date, "-") + "T0000.mov.mp4")) {
            // 	console.log("True");
            // }
            // else{
            // 	console.log("False");
            // }
            $('#304-171-movies-links').hide();
            $('#304-171-movies-not-available').show();
        } else {
            $('#304-171-movies-links').show();
            $('#304-171-movies-not-available').hide();
        }
    };

    window.update211193171Movies = function (date) {
        document.getElementById("211-193-171-0-6UT").href = "http://suntoday.lmsal.com/sdomedia/SunInTime/" + getUTCDateString(date, "/") + "/AIAtricolor-211-193-171-" + getUTCDateString(date, "-") + "T0000.mov.mp4";
        document.getElementById("211-193-171-6-12UT").href = "http://suntoday.lmsal.com/sdomedia/SunInTime/" + getUTCDateString(date, "/") + "/AIAtricolor-211-193-171-" + getUTCDateString(date, "-") + "T0600.mov.mp4";
        document.getElementById("211-193-171-12-18UT").href = "http://suntoday.lmsal.com/sdomedia/SunInTime/" + getUTCDateString(date, "/") + "/AIAtricolor-211-193-171-" + getUTCDateString(date, "-") + "T1200.mov.mp4";
        document.getElementById("211-193-171-18-24UT").href = "http://suntoday.lmsal.com/sdomedia/SunInTime/" + getUTCDateString(date, "/") + "/AIAtricolor-211-193-171-" + getUTCDateString(date, "-") + "T1800.mov.mp4";

        if (!checkUrl("http://suntoday.lmsal.com/sdomedia/SunInTime/" + getUTCDateString(date, "/") + "/AIAtricolor-211-193-171-" + getUTCDateString(date, "-") + "T0000.mov.mp4")) {
            $('#211-193-171-movies-links').hide();
            $('#211-193-171-movies-not-available').show();
        } else {
            $('#211-193-171-movies-links').show();
            $('#211-193-171-movies-not-available').hide();
        }
    };


    window.update211193171rrMovies = function (date) {
        document.getElementById("211-193-171-rr-0-6UT").href = "http://suntoday.lmsal.com/sdomedia/SunInTime/" + getUTCDateString(date, "/") + "/AIAtriratio-211-193-171-" + getUTCDateString(date, "-") + "T0000.mov.mp4";
        document.getElementById("211-193-171-rr-6-12UT").href = "http://suntoday.lmsal.com/sdomedia/SunInTime/" + getUTCDateString(date, "/") + "/AIAtriratio-211-193-171-" + getUTCDateString(date, "-") + "T0600.mov.mp4";
        document.getElementById("211-193-171-rr-12-18UT").href = "http://suntoday.lmsal.com/sdomedia/SunInTime/" + getUTCDateString(date, "/") + "/AIAtriratio-211-193-171-" + getUTCDateString(date, "-") + "T1200.mov.mp4";
        document.getElementById("211-193-171-rr-18-24UT").href = "http://suntoday.lmsal.com/sdomedia/SunInTime/" + getUTCDateString(date, "/") + "/AIAtriratio-211-193-171-" + getUTCDateString(date, "-") + "T1800.mov.mp4";

        if (!checkUrl("http://suntoday.lmsal.com/sdomedia/SunInTime/" + getUTCDateString(date, "/") + "/AIAtriratio-211-193-171-" + getUTCDateString(date, "-") + "T0000.mov.mp4")) {
            $('#211-193-171-rrmovies-links').hide();
            $('#211-193-171-rrmovies-not-available').show();
        } else {
            $('#211-193-171-rrmovies-links').show();
            $('#211-193-171-rrmovies-not-available').hide();
        }
    };

    window.updateAIASecchi = function (date) {
        document.getElementById("aia-secchi-ab-304-movie").href = "http://suntoday.lmsal.com/sdomedia/SunInTime/" + getUTCDateString(date, "/") + "/aia_stereo/aia_stereo_304_" + getUTCDateString(globalDate, "") + "_120s_720p.mp4";
        document.getElementById("aia-secchi-ab-193-movie").href = "http://suntoday.lmsal.com/sdomedia/SunInTime/" + getUTCDateString(date, "/") + "/aia_stereo/aia_stereo_193_" + getUTCDateString(globalDate, "") + "_120s_720p.mp4";
        document.getElementById("aia-secchi-ab-211-movie").href = "http://suntoday.lmsal.com/sdomedia/SunInTime/" + getUTCDateString(date, "/") + "/aia_stereo/aia_stereo_211_" + getUTCDateString(globalDate, "") + "_120s_720p.mp4";
        document.getElementById("aia-secchi-ab-171-movie").href = "http://suntoday.lmsal.com/sdomedia/SunInTime/" + getUTCDateString(date, "/") + "/aia_stereo/aia_stereo_171_" + getUTCDateString(globalDate, "") + "_120s_720p.mp4";

        if (!checkUrl("http://suntoday.lmsal.com/sdomedia/SunInTime/" + getUTCDateString(globalDate, "/") + "/aia_stereo/aia_stereo_193_" + getUTCDateString(globalDate, "") + "_120s_720p.mp4")) {
            $('#aia-secchi-ab-links').hide();
            $('#aia-secchi-ab-not-available').show();
        } else {
            $('#aia-secchi-ab-links').show();
            $('#aia-secchi-ab-not-available').hide();
        }
    };

    window.updateAIADEM = function (date) {
        document.getElementById("aia-dem-image-links").href = "http://suntoday.lmsal.com/sdomedia/SunInTime/" + getUTCDateString(date, "/") + "/AIA_DEM_" + getUTCDateString(globalDate, "-") + ".png";
        document.getElementById("aia-dem-movie-links").href = "http://suntoday.lmsal.com/sdomedia/SunInTime/" + getUTCDateString(date, "/") + "/AIA_DEM_" + getUTCDateString(globalDate, "-") + ".mp4";
        document.getElementById("aia-dem-cube-links").href = "http://suntoday.lmsal.com/sdomedia/SunInTime/" + getUTCDateString(date, "/") + "/AIA_DEM_" + getUTCDateString(globalDate, "-") + ".genx";

        if (!checkUrl("http://suntoday.lmsal.com/sdomedia/SunInTime/" + getUTCDateString(globalDate, "/") + "/AIA_DEM_" + getUTCDateString(globalDate, "-") + ".png")) {
            $('#aia-dem-image-OK').hide();
        } else {
            $('#aia-dem-image-OK').show();
        }

        if (!checkUrl("http://suntoday.lmsal.com/sdomedia/SunInTime/" + getUTCDateString(globalDate, "/") + "/AIA_DEM_" + getUTCDateString(globalDate, "-") + ".mp4")) {
            $('#aia-dem-movie-OK').hide();
        } else {
            $('#aia-dem-movie-OK').show();
        }

        if (!checkUrl("http://suntoday.lmsal.com/sdomedia/SunInTime/" + getUTCDateString(globalDate, "/") + "/AIA_DEM_" + getUTCDateString(globalDate, "-") + ".genx")) {
            $('#aia-dem-cube-OK').hide();
        } else {
            $('#aia-dem-cube-OK').show();
        }

    };
})(window);
