(function(window){
    var dp = "#datepicker";
    console.log("Mouse entered!");
    window.jQuery(dp).hover(function(){
	window.jQuery(dp).data().datepicker.current_date = new Date(globalDate);
	window.jQuery(this).focus();
	//window.jQuery(this).attr('value', 'Select Date');
    });
})(window);