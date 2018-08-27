var eventDetailHtml = "eventDetail.html";
//下拉选的数据
var urgency_name,events_type_name,events_source_name,priority_name;
var diurgency_name,dieUrgent,dievents_type_name,dieSoure;
var flag = "events_file";//文件上传时，需要的一个标志
var fileNamesOld;//已经存在的文件
//事件优先级
priority_name = [
             {
            	value:0,
            	priority_name:"--请选择--"
             },
             {
             	value:6,
             	priority_name:"高"
             },
             {
              	value:5,
              	priority_name:"中"
             },
             {
               	value:4,
               	priority_name:"低"
             }
             ];
diePriority = {
		priority_name:{
			value:function(){
				return this.value;
			}
		}
}
//紧急程度
urgency_name = [
           {
        	   value:0,
        	   urgency_name:"--请选择--"
           },
           {
        	   value:6,
        	   urgency_name:"高"
           },
           {
        	   value:5,
        	   urgency_name:"中"
           },
           {
        	   value:4,
        	   urgency_name:"低"
           }
           ];
dieUrgent = {
		urgency_name:{
			value:function(){
				return this.value;
			}
		}
}
//事件类型
events_type_name = [
         {
        	 value:0,
        	 events_type_name:"--请选择--"
         },
         {
        	 value:49,
        	 events_type_name:"突发故障"
         },
         {
        	 value:50,
        	 events_type_name:"服务支持"
         },
         {
        	 value:51,
        	 events_type_name:"系统巡检"
         }
         ];
dieType = {
		events_type_name:{
			value:function(){
				return this.value;
			}
		}
}
//事件来源
events_source_name = [
          {
        	  value:0,
        	  events_source_name:"--请选择--"
          },
          {
        	  value:45,
        	  events_source_name:"电话"
          },
          {
        	  value:46,
        	  events_source_name:"邮件"
          },
          {
        	  value:47,
        	  events_source_name:"APP"
          },
          {
        	  value:48,
        	  events_source_name:"平台填报"
          }
          ];
dieSoure = {
		events_source_name:{
			value:function(){
				return this.value;
			}
		}
}
/**
 * 加载几个下拉选的内容
 */
function loadEventData(){
	$("select.ePriority").render(priority_name,diePriority);
	$("select.eUrgent").render(urgency_name,dieUrgent);
	$("select.eType").render(events_type_name,dieType);
	$("select.eSoure").render(events_source_name,dieSoure);
	$("select.ejs").selectpicker("val",0);
	$("select.ejs").selectpicker("refresh");
}
var fileInput = "file-1";
/**
 * 保存事件
 */
function savEvent(){

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
			checkFileNames(fileNames,eventUpdate);
		}else{
			//点击保存，进行“增加”
			//上传文件
			checkFileNames(fileNames,eventAdd);
		}
    }else{
    	if("" != updatePrivate){
    		//点击保存，进行“修改”
    		eventUpdate();
    	}else{
    		eventAdd();
    	}
    }


}
//----------------------------增加事件------------------------------------------
/**
 * 增加事件
 */
function eventAdd(){
	var options = {
			url:eventAddtUrl,
			//beforeSubmit:beforeSubmit(), //提交前处理
			success:afterAddSubmit, //提交后处理
			error:function(XMLHttpRequest){
            	error_500(XMLHttpRequest.responseText);
    		},
			dataType:"json"
	};
	$("#eventFormId").ajaxSubmit(options);
}
/**
 * 增加后执行的函数
 */
function afterAddSubmit(responseText,statusText){

    //登录信息失效，ajax请求静态页面拦截
    onComplete(responseText);

	if(responseText.status  == errorReturnCom){
		$("span.errorB").html("");
		$("#eAskError").html(responseText.data.eRequestPerson);
		$("#ePriorityError").html(responseText.data.ePriority);
		$("#eUrgentError").html(responseText.data.eUrgent);
		$("#eTypeError").html(responseText.data.eType);
		$("#eSourceError").html(responseText.data.eSource);
		$("#eManagerError").html(responseText.data.eManager);
		$("#eTitleError").html(responseText.data.eTitle);
		$("#eDescribeError").html(responseText.data.eDescribe);
	}else{
		var eventId = responseText.data;
		var filesCount = $('#'+fileInput).fileinput('getFilesCount');
		if(responseText.status == successReturnCom){
			$("#file_help_id").val(eventId);
			$("#file_help_flag").val(flag);
			if(filesCount - 0 != 0){
				uploadFile(fileInput,eventId,updateFileUrl);
			}else{
				window.location.href = eventDetailHtml+'?eventId='+eventId;
			}
		}else{
			outBoxCloseEvent("操作失败");
		}
	}
}
/**
 * 增加或者修改事件，有文件上成功后，需要修改数据库中的文件字段
 * @param eventId 事件id
 * @param flag 文件上传结果
 */
function updateFileUrl(eventId,flag){

	var fileAll = $("#fileHelpId").val();//所有的文件名称

	var fileFail = flag.dataSub;//本次上传失败的文件名称（list）
	var fileSuccess = flag.data;//本次上传成功的文件名称（list）
	var fileReal = "";//数据库中需要存的文件名称（之前的名称+本次上传的文件名称）
	var title = $("[name='title']").val();
	if(fileSuccess.length>0){
		//修改数据库中的文件字段
		if(null != fileNamesOld){
			fileReal += fileNamesOld+",";
		}
		fileReal += fileSuccess.toString();
		if(null != fileReal && "" != fileReal){
			$.ajax({
				url:eventUpdateFileUrl,
				type:"post",
				data:{id:eventId,attachment:fileReal},
				dataType:"json",
				success:function(result){
					//登录信息失效，ajax请求静态页面拦截
		            onComplete(result);

		            if(fileFail.length>0){
		            	//提示用户没有上传成功的文件名称
		            	outBoxCloseEvent(fileFail.toString()+"，未上传成功，请重试！");
		            	//再次点击保存时，进行修改。
		            	$("#updatePrivate").val("updatePrivate");
		            	$("#eventIdEdit").val(eventId);
		            	fileNamesOld = fileReal;
		            	$('#'+fileInput).fileinput('clear');
		            }else{
		            	toEventDetail(eventId);//修改完数据库中的文件字段后，跳转页面
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
    	$("#eventIdEdit").val(eventId);
    	fileNamesOld = fileReal;
    	$('#'+fileInput).fileinput('clear');
	}
}
/**
 * 上传文件成功后跳转
 * @param eventId
 */
function toEventDetail(eventId){
	window.location.href = eventDetailHtml+'?eventId='+eventId;
}
//---------------------------事件修改---------------------------------------------
/**
 * 事件详情
 */
function eventDetail(eventId){
	$("#eventIdEdit").val(eventId);
	reLikeClick();
	$.ajax({
		url:dblDetailUrl,
		type:"get",
		data:{"eventId":eventId},
		dataType:"json",
		success:function(result){

            //登录信息失效，ajax请求静态页面拦截
            onComplete(result);

			if(successReturnCom == result.status){
				var eventDetail = result.data;
				fileNamesOld = eventDetail.file_url;
				if(null != eventDetail){
					var diSel={
							priority_name:{
								value:function(){
									return this.priority_id;
								}
							},
							urgency_name:{
								value:function(){
									return this.urgency_id;
								}
							},
							events_type_name:{
								value:function(){
									return this.events_type;
								}
							},
							events_source_name:{
								value:function(){
									return this.events_source;
								}
							}
					}
					$("#updatePrivate").val("updatePrivate");
					$("#eventEditData").render(eventDetail,diSel);
					$("#department").attr("value",eventDetail.department_name);
					$("select.ejs").selectpicker("refresh");
				}
			}
		},
		error:function(XMLHttpRequest){
			error_500(XMLHttpRequest.responseText);
		}
	});
}
//事件已关联的资源绑定
function reLikeClick(){
	var eventId = getUrlParamH("eventId");
	//绑定资源的数据
	$.ajax({
		url:loadResourceUrl,
		type:"post",
		data:{"eventId":eventId},
		dataType:"json",
		success:function(result){

            //登录信息失效，ajax请求静态页面拦截
            onComplete(result);

			var data = result.data;
			var ids = [];
			var names = [];
			if(null != data){
				for(var i=0;i<data.length;i++){
					ids.push(data[i].id);
					names.push(data[i].resource_name);
				}
			}
			$("[name='events_code']").val(ids);
			$("[name='name_text']").val(names);
		},
		error:function(XMLHttpRequest){
			error_500(XMLHttpRequest.responseText);
		}
	});
}
/**
 * 更新事件
 */
function eventUpdate(){
	var options = {
			url:eventUpdatetUrl,
			//beforeSubmit:beforeSubmit(), //提交前处理
			success:afterAddSubmit, //提交后处理
			error:function(XMLHttpRequest){
            	error_500(XMLHttpRequest.responseText);
    		},
			dataType:"json"
	};
	$("#eventFormId").ajaxSubmit(options);
}
/**
 * 请求人搜索
 */
var hahaha;
function eAskLike(){
	//清空隐藏域中的值
	$("#eAskId").attr("value","");
	var name = $("#eAsk").val();
	if (hahaha === name)
		return;

	hahaha = name;

	var newSelect = new selectMenuH("eAsk-tree","eAsk-menu","eAsk","eAskId",
                                    loadAskerUrl);
	if(null != name && ""!=name){
        newSelect.nSelect('id','parent_id','name',false,name);
        newSelect.show();
	}else{
		newSelect.hide();
	}
}
/**
 * 管理人搜索
 */
var eMan;
function eManagerLike(){

	//清空隐藏域中的值
	$("#eManagerId").attr("value","");
	var name = $("#eManager").val();
	if (eMan === name)
		return;

	eMan = name;

	var newSelect = new selectMenuH("eManager-tree","eManager-menu","eManager",
                                    "eManagerId",loadManagerUrl);
	if(null == name || ""==name){
		newSelect.hide();
	}else{
		newSelect.nSelect('id','parent_id','name',true,name);
		newSelect.show();
	}
}
/**
 * 点击附加资产，弹框显示资产
 */
function resourceToEClick(){
	$("#selectAsset").modal("show");
	$("#likeId").val("");
	$("div.modal-body-bottom-rowWrap i").removeClass("active");
	bindResource();
}
/**
 * 绑定资源数据
 */
function bindResource(){
	var like = $("#likeId").val();
	var resList = $("div.modal-body-bottom-rowWrap");
	//绑定资源的数据
	$.ajax({
		url:loadResourceUrl,
		type:"post",
		data:{"like":like},
		dataType:"json",
		success:function(result){

            //登录信息失效，ajax请求静态页面拦截
            onComplete(result);

			var data = result.data;
      //判断:有附加资产数据时
      if (data.length>0) {
        var idsNow = [];
  			var idsInput = $("[name='events_code']").val();
  			if(null != idsInput && ""!= idsInput){
  				idsInput = idsInput.substring(0,idsInput.length);
  				idsNow = idsInput.split(",");
  			}
  			var dataHelp = [];
  			if(null != data && data.length>0 && idsNow.length>0){
  				for(var i=0;i<data.length;i++){
  					var b = true;

  					for(var j=0;j<idsNow.length;j++){
  						if(data[i].id == idsNow[j]){
  //							dataHelp.splice(i,1);
  							b = false;
  							break;
  						}
  					}

  					if (b== true){
  						dataHelp.push(data[i]);
  					}
  				}
  			}else{
  				dataHelp = data;
  			}
  			if(dataHelp.length>0){
  			//切换有和没有附加资产数据的显示效果
  		        $("#selectAsset .modal-has").addClass("modal-body").css("display","block");
  		        $("#modal-none").removeClass("modal-body").css("display","none");
  				resList.render(dataHelp);
  			}else{
  				$("#modal-none").addClass("modal-body").css("display","block");
  	        	$("#selectAsset .modal-has").removeClass("modal-body").css("display","none");
  			}
  			resList.render(dataHelp);
         }
		},
		error:function(XMLHttpRequest){
			error_500(XMLHttpRequest.responseText);
		}
	});
}
function xixi(data){
	return data;
}
/**
 * 点击资源弹框，前面的小框
 */
// function resListBoxClick(){
// 	if($(this).hasClass("active")){
// 		$(this).removeClass("active");
// 	}else{
// 		$(this).addClass("active");
// 	}
// }
//附加资产弹窗,点击一行,选中一行
function eAddClick(e){
  $(this).find("i").toggleClass("active");
}

/**
 * 附加资源到事件
 */
function resToEvent(){
	var ids = getCheckBox();
	var names = getCheckBoxName();
	if(ids.length>0){
		var idsInput = $("[name='events_code']");
		var nameInput = $("[name='name_text']");
//		idsInput.val("");
//		nameInput.val("");
		//获取现在已经有的值
		var idsH = idsInput.val();
		var nameH = nameInput.val();
		if(null != idsH && ""!= idsH){
			ids.push(idsH);
		}
		if(null != nameH && ""!= nameH){
			names.push(nameH);
		}
		//把资源的ids，写在下面的输入框中
		idsInput.val(ids);
		nameInput.val(names);
		$("#selectAsset").modal("hide");
	}
}
/**
 * 过滤资产
 * @param idsNow，现在输入框的资产ids
 * @param idsAll，所有的资产ids
 */
function filterRes(idsNow,idsAll){
	if(null == idsNow || null ==idsAll){
		return idsAll;
	}
	if(idsNow.length == 0){
		return idsAll;
	}
	for(var i=0;i<idsAll.length;i++){
		for(var j=0;j<idsNow.length;j++){
			if(idsAll[i] == idsNow[j]){
				idsAll.splice(i,1);
			}
		}
	}
	return idsAll;
}
/**
 * 获取当前选中的所有资产的id
 * @returns {Array}
 */
function getCheckBox(){
	var ids = [];
	var $checkPro = $("div.modal-body-bottom-rowWrap").find("i.active").next();
	$checkPro.each(function(){
		ids.push($(this).val());
	});
	return ids;
}
/**
 * 获得当前选中的所有资产的名字
 * @returns {Array}
 */
function getCheckBoxName(){
	var names = [];
	var $checkPro = $("div.modal-body-bottom-rowWrap").find("i.active").next().next();
	$checkPro.each(function(){
		names.push($(this).html());
	});
	return names;
}
/**
 * 返回
 */
function backClick(){
	window.history.back();
}
function priClick(){
	selClick("ePriority",priority_name,diePriority);
}
function urgClick(){
	selClick("eUrgent",urgency_name,dieUrgent);
}
function typeClick(){
	selClick("eType",events_type_name,dieType);
}
function surceClick(){
	selClick("eSoure",events_source_name,dieSoure);
}
function selClick(select,data,dataType){
	var sel = $("select."+select);
	sel.render(data,dataType);
	var v = $("select."+select+" option:selected").val();
	if("" == v){
		sel.selectpicker("val",0);
	}else{
		sel.selectpicker("val",v);
	}
	sel.selectpicker("refresh");
}

//页面加载完成后执行该函数
$(function(){
	getHistory();
	$("span.navlist-img2").addClass("active");
	//加载事件下拉选内容
	loadEventData();
	var eventId = getUrlParamH("eventId");
	if(null != eventId){
		eventDetail(eventId);
	}
	//部门内容
    creatTree("department-tree","department-menu","department","departmentCode",departmentDataUrl,true);
    //点击保存，增加事件
    $("button.addTitle-keep").click(savEvent);
    //点击取消
    $("button.addTitle-delete,span.addTitle-back").click(backClick);
    //请求人模糊搜索
//    $("#eAsk").on("input propertychange ",eAskLike);
    $("#eAsk").keyup(eAskLike);
    //管理人索搜
    $("#eManager").keyup(eManagerLike);
    //点击附加资产
    $("span.resourceToE").click(resourceToEClick);
    //弹框-点击每个资源前面的小框
    // $("div.modal-body-bottom-rowWrap").on("click","i",resListBoxClick);
    $("#selectAsset").on("click",".modal-body-bottom-row",eAddClick);
    //点击资源弹框中的模糊搜索
    $("i.findRes").click(bindResource);
    //点击资源弹框中的保存，或者添加到事件
    $("button.btn-keep-res,button.addEvent").click(resToEvent);
    //
    $("p.centerCon1-p1 button").click(priClick);
    $("p.centerCon1-p5 button").click(urgClick);
    $("div.centerCon1-p2 button").click(typeClick);
    $("div.centerCon1-p3 button").click(surceClick);
    //弹框-附加到事件
    // $(".modal-body-bottom-body").delegate('.modal-body-bottom-row','click',eAddClick);
    // $("#selectAsset").on("click",".modal-body-bottom-row",eAddClick);
});
