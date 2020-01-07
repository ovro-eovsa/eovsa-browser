(function(window){
	
	window.checkIris = function(date) {
	var dat = new Date(date);
    if(dat < (new Date(IRIS_START)).valueOf()) {
        $('#iris-summary-not-available').show();
        $('#iris-pointing-summary-link').hide();
    }else{
    	$('#iris-summary-not-available').hide();
        $('#iris-pointing-summary-link').show();
    	}

    }

})(window);