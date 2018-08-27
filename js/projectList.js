var projectAdd = "newProject.html";
var projectDetail = "projectDetail.html";
var buildName,buildVal;
var successReturn = 1;
var failReturn = 2;
var userDefined = 216;//项目承建期，自定义时间
var allDate = 215;//项目承建期，所有时间
var active = "active";
buildName = [
             {
            	 value:0,
                 proBuild:"--请选择--"
             },
             {
            	 value:211,
                 proBuild:"今天"
             },
             {
            	 value:212,
                 proBuild:"昨天"
             },
             {
            	 value:213,
                 proBuild:"本周"
             },
             {
            	 value:214,
                 proBuild:"本月"
             },
             {
            	 value:216,
                 proBuild:"自定义时间"
             },
             {
            	 value:215,
                 proBuild:"所有时间"
             },
             ];
buildVal = {
		proBuild:{
			value:function(){
				return this.value;
			}
		}
};
/**
 * 加载该企业所有的供应商
 * @param flag. 标志，true，执行完该函数后需要再执行一个函数
 *                  false，执行完该函数后不需要执行函数
 */
function loadSuppliers(flag,selectOne){

	$.ajax({
		url:loadSuppliersAllUrl,
		type:"get",
		dataType:"json",
//		complete: onComplete,
		success:function(result){

            //登录信息失效，ajax请求静态页面拦截
            onComplete(result);

			if(1 == result.status){
				var supplierVal = {
						win_unit_name:{
							value:function(){
								return this.win_unit_name;
							}
						}
				};
				var suppliers = result.data;
				var sel = $("select.proSuppliers");
				sel.render(suppliers,supplierVal);
				sel.selectpicker('val',"--请选择--");
				sel.selectpicker('refresh');
				if(flag){
					selectOne();
				}
			}
		},
		error:function(XMLHttpRequest){
			error_500(XMLHttpRequest.responseText);
		}
	});
}
/**
 * 加载所有的项目建设时期
 */
function loadProStatus(){
	$("select.proBuild").render(buildName,buildVal);
	$('select.proBuild.selectpicker').selectpicker('val',0);
	$('select.proBuild.selectpicker').selectpicker('refresh');
}
var numEachPage;//每页10条数据
/**
 * 加载每页显示多少条数据
 * @param callBackFun 加载完需要执行的函数
 */
function loadPageEachNum(callBackFun){
	$.ajax({
		url:loadPageEachNumUrl,
		type:"get",
		data:{},
		dataType:"json",
		success:function(result){
			//登录信息失效，ajax请求静态页面拦截
            onComplete(result);
            numEachPage = result.data;
            callBackFun();
		},
		error:function(XMLHttpRequest){
			error_500(XMLHttpRequest.responseText);
		}
	});
}
/**
 * 加载项目列表
 */
function loadProjectList(fc){

	$.ajax({

		url:projectListUrl,
		type:"post",
		data:{"proSuppliers":fc.proSuppliers,"proBuild":fc.proBuild,
			  "proPlan0":fc.proPlan0,"proPlan1":fc.proPlan1,"proPlan2":fc.proPlan2,
			  "proPlan3":fc.proPlan3,"proPlan4":fc.proPlan4,"proStatus0":fc.proStatus0,
			  "proStatus1":fc.proStatus1,"proStatus2":fc.proStatus2,"like":fc.like,
			  "page":fc.page,"startDate":fc.startDate,"endDate":fc.endDate},
		dataType:"json",
//		complete: onComplete,
		success:function(result){

            //登录信息失效，ajax请求静态页面拦截
            onComplete(result);

			initClass();
			if(1 == result.status){
				var project  = result.data;
				//console.log(project);
				//判断是否有数据
				var hasNoData = $("div.proListNoData");
				var hasData = $("div.right-body-table");
				var pageInfo = $("#pageMsg,#pageMsgHelp");
				
				if(project.length == 0){
					hasData.hide();
					hasNoData.removeClass('dn');
					pageInfo.hide();
				}else{
					pageInfo.show();
					hasNoData.addClass('dn');
					hasData.show();
					//项目的样式
					var proVal = {
							proStatusClass:{
								class:function(){
									if(42 == this.project_status){
										return "right-table-body-status perform";
									}else if(43 == this.project_status){
										return "right-table-body-status overdue";
									}else if(44 == this.project_status){
										return "right-table-body-status planing";
									}else{
										return "right-table-body-status unknown";
									}
								}
							}
					};
					//绑定项目数据
					$("div.proList").render(project,proVal);
					//绑定分页数据和分页数据的样式
					 var totalPage = project[0].page;//总页数
					 var totalNum = project[0].total;//总条数
				     var currentPage = fc.page;//当前页数
					 var firstData = (currentPage-1)*(numEachPage)+1;
				     var lastData;
				     if(project.length - numEachPage == 0){
				         lastData = firstData-1 + numEachPage;
				     }else{
				         lastData = firstData-1 + (project.length)%(numEachPage);
				     }
				     //分页数据
				     var pageMsg={
				    	"currentPage":currentPage,
				    	"totalPage":totalPage,
				    	"firstData":firstData,
				    	"lastData":lastData,
				    	"totalNum":totalNum
				     };
				     //分页样式
				     var pageVal={
				    		 prePageHelp:{
				    			 class:function(){
				    				 if(currentPage == 1){
				    					 return "title-page-left title-page";
				    				 }else{
				    					 return "title-page-left title-page active";
				    				 }
				    			 }
				    		 },
				    		 nextPageHelp:{
				    			 class:function(){
				    				 if(totalPage == 1 || totalPage-currentPage == 0){
				    					 return "title-page-right title-page";
				    				 }else{
				    					 return "title-page-right title-page active";
				    				 }
				    			 }
				    		 },
				    		 prePage:{
				    			 class:function(){
				    				 if(currentPage == 1){
				    					 return "di pageChange-span-up";
				    				 }else{
				    					 return "di pageChange-span-up active";
				    				 }
				    			 }
				    		 },
				    		 nextPage:{
				    			 class:function(){
				    				 if(totalPage == 1 || totalPage-currentPage == 0){
				    					 return "di pageChange-span-down";
				    				 }else{
				    					 return "di pageChange-span-down active";
				    				 }
				    			 }
				    		 },
				    		 prePageId:{
				    		 	class:function(){
		            				if(currentPage - 1 == 0 || currentPage == 0){
		            					return "pageChange-span1 pageChange-span di disabled";
		            				}else{
		            					return "pageChange-span1 pageChange-span di";
		            				}
		            			}
				    		 },
				    		 nextPageId:{
		            			class:function(){
		            				if(currentPage - 1 == 0 || totalPage-currentPage == 0){
		            					return "pageChange-span3 pageChange-span di disabled";
		            				}else{
		            					return "pageChange-span3 pageChange-span di";
		            				}
		            			}
		            		},
		            		goPageInput:{
		            			disabled:function(){
		            				if(totalPage - 1 == 0 || totalPage == 0){
		            					return "suibian";//这里return的不能为""，其余的什么都可以。
		            				}
		
		            			}
		            		}
				     	};
				     //清空之前操作
				     $('.table-col1').removeClass(active);
				     pageInfo.render(pageMsg,pageVal);
				}
			}
		},
		error:function(XMLHttpRequest){
			error_500(XMLHttpRequest.responseText);
		}
	});
}

/**
 * 到页面上找查询条件
 */
function findCondition(){

	var fc = new Object();
	//中标厂商（供应商）
	var suppliersH = $("select.proSuppliers option:selected").html();
	if("" == suppliersH){
		fc.proSuppliers = "0";
	}else{
		fc.proSuppliers = suppliersH;
	}
	//项目建设期
	var proBuildH = $("select.proBuild option:selected").val();
	if("" == proBuildH){
		fc.proBuild = 0;
	}else if(userDefined == proBuildH){
		fc.proBuild = proBuildH;
	}else{
		fc.proBuild = proBuildH;
	}
	//项目预算
	if($("i.proPlan0").hasClass(active)){
		fc.proPlan0 = 1;
	}else{
		fc.proPlan0 = 0;
	}
	if($("i.proPlan1").hasClass(active)){
		fc.proPlan1 = 1;
	}else{
		fc.proPlan1 = 0;
	}
	if($("i.proPlan2").hasClass(active)){
		fc.proPlan2 = 1;
	}else{
		fc.proPlan2 = 0;
	}
	if($("i.proPlan3").hasClass(active)){
		fc.proPlan3 = 1;
	}else{
		fc.proPlan3 = 0;
	}
	if($("i.proPlan4").hasClass(active)){
		fc.proPlan4 = 1;
	}else{
		fc.proPlan4 = 0;
	}
	//项目状态
	if($("i.proStatus0").hasClass(active)){
		fc.proStatus0 = 42;
	}else{
		fc.proStatus0 = 0;
	}
	if($("i.proStatus1").hasClass(active)){
		fc.proStatus1 = 43;
	}else{
		fc.proStatus1 = 0;
	}
	if($("i.proStatus2").hasClass(active)){
		fc.proStatus2 = 44;
	}else{
		fc.proStatus2 = 0;
	}
	var likeH = $("#likeId").val();
	if("" == likeH){
		fc.like = "0";
	}else{
		fc.like = likeH;
	}
	var pageH = $("#pageInput").html();
	if("" == pageH){
		fc.page = 1;
	}else{
		fc.page = pageH;
	}
	return fc;
}

/**
 * 清空页面上的查询条件
 */
function initCondition(){

	//清空搜索框
	$("#likeId").val("");
	$("i.active").removeClass(active);
	//两个下拉选默认的选中的都是"--请选择--"  该方法第二个参数是value的值
	$('select.proSuppliers').selectpicker('val',0);
	$('select.proBuild').selectpicker('val',0);
	//默认第一页
	$("#pageInput").html(1);
}
/**
 * 清空页面上的样式
 */
function initClass(){

	$("i.projectPro").removeClass(active);
	var ids = getCheckProject();
	changeDelClass(ids);
}

/**
 * 通过项目金额、项目状态筛选项目函数
 */
function loadProByMoSta(){
	var $i = $(this).children("i");
	//在点击的选项前打勾
	if($i.hasClass(active)){
		$i.removeClass(active);
	}else{
		$i.addClass(active);
	}
	//查找项目
	var fc = new Object();
	fc = findCondition();
	loadProjectList(fc);
}

/**
 * 通过供应商或者项目建设期进行筛选
 */
function loadProBySupPlan(){
	//查找项目
	var fc = new Object();
	fc = findCondition();
	var buildDate = fc.proBuild;
	if(userDefined != buildDate){
		loadProjectList(fc);
	}else{
		$("#customTime").modal('show');
		$("#customTime input").val("");
		$("button.btn-keep").click(function(){
			fc.startDate = $("[name='startDate']").val();
			fc.endDate = $("[name='endDate']").val();
			//如果某一个时间没有输入，则返回“所有时间”数据
			if("" == fc.startDate || "" == fc.endDate){
				fc.proBuild = allDate;
			}
			loadProjectList(fc);
			$("#customTime").modal('hide');
		});
	}
}
/**
 * 点击清空，查找所有的项目信息
 */
function loadProAll(){
	initCondition();
	var fc = new Object();
	fc = findCondition();
	loadProjectList(fc);
}

//页面上的相关操作
/**
 * 点击下一页
 */
function nextPageClick(){
	//点击下一页
	var pageHelp = $("#nextPageId").prev().html();
	var totalPage = $("#totalPageId").val();
	//判断当前页数与总页数大小
	if(totalPage - pageHelp > 0){
		pageHelp++;
		var fc = findCondition();
		fc.page = pageHelp;
		loadProjectList(fc);
	}else{
		 $("#tipMsg").addClass("active").html("最后一页").show();
        function hideMsg(){
            $("#tipMsg").addClass("active").html("最后一页").hide()
        }
        setTimeout(hideMsg,1500);
	}
}
/**
 * 点击上一页
 */
function prePageClick(){
	var pageHelp = $("#prePageId").next().html();
	if(pageHelp - 0 > 1){
		pageHelp--;
		var fc = findCondition();
		fc.page = pageHelp;
		loadProjectList(fc);
	}else{
		
	    $("#tipMsg").addClass("active").html("第一页").show();
	    function hideMsg(){
	        $("#tipMsg").addClass("active").html("第一页").hide()
	    }
	    setTimeout(hideMsg,1500);
	}
}
/**
 * 跳转到某一页
 */
function goPageClick(){
	var goPage = $("#goPageInput").val();
	var totalPage = $("#totalPageId").val();
	var fc = findCondition();
	if(isNaN(goPage) || "" == goPage || goPage < 1){
		fc.page = 1;
	}else if(goPage - totalPage > 0){
		fc.page = totalPage;
	}else{
		fc.page = goPage;
	}
	$("#goPageInput").val("");
	loadProjectList(fc);
}
/**
 * 输入搜索条件。按enter健，触发模糊检索
 */
function likeClick(){

//	$("#likeId").keydown(function(e){
//		var currKey = 0;e = e||event;
//        currKey = e.keyCode||e.which||e.charCode;
//		if(currKey == 13){
//			var likeHelp = $(this).val();
//			var fc = findCondition();
//			fc.like = likeHelp;
//			loadProjectList(fc);
//		}
//	});
	var likeHelp = $("#likeId").val();
	var fc = findCondition();
	fc.like = likeHelp;
	loadProjectList(fc);
}
/**
 * 点击每个资源前面的小方块
 * 1.给小方框加上样式
 * 2.获取当前选中的项目个数，改变“删除”的样式，只有的选中了项目，才可以点击“删除”
 */
function projectProClick(){

	if($(this).hasClass(active)){
		$(this).removeClass(active);
		$(this).find('i').removeClass(active);
	}else{
		$(this).addClass(active);
		$(this).find('i').addClass(active);
	}
	var ids = getCheckProject();
	changeDelClass(ids);
}
/**
 * 获取当前选中的所有项目的id
 * @returns {Array}
 */
function getCheckProject(){
	var ids = [];
	var $checkPro = $("div.proList").find("i.active").parents('.right-table-body').prev();
	$checkPro.each(function(){
		ids.push($(this).val());
	});
	return ids;
}
/**
 * 改变“删除”样式
 * @param ids
 */
function changeDelClass(ids){

	if(ids.length == 0){
		$("button.proDelete").addClass("default");
	}else{
		$("button.proDelete").removeClass("default");
	}
}
/**
 * 点击删除
 */
function deleteClick(){
	var ids = [];
	ids = getCheckProject();
	if(ids != 0){
		$("#pupDelete").modal('show');
	}
}
/**
 * 确定删除
 */
function sureDelete(){
	var ids = [];
	ids = getCheckProject();
	$.ajax({
		url:projectRecycleUrl,
		traditional: true,
		data:{"ids":ids},
		type:"post",
		dataType:"json",
//		complete: onComplete,
		success:function(result){

            //登录信息失效，ajax请求静态页面拦截
            onComplete(result);

			if(successReturn == result.status){
				$("#tipMsg").addClass(active).html(result.msg).show();
				function tipHide(){
					$("#tipMsg").hide();
				}
	            setTimeout(tipHide,2000);
				$("#pupDelete").modal('hide');
				var fc = findCondition();
				var startNum = $("[data-bind='firstData']").html();
				var endNum = $("[data-bind='lastData']").html();
				var currentPage = $("#pageInput").html();
				if((endNum-startNum+1)>=ids.length){
					currentPage = currentPage-1;
					if(currentPage<1){
						currentPage = 1;
					}
				}
				fc.page = currentPage;
				loadProjectList(fc);
			}else if(failReturn == result.status){
				$("#tipMsg").addClass(active).html(result.msg).show();
				$("#pupDelete").modal('hide');
				var fc = findCondition();
				loadProjectList(fc);
			}
		},
		error:function(XMLHttpRequest){
			error_500(XMLHttpRequest.responseText);
		}
	});
}
/**
 * 跳转到详情页面
 */
function toProjectDetail(){
	var projectId = $(this).prev().val();
	var fc = findCondition();
	var nextUrl = nextUrlDeal(fc,"proSuppliers","like","page","proBuild",
			                     "proPlan0","proPlan1","proPlan2","proPlan3",
			                     "proPlan4","proStatus0","proStatus1","proStatus2");
	window.location.href = projectDetail+"?projectId="+projectId+"&"+nextUrl;
}
/**
 * 初始化页面的查询条件
 */
function initFindCondition(){
	var fc = preLoadData("proSuppliers","like","page","proBuild",
            "proPlan0","proPlan1","proPlan2","proPlan3",
            "proPlan4","proStatus0","proStatus1","proStatus2");
	$("i.active").removeClass(active);
	var proPlan0 = fc.proPlan0;
	if(1 == proPlan0){
		$("i.proPlan0").addClass(active);
	}
	var proPlan1 = fc.proPlan1;
	if(1 == proPlan1){
		$("i.proPlan1").addClass(active);
	}var proPlan2 = fc.proPlan2;
	if(1 == proPlan2){
		$("i.proPlan2").addClass(active);
	}var proPlan3 = fc.proPlan3;
	if(1 == proPlan3){
		$("i.proPlan3").addClass(active);
	}var proPlan4 = fc.proPlan4;
	if(1 == proPlan4){
		$("i.proPlan4").addClass(active);
	}
	var proStatus0 = fc.proStatus0;
	if(42 == proStatus0){
		$("i.proStatus0").addClass(active);
	}
	var proStatus1 = fc.proStatus1;
	if(43 == proStatus1){
		$("i.proStatus1").addClass(active);
	}
	var proStatus2 = fc.proStatus2;
	if(44 == proStatus2){
		$("i.proStatus2").addClass(active);
	}
	$('select.proSuppliers').selectpicker('val',fc.proSuppliers);
	$('select.proBuild').selectpicker('val',fc.proBuild);
	$('select.proBuild').selectpicker("refresh");
	$('select.proSuppliers').selectpicker("refresh");
	if(0 == fc.like){
		$("#likeId").val("");
	}else{
		$("#likeId").val(fc.like);
	}

}

/**
 * jquery
 */
$(function(){
	getHistory();
	//解析url，看是不是从详情页面跳回来的
	var flag = getUrlParamSpecial("x");
	if(0 == flag){

		//项目建设时期数据
		loadProStatus();
		var fc = preLoadData("proSuppliers","like","page","proBuild",
			                 "proPlan0","proPlan1","proPlan2","proPlan3",
			                 "proPlan4","proStatus0","proStatus1","proStatus2");
		//初始化页面的查询条件
		loadSuppliers(true,initFindCondition);
		loadPageEachNum(function(){
			loadProjectList(fc);
		});
	}else{
		//先加载供应商的信息
		loadSuppliers(false);
		//项目建设时期数据
		loadProStatus();
		var fc = findCondition();
		loadPageEachNum(function(){
			loadProjectList(fc);
		});
	}
	$("span.navlist-img5").addClass(active);
	//点击跳转到新增页面
	$("button.projectAdd").click(function(){
		window.location.href = projectAdd;
	});
	//双击跳转到详情页面
	$("div.proList").on("dblclick","ul",toProjectDetail);
	//选择供应商或者项目建设期，进行刷选
	$("select.proSuppliers,select.proBuild").change(loadProBySupPlan);
	//点击项目金额或者状态进行筛选
  // $("ul.left-wrap2").on("click","li.left-item-check i",loadProByMoSta);
	$("ul.left-wrap2").on("click","li.left-item-check",loadProByMoSta);
	//点击“清空查询条件”
	$("p.left-wrap-clear").click(loadProAll);
	//点击下一页
	$("#nextPageId,#nextPageHelp").click(nextPageClick);
	//点击上一页
	$("#prePageId,#prePageHelp").click(prePageClick);
	//点击跳到某一页
	$("#goPageId").click(goPageClick);
//	likeClick();
	$("i.likeClass").click(likeClick);
	//点击每个项目前面的小框
	$("div.proList").on("click",".table-col1",projectProClick);
	//点击删除按钮
	$("button.proDelete").click(deleteClick);
	//删除取消
	$("button.btn-cancel").click(function(){
		$("#pupDelete").modal('hide');
	});
	//确定删除
	$("button.btn-delete").click(sureDelete);
});
