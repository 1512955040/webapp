
var patternMac = /^([0-9a-fA-F]{2})(([/\s:-][0-9a-fA-F]{2}){5})$ /;
var patternIP = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
var notExceed100 = /^\S{1,100}$/;
var notExceed50 = /^\S{1,50}$/;
var hasaddIphone=/^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$|^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$|^0\d{2,3}-?\d{7,8}$/;
var hasaddamount=/^[0-9]*$/;
var hasaddmobilephone=/^1[34578]\d{9}$/;//只判断手机号
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

//判断是否为纯数字
function Checkaddamount(value){  
   if(hasaddamount.test(value)){
   		return true
   }else{
   		return false
   }           
}  
// 资产添加页面的错误提示
function checkAddwrongAsset(){
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
	//			console.log(flag);
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
	}
	checkAddwrongAsset();
//判断电话号为固定电话和手机号
function CheckIphones(){
	function CheckPhone(value){  
	   if(hasaddIphone.test(value)){
	   		return true
	   }else{
	   		return false
	   }           
	}  
	//判断电话号和固定电话
	$('.centerCon .hasaddIphone').blur(function(){
		var _this= $(this);
		var monitorLat = _this.val();
		if(monitorLat){
			var flag = CheckPhone(monitorLat);
			if(!flag){
				_this.prev().find('.conterCon-Iphone').show();
			}
		}
	}).focus(function(){
	  	var _this= $(this);
		_this.prev().find('.conterCon-Iphone').hide();
	});
}
	CheckIphones();
//只判断手机号 
function CheckMobilePhone(){	
	function CheckMobile(value){  
	   if(hasaddmobilephone.test(value)){
	   		return true
	   }else{
	   		return false
	   }           
	}  
	//判断电话号和固定电话
	$('.centerCon .hasaddmobilephone').blur(function(){
		var _this= $(this);
		var monitorLat = _this.val();
		if(monitorLat){
			var flag = CheckMobile(monitorLat);
			if(!flag){
				_this.prev().find('.conterCon-Iphonemobile').show();
			}
		}
	}).focus(function(){
	  	var _this= $(this);
		_this.prev().find('.conterCon-Iphonemobile').hide();
	});
}	
	CheckMobilePhone();

//判断纯数字
$('.centerCon .hasaddamount').blur(function(){
	var _this= $(this);
	var monitorLat = _this.val();
	if(monitorLat){
		var flag = Checkaddamount(monitorLat);
		if(!flag){
			_this.prev().find('.conterCon-elevation').show();
		}
	}
}).focus(function(){
  	var _this= $(this);
	_this.prev().find('.conterCon-elevation').hide();
});
