function goBack(){
	window.history.back();
}
//点击每个输入框添加active

$(function(){
	getHistory();
	$('span.addTitle-back,button.addTitle-delete').click(goBack);
})
