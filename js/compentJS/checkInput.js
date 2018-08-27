var patternMac = /^([0-9a-fA-F]{2})(([/\s:-][0-9a-fA-F]{2}){5})$ /;
var patternIP = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
var notExceed100 = /^\S{1,100}$/;
var notExceed50 = /^\S{1,50}$/;
//校验任意字符  不超过100
function check100(value){
	if(notExceed100.test(value)){
		return true;
	}else{
		return false;
	}
}
//校验任意字符  不超过50
function check50(value){
	if(notExceed50.test(value)){
		return true;
	}else{
		return false;
	}
}
//MAC地址规则校验
function checkMAC(value){
	if(patternMac.test(value)){
		return true;
	}else{
		return false;
	}
}
//IP地址规则校验
function checkIP(value){
	if(patternIP.test(value)){
		return true;
	}else{
		return false;
	}
}
// 资产添加页面的错误提示
function checkAddAsset(value,checkType){
	var flag = '';
	switch(checkType)
	{
		case 1:
		  	flag = check100(value);
		  	break;
		case 2:
		  	flag = check50(value)
		  	break;
		case 3:
		  	flag = checkMAC(value);
		  	break;
		case 4:
		  	flag = checkIP(value);
		  	break;
		default:
		 	break;
	}
	return flag;
}
$('.centerCon .hasTip').blur(function(){
	var _this= $(this);
	var tipTxt = _this.val();
	var checkType = 0;
	if(tipTxt){
		if(_this.hasClass('notExceed100')){
			checkType = 1;
		}else if(_this.hasClass('notExceed50')){
			checkType = 2;
		}else if(_this.hasClass('patternMac')){
			checkType = 3;
		}else if(_this.hasClass('patternIP')){
			checkType = 4;
		}
		var flag = checkAddAsset(tipTxt,checkType);
		if(!flag){
			_this.parent().find('.errorTip').show();
		}
	}else{
		_this.parent().find('.errorTipNull').show();
	}
}).focus(function(){
  	var _this= $(this);
	_this.parent().find('.errorTip,.errorTipNull').hide();

});


