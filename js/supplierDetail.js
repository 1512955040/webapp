
// 切换左侧边栏
function changeLeftSidebar(){
  $(this).addClass('active').siblings().removeClass('active');

  var index = $('.container-left-item').index($(this));
  $(".conright-list:eq("+index+")").removeClass('dn').siblings().not(".conright-list1").addClass('dn');

  setLeftHeight();
}


//点击[打印键]
function showPrintPop(){
  $("#print").modal('show');
  //初始化 打印内容切换按钮
  $("#print .modal-body-change>p>i").removeClass("active");
  $("#print .modal-body-change>p:eq(1)>i").addClass("active");
  //初始化 打印内容
  $("#print .mCSB_container>div").addClass("dn");
  $("#print .mCSB_container>div:first").removeClass("dn")
}
// 打印弹框 - 切换打印内容
function changePrintItem(){
  $(this).find('i').toggleClass("active");
  var index = $("#print .modal-body-change>p").index($(this))-1;

  $("#print .mCSB_container>div:eq("+index+")").toggleClass("dn");
}

function changeSignedContract(){
  $(this).find('i').toggleClass('active');
}

/*设置左边栏高度*/
function setLeftHeight(){

	var contentLeft=$('.conright-content-left').outerHeight();
	$('.conright-content-right').css('height',contentLeft+'px');
  var containerRight=$('#container-right').outerHeight();
	$('#container-left').css('height',containerRight+30+'px');
}

$(function(){
	setHistory($('.conright-item-title span').html());
	getHistory();
	setLeftHeight();
  /*上部分*/
  $(".container-right-title-back").on('click', function(){window.location.href = 'supplier.html'});
  $(".container-right-title-btn.edit").on('click', function(){window.location.href = 'supplierAdd.html'});

  /*左部分*/
  $(".container-left-item").on('click',changeLeftSidebar);

  /*内容部分*/
  $(".signContract .conAsset-data-item").on("click",changeSignedContract);
  $(".container-right-title-btn.print").on("click",showPrintPop);
  $("#print .modal-body-change").on('click',"p",changePrintItem);

  /*下部分*/
});
