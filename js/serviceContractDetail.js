/**
 * 服务商合同详情页面 Created by EKuter-amu on 2017/3/17.
 */
var groupId;//运维小组id
var startHistoryItem = 0; //记录请求历史信息时的起始位置
var numbersHistoryItem = 8;  //记录请求历史信息的条数;
/**
 * 加载合同详情信息
 * */
function loadSerContractDetail(contractId,dataArea) {

	$.ajax({
		traditional: true,
		url: loadContractDetailUrl,
		dataType: "json",
		type: 'POST',
		async: true,
		data: {
			contractId: contractId
		},
		contentType: 'application/x-www-form-urlencoded; charset=UTF-8', //防止乱码

		success: function(data){
			console.log(data);
			//登录信息失效，ajax请求静态页面拦截
			onServiceComplete(data);
			
			if(null != data) {
				//按钮的显示
				//1.根据合同状态筛选
				var elements = ["conEditBtn", "deleteBtn", "submitCheckBtn", "checkBtn",
					"backBtn", "createGroup", "continueConBtn"
				];
				//隐藏所有的按钮
				for(var i = 0; i < elements.length; i++) {
					$("#" + elements[i]).hide();
				}
				var rules = {
					79: ["conEditBtn", "createGroup", "deleteBtn"], //未审阅
					80: ["checkBtn", "backBtn"], //审阅中
					81: ["continueConBtn"], //审阅通过
					82: ["conEditBtn", "createGroup", "deleteBtn"], //审阅不通过
					83: ["conEditBtn", "createGroup", "submitCheckBtn", "deleteBtn"] //表示具备提交审阅的条件
				}
				var conCheckStatus = data.approval_status;
				var showEle = showElements(elements, conCheckStatus, rules).show;
				//显示需要显示的按钮
				if(null != showEle) {
					for(var i = 0; i < showEle.length; i++) {
						$("#" + showEle[i]).show();
					}
				}
				//2.根据是否是创建企业筛选
				var creater = data.create_enterprise;
				if(0 == creater) {
					//不是创建企业，隐藏“编辑”、“撤回”、“提交审阅”
					$("#conEditBtn,#submitCheckBtn,#backBtn,#deleteBtn").hide();
				} else {
					$("#checkBtn").hide();
					//            		$("#deleteBtn").show();
				}
				if(0 != creater && (conCheckStatus == 79 || conCheckStatus == 82)) {
					$("#deleteBtn").show();
				}

				if(null != data.operstion_group_id) {
					$("#createGroup").hide();
				}
				//获取附件的个数
				var fileDownloads=data.fileDownload.length;
                if(null != fileDownloads){
//                  var attachmentCount = electronic_type.split(",").length;
                    data.attachment = fileDownloads;
                }else{
                    data.attachment = 0;
                }
                //上传人
                $(".filePerson").html(data.person_name);
				//$("#attachment").render(attachmentCount);
				$("#conDetailRight").render(data);
				$("#conDetailLeft").render(data);
				$("#titleInfo").render(data);
				//$("#resourceDetailId").render(data);
				var conStatus = data.approval_status;
                groupId = data.operstion_group_id;
				loadConDetailSLAList(conStatus);
                loadOperationGroupInfo(groupId);
                //绑定文件的下载路径
                var hrefVal={
                		fileDownLoad:{
                			href:function(){
                				return this.filePath;
                			}
                		}
                }
                $("div.contractFile").render(data.fileDownload,hrefVal);
                setHistory(data.name);
                getHistory1()
			}
            //往打印的弹框里绑定数据
            if(null != dataArea){
            	dataArea.contractInfo.render(data);
            	dataArea.contractEnterprise.render(data);
            }
            //是否删除附件信息
			rowWrapDelete($('.modal-body-bottom-serviceDelete'),$('.rowWrapDelete'),$('#ServiceContractDelete'),$('.ServiceContractDetail'),$("[data-bind='filePath']"));
		},
		error: function(XMLHttpRequest){
			error_500(XMLHttpRequest.responseText);
		}
	});
}

/**
 * 合同信息编辑页面跳转
 * */
function serConInfoEdit() {
	//从页面上获取当前合同的ID
	var contractId = document.getElementById("contract_id").value;
	window.location.href = "newServiceContract.html?contractId=" + contractId;
}

/**
 * 加载归属该合同的所有资产清单
 * @param contractId 合同ID
 * @param page 页数
 * @param count 限定的条数
 * */
var count = 5;

function loadResListOfTheSerContract(contractId, currPage, resource_type) {

	//console.log("////////////////////////"+resource_type);
	$.ajax({
		traditional: true,
		url: loadResListOfTheContractUrl,
		dataType: "json",
		type: 'POST',
		async: true,
		data: {
			contractId: contractId,
			page: currPage,
			count: count,
			resource_type: resource_type
		},
		contentType: 'application/x-www-form-urlencoded; charset=UTF-8', //防止乱码

		success: function(data) {

			//登录信息失效，ajax请求静态页面拦截
			onServiceComplete(data);

			//console.log(data);
			var len = data.length;
			if(len != 0) {

				$("#con_res_list").show();

				$("#con_res_list").render(data);

				var len = data.length;
				var totalPage = data[0].page;
				var totalNum = data[0].total_numbers;

				var beginCount = (currPage - 1) * (count) + 1;
				var endCount;
				if(len - count == 0) {
					endCount = beginCount - 1 + count;
				} else {
					endCount = beginCount - 1 + (len) % (count);
				}

				var contractPage = {
					"beginCount": beginCount,
					"endCount": endCount,
					"totalCount": totalNum,
					"currPage": currPage,
					"totalPage": totalPage
				}
				var contractPageClass = {
					upConPage: {
						class: function() {
							if(currPage - 1 == 0) {
								return "conAsset-left conAsset-img";
							} else {
								return "conAsset-left conAsset-img active";
							}
						}
					},
					nextConPage: {
						class: function() {
							if(totalPage - 1 == 0 || totalPage - currPage == 0) {
								return "conAsset-right conAsset-img";
							} else {
								return "conAsset-right conAsset-img active";
							}
						}
					}
				}
				//向页面绑定分页数据
				$("#contractPage").render(contractPage, contractPageClass);
				setLeftHeight();

			} else {
				$("#con_res_list").hide();
			}
		},
		error: function(XMLHttpRequest) {
			error_500(XMLHttpRequest.responseText);
		}
	});
}

/**
 * 合同信息和合同资产页面切换
 * */
function changeSerConInfoAndRes(contractId, currPage) {

	$("#conInfo").click(function() {
		$("#conInfo").addClass("active").siblings().removeClass("active");
		// $("#conResource").removeClass("active");
		// $("#SLAInfo").removeClass("active");
		// $("#operationGroup").removeClass("active");
		$(".conAsset").hide();
		$(".slaInfoBox").hide();
		$(".operationGroup").hide();
		$(".conDetail").show();
		$(".serContractHistoryInfo").hide();

		setLeftHeight();
	});
	$("#conResource").click(function() {
		$("#conResource").addClass("active").siblings().removeClass("active");
		// $("#conInfo").removeClass("active");
		// $("#SLAInfo").removeClass("active");
		// $("#operationGroup").removeClass("active");
		$(".conDetail").hide();
		$(".slaInfoBox").hide();
		$(".operationGroup").hide();
		$(".conAsset").show();
		$(".serContractHistoryInfo").hide();

		//需求：将删除按钮禁用
		$('#res_delete').attr('disabled','true');
		//加载归属该合同的所有资产清单
		var con_categoryCode = $("#con_categoryCode").val();
		loadResListOfTheSerContract(contractId, currPage, con_categoryCode);
	});
	$("#SLAInfo").click(function() {
		// $("#conResource").removeClass("active");
		// $("#conInfo").removeClass("active");
		// $("#operationGroup").removeClass("active");
		$("#SLAInfo").addClass("active").siblings().removeClass("active");
		$(".conDetail").hide();
		$(".conAsset").hide();
		$(".operationGroup").hide();
		$(".slaInfoBox").show();
		$(".serContractHistoryInfo").hide();

		setLeftHeight();
	});
	$("#operationGroup").click(function() {
		// $("#conResource").removeClass("active");
		// $("#conInfo").removeClass("active");
		// $("#SLAInfo").removeClass("active");
		$("#operationGroup").addClass("active").siblings().removeClass("active");
		$(".conDetail").hide();
		$(".conAsset").hide();
		$(".slaInfoBox").hide();
		$(".operationGroup").show();
		$(".serContractHistoryInfo").hide();

		setLeftHeight();
	});
	$("#conHistory").click(function(){
		$("#conHistory").addClass("active").siblings().removeClass("active");
		$(".conDetail").hide();
		$(".conAsset").hide();
		$(".slaInfoBox").hide();
		$(".operationGroup").hide();
		$(".serContractHistoryInfo").show();
		setLeftHeight();
	});
}
function setLeftHeight(){
	$('.container-right-infoWrap').css('height','');
	if($('.conright-infoWrap-left').outerHeight()>parseInt($('.conright-infoWrap-right').css('minHeight'))){
					$('.container-right-infoWrap').css('height',$('.conright-infoWrap-left').outerHeight()+'px');
					$('.conright-infoWrap-right').css('height','100%');
					$('#container-left').css('height',$('#container-right').outerHeight()+30+'px');
	}else{
		$('#container-left').css('height',$('#container-right').outerHeight()+30+'px');
	}
}
/**
 * 加载运维小组成员信息
 * */
function loadOperationGroupInfo(groupId){
    if(null != groupId){
        $.ajax({
            traditional: true,
            url: searchOperationGroupUrl,
            dataType: "json",
            type: 'POST',
            async: true,
            data: {groupId:groupId},
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8', //防止乱码

            success: function(data) {

                //登录信息失效，ajax请求静态页面拦截
                onServiceComplete(data);
                //console.log(data);
                var groupLeader = data.headman;
                var groupMembers = data.member_group;
                $("#groupLeaderInfo").render(groupLeader);
                var groupMem = {
                    delButton:{
                        id: function () {
                            return "delMem"+this.per_id;
                        }
                    }
                }
                $("#groupMembersInfo").render(groupMembers,groupMem);
            },
            error: function(XMLHttpRequest) {
                error_500(XMLHttpRequest.responseText);
            }
        });
    }else{
        $("#yunweiGroup").remove();
    }
}

/**
 * 删除运维小组成员
 * */
function deleteGroupMember(personId,memberId){
    //从页面上获取页数信息
    var currPage = $("#currPage").val();
    //从页面上获取合同ID
    var contractId = $("#contract_id").val();
    //加载归属该合同的所有资产清单
    var resource_type = $("#con_categoryCode").val();
    $.ajax({
        traditional: true,
        url: delOperationGroupMemberUrl,
        dataType: "json",
        type: 'POST',
        async: true,
        data: {person_id:personId,member_id:memberId,contractId:contractId,groupId:groupId},
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8', //防止乱码

        success: function(data) {

            //登录信息失效，ajax请求静态页面拦截
            onServiceComplete(data);
            //console.log(data);
            if("delSuccess" == data.msg){
                $("#tipMsg").addClass("active").html("删除成员成功！").show();

                function hideMsg() {
                    $("#tipMsg").addClass("active").html("删除成员成功！").hide()
                }
                setTimeout(hideMsg, 3000);
//                loadResListOfTheSerContract(contractId, currPage, resource_type);
                loadOperationGroupInfo(groupId);
            }else if("false" == data.msg){
                $("#tipMsg").addClass("active").html("该成员正在执行工单，无法删除！").show();

                function hideMsg() {
                    $("#tipMsg").addClass("active").html("该成员正在执行工单，无法删除！").hide()
                }
                setTimeout(hideMsg, 3000);
            }
        },
        error: function(XMLHttpRequest) {
            error_500(XMLHttpRequest.responseText);
        }
    });
}

/**
 * 加载并绑定SLA数据
 * */
function loadConDetailSLAList(conStatus,dataArea) {

	$.ajax({
		traditional: true,
		url: loadSLAListUrl,
		dataType: "json",
		type: 'POST',
		async: true,
		data: {
			flag: true
		},
		contentType: 'application/x-www-form-urlencoded; charset=UTF-8', //防止乱码

		success: function(data) {

			//登录信息失效，ajax请求静态页面拦截
			onServiceComplete(data);
			var dataSub = [];
			//默认选中关联该合同的SLA
			var slaId = $("#con_slaId").val();
			//判断如果合同已经生效，则SLA信息只显示该合同已选中的
			if("81" == conStatus || "80" == conStatus) {
				var len = data.length;
				while(len--) {
					if(data[len].sla_id == slaId) {
						dataSub.push(data[len]);
					}
				}
			} else {
				dataSub = data;
			}
			var SLAInfoDefined = {
				LogoSmallClass: {
					class: function() {
						if(this.LOGO == 1) {
							return "jin";
						} else if(this.LOGO == 2) {
							return "yin";
						} else if(this.LOGO == 3) {
							return "tong";
						} else if(this.LOGO == 4) {
							return "one";
						} else if(this.LOGO == 5) {
							return "two";
						} else if(this.LOGO == 6) {
							return "three";
						} else if(this.LOGO == 7) {
							return "high";
						} else if(this.LOGO == 8) {
							return "middle";
						} else if(this.LOGO == 9) {
							return "low";
						}
					}
				},
				LogoBigClass: {
					class: function() {
						if(this.LOGO == 1) {
							return "jinpai";
						} else if(this.LOGO == 2) {
							return "yinpai";
						} else if(this.LOGO == 3) {
							return "tongpai";
						} else if(this.LOGO == 4) {
							return "one";
						} else if(this.LOGO == 5) {
							return "two";
						} else if(this.LOGO == 6) {
							return "three";
						} else if(this.LOGO == 7) {
							return "high";
						} else if(this.LOGO == 8) {
							return "middle";
						} else if(this.LOGO == 9) {
							return "low";
						}
					}
				},
				sla_info: {
					serviceTimeType: {
						text: function() {
							if(83 == this.service_time) {
								return "工作时间";
							} else if(84 == this.service_time) {
								return "日历时间";
							}
						}
					}
				},
				slaCheckIcon: {
					class: function() {
						if("81" == conStatus || "80" == conStatus) {
							return "";
						} else {
							if(this.sla_id == slaId) {
								return "slaCheckBox active";
							} else {
								return "slaCheckBox";
							}
						}
					}
				},
				slaInfoContent: {
					class: function() {
						if(this.sla_id == slaId) {
							return "slaInfoContent";
						} else {
							return "slaInfoContent dn";
						}
					}
				}

			}

			$("#slaList").render(dataSub, SLAInfoDefined);
			openAndCloseSLAInfo(conStatus);
            //绑定打印弹框的数据
            if(null != dataArea){
            	$(dataArea).render(dataSub,SLAInfoDefined);
            }
		},
		error: function(XMLHttpRequest) {
			error_500(XMLHttpRequest.responseText);
		}
	});
}

/**
 * 合同详情SLA信息列表信息展开/切换操作
 * */
function openAndCloseSLAInfo(conStatus) {
	if(conStatus!=80&&conStatus!=81){//拟定中
		$(".slaInfoBox").on("click", ".slaInfoTitle", function(e) {
			//var _this = $(this);
			if($(e.target).hasClass('slaCheckBox')) {
				//执行点击切换单选框操作
				//console.log('slaCheckBox');
	
			} else {
				if($(this).hasClass('active')) {
					//收起
					$(this).removeClass('active');
					$(this).find('.slaInfoTitleInfo').removeClass('dn');
					//slaInfoContent slideUp
	//				$(this).next().stop(true, false).slideUp(function() {
	//
	//					$(this).parent().css('background', '#fff');
	//					$(this).find('.slaListCaret').removeClass('active');
	//					$(this).find('.slaInfoTitleInfo').css('display', 'block');
	//
	//				});
					$(this).next().hide();
					$(this).parent().css('background', '#fff');
					$(this).find('.slaListCaret').removeClass('active');
					$(this).find('.slaInfoTitleInfo').css('display', 'block');
					setLeftHeight();
				} else {
					//展开
					$(this).find('.slaInfoTitleInfo').addClass('dn');
					$(this).addClass('active').parent().siblings('.slaInfoList').find('.slaInfoTitle.active').removeClass('active');
					$(this).parent().siblings('.slaInfoList').find('.slaInfoTitleInfo').removeClass('dn');
					$(this).parent().siblings('.slaInfoList').css('background', '#fff').find('.slaInfoContent').hide();
					//slaInfoContent slideDown
	//				$(this).next().stop(true, false).slideDown(function() {
	//
	//					$(this).parent().css('background', '#f5f5f5');
	//					$(this).find('.slaListCaret').addClass('active');
	//					$(this).find('.slaInfoTitleInfo').css('display', 'none');
	//				});
					$(this).next().show();
					$(this).parent().css('background', '#f5f5f5');
					$(this).find('.slaListCaret').addClass('active');
					$(this).find('.slaInfoTitleInfo').css('display', 'none');
					setLeftHeight();
	
				}
			}
	
			//收起其他的项
			//$(this).parent().siblings('.slaInfoList').find('.slaListCaret').removeClass('active');
	
			});
	}else{
		var $this = $(this);
	    if ($this.hasClass("active")) {
	      $this.removeClass("active").next().slideUp();
	      $this.parent().css('background', '#fff');
	    }else {
	      $this.addClass("active").next().slideDown();
	      $this.parent().css('background', '#f5f5f5');
	      $this.parent().siblings().css('background', '#fff').find(".slaInfoTitle").removeClass("active").next().slideUp();
	    }
	    $('.slaInfoTitle').hover(function(){
    		$(this).css({"background-color":"#fff",'color':'#696969','cursor':'Default'});
		},function(){
		    $(this).css({"background-color":"#fff",'color':'#696969','cursor':'Default'});
		});
	    $('.slaInfoTitleCaret').hide();//隐藏箭头
	    $('.slaInfoTitleInfo').hide();//隐藏图标
	}
}

/**
 * 点击切换选择sla服务
 * */
function changeSLARule(contractId) {

	$(".slaInfoBox").on("click", '.slaCheckBox', function() {
		var sla_id = $(this).parent().parent().find("input").val();
		var con_status = $("#status").val();
		//默认选中关联该合同的SLA
		var slaId = $("#con_slaId").val();
		if(81 == con_status) {
			$("#tipMsg").addClass("active").html("已生效合同不可变更SLA服务").show();

			function hideMsg() {
				$("#tipMsg").addClass("active").html("已生效合同不可变更SLA服务").hide()
			}
			setTimeout(hideMsg, 3000);
		} else if(sla_id != slaId) {
			$("#pupDelete5").modal("show");
			$("#changeConfirm").click(function() {
				$.ajax({
					traditional: true,
					url: changeContractSLAUrl,
					dataType: "json",
					type: 'POST',
					async: true,
					data: {
						contractId: contractId,
						slaId: sla_id
					},
					contentType: 'application/x-www-form-urlencoded; charset=UTF-8', //防止乱码

					success: function(data) {

						//登录信息失效，ajax请求静态页面拦截
						onServiceComplete(data);

						$("#pupDelete5").modal("hide");
						$("#tipMsg").addClass("active").html(data.msg).show();

						function hideMsg() {
							$("#tipMsg").addClass("active").html(data.msg).hide()
						}
						setTimeout(hideMsg, 2000);

						loadSerContractDetail(contractId);

						//$(this).addClass('active').parent().parent().parent().siblings('.slaInfoList').find('.slaCheckBox.active').removeClass('active');
					},
					error: function(XMLHttpRequest) {
						error_500(XMLHttpRequest.responseText);
					}
				});
			});
		}

	})
}

//合同关联资产列表选中资产分类条件加载资产
function loadSerResByType() {
	//$("#con_res_list").html("");
	//从页面上获取当前资产分类选中条件
	var con_categoryCode = $("#con_categoryCode").val();

	//从页面上获取当前合同的ID
	var contractId = document.getElementById("contract_id").value;
	//从页面上获取页数信息
	var currPage = $("#currPage").val();
	if("" == currPage) {
		currPage = 1;
	} else {
		currPage = $("#currPage").val();
	}
	loadResListOfTheSerContract(contractId, currPage, con_categoryCode);
}

/**
 * 创建运维小组（按钮弹框）
 * */
function createOperationGroup() {

	$("#createGroupBtn").modal("show");

	//加载该企业下的部门组织架构
	creatTree("department-tree", "department-menu", "department", "departmentCode", departmentDataUrl, true,loadSerResByType);

	//加载企业人员列表
	loadServiceEmployees();

	$("#groupLeader .btn").click(function() {
		loadServiceEmployees(0);
	});
	$("#groupMembers .bootstrap-select").click(function() {
		loadServiceEmployees(1);
	});

}

/**
 * 创建运维小组（弹框确认添加）
 * */
function createOperationGroupConfirm() {

	//获取运维小组名称
	var groupName = $("#groupName").val();
	//获取运维小组描述信息
	var groupDescribeInfo = $("#groupDescribe").val();
	//获取部门ID
	var departmentId = $("#departmentCode").val();
	//获取运维小组组长ID/名字
	var groupLeaderId = $("select.groupLeader option:selected").val();
	var str = $("select.groupLeader option:selected").text().split("(");
	var groupLeaderName = str[0];
    //获取运维小组成员IDs/Names , 用','拼接
    var groupMemberIds = $("#members_list").val().join(",");
    var groupMemberNames = [];
    $("#members_list").find("option:selected").each((i, val) => {
        groupMemberNames.push(val.innerHTML);
    });
    groupMemberNames = groupMemberNames.join(",");
    
	//获取当前合同ID
	var contractId = $("#contract_id").val();

	$.ajax({
		traditional: true,
		url: createOperationGroupConfirmUrl,
		dataType: "json",
		type: 'POST',
		async: true,
		data: {
			name: groupName,
			group_describe: groupDescribeInfo,
			contract_id: contractId,
			department: departmentId,
			groupLeaderId: groupLeaderId,
			groupMemberIds: groupMemberIds,
			groupLeaderName: groupLeaderName,
			groupMemberNames: groupMemberNames
		},
		contentType: 'application/x-www-form-urlencoded; charset=UTF-8', //防止乱码

		success: function(data) {

			//登录信息失效，ajax请求静态页面拦截
			onServiceComplete(data);

			var code = data.code;
			if("1" == code) {
				$("span.deptNameErr").html(data.msg);
			} else if("2" == code) {
				$("span.groupNameErr").html(data.msg);
			} else if("3" == code) {
				$("span.groupLeaderErr").html(data.msg);
			} else {
				$("#createGroupBtn").modal("hide");
				$("#tipMsg").addClass("active").html(data.msg).show();

				function hideMsg() {
					$("#tipMsg").addClass("active").html(data.msg).hide()
				}
				setTimeout(hideMsg, 2000);
				loadSerContractDetail(contractId);
			}

		},
		error: function(XMLHttpRequest) {
			error_500(XMLHttpRequest.responseText);
		}
	});
}

/**
 * 加载企业员工列表
 * */
function loadServiceEmployees(type) {

	$.ajax({
		traditional: true,
		url: loadServiceEmployeesUrl,
		dataType: "json",
		type: 'POST',
		async: true,
		data: '',
		contentType: 'application/x-www-form-urlencoded; charset=UTF-8', //防止乱码

		success: function(data) {

			//登录信息失效，ajax请求静态页面拦截
			onServiceComplete(data);
//			console.log(data);
			//len = data.length;
			var employees = {
				groupLeaderSelectData: {
					value: function() {
						return this.id;
					},
					text: function() {
						if("" == this.id) {
							return this.name;
						}
						if(null == this.department_name) {
							return this.name + "(" + "无" + ")";
						}
						return this.name + "(" + this.department_name + ")";
					}
				},
				groupMembersSelectData: {
					value: function() {
						return this.id;
					},
					text: function() {
						if("" == this.id) {
							return this.name;
						}
						if(null == this.department_name) {
							return this.name + "(" + "无" + ")";
						}
						return this.name + "(" + this.department_name + ")";
					}
				}
			}

			if(0 == type) {
				//获取运维小组成员IDs
				var groupMemberIds = getCheckCon();

				if(null != groupMemberIds) {
					var len = data.length;
					var idsLen = groupMemberIds.length;
					for(var j = idsLen - 1; j >= 0; j--) {
						for(var i = len - 1; i > 0; i--) {
							if(data[i].id == groupMemberIds[j]) {
								data.splice(i, 1);
								len--;
							}
						}
					}
				}
				$("#groupLeaderSelect").render(data, employees);
				$("#groupLeaderSelect").selectpicker('val', "");
				$('#groupLeader .selectpicker').selectpicker('refresh');
			} else if(1 == type) {
				data.shift();
				//获取运维小组组长ID
				var groupLeaderId = $("select.groupLeader option:selected").val();
				//判断是否选定组长，如果选定组长，则在选择组员的列表中将组长选定人员去除
				if("" != groupLeaderId) {
					var len = data.length;
					while(len--) {
						if(data[len].id == groupLeaderId) {
							data.splice(len, 1);
						}
					}
				}

				$("#members_list").render(data, employees);

//				$("#members_list").selectpicker('val',"");
				$('#groupMembers .selectpicker').selectpicker('refresh');
				//选中组员将选中组员的名字显示在选择组员框内并关闭选择框
//				$("#selectConfirm").click(function() {
//					$("#myConAsset").modal("hide");
//					//获取运维小组成员IDs
//					var groupMemberNames = getCheckNames();
//					$("#groupMembersChoose").val(groupMemberNames);
//				});
			} else {
//				$("#groupLeaderSelect").render(data, employees);
//				$("#groupLeaderSelect").selectpicker('val', "");
//				$('#groupLeader .selectpicker').selectpicker('refresh');

				$("#groupLeaderSelect").render(data, employees);
				$("#groupLeaderSelect").selectpicker('val', "");
				$("#members_list").render(data, employees);
				$("#members_list").selectpicker('val', "");

				$('#groupMembers .selectpicker').selectpicker('refresh');
			}
		},
		error: function(XMLHttpRequest) {
			error_500(XMLHttpRequest.responseText);
		}
	});
}

/**
 * 点击每条合同前面的小方块
 * 1.给小方框加上样式
 * 2.获取当前选中的合同条数，改变“删除”的样式，只有的选中了合同，才可以点击“删除”
 */
function serConChooseClick() {

	if($(this).hasClass("active")) {
		$(this).removeClass("active");
	} else {
		$(this).addClass("active");
	}
	//var con_ids = getCheckCon();
	//console.log(con_ids);
}
/**
 * 获取当前组员列表中选中成员的ids
 * @returns {Array}
 */
function getCheckCon() {
	var con_ids = [];
//	var $checkPro = $("#members_list").find("i.active").parent().prev();
	var $checkPro =$('#groupMembers .dropdown-menu').find('li.selected');
	$checkPro.each(function(i,d) {
		con_ids.push($('#members_list').find('option').eq(i).val());

	});
	return con_ids;
}

function getCheckNames() {
	var nameList = [];
//	var $checkPro = $("#members_list").find("i.active").parent();
//	$checkPro.each(function() {
//		nameList.push($(this).text().replace(/\s+/g, ""));
//	});

	var $checkPro =$('#groupMembers .dropdown-menu').find('li.selected');
	$checkPro.each(function(i,d) {
		nameList.push($('#members_list').find('option').eq(i).text().replace(/\s+/g, ""));

	});
	return nameList;
}

/**
 * 合同提交审阅
 * wanglei
 */
function conCheckClick() {
	var contractId = getUrlParam("contractId");
	$("#pupDelete").modal("show");
	$("button.btn-pupDelete").click(function() {
		$.ajax({
			url: conCheckUrl,
			data: {
				contractId: contractId
			},
			type: "get",
			dataType: "json",
			success: function(result) {

				//登录信息失效，ajax请求静态页面拦截
				onServiceComplete(result);

				if(1 == result.status) {
					outBoxCon(result.msg, "pupDelete");
					loadSerContractDetail(contractId);
				}
			},
			error: function(XMLHttpRequest) {
				error_500(XMLHttpRequest.responseText);
			}
		});
	});
}
/**
 * 合同审阅通过
 */
function checkYesCon() {
	var contractId = getUrlParam("contractId");
	var start = $("[data-bind='start_time']").html();
	var end = $("[data-bind='end_time']").html();
	$.ajax({
		url: conCheckResultUrl,
		data: {
			contractId: contractId,
			flag: true,
			start:start,
			end:end
		},
		type: "get",
		dataType: "json",
		success: function(result) {

			//登录信息失效，ajax请求静态页面拦截
			onServiceComplete(result);

			if(1 == result.status) {
				outBoxCon(result.msg, "pupDelete2");
				loadSerContractDetail(contractId);
			}
		},
		error: function(XMLHttpRequest) {
			error_500(XMLHttpRequest.responseText);
		}
	});
}
/**
 * 合同审阅不通过
 */
function checkNoCon() {
	var contractId = getUrlParam("contractId");
	$.ajax({
		url: conCheckResultUrl,
		data: {
			contractId: contractId,
			flag: false
		},
		type: "get",
		dataType: "json",
		success: function(result) {

			//登录信息失效，ajax请求静态页面拦截
			onServiceComplete(result);

			if(1 == result.status) {
				outBoxCon(result.msg, "pupDelete2");
				loadSerContractDetail(contractId);
			}
		},
		error: function(XMLHttpRequest) {
			error_500(XMLHttpRequest.responseText);
		}
	});
}
/**
 * 合同审阅
 * wanglei
 */
function conChenckResClick() {

	$("#pupDelete2").modal("show");
}
/**
 * 点击撤回
 * wanglei
 */
function revokeClick() {
	var contractId = getUrlParam("contractId");
	$("#pupDelete3").modal("show");
	$("button.btn-pupDelete3").click(function() {
		$.ajax({
			url: conRevokeUrl,
			data: {
				contractId: contractId
			},
			type: "get",
			dataType: "json",
			success: function(result) {

				//登录信息失效，ajax请求静态页面拦截
				onServiceComplete(result);

				if(1 == result.status) {
					outBoxCon(result.msg, "pupDelete3");
					loadSerContractDetail(contractId);
				}
			},
			error: function(XMLHttpRequest) {
				error_500(XMLHttpRequest.responseText);
			}
		});
	});
}

/**
 * 点击删除合同
 */
function deleteSerConClick() {
	var contractId = getUrlParam("contractId");
	$.ajax({
		url: contractDeleteUrl,
		data: {
			ids: contractId
		},
		type: "get",
		dataType: "json",
		success: function(result) {

			//登录信息失效，ajax请求静态页面拦截
			onComplete(result);
			$("#pupDelete6").modal("hide");
			if("true" == result.code) {
				outBoxCon(result.msg);
				setTimeout(goToSerList, 2000);
			} else {
				outBoxCon(result.msg);
			}
		},
		error: function(XMLHttpRequest) {
			error_500(XMLHttpRequest.responseText);
		}
	});
}

function goToSerList() {
	window.location.href = 'serviceContract.html';
}

/*切换打印弹框的打印选项*/
function choosePrint(){
  var $i = $(this).children("i");
  var checkedFlag = $i.hasClass("active");
  var idx = $(this).index()-1;

  if (checkedFlag) {
    $i.removeClass("active");
    $("#print .modal-box").eq(idx).css("display","none");
  }else {
    $i.addClass("active");
    $("#print .modal-box").eq(idx).css("display","block");
  }
}
/**
 * 加载与合同关联的所有资源
 * @param areaRes
 */
function loadAllSerResource(areaRes){

    $.ajax({
        traditional:true,
        url:loadResListOfTheContractUrl,
        dataType:"json",
        type:'get',
        async:true,
        data:{contractId:contractId,page:-1},
        contentType:'application/x-www-form-urlencoded; charset=UTF-8',//防止乱码

        success:function(data){
        	if(null != areaRes){
        		areaRes.render(data);
        	}
        },
        error:function(XMLHttpRequest){
			error_500(XMLHttpRequest.responseText);
		}
    });
}
/**
 * 该合同的sla信息
 * @param contractId 合同id
 * @param dataArea 绑定数据的区域
 */
function loadSerConSla(slaId,dataArea){
    $.ajax({
        url:loadSLADetailUrl,
        dataType:"json",
        type:'get',
        async:true,
        data:{sla_id:slaId},
        contentType:'application/x-www-form-urlencoded; charset=UTF-8',//防止乱码

        success:function(data){
            var SLAInfoDefined = {
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
        	if(null != dataArea){
        		dataArea.render(data,SLAInfoDefined);
        	}
        },
        error:function(XMLHttpRequest){
			error_500(XMLHttpRequest.responseText);
		}
    });
}
var dataArea = new Object();//合同数据
dataArea.contractInfo = $("div.contrctInfo");
dataArea.contractEnterprise = $("div.contractEnterprise");
dataArea.areaSla = $("div.contractSlaP");//合同的sla数据
dataArea.areaRes = $("#con_list");//合同资源
/**
 * 打印合同的数据
 * @param contractId
 */
var printSerConData = function printData(slaId,dataArea){
	var dataAreaHrelp = new Object();
	dataAreaHrelp.contractInfo = dataArea.contractInfo;
	dataAreaHrelp.contractEnterprise = dataArea.contractEnterprise;
	loadSerContractDetail(contractId,dataAreaHrelp);//合同数据+合同厂商数据
//	var sla = $("#con_slaId").val();
	if(null == slaId){
         loadConDetailSLAList(81,dataArea.areaSla);
	}else{
		loadSerConSla(slaId,dataArea.areaSla);//合同sla数据
	}
	loadAllSerResource(dataArea.areaRes);//与合同关联的资源数据
}
/**
 * 点击弹出框里的打印，跳到一个新的页面，调用网页的打印方法
 */
function openNeWindowClick(){
  var canPrint = 0;  //打印项数量
  var printFlag = "";  //打印信息

  if ($("#contract_info").hasClass("active")) {
    printFlag += "&contract_info=1";
    canPrint++;
  }else{
    printFlag += "&contract_info=2";
  }
  if ($("#contract_asset").hasClass("active")) {
    printFlag += "&contract_asset=1";
    canPrint++;
  }else{
    printFlag += "&contract_asset=2";
  }
  if ($("#contract_company").hasClass("active")) {
    printFlag += "&contract_company=1";
    canPrint++;
  }else{
    printFlag += "&contract_company=2";
  }
  if ($("#contract_sla").hasClass("active")) {
	var slaId = $("#con_slaId").val();
    printFlag += "&contract_sla=1&slaId="+slaId;
    canPrint++;
  }else{
    printFlag += "&contract_sla=2";
  }

  if (canPrint == 0) {
    $("#pupDelete7").modal("show");
  }else {
    window.open("printSerContrat.html?contractId="+contractId+printFlag);
  }
}

var contractId=getUrlParam("contractId");

/**
 * 文件下载弹框
 */
function fileDownload(){
	var count = $("[data-bind='attachment']").text();
	 if(null != count && count>0){
		 $("#accessory").modal("show");
	 }
}

/**
 * 点击历史
 */
function conHistoryClick(conHistoryDeal,arrowType){
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
        'type':93,
        'type_id': contractId,
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

          conHistoryDeal(result);
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
 function conHistoryDeal(result){
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
 * jquery函数
 * */
$(function() {
	//获取页面跳转传值
	var contractId = getUrlParam("contractId");
	$("#contract_id").val(contractId);
	//从页面上获取页数信息
	var currPage = $("#currPage").val();
	if("" == currPage) {
		currPage = 1;
	} else {
		currPage = $("#currPage").val();
	}

	//从页面上获取当前资产分类选中条件
	var con_categoryCode = $("#con_categoryCode").val();
	//合同信息和合同资产页面切换
	changeSerConInfoAndRes(contractId, currPage, con_categoryCode);

	//初始加载数据
	loadSerContractDetail(contractId);

	//编辑合同
	$("#conEditBtn").click(serConInfoEdit);

	//加载分类树,如果没有分类id，则在当前页面选择一个分类id，再发送ajax请求,加载对应的属性模板
	creatTree("con_category-tree", "con_category-menu", "con_category", "con_categoryCode", loadCategoryZTreeUrl, true,loadSerResByType);
	//选中分类条件即加载数据
	//$("#resource_type .ztree").click(loadSerResByType);

	//创建运维小组（按钮操作）
	$("#createGroup").click(createOperationGroup);

	//点击该合同未关联的每个资产前面的小框
	$("#members_list").on("click", "i", serConChooseClick);

	//创建运维小组
	$("#createGroupConfirm").click(createOperationGroupConfirm);
	$('#members_list').click()

	//点击提交审阅
	$("#submitCheckBtn").click(conCheckClick);
	//点击审阅
	$("#checkBtn").click(conChenckResClick);
	//点击撤回
	$("#backBtn").click(revokeClick);
	//点击删除合同
	$("#deleteBtn").click(function() {
		$("#pupDelete6").modal("show");
	});
	$("#delCon").click(deleteSerConClick);

	//合同详情SLA信息列表信息展开/切换操作
	//openAndCloseSLAInfo();

	//点击切换选择sla服务
	changeSLARule(contractId);

    //运维小组成员删除
    $("#groupMembersInfo").on('click','i.close-icon', function () {
        var personId = $(this).next().val();
        var memberId = $(this).next().next().val();
        deleteGroupMember(personId,memberId);
    })

    $("button.btn-pupDelete2").click(checkYesCon);//合同审阅通过
	$("button.btn-pupDelete-no").click(checkNoCon);//合同审阅不通过

	//点击附件，弹出弹框，可以下载文件
    $("[data-bind='attachment']").click(fileDownload);

		//点击[打印键],弹出打印弹窗
		$("#printBtn").on("click",function(){
			var slaId;
			printSerConData(slaId,dataArea);
			$("#print").modal('show');

			//只显示第一项, 只显示第一项内容
			$("#print .classRe").removeClass("active");
			$("#print .classRe:first").addClass("active");
			$("#print .modal-box").css("display","none");
			$("#print .modal-box:first").css("display","block");
		});

		//打印弹窗 - 切换打印内容
    $("#print .modal-body-id li:has(i)").on("click",choosePrint);

		//点击弹出框里的打印，跳到一个新的页面，调用网页的打印方法
    $("#openNeWindow").click(openNeWindowClick);
		//点击历史(左侧) && 置顶历史信息
    $("#conHistory,.conHistory-content-toTop").on("click",function(){conHistoryClick(conHistoryDeal,0)});
    // 点击历史-前一条
    $(".conHistory-content-right-top.active").on("click",function(){
      if ($(this).hasClass("active")) {
        conHistoryClick(conHistoryDeal,-1)
      }

    });
    // 点击历史-后一条
    $(".conHistory-content-right-bottom.active").on("click",function(){
      if ($(this).hasClass("active")) {
        conHistoryClick(conHistoryDeal,1)
      }
    });

})

//获取url中的参数
function getUrlParam(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
	var r = window.location.search.substr(1).match(reg); //匹配目标参数
	if(r != null) return unescape(r[2]);
	return null; //返回参数值
}
//提示信息框的隐藏
function outBoxCon(msg, hideArea) {
	$("#tipMsg").addClass("active").html(msg).show();

	function tipHide() {
		$("#tipMsg").hide();
	}
	setTimeout(tipHide, 2000);
	$("#" + hideArea).modal('hide');
}
