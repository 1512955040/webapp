var yes = 1;
var no = 2;
var slaId;//记录上一页的slaId
var contractInfo = $("div.contract_info");
var contractAsset = $("#con_list");
var contractCompany = $("div.contract_company");
var contractSla = $("div.contract_sla");

var dataArea = new Object();//合同数据
dataArea.contractInfo = contractInfo;
dataArea.contractEnterprise = contractCompany;
dataArea.areaSla = contractSla;//合同的sla数据
dataArea.areaRes = contractAsset;//合同资源
/**
 * 显示需要打印的项，隐藏不需要打印的项
 */
function printContent(){
  var contract_info = getUrlParamAssert("contract_info");
  var contract_asset = getUrlParamAssert("contract_asset");
  var contract_company = getUrlParamAssert("contract_company");
  var contract_sla = getUrlParamAssert("contract_sla");
  slaId = getUrlParamAssert("slaId");
  //需要打印的项目，  1表示需要打印。2表示不需要打印
  $("div.modal-box").hide();
  if(contract_info == yes){
	  $("div.contract_info").show();
  }
  if(contract_asset == yes){
	  $("div.contract_asset").show();
  }
  if(contract_company == yes){
	  $("div.contract_company").show();
  }
  if(contract_sla == yes){
	  $("div.contract_sla").show();
  }
}

$(function(){
	printContent();
	printSerConData(slaId,dataArea);//绑定数据
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
