var aList;

$(function(){

	var errorManager = function(err) {
		var messageElt = $("#message");
		messageElt.find("p").html(B.text("errors", err));
		messageElt.fadeIn().delay(2000).fadeOut();
	} 
	
	var getList = function(uuid) {
		
		$("h1").html(B.text("misc", "load"));
		$.ajax({
			url: properties.urls.showList + uuid + ".json",
			dataType: "json",
			type: "GET",
			success: function(data) {
				aList = data;
				$("#createList").submit(addItem);
				fillMail(aList.uuid);
				fillList(aList);
			},
			error: function(data) {
				errorManager("listRetrieve");
			}
		});
	}
	
	var fillMail = function(uuid) {
		$("#send").find("a").attr("href", "mailto:?subject=" + B.text("misc", "mailSubject") + "&body= "+ B.text("misc", "mailSubject") + properties.urls.showList + uuid);
	}
	
	var fillList = function(list) {
		$("h1").html(list.text);
		var listNameInput = $("#listName");
		listNameInput.val("");
		listNameInput.attr("placeholder", B.text("misc", "itemPlaceholder"));
		var ul = $("#items").hide();
		$.each(list.elements, function(){
			var li = $("<li>").html(this.text);
			ul.prepend(li);
		});
		ul.slideDown("slow");
	}
	
	var addList = function(e) {
		e.preventDefault();
		var listNameInput = $("#listName");
		if(listNameInput.val() == "") {
			errorManager("empty");
			return;
		}
		var _this = $(this);
		$.ajax({
			url: properties.urls.addlist,
			dataType: "json",
			type: "POST",
			data: {
				text: listNameInput.val()
			},
			success: function(data) {
				aList = data;
				fillMail(aList.uuid);
				$("h1").html(listNameInput.val());
				listNameInput.val("");
				listNameInput.attr("placeholder", B.text("misc", "itemPlaceholder"));
				_this.unbind().submit(addItem);
			},
			error: function(data) {
				errorManager("listSave");
			}
		});
	}
		
	var addItem = function(e) {
		e.preventDefault();
		var listNameInput = $("#listName");
		if(listNameInput.val() == "") {
			errorManager("empty");
			return;
		}
		$.ajax({
			url: properties.urls.addItem + aList.uuid + "/" + listNameInput.val(),
			dataType: "json",
			type: "POST",
			data: {
				text: $(this).find("#listName").val()
			},
			success: function(data) {
				var li = $("<li>").html(listNameInput.val()).hide();
				$("#items").prepend(li);
				li.slideDown("slow");
				listNameInput.val("");
			},
			error: function(data) {
				errorManager("itemSave");
			}
		});
	}
	
	
	
	// ****** BIND UI ******

	
	
	$("#homeBtn").click(function(e) {
		if(!confirm(B.text("misc", "leave"))) {
			e.preventDefault();
		}
	});
	
	$("a.close").click(function(e) {
		$(this).parent().hide();
		e.preventDefault();
	});
	
	$("#send").click(function(e) {
		if(aList && aList.uuid) {
			window.location = $(this).find("a").attr("href");
		} else {
			e.preventDefault();
		}
	});
	
	$("#listName, #submit").ajaxSend(function() {
		$(this).attr("disabled", "disabled");
	});
	
	$("#listName, #submit").ajaxComplete(function() {
		$(this).removeAttr("disabled");
	});
	
	$("#message").ajaxSend(function() {
		$(this).hide();
	});
	
	
	
	// ****** INIT ******
	
	//Is there a uuid in the url ?
	var param = window.location.href.split("?");
	if(param[1]) {
		var uuid = param[1].split("=");
		if(uuid[1]) {
			getList(uuid[1]);
		} else {
			$("#createList").submit(addList);
		}
	} else {
		$("#createList").submit(addList);
	}
	
});