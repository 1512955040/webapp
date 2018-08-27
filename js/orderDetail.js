var dn='dn';
var active = "active";
var slaTimeId;  //记录更新sla信息的定时器;
var startHistoryItem = 0; //记录请求历史信息时的起始位置
var numbersHistoryItem = 8;  //记录请求历史信息的条数;
/**
 * 服务商工单详情页Created by EKuter-amu on 2017/3/7.
 */
var eventStatusData, eventStatusValue; // 事件处理状态下拉选的数据
eventStatusData = [
    {
		value: "",
		eventStatusSelect: "---选择---"
	},
	{
		value: 59,
		eventStatusSelect: "未解决"
	},
	{
		value: 60,
		eventStatusSelect: "已解决"
	},
	{
		value: 61,
		eventStatusSelect: "不予解决"
	},
	{
		value: 62,
		eventStatusSelect: "已合并处理"
	}
];
eventStatusValue = {
	eventStatusSelect: {
		value: function() {
			return this.value;
		}
	}
}
var isGroupCharger = 0;
var isGroupMember = 1;
/**
 * 加载工单详情数据
 */
function loadWorkOrderDetailInfo(workOrderId, position, executor_user_id, user_id,printArea) {
	/**
	 * 请求、绑定详情页右侧数据信息
	 */
	$.ajax({
		traditional: true,
		url: eventDetailUrl,
		dataType: "json",
		type: 'POST',
		async: true,
		data: {
			eventId: workOrderId
		},
		contentType: 'application/x-www-form-urlencoded; charset=UTF-8', // 防止乱码
		success: function(data) {
			// 登录信息失效，ajax请求静态页面拦截
			onServiceComplete(data);
			console.log(data.data)
			$("#workOrder_slaId").val(data.data.solution_id);
			var detail_data = data.data;
			
			if(detail_data.work_order_status == 65) {

				changeTimeLine(0);

			} else if(detail_data.work_order_status == 66) {

				changeTimeLine(1);

			} else if(detail_data.work_order_status == 67) {

				changeTimeLine(2);

			} else if(detail_data.work_order_status == 68) {

				changeTimeLine(3);

			} else if(detail_data.work_order_status >= 69) {

				changeTimeLine(4);

			}
// var workOrderDetail = {
// detail_process: {
// class: function() {
// if(detail_data.work_order_status == 65) {
//
// return "event-process process1";
//
// } else if(detail_data.work_order_status == 66) {
//
// return "event-process process2";
//
// } else if(detail_data.work_order_status == 67) {
//
// return "event-process process3";
//
// } else if(detail_data.work_order_status == 68) {
//
// return "event-process process4";
//
// } else if(detail_data.work_order_status == 69) {
//
// return "event-process process5";
//
// }
// }
// }
// }
	// 工单服务等级class
	var detailVal = {
		serviceLevel:{
			class:function(){
				var level = this.service_level_name;
				var result = "";
				if("低" == level){
					result = "serviceLevel low";
				}else if("中" == level){
					result = "serviceLevel middle";
				}else if("高" == level){
					result = "serviceLevel high";
				}else if("紧急" == level){
					result = "serviceLevel urgency";
				}
					return result;
			}
		},
		workOrderFlag:{
			class:function(){
				var flag = this.event_type;
				var eventTypeFlag = "";
				switch(flag){
					case 49:eventTypeFlag = "accident";break;
					case 50:eventTypeFlag = "systemPatrol";break;
					case 51:eventTypeFlag = "support";break;
				}
				return eventTypeFlag;
			}
		}
	};
	$("#workOrderRightInfo").render(detail_data,detailVal);
	// console.log($('.event-info-left').outerHeight()+$('.container-right-title').outerHeight()+30+'px');
	$('#container-left').css('height',$('.event-info-left').outerHeight()+$('.container-right-title').outerHeight()+30+'px');
	$('.event-info-right').css('height',$('.event-info-left').outerHeight()+'px');
      var eStatus = detail_data.events_status_id;
      var responseContent;  //responseInfo里的内容
      var resolveContent;  //resolveContent里的内容

	  if(54 == eStatus){
	  	  $("#slaInfo").show();
          $("#executor_down_ul").hide();
	  	  $('.event-info-right').css('height',$('.event-info-left').outerHeight()+'px');
		  //$('.event-info-right').css('height','');
		  $('#container-left').css('height',$('.event-info-left').outerHeight()+$('.container-right-title').outerHeight()+30+'px');
	  }else if(58 == eStatus){
	  	  $("#slaInfo").show();
          $("#executor_down_ul").show();
	  	  $('.event-info-right').css('height',$('.event-info-left').outerHeight()+'px');
		  //$('.event-info-right').css('height','');
		  $('#container-left').css('height',$('.event-info-left').outerHeight()+$('.container-right-title').outerHeight()+30+'px');
	  }else{
	  	  $("#slaInfo").show();
          $("#executor_down_ul").show();
	  	  $('.event-info-right').css('height',$('.event-info-left').outerHeight()+'px');
		  //$('.event-info-right').css('height','');
		  $('#container-left').css('height',$('.event-info-left').outerHeight()+$('.container-right-title').outerHeight()+30+'px');
	  }
	  
	  //附件弹窗以及附件数目绑定
		var electronic_type = data.dataSub;
			if(null != electronic_type) {
				var attachmentCount = electronic_type.length;
				data.attachment = attachmentCount;
			} else {
				data.attachment = 0;
			}

			$("#attachment").render(attachmentCount);
			$(".event-info-right").render(data);
////			$("#conDetailLeft").render(data);
//			$("#titleInfo").render(data);
			//$("#resourceDetailId").render(data);
//			var conStatus = data.approval_status;
//          groupId = data.operstion_group_id;
//			loadConDetailSLAList(conStatus);
//          loadOperationGroupInfo(groupId);
            //绑定文件的下载路径
            var hrefVal={
                dataSub:{
                	href:function(){
                	return this.filePath;
                }
            }
        }
        $("div.contractFile").render(data.dataSub,hrefVal);
      //定时更新右侧SLA时间信息
      var regularSlaTime = function(){
        if ((52==eStatus)||(53==eStatus)) {
        }else if(54 == eStatus){  //未响应&未解决
          responseContent = calcTime1(detail_data.publish_date,detail_data.response);
          resolveContent = calcTime1(detail_data.publish_date,detail_data.address_aging);
        }else if(58 == eStatus){  //已响应&已解决
          responseContent = calcTime2(detail_data.publish_date,detail_data.order_time,detail_data.response);
          resolveContent = calcTime2(data.publish_date,data.address_aging_date,data.address_aging);
        }else {  //已响应&未解决
          responseContent = calcTime2(detail_data.publish_date,detail_data.order_time,detail_data.response);
          resolveContent = calcTime1(detail_data.publish_date,detail_data.address_aging);
        }
        $("#responseInfo").text(responseContent);
        $("#resoveInfo").text(resolveContent);
      };
      /*清除sla时间定时器,确保清除*/
      clearInterval(slaTimeId);
      /*定时更新sla 时间信息*/
      slaTimeId = setInterval(regularSlaTime,60000);
      regularSlaTime(eStatus,data);

			elementUpShow(position, executor_user_id, user_id,detail_data.work_order_status,detail_data.dispatch_flag);
            loadConnectSLAInfo(detail_data.sla_id);
			//if(position == 0 && detail_data.work_order_status == 65) {
			//	$("#change_acceptOrder").hide();
			//	$("#submit_inner").hide();
			//	$("#submit_final").hide();
			//	$("#change_to").hide();
			//	$("#order_back").hide();
			//} else if(detail_data.work_order_status == 66 && executor_user_id == user_id && detail_data.dispatch_flag != 76) {
			//	$("#change_acceptOrder").hide();
			//	$("#submit_final").hide();
			//	$("#accept_order").hide();
			//	$("#order_back").hide();
			//} else if(position == 0 && detail_data.work_order_status == 67) {
			//	$("#change_acceptOrder").hide();
			//	$("#submit_inner").hide();
			//	$("#change_to").hide();
			//	$("#accept_order").hide();
			//	$("#order_back").hide();
			//} else if(detail_data.dispatch_flag == 76 && executor_user_id == user_id) {
			//	$("#change_acceptOrder").hide();
			//	$("#accept_order").hide();
			//	$("#submit_inner").hide();
			//	$("#submit_final").hide();
			//	$("#change_to").hide();
			//} else if(detail_data.dispatch_flag == 76 && dispatch_user == user_id) {
			//	$("#accept_order").hide();
			//	$("#submit_inner").hide();
			//	$("#submit_final").hide();
			//	$("#change_to").hide();
			//	$("#order_back").hide();
			//} else {
			//	$("#change_acceptOrder").hide();
			//	$("#accept_order").hide();
			//	$("#submit_inner").hide();
			//	$("#submit_final").hide();
			//	$("#change_to").hide();
			//	$("#order_back").hide();
			//}
			//绑定打印页面的执行人，管理人，请求人数据
			if(null != printArea){
				printArea.render(detail_data);
			}
		},
		error: function(XMLHttpRequest) {
			error_500(XMLHttpRequest.responseText);
		}
	});

	loadWorkOrderDetail(workOrderId);

}
function elementUpShow(position, executor_user_id, user_id,orderStatus,dispatch_flag){
	//页面按钮的显示与否
	//需要管理的标签，上面的一排按钮
	var elementsUp = ["change_acceptOrder","accept_order","submit_inner",
	                  "submit_final","change_to","order_back"];
	//全部隐藏按钮
	for(var i=0;i<elementsUp.length;i++){
		$("#"+elementsUp[i]).hide();
	}
	var rules = {
			//组长+执行人
			0:["order_back","submit_inner","accept_order","submit_final","change_to"],
			//组长+干系人
			1:["accept_order","submit_final","change_acceptOrder"],
			//组长
			2:["accept_order","submit_final","change_acceptOrder"],
			//组员+执行人
			3:["order_back","submit_inner","change_to"],
			//组员+干系人
			4:["change_acceptOrder"],
			//组员
			5:["change_acceptOrder"]
	}
	var userPower = 5;
	if(null != position && null != executor_user_id && null != user_id){
		if(isGroupCharger == position){
			if(executor_user_id == user_id){
				userPower = 0;
			}else{
				userPower = 1;
			}
		}else{
			if(executor_user_id == user_id){
				userPower = 3;
			}else{
				userPower = 5;
			}
		}
	}
	//按照当前用户的角色筛选结果
	var showE = showElements(elementsUp,userPower,rules).show;

	var statusRule = {
			65:["accept_order"],
			66:["submit_inner"],
			67:["submit_final"],
			68:[],
			69:[]
			//75:["change_to"],
			//76:["order_back"],
			//77:["accept_order"]
	};
	if(null == orderStatus){
		orderStatus = 69;
	}
	//按照工单状态筛选结果
	var showEle = showElements(showE,orderStatus,statusRule).show;
	for(var i=0;i<showEle.length;i++){
		$("#"+showEle[i]).show();
	}
    if(orderStatus == 66){
        if(null == dispatch_flag){
            dispatch_flag = 75;
        }
        var dispatchRule = {
            75:["change_to"],
            76:["order_back"],
            77:["accept_order"]
        }

        var showDispatch = showElements(showE,dispatch_flag,dispatchRule).show;
        for(var i=0;i<showDispatch.length;i++){
            $("#"+showDispatch[i]).show();
        }
    }

}
/** 修改时间轴状态* */
function changeTimeLine(status){
	if(status==0){
		$('.order_item').eq(status).addClass('active').parent().prevAll().find('.order_item').addClass('active');
		$('.filling_line').css('width','46px');
	}else if(status==1){
		$('.order_item').eq(status).addClass('active').parent().prevAll().find('.order_item').addClass('active');
		$('.filling_line').css('width','163px');
	}else if(status==2){
		$('.order_item').eq(status).addClass('active').parent().prevAll().find('.order_item').addClass('active');
		$('.filling_line').css('width','290px');
	}else if(status==3){
		$('.order_item').eq(status).addClass('active').parent().prevAll().find('.order_item').addClass('active');;

		$('.filling_line').css('width','416px');
	}else if(status==4){
		$('.order_item').eq(status).addClass('active').parent().prevAll().find('.order_item').addClass('active');
		$('.filling_line').css('width','598px');
		$('.time_line').addClass('end');
	}
}

//未响应和未解决
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
//已响应和已解决
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



/**
 * 加载工单对应的SLA信息
 * */
function loadConnectSLAInfo(sla_id){
    $.ajax({
        traditional: true,
        url: loadSLADetailUrl,
        dataType: "json",
        type: 'POST',
        async: true,
        data: {
            sla_id: sla_id
        },
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8', // 防止乱码
        success: function(data) {

            // 登录信息失效，ajax请求静态页面拦截
            onServiceComplete(data);
            console.log(data);
            var SLAInfoDefined = {
                LogoSmallClass:{
                    class: function () {
                        if(this.LOGO == 1){
                            return "jin";
                        }else if(this.LOGO == 2){
                            return "yin";
                        }else if(this.LOGO == 3){
                            return "tong";
                        }else if(this.LOGO == 4){
                            return "one";
                        }else if(this.LOGO == 5){
                            return "two";
                        }else if(this.LOGO == 6){
                            return "three";
                        }else if(this.LOGO == 7){
                            return "high";
                        }else if(this.LOGO == 8){
                            return "middle";
                        }else if(this.LOGO == 9){
                            return "low";
                        }
                    }
                },
                LogoBigClass:{
                    class: function () {
                        if(this.LOGO == 1){
                            return "jinpai";
                        }else if(this.LOGO == 2){
                            return "yinpai";
                        }else if(this.LOGO == 3){
                            return "tongpai";
                        }else if(this.LOGO == 4){
                            return "one";
                        }else if(this.LOGO == 5){
                            return "two";
                        }else if(this.LOGO == 6){
                            return "three";
                        }else if(this.LOGO == 7){
                            return "high";
                        }else if(this.LOGO == 8){
                            return "middle";
                        }else if(this.LOGO == 9){
                            return "low";
                        }
                    }
                },
                sla_level:{
                    serviceTimeType:{
                        text: function () {
                            if(83 == this.service_time){
                                return "工作时间";
                            }else if(84 == this.service_time){
                                return "日历时间";
                            }
                        }
                    }
                }
            }

            $("#workOrder_SLAInfo").render(data,SLAInfoDefined);
        },
        error: function(XMLHttpRequest) {
            error_500(XMLHttpRequest.responseText);
        }
    });
}

/**
 * 加载详情明细页面信息
 * @param 打印的区域
 */
function loadWorkOrderDetail(workOrderId,printArea) {
	/**
	 * 请求、绑定工单明细数据信息
	 */
	$.ajax({
		traditional: true,
		url: loadWorkOrderDetailUrl,
		dataType: "json",
		type: 'POST',
		async: true,
		data: {
			workOrderId: workOrderId
		},
		contentType: 'application/x-www-form-urlencoded; charset=UTF-8', // 防止乱码

		success: function(data) {
			// 登录信息失效，ajax请求静态页面拦截
			onServiceComplete(data);
            console.log(data);
			var workOrderDetail = {
				executorInfo: {
					value: function() {
						return this.executor_id;
					},
					text: function() {
						return this.executor_name;
					}
				}
			}
			$("#workOrder_details").render(data, workOrderDetail);//页面上的数据
			$('.event-info-right').css('height',$('.event-info-left').outerHeight()+'px');
			if(null != printArea){
				printArea.render(data);//打印弹框里的数据
			}
			setHistory(data.title);
			getHistory1()
		},
		error: function(XMLHttpRequest) {
			error_500(XMLHttpRequest.responseText);
		}
	});

	// 从页面上获取当前资产分类选中条件
	var workOrder_categoryCode = $("#workOrder_categoryCode").val();
	loadOrderResInfoList(workOrderId, workOrder_categoryCode);
}

/**
 * 对执行人，请求人，管理人明细下拉控制
 */
function pullDownController() {

	var executorInfo = document.getElementById("executor_down_info");
	var executorUl = document.getElementById("executor_down_ul");
	var askInfo = document.getElementById("asked_down_info");
	var askUl = document.getElementById("asked_down_ul");
	var managerInfo = document.getElementById("manager_down_info");
	var managerUl = document.getElementById("manager_down_ul");
	// 点击执行人下拉控制
	$("#executor_down").click(function() {
		if($("#executor_down").hasClass("active")) {
			$("#executor_down").removeClass("active");
			executorInfo.style.display = "none";
			executorUl.style.height = "61px";
			// $("#executor_down_info").hide();
		} else {
			$("#executor_down").addClass("active");
			$("#asked_down").removeClass("active");
			$("#manager_down").removeClass("active");
			executorInfo.style.display = "block ";
			executorUl.style.height = "232px";
			askInfo.style.display = "none";
			askUl.style.height = "61px";
			managerInfo.style.display = "none";
			managerUl.style.height = "61px";

		}
	});
	// 点击请求人下拉控制
	$("#asked_down").click(function() {
		if($("#asked_down").hasClass("active")) {
			$("#asked_down").removeClass("active");
			askInfo.style.display = "none ";
			askUl.style.height = "61px";
			// $("#executor_down_info").hide();
		} else {
			$("#asked_down").addClass("active");
			$("#executor_down").removeClass("active");
			$("#manager_down").removeClass("active");
			askInfo.style.display = "block";
			askUl.style.height = "232px";
			managerInfo.style.display = "none";
			managerUl.style.height = "61px";
			executorInfo.style.display = "none ";
			executorUl.style.height = "61px";
		}
	});
	// 点击管理人下拉控制
	$("#manager_down").click(function() {
		if($("#manager_down").hasClass("active")) {
			$("#manager_down").removeClass("active");
			managerInfo.style.display = "none ";
			managerUl.style.height = "61px";
			// $("#executor_down_info").hide();
		} else {
			$("#asked_down").removeClass("active");
			$("#executor_down").removeClass("active");
			$("#manager_down").addClass("active");
			managerInfo.style.display = "block";
			managerUl.style.height = "232px";
			askInfo.style.display = "none";
			askUl.style.height = "61px";
			executorInfo.style.display = "none ";
			executorUl.style.height = "61px";
		}
	});
}
/**
 * 接单保存
 */
function acceptOrderAndAssignSave() {
	var workOrderId = $("#workOrderId").val();
	var transactorChooseVal = $("select.transactorChoose option:selected").val();
	var stakeholderChooseVal = $("select.stakeholderChoose").val();

	if(null != stakeholderChooseVal && null != transactorChooseVal &&
	   "" != transactorChooseVal && "" != stakeholderChooseVal) {
		// 接单分派人员提交后台请求
		$.ajax({
			url: orderAcceptSaveUrl,
			traditional: true,
			data: {
				"workOrderId": workOrderId,
				transactorId: transactorChooseVal,
				stakeholderId: stakeholderChooseVal
			},
			type: "post",
			dataType: "json",
			success: function(data) {

				// 登录信息失效，ajax请求静态页面拦截
				onServiceComplete(data);

				$("#tipMsg").addClass("active").html(data.msg).show();

				function hideMsg() {
					$("#tipMsg").addClass("active").html(data.msg).hide()
				}
				setTimeout(hideMsg, 1500);
				$("#allocate").modal("hide");
				// 重新加载最新数据
				loadWorkOrderDetailInfo(workOrderId, position, executor_user_id, user_id);
			},
			error: function(XMLHttpRequest) {
				error_500(XMLHttpRequest.responseText);
			}
		});
	} else {
		$("#tipMsg").addClass("active").html("请选择分派人员！").show();

		function hideMsg() {
			$("#tipMsg").addClass("active").html("请选择分派人员").hide()
		}
		setTimeout(hideMsg, 1500);
	}
}
/**
 * 点击接单弹框里面的接单
 */
function acceptOrderAndAssignClick() {
	var workOrderId = $("#workOrderId").val();
	$("#pupAcceptWorkOrder").modal("hide");
	$("#allocate").modal("show");
	loadServiceMembers(workOrderId,3);
}
/**
 * 退单保存
 */
function cancelWorkOrderClickSave() {
	var position = $("#position").val();
	var executor_user_id = $("#executor_user_id").val();
	var user_id = $("#user_id").val();
	var workOrderId = $("#workOrderId").val();
	var backOrderText = $("#backOrderText").val();
	if("" != backOrderText) {
		// 退单提交后台请求
		$.ajax({
			url: orderBackSaveUrl,
			traditional: true,
			data: {
				"workOrderId": workOrderId,
				backOrderText: backOrderText
			},
			type: "post",
			dataType: "json",
			success: function(data) {

				// 登录信息失效，ajax请求静态页面拦截
				onServiceComplete(data);

				$("#tipMsg").addClass("active").html(data.msg).show();

				function hideMsg() {
					$("#tipMsg").addClass("active").html(data.msg).hide()
				}
				setTimeout(hideMsg, 2000);
				$("#orderBack").modal("hide");
				// 重新加载最新数据
				loadWorkOrderDetailInfo(workOrderId, position, executor_user_id, user_id);
			},
			error: function(XMLHttpRequest) {
				error_500(XMLHttpRequest.responseText);
			}
		});
	} else {
		$("#tipMsg").addClass("active").html("请填写退单说明！").show();

		function hideMsg() {
			$("#tipMsg").addClass("active").html("请填写退单说明").hide()
		}
		setTimeout(hideMsg, 2000);
	}
}
function cancelWorkOrderClick() {
	$("#pupAcceptWorkOrder").modal("hide");
	$("#orderBack").modal("show");
}
/**
 * 组长接单分派操作
 */
function acceptOrderAndAssign() {
	$("#pupAcceptWorkOrder").modal("show");
}

/**
 * 提交内审操作
 */
function detailSubmitInnerWorkOrder() {

	var workOrderId = $("#workOrderId").val();
	var position = $("#position").val();
	var executor_user_id = $("#executor_user_id").val();
	var user_id = $("#user_id").val();
	$("#innerSubWorkOrder").modal("show");
	$("#innerSubmit").click(function() {
		$.ajax({
			url: submitInnerWorkOrderUrl,
			traditional: true,
			data: {
				workOrderId: workOrderId
			},
			type: "post",
			dataType: "json",
			success: function(data) {

				// 登录信息失效，ajax请求静态页面拦截
				onServiceComplete(data);

				$("#tipMsg").addClass("active").html(data.msg).show();

				function hideMsg() {
					$("#tipMsg").addClass("active").html(data.msg).hide()
				}
				setTimeout(hideMsg, 2000);
				$("#innerSubWorkOrder").modal("hide");
				// 重新加载最新数据
				loadWorkOrderDetailInfo(workOrderId, position, executor_user_id, user_id);
			},
			error: function(XMLHttpRequest) {
				error_500(XMLHttpRequest.responseText);
			}
		});
	});
}

/**
 * 提交终审操作
 */
function detailSubmitFinalWorkOrder() {

	var workOrderId = $("#workOrderId").val();
	var position = $("#position").val();
	var executor_user_id = $("#executor_user_id").val();
	var user_id = $("#user_id").val();
	$("#processState").modal("show");
	// 加载绑定事件处理状态数据
	$("#eventStatusId").render(eventStatusData, eventStatusValue);
	$("#eventStatusId").selectpicker('val', "");
	$('#eventStatus .selectpicker').selectpicker('refresh');
	// 点击选择处理状态并提交
	$("#eventStatusSub").click(function() {
		var eventStatusVal = $("select.eventStatus option:selected").val();
		if("" != eventStatusVal) {
			$("#processState").modal("hide");
			$("#outSubWorkOrder").modal("show");

			$("#outSubmit").click(function() {
				$.ajax({
					url: submitOutWorkOrderUrl,
					traditional: true,
					data: {
						workOrderId: workOrderId,
						events_status: eventStatusVal
					},
					type: "post",
					dataType: "json",
					success: function(data) {
						// 登录信息失效，ajax请求静态页面拦截
						onServiceComplete(data);

						$("#tipMsg").addClass("active").html(data.msg).show();

						function hideMsg() {
							$("#tipMsg").addClass("active").html(data.msg).hide()
						}
						setTimeout(hideMsg, 1500);
						$("#outSubWorkOrder").modal("hide");
						// 重新加载最新数据
						loadWorkOrderDetailInfo(workOrderId, position, executor_user_id, user_id);
					},
					error: function(XMLHttpRequest) {
						error_500(XMLHttpRequest.responseText);
					}
				});
			});
		} else {
			$("#tipMsg").addClass("active").html("请选择处理状态！").show();

			function hideMsg() {
				$("#tipMsg").addClass("active").html("请选择处理状态!").hide()
			}
			setTimeout(hideMsg, 2000);
		}

	});
}

/**
 * 转派工单给运维小组其他人执行
 */
function changeWorkOrderToOthers() {
	var workOrderId = $("#workOrderId").val();
	var position = $("#position").val();
	var executor_user_id = $("#executor_user_id").val();
	var user_id = $("#user_id").val();
	$("#redeploy").modal("show");
	// 下拉加载执行人
	loadServiceMembers(workOrderId);
	// 提交
	$("#redispatchSubmit").click(function() {
		var redispatchVal = $("select.redispatch option:selected").val();
		var redispatchText = $("#redispatchText").val();
		if("" != redispatchText && null != redispatchVal) {
			$.ajax({
				url: workOrderDispatchUrl,
				traditional: true,
				data: {
					"workOrderId": workOrderId,
					dispatchText: redispatchText,
					executorId: redispatchVal
				},
				type: "post",
				dataType: "json",
				success: function(data) {

					// 登录信息失效，ajax请求静态页面拦截
					onServiceComplete(data);

					$("#tipMsg").addClass("active").html(data.msg).show();

					function hideMsg() {
						$("#tipMsg").addClass("active").html(data.msg).hide()
					}
					setTimeout(hideMsg, 2000);
					$("#redeploy").modal("hide");
					// 重新加载最新数据
					loadWorkOrderDetailInfo(workOrderId, position, executor_user_id, user_id);
				},
				error: function(XMLHttpRequest) {
					error_500(XMLHttpRequest.responseText);
				}
			});
		} else {
			$("#tipMsg").addClass("active").html("请选择转派人员和填写转派理由！").show();

			function hideMsg() {
				$("#tipMsg").addClass("active").html("请选择转派人员和填写转派理由").hide()
			}
			setTimeout(hideMsg, 2000);
		}
	});
}

/**
 * 转派接单操作
 */
function changeAcceptOrder() {

	var workOrderId = $("#workOrderId").val();
	var position = $("#position").val();
	var executor_user_id = $("#executor_user_id").val();
	var user_id = $("#user_id").val();

	$("#changeAcceptWorkOrder").modal("show");
	// 同意接单
	$("#change_accept").click(function() {
		$.ajax({
			url: workOrderDispatchOrBackUrl,
			traditional: true,
			data: {
				mark: true,
				workOrderId: workOrderId
			},
			type: "post",
			dataType: "json",
			success: function(data) {
				// 登录信息失效，ajax请求静态页面拦截
				onServiceComplete(data);
			},
			error: function(XMLHttpRequest) {
				error_500(XMLHttpRequest.responseText);
			}
		});
	});

	// 拒绝接单
	$("#change_accept").click(function() {
		$.ajax({
			url: workOrderDispatchOrBackUrl,
			traditional: true,
			data: {
				mark: false,
				workOrderId: workOrderId
			},
			type: "post",
			dataType: "json",
			success: function(data) {

				// 登录信息失效，ajax请求静态页面拦截
				onServiceComplete(data);

			},
			error: function(XMLHttpRequest) {
				error_500(XMLHttpRequest.responseText);
			}
		});
	});
}

/**
 * 撤销转派操作
 */
function changeOrderBack() {

	var workOrderId = $("#workOrderId").val();
	var position = $("#position").val();
	var executor_user_id = $("#executor_user_id").val();
	var user_id = $("#user_id").val();
	$.ajax({
		url: changeOrderBackUrl,
		traditional: true,
		data: {
			workOrderId: workOrderId
		},
		type: "post",
		dataType: "json",
		success: function(data) {

			// 登录信息失效，ajax请求静态页面拦截
			onServiceComplete(data);

			$("#tipMsg").addClass("active").html(data.msg).show();

			function hideMsg() {
				$("#tipMsg").addClass("active").html(data.msg).hide()
			}
			setTimeout(hideMsg, 2000);

			// 重新加载最新数据
			loadWorkOrderDetailInfo(workOrderId, position, executor_user_id, user_id);

		},
		error: function(XMLHttpRequest) {
			error_500(XMLHttpRequest.responseText);
		}
	});
}

/**
 * 切换左侧菜单页面
 */
function changeLeftMenus(workOrderId) {

	var workOrder_details = document.getElementById("workOrder_details");
	var workOrder_chat = document.getElementById("workOrder_chat");
	var workOrder_solved = document.getElementById("workOrder_solved");
	var workOrder_log = document.getElementById("workOrder_log");
	var workOrder_history = document.getElementById("workOrder_history");
	var workOrder_SLAInfo = document.getElementById("workOrder_SLAInfo");

	$("#detailInfo").click(function() {
		if(!$("#detailInfo").hasClass("active")) {
			$(".container-left-wrap li.active").removeClass("active");
			$("#detailInfo").addClass("active");
			workOrder_SLAInfo.style.display = "none";
			workOrder_log.style.display = "none";
			workOrder_solved.style.display = "none";
			workOrder_chat.style.display = "none";
			workOrder_history.style.display = "none";
			workOrder_details.style.display = "block";
			loadWorkOrderDetail(workOrderId);
			setLeftHeight();
		}
	});
	$("#chat").click(function() {
		if(!$("#chat").hasClass("active")) {
			$(".container-left-wrap li.active").removeClass("active");
			$("#chat").addClass("active");
			workOrder_history.style.display = "none";
			workOrder_details.style.display = "none";
			workOrder_SLAInfo.style.display = "none";
			workOrder_log.style.display = "none";
			workOrder_solved.style.display = "none";
			workOrder_chat.style.display = "block";
		}
		loadChatInfo(workOrderId);

	});
	$("#solved").click(function() {
		if(!$("#solved").hasClass("active")) {
			$(".container-left-wrap li.active").removeClass("active");
			$("#solved").addClass("active");
			workOrder_history.style.display = "none";
			workOrder_chat.style.display = "none";
			workOrder_SLAInfo.style.display = "none";
			workOrder_log.style.display = "none";
			workOrder_details.style.display = "none";
			workOrder_solved.style.display = "block";
			setLeftHeight();
			//载入新方案
			createasdas();
			//创建新方案
			CreateNewScheme();
			//编辑新方案
			EditorNewScheme()
		}
	});
	$("#workLog").click(function() {
		if(!$("#workLog").hasClass("active")) {
			$(".container-left-wrap li.active").removeClass("active");
			$("#workLog").addClass("active");
			workOrder_history.style.display = "none";
			workOrder_solved.style.display = "none";
			workOrder_chat.style.display = "none";
			workOrder_SLAInfo.style.display = "none";
			workOrder_details.style.display = "none";
			workOrder_log.style.display = "block";
			loadOrderWorkLogInfo(workOrderId);
			setLeftHeight();
		}
	});
	$("#workHistory").click(function() {
		if(!$("#workHistory").hasClass("active")) {
			$(".container-left-wrap li.active").removeClass("active");
			$("#workHistory").addClass("active");
			workOrder_solved.style.display = "none";
			workOrder_chat.style.display = "none";
			workOrder_SLAInfo.style.display = "none";
			workOrder_details.style.display = "none";
			workOrder_log.style.display = "none";
			workOrder_history.style.display = "block";
      //点击历史(左侧) && 置顶历史信息
      orderHistoryClick(orderHistoryDeal,0);
			setLeftHeight();
		}

	});
	$("#SLAInfo").click(function() {
		if(!$("#SLAInfo").hasClass("active")) {
			$(".container-left-wrap li.active").removeClass("active");
			$("#SLAInfo").addClass("active");
			workOrder_solved.style.display = "none";
			workOrder_chat.style.display = "none";
			workOrder_details.style.display = "none";
			workOrder_log.style.display = "none";
			workOrder_history.style.display = "none";
			workOrder_SLAInfo.style.display = "block";
			setLeftHeight();
		}
	});

}
//function setLeftHeight(){
//	$('.container-right-infoWrap').css('height','');
//	if($('.event-info-left').outerHeight()>parseInt($('.event-info-right').css('minHeight'))){
//					$('.container-right-infoWrap').css('height',$('.conright-infoWrap-left').outerHeight()+'px');
////					$('.event-info-right').css('height','100%');
//					$('.event-info-right').css('height','');//无法清除
//					console.log($('.event-info-right').height());
//					$('#container-left').css('height',$('#container-right').outerHeight()+30+'px');
//
//	}else{
//		$('#container-left').css('height',$('#container-right').outerHeight()+30+'px');
//	}
//}
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
/** 加载会话信息* */
function loadChatInfo(workOrderId,printArea){
	loadCurrentUserHelp();
	$.ajax({
			url: conversationUrl,
			type: "get",
			data: {
				"eventId": workOrderId
			},
			dataType: "json",
			success: function(result) {
				//登录信息失效，ajax请求静态页面拦截
				onServiceComplete(result);
				if(1 == result.status) {
					var data = result.data;
					var currentUser = result.dataSub; // 当前用户的id
					var eventTitle = data.events_title; // 事件标题
					var eventTime = data.events_time; // 事件时间
					var eventForm = data.events_source; //事件来源
					var converInfo = data.conversation_info; // 会话信息
					// 绑定标题
					var eventI = {
						events_time: eventTime,
						events_title: eventTitle,
						event_from: eventForm,
						eventAsker: data.per_name,
					}
					$("div.event-info-leftDownTitle").render(eventI);
					// 绑定会话信息
					var converDiv = $("div.conversationDiv");
					var diConverInfo = {
						leftOrRight: {
							class: function() {
								if(currentUser == this.user_id) {
									return "session-right";
								} else {
									return "session-left";
								}
							}
						},
						editDelete: {
							class: function() {
								if(currentUser != this.user_id) {
									return "dn";
								}
							}
						}
					}
					converDiv.render(converInfo, diConverInfo);
					/**动态设置左侧高度**/
					setLeftHeight();
					//打印弹框里绑定数据
					if(null != printArea){
						printArea.render(converInfo);
					}
				}
			},
			error: function(XMLHttpRequest) {
				error_500(XMLHttpRequest.responseText);
			}
		});
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
 * 构建可回复状态的页面
 */
function eAnswerClickHelp() {
	$("#answerBottom_textarea").val("");
	$("div.session-bottom-right-init").addClass(dn);
	$("div.session-bottom-right-edit").removeClass(dn);
	$("div.isNotFL").removeClass(dn);
	$("p.answerBox").addClass(active);

	setLeftHeight();
	$('#answerBottom_textarea').focus();
	// 需求：点击回复滚动到底部回复区域
	$('html, body').animate({scrollTop: $(document).height()}, 300);
}
/**
 * 取消回复的状态
 */
function eNoAnswer(initHeight) {

	$("div.session-bottom-right-init").removeClass(dn);
	$("div.session-bottom-right-edit").addClass(dn);
	$("div.isNotFL").addClass(dn);
	$("p.answerBox").removeClass(active);
	setLeftHeight();
}
/**
 * 点击“会话”里的修改内容
 */
function editSelfClick() {
	var content = $(this).parents("div.operationGroup").prev().html();
	var contentDiv = $(this).parents("li.paragraphCotentLi").next();
	var contentHide = $(this).parents("li.paragraphCotentLi");
	contentDiv.removeClass(dn);
	contentHide.addClass(dn);
	contentDiv.find("textarea").text(content);
	setLeftHeight();
}
/**
 * 点击”会话“里的删除
 */
function deleteSelfClick() {
	var workOrderId=$('#workOrderId').val();
	$("#pupDelete").modal("show");
	var converId = $(this).prev().val();
	if("" != converId) {
		$("button.delete-click-con").click(function() {
			$.ajax({
				url: conversationDeleteUrl,
				type: "get",
				data: {
					converId: converId
				},
				dataType: "json",
				success: function(result) {

					// 登录信息失效，ajax请求静态页面拦截
					onComplete(result);
					updateCancel();
					loadChatInfo(workOrderId);
					outBoxClose(result.msg, "pupDelete");
				},
				error: function(XMLHttpRequest) {
					error_500(XMLHttpRequest.responseText);
				}
			});
		});
	}

}
/**
 * 点击”会话“里的保存(修改内容)
 */
function saveClick() {
	var workOrderId=$('#workOrderId').val();
	var converDiv = $(this).parents("li.paragraphEditLi");
	var converId = converDiv.prev().find("[data-bind='id']").val();
	if(null != converId && "" != converId) {
		var converContent = converDiv.find("textarea").val();
		$.ajax({
			url: conversationUpdateUrl,
			data: {
				converId: converId,
				converContent: converContent
			},
			type: "post",
			success: function(result) {

				// 登录信息失效，ajax请求静态页面拦截
				onComplete(result);

				// 如果删除成功，则把文本框去掉，失败的话，不去掉。
				if(successReturnComOrder == result.status) {
					// cancelClick();
					updateCancel();
					// eventCoverClick();
					loadChatInfo(workOrderId);
				}
				outBoxClose(result.msg);
			},
			error: function(XMLHttpRequest) {
				error_500(XMLHttpRequest.responseText);
			}
		});
	}
}
/**
 * 点击取消，关闭修改会话的编辑框
 */
function updateCancel() {
	$("li.paragraphEditLi").addClass(dn);
	$("li.paragraphCotentLi").removeClass(dn);
	setLeftHeight();
}
/**
 * 点击“会话”里的取消
 */

function cancelClick(){
	$('paragraphEditLi').addClass('dn') ;
}
/**
 * 点击“会话”页面，最下方的回复 王雷 修改为点击会话页面保存按钮--石伟
 */
function eAnswerBottomClickOrder() {
	// var eventId = $("#eventId").val();
	var workOrderId = getUrlParam("workOrderId");
// var textA = $("#answerBottom");
	var textA = $("textarea.answerBottom_textarea");
	var batchReply = textA.val();
	var filePath = "";
	if("" != batchReply || filePath != "") {
		$.ajax({
			url: eventReplyUrl,
			type: "post",
			data: {
				"ids": workOrderId,
				"answer": batchReply,
				"filePath": filePath
			},
			dataType: "json",
			success: function(result) {

				// 登录信息失效，ajax请求静态页面拦截
				onServiceComplete(result);

				textA.val("");
				outBoxOrder(result.msg);

				changeLeftMenus(workOrderId);
				loadChatInfo(workOrderId);
				eNoAnswer();
			},
			error: function(XMLHttpRequest) {
				error_500(XMLHttpRequest.responseText);
			}
		});
	}
}
/**
 * 点击”会话“里的删除 王雷
 */
function deleteSelfClickOrder() {
	var workOrderId=$('#workOrderId').val();
	$("#pupDelete").modal("show");
	var converId = $(this).prev().val();
	if("" != converId) {
		$("button.delete-click-con").click(function() {
			$.ajax({
				url: conversationDeleteUrl,
				type: "get",
				data: {
					converId: converId
				},
				dataType: "json",
				success: function(result) {

					// 登录信息失效，ajax请求静态页面拦截
					onServiceComplete(result);
					loadChatInfo(workOrderId);
					updateCancel();
					outBoxOrder(result.msg, "pupDelete");

				},
				error: function(XMLHttpRequest) {
					error_500(XMLHttpRequest.responseText);
				}
			});
		});
	}

}
/**
 * 点击”会话“里的保存 王雷
 */
var successReturnComOrder = 1;
/** 点击会话里的保存 石伟* */
function saveClickOrder(){
	var workOrderId=$('#workOrderId').val();
	var converDiv = $(this).parents("li.paragraphEditLi");
	var converId = converDiv.prev().find("[data-bind='id']").val();
	if(null != converId && "" != converId) {
		var converContent = converDiv.find("#answerdd").val();
		$.ajax({
			url: conversationUpdateUrl,
			data: {
				converId: converId,
				converContent: converContent
			},
			type: "post",
			success: function(result) {

				// 登录信息失效，ajax请求静态页面拦截
				onServiceComplete(result);

				// 如果删除成功，则把文本框去掉，失败的话，不去掉。
				if(successReturnComOrder == result.status) {
					// cancelClickOrder();
					updateCancel();
					loadChatInfo(workOrderId);
					outBoxOrder(result.msg, "pupDelete");
				}
				outBoxOrder(result.msg);
			},
			error: function(XMLHttpRequest) {
				error_500(XMLHttpRequest.responseText);
			}
		});
	}
}

/**
 * 点击加载绑定执行人和干系人数据 workOrderId:工单id flag:0 表示点击执行人，1：表示点击干系人
 */
function loadServiceMembers(workOrderId,flag) {
	$.ajax({
		url: loadServiceMembersUrl,
		traditional: true,
		data: {
			workOrderId: workOrderId
		},
		type: "post",
		dataType: "json",
		success: function(data) {
			// 登录信息失效，ajax请求静态页面拦截
            onServiceComplete(data);

            var $doPerson = $("#transactorChooseSelectId");  // 执行人
            var $relaPerson = $("#stakeholderChooseSelectId"); // 干系人
            var noData = {NAME: "--请选择--", persion_id: 0};
            data.unshift(noData);
            $doPerson.render(data, {
                transactorChooseSelect: {
                    text: function(){ return this.NAME },
                    value: function(){ return this.persion_id }
                }
            });
            $doPerson.selectpicker("val", 0 );
            $doPerson.selectpicker("refresh");
            
            /* [执行人] 内容更改事件 */
            $doPerson.off().on("change",data,function(e){
                $(this).selectpicker("refresh");
                var changedId = $(this).val();
                if(changedId==0){
                    /* 选中: "--请选择--" */
                    $relaPerson.render( noData ,{
                        stakeholderChooseSelect: {
                            text: function(){ return this.NAME },
                            value: function(){ return this.persion_id }
                        }
                    });
                }else{
                    /* 选中: 人员 */
                    var filteredData = e.data.filter(function (val, i) {
                        return (val.persion_id != changedId) && (val.persion_id != 0);
                    });
                    $relaPerson.render(filteredData, {
                        stakeholderChooseSelect: {
                            value: function () { return this.persion_id; },
                            text: function () { return this.NAME; }
                        }
                    });
                }

                $relaPerson.selectpicker("refresh");
                $relaPerson.selectpicker("val", 0);
            });

            /* 转派 */
            var myId = $("#header .userName").attr("value");
            data = data.filter(function(val,i){
                return val.persion_id!=myId;
            });
            $("#redispatch_id").render(data, {
                changToChooseSelect: {
                    text: function(){ return this.NAME },
                    value: function(){ return this.persion_id }
                }
            });
            $("#redispatch_id").selectpicker("val", 0 );
            $("#redispatch_id").selectpicker("refresh");
//          console.log(data);
            
		},
		error: function(XMLHttpRequest) {
			error_500(XMLHttpRequest.responseText);
		}
	});
}

/**
 * 加载、请求、绑定关联资产数据信息
 */
function loadOrderResInfoList(workOrderId, workOrder_categoryCode) {
	/**
	 * 请求、绑定关联资产数据信息
	 */
	// 从页面上获取页数信息
	var currPage = $("#currPage").val();
	if("" == currPage) {
		currPage = 1;
	} else {
		currPage = $("#currPage").val();
	}
	// 每页条数
	var numEachPage = 5;
	$.ajax({
		traditional: true,
		url: loadResourceUrl,
		dataType: "json",
		type: 'POST',
		async: true,
		data: {
			page: currPage,
			pageNum: numEachPage,
			eventId: workOrderId,
			category: workOrder_categoryCode
		},
		contentType: 'application/x-www-form-urlencoded; charset=UTF-8', // 防止乱码
		success: function(data) {
			// 登录信息失效，ajax请求静态页面拦截
			onServiceComplete(data);
			var result = data.data;
			var len = result.length;
			if(0 != len) {
				// 加载分类树,如果没有分类id,则在当前页面选择一个分类id，再发送ajax请求,加载对应的属性模板
				// 参数1 ul.ztree 2.ztree父容器 3.输入框 4.隐藏域 5.url 6.flag
				// creatTree("workOrder_category-tree",
				// "workOrder_category-menu", "workOrder_category",
				// "workOrder_categoryCode", loadCategoryZTreeUrl, true);
				var totalPage = result[0].PageNum;
				var totalNum = result[0].totalNum;
				var beginCount = (currPage - 1) * (numEachPage) + 1;
				var endCount;
				if(len - numEachPage == 0){
					endCount = beginCount - 1 + numEachPage;
				} else {
					endCount = beginCount - 1 + (len) % (numEachPage);
				}
				var workOrderPage = {
					"beginCount": beginCount,
					"endCount": endCount,
					"totalCount": totalNum,
					"currPage": currPage,
					"totalPage": totalPage
				}
				var workOrderPageClass = {
					upClass: {
						class: function() {
							if(currPage - 1 == 0) {
								return "conAsset-left conAsset-img";
							} else {
								return "conAsset-left conAsset-img active";
							}
						}
					},
					downClass: {
						class: function(){
							if(totalPage - 1 == 0 || totalPage - currPage == 0) {
								return "conAsset-right conAsset-img";
							} else {
								return "conAsset-right conAsset-img active";
							}
						}
					}
				}
				$("#pageSmall").render(workOrderPage, workOrderPageClass);
				$("#workOrder_resource").render(result);
			}else{
				$("#workOrder_resource").render(result);
			}
		},
		error: function(XMLHttpRequest) {
			error_500(XMLHttpRequest.responseText);
		}
	});
}
/**
 * 点击创建新方案
 **/
	function CreateNewScheme(){
		$("#CreateNewScheme").click(function(){
			$("#CreateScheme").modal("show");
			$(".SubmittingKeep").click(function(){
				createNewSolution();
			})
		})
	}
/*
 *点击编辑新方案
*/
	function EditorNewScheme(){
		$(".editorsolveoutil").click(function(){
			$("#FlagUpdateEditor").val("FlagUpdateEditor")
			var $reasonAnalysts=$(".reason_analysts").html();
  			var $treatingProcess=$(".treating_process").html();
  			var $treatingResult=$(".treating_result").html();
  			$(".textarea_season").html($reasonAnalysts);
  			$(".textarea_process").html($treatingProcess);
  			$(".textarea_result").html($treatingResult);
			$("#CreateScheme").modal("show");
			$(".SubmittingKeep").click(function(){
				createNewSolution();
			})
		})
	}
/**
 * 上下页跳转操作
 */
function orderResUpOrNextPage(workOrderId) {
	var upConPage = document.getElementById("upClick");
	var nextConPage = document.getElementById("downClick");
	/**
	 * 点击上一页操作
	 */
	if(null != upConPage){
		upConPage.onclick = function() {

			// 从页面获取当前页数
			// 从页面上获取当前资产分类选中条件
			var workOrder_categoryCode = $("#workOrder_categoryCode").val();
			var currPage = $("#currPage").val();
			if(currPage - 1 == 0) {
				$("#tipMsg").addClass("active").html("第一页").show();

				function hideMsg() {
					$("#tipMsg").addClass("active").html("第一页").hide()
				}
				setTimeout(hideMsg, 1500);
			} else {
				currPage--;
				loadOrderResInfoList(workOrderId, workOrder_categoryCode);
			}
		}
	}
	/**
	 * 点击下一页操作
	 */
	if(null != nextConPage){
		nextConPage.onclick = function() {
			// 从页面上获取当前资产分类选中条件
			var workOrder_categoryCode = $("#workOrder_categoryCode").val();
			// 从页面获取当前页面和总页数
			var currPage = $("#currPage").val();
			var totalPage = $("#totalPage").val();
			if(totalPage - currPage == 0 || totalPage - 1 == 0) {
				$("#tipMsg").addClass("active").html("最后一页").show();

				function hideMsg() {
					$("#tipMsg").addClass("active").html("最后一页").hide();
				}
				setTimeout(hideMsg, 1500);
			} else {
				currPage++;
				loadOrderResInfoList(workOrderId, workOrder_categoryCode);
			}
		}
	}
}

/**
 * 合同关联资产列表选中资产分类条件加载资产
 */
function loadOrderResByType() {
	// 从页面上获取当前资产分类选中条件
	var workOrder_categoryCode = $("#workOrder_categoryCode").val();
	// code直接从ztree中获取
	var workOrderId = document.getElementById("workOrderId").value;
	loadOrderResInfoList(workOrderId, workOrder_categoryCode);
}
/*
 *加载新方案
 * */
function createasdas(){
	$.ajax({
		traditional: true,
		url: loadSolutionsOfEventUrl,
		dataType: "json",
		type: 'get',
		async: true,
		data:{
			eventId:$("#workOrderId").val(),
			searchText:""
		},
		contentType: 'application/x-www-form-urlencoded; charset=UTF-8', // 防止乱码
		success: function(data){
			// 登录信息失效，ajax请求静态页面拦截
			onServiceComplete(data);
			console.log(data.data)
			if(data.status=="1" && data.data.length!==0){
				$("#CreateNewScheme").css('display','none');
				$(".conAssetNodata").css('display','none');
				$(".eventsolveoutil").css("display","block");
				$(".work_orderul").css("marginTop",'-30px');
				$(".reason_analysts").html(data.data[0].reason_analysts);
				$(".treating_process").html(data.data[0].treating_process);
				$(".treating_result").html(data.data[0].treating_result);
				$(".modalname").html($(".userName").html());
				$(".modalTime").html(getMyDate(data.data[0].create_time))
			}else{
				$(".conAssetNodata").css('display','block');
				$(".eventsolveoutil").css("display","none");
				$("#CreateNewScheme").css('display','block');
				$(".work_orderul").css("marginTop",'0');
			}
		},
		error: function(XMLHttpRequest) {
			error_500(XMLHttpRequest.responseText);
		}
	});
}

/*
 *创建/编辑方案	
 * */
function createNewSolution(){
	var FlagUpdateEditor=$("#FlagUpdateEditor").val();
	//区分创建还是编辑
	if(FlagUpdateEditor==''){
	$.ajax({
		traditional: true,
		url: createSolutionUrl,
		dataType: "json",
		type: 'POST',
		async: true,
		data: {
			reason_analysts:$(".textarea_season").html(),
			treating_process:$(".textarea_process").html(),
			treating_result:$(".textarea_result").html(),
			work_order_id:$("#workOrderId").val(),
			events_id:$("#workOrderId").val(),
			orderOrEvent:'order'
		},
		contentType: 'application/x-www-form-urlencoded; charset=UTF-8', // 防止乱码
		success: function(data) {
			// 登录信息失效，ajax请求静态页面拦截
			onServiceComplete(data);
			console.log(data)
			if(data.status=="1"){
				$("#tipMsg").addClass("active").html("创建成功").show();
				function hideMsg() {
					$("#tipMsg").addClass("active").html(data.msg).hide()
				}
				setTimeout(hideMsg,1500);
				$("#CreateScheme").modal('hide');
				//载入页面
				createasdas();
			}else{
				$("#errorBtn").modal('show');
				$("#errorInfo").html(data.msg);
			}
		},
		error: function(XMLHttpRequest) {
			error_500(XMLHttpRequest.responseText);
		}
	});
 }else{
   	$.ajax({
		traditional: true,
		url: updateSolutionUrl,
		dataType:"json",
		type:'POST',
		async: true,
		data: {
			id:$("#workOrder_slaId").val(),
			reason_analysts:$(".textarea_season").html(),
			treating_process:$(".textarea_process").html(),
			treating_result:$(".textarea_result").html(),
			work_order_id:$("#workOrderId").val(),
			events_id:$("#workOrderId").val(),
			orderOrEvent:'order'
		},
		contentType: 'application/x-www-form-urlencoded; charset=UTF-8', // 防止乱码
		success: function(data){
			//登录信息失效，ajax请求静态页面拦截
			onServiceComplete(data);
			console.log(data)
			if(data.status=="1" && data.length!==0){
				$("#tipMsg").addClass("active").html("修改成功").show();
				function hideMsg() {
					$("#tipMsg").addClass("active").html(data.msg).hide()
				}
				setTimeout(hideMsg, 1500);
				$("#CreateScheme").modal('hide');
				//载入页面
				createasdas();
			}else{
				$("#errorBtn").modal('show');
				$("#errorInfo").html(data.msg);
			}
		},
		error: function(XMLHttpRequest){
			error_500(XMLHttpRequest.responseText);
		}
	});
   }
	
}

/**
 * 加载工单工作日志信息
 *
 * @param workOrderId
 */
function loadOrderWorkLogInfo(workOrderId,workLogTbody,workLogTfoot) {
	$.ajax({
		traditional: true,
		url: loadOrderWorkLogUrl,
		dataType: "json",
		type: 'POST',
		async: true,
		data:{
			workOrderId:workOrderId
		},
		contentType: 'application/x-www-form-urlencoded; charset=UTF-8', // 防止乱码
		success: function(data){
			//登录信息失效，ajax请求静态页面拦截
//			console.log(data);
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
//			console.log(datakey);
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
			//点击编辑按钮
			let Eventlog=document.getElementsByClassName('Eventlog')
			let WorkerTimer=document.getElementById("WorkerTimer");
			let workhours=document.getElementById("workhours");
			let workminitus=document.getElementById("workminitus");
			let jobcontents=document.getElementById("jobcontents");
			for(let i=0;i<datakey.length;i++){
//				console.log(datakey);
				Eventlog[i].onclick=function(e){
					e.preventDefault()
					WorkerTimer.value=this.parentNode.previousElementSibling.previousElementSibling.innerHTML;
					workhours.value=this.parentNode.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.innerHTML;
					workminitus.value=this.parentNode.previousElementSibling.previousElementSibling.previousElementSibling.innerHTML;
					jobcontents.value=this.parentNode.parentNode.nextElementSibling.innerHTML;
					$("#logUpdateFlag").val("logUpdateFlag");
					$("#addWorkOrderModal").modal('show');
					let logIdn=this.parentNode.previousElementSibling.value;
					let person_id=this.previousElementSibling.value;
					$("#workLogId").val(logIdn);
					$("#personId").val(person_id);
				}
			}
			
			//打印页面上绑定数据
			if(null != workLogTbody){
				workLogTbody.render(data);
			}
			if(null != workLogTfoot){
				var total = {
						workTimeSumP:workHour + "小时" + workMIn + "分",
						perTotalPriceSumP:perTotalPriceSum.toFixed(1),
						slipFeeSumP:slipFeeSum.toFixed(1),
						partsFeeSumP:partsFeeSum.toFixed(1),
						othersFeeSumP:othersFeeSum.toFixed(1),
						totalFeeSumP:totalFeeSum.toFixed(1),
				}
				workLogTfoot.render(total);
			}
			
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
 * 添加工单日志
 */
function addWorkLogController() {
	var workOrderId = $("#workOrderId").val();
	var position = $("#position").val();
	var executor_user_id = $("#executor_user_id").val();
	var user_id = $("#user_id").val();
	$("#addWorkLogsSave").click(function() {
		// 获取新建/编辑保存标识
		var logUpdateFlag = $("#logUpdateFlag").val();
		if("" == logUpdateFlag){
			$.ajax({
				traditional: true,
				url: addWorkLogUrl,
				dataType: "json",
				type: 'POST',
				async: true,
				data: {
					person_id: $("#user_id").val(),
					exexute_start_time:$("#WorkerTimer").val(),
					exexute_end_time: '1',
					working_hours: $("#workhours").val(),
					working_minute: $("#workminitus").val(),
					working_unit_price: '1',
					total_price: '1',
					mission_fee: '1',
					parts_fee: '1',
					others_fee: '1',
					total_fee: '1',
					job_content: $("#jobcontents").val(),
					work_order_id: workOrderId
				},
				contentType: 'application/x-www-form-urlencoded; charset=UTF-8', // 防止乱码
				success: function(data) {
//					console.log(data);
					// 登录信息失效，ajax请求静态页面拦截
					onServiceComplete(data);
					if(data.code == "success") {
						$("#tipMsg").addClass("active").html(data.msg).show();
						function hideMsg() {
							$("#tipMsg").addClass("active").html(data.msg).hide()
						}
						setTimeout(hideMsg, 1500);
						$("#addWorkOrderModal").modal("hide");
						loadOrderWorkLogInfo(workOrderId);
					} else {
						$("span.addLogErrMsg").html(data.msg);
					}
				},
				error: function(XMLHttpRequest) {
					error_500(XMLHttpRequest.responseText);
				}
			});
		}else{
			$("#logUpdateFlag").val("logUpdateFlag");
			var user_id = $("#user_id").val();
			var logIdn = $("#workLogId").val();
			var personId = $("#personId").val();
			$.ajax({
				traditional: true,
				url: newEditOrderLogSaveUrl,
				dataType: "json",
				type: 'POST',
				async: true,
				data: {
					workLogId: $("#workLogId").val(),
					person_id: $("#personId").val(),
					exexute_start_time: $("#WorkerTimer").val(),
					exexute_end_time: '1',
					working_hours: $("#workhours").val(),
					working_minute: $("#workminitus").val(),
					working_unit_price: '1',
					total_price: '1',
					mission_fee: '1',
					parts_fee: '1',
					others_fee: '1',
					total_fee: '1',
					job_content: $("#jobcontents").val(),
					work_order_id: workOrderId
				},
				contentType: 'application/x-www-form-urlencoded; charset=UTF-8', // 防止乱码
		
				success: function(data) {
					// 登录信息失效，ajax请求静态页面拦截
					onServiceComplete(data);
//					console.log(data);
					if(data.status == "1") {
						$("#tipMsg").addClass("active").html(data.msg).show();
						function hideMsg(){
							$("#tipMsg").addClass("active").html(data.msg).hide()
						}
						setTimeout(hideMsg, 1500);
						$("#addWorkOrderModal").modal("hide");
							loadOrderWorkLogInfo(workOrderId);
						} else {
							$("span.addLogErrMsg").html(data.msg);
						}
					},
						error: function(XMLHttpRequest) {
							error_500(XMLHttpRequest.responseText);
						}
					});
					
			}
	});
}

/**
 * 删除工单日志
 */
function delOrderLog(logIds) {
	var workOrderId = $("#workOrderId").val();
	// var orderLogId = $("#logId").val();
	$.ajax({
		traditional: true,
		url: delWorkOrderLogUrl,
		dataType: "json",
		type: 'POST',
		async: true,
		data: {
			workOrderLogId: logIds,workOrderId:workOrderId
		},
		contentType: 'application/x-www-form-urlencoded; charset=UTF-8', // 防止乱码

		success: function(data) {
			// 登录信息失效，ajax请求静态页面拦截
			onServiceComplete(data);
			$("#tipMsg").addClass("active").html(data.msg).show();
			function hideMsg(){
				$("#tipMsg").addClass("active").html(data.msg).hide()
			}
			setTimeout(hideMsg, 1500);
			loadOrderWorkLogInfo(workOrderId);
		},
		error: function(XMLHttpRequest) {
			error_500(XMLHttpRequest.responseText);
		}
	});
}

/**
 * 获取当前用户所对应的人员名称
 */
function getPersonName() {
	$.ajax({
		traditional: true,
		url: getPersonNameUrl,
		dataType: "json",
		type: 'get',
		async: true,
		data: '',
		contentType: 'application/x-www-form-urlencoded; charset=UTF-8', // 防止乱码

		success: function(data) {
			// 登录信息失效，ajax请求静态页面拦截
			onServiceComplete(data);

			$("#staff").val(data.name);
		},
		error: function(XMLHttpRequest) {
			error_500(XMLHttpRequest.responseText);
		}
	});
}
var executorHSer = $("div.executor_detail");
var executorISer = $("i.worker");
var managerHSer = $("div.manager_detail");
var managerISer = $("i.manager");
var askerHSer = $("div.application_detail");
var askerISer = $("i.asker");
var executorId = $("#executorId");
var askerId = $("#askerId");
var managerId = $("#managerId");
function idShow(){
	executorId.show();
	askerId.show();
	managerId.show();
	executorHSer.slideUp(function(){
});
	managerHSer.slideUp();
	askerHSer.slideUp();
}
/**
 * 查看执行人详情
 */
function executorDetailClickSer(){
	idShow();
	executorId.hide();
	executorHSer.slideDown();
}
/**
 * 请求人明细
 */
function applicationDetailClickSer(){
	idShow();
	askerId.hide();
	askerHSer.slideDown();
}
/**
 * 管理人明细
 */
function managerDetailClickSer(){
	idShow();
	managerId.hide();
	managerHSer.slideDown();
}
var dataArea = new Object();
dataArea.workOrder = $("div.infowrap-resource");
dataArea.person = $("#personInfo");
dataArea.workLogTbody = $("#table-bordered");//工作日志表格的内容
dataArea.workLogTfoot = $("#workTotalTfoot");//工作日志表格的最后一行
dataArea.chat = $("div.conversation");
/**
 * 打印数据绑定
 */
var printData = function printData(dataArea){
	//工单
	loadWorkOrderDetail(workOrderId,dataArea.workOrder);
	//执行人，请求人，管理人
	loadWorkOrderDetailInfo(workOrderId, position, executor_user_id, user_id,dataArea.person);
	//解决方案
		
	//工作日志
	loadOrderWorkLogInfo(workOrderId,dataArea.workLogTbody,dataArea.workLogTfoot);
	//会话
	loadChatInfo(workOrderId,dataArea.chat);
	//历史
}
/*显示打印对话框*/
function ePrintClick(){
	printData(dataArea);
	$("#print").modal("show");
	/* 只勾选第一项 + 只显示第一项 */
	$("#print .modal-body-chooseItem i").removeClass("active");
	$("#print .modal-body-chooseItem i:first").addClass("active");
  $("#print .modal-body-everyItem").css("display","none");
	$("#print .modal-body-everyItem:first").css("display","block");
}
//切换打印勾选内容
function changePrintSelect(){
	$i = $(this).children("i");
	/*计算显示内容的位置并显示 + 切换勾选*/
	var idx = $(this).index()-1;
	if ($i.hasClass("active")) {
		$i.removeClass("active");
		$(".modal-body-everyItem").eq(idx).css("display","none");
	}else {
		$i.addClass("active");
		$(".modal-body-everyItem").eq(idx).css("display","block");
	}
}
//显示打印预览页
function ePrintClick2(){
	var canPrint = 0;   //打印项数量
  var printFlag = "";  //打印信息

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
    window.open("printOrdDetail.html?workOrderId="+workOrderId+printFlag);
  }
}

/**
 * 点击历史
 */
function orderHistoryClick(orderHistoryDeal,arrowType){
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
        'type':94,
        'type_id': workOrderId,
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

          orderHistoryDeal(result);
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
 function orderHistoryDeal(result){
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

var workOrderId = getUrlParam("workOrderId");

/* SLA信息展开与收起 */
// function openAndCloseSLA(e){
// 	var $this = $(this);
// 	if ($this.hasClass("active")) {
// 		//有active时,仅取消自己的active
// 		$this.removeClass("active").next().slideUp();
// 		$this.parent().css("background","#fff");
// 	}else{
// 		//没有active时,对自己增加active+展开+对类似元素去掉active+收起
// 		$this.addClass("active").next().slideDown().parent().siblings().find(".slaInfoTitle").removeClass("active").next().slideUp();
// 		$this.parent().css("background","#f5f5f5").siblings().css("background","#fff");
// 	}
// }
/**
 * 文件下载弹框
 */
function fileDownload(){
	var count = $("[data-bind='attachment']").text();
	 if(null != count && count>0){
		 $("#WorkOrderAppendage").modal("show");
	 }
}

var workOrderId;
var position;
var executor_user_id;
var user_id;
/**
 * jQuery函数
 */
$(function() {
	// 获取页面跳转传值
	workOrderId = getUrlParam("workOrderId");
	$("#workOrderId").val(workOrderId);
	position = getUrlParam("position");
	$("#position").val(position);
	executor_user_id = getUrlParam("executor_user_id");
	$("#executor_user_id").val(executor_user_id);
	user_id = getUrlParam("user_id");
	$("#user_id").val(user_id);
	
	// 加载工单详情信息
	loadWorkOrderDetailInfo(workOrderId, position, executor_user_id, user_id);
	// 对执行人，请求人，管理人明细下拉控制
// pullDownController();
	// 左侧页面菜单切换
	changeLeftMenus(workOrderId);
	$('#workOrder_resource_type i').click(function(){
		$('#workOrder_category').attr('value','');
		$('#workOrder_categoryCode').attr('value','');
		loadOrderResInfoList(workOrderId,'');
	});
	// 组长接单分派操作
	$("#accept_order").click(acceptOrderAndAssign);

	// 提交内审操作
	$("#submit_inner").click(detailSubmitInnerWorkOrder);

	// 提交终审操作
	$("#submit_final").click(detailSubmitFinalWorkOrder);

	// 转派操作
	$("#change_to").click(changeWorkOrderToOthers);

	// 转派接单操作
	$("#change_acceptOrder").click(changeAcceptOrder);

	// 撤回转派操作
	$("#order_back").click(changeOrderBack);

	// 工单关联资产上下页
	orderResUpOrNextPage(workOrderId);

	// 构建ztree

	creatTree("workOrder_category-tree", "workOrder_category-menu", "workOrder_category", "workOrder_categoryCode", loadCategoryZTreeUrl, true,loadOrderResByType);
	// 点击页面顶部按钮回复
	$('#reply_order').click(eAnswerClickHelp)

	// 点击回复出现编辑区域及按钮
	$('.answerBox').click(eAnswerClickHelp);
	$('#answerBottom').click(eAnswerClickHelp);

	// '会话里最下方取消按钮
	$('.cancelAnswer').click(eNoAnswer);

	// ”会话“里最下面的保存
	$("button.keep-batchReply").click(eAnswerBottomClickOrder);

	// “会话”里，每条中点击修改内容
	$("div.conversationDiv").on("click", "div.editContent", editSelfClick);
	// “会话”里，每条中点击取消
	$("div.conversationDiv").on("click", "button.cancel", updateCancel);

	// “会话”里，每条点击删除
	$("div.conversationDiv").on("click", "div.delete", deleteSelfClickOrder);
	// “会话”里，每条点击保存
	$("div.conversationDiv").on("click", "button.save", saveClickOrder);
	// 增加/编辑工单日志操作
	addWorkLogController();
	// 添加工作日志点击事件
	$("#addWorkLog").click(function() {
		$("#addWorkOrderModal").find("input").val("");
		$("#addWorkOrderModal").find("textarea").val("");
		$("#addWorkOrderModal").modal("show");
		getPersonName();
	});
	//删除工作日志
	$("#workOrder_log").off().on('click','span.Deletethis',function(){
		var logIds=$(this).parent().prev().val();
//		console.log(logIds)
		delOrderLog(logIds);
	})
	//编辑工作日志点击事件
	// // 点击执行人的下拉选
	// $("#transactorChoose").click(function(){
	// 	var workOrderId = $("#workOrderId").val();
	// 	loadServiceMembers(workOrderId,0);
	// });
	// // 点击干系人的下拉选
	// $("#stakeholderChoose").click(function(){
	// 	var workOrderId = $("#workOrderId").val();
	// 	loadServiceMembers(workOrderId,1);
	// });
	// 点击右侧管理人
	$("#manager_down_ul li:eq(0)").click(managerDetailClickSer);
	// 点击右侧执行人
	$("#executor_down_ul li:eq(0)").click(executorDetailClickSer);
	// 点击右侧请求人
	$("#asked_down_ul li:eq(0)").click(applicationDetailClickSer);
	askerHSer.slideUp();
	managerHSer.slideDown();
	managerId.hide();
	executorHSer.slideUp();
	$("#allocateSave").click(acceptOrderAndAssignSave);//接单保存
	// 点击接单按钮弹出接单分派工单框
	$("#accept").click(acceptOrderAndAssignClick)
	$("#orderBackSave").click(cancelWorkOrderClickSave);//退单保存
	// 点击退单按钮弹出退单框
	$("#unTreat").click(cancelWorkOrderClick);
	//显示打印对话框
	$("#print_order").click(ePrintClick);
	//切换打印勾选内容
	$(".modal-body-choose").delegate("li","click",changePrintSelect);
	//点击切换每条SLA信息展开与收起
	// $("#workOrder_SLAInfo").delegate(".slaInfoTitle","click",openAndCloseSLA);
	// $("#workOrder_SLAInfo").find(".slaInfoTitle").first().addClass("active").parent().css("background","#f7f7f7").siblings().find(".slaInfoContent").css("display","none");
	
  //显示切换SLA信息弹框  本页SLA信息直接显示不需要切换功能
  // $(".slaCheckBox").click(function(e){
  //   $("#pupDelete5").modal('show');
  //   e.stopPropagation();
  // })
	//点击附件，弹出弹框，可以下载文件
     $("[data-bind='attachment']").click(fileDownload);
	//显示打印预览页
	$("#printDetail").click(ePrintClick2);
  //点击历史(左侧) && 置顶历史信息
  $(".conHistory-content-toTop").on("click",function(){orderHistoryClick(orderHistoryDeal,0)});
  // 点击历史-前一条
  $(".conHistory-content-right-top.active").on("click",function(){
    if ($(this).hasClass("active")) {
      orderHistoryClick(orderHistoryDeal,-1)
    }
  });
  // 点击历史-后一条
  $(".conHistory-content-right-bottom.active").on("click",function(){
    if ($(this).hasClass("active")) {
      orderHistoryClick(orderHistoryDeal,1)
    }
  });
});


// 获取url中的参数
function getUrlParam(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); // 构造一个含有目标参数的正则表达式对象
	var r = window.location.search.substr(1).match(reg); // 匹配目标参数
	if(r != null) return unescape(r[2]);
	return null; // 返回参数值
}

function outBoxOrder(msg, hideArea) {
	$("#tipMsg").addClass("active").html(msg).show();

	function tipHide() {
		$("#tipMsg").hide();
	}
	setTimeout(tipHide, 2000);
	$("#" + hideArea).modal('hide');
}
//给定一个日期，判断周几
function getMyDay(date){
	var week;
	if(date.getDay()==1) week="周日"
	if(date.getDay()==2) week="周一"
	if(date.getDay()==3) week="周二"
	if(date.getDay()==4) week="周三"
	if(date.getDay()==5) week="周四"
	if(date.getDay()==6) week="周五"
	if(date.getDay()==0) week="周六"
	return week;
}	
//转换成年月日，时分秒
 function getMyDate(str){    
        var oDate = new Date(str),    
            oYear = oDate.getFullYear(),    
            oMonth = oDate.getMonth()+1,    
            oDay = oDate.getDate(),    
            oHour = oDate.getHours(),    
            oMin = oDate.getMinutes(),    
            oSen = oDate.getSeconds(),    
            oTime = oYear +'-'+ getzf(oMonth) +'-'+ getzf(oDay) +' '+ getzf(oHour) +':'+ getzf(oMin) +':'+getzf(oSen);//最后拼接时间    
            return oTime;    
   	};    
    //补0操作    
    function getzf(num){    
        if(parseInt(num) < 10){    
            num = '0'+num;    
        }    
         return num;    
    }    