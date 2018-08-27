var onComplete = function(data){
	//var errors = data.errors;
    if(undefined != data.errors){
        var unLoginHtml = data.msg;
        if(undefined != unLoginHtml){
            if (data.errors.code == 302) {
                window.location.href = unLoginHtml;
            }
        }
    }
}

var onServiceComplete = function(data){
    //var errors = data.errors;
    if(undefined != data.errors){
        var unLoginHtml = data.msg;
        if(undefined != unLoginHtml){
            if (data.errors.code == 302) {
                window.location.href = "loginSer.html";
            }
        }
    }
}
/**
 * 500错误信息弹框
 * @param errorInfo  返回的错误信息
 * @param alertId    弹框的id
 * @param alertDiv   需要写的错误信息的div id
 */
var error_500 =function(errorInfo,alertId,alertDiv){
	var divText = "";
	if(null ==  errorInfo || "" == errorInfo){
		//divText  = "未知错误";
	}else{
		errorInfo = $.trim(errorInfo);
		if(isJSON(errorInfo)){
			var result = JSON.parse(errorInfo); 
			if(null == result){
				//divText  = "未知错误";
			}else{
				divText = result.errors.title;
			}
		}	
	}
	if("" == divText || null == divText){
		divText = "未知错误";
	}
	$("#errorInfo").html("错误信息："+divText);
//	alert(errorInfo);
	$("#errorBtn").modal("show");
}
/**
 * 判断是否可以解析
 * @param str
 * @returns {Boolean}
 */
var isJSON = function(str) {
    if (typeof str == 'string') {
        try {
            JSON.parse(str);
            return true;
        } catch(e) {
            return false;
        }
    }   
}

