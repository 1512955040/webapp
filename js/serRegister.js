var formNull = -2;
var formError = -1;
var successReturn = 1;
var fail = 2;
var loginHtml = "loginSer.html";
var errorHtml = "400.html"
/**
 * 提交表单，校验注册的用户和注册人的信息
 */
function registerCheck(){

	var next = $("#nextPage").hasClass("active");
	if(next){
		//删除js的校验信息
		$("span.errorJS").html("");
		$.ajax({
			url:registerSerCheckUrl,
			type:"post",
			data:$('#userForm').serialize(),
			dataType:"json",
//			complete: onComplete,
			success:function(result){
				if(result.status == successReturn){
					$("div.cneter2").show();
					$("div.cneter1").hide();
				}else if(result.status == formError){
					//提示错误信息
					var data = result.data;
//					$("span.userNameB").html(data.userNameEx);
					$("span.passwordB").html(data.pwdEx);
					$("span.surePwdB").html(data.surePwd);
					$("span.personNameB").html(data.perNameEx);
					$("span.phoneB").html(data.telLenEx);
					$("span.phoneRepeat").html(data.tel);
					$("span.emailRepeat").html(data.email);
					$("span.emailB").html(data.emailEx);
				}else if(result.status == formNull){
					//跳转到错误页面
					window.location.href = errorHtml;
				}
			}
		});
	}
}

/**
 * 提交表单，校验企业信息，并存入数据库
 */
function registerAjax(){
	
	var next = $("#submitForm").hasClass("active");
	if($("#checkboxYesId").prop("checked") && next){
		$("span.errorJS").html("");
		var userForm = $("#userForm").serializeJson();//数据序列化
		var enterpriseForm = $("#enterpriseForm").serializeJson();//数据序列化
		var form = $.extend(userForm,enterpriseForm);
		$.ajax({
			url:registerSerUrl,
			type:"post",
			data:form,
			dataType:"json",
//			complete: onComplete,
			success:function(result){
				if(result.status == successReturn){
					alert("注册成功，信息正在审核中。。");
					window.location.href = loginHtml;
				}else if(result.status == fail){
					alert("注册失败，请重试。");
				}else if(result.status == formError){
					//提示错误信息
					var data = result.data;
					$("span.enterpriseNameB").html(data.eName);
				}else if(result.status == formNull){
					//跳转到错误页面
					window.location.href = errorHtml;
				}
			}
		});
	}
}

//序列化多个表单
(function($){  
        $.fn.serializeJson=function(){  
            var serializeObj={};  
            var array=this.serializeArray();  
            var str=this.serialize();  
            $(array).each(function(){  
                if(serializeObj[this.name]){  
                    if($.isArray(serializeObj[this.name])){  
                        serializeObj[this.name].push(this.value);  
                    }else{  
                        serializeObj[this.name]=[serializeObj[this.name],this.value];  
                    }  
                }else{  
                    serializeObj[this.name]=this.value;   
                }  
            });  
            return serializeObj;  
        };  
    })(jQuery);//序列化多个表单
/**
 * 页面上云服务协议的点击
 */
function loadAgreement(){
	$("#serviceModal").modal('show');
}
/**
 * jquery函数
 */
$(function(){
	
	$("div.cneter2").hide();
	$("div.cneter1").show();
	$("#nextPage").click(registerCheck);	
	$("#submitForm").click(registerAjax);
	$("i.loginTxt,a.loginTxt").click(function(){
		window.location.href = loginHtml;
	});
	$("a").click(loadAgreement);
});