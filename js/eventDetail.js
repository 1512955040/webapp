var eventAddHtml = "eventAdd.html";
var eventList="eventList.html"
var eventId;
var active = "active";
var dn = "dn";
var numEachPage;//与事件关联的资源，每页显示多少条数据
var leftChose = 0;//记录当前页选中的是会话（明细、工单、评价。。）中的哪一个
var slaTimeId;  //记录更新sla信息的定时器;
var startHistoryItem = 0; //记录请求历史信息时的起始位置
var numbersHistoryItem = 8;  //记录请求历史信息的条数;
//事件处理状态
var eDealStatus = [
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
var dieDealStatus = {
		eDealStatus:{
			value:function(){
				return this.value;
			}
		}
};
/**
 * 加载下拉选的数据
 */
function loadOptionData(){
	$("select.closeMemo").render(eDealStatus,dieDealStatus);//事件的处理状态
	$("select.checkDealStatus").render(eDealStatus,dieDealStatus);
	$("select.ejs").selectpicker("val",0);
	$("select.ejs").selectpicker("refresh");
}
/**
 * 加载每页显示多少条数据
 */
function loadPageEachNum(){
	$.ajax({
		url:loadPageEachNumREUrl,
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
 * 加载事件的详情信息
 * @param eventId  事件id
 * @param dataDeal 处理数据的函数
 */
function loadEventDetail(eventId,dataDeal){
	$.ajax({
		url:eventDetailUrl,
		type:"get",
		data:{"eventId":eventId},
		dataType:"json",
		success:function(result){
			//console.log(result);
            //登录信息失效，ajax请求静态页面拦截
            onComplete(result);
			if(result.status == successReturnCom){
				dataDeal(result);//往页面上绑定数据数据（右侧）
				leftChoseClick(leftChose);//中间部分的数据
				//是否删除附件信息弹窗
				rowWrapDelete($('.modal-body-bottom-row'),$('.fileDelete'),$('#eventDelete'),$('.eventDetail'),$("[data-bind='filePath']"));
			}else{
				 outBoxClose("加载信息失败");
			 }
			},
			error:function(XMLHttpRequest){
				error_500(XMLHttpRequest.responseText);
			}
	});
}
/**
 * 往页面上绑定数据数据
 * @param data
 */
function eventDataDeal(result){
	    $("div.application_detail").hide();
	    $("div.manager_detail").hide();
		$("div.container-right-title button.container-right-title-btn").hide();
		var data = result.data;
		//按钮权限
		var elements = ["btn-edit","btn-close","btn-toManager","btn-print",
		              "btn-publish","btn-check","btn-answer"];
		var userRules = {
			     //请求人
			     1:["btn-edit","btn-close","btn-toManager","btn-print",
		            "btn-publish","btn-answer"],
			     //管理人
			     2:["btn-edit","btn-close","btn-toManager","btn-print",
		            "btn-publish","btn-check","btn-answer"],
			     //其他
			     3:["btn-edit","btn-close","btn-print",
		            "btn-publish","btn-answer"]
	            };
		var wether_application = data.wether_application;
		var wether_manager = data.wether_manager;
		var userPower;
		//是管理人
		if(wether_manager){
			userPower = showElements(elements,2,userRules).show;
		}else if(!wether_manager && wether_application){
			//是请求人
			userPower = showElements(elements,1,userRules).show;
		}else{
			//不是管理人和请求人
			userPower = showElements(elements,3,userRules).show;
		}
		var eventRules = {
				           52:["btn-edit","btn-close","btn-toManager",
				               "btn-print","btn-publish","btn-answer"],
				           53:["btn-print","btn-check","btn-answer"],
				           54:["btn-close","btn-toManager","btn-print",
					           "btn-answer"],
				           55:["btn-toManager","btn-print","btn-answer"],
				           56:["btn-close","btn-toManager","btn-print",
					          "btn-answer"],
				           57:["btn-toManager","btn-print",
					           "btn-check","btn-answer"],
				           58:["btn-print","btn-answer"],
		                 };
		var showEle = showElements(userPower,data.events_status_id,eventRules).show;
		for(var i=0;i<showEle.length;i++){
			$("div.container-right-title button."+showEle[i]).show();
		}
		//左侧二级菜单是否显示控制
		//需要管理的菜单 1.工单 2.工作日志 3.评价
		var leftElements = ["container-left-item3",
		                    "container-left-item5",
		                    "container-left-item7"];
		//规则
		var leftRules = {
		                 52:[],
		                 53:[],
		                 54:["container-left-item3",
		                     "container-left-item5"],
		                 55:["container-left-item3",
		                     "container-left-item5"],
		                 56:["container-left-item3",
		                     "container-left-item5"],
		                 57:["container-left-item3",
		                     "container-left-item5"],
		                 58:["container-left-item3",
		                     "container-left-item5",
		                     "container-left-item7"],
	                    };
		//控制
		for(var i=0;i<leftElements.length;i++){
			$("li."+leftElements[i]).addClass("dn");
		}
		var showLeftElements = showElements(leftElements,data.events_status_id,leftRules).show;
		for(var i=0;i<showLeftElements.length;i++){
			$("li."+showLeftElements[i]).removeClass("dn");
		}
		var dataHelp = {
				priorityLevel:{
					class:function(){
						var priority = this.priority_id;
						var result;
						switch(priority){
							case 4:result = "priorityLevel low";break;
							case 5:result = "priorityLevel middle";break;
							case 6:result = "priorityLevel high";break;
						}
						return result;
					}
				},
				urgencyLevel:{
					class:function(){
						var urgency = this.urgency_id;
						var result;
						switch(urgency){
							case 4:result = "urgencyLevel low";break;
							case 5:result = "urgencyLevel middle";break;
							case 6:result = "urgencyLevel high";break;
						}
						return result;
					}
				}
		};
		//事件数据展示
		$("div.event-info-right").render(data,dataHelp);
		var eStatus = data.events_status_id;
		if((52==eStatus)||(53==eStatus)){
				$("#slaInfo").hide();
				$("#executor_down_ul").hide();
				setLeftHeight();
		}else if(54 == eStatus){//未响应&未解决
				$("#slaInfo").show();
				$("#executor_down_ul").hide();
				setLeftHeight();
		}else if(58 == eStatus){ //已响应&已解决
				$("#slaInfo").show();
				$("#executor_down_ul").show();
				setLeftHeight();
		}else{//已响应&未解决
				$("#slaInfo").show();
				$("#executor_down_ul").show();
				setLeftHeight();
		}
    //如果是处理中的状态，则不显示sla信息，也不显示执行人的信息;如果处理过,根据不同阶段显示响应时间和解决时间
    //定时更新右侧SLA时间信息
    function regularSlaTime(){
      var responseContent;  //responseInfo(响应时间)里的内容
      var resolveContent;  //resolveContent(解决时间)里的内容
      if ((52==eStatus)||(53==eStatus)) {
					
      }else if(54==eStatus){//未响应&未解决
          responseContent = calcTime1(data.publish_date,data.response);
          resolveContent = calcTime1(data.publish_date,data.address_aging);
      }else if(58 == eStatus){  //已响应&已解决
          responseContent = calcTime2(data.publish_date,data.order_time,data.response);
          resolveContent = calcTime2(data.publish_date,data.address_aging_date,data.address_aging);
      }else {  //已响应&未解决
          responseContent = calcTime2(data.publish_date,data.order_time,data.response);
          resolveContent = calcTime1(data.publish_date,data.address_aging);
      }
      $("#responseInfo").text(responseContent);
      $("#resoveInfo").text(resolveContent);
    };
    /*第二次清除sla时间定时器,确保清除*/
    clearInterval(slaTimeId);
    /*定时更新sla 时间信息*/
    slaTimeId = setInterval(regularSlaTime,60000);
    regularSlaTime(eStatus,data);
    
			//事件图标
			var flag = data.event_type;
			var eventTypeFlag = "";
			switch(flag){
				case 49:eventTypeFlag = "accident";break;
				case 50:eventTypeFlag = "systemPatrol";break;
				case 51:eventTypeFlag = "support";break;
			}
			$("i.eventTypeFlag").removeClass("accident systemPatrol support");
			$("i.eventTypeFlag").addClass(eventTypeFlag);
			//绑定进度条数据
			var process = "";
			var processDiv = $("div.event-process");
			processDiv.removeClass("process1 process2 process3 process4 " +
					                "process5 process6");
			switch(eStatus){
				case 52:process = "process1"; break;
				case 53:process = "process6"; break;//缺少一个事件内部处理关闭时的样式
				case 54:process = "process2"; break;
				case 55:process = "process3"; break;
				case 56:process = "process4"; break;
				case 57:process = "process5"; break;
				case 58:process = "process6"; break;
			}
			processDiv.addClass(process);
			$("#e_title").html(data.title);
			//前一事件和后一事件样式
			var fcc = getCookie("fc");
			if(null != fcc){
				var fc = JSON.parse(fcc);//对象
				var ids = fc.ids;
				var eventTotal = fc.eventTotal;//事件总数
				var page = fc.page;//当前页数
				//当前事件的id
				var currentId = eventId;
				var index;
				for(var i=0;i<ids.length;i++){
					if(currentId == ids[i]){
						index = i;
						break;
					}
				}
				var left = $("span.event-page-left");
				var right = $("span.event-page-right");
				left.removeClass("active");
				right.removeClass("active");
				if(eventTotal == 1){

				}else if(index == 0 && fc.page == 1){
					right.addClass("active");
				}else if((page-1)*10+index == eventTotal-1){
					// index == ids.length-1 &&
					left.addClass("active");
				}else{
					left.addClass("active");
					right.addClass("active");
				}
			}
		    //附件数据
			var fileInfo = result.dataSub;
			//console.log(fileInfo);
			if(null != fileInfo){
				var fileCount = fileInfo[0].fileCount;
				$("#fileCount").html(fileCount);
        		// 设置弹框，让其显示“有内容”效果
        		$("#accessory .modal-has,#accessory .modal-footer").css("display","block");
       	 		$("#accessory .modal-none").css("display","none");

				var filePathHref={
						fileDownLoad:{
							href:function(){
								return this.filePath;
							}
						}
				}
				//附件弹框里的数据
				$("div.eventFile").render(fileInfo,filePathHref);
			}else {
      		//没有附件对象，附件数量就是0；
      		$("#fileCount").html(0);
      		// 设置弹框，让其显示“无内容”效果
      		$("#accessory .modal-has,#accessory .modal-footer").css("display","none");
      		$("#accessory .modal-none").css("display","block");
		  }
	}


//sla信息 未响应和未解决
function calcTime1(start,duration){
  var timeArr = start.replace(/[-: ]/g,",").split(",");
  //开始时间
  var startTime = new Date(timeArr[0],timeArr[1]-1,timeArr[2],timeArr[3],timeArr[4],timeArr[5]);
  //现在时间
  var nowTime = new Date();
  //要显示的时间
  var time = duration-(nowTime - startTime);

  var time = time/1000;
  var h = Math.floor( time/(60*60) );
  var m = Math.floor( (time/60)%60 );
  if (time<0) {
  return "超时"+(-h)+"时 "+(-m)+"分"
  }else {
  return h+"时 "+m+"分";
  }
}
//sla信息 已响应和已解决
function calcTime2(start,end,duration){
  // 结束时间为空时,返回空值
  if (end == ""|| end == null || end == undefined) {
    return "";
  }
  var timeArr1 = start.replace(/[-: ]/g,",").split(",");
  //开始时间
  var startTime = new Date(timeArr1[0],timeArr1[1]-1,timeArr1[2],timeArr1[3],timeArr1[4],timeArr1[5]);
  var timeArr2 = end.replace(/[-: ]/g,",").split(",");
  //结束时间
  var endTime = new Date(timeArr2[0],timeArr2[1]-1,timeArr2[2],timeArr2[3],timeArr2[4],timeArr2[5]);
  //要显示的时间
  var time = endTime - startTime;
  
  var time = time/1000;
  var h = Math.floor( time/(60*60) );
  var m = Math.floor( (time/60)%60 );
  var dur = duration/1000/60/60;
  return h+"时 "+m+"分 ("+dur+"时)";
}

//获取url中的参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);//匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}

/**
 * 点击返回上一页
 */
function backPage(){
//	eventId=getUrlParam("eventId");
	var preUrl = preLoadData("askerName","manageName","like","eAsker","eCompare","eCreateTime",
				             "eManager","eOverAll","ePriority0",
				             "ePriority1","ePriority2","eStatus","eType",
				             "eUrgent0","eUrgent1","eUrgent2",
				             "page","sort","eTimeOut");
	var nextUrl = nextUrlDeal(preUrl,"askerName","manageName","like","eAsker","eCompare","eCreateTime",
				             "eManager","eOverAll","ePriority0",
				             "ePriority1","ePriority2","eStatus","eType",
				             "eUrgent0","eUrgent1","eUrgent2",
				             "page","sort","eTimeOut");
	var isList = getUrlParam("x");
	if(0 == isList){
		window.location.href = eventList+'?'+nextUrl;
	}else{
//		window.history.back();
		window.location.href="eventList.html";
	}
}
/**
 * 点击编辑跳转到编辑页面上
 */
function eEditClick(){
	window.location.href = eventAddHtml+"?eventId="+eventId;
}
/**
 * 点击关闭框中的保存
 */
function closeClick(){
	var texta = $("textarea.closeMem");
	var eDealStatus = $("select.closeMemo option:selected").val();//事件处理状态
	var closeDetail = texta.val();//事件关闭说明
	if("" == closeDetail){
		closeDetail = "该事件已被关闭";
	}
	$.ajax({
		url:eventCloseUrl,
		data:{"ids":eventId,"eDealStatus":eDealStatus,"closeDetail":closeDetail},
		type:"post",
		dataType:"json",
		success:function(result){
            //登录信息失效，ajax请求静态页面拦截
            onComplete(result);
			outBoxClose(result.msg,"close");
			//改变状态后刷新一下页面
			loadEventDetail(eventId,eventDataDeal);
		},
		error:function(XMLHttpRequest){
			error_500(XMLHttpRequest.responseText);
		}
	});
}
/**
 * 点击关闭
 */
function eCloseClick(){
	var selectC = $("select.closeMemo");
	var texta = $("textarea.closeMem");
	selectC.selectpicker("val",0);
	selectC.selectpicker("refresh");
	texta.val("");//事件关闭说明
	$("#close").modal("show");
}
/**
 * 加载指派的管理人，（除了当前用户自己）
 */
//var man;
function loadManagerNoSelf(){
	var nameInput = $("#managerInput");
	var name = nameInput.val();
//	if(name == man){
//		return;
//	}
//	man = name;
	var newSelect = new selectMenuH("eManager-treeH","eManager-menuH","managerInput",
            "eManagerIdH",loadManagerNoSelfUrl);
	if(null == name || ""==name){
		newSelect.hide();
	}else{
		newSelect.nSelect('id','parent_id','name',true,name);
	    newSelect.show();
	}
}
/**
 * 指派保存
 */
function toManagerSave(){
	var nameInput = $("#managerInput");
	var nameManager = nameInput.val();//现指派人名字
	var oriManagerId = $("#managerId").html();//原指派人id
	if("" != nameManager){
		var managerId = $("#eManagerIdH").val();
		$.ajax({
			url:eventToManager,
			type:"get",
			data:{"ids":eventId,"managerId":managerId,oriManagerId:oriManagerId},
			dataType:"json",
			success:function(result){

                //登录信息失效，ajax请求静态页面拦截
                onComplete(result);

				outBoxClose(result.msg,"assign");
				loadEventDetail(eventId,eventDataDeal);
			},
			error:function(XMLHttpRequest){
				error_500(XMLHttpRequest.responseText);
			}
		});
	}
}
/**
 * 点击指派
 */
function eToManagerClick(){
	var nameInput = $("#managerInput");
	nameInput.val("");
	$("#assign").modal("show");
}
/**
 * 发布保存
 */
function publishSave(){
	var exceptTimeIn = $("#exceptTime");
	var serviceId = $("select.services option:selected").val();//服务商id
	var serviceName = $("select.services option:selected").html();//服务商id
	if(0 != serviceId){
		var groupId = $("select.servicesHelp option:selected").val();//运维小组id
		var exceptTime = exceptTimeIn.val();//期望解决时间
		var eTitle = $("#e_title").html();//事件标题
		var eMemo = $("[data-bind='describe_name']").val();//事件描述
		var ePublish = $("[data-bind='events_status_id']").val();//事件的发布状态
		var flag = $("[data-bind='flag']").val();//
		var priority = $("[data-bind='priority_id']").val();//优先级
		var urgent = $("[data-bind='urgency_id']").val();//紧急程度
		if(52 == ePublish){
			$.ajax({
				url:publishUrl,
				type:"post",
				data:{"eventId":eventId,"serviceId":serviceId,"exceptTime":exceptTime,
					  "eTitle":eTitle,"eMemo":eMemo,"groupId":groupId,"flag":flag,
					  "priority":priority,"urgent":urgent},
				dataType:"json",
				success:function(result){
					 	
                    //登录信息失效，ajax请求静态页面拦截
                    onComplete(result);

					outBoxClose(result.msg,"publish");
					loadEventDetail(eventId,eventDataDeal);
					eventCoverClick(eventCoverDeal);
				},
				error:function(XMLHttpRequest){
					error_500(XMLHttpRequest.responseText);
				}
			});
		}else{
			outBoxClose("该事件已发布");
		}
	}else{
		outBoxClose("请选择一个服务商");
	}
}
/**
 * 点击发布
 */
function ePublishClick(){
	loadService();
	var exceptTimeIn = $("#exceptTime");
	var serviceSel = $("select.services");
	serviceSel.selectpicker("val",0);
	serviceSel.selectpicker("refresh");
	exceptTimeIn.val("");
	$("#publish").modal("show");
}
/**
 * 加载服务商列表
 */
function loadService(){
//	$("div.group_ser").hide();
	$.ajax({
		url:loadServiceUrl,
		type:"get",
		data:{"eventId":eventId},
		dataType:"json",
		success:function(result){
			//console.log(result);
            //登录信息失效，ajax请求静态页面拦截
            onComplete(result);
			if(successReturnCom == result.status){
				var data = result.data;
				var diData = {
						service_name:{
							value:function(){
								return this.service_id;
							}
						}
				};
				var serviceSel = $("select.services")
				serviceSel.render(data,diData);
				serviceSel.selectpicker("val",0);
                serviceSel.selectpicker("refresh");
                
				//初始化运维小组列表start
                var groupSel = $("select.servicesHelp");
                var subData = data[0]["group_info"]||[];

				var diGroupInfo={
						group_name:{
							value:function(){
								return this.group_id;
							}
						}
                };
                subData.unshift({
                    group_id: 0,
                    group_name: "--请选择--"
                });
                console.log(subData);
                
				groupSel.render(subData,diGroupInfo);
				groupSel.selectpicker("val",0);
                groupSel.selectpicker("refresh");
                //初始化运维小组列表end

				if(null != data && null != data[0].group_info && data[0].group_info.length == 1){
					//初始化运维小组列表
					var groupSel = $("select.servicesHelp");
					var diGroupInfo={
							group_name:{
								value:function(){
									return this.group_id;
								}
							}
					};
					var groupInfo = data[0].group_info;
					groupSel.render(groupInfo,diGroupInfo);
					groupSel.selectpicker("refresh");
				}else{
					serviceSel.change(function(){
						$("div.group_ser").show();
						var serviceId = $("select.services option:selected").val();
						if(null != serviceId && 0!=serviceId){
							var groupSel = $("select.servicesHelp");
							var diGroupInfo={
									group_name:{
										value:function(){
											return this.group_id;
										}
									}
							};
							var groupInfo = [];
							for(var i=0;i<data.length;i++){
								if(data[i].service_id == serviceId){
									$("[data-bind='flag']").val(data[i].flag);
									//绑定运维小组的数据
									groupInfo = data[i].group_info;
									// if(groupInfo != null && groupInfo.length > 1 ){
									// 	var group = {
									// 			group_id:0,
									// 			group_name:"--请选择--"
									// 	}
									// 	groupInfo.unshift(group);
									// }else{
									// }
								}
							}
							groupSel.render(groupInfo,diGroupInfo);
							groupSel.selectpicker("val",0);
							groupSel.selectpicker("refresh");
//							var del = groupInfo.slice(0,1);//返回值是一个数组
//							if(null != del && del[0].group_id == 0){
//								groupInfo.splice(0,1)
//							}
						}else{
							var groupSel = $("select.servicesHelp");
							var groupInfo = {
									group_id:0,
									group_name:"--请选择--"
								};
							groupSel.render(groupInfo,diGroupInfo);
							groupSel.selectpicker("val",0);
							groupSel.selectpicker("refresh");
						}
					});
				}
			}
		},
		error:function(XMLHttpRequest){
			error_500(XMLHttpRequest.responseText);
		}
	});
}
/**
 * 审核通过
 */
function keepAudit(){
	var textA = $("textarea.auditMemo");
	var textArea = textA.val();//审核说明
	var eStatus = $("select.checkDealStatus option:selected").val();
	//发送请求
	$.ajax({
		url:checkUrl,
		type:"get",
		data:{"eventId":eventId,"eStatus":eStatus,"checkMemo":textArea,"flag":true},
		dataType:"json",
		success:function(result){
            //登录信息失效，ajax请求静态页面拦截
            onComplete(result);
			outBoxClose(result.msg,"audit");
			loadEventDetail(eventId,eventDataDeal);
			eventCoverClick(eventCoverDeal);
		},
		error:function(XMLHttpRequest){
			error_500(XMLHttpRequest.responseText);
		}
	});
}
/**
 * 审核驳回
 */
function cancelAudit(){
	var textA = $("textarea.auditMemo");
	var textArea = textA.val();//驳回说明
	var eStatus = $("select.checkDealStatus option:selected").val();
	//发送请求
	$.ajax({
		url:checkUrl,
		type:"get",
		data:{"eventId":eventId,"eStatus":59,"checkMemo":textArea,"flag":false},
		dataType:"json",
		success:function(result){
            //登录信息失效，ajax请求静态页面拦截
            onComplete(result);
			outBoxClose(result.msg,"audit");
			loadEventDetail(eventId,eventDataDeal);
			eventCoverClick(eventCoverDeal);
		},
		error:function(XMLHttpRequest){
			error_500(XMLHttpRequest.responseText);
		}
	});
}
/**
 * 点击审核
 */
function eCheckClick(){
	var textA = $("textarea.auditMemo");
	var selectC = $("select.checkDealStatus");
	selectC.selectpicker("val",0);
	selectC.selectpicker("refresh");
	textA.val("");
	$("#audit").modal("show");
}
/**
 * 点击回复
 */
function eAnswerClick(){
	var textA = $("textarea.batchReplyMemo");
	textA.val("");
	$("#batchReply").modal("show");
}

/**
 * 构建可回复状态的页面
 */
function eAnswerClickHelp(){
	$("#answerBottom_textarea").val("");
	$("div.session-bottom-right-init").addClass(dn);
	$("div.session-bottom-right-edit").removeClass(dn);
	$("div.isNotFL").removeClass(dn);
	$("p.answerBox").addClass(active);
//	$('#container-left').css('height',$('#container-right').outerHeight()+30+'px');
//	$('.event-info-right').css('height',$('.event-info-left').outerHeight()+'px');
	setLeftHeight();
	//需求：点击回复滚动到底部回复区域
	$('html, body').animate({scrollTop: $(document).height()}, 300);
  	$('#answerBottom_textarea').focus();
}
/**
 * 取消回复的状态
 */
function eNoAnswer(){
	$("div.session-bottom-right-init").removeClass(dn);
	$("div.session-bottom-right-edit").addClass(dn);
	$("div.isNotFL").addClass(dn);
	$("p.answerBox").removeClass(active);
	setLeftHeight();
}
/**
 * 点击回复弹框里面的保存   <span><i class="low middle high"></i></span>
 */
function eAnswerClickSave(){
//	var textA = $("textarea.batchReplyMemo");//answerBottom_textarea
	var textA = $("textarea.answerBottom_textarea");
	var batchReply = textA.val();
	var filePath ="";
	if("" != filePath || "" != batchReply){
		$.ajax({
			url:eventReplyUrl,
			type:"post",
			data:{"ids":eventId,"answer":batchReply,"filePath":filePath},
			dataType:"json",
			success:function(result){
                //登录信息失效，ajax请求静态页面拦截
                onComplete(result);
				outBoxClose(result.msg,"batchReply");
				eventCoverClick(eventCoverDeal);
				eNoAnswer();
			},
			error:function(XMLHttpRequest){
				error_500(XMLHttpRequest.responseText);
			}
		});
	}
}

/**
 * 点击下方的回复
 */
function eAnswerBottomClick(){
	var textA = $("#answerBottom");
	var batchReply = textA.val();
	var filePath ="";
	if("" != batchReply || filePath != ""){
		$.ajax({
			url:eventReplyUrl,
			type:"post",
			data:{"ids":eventId,"answer":batchReply,"filePath":filePath},
			dataType:"json",
			success:function(result){
                //登录信息失效，ajax请求静态页面拦截
                onComplete(result);
				textA.val("");
				outBoxClose(result.msg);
				eventCoverClick(eventCoverDeal);
			},
			error:function(XMLHttpRequest){
				error_500(XMLHttpRequest.responseText);
			}
		});
	}
}
var executorH = $("div.executor_detail");//执行人明细详情
var executorI = $("i.worker");//执行人明细右侧三角
var managerH = $("div.manager_detail");//管理人明细详情
var managerI = $("i.manager");//管理人明细右侧三角
var askerH = $("div.application_detail");//请求人明细详情
var askerI = $("i.asker");//请求人明细右侧三角

/**点击切换右侧（手风琴效果）**/
//查看执行人详情
function executorDetailClick(){
	if($(this).hasClass('active')){//收起
		$(this).removeClass('active');
		$(this).find('.infoRightOffside').show();
		$(this).find('i.worker').removeClass('worker1');
		$(this).parents('.switchUl').siblings('.switchUl').children('.detail').slideUp();
		$(this).siblings('.detail').slideUp(function(){
			setLeftHeight();
		});
	}else{//展开
		$('.infoRightOffside').show();
		$(this).find('.infoRightOffside').hide();
		$(this).siblings('.detail').slideDown(function(){
			setLeftHeight();
		});
		$(this).find('i.worker').addClass('worker1');
		$('i.asker').removeClass('asker1');
		$('i.manager').removeClass('manager1');
		$(this).parent().siblings('.switchUl').children('.detail').slideUp();
		$(this).addClass('active').parent().siblings('.switchUl').children('li').removeClass('active');
	}
}
//查看请求人详情
function applicationDetailClick(){
	//收起
	if($(this).hasClass('active')){
		$(this).removeClass('active');
		$(this).find('.infoRightOffside').show();
		$(this).find('i.asker').removeClass('asker1');
		$(this).parents('.switchUl').siblings('.switchUl').children('.detail').slideUp();
		$(this).siblings('.detail').slideUp(function(){
			setLeftHeight();
		});
	//展开
	}else{
		$('.infoRightOffside').show();
		$(this).find('.infoRightOffside').hide();
		$(this).siblings('.detail').slideDown(function(){
			setLeftHeight();
		});
		$(this).find('i.asker').addClass('asker1');
		$('i.worker').removeClass('worker1');
		$('i.manager').removeClass('manager1');
		$(this).parent().siblings('.switchUl').children('.detail').slideUp();
		$(this).addClass('active').parent().siblings('.switchUl').children('li').removeClass('active');
	}
}
//查看管理员明细
function managerDetailClick(){
	//收起
	if($(this).hasClass('active')){
		$(this).removeClass('active');
		$(this).find('.infoRightOffside').show();
		$(this).find('i.manager').removeClass('manager1');
		$(this).parents('.switchUl').siblings('.switchUl').children('.detail').slideUp();
		$(this).siblings('.detail').slideUp(function(){
			setLeftHeight();
		});
	//展开
	}else{
		$('.infoRightOffside').show();
		$(this).find('.infoRightOffside').hide();
		$(this).siblings('.detail').slideDown(function(){
			setLeftHeight();
		});
		$(this).find('i.manager').addClass('manager1');
		$('i.worker').removeClass('worker1');
		$('i.asker').removeClass('asker1');
		$(this).parent().siblings('.switchUl').children('.detail').slideUp();
		$(this).addClass('active').parent().siblings('.switchUl').children('li').removeClass('active');
	}
}
/**
 * 左侧样式修改
 * @param activeLi 需要点亮的那个li的class
 * @param dnDiv 需要显示的那个div
 */
function eLeftClass(activeLi,dnDiv){
	$("li.container-left-item").removeClass("active");
	$("li."+activeLi).addClass("active");
	$("div.e-left-dn").addClass("dn");
	$("div."+dnDiv).removeClass("dn");
//	//如果当前这个页面，这个选项不存在，则默认选中会话。
//	if($("li."+activeLi).hasClass(dn) && $("li."+activeLi).hasClass(active)){
//		$("li.container-left-item1").addClass(active);
//	}
//	if($("div."+dnDiv).hasClass(dn)){
//		$("div.event-session-leftDown").removeClass(dn);
//	}
	if(activeLi=='container-left-item'){
		eventCoverClick(eventCoverDeal);
	}else{
		//切换时去除之前设置的高度
//		$('#container-left').css('height','');
//		$('.event-info-right').css('height','');
//		$('.event-info-left').css('height','');
	}
}
/**
 * 点击会话
 * @param eventCoverDeal  处理会话数据的函数
 */
function eventCoverClick(eventCoverDeal){
	loadCurrentUserHelp();
	$.ajax({
		url:conversationUrl,
		type:"get",
		data:{"eventId":eventId},
		dataType:"json",
		success:function(result){
			//console.log(result)
            //登录信息失效，ajax请求静态页面拦截
            onComplete(result);
            eventCoverDeal(result);
		},
		error:function(XMLHttpRequest){
			error_500(XMLHttpRequest.responseText);
		}
	});
}
/**
 * 往页面上绑定数据--会话
 * @param result
 */
function eventCoverDeal(result){
	leftChose = 0;
	eLeftClass("container-left-item1","event-session-leftDown");
	if(1 == result.status){
		var data = result.data;
		var currentUser = result.dataSub;//当前用户的id
		var eventTitle = data.events_title;//事件标题
		var eventTime = data.events_time;//事件时间
		var eventForm = data.events_source;//事件来源
		var converInfo = data.conversation_info;//会话信息
		//绑定标题
		var eventI = {
				events_time:eventTime,
				events_title:eventTitle,
				event_from:eventForm,
				evnetAsker:data.per_name
		}
		$("div.event-info-leftDownTitle").render(eventI);
		setHistory(data.events_title);
		getHistory();
		//绑定会话信息
		var converDiv = $("div.conversationDiv");
		var diConverInfo = {
				//头像的左右
				leftOrRight:{
					class:function(){
						if(currentUser == this.user_id){
							return "session-right";
						}else{
							return "session-left";
						}
					}
				},
				//是否可以编辑这条会话
				editDelete:{
					class:function(){
						if(currentUser != this.user_id){
							return "dn";
						}
					}
				},
				//组织这个会话的标题---几天前
				conversation_time_flag:{
					text:function(){
						var time = this.conversation_create_time;
						var dayNum = converDayDeal(time);
						var result = "";
						if(0 == dayNum){
							result = converTimeDeal(time);
						}else if(0<dayNum && dayNum<10){
							result += dayNum+"天前";
						}
						return result;
					}
				},
				//组织这个会话的标题---发布于，创建于。。。
				conversation_flag:{
					text:function(){
						var flag = "";
						var flagData = this.mould;//后台数据
						switch(flagData){
						case 1:flag = "报告于";break;
						case 2:flag = "发布于";break;
						case 3:flag = "接单于";break;
						case 4:flag = "完成于";break;
						case 5:flag = "关闭于";break;
						case 6:flag = "拒单于";break;
						case 7:flag = "驳回工单于";break;
						case 8:flag = "回复于";break;
//						case 9:flag = "提交内审于";break;
						case 10:flag = "提交内审于";break;
					}
						return flag;
				}
			}
		}
		converDiv.render(converInfo,diConverInfo);
		setLeftHeight();
	}
}
/**
 * 会话时间处理，返回的是天数
 * @param str
 * @returns {Number}
 */
function converDayDeal(str){
//	var str = "2017-05-17 11:19:35";
	var dayNum = 0;
	var milliseconds = Date.parse(str);
	var startTime = new Date();
	var end = startTime.getTime();//现在的毫秒数
	startTime.setTime(milliseconds);//装成日期对象，并设置为00:00:00
	startTime.setHours(0);
	startTime.setMinutes(0);
	startTime.setSeconds(0);
	var start = startTime.getTime();//数据的毫秒数
	dayNum = Math.floor((end - start)/1000/3600/24);
	return dayNum;
}
/**
 * 会话时间处理，返回的是时分  12:12
 * @param str
 */
function converTimeDeal(str){
	var milliseconds = Date.parse(str);
	var startTime = new Date();
	startTime.setTime(milliseconds);//装成日期对象
	var time = startTime.toTimeString();
	time = time.substring(0,5);
	return time;
}
/**
 * 当前登录的用户信息
 */
function loadCurrentUserHelp(){
	$.ajax({
		url:loadCurrentUserUrl,
		type:"get",
		dataType:"json",
		success:function(result){
			//console.log(result)
			//登录信息失效，ajax请求静态页面拦截
            onComplete(result);
			if(1 == result.status){
				$("[data-bind='currentUser']").html(result.data.p_name);
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
 * 点击明细
 * @param eventDetailDeal 数据处理函数
 */
function eventDetailClick(eventDetailDeal){
		//console.log(eventDetailDeal)
	//事件数据
	$.ajax({
		url:dblDetailUrl,
		type:"get",
		data:{"eventId":eventId},
		dataType:"json",
		success:function(result){
			//console.log(result);
            //登录信息失效，ajax请求静态页面拦截
            onComplete(result);
            eventDetailDeal(result);
		},
		error:function(XMLHttpRequest){
			error_500(XMLHttpRequest.responseText);
		}
	});
}
/**
 * 往页面上绑定数据--明细
 * @param result
 */
function eventDetailDeal(result){
	leftChose = 1;
	eLeftClass("container-left-item2","event-details-leftDown");
	$("div.event-details-leftDown").render(result.data);//页面上绑定数据
	$('.inputRemove').click(function(){
		$('#event_category').attr('value','');
		$('#event_categoryCode').attr('value','');
		bandResource(1,'');
	})
	bandResource(1);//资源数据
}
/**
 * 点击工单
 */
function eventWorkClick(eventWorkDeal){
	$.ajax({
		url:eWorkOrderUrl,
		type:"get",
		data:{"eventId":eventId},
		dataType:"json",
		success:function(result){
			//console.log(result);
			if(1 == result.status){
                //登录信息失效，ajax请求静态页面拦截
                onComplete(result);
                eventWorkDeal(result);
			}
		},
		error:function(XMLHttpRequest){
			error_500(XMLHttpRequest.responseText);
		}
	});
}
/**
 * 往页面上绑定数据--工单
 */
function eventWorkDeal(result){
	leftChose = 2;
	eLeftClass("container-left-item3","event-workOrder-leftDown");
	var data = result.data;
	dataDiv = $("div.event-workOrder-leftDown");
	dataDiv.render(data);//页面上的数据
	setLeftHeight();
}
/**
 *点击 解决方案
 **/
function soluTionClick(soluTionDeal){
	leftChose=4
	eLeftClass("container-left-item4","event-solve-leftDown");
	setLeftHeight();
//	//新方案里面的内容是隐藏的
//	$("#ServiceOrder_solved ul li").css("display","none");
	 //载入新方案
	eventSolutionDeal();
}
/*
 *点击 工作日志
 */
function workDaily(){
	leftChose=6
	eLeftClass("container-left-item5","event-log-leftDown");
	setLeftHeight();
	loadOrderWorkLogInfo(eventId);
}
///**
// * 加载解决方案	 
// */
function eventSolutionDeal(){
   	$.ajax({
		traditional: true,
		url: loadSolutionsOfEventUrl,
		dataType: "json",
		type: 'get',
		async: true,
		data:{
			eventId:eventId,
			searchText:""
		},
		contentType: 'application/x-www-form-urlencoded; charset=UTF-8', // 防止乱码
		success: function(data){
			// 登录信息失效，ajax请求静态页面拦截
			onServiceComplete(data);
			console.log(data.data)
			if(data.status=="1" && data.data.length!==0){
				$(".conAssetNodata").css('display','none');
				$(".eventsolveoutil").css("display","block");
				$(".reason_analysts").html(data.data[0].reason_analysts);
				$(".treating_process").html(data.data[0].treating_process);
				$(".treating_result").html(data.data[0].treating_result);
				$(".modalname").html($(".userName").html());
				$(".modalTime").html(getMyDate(data.data[0].create_time))
			}else{
				$(".conAssetNodata").css('display','block');
				$(".eventsolveoutil").css("display","none");
			}
		},
		error: function(XMLHttpRequest) {
			error_500(XMLHttpRequest.responseText);
		}
	});
   		
   }

//function soluTionClick(soluTionDeal){
//	
//}

//function soluTionClick(soluTionDeal){
//	
//}
//点击工作日志
function loadOrderWorkLogInfo(eventId) {
	$.ajax({
		traditional: true,
		url: loadOrderWorkLogUrl,
		dataType: "json",
		type: 'POST',
		async: true,
		data:{
			workOrderId:eventId
		},
		contentType: 'application/x-www-form-urlencoded; charset=UTF-8', // 防止乱码
		success: function(data){
			//登录信息失效，ajax请求静态页面拦截
			console.log(data);
			onServiceComplete(data);
			if(data.length>0){
				$(".workoldnull").css('display','none');
				$(".event-log-content1").css('display','block');
			for(var i=0;i<data.length;i++){
				data[i].create_time1=data[i].create_time;
			}
			var datakey=data;
			
			var datakey1=datakey.slice();
			for(let i=0;i<datakey.length;i++){
				for(let j=i;j<datakey.length;j++){
					if(j!=i && datakey[i].create_time && datakey[j].create_time && datakey[i].create_time==datakey[j].create_time){
						//删除对象的create_time属性！
						delete datakey[j].create_time;
					}
				}
			}
			console.log(datakey);
			var editAndDelBtn = {
				create_time: {
					text:function(){
						if(this.create_time==undefined){
							return ""	
						}else{
							return this.create_time.substring(5,7)+"月"+this.create_time.substring(8,10)+"日"+" "+getMyDay(new Date(this.create_time.substring(0,4),this.create_time.substring(5,7),this.create_time.substring(8,10)));
						}
					}
				},
				create_time1:{
					text:function(){
						return this.create_time1;
					}
				},
				datacreatetime:{
					style:function(){
						if(this.create_time==undefined){
							return 'display:none';
						}
					}
				},
				eventlogeditOrdelete:{
					style:function(){
						if(this.create_time==undefined){
							return "display:none";
						}
					}
				},
				eventlogcontent1images:{
					style:function(){
						if(this.create_time==undefined){
							return "display:none";
						}
					}
				},
				eventlogdeleteId:{
					id:function(){
						return "eventlogdeleteId"+this.id
					}
				}
			};
				$(".event-log-content1").render(datakey,editAndDelBtn);
			}else{
				$(".workoldnull").css('display','block');
				$(".event-log-content1").css('display','none');
		}
	},
		error: function(XMLHttpRequest) {
			error_500(XMLHttpRequest.responseText);
		}
	});
}

/**
 * 点击历史
 */
function eventHistoryClick(eventHistoryDeal,arrowType){
    // arrow代表值  0:置顶; 1:下一条; -1:上一条
    if (arrowType == 0) {
      startHistoryItem = 0;
    }else {
      startHistoryItem = startHistoryItem + arrowType;
    }
    if (startHistoryItem < 0) {
      startHistoryItem = 0;
    }

    $.ajax({
      url: getHistoricalInfoUrl,
      type: 'get',
      data: {
        'type':92,
        'type_id': eventId,
        'numbers':numbersHistoryItem,
        'start': startHistoryItem
      },
      dataType: 'json',
      success: function(result){
        //登录信息失效，ajax请求静态页面拦截
        onComplete(result);
        eLeftClass("container-left-item6","event-history-leftDown");
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

          eventHistoryDeal(result);
          $(".conHistory-content").removeClass("dn");
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
 function eventHistoryDeal(result){
   leftChose = 5;

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
    /* 设置历史记录时间轴的竖线 */
   var start = $(".conHistory-content-right:first").find(".history-point i")[0].getBoundingClientRect().bottom;
   var end = $(".conHistory-content-right:last").find(".history-point i")[0].getBoundingClientRect().top;
   $(".conHistory-content-right:first").find(".history-point>div").css('height',(end-start));

   setTimeout(setLeftHeight,50);
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
 * 加载和该事件相关的资产
 */
function bandResource(page,event_categoryCode){
	//绑定资源的数据
	$.ajax({
		url:loadResourceUrl,
		type:"post",
		data:{"page":page,"eventId":eventId,'category': event_categoryCode},
		dataType:"json",
		success:function(result){

            //登录信息失效，ajax请求静态页面拦截
            onComplete(result);

			if(result.status == 1){
				var data = result.data;
				//console.log(data);
				resourceData(data,page);
			}
		},
		error:function(XMLHttpRequest){
			error_500(XMLHttpRequest.responseText);
		}
	});
}
/**
 * 绑定资源的数据
 * @param data
 */
function resourceData(data,currentPageH){
	$("ul.event-details-tableRow .table-col1").removeClass("active");
	$("ul.event-details-tableRow i.active").removeClass("active");
	var pageData = $("div.pageSmall");//分页数据
	var resData = $("div.resourceData");//资源数据
	var resNoData = $("#noneWidthAsset");//资源无数据
	resNoData.hide();
	resData.hide();
    //分页样式
    var pageVal={
    		 prePage:{
    			 class:function(){
    				 if(this.currentPage - 1 == 0 || this.currentPage == 0){
    					 return "proClick";
    				 }else{
    					 return "proClick active";
    				 }
    			 }
    		 },
    		 nextPage:{
    			 class:function(){
    				 if(this.totalPage - 1 == 0 || this.totalPage-this.currentPage == 0){
    					 return "nextClick";
    				 }else{
    					 return "nextClick active";
    				 }
    			 }
    		 }
    };
    var pageMsg;
	if(null != data && data.length>0){
		resData.show();
		$('.event-details-tableTitle').show();
		setLeftHeight();
		var totalPage = data[0].PageNum;//总页数
		var totalNum = data[0].totalNum;//总条数
	    var currentPage = currentPageH;//当前页数
	    var firstData = (currentPage-1)*(numEachPage)+1;
		var lastData;
	    if(data.length - numEachPage == 0){
	        lastData = firstData-1 + numEachPage;
	    }else{
	        lastData = firstData-1 + (data.length)%(numEachPage);
	    }
	    //绑定分页数据
	    pageMsg={
	        "currentPage":currentPage,
	    	"totalPage":totalPage,
	    	"firstData":firstData,
	    	"lastData":lastData,
	    	"totalNum":totalNum
	    };
      /*有关联资产时,显示列表;没有时,显示无信息背景*/
      if (data.length) {
        resData.render(data);
        $("#hasWidthAsset").css("display","block").next().css("display","none");
        setLeftHeight();
//      $('#container-left').css('height',$('#container-right').outerHeight()+30+'px');
//      $('.event-info-right').css('height',$('.event-info-left').outerHeight()+'px');
      }
	}else{
//		pageMsg={
//		        "currentPage":0,
//		    	"totalPage":0,
//		    	"firstData":0,
//		    	"lastData":0,
//		    	"totalNum":0
//		    };

		resNoData.show();
		$('.event-details-tableTitle').hide();
		setLeftHeight();

	}
	//分页数据
	pageData.render(pageMsg,pageVal);
}
/**
 * 点击下一页
 */
function nextPageClick(){
	var pageHelp = $("#currentPage").val();
	var totalPage = $("#totalPage").val();
	//判断当前页数与总页数大小
	if(totalPage - pageHelp > 0){
		pageHelp++;
		bandResource(pageHelp);
	}else{
		$("#tipMsg").addClass("active").html("最后一页").show();

		function hideMsg() {
			$("#tipMsg").addClass("active").html("最后一页").hide();
		}
		setTimeout(hideMsg, 1500);
	}
}
/**
 * 点击上一页
 */
function proPageClick(){
	var pageHel = $("#currentPage").val();
	if(pageHel-0 > 1){
		pageHel--;
		bandResource(pageHel);
	}else{
		$("#tipMsg").addClass("active").html("第一页").show();

		function hideMsg() {
			$("#tipMsg").addClass("active").html("第一页").hide()
		}
		setTimeout(hideMsg, 1500);
	}
}
/**
 * 点击明细页面里的添加资产
 */
function resAddClick(){
	$("#selectAsset").modal("show");
	$("#likeId").val("");
	$("div.modal-body-bottom-rowWrap i").removeClass("active");//去掉对勾
	reLikeClick();
}
/**
 * 资源模糊搜索
 */
function reLikeClick(){

	var resList = $("div.resList");//资源数据
	var resNoData = $("#modal-none");//没有数据
	resList.hide();
	resNoData.hide();
	var like = $("#likeId").val();
	//绑定资源的数据
	$.ajax({
		url:loadResourceUrl,
		type:"post",
		data:{"like":like,"eventId":eventId},
		dataType:"json",
		success:function(result){

            //登录信息失效，ajax请求静态页面拦截
            onComplete(result);

			var data = result.data;
			if(data.length>0){
				resList.show();
				resList.render(data);
			}else{
				resNoData.show();
			}
		},
		error:function(XMLHttpRequest){
			error_500(XMLHttpRequest.responseText);
		}
	});
}
/**
 * 点击明细页面里的删除资产
 */
function resDeleteClick(){
	var ids = checkBoxIds("event-details-table");
	if(ids.length>0){
		$("#pupDelete3").modal("show");
	}
}
/**
 * 确认解除关联
 */
function sureDeleteClick(){
	var ids = checkBoxIds("event-details-table");
	$.ajax({
		url:resEventDeleteUrl,
		type:"get",
		traditional: true,
		data:{"eventId":eventId,"ids":ids},
		dataType:"json",
		success:function(result){

            //登录信息失效，ajax请求静态页面拦截
            onComplete(result);

			outBoxClose(result.msg,"pupDelete3");
			eventDetailClick(eventDetailDeal);
			//改变状态后刷新一下页面
			loadEventDetail(eventId,eventDataDeal);
		},
		error:function(XMLHttpRequest){
			error_500(XMLHttpRequest.responseText);
		}
	});
}
/**
 * 点击每个资源前面的小框
 */
function resBoxClick(){
	if($(this).hasClass("active")){
		$(this).removeClass("active");
		$(this).find('i').removeClass('active');

	}else{
		$(this).addClass("active");
		$(this).find('i').addClass('active');
	}

	var ids = getCheckRes();
    showDelButton(ids);
}
function getCheckRes(){
	var ids = [];
    var $checkPro = $(".event-details-table").find("i.active").next();
    $checkPro.each(function(){
        ids.push($(this).val());
    });
    return ids;
}
/**
 * 改变“删除”样式
 * @param ids
 */
function showDelButton(ids){

    if(ids.length == 0){
        $('#AssetsDeleteBox').attr('disabled','true');
        $('#AssetsDeleteBox .AssetsDelete').addClass('disabled');

    }else{
        $('#AssetsDeleteBox').attr('disabled',false);
        $('#res_delete .AssetsDelete').removeClass('disabled');
    }
}

/**
 * 获取被选中的事件ids
 * @returns {Array}
 */
function checkBoxIds(idsArea){
	var ids = [];
	var $checkboxs = $("div."+idsArea).find("i.active").next();
	//遍历jquery对象
	$checkboxs.each(function(){
		ids.push($(this).val());
	});
	return ids;
}
/**
 * 点击保存，关联事件资源
 */
function resEventClick(){
	var ids = checkBoxIds("modal-body-bottom-rowWrap");
	if(ids.length>0){
		$.ajax({
			url:resEventUrl,
			type:"get",
			traditional: true,
			data:{"eventId":eventId,"ids":ids},
			dataType:"json",
			success:function(result){

                //登录信息失效，ajax请求静态页面拦截
                onComplete(result);

				outBoxClose(result.msg,"selectAsset");
				eventDetailClick(eventDetailDeal);
				//改变状态后刷新一下页面
				loadEventDetail(eventId,eventDataDeal);
			},
			error:function(XMLHttpRequest){
				error_500(XMLHttpRequest.responseText);
			}
		});
	}
}
/**
 * 前一事件
 */
function preEventClick(){
	var fcc = getCookie("fc");//字符串
	if(null != fcc){
		var fc = JSON.parse(fcc);//对象
		var ids = fc.ids;
		//当前事件的id
		var currentId = eventId;
		var index;
		for(var i=0;i<ids.length;i++){
			if(currentId == ids[i]){
				index = ids[(i-1)];
				break;
			}
		}
		if(null == index){
			//当前页的第一条数据
			var page = fc.page;
			//发送请求，得到上一页的数据，并改变cookie中的值
			if(1 == page){
				outBoxClose("第一个事件");
			}else{
				page--;
				fc.page = page;
				getIds(fc,true);
			}
		}else{
			//取到前一事件的id
			eventId = index;
			loadEventDetail(eventId,eventDataDeal);
//			leftChoseClick(leftChose);
		}
	}
}
/**
 * 后一事件
 */
function nextEventClick(){
	var fcc = getCookie("fc");//字符串
	if(null != fcc){
		var fc = JSON.parse(fcc);//对象
		var ids = fc.ids;
		//当前事件的id
		var currentId = eventId;
		var index;//下一条数据的id
		for(var i=0;i<ids.length;i++){
			if(currentId == ids[i]){
				index = ids[(i+1)];
				break;
			}
		}
		if(null == index){
			//当前页数
			var page = fc.page;
			var allNum = fc.allNum;//本页数据数量
			var eventTotal = fc.eventTotal;//数据总数量
			//发送请求，得到下一页的数据，并改变cookie中的值
			if((page-1)*10+allNum == eventTotal){
				outBoxClose("最后一个事件");
			}else{
				page++;
				fc.page = page;
				getIds(fc,false);
			}
		}else{
			//取到后一事件的id
			eventId = index;
			loadEventDetail(eventId,eventDataDeal);
//			leftChoseClick(leftChose);
		}
	}
}
/**
 * 获取当前页的下一页或者上一页的事件ids，
 * @param fc 事件列表页的查询条件
 * @param flag 前一事件或者后一事件的区别标志
 */
function getIds(fc,flag){
	$.ajax({
		url:eventIdsUrl,
		type:"post",
		data:{"eOverAll":fc.eOverAll,"eType":fc.eType,"eCreateTime":fc.eCreateTime,
			  "eStatus":fc.eStatus,"eAsker":fc.eAsker,"eManager":fc.eManager,
			  "ePriority0":fc.ePriority0,"ePriority1":fc.ePriority1,"ePriority2":fc.ePriority2,
			  "eUrgent0":fc.eUrgent0,"eUrgent1":fc.eUrgent1,"eUrgent2":fc.eUrgent2,
			  "eCompare":fc.eCompare, "sort":fc.sort,"page":fc.page,
			  "like":fc.like,"startTime":fc.startTime,"endTime":fc.endTime,"eTimeOut":fc.eTimeOut},
		dataType:"json",
		success:function(result){
            //登录信息失效，ajax请求静态页面拦截
            onComplete(result);
            
			if(successReturnCom == result.status){
				var data = result.data;//该页事件的ids
				var eventTotal = result.dataSub;//所有事件的总数
				if(null != data){
					if(flag){
						eventId = data[data.length-1];
					}else{
						eventId = data[0];
					}
					loadEventDetail(eventId,eventDataDeal);//右侧内容
//					leftChoseClick(leftChose);//中间内容
					fc.ids = data;
					fc.allNum = data.length;//这页一共多少条数据
					fc.eventTotal = eventTotal;//一共多少个事件
					delCookie("fc");
					addCookie("fc",JSON.stringify(fc),24);
				}
			}
		},
		error:function(XMLHttpRequest){
			error_500(XMLHttpRequest.responseText);
		}
	});
}
/**
 * 点击“前一事件”或者“后一事件”时，
 * 如果在“明细”页面进行的事件切换，则应该也显示另一个事件的明细信息，即在切换事件时保持事件当前信息页面不变
 */
function leftChoseClick(flag){
	console.log(flag);
	switch(flag){
	case 0:eventCoverClick(eventCoverDeal);break;//会话
	case 1:
		if($("li.container-left-item2").hasClass(dn)){
			
		}else{
			eventDetailClick(eventDetailDeal);break;//明细
		}

	case 2:
		if($("li.container-left-item3").hasClass(dn)){
			eventCoverClick(eventCoverDeal);break;	
		}else{
			eventWorkClick(eventWorkDeal);break;//工单
		}
//	case 3:
//		if($("li.container-left-item4").hasClass(dn)){
//			eventCoverClick(eventCoverDeal);break;
//		}else{
//			eventWorkClick(eventWorkDeal);break;//工单
//		}
//	case 3:eventCoverClick(eventCoverDeal);break;//解决方案
//	case 4:eventCoverClick(eventCoverDeal);break;//工作日志
//	case 5:eventCoverClick(eventCoverDeal);break;//历史
//	case 6:eventCoverClick(eventCoverDeal);break;//评价
	default:eventCoverClick(eventCoverDeal);
	}
}
/**
 * 文件下载弹框
 */
function fileDownload(){
	$("#accessory").modal("show");
  /*bug 181 增加显示“无内容提示”*/
  $("#accessory #modal-none").css("display","none");
}
/**
 * 点击“会话”里的修改内容
 */
function editSelfClick(){
	var content = $(this).parents("div.operationGroup").prev().html();
	var contentDiv = $(this).parents("li.paragraphCotentLi").next();
	var contentHide = $(this).parents("li.paragraphCotentLi");
	contentDiv.removeClass(dn);
	contentHide.addClass(dn);
	contentDiv.find("textarea").text(content);
	setLeftHeight();
}
var converId;
/**
 * 点击”会话“里的删除
 */
function deleteSelfClick(){
	$("#pupDelete").modal("show");
	converId = $(this).prev().val();
}
/**
 * 确定删除
 */
function  deleteConver(){
	if(null != converId && "" != converId){
		$.ajax({
			url:conversationDeleteUrl,
			type:"get",
			data:{converId:converId,eventId:eventId},
			dataType:"json",
			success:function(result){

	            //登录信息失效，ajax请求静态页面拦截
	            onComplete(result);

	            updateCancel();
				eventCoverClick(eventCoverDeal);
				outBoxClose(result.msg,"pupDelete");
			},
			error:function(XMLHttpRequest){
				error_500(XMLHttpRequest.responseText);
			}
		});
	}
}
/**
 * 点击”会话“里的保存(修改内容)
 */
function saveClick(){
//console.log("点击回复了");
	var converDiv = $(this).parents("li.paragraphEditLi");
	var converId = converDiv.prev().find("[data-bind='id']").val();
	if(null != converId && ""!=converId){
		var converContent = converDiv.find("textarea").val();
		$.ajax({
			url:conversationUpdateUrl,
			data:{converId:converId,converContent:converContent,eventId:eventId},
			type:"post",
			success:function(result){
                //登录信息失效，ajax请求静态页面拦截
                onComplete(result);
                
				//如果删除成功，则把文本框去掉，失败的话，不去掉。
				if(successReturnCom == result.status){
//					cancelClick();
					updateCancel();
					eventCoverClick(eventCoverDeal);
				}
				outBoxClose(result.msg);
			},
			error:function(XMLHttpRequest){
				error_500(XMLHttpRequest.responseText);
			}
		});
	}
}
/**
 * 点击取消，关闭修改会话的编辑框
 */
function updateCancel(){
	$("li.paragraphEditLi").addClass(dn);
	$("li.paragraphCotentLi").removeClass(dn);
	setLeftHeight();
}
/**
 * 点击“会话”里的取消
 */
function cancelClick(){
	$("div.evaluateContent").addClass("dn");
};
///**
// * 点击“+创建新方案”弹窗
// */
//function CreateNewSvScheme(){
//	$("#CreateNewSvScheme").click(function(){
//		$("#CreateSvScheme").modal("show");
//	})
//}

/*附件弹窗-删除*/
// function deleteFile(e){
//   console.log("可以在这里写ajax");
// }
/**动态监听元素高度改变方法**/
var resize = function($obj,func) {
    var newheight = $obj.outerHeight();
    var oldheight = $obj.data("oldheight");
    if (!oldheight){
        $obj.data("oldheight",newheight);
        return;
    }
    if( newheight == oldheight){
        return;
    }
    $obj.data("oldheight",newheight);
    if(arguments[1]){
        func.call(this,$obj);
    }
};


function eventCoverPrintDeal(result){
	console.log(result);
}

var eventInfo = $("div.eventInfo");
var eventWorkOrder = $("div.eventWorkOrder");
var eventConver = $("#eventConver");
var personInfo = $("#personInfo");
var dataArea = new Object();
dataArea.eventInfo = eventInfo;//事件明细
dataArea.eventWorkOrder = eventWorkOrder;//工单信息
dataArea.eventConver = eventConver;//会话信息
dataArea.personInfo = personInfo;//人员信息
/**
 * 往打印的弹框里写数据
 * @param result 数据
 * @param dataArea 绑定数据的区域（说明见上）
 */
var eventPrint = function loadPrintData(dataArea){
	//事件明细
	eventDetailClick(function(result){
		dataArea.eventInfo.render(result.data);//打印弹框里绑定数据
	});
	//工单数据
	eventWorkClick(function(result){
		dataArea.eventWorkOrder.render(result.data);
	});
	//会话数据
	eventCoverClick(function(result){
		dataArea.eventConver.render(result.data.conversation_info);
	});
	//管理人  请求人 执行人
	loadEventDetail(eventId,function(result){
		dataArea.personInfo.render(result.data);
	});
	//解决方案、工作日志、历史，暂时没数据
}

/*打印功能*/
function ePrintClick(){
	eventPrint(dataArea);
    $("#print").modal("show");
    
    /*只在第一项上打勾,只显示第一项的内容*/
    $("i.classRe").removeClass("active");
    $("i.classRe:first").addClass("active");
    $("#print .modal-body-everyItem").css("display","none");
    $("#print .modal-body-everyItem:first").css("display","block");
}
/*选择打印项*/
function choosePrint(e){
    var $i = $(this).children("i");
    var checkedFlag = $i.hasClass("active");
    var idx = $(this).index()-1;
    
    //显示or隐藏 下面对应的打印内容;
    if (checkedFlag) {
      $i.removeClass("active");
      $(".modal-body-everyItem").eq(idx).css("display","none");
    }else {
      $i.addClass("active");
      $(".modal-body-everyItem").eq(idx).css("display","block");
    }
}
/*在打印框选择页中按[打印键]*/
function ePrintClick2(){
  var canPrint = 0;   //打印项数量
  var printFlag = "";  //打印信息

  if ($("#res_info").hasClass("active")) {
    printFlag += "&res_info=1";
    canPrint++;
  }else {
    printFlag += "&res_info=2";
  }
  if ($("#res_workSheet").hasClass("active")) {
    printFlag += "&res_workSheet=1";
    canPrint++;
  }else {
    printFlag += "&res_workSheet=2";
  }
  if ($("#res_solution").hasClass("active")) {
    printFlag += "&res_solution=1";
    canPrint++;
  }else {
    printFlag += "&res_solution=2";
  }
  if ($("#res_workLog").hasClass("active")) {
    printFlag += "&res_workLog=1";
    canPrint++;
  }else {
    printFlag += "&res_workLog=2";
  }
  if ($("#res_conversition").hasClass("active")) {
    printFlag += "&res_conversition=1";
    canPrint++;
  }else {
    printFlag += "&res_conversition=2";
  }
  if ($("#res_history").hasClass("active")) {
    printFlag += "&res_history=1";
    canPrint++;
  }else {
    printFlag += "&res_history=2";
  }
  if ($("#res_application").hasClass("active")) {
    printFlag += "&res_application=1";
    canPrint++;
  }else {
    printFlag += "&res_application=2";
  }
  if ($("#res_manager").hasClass("active")) {
    printFlag += "&res_manager=1";
    canPrint++;
  }else {
    printFlag += "&res_manager=2";
  }
  if ($("#res_executor").hasClass("active")) {
    printFlag += "&res_executor=1";
    canPrint++;
  }else {
    printFlag += "&res_executor=2";
  }

  if (canPrint==0) {
    $("#pupDelete2").modal("show");
  }else {
    window.open("printEveDetail.html?eventId="+eventId+printFlag);
  }
}

function loadOrderResByType(){
	// 从页面上获取当前资产分类选中条件
	var event_categoryCode = $("#event_categoryCode").val();
	// code直接从ztree中获取
	console.log(event_categoryCode);
	bandResource(1,event_categoryCode);
}

eventId = getUrlParam("eventId");
function setLeftHeight(){
	$('.container-right-infoWrap').css('height','');
	$('#container-left').css('height','');
	$('.event-info-left').css('height','');
	$('.event-info-right').css('height','');
	var eventLeft=$('.event-info-left').outerHeight();//右侧内容高度
	var eventRight=$('.event-info-right').outerHeight();//右侧右边高度
	var contaienrLeft=$('#container-left');//左侧切换栏
	if(eventLeft==eventRight){//左右相等
		$('.event-info-right').css('height','');
		$('#container-left').css('height',$('#container-right').outerHeight()+30+'px');
	}else if(eventLeft>eventRight){//左侧高度大于右侧高度 设置右侧为左侧高度
		//$('.container-right-infoWrap').css('height',$('.event-info-left').outerHeight()+'px');
		$('.event-info-right').css('height',eventLeft);
		contaienrLeft.css('height',$('#container-right').outerHeight()+30+'px');

	}else{//左侧高度小于右侧高度 设置左侧高度为右侧高度
		$('.event-info-right').css('height','');
		$('.event-info-left').css('height',eventRight);
		contaienrLeft.css('height',$('#container-right').outerHeight()+30+'px');
	}
}
$(function(){
	$("span.navlist-img2").addClass("active");
	//获取事件id
	//eventId = getUrlParamH("eventId");
	loadEventDetail(eventId,eventDataDeal);
	loadOptionData();
	loadPageEachNum();
	//-----------------上方按钮-----------------------------------
	//点击返回
	$('.container-right-title-back').click(backPage);
	//点击编辑
	$("button.btn-edit").click(eEditClick);
	//点击关闭
	$("button.btn-close").click(eCloseClick);
	//点击指派
	$("button.btn-toManager").click(eToManagerClick);
	//发布
	$("button.btn-publish").click(ePublishClick);
	//点击审核
	$("button.btn-check").click(eCheckClick);
	//点击回复
	$("button.btn-answer").click(eAnswerClickHelp);
	//点击前一事件
	$("span.event-page-left").click(preEventClick);
	//点击后一事件
	$("span.event-page-right").click(nextEventClick);
  //点击打印
  $("button.btn-print").click(ePrintClick);
  //点击方框里的打印选项
  $(".modal-body-choose li.modal-body-chooseItem").click(choosePrint);
	//-----------------左侧按钮-----------------------------------
	//点击会话
	$("li.container-left-item1").click(function(){
		$("#workOrder_log").css('display','none');
		eventCoverClick(eventCoverDeal)
	});
	//点击明细
	$("li.container-left-item2").click(function(){
		$("#workOrder_log").css('display','none');
		eventDetailClick(eventDetailDeal)	
	});
	//点击工单
	$("li.container-left-item3").click(function(){
		$("#workOrder_log").css('display','none');
		eventWorkClick(eventWorkDeal);	
	});
	//点击解决方案
	$("li.container-left-item4").click(function(){
		$("#workOrder_log").css('display','none');	
		soluTionClick();
	});
	//点击工作日志
	$("li.container-left-item5").click(function(){
		$("#workOrder_log").css('display','block');	
		workDaily();
		
	});
  	//点击历史(左侧) && 置顶历史信息
  	$("li.container-left-item6,.conHistory-content-toTop").on("click",function(){
  		$("#workOrder_log").css('display','none');	
  		eventHistoryClick(eventHistoryDeal,0)
  	});
	//点击评价
	$("li.container-left-item7").click();
	//-----------------右侧按钮-----------------------------------
	//点击执行人，管理人，请求人明细
	if($('#executor_down_ul li:eq(0)').hasClass('active')){
		$(this).find('#executorId').hide();
	}
	$("#executor_down_ul li:eq(0)").click(executorDetailClick);
	$("#asked_down_ul li:eq(0)").click(applicationDetailClick);
	$("#manager_down_ul li:eq(0)").click(managerDetailClick);
	//点击文件附件
	$("#fileCount").click(fileDownload);
	//-----------------每个页面里面的操作----------------------------
	//添加关联资源
	$("p.AdditionalAssetsBox").click(resAddClick);
	//关联资源的搜索按钮
	$("i.findRes").click(reLikeClick);
	//删除关联资源
	$("p.AssetsDeleteBox").click(resDeleteClick);
	//确认删除
	$("button.delete-click-res").click(sureDeleteClick);
	// 构建ztree
	creatTree("event_category-tree", "event_category-menu", "event_category", "event_categoryCode", loadCategoryZTreeUrl, true,loadOrderResByType);
	//点击上一页
	$("#proClick").click(proPageClick);
	//点击下一页
	$("#nextClick").click(nextPageClick);
	//点击每个资源前面的小框
	$("div.event-details-table,div.modal-body-bottom-rowWrap").on("click",".table-col1",resBoxClick);
	//点击资源弹框中的保存
//	$("button.keep-selectAsset").click(resEventClick);
	$("button.addEvent").click(resEventClick);
	//点击右下角回复
	$("p.answerBox").click(eAnswerClickHelp);
	//点击最下面的回复框
	$("#answerBottom").click(eAnswerClickHelp);
	//“会话”里，点击修改内容
	$("div.conversationDiv").on("click","div.editContent",editSelfClick);
	//“会话”里，点击删除
	$("div.conversationDiv").on("click","div.delete",deleteSelfClick);
	$("button.delete-click-con").click(deleteConver);//删除保存
	//“会话”里，点击保存（修改会话）
	$("div.conversationDiv").on("click","button.save",saveClick);
	//“会话”里，点击回复（修改会话）
  $("div.conversationDiv").on("click","i.answerBottom",saveClick);
	//“会话”里，点击取消
	$("div.conversationDiv").on("click","button.cancel",updateCancel);
	//"会话"最下面的取消按钮
	$("button.cancelAnswer").click(eNoAnswer);
	//”会话“里最下面的保存
	$("button.keep-batchReply").click(eAnswerClickSave);
  // 点击历史-前一条
  $(".conHistory-content-right-top.active").on("click",function(){
    if ($(this).hasClass("active")) {
      eventHistoryClick(eventHistoryDeal,-1)
    }
  });
  // 点击历史-后一条
  $(".conHistory-content-right-bottom.active").on("click",function(){
    if ($(this).hasClass("active")) {
      eventHistoryClick(eventHistoryDeal,1)
    }
  });

	//----------------------弹框里面的保存按钮-------------------------------------------
	//指派，搜索管理人
	$("#assignFind").click(loadManagerNoSelf);
	//指派，保存
	$("button.eToManage").click(toManagerSave);
	//发布保存
	$("button.keep-publish").click(publishSave);
	//审核通过
	$("button.keep-audit").click(keepAudit);
	//审核驳回
	$("button.cancel-audit").click(cancelAudit);
	//关闭保存
	$("button.close-keep").click(closeClick);
  //删除文件
  //在打印框选择页中按[打印键]
  $("#printDetail").click(ePrintClick2);
});
