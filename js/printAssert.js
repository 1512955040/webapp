
function printContent(){
	//http://localhost:8080/printResDetail.html?resourceId=300&contractId=&res_info=1&res_belong=2&
	 //res_relation=2&res_contract=2&res_cost=2&res_history=2
	var resourceId = getUrlParamAssert("resourceId");
	var contractId = getUrlParamAssert("contractId");
	var res_info = getUrlParamAssert("res_info");
	var res_belong = getUrlParamAssert("res_belong");
	var res_relation = getUrlParamAssert("res_relation");
	var res_contract = getUrlParamAssert("res_contract");
	var res_cost = getUrlParamAssert("res_cost");
	var res_history = getUrlParamAssert("res_history");
	var elements = ["infoWrap-resource","res_contract","res_history","res_cost"];
	for(var i=0;i<elements.length;i++){
		$("#"+elements[i]).hide();
	}
	if(null != res_info){
		var info = $("div.infoWrap-resource");
		if(1 == res_info){
			info.show();
			if(null!= resourceId){
				var dataArea = new Object();
			    dataArea.center1 = "#conright1";
			    dataArea.center2 = "#conright2";
			    dataArea.center3 = "#conright3";
			    dataArea.flag = "";
			    loadResourceDetailPrint(resourceId,dataArea);
			}
		}else{
			info.hide();
		}
	}
	if(null != contractId && "" != contractId){
		$("div.conPrint").show();
	    $.ajax({
			url:putContractUrl,
			type:"get",
			data:{"contractId":contractId},
			dataType:"json",
			success:function(data){
				$('#contractUL').render(data.data);
			},
			error:function(XMLHttpRequest){
				error_500(XMLHttpRequest.responseText);
			}
		});
	}
	//以下是归属，关系，成本，历史等等
}
var successReturn =1;
function loadResourceDetailPrint(resourceId,dataArea){
	
	var selValue = {
			resource_importance_name:{
				value:function(){
					return this.resource_importance;
				}
			},
			resource_usestatus_name:{
				value:function(){
					return this.resource_usestatus;
				}
			},
			charge_person_name:{
				value:function(){
					return this.resource_charge_person_id;
				}
			},
			use_person_id_name:{
				value:function(){
					return this.resource_use_person_id;
				}
			}
	};
	$.ajax({
		url:resourceDetailUrl,
		type:"get",
		data:{"resourceId":resourceId},
		dataType:"json",
//		complete: onComplete,
		success:function(result){
			//请求成功，显示资源的详情
			if(result.status == successReturn){
				//往页面上绑定数据
				var resource = result.data.resource;
				//当前的分类名称
//				var level = functionResCategory1(resource);
//				resource.level_name = level.name;
				var level_html = functionResCategoryHtml1Print(resource);
				var para = $.parseJSON(result.dataSub);//参数信息，字符串转换成json
				//拉取第二，三部分的模板，并绑定数据
				if(null != level_html.html){
					$.get(level_html.html,function(getData){
						var center2 = dataArea.center2;
						$(center2).append(getData);//加载模板
						$(center2+" #addUpFlag").remove();//隐藏模板中的第二部分
						//绑定数据
						$(center2).render(resource);
					});
				}
				if(null != level_html.htmlHelp){
					$.get(level_html.htmlHelp,function(getData){
						var center3 = dataArea.center3;
						$(center3).append(getData);
						$(center3+" #addUpFlag").remove();//隐藏模板中的第二部分
						$(center3).render(resource);
						if(null !=para){
							$(center3).render(para);//第三部分绑定数据
						}						
					});
				}
				var resourceDetailId = dataArea.center1;
				$(resourceDetailId).render(resource,selValue);
                $('.selectpicker').selectpicker('refresh');
                if("loadResourceDetail" == dataArea.flag){
                	$("#resourceId").val(resource.resource_id);
                	//其他数据的绑定
                    $("#resource_name").html(resource.resource_name);
                    $("#department").attr("value",resource.department_name);
    				$("#departmentCode").attr("value",resource.resource_oarchitecture_id);
    				//绑定文件信息
    				var resourceFile= result.data.resFile;
    				if(resourceFile.length>0){
    					var filePathHref={
    							fileDownLoad:{
    								href:function(){
    									return this.filePath;
    								}
    							}
    					}
    					$("div.resFile").render(resourceFile,filePathHref);
    					$("[data-bind='resFileCount']").html(resourceFile[0].fileCount);
    				}
                }
			}
		},
		error:function(XMLHttpRequest){
			error_500(XMLHttpRequest.responseText);
		}
	});
}
function functionResCategoryHtml1Print(resource){
	
	var level = new Object();
	var level_1 = resource.level_1_html;
	var level_2 = resource.level_2_html;
	var level_3 = resource.level_3_html;
	var level_4 = resource.level_4_html;
	if(null != level_4){
		level.htmlHelp = level_4;
	}else if(null != level_3){
		level.htmlHelp = level_3;
	}else if(null != level_2){
		level.htmlHelp = level_2;
	}
	if(null != level_1){
		level.html = level_1;
	}
	return level;
}
$(function(){
	printContent();
	$("#btnPrint").click(function(){
		$("#conright1").jqprint();
	})
});
//获取url中的参数
function getUrlParamAssert(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}