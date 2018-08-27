
//正则表达式
var telephone = /^1(3|4|5|7|8)\d{9}$/;
var email = /^[a-z\d]+(\.[a-z\d]+)*@([\da-z](-[\da-z])?)+(\.{1,2}[a-z]+)+$/;
var password = /^[a-z0-9_-]{6,18}$/;
var username = /^[a-z\d_\u4e00-\u9fa5]{3,15}/;

//校验登录名
function checkUser(value){
	console.log(value);
	if(username.test(value)){
		console.log(true);
		return true;
	}else{
		console.log(false);
		return false;
	}
}

//校验手机号
function checkTel(value){
	console.log(value);
	if(telephone.test(value)){
		console.log(true);
		return true;
	}else{
		return false;
		console.log(false);
	}
}


//校验电子邮箱
function checkEmail(value){
	console.log(value);
	if(email.test(value)){
		console.log(true);
		return true;
	}else{
		console.log(false);
		return false;
	}
}

//校验密码
function checkPass(value){
	console.log(value);
	if(password.test(value)){
		console.log(true);
		return true;
	}else{
		console.log(false);
		return false;
	}
}

function checkRegister(value,checkType){
	var flag = '';
	switch(checkType)
	{
		case 1:
		  	flag = checkTel(value);
		  	break;
		case 2:
		  	flag = checkEmail(value)
		  	break;
		case 3:
		  	flag = checkPass(value);
		  	break;
		case 4:
		  	flag = checkUser(value);
		  	break;
		default:
		 	break;
	}
	return flag;
}



//是否可点击
var canClick = false;

function allNeedCheck(){
	canClick = false;
	var flag = $("[name='user_name']").val();
	var needCheckedNum = 0;
	var allInput = $('#userForm .now');
	if((null == flag && allInput.length == 5) || (null != flag && allInput.length == 6)){
		canClick = true;
		$('#nextPage').addClass('active');
	}else{
		console.log(allInput.length);
	}
}

//第二页是否可点击
function nextChecked(){
	var nextCanCheck = $('#enterpriseForm .rightImg').hasClass('now');
	var whetherCheck = $("input[type='checkbox']").is(':checked');   //服务信息选择
	var hasActive = $('#submitForm').hasClass('active');
	if(nextCanCheck&&whetherCheck){
		$('#submitForm').addClass('active');
	}else{
		if(hasActive){
			$('#submitForm').removeClass('active');
		}
	}
}


$("#checkboxYesId").change(function(){
  	nextChecked();
});

//校验其他
$('.info-body-item .hasTip').blur(function(){ 
	var _this= $(this);
	var tipTxt = _this.val();
	var checkType = 0;
	if(tipTxt){
		if(_this.hasClass('name')){
			_this.parent().next().find('.rightImg').addClass('now').show();
			_this.parent().next().find('.errorImg').removeClass('now').hide();
			nextChecked();
		}else{
			var flag = '';
			if(_this.hasClass('telephone')){
				checkType = 1;
			}else if(_this.hasClass('email')){
				checkType = 2;
			}
			flag = checkRegister(tipTxt,checkType);
			if(_this.hasClass('rePass')){
				var password = $('.password').val();
				var rePassWord = $('.rePass').val();
				if(password == rePassWord){
					flag = true;
				}else{
					flag = false;
				}
			}
			if(!flag){
				_this.parent().find('.errorTip').show();
				_this.parent().next().find('.errorImg').show();
			}else{
				_this.addClass('true');
				_this.parent().next().find('.rightImg').addClass('now').show();
				allNeedCheck();
			}
		}
		
	}else{
		_this.parent().find('.errorTipNull').show();
		_this.parent().next().find('.errorImg').show();
		if(_this.hasClass('name')){
			_this.parent().next().find('.errorImg').addClass('now').show();
			_this.parent().next().find('.rightImg').removeClass('now').hide();
			nextChecked();
		}
	}
}).focus(function(){
	var _this= $(this);
	_this.parent().find('.errorTipNull,.errorTip').removeClass('now').hide();
	_this.parent().next().find('img').hide();
});



//校验登录名和密码
$(".info-body-item .hasCheck").blur(function(){
	var _this= $(this);
	var tipTxt = _this.val();
	var checkType = 0;
	if(tipTxt){
		if(_this.hasClass('password')){
			checkType = 3;
		}else if(_this.hasClass('username')){
			checkType = 4;
		}
		var flag = checkRegister(tipTxt,checkType);
		
		console.log(flag);
		
		if(!flag){
			_this.next().addClass('error');
			_this.parent().next().find('.errorImg').show();
		}else{
			_this.parent().next().find('.rightImg').addClass('now').show();
			allNeedCheck();
		}
	}else{
		_this.next().addClass('error');
		_this.parent().next().find('.errorImg').show();
	}
}).focus(function(){
	var _this= $(this);
	_this.next().removeClass('error');
	_this.parent().next().find('img').removeClass('now').hide();
});
