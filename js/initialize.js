(function (window) {
    /** Function to get the URL parameters from the current browser location's URI. **/
    window.getParams = function () {
        var idx = window.document.URL.indexOf('?');  //Find the first occurence of '?', which implies the beginning of a parameters list.
        var tempParams = new Object();  //The structure where we will store the keys and values of the URL params.
        if (idx != -1) {  //If there is a question mark found, assemble the parameters object.
            var pairs = window.document.URL.substring(idx + 1, window.document.URL.length).split('&');
            for (var i = 0; i < pairs.length; i++) {
                nameVal = pairs[i].split('=');
                tempParams[nameVal[0]] = decodeURI(nameVal[1]); //Decode the URL (ex: "Andrew%20Duffy" -> "Andrew Duffy")
            }
        }
        //Return the parameters object.
        return tempParams;
    };

    window.START_DATE = "2010-04-16"; //The VERY first date that SDO data is available.

    window.IRIS_START = "2013-07-16"; //The first date of data from the IRIS missions

    window.globalDate = undefined;

    //Get the date from the URL if possible
    var date_parameter_str = "suntoday_date";
    if (window.getParams().hasOwnProperty(date_parameter_str)) {
        console.log("What I see: " + getParams()[date_parameter_str]);
        var d = getParams()[date_parameter_str].replace("/", "").replace(/-/g, "/");
        console.log("d = " + d);
        globalDate = new Date(d);
    }

    console.log("Global Date = " + globalDate);
    //If we received an invalid date string, or we try to reach back before the earliest date or ahead of the latest date.
    var d = new Date();
    d.setDate(d.getDate() - 2);
    if (!globalDate || globalDate.valueOf().toString() == "NaN" || globalDate.valueOf() < (new Date(START_DATE)).valueOf() || globalDate.valueOf() > (new Date()).valueOf()) globalDate = d;

    window.updateForDate = function (ev, newDate) {
        var date = newDate || ev.date;
        console.log(date);
        globalDate = new Date(date);

        //Make sure IRIS link shows when there is valid data
        window.checkIris(globalDate);

        //debugger;
        window.updateCalendar();    //Override bootstrap-datepicker's default behavior and display "Select Date" in the input box.

        $('#sun-today-date').text("Obs Date: " + getUTCDateString(globalDate, "-"));
        console.log("Date changed to " + globalDate);
        $('.channel-img').attr("src", "./img/loading.gif");
        loadThumbnailsForDate(globalDate);
        // loadEovsaSPForDate(globalDate);
        updateDownloadButtons();        //Update the 1K and 4K download buttons


        // //Update image and movie links
        // window.updateFits(globalDate);
        // window.updateAIASecchi(globalDate);
        // window.updateDailyMovies(globalDate);
        // window.update304171Movies(globalDate);
        // window.update211193171Movies(globalDate);
        // window.update211193171rrMovies(globalDate);
        // // window.updateAIADEM(globalDate);

        //Update the AIA Light Curves
        var lightCurves = window.document.getElementById('eovsaDySpec1minRes');
        if (lightCurves) {
            lightCurves.src = "http://ovsa.njit.edu/flaremon/daily/" + globalDate.getUTCFullYear() + "/XSP" + getUTCDateString(globalDate, "") + ".png";
        }

        var lightCurves2 = window.document.getElementById('eovsaDySpecFullRes');
        if (lightCurves2) {
            // lightCurves2.src = getEovsaImgURL(date, "TPSP", '', 'png');
            loadEovsaSPForDate(date);
        }


        // //Update the "When were these taken?" link
        // window.document.getElementById('when-were-these-taken-link').src = "http://suntoday.lmsal.com/sdomedia/SunInTime/" + getUTCDateString(globalDate, "/") + "/times.txt";
        //
        // //Update the "Light Curves Raw Data" link
        // window.document.getElementById('light-curves-raw-data').src = "http://suntoday.lmsal.com/sdomedia/SunInTime/" + getUTCDateString(globalDate, "/") + "/eovsaDySpec1minRes.txt";
        //
        // //Update the "NASA STEREO Browse Data" link
        // window.document.getElementById('stereo-browse-data-link').href = "https://stereo-ssc.nascom.nasa.gov/browse/" + getUTCDateString(globalDate, "/") + "/";
        //
        // //Update the "IRIS Pointing Summary" link
        // window.document.getElementById('iris-pointing-summary-link').href = "https://iris.lmsal.com/iristoday/?iristoday_date=" + getUTCDateString(globalDate, "-");

        //$('#datepicker').attr('value', "Select Date");

        window.history.pushState({}, getUTCDateString(globalDate, "/"), "?suntoday_date=" + getUTCDateString(globalDate, "-"))
    }

    //Initialize the datepicker: cannot choose a date before April 16, 2010 or after the current date.
    // var d = new Date();
    // d.setDate(d.getDate() -7);
    $('#datepicker').datepicker({
        startDate: START_DATE,
        endDate: "+0d",
        autoclose: false
        // setDate: d,
        // autoclose: true
    }).bind('changeDate', updateForDate);

    //On DOM load, setup the dynamic elements of the page.
    $(window.document).ready(function () {
        loadThumbnailsForDate(globalDate);
        // loadEovsaSPForDate(globalDate);
        $('#sun-today-date').text("Obs Date: " + getUTCDateString(globalDate, "-"));
        $('#copyRight').text("Copyright © EOVSA Website " + new Date().getUTCFullYear());
        $('.channel-select span').on('mouseover', function () {
            console.log("you selected " + $(this).attr('value'));

            var id;
            id = $(this).parent().parent().children("img").attr("id");

            //Reload the image with the new channel
            $(this).parent().find("span").removeClass("channel-active");     //<---- This is disgusting, but it works so I'm not going to touch it.
            $(this).addClass("channel-active");

            //Remove the chosen attribute from all other wavelength choices before making the one you clicked "chosen"
            $(this).parent().attr("chosen", $(this).attr("value"));

            var svalue = $(this).attr("value");
            loadImage(id, getEovsaImgURL(globalDate, "t", $(this).attr('value')));
            // if (svalue.startsWith('_eovsa_bd')) {
            //     loadImage(id, getEovsaImgURL(globalDate, "t", $(this).attr('value')));
            // } else {
            //     loadImage(id, getHelioviewerURL(256, svalue, globalDate));
            // }

            updateDownloadButtons();
        });

        $('.dspec-select span').on('mouseover', function () {
            console.log("you selected " + $(this).attr('value'));

            var id;
            id = $(this).parent().parent().children("img").attr("id");

            //Reload the image with the new channel
            $(this).parent().find("span").removeClass("dspec-active");     //<---- This is disgusting, but it works so I'm not going to touch it.
            $(this).addClass("dspec-active");

            //Remove the chosen attribute from all other wavelength choices before making the one you clicked "chosen"
            var svalue = $(this).attr("value");
            $(this).parent().attr("chosen", svalue);

            loadImage(id, getEovsaImgURL(globalDate, svalue + 'SP', "", 'png'));
        });


        updateForDate({date: globalDate}, globalDate);

        // $('#solar_viewer_link').click(function () {
        //     window.open("http://suntoday.lmsal.com/sdomedia/SunInTime/webgl_tool/solar_viewer/?date=" + getUTCDateString(globalDate, ""));
        // });
    });

    var b2tbtn = $('#backToTopButton');

    $(window).scroll(function () {
        if ($(window).scrollTop() > 300) {
            b2tbtn.addClass('show');
        } else {
            b2tbtn.removeClass('show');
        }
    });

    b2tbtn.on('click', function (e) {
        e.preventDefault();
        $('html, body').animate({scrollTop: 0}, '300');
    });

})(window);
