//下拉选的数据
var eType,eCreateTime,eStatus,eCompare,eDealStatus;
var dieType,dieCreateTime,dieStatus,dieCompare,dieDealStatus;
var successReturn = 1//请求成功
var failReturn = 2;//请求失败
var eventAddHtml = "eventAdd.html";
var eventDetailHtml = "eventDetail.html";
var pageEachNumCommon;//每页显示多少条数据
//事件类型
eType = [
         {
        	 value:0,
        	 eType:"--请选择--"
         },
         {
        	 value:49,
        	 eType:"突发故障",
         },
         {
        	 value:50,
        	 eType:"服务支持"
         },
         {
        	 value:51,
        	 eType:"系统巡检"
         }
         ];
dieType = {
		eType:{
			value:function(){
				return this.value;
			}
		}
}
//创建时间
eCreateTime = [
               {
            	 value:0,
            	 eCreateTime:"--请选择--"
               },
               {
            	   value:3,
            	   eCreateTime:"今天"
               },
               {
            	   value:4,
            	   eCreateTime:"最近24小时",
               },
               {
            	   value:5,
            	   eCreateTime:"本周"
               },
               {
            	   value:6,
            	   eCreateTime:"本月"
               },
               {
            	   value:7,
            	   eCreateTime:"最近30天",
               },
               {
            	   value:8,
            	   eCreateTime:"自定义"
               }
               ];
dieCreateTime = {
		eCreateTime:{
			value:function(){
				return this.value;
			}
		}
}
//事件状态
eStatus = [
           {
        	   value:52,
        	   eStatus:"处理中"
           },
           {
        	   value:54,
        	   eStatus:"待接单"
           },
           {
        	   value:55,
        	   eStatus:"工单处理中"
           },
           {
        	   value:56,
        	   eStatus:"工单内审中"
           },
           {
        	   value:57,
        	   eStatus:"事件终审中"
           },
           {
        	   value:58,
        	   eStatus:"已关闭"
           }
           ];
dieStatus = {
		eStatus:{
			value:function(){
				return this.value;
			}
		}
}
//排序规则
eCompare = [
            {
            	value:"data_per.create_date",
            	eCompare:"创建日期"
            },
            {
            	value:"data_per.resolution_time",
            	eCompare:"到期日期",
            },
            {
            	value:"data_per.events_status",
            	eCompare:"状态"
            },
            {
            	value:"data_per.priority_id",
            	eCompare:"优先级"
            },
            {
            	value:"data_per.urgency_id",
            	eCompare:"紧急程度"
            }
            ];
dieCompare = {
		eCompare:{
			value:function(){
				return this.value;
			}
		}
}
eDealStatus = [
               {
            	   value:0,
            	   eDealStatus:"--请选择--"
               },
               {
            	   value:59,
            	   eDealStatus:"未解决"
               },
               {
            	   value:60,
            	   eDealStatus:"已解决"
               },
               {
            	   value:61,
            	   eDealStatus:"不予处理"
               },
               {
            	   value:62,
            	   eDealStatus:"已合并处理"
               },
               ];
dieDealStatus = {
		eDealStatus:{
			value:function(){
				return this.value;
			}
		}
};
var personType=[
                {
                	value:0,
                    likeFindType:"--请选择--"
                },
                {
                	value:9,
                    likeFindType:"请求人"
                },
                {
                	value:10,
                    likeFindType:"管理人"
                },
                {
                	value:11,
                    likeFindType:"事件名称"
                },
                {
                	value:12,
                    likeFindType:"执行人"
                }
                ];
dipersonType = {
		likeFindType:{
			value:function(){
				return this.value;
			}
		}
	}
/**
 * 加载事件类型、状态、创建时间下拉选的数据
 */
function loadEventCondition(){
	$("select.eType").render(eType,dieType);//事件类型
	$("select.eStatus").render(eStatus,dieStatus);//事件状态
	$("select.eCreateTime").render(eCreateTime,dieCreateTime);//创建时间
	$("select.eCompare").render(eCompare,dieCompare);//排序条件
	$("select.eDealStatus").render(eDealStatus,dieDealStatus);//事件的处理状态
	$("select.likeFind").render(personType,dipersonType);//事件的查找条件
	$("select.ejs").selectpicker("val",0);
	$("select.ejs").selectpicker("refresh");
}
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
            pageEachNumCommon = result.data;
            callBackFun();
		},
		error:function(XMLHttpRequest){
			error_500(XMLHttpRequest.responseText);
		}
	});
}
/**
 * 加载事件列表
 * @param fc 查询条件对象
 * 	  eOverAll  全局变量，三个，0.与我有关的。2.我关注的。1.部门所有的
	  eType  事件类型
	  eCreateTime  事件创建时间
	  eStatus  事件状态
	  eAsker  事件请求人
	  eManager  事件管理人
	  ePriority0  事件优先级   1表示该项选中，0表示未选中
	  eUrgent0 事件紧急程度  1表示该项选中，0表示未选中
	  compare  排序规则
	  sort  升序降序
	  page  页数
	  like  模糊检索
	  startTime  自定义时间的开始时间
	  endTime  自定义时间的结束时间
	  eTimeOut  逾期
 */
//加载事件列表
function loadEventList(fc){

	$.ajax({
		url:eventShowListUrl,
		type:"post",
		data:{"eOverAll":fc.eOverAll,"eType":fc.eType,"eCreateTime":fc.eCreateTime,
			  eStatus:fc.eStatus,"eAsker":fc.eAsker,"eManager":fc.eManager,
			  "ePriority0":fc.ePriority0,"ePriority1":fc.ePriority1,"ePriority2":fc.ePriority2,
			  "eUrgent0":fc.eUrgent0,"eUrgent1":fc.eUrgent1,"eUrgent2":fc.eUrgent2,
			  "eCompare":fc.eCompare, "sort":fc.sort,"page":fc.page,
			  "like":fc.like,"startTime":fc.startTime,"endTime":fc.endTime,"eTimeOut":fc.eTimeOut},
		dataType:"json",
		success:function(result){
			
            //登录信息失效，ajax请求静态页面拦截
            onComplete(result);

			initClass();//清除样式
			if(successReturn == result.status){
				var eventNoData = $("div.eventNoData");
				var eventData = $("div.eventList");
				var pageInfo1 = $("p.right-con-title-page");
				var pageInfo2 = $("div.pageChange");
				eventNoData.addClass('dn');
				eventData.hide();
				pageInfo1.hide();
				pageInfo2.hide();
				var eList = result.data;
				if(null != eList && eList.length == 0){
					eventNoData.removeClass('dn');
				}else if(null != eList){
					eventData.show();
					pageInfo1.show();
					pageInfo2.show();
					var eOtherInfo = {
							//绑定事件的时间信息
							eventTimeInfo:{
								html:function(){
									var timeInfo = "";
									if(null != this.create_date){
										timeInfo += "创建于:"+this.create_date+"&nbsp;&nbsp;&nbsp;&nbsp;";
									}
									if(null != this.order_time){
										timeInfo += "响应于:"+this.order_time+"&nbsp;&nbsp;&nbsp;&nbsp;";
									}
									if(null != this.close_time){
										timeInfo += "关闭于:"+this.close_time+"&nbsp;&nbsp;&nbsp;&nbsp;";
									}
									var responseTime = this.responseTime;//响应逾期
									var resolveTime = this.resolveTime;//解决逾期
									if(null != responseTime && null != resolveTime){
										if(1 == responseTime.flag || 1 == resolveTime.flag){
											var min1 = responseTime.minute;//响应逾期分钟数
											var min2 = resolveTime.minute;//解决逾期分钟数
											if((min1+min2)>=60){
												timeInfo += "逾期:"+(responseTime.hour+resolveTime.hour+1)+"时"
												         +(min1+min2-60)+"分";
											}else{
												timeInfo += "逾期:"+(responseTime.hour+resolveTime.hour)+"时"
												         +(min1+min2)+"分";
											}
										}
									}else if(null != responseTime && null == resolveTime){
										if(1 == responseTime.flag){
											var min1 = responseTime.minute;//响应逾期分钟数
										    timeInfo += "逾期:"+responseTime.hour+"时"
										             +min1+"分";

										}
									}
									return timeInfo;
								}
							},
							events_status_name:{
								text:function(){
									var eStatusName = "";
									switch(this.events_status){
									case 52:eStatusName = "处理中";break;
									case 53:eStatusName = "处理中";break;
									case 54:eStatusName = "待接单";break;
									case 55:eStatusName = "工单处理中";break;
									case 56:eStatusName = "工单内审中";break;
									case 57:eStatusName = "事件终审中";break;
									case 58:eStatusName = "事件终审中";break;
									}
									return eStatusName;
								},
								style:function(){
									var eStatusPosi = "";
									switch(this.events_status){
									case 52:eStatusPosi = "left:-2px";break;
									case 53:eStatusPosi = "left:-2px";break;
									case 54:eStatusPosi = "left:-2px";break;
									case 55:eStatusPosi = "left:-11px";break;
									case 56:eStatusPosi = "left:-11px";break;
									case 57:eStatusPosi = "left:-11px";break;
									case 58:eStatusPosi = "left:-11px";break;
									}
									return eStatusPosi;
								}
							},
							event_status_next:{
								text:function(){
									var eNextStatus = "";
									if(63 == this.publish_status){
										eNextStatus = "已关闭";
									}else{
										switch(this.events_status){
										case 54:eNextStatus = "工单处理中";break;
										case 55:eNextStatus = "工单内审中";break;
										case 56:eNextStatus = "事件终审中";break;
										case 57:eNextStatus = "已关闭";break;
										case 58:eNextStatus = "已关闭";break;
										}
									}
									return eNextStatus;
								},
								style:function(){
									var eStatusPosi = "";
									switch(this.events_status){
									case 54:eStatusPosi = "left:89px";break;
									case 55:eStatusPosi = "left:89px";break;
									case 56:eStatusPosi = "left:89px";break;
									case 57:eStatusPosi = "left:99px";break;
									case 58:eStatusPosi = "left:99px";break;
									}
									return eStatusPosi;
								}
							},
							events_status_bule:{
								class:function(){
									if(53 == this.events_status || 58 == this.events_status){
										return "active";
									}
								}
							},
							timeOut:{
								text:function(){
									//服务商接单之前（响应期内）
									var responseTime = this.responseTime;//响应逾期
									var resolveTime = this.resolveTime;//解决逾期
									if(null != responseTime  && null == resolveTime){
										if(0 == responseTime.flag){
											return "期内";
										}else{
											return "逾期";
										}
									//服务商接单之后	（解决期内+解决期后）
									}else if(null != responseTime && null != resolveTime){
										if(0 == resolveTime.flag && 0 ==resolveTime.flag){
											return "期内";
										}else{
											return "逾期";
										}
									}else if(null == responseTime && null != resolveTime){
										if(0 == resolveTime.flag){
											return "期内";
										}else{
											return "逾期";
										}
									}
								},
								class:function(){
									var responseTime = this.responseTime;//响应逾期
									var resolveTime = this.resolveTime;//解决逾期
//									return "period";
									if(null != responseTime && null == resolveTime){
									    if(0 == responseTime.flag){
											return "period";
										}else{
											return "overdue";
										}
									//服务商接单之后	（解决期内+解决期后）
									}else if(null != responseTime && null != resolveTime){
										if(0 == resolveTime.flag && 0 == resolveTime.flag){
											return "period";
										}else{
											return "overdue";
										}
									}else if(null == responseTime && null != resolveTime){
										 if(0 == resolveTime.flag){
												return "period";
											}else{
												return "overdue";
											}
									}
								}
							},
							//事件左侧宽度条
							leftWidthHelp:{
								style:function(){
									var serviceLevel = this.service_level;
									if(null != serviceLevel){
										switch(serviceLevel){
										case 73:return "width:15px;height:100%;background:#2b55b7;";break;
										case 72:return "width:12px;height:100%;background:#6582ea;";break;
										case 71:return "width:8px;height:100%;background:#68afe3;";break;
										case 70:return "width:4px;height:100%;background:#abdcfd;";break;
										}
									}else{
										return "max-width:10px;height:100%;background:#fff;";
									}
								}
							},
							//部门数据
							structure_name:{
								html:function(){
									if(null != this.structure_name){
										return "&nbsp;&nbsp;("+this.structure_name+")";
									}
								}
							},
							//绑定事件图标
							eventType:{
								class:function(){
									if(this.events_type == 49){
										return "accident";//accident  systemPatrol  support
									}else if(this.events_type == 50){
										return "systemPatrol";
									}else if(this.events_type == 51){
										return "support";
									}
								}
							}
					}
					eventData.render(eList,eOtherInfo);
					//绑定分页数据和分页数据的样式
					 var totalPage = eList[0].PageNum;//总页数
					 var totalNum = eList[0].totalNum;//总条数
				     var currentPage = fc.page;//当前页数
					 var firstData = (currentPage-1)*(pageEachNumCommon)+1;
				     var lastData;
				     if(eList.length - pageEachNumCommon == 0 || null == eList){
				         lastData = firstData-1 + pageEachNumCommon;
				     }else{
				         lastData = firstData-1 + (eList.length)%(pageEachNumCommon);
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
				    					 return "title-page title-page-left";
				    				 }else{
				    					 return "title-page title-page-left active";
				    				 }
				    			 }
				    		 },
				    		 nextPageHelp:{
				    			 class:function(){
				    				 if(totalPage == 1 || totalPage-currentPage == 0){
				    					 return "title-page title-page-right";
				    				 }else{
				    					 return "title-page title-page-right active";
				    				 }
				    			 }
				    		 },
				    		 prePage:{
				    			 class:function(){
				    				 if(currentPage == 1||currentPage==0){
				    					 return "pageChange-span-up";
				    				 }else{
				    					 return "pageChange-span-up active";
				    				 }
				    			 }
				    		 },
				    		 nextPage:{
				    			 class:function(){
				    				 if(totalPage == 1 || totalPage-currentPage == 0){
				    					 return "pageChange-span-down";
				    				 }else{
				    					 return "pageChange-span-down active";
				    				 }
				    			 }
				    		 },
				    		 prevPageDis:{
				    			class:function(){
				    				if(currentPage - 1 == 0 || currentPage == 0){
				    					return "pageChange-span1 pageChange-span di disabled";
				    				}else{
				    					return "pageChange-span1 pageChange-span di";
				    				}
				    			}
    						},
				    		nextPageDis:{
				    			class:function(){
				    				if(totalPage - 1 == 0 || totalPage-currentPage == 0){
				    					return "pageChange-span3 pageChange-span di disabled";
				    				}else{
				    					return "pageChange-span3 pageChange-span di";
				    				}
				    			}
				    		}
				     };
				     pageInfo1.render(pageMsg,pageVal);
				     pageInfo2.render(pageMsg,pageVal);
				}
			}else{
				outBoxClose(result.msg);
			}
		},
		error:function(XMLHttpRequest){
			error_500(XMLHttpRequest.responseText);
		}
	});
}
/**
 * 从页面上获得查询条件
 */
function findCondition(){
	var fc = new Object();
	//三个大条件(类似于全局的搜索条件)：与我有关的，部分相关的，我关注的
	var eMineRelative = $("ul.left-wrap1").hasClass("active");
//	var eMineFavorite = $("ul.left-wrap2").hasClass("active");
	var eMineDepartment = $("ul.left-wrap3").hasClass("active");
	if(eMineRelative){
		fc.eOverAll = 0;
	}else if(eMineDepartment){
		fc.eOverAll = 1;
	}else{
		fc.eOverAll = 0;
	}
	//事件类型、状态、创建时间、排序规则、逾期
	var eType = $("select.eType option:selected").val();
	var eStatus = $("select.eStatus").val();
	var eCreateTime = $("select.eCreateTime option:selected").val();
	var eCompare = $("select.eCompare option:selected").val();
	var eTimeOut = $("#selEventOverdue").val();
	fc.eType = eType;
	fc.eStatus = eStatus;
	fc.eCreateTime = eCreateTime;
	fc.eCompare = eCompare;
	fc.eTimeOut = eTimeOut;
	//事件的优先级和紧急程度
	var ePriority0H = $("i.ePriority0").hasClass("active");
	var ePriority1H = $("i.ePriority1").hasClass("active");
	var ePriority2H = $("i.ePriority2").hasClass("active");
	if(ePriority0H){
		fc.ePriority0 = 1;
	}else{
		fc.ePriority0 = 0;
	}
	if(ePriority1H){
		fc.ePriority1 = 1;
	}else{
		fc.ePriority1 = 0;
	}
	if(ePriority2H){
		fc.ePriority2 = 1;
	}else{
		fc.ePriority2 = 0;
	}
	var eUrgent0H = $("i.eUrgent0").hasClass("active");
	var eUrgent1H = $("i.eUrgent1").hasClass("active");
	var eUrgent2H = $("i.eUrgent2").hasClass("active");
	if(eUrgent0H){
		fc.eUrgent0 = 1;
	}else{
		fc.eUrgent0 = 0;
	}
	if(eUrgent1H){
		fc.eUrgent1 = 1;
	}else{
		fc.eUrgent1 = 0;
	}
	if(eUrgent2H){
		fc.eUrgent2 = 1;
	}else{
		fc.eUrgent2 = 0;
	}
	//请求人
	var eAskH = $("#eAskId").val();
	if("" == eAskH){
		fc.eAsker = 0;
	}else{
		fc.eAsker = eAskH;
	}
	var eManagerH = $("#eManagerId").val();
	if("" == eManagerH){
		fc.eManager = 0
	}else{
		fc.eManager = eManagerH;
	}
	//升序或者降序
	var sortH = $("span.right-con-title-leftSort").hasClass("active");
	if(sortH){
		fc.sort = "ASC";
	}else{
		fc.sort = "DESC";
	}
	//页数
	var pageH = $("[data-bind='currentPage']").html();
	if("" == pageH){
		fc.page = 1;
	}else{
		fc.page = pageH;
	}
	//模糊搜索
	var likeH = $("#like").val();
    fc.like = likeH;
	return fc;
}
/**
 * 清除页面的查询条件
 */
function initCondition(){
	$("#like").val("");//模糊搜索
	var overAll = $("ul.left-wrap1");//全局条件
	overAll.addClass("active");
	overAll.siblings().removeClass("active");
	$("select.ejs").selectpicker("val",0);//几个下拉选
	$("select.ejs").selectpicker("refresh");
	$("#eAsk,#eManager").val("");//请求人、管理人
	$("#eAskId,#eManagerId").val("");
	$("i.active").removeClass("active");//紧急程度、优先级
	$("span.right-con-title-rightSort").addClass("active");
	$("span.right-con-title-rightSort").prev().removeClass("active");
	$("input.pageChange-span4").val("");
	$("span.pageChange-span2").html(1);//第一页
}
/**
 * 清除页面上的样式
 */
function initClass(){
	$("i.eUse").removeClass("active");
	$("button.eUse").addClass("default");
}
/**
 * 点击每个事件前面的小框
 */
function eventBoxClick(){
	if($(this).children().first().hasClass("active")){
		$(this).children().first().removeClass("active");
	}else{
		$(this).children().first().addClass("active");
	}
	var ids = getCheckBox();
	changeOperateClass(ids);
}
/**
 * 获取当前选中的所有事件的id
 * @returns {Array}
 */
function getCheckBox(){
	var ids = [];
	var $checkPro = $("div.eventList").find("i.active.eUse").next();
	$checkPro.each(function(){
		ids.push($(this).val());
	});
	return ids;
}
/**
 * 获取当页所有的id
 * @returns {Array}
 */
function getAllkBox(){
	var ids = [];
	var $checkPro = $("div.eventList").find("i.eUse").next();
	$checkPro.each(function(){
		ids.push($(this).val());
	});
	return ids;
}
/**
 * 改变操作按钮的样式
 * @param ids
 */
function changeOperateClass(ids){

	if(ids.length == 0){
		$("button.eUse").addClass("default");
	}else{
		$("button.eUse").removeClass("default");
	}
}
/**
 * 点击三个大条件中的一个
 */
function eMineClick(){
	if(!$(this).hasClass("active")){
		$(this).addClass("active");
		$(this).siblings().removeClass("active");
	}

	var fc = findCondition();
	loadEventList(fc);
}
/**
 * 点击事件创建时间进行查找
 */
function eFilterClick(){
	var fc = findCondition();
	if(8 == fc.eCreateTime){
		$("#customTime").modal("show");
		$("#customTime input").val("");
		$("button.keep-time").click(function(){
			var startTime = $("[name='startDate']").val();
			var endTime = $("[name='endDate']").val();
			fc.startTime = startTime;
			fc.endTime = endTime;
			if("" == startTime || "" == endTime){
				fc.eCreateTime = 0;
			}
			loadEventList(fc);
			$("#customTime").modal("hide");
		});;
	}else{
		loadEventList(fc);
	}
}
/**
 * 按事件的紧急程度或者优先级进行查找
 */
function eventProUrgentClick(){
  /*bug163 企业-事件列表，项目列表*/
  //获取 i元素（方框）
  var $i = $(this).children("i");
  
  if($i.hasClass("active")){
    $i.removeClass("active");
  }else {
    $i.addClass("active");
  }
  //获取查询条件
	var fc = findCondition();
  //通过ajax加载事件列表
	loadEventList(fc);
}
var testHe;
/**
 * 请求人索搜
 */
function eAskLikeClick(){
	var name=$("#eAsk").val();
	if(testHe === name)
		return;
	testHe = name;
	var newSelect = new selectMenuH("eAsk-tree","eAsk-menu","eAsk","eAskId",
			                        loadAskerUrl,directUse);
	if(null == name || ""==name){
		newSelect.hide();
		$("#eAskId").val("");
		directUse();
	}else{
		newSelect.nSelect('id','parent_id','name',false,name);
		newSelect.show();
	}
}
var testH;
/**
 * 管理人搜索
 */
function eManagerLikeClick(){
	var name = $("#eManager").val();
	if(testH === name)
		return;
	restH = name;
	var newSelect = new selectMenuH("eManager-tree","eManager-menu","eManager",
			                         "eManagerId",loadManagerUrl,directUse);
	if(null == name || ""==name){
		newSelect.hide();
		$("#eManagerId").val("");
		directUse();
	}else{
		newSelect.nSelect('id','parent_id','name',true,name);
		newSelect.show();
	}
}
/**
 * 通过请求人或者管理人查找
 */
function directUse(){
	var fc = findCondition();
	loadEventList(fc);
}
/**
 * 点击升序、降序
 */
function sortClick(){
	if(!$(this).hasClass("active")){
		$(this).addClass("active");
		$(this).siblings().removeClass("active");
		var fc = findCondition();
		loadEventList(fc);
	}
}
/**
 * 点击上一页
 */
function proPageClick(){
	var pageHelp = $("span.pageChange-span2").html();
	if(pageHelp - 0 > 1){
		pageHelp--;
		var fc = findCondition();
		fc.page = pageHelp;
		loadEventList(fc);
	}else{
		 $("#tipMsg").addClass("active").html("第一页").show();
	    function hideMsg(){
	        $("#tipMsg").addClass("active").html("第一页").hide()
	    }
	    setTimeout(hideMsg,1500);
	}
}
/**
 * 点击下一页
 */
function nextPageClick(){
	//点击下一页
	var pageHelp = $("span.pageChange-span2").html();
	var totalPage = $("#totalPageId").val();
	//判断当前页数与总页数大小
	if(totalPage - pageHelp > 0){
		pageHelp++;
		var fc = findCondition();
		fc.page = pageHelp;
		loadEventList(fc);
	}else{
		 $("#tipMsg").addClass("active").html("最后一页").show();
        function hideMsg(){
            $("#tipMsg").addClass("active").html("最后一页").hide()
        }
        setTimeout(hideMsg,1500);
	}
}
/**
 * 点击跳转某一页
 */
function goPageClick(){

	var goPage = $("input.pageChange-span4").val();
	var totalPage = $("#totalPageId").val();
	var fc = findCondition();
	if(isNaN(goPage) || "" == goPage || goPage < 1){
		fc.page = 1;
	}else if(goPage - totalPage > 0){
		fc.page = totalPage;
	}else{
		fc.page = goPage;
	}
	$("input.pageChange-span4").val("");
	loadEventList(fc);
}
/**
 * 清除查询条件后查询
 */
function initConditionClick(){
	initCondition();
	directUse();
}
/**
 * 点击跳转到事件新增页面
 */
function eventAdd(){
	window.location.href = eventAddHtml;
}
//双击跳转到事件详情页面
function toEventDetail(){
	var eventId = $(this).prev().children("input").val();
	formCondition(eventId);
//	window.location.href = eventDetailHtml+"?eventId="+eventId;
	var fc = findCondition();//该页的查询条件
	fc.askerName = $("#eAsk").val();
	fc.manageName = $("#eManager").val();
	var eventUrl = nextUrlDeal(fc,"askerName","manageName","like","eAsker",
			                       "eCompare","eCreateTime",
			                       "eManager","eOverAll","ePriority0",
			                       "ePriority1","ePriority2","eStatus","eType",
			                       "eUrgent0","eUrgent1","eUrgent2",
			                       "page","sort","eTimeOut");
	window.location.href = eventDetailHtml+"?eventId="+eventId+"&"+eventUrl;
}
function eventNameClick(){
	var eventId = $(this).parent().parent().prev().children("input").val();
	formCondition(eventId);
	var fc = findCondition();//该页的查询条件
	fc.askerName = $("#eAsk").val();
	fc.manageName = $("#eManager").val();
	var eventUrl = nextUrlDeal(fc,"askerName","manageName","like","eAsker",
			                       "eCompare","eCreateTime",
			                       "eManager","eOverAll","ePriority0",
			                       "ePriority1","ePriority2","eStatus","eType",
			                       "eUrgent0","eUrgent1","eUrgent2",
			                       "page","sort","eTimeOut");
	window.location.href = eventDetailHtml+"?eventId="+eventId;
}
/**
 * 组成跳转到详情信息的查询条件
 */
function formCondition(eventId){
	var ids = getAllkBox();//该页所有的事件id
	var fc = findCondition();//该页的查询条件
	var eventTotalNum = $("[data-bind='totalNum']").html();//事件列表总数
	var currentPage=$("[data-bind='currentPage']").html();//保存当前页

	var leftWrapNum=$('ul.left-wrap.active').index();

	if(null != ids){
		fc.ids = ids;//id集合
		fc.allNum = ids.length;//主要是对最后一条数据的判断。这里传递的是本页的数据总数
		fc.eventTotal = eventTotalNum;//所有数据总数
	}
	var eventListCurrentStatus=new Object;//存储列表页当前状态
	eventListCurrentStatus.leftWrapNum=leftWrapNum;//保存左侧active项
	eventListCurrentStatus.eventId=eventId;//保存当前点击id
	eventListCurrentStatus.currentPageNum=currentPage;//保存当前点击页
	//eventListCurrentStatus.totalPageNum=//保存总页数
	addCookie("fc",JSON.stringify(fc),24);
	addCookie("eventListCurrentStatus",JSON.stringify(eventListCurrentStatus),24);//存储列表页当前状态
}
/**
 * 点击删除
 */
function eDeleteClick(){
	var ids = getCheckBox();
	if(ids.length >0){
		$("#pupDelete").modal("show");
	}
}
/**
 * 点击删除弹框中的确认
 */
function eDeleteClickSure(){
	var ids = getCheckBox();
	if(ids.length>0){
		$.ajax({
			url:eventDeleteUrl,
			type:"get",
			data:{"ids":ids},
			traditional: true,
			dataType:"json",
			success:function(result){

		        //登录信息失效，ajax请求静态页面拦截
		        onComplete(result);

				if(successReturn == result.status){
					$("#tipMsg").addClass("active").html(result.msg).show();
					function tipHide(){
						$("#tipMsg").hide();
					}
				    setTimeout(tipHide,2000);
					$("#pupDelete").modal('hide');
					var fc = findCondition();
					var startNum = $("[data-bind='firstData']").html();
					var endNum = $("[data-bind='lastData']").html();
					var currentPage = $("[data-bind='currentPage']").html();
					if((endNum-startNum+1)>=ids.length){
						currentPage = currentPage-1;
						if(currentPage<1){
							currentPage = 1;
						}
					}
					fc.page = currentPage;
					loadEventList(fc);
				}else if(failReturn == result.status){
					outBox(result,"pupDelete");
				}
			},
			error:function(XMLHttpRequest){
				error_500(XMLHttpRequest.responseText);
			}
		});
	}
}
/**
 * 点击合并
 */
function eTogetherClick(){
	var ids = getCheckBox();
	if(ids.length>0){
		var eChecked = [];
		var $checkPro = $("div.eventList").find("i.active.eUse");
		$checkPro.each(function(){
			var ob = new Object();
			ob.eId = $(this).next().val();
			var other = $(this).parent().next();
			ob.name = other.find("[data-bind='events_title']").html();
			var info = other.find("div:eq(1)").text();
			info += other.find("div:eq(2)").text();
			ob.info = info;
			eChecked.push(ob);
		});
		diEchecked = {
			info:{
				html:function(){
					if(null != this.info){
						var infoDeal = this.info;
						var flag1 = infoDeal.indexOf("关闭于");
						if(-1 != flag1){
							infoDeal = infoDeal.substring(0,flag1);
						}
						var flag2 = infoDeal.indexOf("逾期");
						if(-1 != flag2){
							infoDeal = infoDeal.substring(0,flag2);
						}
						infoDeal = infoDeal.replace(")",")&nbsp;&nbsp;&nbsp;");
						return infoDeal;
					}
				}
			}
		};
		$("div.modal-body-upScroll").render(eChecked,diEchecked);
		$("div.modal-body-upScroll ul:first").addClass("first");
		$("div.modal-body-upScroll ul:first li:eq(2)").remove();
		//加载不在上面列表中的事件
		loadOtherEvent();
		$("#merge").modal("show");
	}
}
/**
 * 获得合并弹出框的所有事件信息（所有信息）
 */
function getTogetherIds(){
	var eventTogether = [];
	var $checkPro = $("div.modal-body-upScroll ul");
	$checkPro.each(function(){
		var ob = new Object();
		ob.eId = $(this).find("[data-bind='eId']").val();
		ob.name = $(this).find("[data-bind='name']").html();
		ob.info = $(this).find("[data-bind='info']").text();
		eventTogether.push(ob);
	});
	return eventTogether;
}
/**
 * 获取合并框中的事件id（只有id）
 * @returns {Array}
 */
function getTogether(){
	var eventTogether = [];
	var $checkPro = $("div.modal-body-upScroll ul");
	$checkPro.each(function(){
		eId = $(this).find("[data-bind='eId']").val();
		eventTogether.push(eId);
	});
	return eventTogether;
}
/**
 * 获取合并框中的事件主题（只有主题）
 * @returns {Array}
 */
function getTogetherTitle(){
	var eventTogether = [];
	var $checkPro = $("div.modal-body-upScroll ul");
	$checkPro.each(function(){
		eName = $(this).find("[data-bind='name']").html();
		eventTogether.push(eName);
	});
	return eventTogether;
}
/**
 * 指定为主事件
 */
function changeToMain(){
	var events = getTogetherIds();
	var thisNum = $(this).parent().parent().index();
	if(0 < thisNum){
		//改变一下数组中的顺序
		var thisEvent = events.slice(thisNum,thisNum+1).pop();
		events.splice(thisNum,1);
		events.unshift(thisEvent);
		$("div.modal-body-upScroll").render(events);
		$("div.modal-body-upScroll ul:first").addClass("first");
		$("div.modal-body-upScroll ul:first li:eq(2)").remove();
		$("#merge").modal("show");
	}
}
/**
 * 从合并的列表中删除
 */
function removeFromIds(){
	var events = getTogetherIds();
	var thisNum = $(this).parent().parent().index();
	if(thisNum>0){
		//删除其中一个数据
		events.splice(thisNum,1);
		$("div.modal-body-upScroll").render(events);
		$("div.modal-body-upScroll ul:first").addClass("first");
		$("div.modal-body-upScroll ul:first li:eq(2)").remove();
		//更新一下下面的列表
		loadOtherEvent();
	}
}
/**
 * 加载合并列表下方的数据，（不在合并列表中的其他事件）
 */
function loadOtherEvent(){
	var eventTogether = getTogether();
	var like = $("#aLikeFind").val();
	var mark = $("select.likeFind option:selected").val();
	$.ajax({
		url:loadOtherEventUrl,
		type:"post",
		data:{"ids":eventTogether,"like":like,"mark":mark},
		dataType:"json",
		traditional: true,
		success:function(result){

            //登录信息失效，ajax请求静态页面拦截
            onComplete(result);

			if(successReturnCom == result.status){
				var data = result.data;
				var diData = {
						event_other_Info:{
							html:function(){
								var info = "来自："+this.application_name+"("+
								           this.structure_name+")&nbsp;&nbsp;&nbsp";
								if(null != this.create_date){
									info += "创建于"+this.create_date+"&nbsp;&nbsp;&nbsp";
								}
								if(null != this.order_time){
									info += "响应于"+this.order_time;
								}
								return info;
							}
						}
				};
				$("div.modal-body-bottomUl").render(data,diData);
			}else{
				outBoxClose(result.msg);
			}
		},
		error:function(XMLHttpRequest){
			error_500(XMLHttpRequest.responseText);
		}
	});
}
/**
 * 加入到合并的列表中
 */
function addToIds(){
	var events = getTogetherIds();
	var e = new Object();
	var eUl = $(this).parent().parent();
	e.eId = eUl.find("[data-bind='events_id']").val();
	e.name = eUl.find("[data-bind='events_title']").html();
	e.info = eUl.find("[data-bind='event_other_Info']").text();
	events.push(e);
	$("div.modal-body-upScroll").render(events);
	$("div.modal-body-upScroll ul:first").addClass("first");
	$("div.modal-body-upScroll ul:first li:eq(2)").remove();
	//更新一下下面的列表
	loadOtherEvent();
}
/**
 * 点击合并弹框中的保存
 */
function togetherClick(){
	var eventTogether = getTogether();//所有事件的id
	var mainId = eventTogether.shift();//主事件id
	$.ajax({
		url:eventTogetherUrl,
		data:{"mainId":mainId,"ids":eventTogether},
		type:"get",
		dataType:"json",
		traditional: true,
		success:function(result){

            //登录信息失效，ajax请求静态页面拦截
            onComplete(result);

			if(successReturnCom == result.status){
				outBox(result,"merge");
			}else if(errorReturnCom == result.status){
				//提示用户哪些不能合并，并询问是否继续合并
				$("#eToManager").modal("show");
				var error = "";
				var data = result.data;
				if(null != data && data.length>0){
					for(var i=0;i<data.length;i++){
						error += data[i].events_name+",";
					}
					$("[data-bind='togetherError']").html(error);
					var dataSub = result.dataSub;
					//绑定数据到确定合并的弹框中
					$("[data-bind='mainId']").val(dataSub.mainId);
					$("div.dataTogether").render(dataSub.subIds);
				}
			}else{
				outBox(result,"merge");
			}
		},
		error:function(XMLHttpRequest){
			error_500(XMLHttpRequest.responseText);
		}
	});
}
/**
 * 去除不符合条件的事件，继续合并
 * @param result
 */
function continueToge(){

	var mainId = $("[data-bind='mainId']").val();
	var $checkPro = $("div.dataTogether");
	var eventTogether =[];
	$checkPro.each(function(){
		eId = $(this).find("[data-bind='id']").val();
		eventTogether.push(eId);
	});
	$.ajax({
		url:eventTogetherUrl,
		data:{"mainId":mainId,"ids":eventTogether},
		type:"get",
		dataType:"json",
		traditional: true,
		success:function(result){

            //登录信息失效，ajax请求静态页面拦截
            onComplete(result);

			$("[data-bind='mainId'],[data-bind='subIds']").val("");
			outBox(result,"eToManager");
			outBox(result,"merge");
		},
		error:function(XMLHttpRequest){
			error_500(XMLHttpRequest.responseText);
		}
	});
}
/**
 * 点击指派
 */
function eToManagerClick(){
	$("#eManagerH").val("");
	var ids = getCheckBox();
	if(ids.length>0){
		$("#assign").modal("show");
	}
}
/**
 * 管理人搜索
 */
//var man;
function loadManager(){
	var nameInput = $("#eManagerH");
	var name = nameInput.val();
//	if(name === man){
//		return;
//	}
//	man = name;
	var newSelect = new selectMenuH("eManager-treeH","eManager-menuH","eManagerH",
            "eManagerIdH",loadManagerNoSelfUrl);
	if(null == name || ""==name){
		newSelect.hide();
	}else{
		newSelect.nSelect('id','parent_id','name',true,name);
	    newSelect.show();
	}
}
function geteManager(){
	var managers = [];
	var $checkPro = $("div.eventList").find("i.active.eUse").next().next();
	$checkPro.each(function(){
		managers.push($(this).val());
	});
	return managers;
}
/**
 * 确认指派
 */
function eToManagerClickSure(){
	var ids = getCheckBox();//事件id
	var oriManagerId = geteManager();//原管理员id
	if(ids.length>0){
		var eManagerName = $("#eManagerH").val();//现管理员名称
		if("" != eManagerName){
			var eManagerId = $("#eManagerIdH").val();
			//发送ajax请求
			$.ajax({
				url:eventToManager,
				type:"post",
				data:{"ids":ids,"managerId":eManagerId,oriManagerId:oriManagerId},
				traditional: true,
				dataType:"json",
				success:function(result){

	                //登录信息失效，ajax请求静态页面拦截
	                onComplete(result);

					outBox(result,"assign");
				},
				error:function(XMLHttpRequest){
					error_500(XMLHttpRequest.responseText);
				}
			});
		}
	}
}
/**
 * 点击关闭
 */
function eCloseClick(){
	$("select.eDealStatus").selectpicker("val",0);
	$("select.eDealStatus").selectpicker("refresh");
	$("textarea.closeText").val("");
	var ids = getCheckBox();
	if(ids.length>0){
		$("#close").modal("show");
	}
}
/**
 * 确认关闭
 */
function eCloseClickSure(){
	var ids = getCheckBox();
	if(ids.length>0){
		var eDealStatus = $("select.eDealStatus option:selected").val();
		var closeDetail = $("textarea.closeText").val();
		$.ajax({
			url:eventCloseUrl,
			type:"post",
			data:{"ids":ids,"eDealStatus":eDealStatus,"closeDetail":closeDetail},
			traditional: true,
			dataType:"json",
			success:function(result){

	            //登录信息失效，ajax请求静态页面拦截
	            onComplete(result);

				outBox(result,"close");
			},
			error:function(XMLHttpRequest){
				error_500(XMLHttpRequest.responseText);
			}
		});
	}
}
/**
 * 点击批量回复
 */
function eAnswerClick(){
	var textA = $("textarea.answerAll");
	textA.val("");
	var ids = getCheckBox();
	if(ids.length>0){

		$("#batchReply").modal("show");
		
	}
}
/**
 * 确认回复
 */
function eAnswerClickSure(){
	var textA = $("textarea.answerAll");
	var answer = textA.val();
	var filePath = "";
	var ids = getCheckBox();
	if(ids.length>0){
		$.ajax({
			url:eventReplyUrl,
			data:{"ids":ids,"answer":answer,"filePath":filePath},
			type:"post",
			traditional: true,
			dataType:"json",
			success:function(result){

	            //登录信息失效，ajax请求静态页面拦截
	            onComplete(result);

				outBox(result,"batchReply");
			},
			error:function(XMLHttpRequest){
				error_500(XMLHttpRequest.responseText);
			}
		});
	}
}
/*
 * 	$("#like").val("");//模糊搜索
	var overAll = $("ul.left-wrap1");//全局条件
	overAll.addClass("active");
	overAll.siblings().removeClass("active");
	$("select.ejs").selectpicker("val",0);//几个下拉选
	$("select.ejs").selectpicker("refresh");
	$("#eAsk,#eManager").val("");//请求人、管理人
	$("#eAskId,#eManagerId").attr("value","");
	$("i.active").removeClass("active");//紧急程度、优先级
	$("span.right-con-title-rightSort").addClass("active");
	$("span.right-con-title-rightSort").prev().removeClass("active");
	$("input.pageChange-span4").val("");
	$("span.pageChange-span2").html(1);//第一页
 */
/**
 * 根据url中的参数，初始化页面的查询条件
 */
var active = "active";
function loadEventConditionFromDtail(fc){
	var overAll = $("ul.left-wrap1");//全局条件
	var overA = fc.eOverAll;
    if("1" == overA){
		overAll = $("ul.left-wrap3");
	}else if("3" == overA){
		overAll = $("ul.left-wrap1");
	}
	overAll.addClass("active");
	overAll.siblings().removeClass(active);
	//事件类型
	var type = fc.eType;
	$("select.eType").selectpicker("val",fc.eType);//事件类型
	$("#selEventStatus").val(fc.eStatus).trigger('change.select2');//事件状态
	$("#selEventOverdue").val(fc.eTimeOut).trigger('change.select2');//事件逾期
	$("select.eCreateTime").selectpicker("val",fc.eCreateTime);//创建时间
	$("select.eCompare").selectpicker("val",fc.eCompare);//排序条件
//	$("select.ejs").selectpicker("val",0);
	$("select.ejs").selectpicker("refresh");
	//请求人，管理人
	var askerName = fc.askerName;
	var manageName = fc.manageName;
	$("#eAsk").val(fc.askerName);
	$("#eAskId").val(fc.eAsker);
	$("#eManager").val(fc.manageName);
	$("#eManagerId").val(fc.eManager);
	//优先级
	$("i.remove").removeClass(active);
	var ePriority0 = fc.ePriority0;
	if("1" == ePriority0){
		$("i.ePriority0").addClass(active);
	}
	var ePriority1 = fc.ePriority1;
	if("1" == ePriority1){
		$("i.ePriority1").addClass(active);
	}
	var ePriority2 = fc.ePriority2;
	if("1" == ePriority2){
		$("i.ePriority2").addClass(active);
	}
	//紧急程度
	var eUrgent0 = fc.eUrgent0;
	if("1" == eUrgent0){
		$("i.eUrgent0").addClass(active);
	}
	var eUrgent1 = fc.eUrgent1;
	if("1" == eUrgent1){
		$("i.eUrgent1").addClass(active);
	}
	var eUrgent2 = fc.eUrgent2;
	if("1" == eUrgent2){
		$("i.eUrgent2").addClass(active);
	}
	//升降序
	$("span.sort").removeClass(active);
	var sort = fc.sort;
	if("ASC" == sort){
		$("span.right-con-title-leftSort").addClass(active);
	}else{
		$("span.right-con-title-rightSort").addClass(active);
	}
	//模糊搜索
	$("#like").val(fc.like);
}


/**
 * 页面加载完成执行的函数
 */
$(function(){
	getHistory();
	//解析url中的参数，并初始化页面的查询条件
	var isDetail = getUrlParamElist("x");
	//从详情页面过来的
	if(0 == isDetail){
		var fc = preLoadData("askerName","manageName","like","eAsker",
				             "eCompare","eCreateTime",
				             "eManager","eOverAll","ePriority0",
				             "ePriority1","ePriority2","eStatus","eType",
				             "eUrgent0","eUrgent1","eUrgent2",
				             "page","sort","eTimeOut");
		loadEventCondition();
		loadPageEachNum(function(){
			var eStatu = fc.eStatus;
			if(null != eStatu && ""!=eStatu){
				fc.eStatus = eStatu.split(",");
			}
			var eTime = fc.eTimeOut;
			if(null != eTime && ""!=eTime){
				fc.eTimeOut = eTime.split(",");
			}
			loadEventConditionFromDtail(fc);//初始化查询条件，（从详情页面过来的数据）
			loadEventList(fc);
		});
	}else{
		//加载事件类型、状态、创建时间下拉选的数据
		loadEventCondition();
		//不是详情页面过来的
		var flag = getUrlParamElist("flag");
		if(null != flag){
			var x = parseInt(flag);
			switch(x){
			case 0:$("#selEventOverdue").val(3).trigger('change');break;//事件逾期
			case 1:$("#selEventStatus").val([54,55,56]).trigger('change');break;//事件陈处理中
			case 2:$("select.eCreateTime").selectpicker("val",5);break;//本周新生
			case 3:$("#selEventOverdue").val(2).trigger('change');break;//事件今日到期
			case 4:$("#selEventStatus").val(52).trigger('change');break;//事件未发布
			}
			$("select.ejs").selectpicker("refresh");
		}
		loadPageEachNum(function(){
			//查找查询条件
			var fc = findCondition();
			//加载事件列表
			loadEventList(fc);
		});
	}
	$("span.navlist-img2").addClass("active");
	var eventId=getUrlParamElist("eventId");
	var statuss=getCookie('eventListCurrentStatus');
	//var currentPage=$("[data-bind='currentPage']").html();

	if(null !=eventId&&null !=statuss){

			var status=JSON.parse(statuss);
			var currentPageNum=status.currentPageNum;
			var statuseEventId=status.eventId;
			var leftWrapNum=status.leftWrapNum;
			if(eventId==statuseEventId){
				$($('ul.left-wrap')[leftWrapNum]).addClass('active').siblings().removeClass('active');//定位到当前选项
				//定位到当前表格页面


			}


	}

	//点击三个大条件其中的一个，默认的显示与我相关的
	$("div.overAll").on("click","ul",eMineClick);
	//点击事件类型、事件状态、创建时间、排序规则
	$("select.eType,select.eStatus,select.eCreateTime,select.eCompare,select.eTimeOut").change(eFilterClick);
	//点击紧急程度或者优先级
  // $("div.eventProUrgent").on("click","i",eventProUrgentClick);
	$("div.eventProUrgent").on("click","li.left-item-check",eventProUrgentClick);
	//搜索请求人或者管理人
	$("#eAsk").keyup(eAskLikeClick);
	$("#eManager").keyup(eManagerLikeClick);
	//点击新建事件
	$("button.eventAdd").click(eventAdd);
	//点击升序降序
	$("span.right-con-title-leftSort,span.right-con-title-rightSort").click(sortClick);
	//点击上一页
	$("span.pageChange-span1,#prePageI").click(proPageClick);
	//点击下一页
	$("span.pageChange-span3,#nextPageI").click(nextPageClick);
	//点击跳转到某一页
	$("span.pageChange-span5").click(goPageClick);
	//模糊搜索
	$("i.likeI").click(directUse);
	//清楚页面的查询条件
	$("p.left-wrap-clear").click(initConditionClick);
	//点击每个事件前面的小框
	$("div.eventList").on("click","li.clickId",eventBoxClick);
	//双击跳转到事件详情
//	$("div.eventList ul li,div.eventList ul li").dblclick(toEventDetail);
	$("div.eventList").on("dblclick","li.dbl",toEventDetail);
	//点击事件名称跳转到事件详情页面
	$("div.eventList").on("click","[data-bind='events_title']",eventNameClick);
	//点击删除
	$("button.eDelete").click(eDeleteClick);
	//点击删除弹框里的确认
	$("button.delete-click").click(eDeleteClickSure);
	//点击合并
	$("button.eTogether").click(eTogetherClick);
	//点击指派
	$("button.eToManager").click(eToManagerClick);
	//管理人索搜
	$("#assignFind").click(loadManager);
	//点击指派保存
	$("button.eToManage").click(eToManagerClickSure);
	//点击关闭
	$("button.eClose").click(eCloseClick);
	//确认关闭
	$("button.keep-close").click(eCloseClickSure);
	//点击批量回复
	$("button.eAnswer").click(eAnswerClick);
	//确认回复
	$("button.keep-reply").click(eAnswerClickSure);
	//点击合并弹框中的小钉子
	$("div.modal-body-upScroll").on("click","i.pro",changeToMain);
	//点击合并弹框中的减号
	$("div.modal-body-upScroll").on("click","i.last",removeFromIds);
	//点击合并弹框中的加号
	$("div.modal-body-bottomUl").on("click","i",addToIds);
	//点击合并弹框中的保存
	$("button.keep-together").click(togetherClick);
	//点击合并弹框中的继续合并
	$("button.continueToge").click(continueToge);
	//模糊搜索合并列表中的事件
	$("#likeFind").click(loadOtherEvent);
});
/**
 * 提示信息的弹出与删除
 * @param result
 */
function outBox(result,hideArea){
	$("#tipMsg").addClass("active").html(result.msg).show();
	function tipHide(){
		$("#tipMsg").hide();
	}
    setTimeout(tipHide,2000);
	$("#"+hideArea).modal('hide');
	var fc = findCondition();
	loadEventList(fc);
}
//获取url中的参数
function getUrlParamElist(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}
