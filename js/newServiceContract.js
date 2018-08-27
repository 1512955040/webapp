/**
 *  新建服务合同页面管理 Created by EKuter-amu on 2017/3/15.
 */

var successReturn = 1;//操作成功
var errorReturn = 2;
var formError = -1;
var flag = "contract_file";

var checkEnterprise = null;  //选中的合同厂商ID
/**
 * 加载绑定合同厂商（企业）的选择列表
 * */
function loadEnterpriseNameList(){
    $.ajax({
        url:loadEnterpriseNameListUrl,
        traditional: true,
        data:'',
        type:"post",
        dataType:"json",
        success:function(data){

            //登录信息失效，ajax请求静态页面拦截
            onServiceComplete(data);

//          console.log(data);
            //往页面绑定乙方企业ID的数据
            var serCreateCon = {
                enterprise_name:{
                    value:function(){
                   		return this.id;
                    },
                    text: function () {
                        return this.name;
                    }
                }
            }
            $("#contractFirm_id").render(data,serCreateCon);
//	        $("#contractFirm_id").selectpicker('val',"");
            $('#conFirm .selectpicker').selectpicker('refresh');
//          $("#contractFirm_id").selectpicker('val',checkEnterprise);
        },
        error:function(XMLHttpRequest){
			error_500(XMLHttpRequest.responseText);
		}
    });
}
var fileInput = "file-1";
var fileNamesOld;//旧的合同文件名称
/**
 * 保存新建/修改合同信息
 * */
function serSaveConInfo(){
	$("#fileHelpId").val("");
	//先把提示的错误信息清除掉
	$(".errorB").html("");
	//获取区分增加和修改时的标志
	var updatePrivate = $("#conUpdateFlag").val();
	//是否有文件需要上传
	var filesCount = $('#'+fileInput).fileinput('getFilesCount');
	var fileNames = [];//新上传的文件

	//如果没有文件需要上传，直接提交表单
	if(filesCount - 0 != 0){
		//获取需要上传的文件名称，写在一个隐藏域内
		fileNames = newfileNames(fileInput,fileNamesOld);
		$("#fileHelpId").val(fileNames);
		
		if("" != updatePrivate){
			//点击保存，进行“修改”
			checkFileNames(fileNames,contractUpdateSubmit);
		}else{
			//点击保存，进行“增加”
			//上传文件
			checkFileNames(fileNames,setConFlag);
		}
    }else{
    	if("" != updatePrivate){
    		//点击保存，进行“修改”
    		contractUpdateSubmit();
    	}else{
    		createContractInfoFormSubmit(false);
    	}
    }
}
/**
 * ajax回调转换，只是为了设置一个参数true
 */
function setConFlag(){
    createContractInfoFormSubmit(true);
}
/**
 * 保存新建合同信息
 * */
function createContractInfoFormSubmit(flag){
    var options;
    if(flag){
        options = {
            url:contractCreateUrl,
            success:contractFormSubmitYseFile, //提交后处理
            dataType:"json"
        };
    }else if(!flag){
        options = {
            url:contractCreateUrl,
            success:contractFormSubmitNoFile, //提交后处理
            dataType:"json"
        };
    }
    $("#contractForm").ajaxSubmit(options);
}


/**
 * 合同含有文件表单提交后处理
 * @param responseText
 * @param statusText
 */
function contractFormSubmitYseFile(responseText,statusText){
    //登录信息失效，ajax请求静态页面拦截
    onComplete(responseText);
	//console.log(responseText);
    if(responseText.status  == formError){
        //显示所有的错误信息
        $("span.conNameErr").html(responseText.data.conNameError);
        $("span.conFirmErr").html(responseText.data.conFirmError);
        $("span.conPriceErr").html(responseText.data.conPriceError);
        $("span.conTypeErr").html(responseText.data.conTypeError);
    }else{
        var contractId = responseText.data;
        var filesCount = $('#file-1').fileinput('getFilesCount');
        if(responseText.status == successReturn){
        	$("#file_help_id").val(contractId);
			$("#file_help_flag").val(flag);
            if(filesCount - 0 != 0){
				uploadFile("file-1",contractId,updateSerContractFileUrl);
			}else{
				toContractDetail(contractId);
			}
        }else{
        	outBoxCloseSerCon("操作失败");
        }
    }
}


/**
 * 增加或者修改事件，有文件上成功后，需要修改数据库中的文件字段
 * @param eventId
 */
function updateSerContractFileUrl(contractId,flag){
	var fileAll = $("#fileHelpId").val();//所有的文件名称
	
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
				url:updateConFileUrl,
				type:"post",
				data:{id:contractId,fileUrl:fileReal},
				dataType:"json",
				success:function(result){
					//登录信息失效，ajax请求静态页面拦截
		            onComplete(result);
		            
		            if(fileFail.length>0){
		            	//提示用户没有上传成功的文件名称
		            	outBoxCloseEvent(fileFail.toString()+"，未上传成功，请重试！");
		            	//再次点击保存时，进行修改。
		            	$("#conUpdateFlag").val("updatePrivate");
		            	$("#contractIdEdit").val(contractId);
		            	fileNamesOld = fileReal;
		            	$('#'+fileInput).fileinput('clear');
		            }else{
		            	toContractDetail(contractId);//修改完数据库中的文件字段后，跳转页面
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
    	$("#conUpdateFlag").val("updatePrivate");
    	$("#contractIdEdit").val(contractId);
    	fileNamesOld = fileReal;
    	$('#'+fileInput).fileinput('clear');
	}

}
/**
 * 弹框的关闭
 * @param msg 弹框关闭后的提示信息
 */
function outBoxCloseSerCon(msg){
	$("#tipMsg").addClass("active").html(msg).show();
	function tipHide(){
		$("#tipMsg").hide();
	}
    setTimeout(tipHide,2000);
}
function toContractDetail(contractId){
    window.location.href = 'serviceContractDetail.html?contractId='+contractId;
}

/**
 * 合同不含文件的增加成功之后的操作
 * @param responseText
 * @param statusText
 */
function contractFormSubmitNoFile(responseText,statusText){

    //登录信息失效，ajax请求静态页面拦截
    onServiceComplete(responseText);

    if(responseText.status  == formError){
        //显示所有的错误信息
        $("span.conNameErr").html(responseText.data.conNameError);
        $("span.conFirmErr").html(responseText.data.conFirmError);
        $("span.conPriceErr").html(responseText.data.conPriceError);
    }else if(responseText.status == successReturn){
        var contractId = responseText.data;
        window.location.href = 'serviceContractDetail.html?contractId='+contractId;
    }else{
    	outBoxCloseSerCon("增加合同失败！");
    }
}

/*------------------------开始------------------------*/
/*--------------------合同编辑操作---------------------*/
/**
 *合同信息加载及绑定
 * */
function contractInfoEdit(contractId){
	

    var deValue = {
//      enterprise_name: {
//          value: function () {
//          	console.log(this.party_B)
//              return this.party_B;
//          },
//          text: function () {
//              return this.enterprise_name;
//          }
//      },
        contract_type_name:{
            value:function(){
                return this.contract_type;
            }
        }
    };

    $.ajax({
        traditional:true,
        url:loadContractDetailUrl,
        dataType:"json",
        type:'POST',
        async:true,
        data:{contractId:contractId},
        contentType:'application/x-www-form-urlencoded; charset=UTF-8',//防止乱码

        success:function(data){
				console.log(data);
            //登录信息失效，ajax请求静态页面拦截
            onServiceComplete(data);

            //loadEnterpriseNameList();
            if(null != data){
                console.log(data);
//              checkEnterprise = data.party_B;
                loadEnterpriseNameList();
                
            	fileNamesOld = data.electronic_copy;
                //向页面绑定合同信息数据
                
                $("#resourceEditData").render(data,deValue);
                $(".selectpicker").selectpicker('refresh');
//              $("#conFirm a").click(function(){
////                    loadEnterpriseNameList();
//					 	console.log('123456')	
//					  	$('#party_B').val($(this).t())	
//              });
				
                //用于区分修改和增加
                $("#conUpdateFlag").val("conUpdateFlag");
            }
        },
        error:function(XMLHttpRequest){
			error_500(XMLHttpRequest.responseText);
		}
    });
}

/**
 * 合同信息修改后表单提交
 * */
function contractUpdateSubmit(){
    var options = {
        url:contractUpdateInfoUrl,
        success:contractFormSubmitYseFile, //提交后处理
        dataType:"json"
    };
    $("#contractForm").ajaxSubmit(options);
}
/*--------------------合同编辑操作---------------------*/
/*------------------------结束------------------------*/

/**
 * 创建服务商合同加载该服务商的SLA信息
 * */
function loadSLAInfoOfServiceFirm(){

    var slaP = $("div.test");
//  var serviceId=$('#sla_id').val();
    $.ajax({
        url:loadServiceSLAInfoUrl,
        data:'',
        type:"get",
        dataType:"json",
        success:function(result){
			
            //登录信息失效，ajax请求静态页面拦截
            onServiceComplete(result);
            console.log(result);
            if(result.data.length != 0){
//              var diData = {
//                  sla_id:{
//                      value:function(){
//                          return this.sla_id;
//                      }
//                  }
//              };
				var diData = {
								sla_info:{
									addressVal:{
										text:function(){
											return this.address;
										},
										value:function(){
											if(83==this.service_time){
												return "工作时间";
											}else{
												return "日历时间";
											}

											timeTips(this.service_time);
										}
									},
									responseVal:{
										text:function(){
											return this.address;
										},
										value:function(){
											if(83==this.service_time){
												return "工作时间";
											}else{
												return "日历时间";
											}

										}
									}

								},
//								sla_id:{
//									value:function(){
//										return this.sla_id;
//									}
//								},
								sla_logo:{
				                    class: function () {
				                        if(this.LOGO == 1){
				                            return "serviceLevel jin";
				                        }else if(this.LOGO == 2){
				                            return "serviceLevel yin";
				                        }else if(this.LOGO == 3){
				                            return "serviceLevel tong";
				                        }else if(this.LOGO == 4){
				                            return "serviceLevel one";
				                        }else if(this.LOGO == 5){
				                            return "serviceLevel two";
				                        }else if(this.LOGO == 6){
				                            return "serviceLevel three";
				                        }else if(this.LOGO == 7){
				                            return "serviceLevel high";
				                        }else if(this.LOGO == 8){
				                            return "serviceLevel middle";
				                        }else if(this.LOGO == 9){
				                            return "serviceLevel low";
				                        }
				                    }
				                },
				                checkBoxActive:{
				                	class:function(){
				                		var activeSla = $("[name='sla_id']").val();
				                		if("" == activeSla){
				                			return "checkBox";
				                		}else if(this.sla_id == activeSla){
				                			return "checkBox active";
				                		}
				                	}
				                }

							};
                slaP.render(result.data,diData);
            }else{
                //如果该服务商未有SLA协议，显示创建SLA创建按钮，跳转到创建SLA页面
                $("#slaInfo").remove();
                $("#createSLAButton").show();
            }
        },
        error:function(XMLHttpRequest){
			error_500(XMLHttpRequest.responseText);
		}
    });
}
/**
 * 点击选中某一个sla
 * wanglei
 */
function choseSLA(){
	$("i.checkBox").removeClass("active");
	var idSubmit = $("[name='sla_id']");
	idSubmit.val("");
	$(this).addClass("active");
	var slaId = $(this).next().val();
	idSubmit.val(slaId);
}
function titleChoseSLA(){
	$("i.checkBox").removeClass("active");
	$('slaTableInfo.ative').removeClass('active');
	var idSubmit = $("[name='sla_id']");
	idSubmit.val("");
	$(this).find('.checkBox').addClass("active");
	$(this).parent().addClass('active').siblings().removeClass("active");
	var slaId = $(this).find('#sla_id').val();
	idSubmit.val(slaId);
}
/**slaTips信息**/
function timeTips(){

	$("body").on("mouseover mouseout mousemove", '.timeTips', function(e) {
		var _text=e.target.value;
		//console.log(_text);
		if(e.type == "mousemove") {
			$("#timeTipdiv").css({
				"top": (e.pageY-15) + "px",
				"left": (e.pageX+15) + "px"
			}).show();
		} else if(e.type == "mouseout") {
			$("#timeTipdiv").hide();
		} else if(e.type == "mouseover") {

			if($("#timeTipdiv") != undefined) {

				_tooltip = "<div id='timeTipdiv' style='font-size:14px'></div>";
				$("body").append(_tooltip);
			}

			$("#timeTipdiv").html("<i></i>"+_text);
			$("#timeTipdiv").show();

		}
	});

}
/**
 * jQuery函数
 * */
$(function () {

    //加载乙方（所有企业）并绑定页面
    loadEnterpriseNameList();

    //合同起始时间（默认当前日期）和有效时间（默认起始日期后一年）绑定
    var myDate = new Date();
    var default_start_time = myDate.getFullYear()+"-"+((myDate.getMonth()+1)<10?"0":"")+(myDate.getMonth()+1)+"-"+(myDate.getDate()<10?"0":"")+(myDate.getDate());
    var default_end_time = (myDate.getFullYear()+1)+"-"+((myDate.getMonth()+1)<10?"0":"")+(myDate.getMonth()+1)+"-"+(myDate.getDate()<10?"0":"")+(myDate.getDate());
    //console.log(default_start_time);
    $("#start_time").val(default_start_time);
    $("#end_time").val(default_end_time);

    //保存新建合同信息
    $("#serSaveConInfo").click(serSaveConInfo);

    //合同信息编辑页面跳转
    //获取合同ID
    var contractId = getUrlParam("contractId");
    //console.log(contractId);
    if(null != contractId){
        contractInfoEdit(contractId);
    }

    //创建服务商合同加载该服务商的SLA信息
    setTimeout(function(){
    	loadSLAInfoOfServiceFirm();
    },100)
    
     //点击方框，选择某一个sla服务
    $("div.slaDiv").on("click","i.checkBox",choseSLA);
    $("div.slaDiv").on("click",".slaTableTitle",titleChoseSLA);
    
	 //鼠标移入出现工作时间或日历时间
   	 timeTips();
   	 
    $("#createSLA").click(function () {
        window.location.href = "slaBuilt.html";
    });

})


//获取url中的参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}