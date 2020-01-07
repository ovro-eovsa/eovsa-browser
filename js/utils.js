/** Function to check if a URL to a specified path exists.
    NOTE: b/c of Cross-Origin Policy, you can only query
    URLs on the current domain.
**/
(function(window){window.checkUrl = function(url) {
	var http = new XMLHttpRequest();
	http.open('HEAD', url, false);
	http.send();
	
	return http.status!=404;
    };
})(window);


