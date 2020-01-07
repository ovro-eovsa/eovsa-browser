(function(window){
	window.konami = {
		keys: [38, 38, 40, 40, 37, 39, 37, 39, 66, 65 ],   //Order of keys
		num_pressed: 0
	};

	window.check_for_konami_keys = function(evt){
		if (evt.which == window.konami.keys[ window.konami.num_pressed ]){
			if (++window.konami.num_pressed >= window.konami.keys.length){
				//alert("Konami code!");
				if (document.getElementById("konami_mp3")){
					document.getElementById("konami_mp3").remove();
					window.konami_num_pressed = 0;
					return;
				}
				var e = document.createElement("embed");
				e.id = "konami_mp3";
				e.src = "./resources/final_frontier.mp3";
				e.hidden = true;
				document.body.appendChild(e);
				window.konami.num_pressed = 0;
			}
		} else {
			//Start over
			window.konami.num_pressed = 0;
		}
	};
	window.document.addEventListener("keydown", window.check_for_konami_keys);
})(window);