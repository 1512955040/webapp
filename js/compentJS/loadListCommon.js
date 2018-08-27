//页面上筛选条件所执行的函数，分页、模糊搜索等
var errorReturnCom = -1;
var successReturnCom = 1;
//获取url中的参数
var getUrlParamH = function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}
/**
 * 弹框的关闭
 * @param msg 弹框关闭后的提示信息
 * @param hideArea 弹框id
 */
var outBoxClose = function outBox(msg,hideArea){
	$("#tipMsg").addClass("active").html(msg).show();
	function tipHide(){
		$("#tipMsg").hide();
	}
    setTimeout(tipHide,2000);
	$("#"+hideArea).modal('hide');
}
