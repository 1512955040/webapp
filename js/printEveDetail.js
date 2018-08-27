var yes = 1;
var no = 2;

var eventInfo = $("div.eventInfo");
var eventWorkOrder = $("div.eventWorkOrder");
var eventConver = $("div#eventConver");
var personInfo = $("div#personInfo");

var dataArea = new Object();
dataArea.eventInfo = eventInfo;//事件明细
dataArea.eventWorkOrder = eventWorkOrder;//工单信息
dataArea.eventConver = eventConver;//会话信息
dataArea.personInfo = personInfo;//人员信息
/**
 * 显示需要打印的项，隐藏不需要打印的项
 */
function printContent(){
  var eventId = getUrlParamAssert("eventId");
  var res_info = getUrlParamAssert("res_info");
  var res_workSheet = getUrlParamAssert("res_workSheet");
  var res_solution = getUrlParamAssert("res_solution");
  var res_workLog = getUrlParamAssert("res_workLog");
  var res_conversition = getUrlParamAssert("res_conversition");
  var res_history = getUrlParamAssert("res_history");
  var res_application = getUrlParamAssert("res_application");
  var res_manager = getUrlParamAssert("res_manager");
  var res_executor = getUrlParamAssert("res_executor");
  //需要打印的项目，  1表示需要打印。2表示不需要打印
  $("div.modal-body-everyItem").hide();
  if(res_info == yes){
	  $("div.eventInfo").show();
  }
  if(res_workSheet == yes){
	  $("div.eventWorkOrder").show();
  }
  if(res_solution == yes){
	  $("div.solved").show();
  }
  if(res_workLog == yes){
	  $("div.workNote").show();
  }
  if(res_conversition == yes){
	  $("div.conversation").show();
  }
  if(res_history == yes){
	  $("div.history").show();
  }
  if(res_application == yes){
	  $("div.application").show();
  }
  if(res_manager == yes){
	  $("div.manager").show();
  }
  if(res_executor == yes){
	  $("div.executor").show();
  }
}

$(function(){
	printContent();
	eventPrint(dataArea);//绑定数据
	$("#btnPrint").click(function(){
    window.print();
	})
});

//获取url中的参数
function getUrlParamAssert(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}
