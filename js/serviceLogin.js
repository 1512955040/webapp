/**
 * 服务商登录serviceLogin.js Created by EKuter-si.yu on 2017/1/14.
 */

function serLoginForm(){
	$("#enterprise_msg").html("");
    $.ajax({
        url:submitServiceLoginFormUrl,
        dataType:"json",
        type:'POST',
        async:true,
        data:$("#formId").serialize(),
        contentType:'application/x-www-form-urlencoded; charset=UTF-8',//防止乱码

        success:function(data){
            //console.log(data);
            if("index" == data.code){
                window.location="index";
            }else if(6 == data.code || 7 == data.code || 4 == data.code){
            	 //弹框提示
            	$("#enterprise_msg").html(data.msg);
            	$("#pupDelete").modal("show");
            	$("#captcha").val("");
            	serCheckCode();
            }else{
            	$("#captcha").val("");
            	serCheckCode();
            	$(".userError").html(data.msg);
            }
        }
    });
}


/**
 * 检测是否处于登录状态
 * */
function checkStatusOfLogin(){

    $.ajax({
        url:checkSignInStatusUrl,
        dataType:"json",
        type:'get',
        async:true,
        data:'',
        contentType:'application/x-www-form-urlencoded; charset=UTF-8',//防止乱码
        success:function(data){
            if(data.status == 0){
                window.location = "index";
            }
        }
    });
}
$(function () {
    checkStatusOfLogin();
})

$("#serLoginId").click(serLoginForm);
function keyDownLogin(e){
    var currKey = 0;e = e||event;
    currKey = e.keyCode||e.which||e.charCode;
    if (event.keyCode==13){//回车键的键值为13
        $("#serLoginId").click();
    }
}
/**
 * 点击更换验证码
 * */
function serCheckCode(){
    $('#captchaImage').hide().attr('src', 'serviceLoginController/serCaptcha?' + Math.floor(Math.random()*100) ).fadeIn();
    event.cancelBubble=true;
}

/**
 * 页面上注册点击函数
 */
$("p.login-p6-ser span").click(function(){
    window.location.href = "../serRegister.html";
});
