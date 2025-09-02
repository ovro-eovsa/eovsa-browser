(function (window) {

    /**
     * Load an image from "src" into the specified frame (a.k.a. the img" element's id attribute)
     */

    window.getEovsaImgURL = function (date, imgtype, channelValue, imgExt = 'jpg') {
        /**
         * imgtype: 't' (thumbnail), 'l' (low resolution), 'f' (full resolution)
         */
        let qlookfitsdir = "../fits/synoptic/";
        if (['jpg', 'png'].indexOf(imgExt.toLowerCase()) >= 0) {
            return "../SynopticImg/eovsamedia/eovsa-browser/" + getUTCDateString(date, "/") + "/" + imgtype + channelValue + "." + imgExt;
        } else if (imgExt.toLowerCase() == 'fits') {
            if (['TP', 'XP'].indexOf(channelValue) >= 0) {
                console.log(qlookfitsdir + getUTCDateString(date, "/") + "/EOVSA_" + channelValue + "all_" + getUTCDateString(date, "") + ".fts");
                return qlookfitsdir + getUTCDateString(date, "/") + "/EOVSA_" + channelValue + "all_" + getUTCDateString(date, "") + ".fts";
            } else if (channelValue == 'path') {
                console.log(qlookfitsdir + getUTCDateString(date, "/"));
                return qlookfitsdir + getUTCDateString(date, "/");
            } else {
                if (date.valueOf() > (new Date("2019-02-22")).valueOf()) {
                    var spwmap = {
                        "_eovsa_bd01": '00-01',
                        "_eovsa_bd02": '02-05',
                        "_eovsa_bd03": '06-10',
                        "_eovsa_bd04": '11-20',
                        "_eovsa_bd05": '21-30',
                        "_eovsa_bd06": '31-43',
                        "_eovsa_bd07": '44-49'
                    };
                } else {
                    var spwmap = {
                        "_eovsa_bd01": '01~03',
                        "_eovsa_bd02": '04~09',
                        "_eovsa_bd03": '10~16',
                        "_eovsa_bd04": '17~24',
                        "_eovsa_bd05": '25~30',
                        "_eovsa_bd06": '',
                        "_eovsa_bd07": ''
                    };
                }
                return qlookfitsdir + getUTCDateString(date, "/") + "/eovsa_" + getUTCDateString(date, "") + ".spw" + spwmap[channelValue] + ".tb.disk.fits";
            }

        } else {
            return ""
        }
    };


	window.loadOVSASpecForDate = function (date) {
		let OVSASpecURL = "../SynopticImg/eovsamedia/eovsa-browser/"
			+ getUTCDateString(date, "/") + "/fig-OVSA_spec_" + getUTCDateString(date, "") + ".";

		// // Check if it should be .jpg or .png
		// let imgExt = (date.valueOf() > (new Date("2025-01-27")).valueOf()) ? "jpg" : "png";
        let imgExt = "jpg";
		OVSASpecURL += imgExt;

		window.loadImage("OVSASpecFig", OVSASpecURL);
	};

	
    window.getHelioviewerURL = function (imSize, channelValue, date) {
        var channelV = parseInt(channelValue, 10);
        let fov = 2454; // Field of View in arcsec
        let hfov = fov / 2; // Field of View in arcsec
        var imageScale = fov / imSize;
        return "http://api.helioviewer.org/v2/takeScreenshot/?imageScale=" + imageScale + "&layers=[SDO,AIA,AIA," + channelV + ",1,100]&scaleX=0&scaleY=0&width=" + imSize + "&height=" + imSize + "&date=" + getUTCDateString(date, "-") + "T20:00:00Z&x1=-" + hfov + "&x2=" + hfov + "&y1=-" + hfov + "&y2=" + hfov + "&display=true&watermark=false";
    };

    window.loadImage = function (frameId, src) {
        var img = document.getElementById(frameId);
        img.src = src;

        img.onerror = function () {
            if (src.includes('_v3.0') && src.includes('_eovsa_bd')) {
                var newSrc = src.replace('_v3.0', '');
                img.src = newSrc;

                img.onerror = function () {
                    img.src = 'img/nodata.jpg';
                };
            } else {
                img.src = 'img/nodata.jpg';
            }
        };
    };


    window.loadThumbnailsForDate = function (date) {
        function channel(channelId) {
            this.channelId = channelId;
            this.channelUrl = function () {
                var channelValue = document.getElementById(this.channelId.slice(0, -1) + "_" + this.channelId.slice(-1) + "_select").getAttribute("chosen");
                return window.getEovsaImgURL(date, "t", channelValue);
                // if (channelValue.startsWith('_eovsa_bd')) {
                //     return window.getEovsaImgURL(date, "t", channelValue);
                // } else {
                //     return window.getHelioviewerURL(256, channelValue, date);
                // };
            };
        }

        var channel1Id = "channel1",
            channel2Id = "channel2",
            channel3Id = "channel3",
            channel4Id = "channel4",
            channel5Id = "channel5",
            channel6Id = "channel6";

        var channel1 = new channel(channel1Id);
        var channel2 = new channel(channel2Id);
        var channel3 = new channel(channel3Id);
        var channel4 = new channel(channel4Id);
        var channel5 = new channel(channel5Id);
        var channel6 = new channel(channel6Id);


        var url1 = channel1.channelUrl(),
            url2 = channel2.channelUrl(),
            url3 = channel3.channelUrl(),
            url4 = channel4.channelUrl(),
            url5 = channel5.channelUrl(),
            url6 = channel6.channelUrl();

        //Load the images into the corresponding channel positions.
        window.loadImage(channel1Id, url1);
        window.loadImage(channel2Id, url2);
        window.loadImage(channel3Id, url3);
        window.loadImage(channel4Id, url4);
        window.loadImage(channel5Id, url5);
        window.loadImage(channel6Id, url6);
		
		window.loadOVSASpecForDate(date);
    };

    window.loadEovsaSPForDate = function (date) {
        var channelId = "eovsaDySpecFullRes";
        var id = channelId + "Select";
        var channelValue = document.getElementById(id).getAttribute("chosen");
        window.loadImage(channelId, getEovsaImgURL(date, channelValue + 'SP', "", 'png'));
    };
})(window);
