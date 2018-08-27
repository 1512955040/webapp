/**
 * 服务商SLA创建修改js Created by EKuter-si.yu on 2017/3/31.
 */

var formError = -1;
var successReturn = 1;
var flag = "sla_file";
//绑定分钟、小时、天、月选项数据
var timeDataDefined = [
    {
        value:"",
        timeData:"请选择"
    },
    {
        value:"分钟",
        timeData:"分钟"
    },
    {
        value:"小时",
        timeData:"小时"
    },
    {
        value:"天",
        timeData:"天"
    },
    {
        value:"月",
        timeData:"月"
    }
];
var timeDataValue = {
    timeData:{
        value: function () {
            return this.value;
        }
    }
}
//绑定时间类型数据
var timeTypeDefined = [
    {
        value:"",
        timeTypeData:"---请选择---"
    },
    {
        value:"84",
        timeTypeData:"日历时间"
    },
    {
        value:"83",
        timeTypeData:"工作时间"
    }
];
var timeDataTypeValue = {
    timeTypeData:{
        value: function () {
            return this.value;
        }
    }
}

/**
 * 点击选择品牌服务
 * */
function changeLogoOfTheSLA(){
    var changeLogo = document.getElementById("changeLogo");
    // 点击图标外面关闭弹窗
    $("body").click(function(){
        $("#optionalBox").hide();
    })
    //点击选择金牌服务
    $("#kingPai").click(function (e) {
    	e.stopPropagation();
        changeLogo.className="jinpai";
        $("#serviceVal").val(1);
        $("#boxPaiText").text("方案一金牌");
        $("#optionalBox").hide();
    });
    //点击选择银牌服务
    $("#silverPai").click(function (e) {
    	e.stopPropagation();
        changeLogo.className="yinpai";
        $("#serviceVal").val(2);
        $("#boxPaiText").text("方案一银牌");
        $("#optionalBox").hide();
    });
    //点击选择铜牌服务
    $("#copperPai").click(function (e) {
    	e.stopPropagation();
        changeLogo.className="tongpai";
        $("#serviceVal").val(3);
        $("#boxPaiText").text("方案一铜牌");
        $("#optionalBox").hide();
    });
    //点击选择第一服务
    $("#onePai").click(function (e) {
    	e.stopPropagation();
        changeLogo.className="one";
        $("#serviceVal").val(4);
        $("#boxPaiText").text("方案二第一");
        $("#optionalBox").hide();
    });
    //点击选择第二服务
    $("#twoPai").click(function (e) {
    	e.stopPropagation();
        changeLogo.className="two";
        $("#serviceVal").val(5);
        $("#boxPaiText").text("方案二第二");
        $("#optionalBox").hide();
    });
    //点击选择第三服务
    $("#threePai").click(function (e) {
    	e.stopPropagation();
        changeLogo.className="three";
        $("#serviceVal").val(6);
        $("#boxPaiText").text("方案二第三");
        $("#optionalBox").hide();
    });
    //点击选择高牌服务
    $("#highPai").click(function (e) {
    	e.stopPropagation();
        changeLogo.className="high";
        $("#serviceVal").val(7);
        $("#boxPaiText").text("方案三高");
        $("#optionalBox").hide();
    });
    //点击选择中牌服务
    $("#middlePai").click(function (e) {
    	e.stopPropagation();
        changeLogo.className="middle";
        $("#serviceVal").val(8);
        $("#boxPaiText").text("方案三中");
        $("#optionalBox").hide();
    });
    //点击选择低牌服务
    $("#lowPai").click(function (e) {
    	e.stopPropagation();
        changeLogo.className="low";
        $("#serviceVal").val(9);
        $("#boxPaiText").text("方案三低");
        $("#optionalBox").hide();
    });
}

var fileInput = "slaFileInput";//文件控件id
var fileNamesOld;//旧的文件名称
/*------------------------------sla新建、文件上传处理  开始-----------------------------------*/

/**
 * 保存新建/修改SLA信息
 * */
function saveSLAInfo(){

	$("#slaFileHelpId").val("");
	//先把提示的错误信息清除掉
	$(".errorB").html("");
	//获取区分增加和修改时的标志
	var updatePrivate = $("#slaUpdateFlag").val();
	//是否有文件需要上传
	var filesCount = $('#'+fileInput).fileinput('getFilesCount');
	var fileNames = [];//新上传的文件

	//如果没有文件需要上传，直接提交表单
	if(filesCount - 0 != 0){

		//获取需要上传的文件名称，写在一个隐藏域内
		fileNames = newfileNames(fileInput,fileNamesOld);
		$("#slaFileHelpId").val(fileNames);

		if("" != updatePrivate){
			//点击保存，进行“修改”
			checkFileNames(fileNames,slaUpdateSubmit);
		}else{
			//点击保存，进行“增加”
			//上传文件
			checkFileNames(fileNames,setSLAFlag);
		}
    }else{
    	if("" != updatePrivate){
    		//点击保存，进行“修改”
    		slaUpdateSubmit();
    	}else{
    		createSLAInfoFormSubmit(false);
    	}
    }
}
/**
 * ajax回调转换，只是为了设置一个参数true
 */
function setSLAFlag(){
    createSLAInfoFormSubmit(true);
}
/**
 * 保存新建SLA信息
 * */
function createSLAInfoFormSubmit(flag){
    var options;
    if(flag){
        options = {
            url:createSLAAgreementUrl,
            success:contractFormSubmitYseFile, //提交后处理
            error:function(XMLHttpRequest){
            	error_500(XMLHttpRequest.responseText);
    		},
            dataType:"json"
        };
    }else if(!flag){
        options = {
            url:createSLAAgreementUrl,
            success:contractFormSubmitNoFile, //提交后处理
            error:function(XMLHttpRequest){
            	error_500(XMLHttpRequest.responseText);
    		},
            dataType:"json"
        };
    }

    $("#slaForm").ajaxSubmit(options);
}


/**
 * SLA含有文件表单提交后处理
 * @param responseText
 * @param statusText
 */
function contractFormSubmitYseFile(responseText,statusText){

    //登录信息失效，ajax请求静态页面拦截
    onServiceComplete(responseText);

    if(responseText.status  == formError){

        //显示所有的错误信息
        $("span.slaNameErr").html(responseText.data.slaNameError);
        $("span.slaTimeErr").html(responseText.data.slaTimeError);
    }else{
        //console.log(responseText);
    	var slaId = responseText.data;
    	var filesCount = $('#slaFileInput').fileinput('getFilesCount');
        if(responseText.status == successReturn){
        	$("#file_help_id").val(slaId);
			$("#file_help_flag").val(flag);
            if(filesCount - 0 != 0){
				uploadFile("slaFileInput",slaId,updateSerSlaFileUrl);
			}else{
				toSLAList();
			}
        }else{
        	outBoxCloseSerSla("操作失败");
        }
    }
}
/**
 * 增加或者修改事件，有文件上成功后，需要修改数据库中的文件字段
 * @param eventId
 */
function updateSerSlaFileUrl(slaId,flag){
	
	var fileAll = $("#slaFileHelpId").val();//所有的文件名称
	
	var fileFail = flag.dataSub;//本次上传失败的文件名称（list）
	var fileSuccess = flag.data;//本次上传成功的文件名称（list）
	var fileReal = "";//数据库中需要存的文件名称（之前的名称+本次上传的文件名称）
	if(fileSuccess.length>0){
		//修改数据库中的文件字段
		if(null != fileNamesOld){
			fileReal += fileNamesOld+",";
		}
		fileReal += fileSuccess.toString();
		if(null != fileReal && "" != fileReal){
			$.ajax({
				url:updateSlaFileUrl,
				type:"post",
				data:{id:slaId,fileUrl:fileReal},
				dataType:"json",
				success:function(result){
					//登录信息失效，ajax请求静态页面拦截
		            onComplete(result);
		            
		            if(fileFail.length>0){
		            	//提示用户没有上传成功的文件名称
		            	outBoxCloseEvent(fileFail.toString()+"，未上传成功，请重试！");
		            	//再次点击保存时，进行修改。
		            	$("#slaUpdateFlag").val("updatePrivate");
		            	$("#sla_id").val(slaId);
		            	fileNamesOld = fileReal;
		            	$('#'+fileInput).fileinput('clear');
		            }else{
		            	toSLAList();//修改完数据库中的文件字段后，跳转页面
		            }
				},
				error:function(XMLHttpRequest){
					error_500(XMLHttpRequest.responseText);
				}
			});
		}
	}else{
		//提示用户没有上传成功的文件名称
    	outBoxCloseEvent(fileFail.toString()+"，未上传成功，请重试！");
    	//再次点击保存时，进行修改。
    	$("#slaUpdateFlag").val("updatePrivate");
    	$("#sla_id").val(slaId);
    	fileNamesOld = fileReal;
    	$('#'+fileInput).fileinput('clear');
	}

}
/**
 * 弹框的关闭
 * @param msg 弹框关闭后的提示信息
 */
function outBoxCloseSerSla(msg){
	$("#tipMsg").addClass("active").html(msg).show();
	function tipHide(){
		$("#tipMsg").hide();
	}
    setTimeout(tipHide,2000);
}
function toSLAList(){
    window.location.href = 'slaManagement.html';
}

/**
 * SLA不含文件的增加成功之后的操作
 * @param responseText
 * @param statusText
 */
function contractFormSubmitNoFile(responseText,statusText){

    //登录信息失效，ajax请求静态页面拦截
    onServiceComplete(responseText);
    //console.log(responseText.status);
    if(responseText.status  == formError){
        //console.log(responseText.data);
        //显示所有的错误信息
        $("span.slaNameErr").html(responseText.data.slaNameError);
        $("span.slaTimeErr").html(responseText.data.slaTimeError);
    }else if(responseText.status == successReturn){
        //var contractId = responseText.data;
        window.location.href = 'slaManagement.html';
    }else{
    	outBoxCloseSerSla("增加SLA协议失败！");
    }
}

/*------------------------------sla新建、文件上传处理  结束-----------------------------------*/


/*------------------------------sla编辑、文件上传处理  结束-----------------------------------*/

/**
 * sla编辑页面数据加载及绑定
 * */
function SLAInfoEdit(sla_id){

    var changeLogo = document.getElementById("changeLogo");

    $.ajax({
        traditional:true,
        url:loadSLADetailUrl,
        dataType:"json",
        type:'POST',
        async:true,
        data:{sla_id:sla_id},
        contentType:'application/x-www-form-urlencoded; charset=UTF-8',//防止乱码

        success:function(data){
        	
            //登录信息失效，ajax请求静态页面拦截
            onServiceComplete(data);

            if(null != data){
            	
            	fileNamesOld = data.attachment;
                var sla_level = data.sla_level;
                //var level_len = sla_level.length;

                var sla_de = {
                    urgentId:{
                        value: function () {
                            return sla_level[0].id;
                        }
                    },
                    urgentRespondText:{
                        value: function () {
                            return sla_level[0].response_time;
                        }
                    },
                    resource_urgentRespond_name:{
                        value: function () {
                            return sla_level[0].response_time_unit;
                        },
                        text: function () {
                            return sla_level[0].response_time_unit;
                        }
                    },
                    urgentFinishText:{
                        value: function () {
                            return sla_level[0].address_time;
                        }
                    },
                    resource_urgentFinish_name:{
                        value: function () {
                            return sla_level[0].address_time_unit;
                        },
                        text: function () {
                            return sla_level[0].address_time_unit;
                        }
                    },
                    resource_urgentType_name:{
                        value: function () {
                            return sla_level[0].service_time;
                        },
                        text: function () {
                            if(sla_level[0].service_time == 83){
                                return "工作时间";
                            }else if(sla_level[0].service_time == 84){
                                return "日历时间";
                            }
                        }
                    },
                    highId:{
                        value: function () {
                            return sla_level[1].id;
                        }
                    },
                    highRespondText:{
                        value: function () {
                            return sla_level[1].response_time;
                        }
                    },
                    resource_highRespond_name:{
                        value: function () {
                            return sla_level[1].response_time_unit;
                        },
                        text: function () {
                            return sla_level[1].response_time_unit;
                        }
                    },
                    highFinishText:{
                        value: function () {
                            return sla_level[1].address_time;
                        }
                    },
                    resource_highFinish_name:{
                        value: function () {
                            return sla_level[1].address_time_unit;
                        },
                        text: function () {
                            return sla_level[1].address_time_unit;
                        }
                    },
                    resource_highType_name:{
                        value: function () {
                            return sla_level[1].service_time;
                        },
                        text: function () {
                            if(sla_level[1].service_time == 83){
                                return "工作时间";
                            }else if(sla_level[1].service_time == 84){
                                return "日历时间";
                            }
                        }
                    },
                    middleId:{
                        value: function () {
                            return sla_level[2].id;
                        }
                    },
                    middleRespondText:{
                        value: function () {
                            return sla_level[2].response_time;
                        }
                    },
                    resource_middleRespond_name:{
                        value: function () {
                            return sla_level[2].response_time_unit;
                        },
                        text: function () {
                            return sla_level[2].response_time_unit;
                        }
                    },
                    middleFinishText:{
                        value: function () {
                            return sla_level[2].address_time;
                        }
                    },
                    resource_middleFinish_name:{
                        value: function () {
                            return sla_level[2].address_time_unit;
                        },
                        text: function () {
                            return sla_level[2].address_time_unit;
                        }
                    },
                    resource_middleType_name:{
                        value: function () {
                            return sla_level[2].service_time;
                        },
                        text: function () {
                            if(sla_level[2].service_time == 83){
                                return "工作时间";
                            }else if(sla_level[2].service_time == 84){
                                return "日历时间";
                            }
                        }
                    },
                    lowId:{
                        value: function () {
                            return sla_level[3].id;
                        }
                    },
                    lowRespondText:{
                        value: function () {
                            return sla_level[3].response_time;
                        }
                    },
                    resource_lowRespond_name:{
                        value: function () {
                            return sla_level[3].response_time_unit;
                        },
                        text: function () {
                            return sla_level[3].response_time_unit;
                        }
                    },
                    lowFinishText:{
                        value: function () {
                            return sla_level[3].address_time;
                        }
                    },
                    resource_lowFinish_name:{
                        value: function () {
                            return sla_level[3].address_time_unit;
                        },
                        text: function () {
                            return sla_level[3].address_time_unit;
                        }
                    },
                    resource_lowType_name:{
                        value: function () {
                            return sla_level[3].service_time;
                        },
                        text: function () {
                            if(sla_level[3].service_time == 83){
                                return "工作时间";
                            }else if(sla_level[3].service_time == 84){
                                return "日历时间";
                            }
                        }
                    }
                }
                $("#slaDetailInfo").render(data,sla_de);
                $(".selectpicker").selectpicker('refresh');

                var logoVal = $("#serviceVal").val();
                if(logoVal == 1){
                    changeLogo.className="jinpai";
                    $("#boxPaiText").text("方案一金牌");
                }else if(logoVal == 2){
                    changeLogo.className="yinpai";
                    $("#boxPaiText").text("方案一银牌");
                }else if(logoVal == 3){
                    changeLogo.className="tongpai";
                    $("#boxPaiText").text("方案一铜牌");
                }else if(logoVal == 4){
                    changeLogo.className="one";
                    $("#boxPaiText").text("方案二第一")
                }else if(logoVal == 5){
                    changeLogo.className="two";
                    $("#boxPaiText").text("方案二第二");
                }else if(logoVal == 6){
                    changeLogo.className="three";
                    $("#boxPaiText").text("方案二第三");
                }else if(logoVal == 7){
                    changeLogo.className="high";
                    $("#boxPaiText").text("方案三高");
                }else if(logoVal == 8){
                    changeLogo.className="middle";
                    $("#boxPaiText").text("方案三中");
                }else if(logoVal == 9){
                    changeLogo.className="low";
                    $("#boxPaiText").text("方案三低");
                }
                //用于区分修改和增加
                $("#slaUpdateFlag").val("slaUpdateFlag");
            }

        },
        error:function(XMLHttpRequest){
			error_500(XMLHttpRequest.responseText);
		}
    });
}

/**
 * sla信息修改后表单提交
 * */
function slaUpdateSubmit(){
    var options = {
        url:slaUpdateInfoUrl,
        success:contractFormSubmitYseFile, //提交后处理
        error:function(XMLHttpRequest){
        	error_500(XMLHttpRequest.responseText);
		},
        dataType:"json"
    };
    $("#slaForm").ajaxSubmit(options);
}
/*------------------------------sla编辑、文件上传处理  结束-----------------------------------*/


/**
 * jquery函数
 * */
$(function () {

    $("#boxPaiText").text("方案一金牌");

    //绑定规则分钟、小时、天、月数据
    $("#urgentRespondId,#urgentFinishId,#highRespondId,#highFinishId,#middleRespondId,#middleFinishId,#lowRespondId,#lowFinishId").render(timeDataDefined,timeDataValue);
    $("#urgentRespondId,#urgentFinishId,#highRespondId,#highFinishId,#middleRespondId,#middleFinishId,#lowRespondId,#lowFinishId").selectpicker('val',"");
    $("#urgentRespondId,#urgentFinishId,#highRespondId,#highFinishId,#middleRespondId,#middleFinishId,#lowRespondId,#lowFinishId").selectpicker('refresh');

    //绑定时间类型数据
    $("#urgentTypeId,#highTypeId,#middleTypeId,#lowTypeId").render(timeTypeDefined,timeDataTypeValue);
    $("#urgentTypeId,#highTypeId,#middleTypeId,#lowTypeId").selectpicker('val',"");
    $("#urgentTypeId,#highTypeId,#middleTypeId,#lowTypeId").selectpicker('refresh');

    //点击选择品牌服务
    $("#boxChoose").click(function (e) {
        e.stopPropagation();
        $("#optionalBox").show();
        changeLogoOfTheSLA();
    });

    //SLA编辑页面跳转
    //获取SLA的ID
    var sla_id = getUrlParam("sla_id");
    if(null != sla_id){
        SLAInfoEdit(sla_id);
    }

    //点击保存按钮
    $("#slaSave").click(saveSLAInfo);


    $("#urgentRespond .btn,#urgentFinish .btn,#highRespond .btn,#highFinish .btn,#middleRespond .btn,#middleFinish .btn,#lowRespond .btn,#lowFinish .btn").click(function () {
        //绑定规则分钟、小时、天、月数据
        //console.log($(this));
        $(this).parent().find(".selectpicker").render(timeDataDefined,timeDataValue);
        $(this).parent().find(".selectpicker").selectpicker('refresh');
    });

    $("#urgentType .btn,#highType .btn,#middleType .btn,#lowType .btn").click(function () {
        //绑定时间类型数据
        $(this).parent().find(".selectpicker").render(timeTypeDefined,timeDataTypeValue);
        $(this).parent().find(".selectpicker").selectpicker('refresh');
    });
});


//获取url中的参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}