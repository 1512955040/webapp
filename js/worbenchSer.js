//切换左侧页面
function changeLeft() {
    /* 页面切换 */
    $(this).addClass('active').siblings().removeClass('active');
//	$(this).addClass('container-right').siblings().removeClass('container-right');

//  $('.title-name').html($('.left-item' + index).text());
	if($(".container-left-item1").hasClass('active')){
    	$('.container-right1').removeClass('dn');
    	$('.container-right2').addClass('dn');
    	$('.container-right3').addClass('dn');
    }
	if($(".container-left-item2").hasClass('active')){
		$('.container-right2').removeClass('dn');
		$('.container-right1').addClass('dn');
		$('.container-right3').addClass('dn');
	}
	if($(".container-left-item3").hasClass('active')){
		$('.container-right3').removeClass('dn');
		$('.container-right1').addClass('dn');
		$('.container-right2').addClass('dn');
	}
	setLeftHeight()  
}
//arr 按时间有序排列  给节假日添加背景色
function changeColor( arr ){
	var idx_arr = 0;
	var all_day = $('#calendar').find('.fc-day.fc-widget-content');
	for(var idx=0 ; idx<all_day.length ; idx++){
		var curr_td = all_day.eq(idx);
		if (curr_td.attr("data-date") == arr[idx_arr]){
			curr_td.addClass('vacation');
			curr_td.append('<ul class="everyEvent"><li class="tixing">提醒<i>1</i></li><li class="tixing">任务<i>2</i></li><li class="tixing">休假<i>2</i></li></ul>')
			idx_arr++;
		}
	}
}

var getHistory1=function(){
	if($.cookie("history")){
	 var json = eval("("+$.cookie("history")+")"); 
	 var list =""; 
	 $(json).each(function(){
	 	if(this.url.indexOf('orderDetail')>=0){//工单详情
	 		list = list + "<li><i class='add-img1'></i><a class='title' href="+this.url+">"+this.title+"</a></li>";
	 	}
//	 	else if(this.url.indexOf('assetDetail')>=0){//资产详情
//	 		list = list + "<li><i class='add-img2'></i><a class='title' href="+this.url+">"+this.title+"</a></li>";
//	 	}
	 	else if(this.url.indexOf('serviceContractDetail')>=0){//合同详情
	 		list = list + "<li><i class='add-img3'></i><a class='title' href="+this.url+">"+this.title+"</a></li>";
	 	}
//	 	else if(this.url.indexOf('projectDetail')>=0){//项目详情
//	 		list = list + "<li><i class='add-img4'></i><a class='title' href="+this.url+">"+this.title+"</a></li>";
//	 	}
	 })
	 $("#history").html(list);
	 } 
}
/*设置左侧高度*/
function setLeftHeight() {
	var heightLeft = $("#container-left").height();
	var heightRight = $("#container-right").height();
	$("#container-left").height('');
	$("#container-left").height(heightRight+40+'px');
}
	
$(function(){
	getHistory1();
	setLeftHeight()
	$("span.navlist-img1").addClass("active");
	$(".container-left-item").click(changeLeft)
	
	$('#calendar').fullCalendar({
			   	firstDay:0,   //第一天为周日
			    header: {
					left: ' ',
					center: ' title',
					right: ' ',
				},
				viewRender:function( view, element ){
					var arr = ['2017-01-03','2017-01-05','2017-01-10'];
					changeColor(arr);
				}
		});
		console.log($('.fc-center h2').html());
})
