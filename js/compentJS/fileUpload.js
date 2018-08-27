var successReturn = 1;
/**
 * 检验文件名称是否重复
 * @param fileNames
 * @param successFun ajax请求结束后执行的函数
 * 返回值  true：文件名称不重复，可以继续下一步
 *       false：文件名称重复，弹出一个提示信息即可 
 */
var checkFileNames = function chenkFileName(fileNames,successFun){
	
	//发送ajax请求，查看文件名称是否重复,如果文件名称没有重复，开始上传文件
	var file = JSON.stringify(fileNames);
	$.ajax({
		url:checkFileNameUrl,
		type:"post",
		data:{"fileNames":file},
		dataType:"json",
//		complete: onComplete,
		success:function(result){
			if(successReturn == result.status){
				successFun();
			}else{
				outBoxCloseEvent("文件名称重复");
			}
		},
		error:function(XMLHttpRequest){
			error_500(XMLHttpRequest.responseText);
		}
	});
}

/**
 * 文件上传
 * @param fileInputName 需要上传的文件的文件框的id
 * @param detailId 上传文件之后执行的函数所需的参数
 * @param updateFileUrl 上传成功后需要更新数据库中的文件字段（更新数据）
 */
var uploadFile = function uploadFile(fileInputName,detailId,updateFileUrl){
	//上传文件
	$("#"+fileInputName).fileinput("upload");
	$("#"+fileInputName).on("filebatchuploadsuccess",function(event,result){
		updateFileUrl(detailId,result.response);
	});
	$("#"+fileInputName).on("filebatchuploaderror",function(event,result){
		outBoxCloseEvent("文件上传失败");
	});
}
/**
 * 编辑信息，如果需要添加文件信息，则需要生成一个新的文件名称。（检查文件名称是否重复）
 * @param files，需要添加的文件信息
 * @param fileNamesOld，之前的文件名称
 */
var newfileNames = function newfileNames(fileInput,fileNamesOld){
	var fileNames = [];
	if(null == fileInput){
		return;
	}
	if(null != fileNamesOld && ""!=fileNamesOld){
		var strs = fileNamesOld.split(",");
		for(var i=0;i<strs.length;i++){
			fileNames.push(strs[i]);
		}
	}
	var files = $('#'+fileInput).fileinput('getFileStack');
	for(var i=0;i<files.length;i++){
		fileNames.push(files[i].name);
    }
	return fileNames;
}
///**
// * 上传失败的文件名称
// */
//var showFileName = function showFileName(namesAll,successName){
//	if(null == namesAll || null == successName){
//		return;
//	}
//	var newName = "";
//	var index = namesAll.indexOf(successName);
//	if(-1 != index){
//		newName += namesAll.substring(0,index);
//		newName += namesAll.substring(successName.length+1);
//	}
//	return newName;
//}
/**
 * 弹框的关闭
 * @param msg 弹框关闭后的提示信息
 */
function outBoxCloseEvent(msg){
	$("#tipMsg").addClass("active").html(msg).show();
	function tipHide(){
		$("#tipMsg").hide();
	}
    setTimeout(tipHide,5000);
}