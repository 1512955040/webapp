$(document).ready(function() {
	$("body").click(function(){
		if ($(".tips").length!==0) {
			$("#tooltipdiv").remove();
		}
	});

	$("body").on("mouseover mousemove mouseout","*",function(e){
		e.stopPropagation();
		var containerLength = $(e.target).outerWidth();
		var textLength = e.target.scrollWidth;

		if ($(e.target).children().length !== 0) {
			return ;
		}
		if ($(e.target).text() == "|") {
			return ;
		}
		$(e.target).removeClass("tips");
		if (textLength - containerLength > 1) {
				$(e.target).addClass("tips");

				if(e.type == "mousemove") {
					$("#tooltipdiv").css({
						"top": (e.pageY + 10) + "px",
						"left": (e.pageX + 10) + "px"
					}).show();
				} else if(e.type == "mouseout") {
					$("#tooltipdiv").remove();
				} else if(e.type == "mouseover") {
					var _text = $(this).text();
					if($("#tooltipdiv") != undefined) {
						_tooltip = "<div id='tooltipdiv' style='position: absolute;z-index:1050;border: 1px solid #333;background: #f7f5d1;padding: 3px 3px 3px 3px;color: #333;display: none;font-size:14px'></div>";
						$("body").append(_tooltip);
					}
					$("#tooltipdiv").text(_text);
					$("#tooltipdiv").show();
				}



		}
		// else {
		// 		// $(target).removeAttr( "title");
		// 		$(e.target).removeClass("tips");
		// }

		// $("body").on("",".tips", function(e) {
		//
		// 		if(e.type == "mousemove") {
		// 			$("#tooltipdiv").css({
		// 				"top": (e.pageY + 10) + "px",
		// 				"left": (e.pageX + 10) + "px"
		// 			}).show();
		// 		} else if(e.type == "mouseout") {
		// 			$("#tooltipdiv").remove();
		// 		} else if(e.type == "mouseover") {
		// 			var _text = $(this).text();
		// 			if($("#tooltipdiv") != undefined) {
		// 				_tooltip = "<div id='tooltipdiv' style='position: absolute;z-index:1050;border: 1px solid #333;background: #f7f5d1;padding: 3px 3px 3px 3px;color: #333;display: none;font-size:14px'></div>";
		// 				$("body").append(_tooltip);
		// 			}
		// 			$("#tooltipdiv").text(_text);
		// 			$("#tooltipdiv").show();
		//
		// 		}
		//
		// });




	})



});


//		if($(".tips") != undefined) {
//			$(".tips").each(function(i) {
//				$(this).mouseover(function() {
//					_text = $(this).text();
//					if($("#tooltipdiv") != undefined) {
//						_tooltip = "<div id='tooltipdiv' style='font-size:14px'></div>";
//						$("body").append(_tooltip);
//					}
//					$("#tooltipdiv").text(_text);
//					$("#tooltipdiv").show();
//				}).mouseout(function() {
//					$("#tooltipdiv").hide();
//				}).mousemove(function(e) {
//					$("#tooltipdiv").css({
//						"top": (e.pageY + 10) + "px",
//						"left": (e.pageX + 10) + "px"
//					}).show();
//				});
//			});
//		}
