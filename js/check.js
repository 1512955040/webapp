//正则表达式
var telephone = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\\d{8}$/;
var fixedTel = /0\d{2,3}-\d{5,9}|0\d{2,3}-\d{5,9}/;
var email = /^[a-z\d]+(\.[a-z\d]+)*@([\da-z](-[\da-z])?)+(\.{1,2}[a-z]+)+$/;
var password = /^[a-z0-9_-]{6,18}$/;


//校验手机号
function checkTel(value){
	if(telephone.test(value)){
		return true;
	}else{
		return false;
	}
}

//校验固定电话
function checkTel(value){
	if(fixedTel.test(value)){
		return true;
	}else{
		return false;
	}
}

//校验电子邮箱
function checkTel(value){
	if(email.test(value)){
		return true;
	}else{
		return false;
	}
}


//校验密码
function checkTel(value){
	if(password.test(value)){
		return true;
	}else{
		return false;
	}
}


