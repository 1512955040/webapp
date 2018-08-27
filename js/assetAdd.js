var successReturn = 1; //操作成功
var failReturn = 2; //操作失败
var errorReturn = 3; //表单上有错误信息
var errorForm = -1; //表单上有错误信息,可能是另一个方法的
var nullForm = -2;
var failForm = -1;
var importanceData, importanceValue; //影响下拉选的数据
var suppliersData, suppliersValue; //供应商的类型数据
var assetDealHtml = "assetDetail.html";
var flag = "resource_file";
var COMPARE = "data_per.create_time"; 
var SORT = "DESC";
var resFileNameOld;//该资源已经存在的文件名称
var resourceId;
importanceData = [{
		value: "",
		resource_importance_name: "--请选择--"
	},
	{
		value: 6,
		resource_importance_name: "高"
	},
	{
		value: 5,
		resource_importance_name: "中"
	},
	{
		value: 4,
		resource_importance_name: "低"
	}
];
importanceValue = {
	resource_importance_name: {
		value: function() {
			return this.value;
		}
	}
};
suppliersData = [
	{
		value: "0",
		supplierType: "--请选择--"
	},
	{
		value: 13,
		supplierType: "生产厂商"
	},
	{
		value: 14,
		supplierType: "销售厂商"
	},
	{
		value: 15,
		supplierType: "系统集成厂商"
	},
	{
		value: 16,
		supplierType: "运维厂商"
	}
];
suppliersValue = {
	supplierType: {
		value: function() {
			return this.value;
		}
	}
}
/**
 * 加载分类模板
 * @param categoryBottomId
 */
function loadCategoryModel(categoryBottomId) {
	$.ajax({
		url: loadCategoryModelUrl,
		type: "get",
		data: {
			"categoryButtomId": categoryBottomId
		},
		dataType: "json",
		//complete: onComplete,
		success: function(result){
			console.log(result);
			//登录信息失效，ajax请求静态页面拦截
			onComplete(result);
			if(result.status == successReturn) {
				var data = result.data;
				//判断资源输入框中是否有值，没有就插入一个值
				var categoryCode = $("#categoryCode").val();
				if(null != data){
					//获取资产类型的id值
					if(result.data[1].level_1!==null && result.data[1].level_2==null && result.data[1].level_3==null && result.data[1].level_4==null){
						var modalcategoryId=$("input.modal-body-categoryId").val(result.data[1].level_1);
					}else if(result.data[1].level_1==null && result.data[1].level_2!==null && result.data[1].level_3==null && result.data[1].level_4==null){
						var modalcategoryId=$("input.modal-body-categoryId").val(result.data[1].level_2);
					}else if(result.data[1].level_1==null && result.data[1].level_2==null && result.data[1].level_3!==null && result.data[1].level_4==null){
						var modalcategoryId=$("input.modal-body-categoryId").val(result.data[1].level_3);
					}else if(result.data[1].level_1==null && result.data[1].level_2==null && result.data[1].level_3==null && result.data[1].level_4!==null){
						var modalcategoryId=$("input.modal-body-categoryId").val(result.data[1].level_4);
					}
					if("" == categoryCode) {
						if(data.length == 1) {
							$("#category").attr("value", data[0].name);
							$("#categoryCode").attr("value", categoryModel(data[0]));
						} else {
							$("#category").attr("value", data[1].name);
							$("#categoryCode").attr("value", categoryModel(data[1]));
						}
					}
					//引入模板前清除之前日期错误信息
					$(".centerCon3-p6 .centerCon-quarter .centerCon-txt").find('.errorB').remove();
					//如果data[0].html_name为null，则会不停的调用$.get
					if(data.length == 1 && null != data[0].html_name){
						$.get(data[0].html_name, function(getData){
							$('#centerCon2').empty();
							$('#centerCon3').empty();
							var cneter2 = "#centerCon2";
							$(cneter2).append(getData);
							$(cneter2 + "#detailFlag").remove();
							$(cneter2 + " .selectpicker").selectpicker({
								noneSelectedText: '--请选择--'
							});
							loadPart24(categoryBottomId);
							//console.log($("#centerCon2 input[type='date']"));
							$("#centerCon2 input[type='date']").attr("readonly", true);
							$("#centerCon2 input[type='date']").attr('type', 'text').addClass('timePicker');
							
							//设置购买日期，质保日期默认日期
							$("input[name='procure_time']").val(DateToday);
							$("input[name='warranty']").val(nextDateToday);

							//创建报废日期提示信息
							$(".centerCon3-p6 .centerCon-quarter .centerCon-txt").append("<span class='errorB'></span>");
						});
					}
					if(data.length == 2 && null != data[1].html_name && null != data[0].html_name) {
						$.get(data[0].html_name, function(getData) {
							$('#centerCon2').empty();
							var cneter2 = "#centerCon2";
							$(cneter2).append(getData);
							
							$(cneter2 + " #detailFlag").remove();
							$(cneter2 + " .selectpicker").selectpicker({
								noneSelectedText: '--请选择--'
							});
							loadPart24(categoryBottomId);
							//设置购买日期，质保日期默认日期
							$("input[name='procure_time']").val(DateToday);
							$("input[name='warranty']").val(nextDateToday);
							//创建报废日期提示信息
							$(".centerCon3-p6 .centerCon-quarter .centerCon-txt").append("<span class='errorB marLeft8'></span>");
							setDatePikcer();
							setTimeout(function(){
								$("select").selectpicker("refresh")
							},1)
						});
						$.get(data[1].html_name, function(getData) {
							$('#centerCon3').empty();
							var center3 = "#centerCon3";
							$(center3).append(getData);
							$(center3 + " #detailFlag").remove();
							$(center3 + ".selectpicker").selectpicker({
								noneSelectedText: '--请选择--'
							});
							// 资产添加页面的错误提示
							checkAddwrongAsset()
							//判断电话号码是否正确
							CheckIphones()
							//判断手机号是否正确
							CheckMobilePhone();
							
							loadPart3(categoryBottomId);
							//console.log($("#centerCon2 input[type='date']"));
//							$("#centerCon2 input[type='date']").attr("readonly", true);
//							$("#centerCon2 input[type='date']").attr('type', 'text').addClass('timePicker');
//							//设置购买日期，质保日期默认日期
//							$("input[name='procure_time']").val(DateToday);
//							$("input[name='warranty']").val(nextDateToday);
//							//创建报废日期提示信息
//							$(".centerCon3-p6 .centerCon-quarter .centerCon-txt").append("<span class='errorB'></span>");

						});
					}
				}
			}
		},
		error: function(XMLHttpRequest) {
			error_500(XMLHttpRequest.responseText);
		}
	});
}

	
function setDatePikcer(){
	$("#centerCon2 input[type='date']").attr("readonly", true);
	$("#centerCon2 input[type='date']").attr('type', 'text').addClass('timePicker');
	var now = new Date();
	//质保起始日期
	var warrantyStartDate=now.getFullYear()+"-"+((now.getMonth()+1)<10?"0":"")+(now.getMonth()+1)+"-"+(now.getDate()<10?"0":"")+now.getDate();
	//console.log(warrantyStartDate);
	//报废起始日期
	var discardeStartDate=now.getFullYear()+"-"+((now.getMonth()+1)<10?"0":"")+(now.getMonth()+1)+"-"+(now.getDate()<10?"0":"")+now.getDate();

	//购买日期
	$("#centerCon2 input[name='procure_time']").datepicker({
		language: 'zh-CN',
		todayHighlight:1,
		autoclose: 1,
		minView: 2,
		format: "yyyy-mm-dd",
		orientation:'bottom',
		clearBtn:true
    }).on("changeDate",function(){
        // 购买日期改变后, 重置质保日期的开始时间
        $("#centerCon2 input[name='warranty']").datepicker('setStartDate', $(this).val());
    });

	//质保日期
	$("#centerCon2 input[name='warranty']").datepicker({
		language: 'zh-CN',
		todayHighlight:1,
		startDate:warrantyStartDate,
		autoclose: 1,
		minView: 2,
		format: "yyyy-mm-dd",
		orientation:'bottom',
		clearBtn:true
    });

	//报废日期
	$("#centerCon2 input[name='retirement_time']").datepicker({
		language: 'zh-CN',
		todayHighlight:1,
		autoclose: 1,
		minView: 2,
		format: "yyyy-mm-dd",
		orientation:'bottom',
		startDate:discardeStartDate,
		clearBtn:true
	});
}
function categoryModel(data) {
	var level;
	var level_4 = data.level_4;
	var level_3 = data.level_3;
	var level_2 = data.level_2;
	var level_1 = data.level_1;
	if(null != level_4) {
		level = level_4;
	} else if(null != level_3) {
		level = level_3;
	} else if(null != level_2) {
		level = level_2;
	} else if(null != level_1) {
		level = level_1;
	}
	return level;
}
/**
 * 绑定“影响的数据”
 */
function loadPart1() {
	var thisHehp = '#centerCon1 .selectpicker';
	var currentVal = $(this).next().next().val();
	$("#importanceId").render(importanceData, importanceValue);
	//往该下拉选中绑定数据
	if("" == currentVal || 0 == currentVal) {
		$(thisHehp).selectpicker('val', '');
	} else {
		$(thisHehp).selectpicker('val', currentVal);
	}
	$(thisHehp).selectpicker('refresh');
}
/**
 * 绑定数据函数
 * 需要绑定下拉选的value时，
 */
/**
 * 点击不同的下拉选，加载不同的信息。页面第一、第二、四部分
 */
function loadPart24(categoryBottomId) {
	var de = {
		brand_symbol_r_name: {
			value: function() {
				return this.id;
			}
		},
		brand_model_name: {
			value: function() {
				return this.id;
			}
		},
		sale_name: {
			value: function() {
				return this.id;
			}
		},
		resource_usestatus_name: {
			value: function() {
				if(-1 == this.id) {
					return "";
				} else {
					return this.id;
				}
			}
		},
		use_person_id_name: {
			value: function() {
				return this.id;
			}
		},
		charge_person_name: {
			value: function() {
				return this.id;
			}
		}
	};
	//点击品牌加载所有品牌/供应商/使用状态等。。
	$("#centerCon2 .btn-default,#centerCon4 .btn-default").unbind('click').click(function() {
		var thisHelp = $(this).siblings("select"); //需要绑定数据的select
		var currentSel = $(this).next().next(); //当前select被选中的option
		
		//获取flag，区分获取查找哪个
		var flag = thisHelp.attr("name");
		var brandId = $("#brandId option:selected").val();
		if("brand_model_id" == flag && "" == brandId) {
			outBoxCloseRes("请选择一个品牌");
		} else {
			//		var flag = thisHelp.attr("name");
			$.ajax({
				url: loadResourceHelpUrl,
				type: "get",
				data: {
					"flag": flag,
					"categoryBottomId": categoryBottomId,
					"brandId": $("select[name=brand_id]").selectpicker('val')
				},
				dataType: "json",
				//complete: onComplete,
				success: function(result){
					console.log(result);
					//获取品牌id
					$(".BrandmodelId").val(currentVal);
					//登录信息失效，ajax请求静态页面拦截
					onComplete(result);
					if(result.status == successReturn) {
						//当前选中的值
						var currentVal = currentSel.val();
						var data = result.data;
						//往该下拉选中绑定数据
						thisHelp.render(data, de);
						if("" == currentVal || 0 == currentVal) {
							thisHelp.selectpicker('val', '');
						} else {
							thisHelp.selectpicker('val', currentVal);
						}
						thisHelp.selectpicker('refresh');
					}
				},
				error: function(XMLHttpRequest) {
					error_500(XMLHttpRequest.responseText);
				}
			});
		}
	});
	
	/**
 		* 点击供应商新增添加列表
 	**/
	$("span.addNewSupplier").click(addSupplier);
	/**
 		* 点击品牌新增添加列表
 	**/
	$("span.addNewBand").click(addBand);
	/**
	 *点击品牌型号新增添加列表
	  **/
	$("span.addNewBandModel").click(addBandModel);
}




/**
 * 加载页面的第三部分，即所选最后一级分类的属性模板,不需要绑定下拉选的value。
 */
function loadPart3(categoryBottomId) {
	//点击品牌加载所有品牌/供应商/使用状态
	$("#centerCon3 .btn-default").unbind('click').click(function() {
		var thisHelp = $(this).siblings("select");
		//获取flag，区分获取查找哪个
		var flag = thisHelp.attr("name");
		$.ajax({
			url: loadResourceHelpUrl,
			type: "get",
			data: {
				"flag": flag,
				"categoryBottomId": categoryBottomId
			},
			dataType: "json",
			//			complete: onComplete,
			success: function(result) {
				//登录信息失效，ajax请求静态页面拦截
				onComplete(result);
//				console.log(result);
				if(result.status == successReturn) {
					var data = result.data;
					//往该下拉选中绑定数据
					var curr = thisHelp.val();
					thisHelp.render(data);
					if("" == curr || 0 == curr) {
						thisHelp.selectpicker('val', '');
					} else {
						thisHelp.selectpicker('val', curr);
					}
					thisHelp.selectpicker('refresh');
				}
			},
			error: function(XMLHttpRequest) {
				error_500(XMLHttpRequest.responseText);
			}
		});
	});
}

/**

 * 提交表单前处理
 */
function beforeSubmit() {
	//提交表单前，处理，把所有专有属性，全部放在一个隐藏的input中，写入资源的“参数信息”字段
	/*
	 * {"boxModel":"1U机架式","cpu":"cpu","EMS":"2.3","disc":"3.3","OSversion":"3.","masterName":"2.6","MAC":"1.01","IP":"192"}
	 * 对象，下面这个方法写入的数据
	 */
	//私有属性
	var data = new Object();
	var inputData = $("#centerCon3 [name]");
	if(inputData.length - 0 != 0) {
		for(var i = 0; i < inputData.length; i++) {
			var dataName = inputData.eq(i).attr("name");
			var dataVal = inputData.eq(i).val();
//			console.log(inputData.eq(i)[0].tagName);/
			if(inputData.eq(i)[0].tagName =='INPUT'){	
				if("" == dataVal) {
					dataVal = $.trim(inputData.eq(i).text());
				}
			}else if(inputData.eq(i)[0].tagName =='SELECT'){
				if("--请选择--" == dataVal){
					dataVal = "";
				}
			}
			//[]和. 有区别
			data[dataName] = dataVal;
		}
		//私有属性写在一个隐藏域内
		$("#dataHelpId").val(JSON.stringify(data));
	}
}

/**
 * 含文件表单提交后处理
 * @param responseText  表单的提交结果
 * @param result 文件的上传结果
 */
function afterSubmit(responseText, statusText) {
	//登录信息失效，ajax请求静态页面拦截
	onComplete(responseText);
	console.log(responseText);
	/*
	 *异步上传处理错误和返回结果要处理fileerror和fileuploaded方法；
	 *同步上传处理错误和返回结果filebatchuploaderror和filebatchuploadsuccess方法
	 */
	//校验表单，如果有不合法信息，提示用户
	if(responseText.status == errorReturn) {
		$("span.errorB").html("");
		$("#nameError").html(responseText.data.name);
		$("#snError").html(responseText.data.snNum);
		$("#snLenError").html(responseText.data.snNumLen);
		$("#categoryError").html(responseText.data.category);
		$("#IPError").html(responseText.data.IP);

		$(".centerCon3-p6 .centerCon-quarter .centerCon-txt .errorB").html(responseText.data.dateFormat);
		$('#timeError').html('');
	} else {//合法
		var resourceId = responseText.data;
		var filesCount = $('#file-1').fileinput('getFilesCount');//判断是否有文件上传
		if(responseText.status == successReturn) {
			if(filesCount - 0 != 0){
				$("#file_help_id").val(resourceId);
				$("#file_help_flag").val(flag);
				uploadFile("file-1",resourceId,updateResFileUrl);
			}else if(filesCount - 0 == 0){
				if(null==getUrlParam("flag")){//直接点击列表页新建进入点击保存
					window.location.href = assetDealHtml+'?resourceId='+resourceId;
				}else{	
					//需求：通过资产详情编辑进入保存后返回新资产详情页面将参数传回
					var isResList = getUrlParam("isResList");
					if(null != isResList && 0 == isResList){
		    			var param = preHandUrlParamD();
		    			var paramUrl = nextHandUrlParamD(param);
						if(getUrlParam("flag")=="edit"){//flag
		//					window.location.href = assetDealHtml+window.location.search;
							
		//    				console.log(window.location.href);
		    					window.location.href = assetDealHtml+"?resourceId="+resourceId+'&'+paramUrl;
		    				
								//window.location.href = assetDealHtml+searchUrl;
						}else if(getUrlParam("flag")=="copy"){
		//					window.location.href = assetDealHtml+'?resourceId='+resourceId;
								window.location.href = assetDealHtml+"?resourceId="+resourceId+'&'+paramUrl;
						}else if(getUrlParam('flag')=="add"){
								window.location.href = assetDealHtml+"?resourceId="+resourceId+'&'+paramUrl;
						}
					}else{//没有权限查看自己数据时进资产新建url中无参数
						window.location.href = assetDealHtml+'?resourceId='+resourceId;			
					}
				}
			} 
		}else {
			outBoxCloseRes("操作失败");
		}
	}
}
/**
 * 跳转到资源的详情页面上
 * @param resourceId 资源id
 */
function toAssetDetail(resourceId) {
	window.location.href = assetDealHtml + '?resourceId=' + resourceId;
}
/**
 * 更新资源，数据库中的文件字段。
 */
var fileInput = "file-1";
function updateResFileUrl(resourceId,flag){
	var fileAll = $("#fileHelpId").val();//所有的文件名称
	
	var fileFail = flag.dataSub;//本次上传失败的文件名称（list）
	var fileSuccess = flag.data;//本次上传成功的文件名称（list）
	var fileReal = "";//数据库中需要存的文件名称（之前的名称+本次上传的文件名称）
	if(fileSuccess.length>0){
		//修改数据库中的文件字段
		if(null != resFileNameOld){
			fileReal += resFileNameOld+",";
		}
		fileReal += fileSuccess.toString();
		if(null != fileReal && "" != fileReal){
			$.ajax({
				url:resFileUrlUpdateUrl,
				type:"post",
				data:{id:resourceId,fileUrl:fileReal},
				dataType:"json",
				success:function(result){
					//登录信息失效，ajax请求静态页面拦截
		            onComplete(result);
		            
		            if(fileFail.length>0){
		            	//提示用户没有上传成功的文件名称
		            	outBoxCloseEvent(fileFail.toString()+"，未上传成功，请重试！");
		            	//再次点击保存时，进行修改。
		            	$("#updatePrivate").val("updatePrivate");
		            	$("#resourceIdEdit").val(resourceId);
		            	resFileNameOld = fileReal;
		            	$('#'+fileInput).fileinput('clear');
		            }else{
		            	toAssetDetail(resourceId);//修改完数据库中的文件字段后，跳转页面
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
    	$("#resourceIdEdit").val(resourceId);
    	resFileNameOld = fileReal;
    	$('#'+fileInput).fileinput('clear');
	}
}
/**
 * 提交表单其他数据（增加，复制）
 */
function formSubmitAddFile() {
	/*
	 * 	//没看懂
        $('#resourceId').submit(function() {
         $(this).ajaxSubmit(options);
         return false;//防止dialog 自动关闭
	 */
	var options = {
		url: resourceAddUrl,
		beforeSubmit: beforeSubmit(), //提交前处理
		success: afterSubmit, //提交后处理
		error: function(XMLHttpRequest) {
			error_500(XMLHttpRequest.responseText);
		},
		dataType: "json",
	};
	$("#resourceId").ajaxSubmit(options);
}
/**
 * 修改时提交表单数据
 */
function formSubmitUpdate() {
	var options = {
		url: resourceUpdateUrl,
		beforeSubmit: beforeSubmit(), //提交前处理
		success: afterSubmit, //提交后处理
		error: function(XMLHttpRequest) {
			error_500(XMLHttpRequest.responseText);
		},
		dataType: "json"
	};
	$("#resourceId").ajaxSubmit(options);
}

//-------------------------修改资源-----------------------------------------------
function editResource(resourceId) {
	
	//绑定页面第二部分的id，品牌、型号、资产状态等
	var bandValuePart2 = {
		brand_symbol_r_name: {
			value: function() {
				return this.resource_brand_id;
			}
		},
		brand_model_name: {
			value: function() {
				return this.resource_brand_model_id;
			}
		},
		sale_name: {
			value: function() {
				return this.resource_sale_id;
			}
		},
		resource_usestatus_name: {
			value: function() {
				return this.resource_usestatus;
			}
		}
	};
	//绑定第一，四部分的数据
	//责任人，使用人、影响
	var bandValue = {
		use_person_id_name: {
			value: function() {
				return this.resource_use_person_id;
			}
		},
		charge_person_name: {
			value: function() {
				return this.resource_charge_person_id;
			}
		},
		resource_importance_name: {
			value: function() {
				return this.resource_importance;
			}
		}
	};
	$.ajax({
		url: resourceDetailUrl,
		type: "get",
		data: {
			"resourceId": resourceId
		},
		dataType: "json",
		//		complete: onComplete,
		success: function(result) {
			console.log(result);
			//登录信息失效，ajax请求静态页面拦截
			onComplete(result);
		
			//请求成功，显示资源的详情
			if(result.status == successReturn) {
				//往页面上绑定数据
				var resource = result.data.resource;
				resFileNameOld = result.data.file_url;
				var para = $.parseJSON(result.dataSub); //字符串转换成json
				var level = functionResCategory(resource); //分类id
				var level_html = functionResCategoryHtml(resource); //分类模板html
				//拉取第二，三部分的模板，并绑定数据
				if(null != level_html.html) {
					$.get(level_html.html, function(getData) {
						var center2 = "#centerCon2";
						$(center2).append(getData); //加载模板
						$(center2 + " #detailFlag").remove(); //隐藏模板中的第二部分
						//绑定数据
						$(center2).render(resource, bandValuePart2);
						$(center2 + " .selectpicker").selectpicker({
							noneSelectedText: '--请选择--'
						});
						loadPart24(level.id);
                        setDatePikcer();
                        // 刷新第二,三部分的样式
                        $('select').selectpicker('refresh');
					});
				}
				if(null != level_html.htmlHelp) {
					$.get(level_html.htmlHelp, function(getData) {
						var center3 = "#centerCon3";
						$(center3).append(getData);
						$(center3 + " #detailFlag").remove(); //隐藏模板中的第二部分
						$(center3).render(resource);
						$(center3).render(para); //第三部分绑定数据
						$(center3 + " .selectpicker").selectpicker({
							noneSelectedText: '--请选择--'
						});
                        loadPart3(level.id);
                        // 刷新第二,三部分的样式
                        $('select').selectpicker('refresh');
					});
				}
				//绑定第一，四部分的数据
				$("#updatePrivate").val("updatePrivate");
				//把资源id放在页面上
				$("#resourceIdEdit").val(resource.resource_id)
				$("#resourceEditData").render(resource, bandValue);
				//部门、分类数据的绑定
				$("#department").attr("value", resource.department_name);
				$("#departmentCode").attr("value", resource.resource_oarchitecture_id);
				$("#category").attr("value", level.name);
				$("#categoryCode").attr("value", level.id);
				// 刷新第一,四部分的样式
                $('select').selectpicker('refresh');
				
			}
		},
		error: function(XMLHttpRequest) {
			error_500(XMLHttpRequest.responseText);
		}
	});
}
//-------------------------复制资源-----------------------------------------------
/**
 * 查找该资源的所有信息，并进行复制
 * 复制时，例如品牌、型号、责任人、使用人等需要绑定下拉选的value值
 */
function copyResource(resourceId) {

	//绑定页面第二部分的id，品牌、型号、资产状态等
	var bandValuePart2 = {
		brand_symbol_r_name: {
			value: function() {
				return this.resource_brand_id;
			}
		},
		brand_model_name: {
			value: function() {
				return this.resource_brand_model_id;
			}
		},
		sale_name: {
			value: function() {
				return this.resource_sale_id;
			}
		},
		resource_usestatus_name: {
			value: function() {
				return this.resource_usestatus;
			}
		}
	};
	$.ajax({
		url: resourceDetailUrl,
		type: "get",
		data: {
			"resourceId": resourceId
		},
		dataType: "json",
		//		complete: onComplete,
		success: function(result) {
			//登录信息失效，ajax请求静态页面拦截
			onComplete(result);
			console.log(result)	
			//请求成功，显示资源的详情
			if(result.status == successReturn) {
				//往页面上绑定数据
				var resource = result.data.resource;
				resFileNameOld = "";
				var para = $.parseJSON(result.dataSub); //字符串转换成json
				var level = functionResCategory(resource);
				var level_html = functionResCategoryHtml(resource);
				//拉取第二，三部分的模板，并绑定数据
				if(null != level_html.html) {
					$.get(level_html.html, function(getData) {
						var center2 = "#centerCon2";
						$(center2).append(getData); //加载模板
						$(center2 + " #detailFlag").remove(); //隐藏模板中的第二部分
						//绑定数据
						$(center2).render(resource, bandValuePart2);
						$(center2 + " .selectpicker").selectpicker({
							noneSelectedText: '--请选择--'
						});
						loadPart24(level.id);
						setDatePikcer();
					});
				}
				if(null != level_html.htmlHelp) {
					$.get(level_html.htmlHelp, function(getData) {
						var center3 = "#centerCon3";
						$(center3).append(getData);
						$(center3 + " #detailFlag").remove(); //隐藏模板中的第二部分
						//						$(center3).render(resource);
						$(center3).render(para); //第三部分绑定数据
						$(center3 + " .selectpicker").selectpicker({
							noneSelectedText: '--请选择--'
						});
						loadPart3(level.id);
					});
				}
				//绑定第一，四部分的数据
				//责任人，使用人、影响
				var bandValue = {
					use_person_id_name: {
						value: function() {
							return this.resource_use_person_id;
						}
					},
					charge_person_name: {
						value: function() {
							return this.resource_charge_person_id;
						}
					},
					resource_importance_name: {
						value: function() {
							return this.resource_importance;
						}
					}
				};
				$("#resourceEditData").render(resource, bandValue);
				//资源名称，序列号置为" "
				$("[name = 'name']").val("");
				$("[name = 'sn_number']").val("");
				//部门、分类数据的绑定  text和value
				$("#department").attr("value", resource.department_name);
				$("#departmentCode").attr("value", resource.resource_oarchitecture_id);
				$("#category").attr("value", level.name);
				$("#categoryCode").attr("value", level.id);
				$('#centerCon4 .selectpicker,#centerCon1 .selectpicker').selectpicker('refresh');
			}
		},
		error: function(XMLHttpRequest) {
			error_500(XMLHttpRequest.responseText);
		}
	});
}
/*
 * 处理分类id
 */
function functionResCategory(resource) {

	var level = new Object();
	var level_4_id = resource.resource_level_4_id;
	var level_3_id = resource.resource_level_3_id;
	var level_2_id = resource.resource_level_2_id;
	var level_1_id = resource.resource_level_1_id;
	if(null != level_4_id) {
		level.id = level_4_id;
		level.name = resource.level_4_name;
	} else if(null != level_3_id) {
		level.id = level_3_id;
		level.name = resource.level_3_name;
	} else if(null != level_2_id) {
		level.id = level_2_id;
		level.name = resource.level_2_name;
	} else if(null != level_1_id) {
		level.id = level_1_id;
		level.name = resource.level_1_name;
	}
	return level;
}
/**
 * 处理分类模板，根据实体类的不同html_name来拉取不同的模板
 * @param resource
 * @returns {___anonymous16021_16025}
 */
function functionResCategoryHtml(resource){
//	console.log(resource);
	var level = new Object();
	var level_1 = resource.level_1_html;
	var level_2 = resource.level_2_html;
	var level_3 = resource.level_3_html;
	var level_4 = resource.level_4_html;
	if(null != level_4) {
		level.htmlHelp = level_4;
	} else if(null != level_3) {
		level.htmlHelp = level_3;
	} else if(null != level_2) {
		level.htmlHelp = level_2;
	}
	if(null != level_1) {
		level.html = level_1;
	}
	return level;
}
/**
 * 点击保存按钮
 */
function saveClick() {
	//先把提示的错误信息清除掉
	$(".errorB").html("");
	$("#fileHelpId").val("");
	//获取区分(增加、复制)和修改时的标志
	var updatePrivate = $("#updatePrivate").val();
	var filesCount = $('#file-1').fileinput('getFilesCount');
	var fileNames = [];//新上传的文件
	//如果没有文件需要上传，直接提交表单
	if(filesCount - 0 != 0){

		//获取需要上传的文件名称，写在一个隐藏域内
		fileNames = newfileNames("file-1",resFileNameOld);
		$("#fileHelpId").val(fileNames);

		if("" != updatePrivate){
			//点击保存，进行“修改”
			checkFileNames(fileNames,formSubmitUpdate);
		}else{
			//点击保存，进行“增加”
			//上传文件
			checkFileNames(fileNames,formSubmitAddFile);
		}
    }else{
    	if("" != updatePrivate){
    		//点击保存，进行“修改”
    		formSubmitUpdate();//通过资产详情编辑进入
    	}else{
    		formSubmitAddFile();//直接进入
    	}
    }
}
/**
 * 增加资源时，临时增加一个供应商弹框
 */
function addSupplier() {
	$("span.errorJS").html("");
	//清空表单数据
	//	$('#supplierData :input')
	//	 .not(':button, :submit, :reset, :hidden')
	//	 .val('')
	//	 .removeAttr('checked')
	//	 .removeAttr('selected');
	$("#supplierData")[0].reset();
	var selectType = $("select.supplierType");
	selectType.render(suppliersData, suppliersValue);
	selectType.selectpicker('val', 0);
	selectType.selectpicker('refresh');
	$("#addSupplier").modal("show");
}
/**
 *增加资源时，临时增加一个品牌弹框 
 */
function addBand(){
	//清空表单列表
	$("span.errorJS").html("");
//	$("textarea .moadal-bandmodel-textarea").val("");
	$("#bandData")[0].reset();
	$("#addBand").modal("show");
}
/**
 *增加资源时，临时增加一个型号弹框 
 */
function addBandModel(){
	//清空表单列表
	$("span.errorJS").html("");
//	$("textarea .moadal-bandmodel-textarea").val("");
	$("#bandModelData")[0].reset();
	$("#addBandModel").modal("show");
}


/**
 * 增加资源时，临时增加一个供应商弹框，点击“保存”，新建供应商
 */
function addSupplierSave() {
	$("span.errorJS").html("");
	$.ajax({
		url: supplierAddUrl,
		data: $('#supplierData').serialize(),
		type: "post",
		dataType: "json",
		success: function(result) {
			console.log(result)
			onComplete(result);
			var status = result.status;
			if(status == errorForm) {
				$("span.supplierName").html(result.data.nameE);
				$("span.contact_tell").html(result.data.tellE);
				$("span.formException").html(result.data.exceptionE);
			} else {
				outBoxCloseHead(result.msg, "addSupplier", "tipMsg");
			}
		},
		error: function(XMLHttpRequest) {
			error_500(XMLHttpRequest.responseText);
		}
	});
}
/**
 * 增加资源时，临时增加一个品牌弹框，点击“保存”，新建品牌
 */
function addBandSave() {
	$("span.errorJS").html("");
//	$("textarea .moadal-bandmodel-textarea").val("");
	$.ajax({
		url: createBrandSymBolUrl,
		data: $('#bandData').serialize(),
		type: "post",
		dataType: "json",
		success: function(result) {
			//console.log(result)
			onComplete(result);
			var status = result.status;
			if(status == errorForm) {
				$("span.contact_band").html(result.data.name);
			} else {
				outBoxCloseHead(result.msg, "addBand", "tipMsg");
			}
		},
		error: function(XMLHttpRequest) {
			error_500(XMLHttpRequest.responseText);
		}
	});
}	
/**
 * 增加资源时，临时增加一个型号弹框，点击“保存”，新建品牌
 */
function addBandModelSave() {
	$("span.errorJS").html("");
//	$("textarea .moadal-bandmodel-textarea").val("");
	$.ajax({
		url: createBrandModelUrl,
//		traditional: true,
//		data: $('#bandModelData').serialize(),	
		data: {
			name: $("input.bandModelType").val(),
			category_info_id: $("#resourceId .modal-body-categoryId").val(),
			brand_symbol_id: $("select[name=brand_id]").selectpicker('val'),
			memo: $("#addBandModel .modal-body-textraea").val()
		},
		type: "post",
		dataType: "json",
		success: function(result) {
			console.log(result);
			onComplete(result);
			var status = result.status;
			if(status == errorForm) {
				$('span.contract_model').html(result.data.brand_model_name);
			} else {
				outBoxCloseHead(result.msg, "addBandModel", "tipMsg");
			}
		},
		error: function(XMLHttpRequest) {
			error_500(XMLHttpRequest.responseText);
		}
	});
}	


/**
 * jquery函数..四类按钮能进这个方法
 * 1.增加  无参数
 * 2.增加  分类id
 * 3.修改  分类id
 * 4.复制  分类id
 */
$(function() {
	resourceId = getUrlParam("resourceId");
//	console.log(resourceId);
	getHistory();
	$("span.navlist-img3").addClass("active");
	if(null != resourceId) {
		//区分是“编辑”按钮，还是“复制”按钮过来的
		var flag = getUrlParam("flag");
		if("edit" == flag) {
			//调用函数，显示资源的全部信息
			editResource(resourceId);
		}else if("copy" == flag) {
			copyResource(resourceId);
		}
	}
	//增加资源时，获取url中的参数。如果有分类id，则加载对应的属性模板
	var categoryBottomId = getUrlParam("categoryBottomId");
	
	//新建资源时，有分类id以及该分类的信息
	
	var categoryInfo = getUrlParam("hasChild");
	//如果增加时选择了分类，则直接调用函数
	if(0 == categoryInfo) {
		//把分类id写在页面上
		loadCategoryModel(categoryBottomId);
	}
	//加载分类树,如果没有分类id，则在当前页面选择一个分类id，再发送ajax请求,加载对应的属性模板
	//此外，这个还跟在资源列表页里是否选择了一个分类有关系
	categoryHelp("category-tree", "category-menu", "category", "categoryCode",
		loadCategoryZTreeUrl, categoryInfo, categoryBottomId);
	//加载部门树
	creatTree("department-tree", "department-menu", "department", "departmentCode",
		departmentDataUrl, true);
		
	//点击保存按钮。增加资源
	$("#saveResourceId").click(saveClick);
	//点击页面第一部分时加载数据
	$("#centerCon1 .btn-default").unbind('click').click(loadPart1);
	//点击页面的第四部分的时候，就需要调用此方法
	loadPart24();
	
	//返回上一页
	$("span.addTitle-back,button.addTitle-delete").click(function() {
		window.history.back();
	});
	//保存新增供应商
	$("button.addSupplier").click(addSupplierSave);
	//保存新增品牌
	$("button.addBand").click(addBandSave);
	//保存新增型号
	$("button.addBandModel").click(addBandModelSave);
});
/**
 * 专用于加载分类树是的ztree
 * @param tree_id
 * @param menu_id
 * @param input_id
 * @param code_id
 * @param url
 */
//"category-tree","category-menu","category","categoryCode",loadCategoryZTreeUrl
function categoryHelp(tree_id, menu_id, input_id, code_id, url, categoryInfo, categoryBottomId) {
	var newSelect = new selectMenu(tree_id, menu_id, input_id, code_id, url);
	newSelect.onSelect('id', 'parent_id', 'name');
	$('#' + input_id).click(function() {
		var treeObj = $.fn.zTree.getZTreeObj(tree_id);
		var snode = treeObj.getNodesByParam("id", categoryBottomId, null);
		//    	var nodes = treeObj.getNodes();
		if(null != snode) {
			if(1 == categoryInfo) {
				if(snode.length > 0) {
					treeObj.expandNode(snode[0], true, true, true);
				}
			} else if(0 == categoryInfo) {
				if(snode.length > 0) {
					treeObj.expandNode(snode[0].getParentNode(), true, true, true);
				}
			}
		}
		newSelect.show();
		$('#' + tree_id).click(function() {
			//    		var treeObj = $.fn.zTree.getZTreeObj(tree_id);
			var t = treeObj.getSelectedNodes();
			if(t.length > 0 && !t[0].isParent) {
				var categoryBottomId = $("#" + code_id).val();
				if(null != categoryBottomId) {
					loadCategoryModel(categoryBottomId);
				}
			}
		});
	});
}
/**
 * 改变下拉选的样式
 */
function initSel(){
	$(".selectpicker").selectpicker({
		noneSelectedText: '--请选择--'
	});
}
initSel();

//获取当前日期
function DateToday(){
	var d = new Date();
	var year= d.getFullYear();
	var month=d.getMonth()+1;
	if(month<10){
		month='0'+month;
	}
	var day=d.getDate();
	if(day<10){
		day='0'+day;
	}
	var str = year+"-"+month+"-"+day;
	return str;
}
//获取明年今日(修改为明年的今天前一天)
function nextDateToday(){
	var d = new Date();
	var year= d.getFullYear()+1;
	var month=d.getMonth()+1;
	if(month<10){
		month='0'+month;
	}
	var day=d.getDate()-1;
	if(day<10){
		day='0'+day;
	}
	var str = year+"-"+month+"-"+day;
	return str;
}

 //设置合同金输入限制
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
	var r = window.location.search.substr(1).match(reg); //匹配目标参数
	if(r != null) return unescape(r[2]);
	return null; //返回参数值
}
/**
 * 弹框的关闭
 * @param msg 弹框关闭后的提示信息
 */
function outBoxCloseRes(msg){
	$("#tipMsg").addClass("active").html(msg).show();
	function tipHide(){
		$("#tipMsg").hide();
	}
    setTimeout(tipHide,2000);
}

/**
 * 处理路径中的url参数，
 * @returns 返回一个查询条件的对象，和本页面中的fc类似。
 */
function preHandUrlParamD(){
	var pp = new Object();
	var mark = getUrlParam("mark");
	if(null == mark){
	    pp.mark = 7;
	}else{
		pp.mark = mark;
	}
	var page = getUrlParam("page");
	if(null == page){
		pp.page = 1;
	}else{
		pp.page = page;
	}
	var sort = getUrlParam("sort");
	if(null == sort){
		pp.sort = SORT;
	}else{
		pp.sort = sort;
	}
	var comparable = getUrlParam("comparable");
    if(null == comparable){
    	pp.comparable = COMPARE;
	}else{
		pp.comparable = comparable;
	}
	var likeInput = getUrlParam("likeInput");
    if(null == likeInput){
    	pp.likeInput = "";
	}else{
		pp.likeInput = decodeURIComponent(likeInput);
	}
	var categoryId = getUrlParam("categoryId");
    if(null == categoryId){
    	pp.categoryId = "";
	}else{
		pp.categoryId = categoryId;
	}
//	var flag = getUrlParam("flag");
	var assetListFlag= getUrlParam("assetListFlag");
	if(null == assetListFlag){
//	  pp.flag = "lastThirtyFlag";
		pp.assetListFlag="lastThirtyFlag";
	}else{
//		pp.flag = flag;
		pp.assetListFlag=assetListFlag;
	}
	var isResList = getUrlParam("isResList");
	if(null == isResList){
		pp.isResList = 1;
	}else{
		pp.isResList = isResList;
	}
	return pp;
}
/**
 * 把查询条件处理成字符串，用于跳转到下一个页面
 * @param fc 页面上的查询条件
 */
function nextHandUrlParamD(fc){
	var urlParam = "";
	var isResList = fc.isResList;
	if(null == isResList){
		isResList = 1;
	}
	urlParam += "isResList="+isResList;
	var mark = fc.mark;
	if(null == mark){
	  mark = 7;
	}
	urlParam += "&mark="+mark;
	var page = fc.page;
	if(null == page){
		page = 1;
	}
	urlParam += "&page="+page;
	var sort = fc.sort;
	if(null == sort){
		sort = SORT;
	}
	urlParam += "&sort="+sort;
	var comparable = fc.comparable;
    if(null == comparable){
    	comparable = COMPARE;
	}
    urlParam += "&comparable="+comparable;
	var likeInput = fc.likeInput;
    if(null == likeInput){
    	likeInput = "";
	}
    urlParam += "&likeInput="+encodeURIComponent(encodeURIComponent(likeInput));
	var categoryId = fc.categoryId;
    if(null == categoryId){
    	categoryId = "";
	}
    urlParam += "&categoryId="+categoryId;
//	var flag = fc.flag;
	var assetListFlag=fc.assetListFlag;
	if(null == assetListFlag){
//	  flag = "lastThirtyFlag";
	  assetListFlag="lastThirtyFlag";
	}
//	urlParam += "&flag="+flag;
	urlParam+="&assetListFlag="+assetListFlag;
	return urlParam;
}
//


