var yes = 1;//表示选中
var dataArea = new Object();
dataArea.workOrder = $("div.workOrder");
dataArea.person = $("#personInfo");
dataArea.workLogTbody = $("#table-bordered");//工作日志表格的内容
dataArea.workLogTfoot = $("#workTotalTfoot");//工作日志表格的最后一行
dataArea.chat = $("div.conversation");
function printContent(){
  var workOrderId = getUrlParamAssert("workOrderId");
  var res_workSheet = getUrlParamAssert("res_workSheet");
  var res_solution = getUrlParamAssert("res_solution");
  var res_workLog = getUrlParamAssert("res_workLog");
  var res_conversition = getUrlParamAssert("res_conversition");
  var res_history = getUrlParamAssert("res_history");
  var res_application = getUrlParamAssert("res_application");
  var res_manager = getUrlParamAssert("res_manager");
  var res_executor = getUrlParamAssert("res_executor");
  //隐藏所有内容
  $("div.modal-body-everyItem").hide();
  if(yes == res_workSheet){
	$("div.workOrder").show();
  }
  if(yes == res_solution){
    $("div.solution").show();
  }
  if(yes == res_workLog){
    $("div.workLog").show();
  }
  if(yes == res_conversition){
	$("div.conversition").show();
  }
  if(yes == res_history){
    $("div.history").show();
  }
  if(yes == res_application){
    $("div.application").show();
  }
  if(yes == res_manager){
    $("div.manager").show();
  }
  if(yes == res_executor){
    $("div.executor").show();
  }
}

$(function(){
	printContent();
	printData(dataArea);
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
