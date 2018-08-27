var successReturn = 1;
var projectDetail = "projectDetail.html";
var projectEdit = "newProject.html";
var projectList = "projectList.html";
var supplierHtml = "supplierDetail.html";
var contractType = 28;//28表示服务合同，其他的都是供应商合同
var numEachPage;
var startHistoryItem = 0; //记录请求历史信息时的起始位置
var numbersHistoryItem = 8;  //记录请求历史信息的条数;
/**
 * 加载每页显示多少条数据
 */
function loadPageEachNum(){
	$.ajax({
		url:loadPageEachNumPCUrl,
		type:"get",
		data:{},
		dataType:"json",
		success:function(result){
			//登录信息失效，ajax请求静态页面拦截
            onComplete(result);
            numEachPage = result.data;
		},
		error:function(XMLHttpRequest){
			error_500(XMLHttpRequest.responseText);
		}
	});
}
/**
 * 查找项目详情
 * @param projectId 项目id
 * @param proContractId  绑定项目合同信息的id
 * @param resourceDetailId 绑定项目详情信息的id
 */
function loadProjectDetail(projectId,resourceDetailId,proContractId){

	$.ajax({
		url:projectDetailUrl,
		type:"get",
		data:{"projectId":projectId},
		dataType:"json",
//		complete: onComplete,
		success:function(result){

            //登录信息失效，ajax请求静态页面拦截
            onComplete(result);

			if(successReturn == result.status){
			    var project = result.data.project;
				var contract = result.data.contract;
				var projectFile= result.data.fileCount;
				//文件下载
				if(null != projectFile){
					var fileInfo = result.data.filePath;
					var filePathHref={
							fileDownLoad:{
								href:function(){
									return this.filePath;
							}
						}
					}
					$("div.proFile").render(fileInfo,filePathHref);
				}
				$("[data-bind='proFileCount']").html(projectFile);
				$("#"+resourceDetailId).render(project);
				$("#"+proContractId).render(contract);

				setHistory(result.data.project.project_name);
				getHistory();
				
				//是否删除附件信息
				rowWrapDelete($('.modal-body-bottom-row'),$('.rowWrapDelete'),$('#projectDelete'),$('.projectDetail'),$("[data-bind='filePath']"));
			}
		},
		error:function(XMLHttpRequest){
			error_500(XMLHttpRequest.responseText);
		}
	});
}
/**
 * 切换 “合同”-->“详情”,详情数据默认已经加载
 */
function detailClick(){
	$("li.container-left-item2,li.container-left-item3").removeClass("active");
	$("div.conAsset,div.historyInfo").addClass("dn");
	$("li.container-left-item1").addClass("active");
	$("div.projectDetail").removeClass("dn");
	setLeftHeight();
}
/**
 * 切换  “详情”-->“合同” ,并加载合同数据
 */
function contractClick(){
	$("li.container-left-item1,li.container-left-item3").removeClass("active");
	$("div.projectDetail,div.historyInfo").addClass("dn");
	$("li.container-left-item2").addClass("active");
	$("div.conAsset").removeClass("dn");
	loadProContract(1);
	setLeftHeight();
}
/**
 * 切换 "历史"
 */
function historyClick(){
	$("li.container-left-item1,li.container-left-item2").removeClass("active");
	$("div.projectDetail,div.conAsset").addClass("dn");
	$("li.container-left-item3").addClass("active");
	$("div.historyInfo").removeClass("dn");
}
/**
 * 加载项目的合同数据
 */
function loadProContract(page){
	var projectId = getUrlParam("projectId");
	$.ajax({
		url:loadProContractUrl,
		data:{"projectId":projectId,"page":page},
		type:"get",
		dateType:"json",
//		complete: onComplete,
		success:function(result){

            //登录信息失效，ajax请求静态页面拦截
            onComplete(result);

			if(1 == result.status){
				var contract = result.data;
				var conHasNoData = $("div.conHasNoData");
				var conHasData = $("div.conHasData");
				var pageMsgId = $("#pageMsgId");
				var title=$('.conAsset .conAsset-body-title');
				if(contract.length == 0){
					conHasNoData.show();//显示数据的地方
					$('.takePlace').removeClass('dn');
					
					conHasData.hide();//显示数据的地方
					title.hide();
					pageMsgId.hide();//分页的地方
				}else{
					pageMsgId.show();
					conHasNoData.hide();
					$('.takePlace').addClass('dn');
					conHasData.show();
					title.show();
					proConBoxInit();
					var dataBand = "div.conHasData";
					var pageBand = "#pageMsgId";
					bandContractData(contract,dataBand,pageBand,page);
				}
			}
			
		},
		error:function(XMLHttpRequest){
			error_500(XMLHttpRequest.responseText);
		}
	});
}

/**
 * 项目合同，下一页
 */
function nextPageProCon(){

	var currentPage = $("#currentPageId").val();
	var totalPage = $("#totalPageId").val();
	if(totalPage - currentPage > 0){
		currentPage++;
		loadProContract(currentPage);
	}
}

/**
 * 项目合同，上一页
 */
function prePageProCon(){
	var currentPage = $("#currentPageId").val();
	if(currentPage - 1 > 0){
		currentPage--;
		loadProContract(currentPage);
	}
}
/**
 * 点击删除，删除成功后暂时跳转到项目列表页面上
 */
function projectDelClick(){
	var projectId = getUrlParam("projectId");
	$("#pupDelete").modal('show');
	$("button.btn-delete").click(function(){
		$.ajax({
			url:projectRecycleUrl,
			traditional: true,
			data:{"ids":projectId},
			type:"post",
			dataType:"json",
//			complete: onComplete,
			success:function(result){

                //登录信息失效，ajax请求静态页面拦截
                onComplete(result);

				if(successReturn == result.status){
					$("#pupDelete").modal('hide');
					window.location.href = projectList;
				}else if(failReturn == result.status){
					$("#pupDelete").modal('hide');
				}
			},
			error:function(XMLHttpRequest){
				error_500(XMLHttpRequest.responseText);
			}
		});
	});
}

/**
 * 点击查看中标商
 */
function projectSuppliers(){
	var suppliersId = $("[data-bind='resource_sale_id']").val();
	window.location.href = supplierHtml+"?suppliersId="+suppliersId;
}

/**
 * 点击(合同厂商名称)查看供应商或者服务商详情
 */
function projectEnterpriseDetail(){

	var enterType = $(this).next().val();
	var enterId = $(this).next().next().val();
	if(contractType == enterType){
		//跳转到服务商详情页
	}else{
		//跳转到供应商详情页
		window.location.href = supplierHtml+"?suppliersId="+enterId;
	}
}

/**
 * 点击上方“关联合同”
 */
function loadContractNoPro(fcc){

	$("#relateAsset").modal('show');
	$.ajax({

		url:loadContractNoProUrl,
		data:{"like":fcc.like,"page":fcc.page},
		type:"post",
		dataType:"json",
//		complete: onComplete,
		success:function(result){

            //登录信息失效，ajax请求静态页面拦截
            onComplete(result);

			if(successReturn == result.status){
				var contract = result.data;
				//绑定数据
				var hasNoData = $("div.hasNoData");
				var hasData = $("div.hasData");
				var pageInfo = $("p.modal-body-up-page");
				if(contract.length != 0){
					//pageInfo.show();
					hasData.show();
					hasNoData.hide();
					proConBoxInit();
					var dataBnad = "div.hasData";
					var pageBnad = "p.modal-body-up-page";
					bandContractData(contract,dataBnad,pageBnad,fcc.page);
				}else{
					//pageInfo.hide();
					hasData.hide();
					hasNoData.show();
				}

			}
		},
		error:function(XMLHttpRequest){
			error_500(XMLHttpRequest.responseText);
		}
	});
}

/**
 * 绑定合同数据
 * @param contract  返回的合同实体类
 * @param dataBnad  绑定合同数据div
 * @param pageBnad  绑定合同分页数据div
 * @param currentPageH 当前页数
 */
function bandContractData(contract,dataBnad,pageBnad,currentPageH){

	$(dataBnad).render(contract);
	setLeftHeight();
	var totalNum = contract[0].totalNum;
	var totalPage = contract[0].totalPage;
    var currentPage = currentPageH;
    var firstData = (currentPage-1)*(numEachPage)+1;
    var lastData;
    if(contract.length - numEachPage == 0){
        lastData = firstData-1 + numEachPage;
    }else{
        lastData = firstData-1 + (contract.length)%(numEachPage);
    }
    //分页的数据
    var pageMsg = {"currentPage":currentPage,
    		       "totalNum":totalNum,
    		       "firstData":firstData,
    		       "lastData":lastData,
    		       "totalPage":totalPage
                  };
    var dePage={
    		//关联项目到合同
    		preConPage2:{
    			class:function(){
    				if(currentPage - 1 == 0){
    					return "di up-page-left";
    				}else{
    					return "di up-page-left active";
    				}
    			}
    		},
    		nextConPage2:{
    			class:function(){
    				if(totalPage - 1 == 0 || totalPage-currentPage == 0){
    					return "di up-page-right";
    				}else{
    					return "di up-page-right active";
    				}
    			}
    		},
    		//已经关联合同
    		preProContract:{
    			class:function(){
    				if(currentPage - 1 == 0){
    					return "conAsset-left conAsset-img";
    				}else{
    					return "conAsset-left conAsset-img active";
    				}
    			}
    		},
    		nextProContract:{
    			class:function(){
    				if(totalPage - 1 == 0 || totalPage-currentPage == 0){
    					return "conAsset-right conAsset-img";
    				}else{
    					return "conAsset-right conAsset-img active";
    				}
    			}
    		}
    }
    $(pageBnad).render(pageMsg,dePage);

}
/**
 * 合同弹框
 * 查找合同弹框的查询条件
 * @returns {___anonymous5616_5618}
 */
function findConditionCon(){

	var fcc = new Object();
	var pageH = "";
	if("" == pageH){
		fcc.page = 1;
	}else{
		fcc.page = pageH;
	}
	var likeH = $("#likeId").val();
	fcc.like = likeH;
	return fcc;
}
/**
 * 合同弹框，下一页
 */
function nextPage(){

	var currentPage = $("#currentPageId2").val();
	var totalPage = $("#totalPageId2").val();
	if(totalPage - currentPage > 0){
		currentPage++;
		var fcc = findConditionCon();
		fcc.page = currentPage;
		loadContractNoPro(fcc);
	}
}
/**
 * 合同弹框，上一页
 */
function prePage(){
	var currentPage = $("#currentPageId2").val();
	if(currentPage - 1 > 0){
		currentPage--;
		var fcc = findConditionCon();
		fcc.page = currentPage;
		loadContractNoPro(fcc);
	}
}

/**
 * 合同弹框，模糊检索
 */
function likeClick(){

//	$("#likeId").keydown(function(e){
//		var currKey = 0;e = e||event;
//      currKey = e.keyCode||e.which||e.charCode;
//		if(currKey == 13){
//			var likeHelp = $(this).val();
//			var fcc = findConditionCon();
//			fcc.like = likeHelp;
//			loadContractNoPro(fcc);
//		}
//	});
	var likeHelp = $(this).prev().val();
	var fcc = findConditionCon();
	fcc.like = likeHelp;
	loadContractNoPro(fcc);
}
/**
 * 点击”关联合同“
 */
function contractProClick(){
	var fcc = findConditionCon();
	loadContractNoPro(fcc);
}
/**----------以上是合同弹框------以下是项目合同-----------------------------------------
 * 点击项目合同中，每个合同前面的小框,给小框加选中样式
 */
function proConBoxClick(){
	if($(this).find('i').hasClass("active")){
		$(this).find('i').removeClass("active");
	}else{
		$(this).find('i').addClass("active");
	}
}
/**
 * 项目合同，清除方框前面的对勾样式
 */
function proConBoxInit(){
	$("i.active").removeClass("active");
}
/**
 * 项目合同，获取当前被选中的合同
 * @param divData 获取哪个div的合同ids
 */
function getChoseContract(divData){

	var ids = [];
	var $checkPro = $(divData).find("i.active").next();
	$checkPro.each(function(){
		ids.push($(this).val());
	});
	return ids;
}
/**
 * 点击项目合同中的删除，解除和该项目的关系
 */
function proContractDelClick(){

	var projectId = getUrlParam("projectId");
	var divData = "div.conHasData";
	var ids = getChoseContract(divData);
	if(ids.length >0){
		$("#pupDelete2").modal('show');
		$("#deleteCon").click(function(){
			$.ajax({
				url:deleteProConUrl,
				data:{"ids":ids,"projectId":projectId},
				traditional: true,
				type:"get",
				dataType:"json",
//				complete: onComplete,
				success:function(result){

                    //登录信息失效，ajax请求静态页面拦截
                    onComplete(result);

					if(successReturn == result.status){
						$("#tipMsg").addClass("active").html(result.msg).show();
						function tipHide(){
							$("#tipMsg").hide();
						}
			            setTimeout(tipHide,2000);
						$("#pupDelete2").modal('hide');
						var currentPage = $("#currentPageId").val();//当前页数
						var startNum = $("[data-bind='firstData']").html();//当前页数第一条数据
						var endNum = $("[data-bind='lastData']").html();//当前页数最后一条数据
						//说明。如果把最后一页的三条数据全删了，则查看倒数第二页的数据
						if((endNum-startNum+1)>=ids.length ){
							currentPage = currentPage - 1;
							if(currentPage <1){
								currentPage = 1;
							}
						}
						loadProContract(currentPage);
						//绑定项目的详情信息
						var resourceDetailId = "projectDetailId";
						var proContractId = "proContractId";
						loadProjectDetail(projectId,resourceDetailId,proContractId);
					}else{
						alert(result.msg);
					}
				},
				error:function(XMLHttpRequest){
					error_500(XMLHttpRequest.responseText);
				}
			});
		});
	}
}
/**
 * 点击合同弹框中的保存，使项目与所选合同进行关联
 */
function proContractClick(){
	var projectId = getUrlParam("projectId");
	var divData = "div.hasData";
	var ids = getChoseContract(divData);
	if(ids.length>0){
		//发送请求，关联合同
		$.ajax({
			url:linkProConUrl,
			data:{"ids":ids,"projectId":projectId},
			traditional: true,
			type:"get",
			dataType:"json",
//			complete: onComplete,
			success:function(result){

                //登录信息失效，ajax请求静态页面拦截
                onComplete(result);

				$("#relateAsset").modal('hide');
				if(successReturn == result.status){

					$("#tipMsg").addClass("active").html(result.msg).show();
					function tipHide(){
						$("#tipMsg").hide();
					}
		            setTimeout(tipHide,2000);
					var currentPage = $("#currentPageId").val();
					if("" == currentPage){
						currentPage = 1;
					}
					//绑定合同数据
					loadProContract(currentPage);
					//绑定项目的详情信息
					var resourceDetailId = "projectDetailId";
					var proContractId = "proContractId";
					loadProjectDetail(projectId,resourceDetailId,proContractId);

					//更新历史信息
					projectHistoryClick(projectHistoryDeal,0)
				}else{
					alert(result.msg);
				}
			},
			error:function(XMLHttpRequest){
				error_500(XMLHttpRequest.responseText);
			}
		});
	}
}

/**
 * 上下页跳转操作
 * */
function conAddUpOrNextPage(){

    var upConPage = document.getElementById("preProContract");
    var nextConPage = document.getElementById("nextProContract");

    /**
     * 点击上一页操作
     * */
    if(null != upConPage){
        upConPage.onclick = function () {

            //从页面获取当前页数
            var currPage_add = $("#currentPageId").val();
            if(currPage_add - 1 == 0){
                $("#tipMsg").addClass("active").html("第一页").show();
                function hideMsg(){
                    $("#tipMsg").addClass("active").html("第一页").hide()
                }
                setTimeout(hideMsg,1500);
            }else{
                currPage_add--;
                loadProContract(currPage_add);
            }
        }
    }
    /**
     * 点击下一页操作
     * */
    if(null != nextConPage){
        nextConPage.onclick = function () {

            //从页面获取当前页面和总页数
            var currPage_add = $("#currentPageId").val();
            var totalPage_add = $("#totalPageId").val();
            if(totalPage_add - currPage_add == 0 || totalPage_add - 1 == 0){
                $("#tipMsg").addClass("active").html("最后一页").show();
                function hideMsg(){
                    $("#tipMsg").addClass("active").html("最后一页").hide()
                }
                setTimeout(hideMsg,1500);
            }else{
                currPage_add++;
                loadProContract(currPage_add);
            }
        }
    }
}

/**
 * 点击附件的超链接
 */
function proFileClick(){
	var count = $("[data-bind='proFileCount']").text();
	if(null != count && count>0){
		$("#accessory").modal("show");
	}
}
function backWard(){
	var flag = getUrlParam("x");
	//表示从列表页上进来的详情页
	if(0 == flag){
		//组织url
		var fc = preLoadData("proSuppliers","like","page","proBuild",
			                 "proPlan0","proPlan1","proPlan2","proPlan3",
			                 "proPlan4","proStatus0","proStatus1","proStatus2");
		var back = nextUrlDeal(fc,"proSuppliers","like","page","proBuild",
			                      "proPlan0","proPlan1","proPlan2","proPlan3",
			                      "proPlan4","proStatus0","proStatus1","proStatus2");
		window.location.href = projectList+"?"+back;
	}else{
		//不是从列表页进来的
		window.history.back();
	}

}
function setLeftHeight(){
	$('.conright-infoWrap-right').css('height',$('.conright-infoWrap-left').outerHeight(true)+'px');
	$('#container-left').css('height',$('#container-right').outerHeight(true)+20+'px');
}

/**
 * 点击历史
 */
function projectHistoryClick(projectHistoryDeal,arrowType){
    // arrow代表值  0:置顶; 1:下一条; -1:上一条
    if (arrowType == 0) {
      startHistoryItem = 0;
    }else {
      startHistoryItem = startHistoryItem + arrowType;
    }
    if (startHistoryItem < 0) {
      startHistoryItem = 0;
    }

		var projectId = getUrlParam("projectId");
    $.ajax({
      url: getHistoricalInfoUrl,
      type: 'get',
      data: {
        'type':96,
        'type_id': projectId,
        'numbers':numbersHistoryItem,
        'start': startHistoryItem
      },
      dataType: 'json',
      success: function(result){
        // 登录信息失效，ajax请求静态页面拦截
        onComplete(result);

        if(1 == result.status){
          // 给[上一条]定权限
          if (startHistoryItem > 0) {
            $(".conHistory-content-right-top").addClass("active");
          }else {
            $(".conHistory-content-right-top").removeClass("active");
          }
          // 给[下一条]定权限
          if (result.data.length < numbersHistoryItem) {
            $(".conHistory-content-right-bottom").removeClass("active");
          }else {
            $(".conHistory-content-right-bottom").addClass("active");
          }

          projectHistoryDeal(result);
        }else{
          $(".conHistory-content").addClass("dn");
        }
      },
      error:function(XMLHttpRequest){
  			error_500(XMLHttpRequest.responseText);
  		}
    });
}
/**
 * 往页面上绑定数据--历史
 */
 function projectHistoryDeal(result){
   var data=[];  //定义写入的数据
   $.each(result.data, function(i,value){
     var time = calcTime3(result.data[i].operation_time);
     data.push({
       action: result.data[i].action,
       name: result.data[i].name,
       number: result.data[i].number,
       status_name:result.data[i].status_name,
       oper_user_name: result.data[i].oper_user_name,
       calc_time1: time.year+"-"+time.month,
       calc_time2: time.date+"日 "+time.hour+":"+time.minute,
     });
   });

   //去掉重复的日期
   var evaluate = data[0].calc_time1;  //设置 去重的比较值
   for(var i=1; i<data.length; i++){
     if (evaluate == data[i].calc_time1) {
       data[i].calc_time1 = "";
     }else {
       evaluate = data[i].calc_time1;
     }
   }
   $(".conHistory-content-dataBind").render(data);
  //  计算历史记录中时间轴的竖线
   var start = $(".conHistory-content-right:first").find(".history-point i")[0].getBoundingClientRect().bottom;
   var end = $(".conHistory-content-right:last").find(".history-point i")[0].getBoundingClientRect().top;
   $(".conHistory-content-right:first").find(".history-point>div").css('height',(end-start));

	 setLeftHeight();
 }

 /*计算时间函数,历史记录用*/
 function calcTime3(operationTime){
   var time = new Date(operationTime);
   var year = time.getFullYear();  //年
   var month = time.getMonth();  //月
   if (month < 10) {
     month = "0" + month;
   }
   var date = time.getDate();  //日
   if (date < 10) {
     date = "0" + date;
   }
   var hour = time.getHours();  //小时
   var minute = time.getMinutes();  //分钟
   if (minute < 10) {
     minute = "0" + minute;
   }
   return {"year": year,"month": month,"date": date,"hour": hour,"minute": minute};
 }

/**
  *jquery
 */
$(function(){
	setLeftHeight();
	$("span.navlist-img5").addClass("active");
	//跳转过来时，带的参数，项目id
	var projectId = getUrlParam("projectId");
	//绑定项目的详情信息
	var resourceDetailId = "projectDetailId";
	var proContractId = "proContractId";
	loadProjectDetail(projectId,resourceDetailId,proContractId);
	loadPageEachNum();
	//点击编辑，跳转到项目修改页面上
	$("#projectEdit").click(function(){
		window.location.href = projectEdit+"?projectId="+projectId;
	});
	//点击左侧“属性”
	$("li.container-left-item1").click(detailClick);
	//点击左侧“合同”
	$("li.container-left-item2").click(contractClick);
	//点击左侧“历史”
	$("li.container-left-item3").click(historyClick);
	//点击上方“删除”
	$("#projectDel").click(projectDelClick);
	//点击上方查看中标商
	$("#proSuppliers").click(projectSuppliers);
	//点击合同厂商的超链接
	$("#proContractId").on("click","[data-bind='enterprise_name']",projectEnterpriseDetail);
	//点击附件超链接
	$("[data-bind='proFileCount']").click(proFileClick);
	//点击关联合同
	$("#proToContract,#conAsset-add,.addButton").click(contractProClick);
	//点击项目-合同 上一页下一页
	conAddUpOrNextPage();
	//点击合同弹框中的上/下一页
	$("[data-bind='nextConPage2']").click(nextPage);
	$("[data-bind='preConPage2']").click(prePage);
	//点击合同弹框中的，每个合同前面的小框
	$("div.hasData").on("click",".modal-body-bottom-rowItem1",proConBoxClick);
	//点击合同弹框中的保存，使该项目与所选合同进行关联
	$("button.btn-keep").click(proContractClick);
//	//点击项目合同中的上/下一页
//	$("[data-bind='preProContract']").click(prePageProCon);
//	$("[data-bind='nextProContract']").click(nextPageProCon);
	//点击项目合同中，每个合同前面的小框(需求：修改点击列表第一列则点击复选框)
	$("div.conHasData").on("click","li.conAsset-data-itemCol1",proConBoxClick);
	//$("div.conHasData").on("click","i.proContractBox",proConBoxClick);
	// 点击项目合同中的删除，解除和该项目的关系
	$("#conAsset-delete").click(proContractDelClick);
	$('#relateAsset #addResSearch').click(likeClick);
	//点击 < 返回上一页
	$("span.container-right-title-back").click(backWard);
	//点击历史(左侧) && 置顶历史信息
	$(".container-left-item3,.conHistory-content-toTop").on("click",function(){projectHistoryClick(projectHistoryDeal,0)});
	// 点击历史-前一条
	$(".conHistory-content-right-top.active").on("click",function(){
		if ($(this).hasClass("active")) {
			projectHistoryClick(projectHistoryDeal,-1)
		}

	});
	// 点击历史-后一条
	$(".conHistory-content-right-bottom.active").on("click",function(){
		if ($(this).hasClass("active")) {
			projectHistoryClick(projectHistoryDeal,1)
		}
	});
});
//获取url中的参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}
