var BWingu = function() {
	
	/* --- VAR --- */
	
	this.language;

	/* --- PUBLIC --- */

	/**
	 * Return the language. Detect it if not defined.
	 * */
	this.lang = function() {
		!this.language && this.setLang();
		return this.language;
	}
	
	/**
	 * Retrieve texts. 
	 * */
	this.text = function(category, txtID) {
		return properties.text[this.lang()][category][txtID];
	}
	
	/**
	 * store(key) or store(key, val)
	 * get or set value in the local storage (no time limit)
	 * */
	this.store = function(key, val) {
		if(localStorage) {
			val && (localStorage[key] = val);
			return localStorage[key];
		}  else {
			this.yourBrowserSucks();
		}
		
	}
	
	this.yourBrowserSucks = function() {
		alert("Get a real browser !")
	}
	
	this.loadTexts = function(varLang) {
		if(varLang) {
			if(this.lang() != varLang) {
				this.language = varLang;
				this.fillTexts();
			}
		} else {
			this.fillTexts();
		}
	} 
	
	/* --- PRIVATE --- */

	this.fillTexts = function() {
		var _this = this;
		$("[bwingu-text-category][bwingu-text-ID]").each(function() {
			var elt = $(this);
			var cat = elt.attr("bwingu-text-category");
			var id = elt.attr("bwingu-text-ID");
			elt.html(_this.text(cat, id));
		});
	}
	
	this.init = function() {
		var _this = this;
		// Bind UI
		$(function() {
			//lang
			$("[bwingu-changeLang]").click(function(e) {
				_this.loadTexts($(this).attr("bwingu-changeLang"));
				e.preventDefault();
			});
		});
	}
	
	this.setLang = function() {
		this.language = "en";
		if(navigator.language) {
			this.language = navigator.language.substring(0, 2);
			if(!properties.text[this.language]) {
				this.language = "en";
			} 
		}
	}
	
	/* --- INIT --- */
	
	this.init();
}

var B = new BWingu();