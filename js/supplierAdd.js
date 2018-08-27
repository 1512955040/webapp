
$(function(){
	getHistory();
	//点击返回按钮，退回上一页
	$("span.addTitle-back,button.addTitle-delete").click(function(){
		window.history.back();
	});
	
})
