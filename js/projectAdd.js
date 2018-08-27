var successReturn = 1;//操作成功
var errorReturn = 2;
var formError = -1;
var projectDetailHtml = "projectDetail.html";
var flag = "project_file";
var fileInput = "file-1";//文件框id
var fileNamesOld;//旧的文件名称
/**
 * 当有文件需要上传时，把该函数的参数设置成true
 */

/**
 * 提交表单(增加)
 */
function projectFormSubmit(flag){
	var options;
	if(flag){
		options = {
				url:projectAddUrl,
				success:projectFormSubmitAddFile, //提交后处理
				error:function(XMLHttpRequest){
	            	error_500(XMLHttpRequest.responseText);
	    		},
				dataType:"json"
		};
	}else if(!flag){
		options = {
				url:projectAddUrl,
				success:projectFormSubmitNoFile, //提交后处理
				error:function(XMLHttpRequest){
	            	error_500(XMLHttpRequest.responseText);
	    		},
				dataType:"json"
		};
	}
	$("#projectForm").ajaxSubmit(options);
}
/**
 * ajax回调转换，只是为了设置一个参数true
 */
function setFlag(){
	projectFormSubmit(true);
};
/**
 * 不含文件的增加成功之后的操作
 * @param responseText
 * @param statusText
 */
function projectFormSubmitNoFile(responseText,statusText){

    //登录信息失效，ajax请求静态页面拦截
    onComplete(responseText);

	if(responseText.status  == formError){
		//显示所有的错误信息
		$("span.budgetStrE").html(responseText.data.proBudget);
		$("span.winAmountE").html(responseText.data.proAmount);
		$("span.project_nameE").html(responseText.data.proName);
		$("span.project_codeE").html(responseText.data.proCode);
	}else if(responseText.status == successReturn){
		var projectId = responseText.data;
		window.location.href = projectDetailHtml+'?projectId='+projectId;
	}else{
		outBoxCloseProject("增加项目失败");
	}
}
/**
 * 含有文件表单提交后处理
 * @param responseText
 * @param statusText
 */
function projectFormSubmitAddFile(responseText,statusText){

    //登录信息失效，ajax请求静态页面拦截
    onComplete(responseText);

	if(responseText.status  == formError){
		//显示所有的错误信息
		$("span.budgetStrE").html(responseText.data.proBudget);
		$("span.winAmountE").html(responseText.data.proAmount);
		$("span.project_nameE").html(responseText.data.proName);
		$("span.project_codeE").html(responseText.data.proCode);
	}else{
    	var projectId = responseText.data;
    	var filesCount = $('#'+fileInput).fileinput('getFilesCount');
        if(responseText.status == successReturn){
        	$("#file_help_id").val(projectId);
			$("#file_help_flag").val(flag);
            if(filesCount - 0 != 0){
				uploadFile(fileInput,projectId,updateprojectFileUrl);
			}else{
				toProjectDetail(projectId);
			}
        }else{
        	outBoxCloseProject("操作失败");
        }
	}
}
/**
 * 弹框的关闭
 * @param msg 弹框关闭后的提示信息
 */
function outBoxCloseProject(msg){
	$("#tipMsg").addClass("active").html(msg).show();
	function tipHide(){
		$("#tipMsg").hide();
	}
    setTimeout(tipHide,2000);
}
function toProjectDetail(projectId){
	window.location.href = projectDetailHtml+'?projectId='+projectId;
}
/**
 * 修改项目的文件路径
 */
function updateprojectFileUrl(projectId,flag){
	
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
				url:updateProjectFileUrl,
				type:"post",
				data:{id:projectId,fileUrl:fileReal},
				dataType:"json",
				success:function(result){
					//登录信息失效，ajax请求静态页面拦截
		            onComplete(result);
		            
		            if(fileFail.length>0){
		            	//提示用户没有上传成功的文件名称
		            	outBoxCloseEvent(fileFail.toString()+"，未上传成功，请重试！");
		            	//再次点击保存时，进行修改。
		            	$("#updatePrivate").val("updatePrivate");
		            	$("#projectIdEdit").val(projectId);
		            	fileNamesOld = fileReal;
		            	$('#'+fileInput).fileinput('clear');
		            }else{
		            	toProjectDetail(projectId);//修改完数据库中的文件字段后，跳转页面
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
    	$("#updatePrivate").val("updatePrivate");
    	$("#projectIdEdit").val(projectId);
    	fileNamesOld = fileReal;
    	$('#'+fileInput).fileinput('clear');
	}

}
/**
 * 修改项目信息
 */
function projectUpdateSubmit(){
	var options = {
			url:projectUpdateUrl,
			success:projectFormSubmitAddFile, //提交后处理
			error:function(XMLHttpRequest){
            	error_500(XMLHttpRequest.responseText);
    		},
			dataType:"json"
	};
	$("#projectForm").ajaxSubmit(options);
}

/**
 * 点击保存按钮
 */
function saveClick(){
	$("#fileHelpId").val("");
	//先把提示的错误信息清除掉
	$(".errorB").html("");
	//获取区分增加和修改时的标志
	var updatePrivate = $("#updatePrivate").val();
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
			checkFileNames(fileNames,projectUpdateSubmit);
		}else{
			//点击保存，进行“增加”
			//上传文件
			checkFileNames(fileNames,setFlag);
		}
    }else{
    	if("" != updatePrivate){
    		//点击保存，进行“修改”
    		projectUpdateSubmit();
    	}else{
    		projectFormSubmit(false);
    	}
    }
}


/**
 * 编辑项目信息来进行修改
 * @param projectId
 */
function projectEdit(projectId,projectEditData){

	$.ajax({
		url:projectDetailUrl,
		data:{"projectId":projectId},
		type:"get",
		dataType:"json",
//		complete: onComplete,
		success:function(result){
			console.log(result);
            //登录信息失效，ajax请求静态页面拦截
            onComplete(result);

			if(result.status == successReturn){

				var projectVal = {
						project_status_name:{
							value:function(){
								if(null == this.project_status){
									return "";
								}else{
									return this.project_status;
								}
							},
							text:function(){
								if(null == this.project_status){
									return "--请选择--";
							    }
							}
						},
						win_unit_name:{
							value:function(){
								return this.win_unit;
							}
						}
				};
				//显示项目信息，来进行编辑
				var project = result.data.project;
				fileNamesOld = project.file_url;
				$("#"+projectEditData).render(project,projectVal);
				$(".selectpicker").selectpicker('refresh');
				//用于区分修改和增加
				$("#updatePrivate").val("updatePrivate");
			}
		},
		error:function(XMLHttpRequest){
			error_500(XMLHttpRequest.responseText);
		}
	});
}

//加载项目状态的数据
function loadProStatus(){

	//获取当前选中的val
	var selectH = "[name='project_status']";
	var currentVal = $(selectH+" option:selected").val();
	var proStatus = [
                     {val:0,project_status_name:"--请选择--"},
	                 {val:42,project_status_name:"计划中"},
	                 {val:43,project_status_name:"执行中"},
	                 {val:44,project_status_name:"已完工"},
	                 ];
	var proStatusVal = {
			project_status_name:{
				value:function(){
					return this.val;
				}
			}
	};
	$(selectH).render(proStatus,proStatusVal);
	if("" == currentVal || 0 == currentVal){
		$(selectH).selectpicker('val',0);
	}else{
		$(selectH).selectpicker('val',currentVal);
	}
	$(selectH).selectpicker('refresh');
}

/**
 * 加载该企业的所有供应商
 */
function loadProSuppliers(){
	
	$.ajax({
		url:loadSuppliersAllUrl,
		type:"get",
		dataType:"json",
//		complete: onComplete,
		success:function(result){

            //登录信息失效，ajax请求静态页面拦截
            onComplete(result);

			if(1 == result.status){
				//获取当前选中的val
				var selectH = "[name='win_unit']";
				var currentVal = $(selectH+" option:selected").val();
				var supplierVal = {
						win_unit_name:{
							value:function(){
								return this.win_unit;
							}
						}
				};
				var suppliers = result.data;
				$(selectH).render(suppliers,supplierVal);
				//默认值的绑定
				if("" == currentVal || 0 == currentVal){
					$(selectH).selectpicker('val',0);
				}else{
					$(selectH).selectpicker('val',currentVal);
				}
				$(selectH).selectpicker('refresh');
			}
		},
		error:function(XMLHttpRequest){
			error_500(XMLHttpRequest.responseText);
		}
	});
}

/**
  *jquery
 */
$(function(){
	getHistory();
	$("span.navlist-img5").addClass("active");
	//点击返回按钮，退回上一页
	$("span.addTitle-back,button.addTitle-delete").click(function(){
		window.history.back();
	});
	//点击保存按钮。增加项目
	$("#saveProjectId").click(saveClick);
	//获取项目id
	var projectId = getUrlParam("projectId");
	//编辑项目以修改
	if(null != projectId){
		var projectEditData = "projectEditData";
		projectEdit(projectId,projectEditData);
	}
	//点击“中标商”、“项目状态”，加载相应的数据
	$("p.centerCon1-p3 button").click(loadProStatus);
	$("p.centerCon4-p3 button").click(loadProSuppliers);

	  //设置项目预算输入限制
    $('#budgetStr').blur(function(){
    	var thes=$(this);
    	var budgetVal=$(this).val();
    	isInteger(budgetVal,thes);
    });

      //设置中标金额输入限制
    $('#winAmount').blur(function(){
    	var thes=$(this);
    	var winAmountVal=$(this).val();
    	isInteger(winAmountVal,thes);
    });

});
 //输入限制
 function isInteger(obj,thes) {
    reg = /^[-+]?\d+$/;
    if (!reg.test(obj) || obj < 0) {
    	thes.val('');
        return false;
    } else {
        return true;
    }
}


//获取url中的参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}
$(".selectpicker").selectpicker({noneSelectedText:'--请选择--'});
