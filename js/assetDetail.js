var supplierHtml = "supplierDetail.html";
var contractHtml = "contractDetail.html";
var assetHtml = "assetAdd.html";
var lastThirtyAssetHtml = "lastThirtyAsset.html";
var importanceData,importanceValue;//影响下拉选的数据
var resStatusData,resStatusValue;//影响下拉选的数据
var SORT = "DESC";
var COMPARE = "data_per.create_time";
var startHistoryItem = 0; //记录请求历史信息时的起始位置
var numbersHistoryItem = 8;  //记录请求历史信息的条数;
resStatusData = [
    {
        value:"",
        resource_usestatus_name:"--请选择--"
    },
    {
        value:20,
        resource_usestatus_name:"采购"
    },
    {
        value:21,
        resource_usestatus_name:"库存"
    },
    {
        value:22,
        resource_usestatus_name:"使用"
    },
    {
        value:23,
        resource_usestatus_name:"停用"
    },
    {
        value:24,
        resource_usestatus_name:"报废"
    }
];
resStatusValue = {
    resource_usestatus_name:{
        value:function(){
            return this.value;
        }
    }
};

importanceData = [
    {
        value:"",
        resource_importance_name:"--请选择--"
    },
    {
        value:6,
        resource_importance_name:"高"
    },
    {
        value:5,
        resource_importance_name:"中"
    },
    {
        value:4,
        resource_importance_name:"低"
    }
];
importanceValue = {
    resource_importance_name:{
        value:function(){
            return this.value;
        }
    }
};

// 下拉菜单函数
//拼接字符串
function testString(a,b,c,json){
    //a编码  b父编码  c名称
    var node='';
    node="[";
    for(var i=0;i<json.length;i++){
        if(b==null){
            node += "{id:"+json[i][a]+",pId:null,name:'"+json[i][c]+"',title:'"+json[i][a]+"'},";
        }else{
            node += "{id:"+json[i][a]+",pId:"+json[i][b]+",name:'"+json[i][c]+"',title:'"+json[i][a]+"'},";
        }
    }
    if(json.length > 1 )
        node = node.substring(0, node.length-1);
    node += "]";
    var testJson = eval("(" + node + ")");
    return testJson;
}
// tree_id  存放树 ul id
// menu_id  存放树的 div id
// input_id 显示选项的 input id
// code_id  当前选中项的 code
// url      请求数据的url

var selectMenuClassify = function(tree_id,menu_id,input_id,code_id,url,resouceId){
    this.tree_id = tree_id;
    this.menu_id = menu_id;
    this.input_id = input_id;
    this.code_id = code_id;
    this.resourceId = resouceId;
    var thes = this;
    var curExpandNode = null;
//  this.onClick = function(e, treeId, treeNode){
//      var zTree = $.fn.zTree.getZTreeObj(thes.tree_id),
//          nodes = zTree.getSelectedNodes(),
//          v = "";
//      nodes.sort(function compare(a,b){return a.id-b.id;});
//      for (var i=0, l=nodes.length; i<l; i++) {
//          v += nodes[i].name + ",";
//          if(code_id){
//              $('#'+code_id).attr("value", nodes[i].title);
//          }
//      }
//      if (v.length > 0 ) v = v.substring(0, v.length-1);
//      $("#"+input_id).attr("value", v);
//  }
	this.onClick = function(e, treeId, treeNode){

    	click(e, treeId, treeNode);
    }
	//需求 必须叶子节点才能显示在输入框中
    function click(e, treeId, treeNode){
    	var zTree = $.fn.zTree.getZTreeObj(thes.tree_id);
    	zTree.expandNode(treeNode, null, null, null, true);

        nodes = zTree.getSelectedNodes(),
        //console.log(nodes);
        v = "";
        if(nodes[0].isParent!=true){
        	  nodes.sort(function compare(a,b){return a.id-b.id;});
	        for (var i=0, l=nodes.length; i<l; i++) {
	            v += nodes[i].name + ",";
	            if(code_id){
	                $('#'+code_id).attr("value", nodes[i].title);
	            }
	        }
	        if (v.length > 0 ) v = v.substring(0, v.length-1);
	        $("#"+input_id).attr("value", v);
        }

            //zTree = $.fn.zTree.getZTreeObj("menu_tree_left");

    }
    //点击前事件
    this.beforeClick=function(treeId, treeNode) {
    	var flag = treeNode.open;
    	//console.log(flag);
    	var zTree_Menu=$.fn.zTree.getZTreeObj(thes.tree_id);
    	//console.log(treeId);
    	if(flag){

    		return true;
    	}else{

			var check = (treeNode && !treeNode.isParent);
	   	    if (check){//选中叶子节点
	   	    	$('#'+menu_id).hide();
	   	    }
	   	    //alert("请选择叶子节点");
		    //return check;
    	}
    }
    //展开事件
    this.onExpand=function(event, treeId, treeNode) {
   	 	curExpandNode = treeNode;
	}
    //展开前事件
	this.beforeExpand=function(treeId, treeNode){
		var pNode = null;
			var treeNodeP =null;

			if (!pNode) {
				singlePath(treeNode,treeId);
			}
	}
	//打开单一节点事件
	function singlePath(newNode,treeId) {
			if (newNode === curExpandNode) return;

            var zTree = $.fn.zTree.getZTreeObj(treeId),
                    rootNodes, tmpRoot, tmpTId, i, j, n;

            if (!curExpandNode) {
                tmpRoot = newNode;
                while (tmpRoot) {
                    tmpTId = tmpRoot.tId;
                    tmpRoot = tmpRoot.getParentNode();//获取根节点
                }
                rootNodes = zTree.getNodes();//获取所有节点
                for (i=0, j=rootNodes.length; i<j; i++) {
                    n = rootNodes[i];
                    if (n.tId != tmpTId) {
                        zTree.expandNode(n, false);
                    }
                }
            } else if (curExpandNode && curExpandNode.open) {
				if (newNode.parentTId === curExpandNode.parentTId) {
					zTree.expandNode(curExpandNode, false);//收起之前节点
				} else {//如果点击了其他节点
					var newParents = [];
					while (newNode) {
						newNode = newNode.getParentNode();
						if (newNode === curExpandNode) {
							newParents = null;
							break;
						} else if (newNode) {
							newParents.push(newNode);
						}
					}
					if (newParents!=null) {
						var oldNode = curExpandNode;
						var oldParents = [];
						while (oldNode) {
							oldNode = oldNode.getParentNode();
							if (oldNode) {
								oldParents.push(oldNode);
							}
						}
						if (newParents.length>0) {
							zTree.expandNode(oldParents[Math.abs(oldParents.length-newParents.length)-1], false);
						} else {
							zTree.expandNode(oldParents[oldParents.length-1], false);
						}
					}
				}
			}
			curExpandNode = newNode;
		};
    this.options = {
        view: {dblClickExpand: false},
        data: {simpleData: {enable: true}},
        callback: {
        	beforeClick: this.beforeClick,
            onClick: this.onClick,
            onExpand: this.onExpand,
            beforeExpand: this.beforeExpand,

        }
    };
    this.show = function(){
        $("#"+menu_id).slideDown("fast");
        $("body").bind("mousedown", this.down);

 		var zTree_Menu=$.fn.zTree.getZTreeObj(tree_id);
    	//console.log(treeId);
    	if(code_id){
	        var codeId=zTree_Menu.getNodeByParam("id",$('#'+code_id).data('code_id'));
//	        zTree_Menu.expandNode(codeId,true,false);//展开指定节点
			zTree_Menu.selectNode(codeId);//选择指定节点
	    }
    }
    this.hide = function(){
        $("#"+menu_id).fadeOut("fast");
        $("body").unbind("mousedown", this.down);
    }
    this.down = function(event){
        if (!(event.target.id == menu_id || $(event.target).parents("#"+menu_id).length>0)) {
            thes.hide();
        }
    }
    /**
     * 加载数据
     * */
    this.onSelect = function(id,parent_id,name){
        $.ajax({
            type:"post",
            url:url,
            async:true,
            dataType:"json",
            data:{resourceId:this.resourceId},
            contentType:'application/x-www-form-urlencoded; charset=UTF-8',//防止乱码
            success:function(data){

                //登录信息失效，ajax请求静态页面拦截
                onComplete(data);

                treeData = data;
                var rolejson=testString(id,parent_id,name,data);
                $.fn.zTree.init($("#"+tree_id), thes.options , rolejson);
            },
            error:function(XMLHttpRequest){
    			error_500(XMLHttpRequest.responseText);
    		}
        });
    }
}
//创建下拉树
function creatClassifyTree(tree_id,menu_id,input_id,code_id,url,resouceId){
    var newSelect = new selectMenuClassify(tree_id,menu_id,input_id,code_id,url,resouceId);
    newSelect.onSelect('id','parent_id','name');
    $('#'+input_id).click(function(){
        newSelect.show();
    });
}
/**去除数组为null的元素 **/
function ClearNullArr(arr){
	for(var i=0,len=arr.length;i<len;i++){
		if(!arr[i]||arr[i]==''||arr[i] === undefined){
			arr.splice(i,1);
			len--;
			i--;
		}
	}
	return arr;
}

var successReturn = 1; //请求成功
var failReutn = 2;//请求失败
/**
 * 请求资源的详情信息
 * @param resourceId
 */
function loadResourceDetail(resourceId,dataArea){

	$.ajax({
		url:resourceDetailUrl,
		type:"get",
		data:{"resourceId":resourceId},
		dataType:"json",
//		cache:false,
		success:function(result){
			console.log(result);
            //登录信息失效，ajax请求静态页面拦截
            onComplete(result);

            if(result.data!==null){
            	var resource = result.data.resource;
            	var arr=[];
	         	if(null!==result.data.resource){
	         		 arr.push(resource.resource_level_4_id,resource.resource_level_3_id,resource.resource_level_2_id,resource.resource_level_1_id);
					//console.log(arr);
					if(null==arr[0]){
						ClearNullArr(arr);
						code_id=arr[0];
					}else{
						code_id=arr[0];
					}
					$('#moveCode').data('code_id',code_id);
					setHistory(result.data.resource.resource_name);
					
	         	}
           }

			//请求成功，显示资源的详情
			if(result.status == successReturn){
				getHistory();
				//页面数据的绑定
				bandResData(result,dataArea);

				if(parseInt($("[data-bind='contract_name']").css('width'))>=parseInt($("[data-bind='contract_name']").css('maxWidth'))){
					$("[data-bind='contract_name']").addClass('tips');
				}
//				//是否删除附件信息
				rowWrapDelete($('.modal-body-bottom-row'),$('.rowWrapDelete'),$('#assetDelete'),$('.assetDetail'),$("[data-bind='filePath']"));
			}else if(failReutn == result.status){
				outBoxRes(result.msg);
				getHistory();
        $(".container-left-item6").off("click");  //无权限查看时, 解绑左侧的历史信息点击事件
			}
            loadUpdateInfo();
		},
		error:function(XMLHttpRequest){
			error_500(XMLHttpRequest.responseText);
		}
	});
}

function outBoxRes(msg,hideArea){
	$("#tipMsg").addClass("active").html(msg).show();
	function tipHide(){
		$("#tipMsg").hide();
	}
    setTimeout(tipHide,2000);
	$("#"+hideArea).modal('hide');
}

/**
 * 绑定资源的详情数据
 * @param result
 * @param dataArea
 */
function bandResData(result,dataArea){

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
	//往页面上绑定数据
	var resource = result.data.resource;
	var center2 = dataArea.center2;
	var center3 = dataArea.center3;
	$(center2).empty();
	$(center3).empty();
	
	//当前的分类名称
	var level = functionResCategory1(resource);
	resource.level_name = level.name;
	var level_html = functionResCategoryHtml1(resource);
	var para = $.parseJSON(result.dataSub);//参数信息，字符串转换成json
	//拉取第二，三部分的模板，并绑定数据
	if(null != level_html.html){
		$.get(level_html.html,function(getData){
			$(center2).append(getData);//加载模板
			$(center2+" #addUpFlag").remove();//隐藏模板中的第二部分
			//绑定数据
			$('.conright-infoWrapLeft-itemRowTxt2').addClass('tips');

			if($('.conright-infoWrapLeft-itemRowTxt2').hasClass('noTips')){
				$('.noTips').removeClass('tips');
			}
			$(center2+" #detailFlag").render(resource);

//			$('#container-left').css('height',$('.conright-infoWrap-left').outerHeight()+$('.container-right-title').outerHeight()+30+'px');
			$('#container-left').css('height',$('#container-right').outerHeight()+30+'px');
			$('.conright-infoWrap-right').css('height',$('.conright-infoWrap-left').outerHeight()+'px');
		});
	}
	if(null != level_html.htmlHelp){
		$.get(level_html.htmlHelp,function(getData){
			$(center3).append(getData);
			$(center3+" #addUpFlag").remove();//隐藏模板中的第二部分

			$('.conright-infoWrapLeft-itemRowTxt2').addClass('tips');
			if($('.conright-infoWrapLeft-itemRowTxt2').hasClass('noTips')){
				$('.noTips').removeClass('tips');
			}
			if(null !=para){
				$(center3+" #detailFlag").render(para);//第三部分绑定数据
//				$('#container-left').css('height',$('.conright-infoWrap-left').outerHeight()+$('.container-right-title').outerHeight()+30+'px');
				$('#container-left').css('height',$('#container-right').outerHeight()+30+'px');
				$('.conright-infoWrap-right').css('height',$('.conright-infoWrap-left').outerHeight()+'px');
			}
		});
	}

	var resourceDetailId = dataArea.center1;
	$(resourceDetailId).render(resource,selValue);

    $('.selectpicker').selectpicker('refresh');
    if("loadResourceDetail" == dataArea.flag){
    	$("#resourceId").val(resource.resource_id);
    	//其他数据的绑定

		var categoryImg = "";
		var dataBack = resource.level_1_name;
		if("硬件" == dataBack){
			categoryImg = "hardware";
		}else if("软件" == dataBack){
			categoryImg = "softword";
		}else if("智能仪器" == dataBack){
			categoryImg = "test";
		}else{
			categoryImg = "other";
		}
    	$("[data-bind='category']").addClass(categoryImg);
        $("#resource_name").html(resource.resource_name);
        $("#department").attr("value",resource.department_name);
		$("#departmentCode").attr("value",resource.resource_oarchitecture_id);
		//绑定文件信息
		var resourceFile= result.data.resFile;
		var accessoryLen = resourceFile.length;
		$("#accessoryLen").val(accessoryLen);
		
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

/**
 * 处理分类id,把分类id和分类名称正确的绑定
 */
function functionResCategory1(resource){

	var level = new Object();
	var level_4_id = resource.resource_level_4_id;
	var level_3_id = resource.resource_level_3_id;
	var level_2_id = resource.resource_level_2_id;
	var level_1_id = resource.resource_level_1_id;
	if(null != level_4_id){
		level.id = level_4_id;
		level.name = resource.level_4_name;
	}else if(null != level_3_id){
		level.id = level_3_id;
		level.name = resource.level_3_name;
	}else if(null != level_2_id){
		level.id = level_2_id;
		level.name = resource.level_2_name;
	}else if(null != level_1_id){
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
function functionResCategoryHtml1(resource){

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
/**
 * 弹出资源附件的弹框
 */
function fileClick(){
	var file = $("#accessoryLen").val();
	if(null == file || ""==file || 0== file){

	}else{
		$("#accessory").modal('show');
	}
}

/////*
//// * 弹出资源附件是否删除弹框
////*/
// function rowWrapDelete(a,b,c,d,e){
//	$('.modal-body-bottom-row').each(function(){
//		var madalDelete=$(this);
// 	   	madalDelete.find($('.rowWrapDelete')).click(function(){
// 		 	$('#assetDelete').modal('show');
// 		 	//当点击删除按钮的时候
// 		 	$("#assetDelete").find($('.assetDetail')).click(function(){
//					$.ajax({
//						traditional: true,
//						url:deleteFileUrl,
//						type:"POST",
//						data:{"filePath":madalDelete.find($("[data-bind='filePath']")).html()},
//						dataType:"json",
////						cache:false,
//					success:function(result){
//						//请求成功后执行删除
//						 madalDelete.remove();
//						 $('#assetDelete').modal('hide');
//						 $("#tipMsg").addClass("active").html('删除成功').show();
//						 function hideMsg(){
//              			$("#tipMsg").addClass("active").html('删除成功').hide()
//          			 }
//          			 setTimeout(hideMsg,2000);
//          			 setTimeout(function(){
//          			 	window.location.reload();//刷新当前页面
//          			 },2000)
//					},		
//					error:function(XMLHttpRequest){
//						 error_500(XMLHttpRequest.responseText);
//					}
//				})
//					
// 		 	})
// 		})
//	})
//}

/**
 * 点击供应商，跳转到供应商详情页
 */
function saleClick(){
	var suppliersId = $("[data-bind='resource_sale_id']").val();
	if(null == suppliersId || ""==suppliersId){

	}else{
		window.location.href = supplierHtml+"?suppliersId="+suppliersId;
	}
}
function contractClick(){
	var contractId = $("[data-bind='resource_contract_id']").val();
	if(null == contractId || ""==contractId){

	}else{
		window.location.href = contractHtml+"?contractId="+contractId;
	}
}
/**
 * 与该资源有关的事件统计
 * @param resourceId
 */
function loadResEventBoll(resourceId){
    $.ajax({
        type:"get",
        url:loadResEventBollUrl,
        dataType:"json",
        data:{resourceId:resourceId},
        contentType:'application/x-www-form-urlencoded; charset=UTF-8',//防止乱码
        success:function(result){
	        //登录信息失效，ajax请求静态页面拦截
	        onComplete(result);
	        $("#res_event").html("");
	        var color = [
	                     {color1:'#5286ce',color2:'#84c0e4'},
	                     {color1:'#d7b23e',color2:'#f0d272'},
	                     {color1:'#c47e95',color2:'#eda6bb'},
	                     {color1:'#7871af',color2:'#b3ace2'},
	                     {color1:'#5286ce',color2:'#84c0e4'}
	                 ];
	        if(result.status == successReturn){
	        	var event = result.data;
	        	var total = event.total_number;
	        	var unsolved = event.unresolved_number;
	        	createDivResEvent("未解决",1);
	        	myChart(1,unsolved,color[0].color1,color[0].color2);
	        	createDivResEvent("总计",2);
	        	myChart(2,total,color[1].color1,color[1].color2);
	        }
        },
        error:function(XMLHttpRequest){
			error_500(XMLHttpRequest.responseText);
		}
    });

}
/**
 * 画球形图
 * @param id
 * @param counts
 * @param color1
 * @param color2
 */
function myChart(id,counts,color1,color2){

    var circleChart = echarts.init(document.getElementById('res_'+id));
    var option = {
        title:{
            text:counts,
            bottom:25,
            left:'center',
            textStyle: {
                fontSize: '16',
                fontWeight: 'bold',
                color:'#fff'
            }
        },
//        tooltip: {
//            trigger: 'item'
            //formatter: "{a} <br/>{b}: {c} ({d}%)"
        //},    //提示框
        color: [color1,color2],
        borderWidth: 10,
        series: [
            {
                name:'',
                type:'pie',
                selectedMode: 'single',
                avoidLabelOverlap: false,
                hoverAnimation: false,
                radius: [0, '45%'],
                label: {
                    normal: {
                        show:false,
                        position:  'center'
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data:[counts]
            },
            {
                type:'pie',   //饼图
                name:'',
                radius: ['70%', '100%'],     //极坐标
                avoidLabelOverlap: false,   //标签重叠策略
                title:{
                    text:''
                },
                label: {     //设置图形中间的相关文本信息
                    normal: {
                        show: false
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data:[0,counts],
                hoverAnimation: false
            }
        ]
    };
    circleChart.setOption(option);
}
/**
 * 创建球形图所需的区域
 * @param name
 * @param id
 */
function createDivResEvent(name,id){
    var liDiv = document.createElement("li");//创建li标签
    var frameDiv = document.createElement("div");//创建div标签
    var bodyFa = document.getElementById('res_event');//获取到父节点
    frameDiv.setAttribute("id","res_"+id);
    frameDiv.className = 'circle';
    liDiv.className = "fl";


    var p = document.createElement("p");
    p.className = 'res-countsData-num';
    p.innerHTML = name;
    liDiv.appendChild(frameDiv);
    liDiv.appendChild(p);
    bodyFa.appendChild(liDiv);
//    frameDiv.onmousedown = function(){
//
//    }
}

function eLeftClass(activeLi,dnDiv){
	$("li.container-left-item").removeClass("active");
	$("li."+activeLi).addClass("active");
	$("div.a-left-dn").addClass("dn");
	$("div."+dnDiv).removeClass("dn");
}

/**
 * 点击历史
 */
function assetHistoryClick(assetHistoryDeal,arrowType){
    // arrow代表值  0:置顶; 1:下一条; -1:上一条
    if (arrowType == 0) {
      startHistoryItem = 0;
    }else {
      startHistoryItem = startHistoryItem + arrowType;
    }
    if (startHistoryItem < 0) {
      startHistoryItem = 0;
    }

    $.ajax({
      url: getHistoricalInfoUrl,
      type: 'get',
      data: {
        'type':91,
        'type_id': resourceId,
        'numbers':numbersHistoryItem,
        'start': startHistoryItem
      },
      dataType: 'json',
      success: function(result){
        // 登录信息失效，ajax请求静态页面拦截
        onComplete(result);
        eLeftClass("container-left-item6","infoWrap-history");

        if(1 == result.status){
          // 给[上一条]定权限
          if (startHistoryItem > 0) {
            $(".conHistory-content-right-top").addClass("active");
          }else {
            $(".conHistory-content-right-top").removeClass("active");
          }
          // 给[下一条]定权限
          if (result.data.length < numbersHistoryItem) {
            $(".conHistory-content-right-bottom").removeClass("active");
          }else {
            $(".conHistory-content-right-bottom").addClass("active");
          }

          assetHistoryDeal(result);
        }else{
          $(".conHistory-content").addClass("dn");
        }
      },
      error:function(XMLHttpRequest){
  			error_500(XMLHttpRequest.responseText);
  		}
    });
}
/**
 * 往页面上绑定数据--历史
 */
 function assetHistoryDeal(result){
   var data=[];  //定义写入的数据
   $.each(result.data, function(i,value){
     var time = calcTime3(result.data[i].operation_time);
     data.push({
       action: result.data[i].action,
       name: result.data[i].name,
       number: result.data[i].number,
       status_name:result.data[i].status_name,
       oper_user_name: result.data[i].oper_user_name,
       calc_time1: time.year+"-"+time.month,
       calc_time2: time.date+"日 "+time.hour+":"+time.minute,
     });
   });

   //去掉重复的日期
   var evaluate = data[0].calc_time1;  //设置 去重的比较值
   for(var i=1; i<data.length; i++){
     if (evaluate == data[i].calc_time1) {
       data[i].calc_time1 = "";
     }else {
       evaluate = data[i].calc_time1;
     }
   }
   $(".conHistory-content-dataBind").render(data);
  //  计算历史记录中时间轴的竖线
   var start = $(".conHistory-content-right:first").find(".history-point i")[0].getBoundingClientRect().bottom;
   var end = $(".conHistory-content-right:last").find(".history-point i")[0].getBoundingClientRect().top;
   $(".conHistory-content-right:first").find(".history-point>div").css('height',(end-start));
 }

 /*计算时间函数,历史记录用*/
 function calcTime3(operationTime){
   var time = new Date(operationTime);
   var year = time.getFullYear();  //年
   var month = time.getMonth();  //月
   if (month < 10) {
     month = "0" + month;
   }
   var date = time.getDate();  //日
   if (date < 10) {
     date = "0" + date;
   }
   var hour = time.getHours();  //小时
   var minute = time.getMinutes();  //分钟
   if (minute < 10) {
     minute = "0" + minute;
   }
   return {"year": year,"month": month,"date": date,"hour": hour,"minute": minute};
 }
/**
 * jquery函数
 */
var resourceId = getUrlParam("resourceId");

$(function(){
	//需要默认执行一个函数，来第一次显示该页面
	$("span.navlist-img3").addClass("active");

	$("#resourceId").val(resourceId);
    var res_id = document.getElementById("resourceId").value;

    //资源详情数据绑定
    var dataArea = new Object();
    dataArea.center1 = "#resourceDetailId";
    dataArea.center2 = "#centerCon2";
    dataArea.center3 = "#centerCon3";
    dataArea.flag = "loadResourceDetail";
    loadResourceDetail(resourceId,dataArea);
    loadResEventBoll(resourceId);

	//点击“编辑”，跳转到资源增加页面，修改该资源信息
	$("#editId").click(function(){
//		window.location.href = assetHtml+"?resourceId="+resourceId+"&flag=edit";
		//需求：跳转到新建页面保存后需在该页面将参数带回来
		window.location.href = assetHtml+window.location.search+"&flag=edit";
	});
	//点击“复制”，跳转到资源增加页面，复制该资源信息
    $("#resourceCopyId").click(function(){
//  	window.location.href = assetHtml+"?resourceId="+resourceId+"&flag=copy";
		var searchUrlParam=nextHandUrlParamF(preHandUrlParamF());
//		console.log(searchUrlParam);
		window.location.href=assetHtml+"?resourceId="+resourceId+"&"+searchUrlParam+"&flag=copy";
		//window.location.href = assetHtml+window.location.search+"&flag=copy";
    });
    //点击附件
    $("[data-bind='resFileCount']").click(fileClick);
    //点击合同名称
    $("[data-bind='contract_name']").click(contractClick);
    //点击供应商名称
//    $("[data-bind='sale_name']").click(saleClick);
    //点击返回上一页
    $("span.container-right-title-back").click(function(){
    	var isResList = getUrlParam("isResList");
    	var param = preHandUrlParamD();
    	var paramUrl = nextHandUrlParamD(param);
    	if(null != isResList && 0 == isResList){
//    		console.log(window.location.href);
    		window.location.href = lastThirtyAssetHtml+"?"+paramUrl;
    	}
    	if(null==isResList&&null==isResList){
    		window.location.href = lastThirtyAssetHtml;
    	}
    });
    //点击打印弹框里面的方框，选择打印选项
    $('.modal-body-choose').on("click",".modal-body-chooseItem",chosePrint);
    //点击删除操作
    var deleteCon = document.getElementById("delResDetail");
    deleteCon.onclick = function () {
        var delConfirm = document.getElementById("delConfirm");
        $("#pupDelete").modal('show');
        delConfirm.onclick = function () {
            $("#pupDelete").modal('hide');
            delResDetail(resourceId);
        }
    }

    //点击移动操作
    var moveRes = document.getElementById("res_move");
    moveRes.onclick = function () {
        $("#moveRes").modal('show');
        var classify_select = creatClassifyTree("move-tree","move-menu","move","moveCode",getClassifyDataUrl,resourceId);
        var setClassifyConfirm = document.getElementById("setClassifyConfirm");

        setClassifyConfirm.onclick = function () {

            var classifyId = document.getElementById("moveCode").value;
            if("" != classifyId){
                $("#moveInfo").modal('show');
                var moveClassifyConfirm = document.getElementById("moveClassifyConfirm");

                moveClassifyConfirm.onclick = function () {
                    if("" != classifyId){
                        $("#moveInfo").modal('hide');
                        $("#moveRes").modal('hide');
                        res_moveClassify(resourceId,classifyId);
                    }else{
                        alert("请选择分类");
                    }
                }
            }else{
                alert("请选择分类！");
            }
        }
    }

    //点击加载部门菜单
    var detpMenu = creatTree("department-tree","department-menu","department","departmentCode",departmentDataUrl);

    //资产页面点击更新操作
    var resDetailPageUpdate = document.getElementById("resDetailPageUpdate");
    resDetailPageUpdate.onclick = function () {
        //console.log("123");
        //获取重要性参数
        var importanceSelect = document.getElementById("importanceId");
        var importanceValue = importanceSelect.options[importanceSelect.selectedIndex].value;
        //获取资产状态参数
        var statusSelect = document.getElementById("resource_useStatus");
        var statusValue = statusSelect.options[statusSelect.selectedIndex].value;
        //获取地点参数
        var placeValue = document.getElementById("resource_deploy_location").value;
        //获取部门参数
        var deptValue = document.getElementById("departmentCode").value;
        //获取使用人参数
        var userSelect = document.getElementById("resDetailUser");
        var userValue = userSelect.options[userSelect.selectedIndex].value;
        //获取责任人参数
        var managerSelect = document.getElementById("resDetailManager");
        var managerValue = managerSelect.options[managerSelect.selectedIndex].value;
        //console.log("///importanceValue="+importanceValue+"///statusValue="+statusValue+"///placeValue="+placeValue);
        //console.log("///deptValue="+deptValue+"///userValue="+userValue+"///managerValue="+managerValue);
        updateResInfo(resourceId,importanceValue,statusValue,placeValue,deptValue,userValue,managerValue,dataArea);
    }

    //点击打印操作
//  var printResInfo = document.getElementById("printBtn");
//  printResInfo.onclick = function () {
//      $("#print").modal('show');
//  }

    //loadUpdateInfo();
    //点击属性(左侧)
    $(".container-left-item1").on("click",function(){eLeftClass("container-left-item1","infoWrap-resource")});
    //点击历史(左侧) && 置顶历史信息
    $(".container-left-item6,.conHistory-content-toTop").on("click",function(){assetHistoryClick(assetHistoryDeal,0)});
    // 点击历史-前一条
    $(".conHistory-content-right-top.active").on("click",function(){
      if ($(this).hasClass("active")) {
        assetHistoryClick(assetHistoryDeal,-1)
      }

    });
    // 点击历史-后一条
    $(".conHistory-content-right-bottom.active").on("click",function(){
      if ($(this).hasClass("active")) {
        assetHistoryClick(assetHistoryDeal,1)
      }
    });

});

//获取url中的参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}

/**
 * 删除操作
 * */
function delResDetail(res_id){
    $.ajax({
        traditional: true,
        url:res_deleteUrl,
        dataType:"json",
        type:'POST',
        data:{ids:res_id},
        contentType:'application/x-www-form-urlencoded; charset=UTF-8',//防止乱码
//        complete: onComplete,
        success: function (data) {

            //登录信息失效，ajax请求静态页面拦截
            onComplete(data);

            if ("true" == data.code) {
                $("#tipMsg").addClass("active").html(data.msg).show();
            } else {
                $("#tipMsg").addClass("active").html(data.msg).show();
            }
            function hideMsg(){
                $("#tipMsg").addClass("active").html(data.msg).hide()
            }
            setTimeout(hideMsg,2000);

            function laterRun(){
            	window.location.href = lastThirtyAssetHtml+"?mark=8"
            }
            setTimeout(laterRun,2000);
        },
        error:function(XMLHttpRequest){
			error_500(XMLHttpRequest.responseText);
		}
    });
}

/**
 * 移动分类操作
 * */
function res_moveClassify(resourceId,classifyId){

    $.ajax({
        traditional: true,
        url:res_moveClassifyUrl,
        dataType:"json",
        type:'POST',
        data:{resourceId:resourceId,classifyId:classifyId},
        contentType:'application/x-www-form-urlencoded; charset=UTF-8',//防止乱码
//        complete: onComplete,
        success: function (data) {

            //登录信息失效，ajax请求静态页面拦截
            onComplete(data);

            if ("true" == data.code) {
                $("#tipMsg").addClass("active").html(data.msg).show();
            } else {
                $("#tipMsg").addClass("active").html(data.msg).show();
            }
            function hideMsg(){
                $("#tipMsg").addClass("active").html(data.msg).hide()
            }
            setTimeout(hideMsg,2000);
        },
        error:function(XMLHttpRequest){
			error_500(XMLHttpRequest.responseText);
		}
    });
}

/**
 * 资产打印操作
 * */
function printResDetail(resourceId){
	$.ajax({
		url:resourceDetailUrl,
		type:"get",
		data:{"resourceId":resourceId},
		dataType:"json",
//		complete: onComplete,
		success:function(data){

            //登录信息失效，ajax请求静态页面拦截
            onComplete(data);

//			console.log(data);
		},
		error:function(XMLHttpRequest){
			error_500(XMLHttpRequest.responseText);
		}
	})
}

//合同ID
var contractId = '';
var test = '';
/*点击打印键*/
$('#printBtn').click(function () {

	$("i.classRe").removeClass("active");
	$("i.classRe:first").addClass("active");

//	var dataArea = new Object();
//    dataArea.center1 = "#conright1";
//    dataArea.center2 = "#conright2";
//    dataArea.center3 = "#conright3";
//    dataArea.flag = "";
//    loadResourceDetail(resourceId,dataArea);
	var dataArea1 = new Object();
    dataArea1.center1 = "#conright1";
    dataArea1.center2 = "#conright2";
    dataArea1.center3 = "#conright3";
    dataArea1.flag = "";
	loadResourceDetail(resourceId,dataArea1);
    $("#print").modal("show");

    $('.modal-body-everyItem').hide();
    $('.infoWrap-resource').show();
    contractId = $("[data-bind='resource_contract_id']").val();

    $.ajax({
		url:putContractUrl,
		type:"get",
		data:{"contractId":contractId},
		dataType:"json",
		success:function(data){

            //登录信息失效，ajax请求静态页面拦截
            onComplete(data);

//			console.log(data);
			$('#contractUL').render(data.data);
		},
		error:function(XMLHttpRequest){
			error_500(XMLHttpRequest.responseText);
		}
	})

});
/**
 * 点击打印弹框里面的方框，选择打印选项
 */
function chosePrint(){
    	var checkedFlag = $(this).find("i").hasClass('active');
    	var idx = $(this).index()-1;
    	if(checkedFlag){
    		$(this).find("i").removeClass('active');
    		$('.modal-body-everyItem').eq(idx).hide();
    	}else{
    		$(this).find("i").addClass('active');
    		$('.modal-body-everyItem').eq(idx).show();
    	}
    }
/**
 *  点击打印。跳到另一个页面上显示打印预览
 */
$('#printDetail').click(function(){
	var canPrint = 0;
	var contractId = '';
	var printFlag = "";
	if($("#res_info").hasClass("active")){
		printFlag += "&res_info=1";
		canPrint++;
	}else{
		printFlag += "&res_info=2";
	}
	if($("#res_belong").hasClass("active")){
		printFlag += "&res_belong=1";
		canPrint++;
	}else{
		printFlag += "&res_belong=2";
	}
	if($("#res_relation").hasClass("active")){
		printFlag += "&res_relation=1";
		canPrint++;
	}else{
		printFlag += "&res_relation=2";
	}
	if($("#res_contract").hasClass("active")){
		printFlag += "&res_contract=1";
		canPrint++;
		contractId = $("[data-bind='resource_contract_id']").val();
	}else{
		printFlag += "&res_contract=2";
	}
	if($("#res_cost").hasClass("active")){
		printFlag += "&res_cost=1";
		canPrint++;
	}else{
		printFlag += "&res_cost=2";
	}
	if($("#res_history").hasClass("active")){
		printFlag += "&res_history=1";
		canPrint++;
	}else{
		printFlag += "&res_history=2";
	}
	if(canPrint == 0){
		$("#pupDelete2").modal("show");
	}else{
		window.open("printResDetail.html?resourceId="+resourceId+'&contractId='+contractId+printFlag);
	}

//	$("#conright1").jqprint({
//		debug: false,
//		importCSS: true,
//		printContainer: true,
//		operaSupport: true,
//	});
});


/**
 * 资产详情信息更新操作
 * */
function updateResInfo(resourceId,importanceValue,statusValue,placeValue,deptValue,userValue,managerValue,dataArea){
	
    $.ajax({
        traditional: true,
        url:updateMainResInfoUrl,
        dataType:"json",
        type:'POST',
        data:{resourceId:resourceId,importanceId:importanceValue,resStatusId:statusValue,place:placeValue,deptId:deptValue,userId:userValue,managerId:managerValue},
        contentType:'application/x-www-form-urlencoded; charset=UTF-8',//防止乱码
//        complete: onComplete,
        success: function (data) {
//			console.log(data);
            //登录信息失效，ajax请求静态页面拦截
            onComplete(data);

            if ("true" == data.code) {
                $("#tipMsg").addClass("active").html(data.msg).show();
            } else {
                $("#tipMsg").addClass("active").html(data.msg).show();
            }
            function hideMsg(){
                $("#tipMsg").addClass("active").html(data.msg).hide()
            }
            setTimeout(hideMsg,2000);

            loadResourceDetail(resourceId,dataArea);
        },
        error:function(XMLHttpRequest){
			error_500(XMLHttpRequest.responseText);
		}
    });
}

/**
 *  加载需要更新的下拉数据
 * */
function loadUpdateInfo() {

    var de = {
        charge_person_name: {
            value: function () {
                return this.id;
            }
        },
        use_person_id_name: {
            value: function () {
                return this.id;
            }
        }
    };
    //参数重要性更新绑定
    $("#importDiv .btn").unbind('click').click(function () {
        //获取重要性参数
        var importValue = document.getElementById("importanceId").value;

        $("#importanceId").render(importanceData,importanceValue);
        $('#importanceId').selectpicker('val',importValue);
        $('#importDiv .selectpicker').selectpicker('refresh');
    });
    //资产状态更新绑定
    $("#resUseStaDiv .btn").unbind('click').click(function () {
        //获取资产状态参数
        var statusValue = document.getElementById("resource_useStatus").value;

        $("#resource_useStatus").render(resStatusData,resStatusValue);
        $('#resource_useStatus').selectpicker('val',statusValue);
        $('#resUseStaDiv .selectpicker').selectpicker('refresh');
    });
    //使用人更新绑定
    $("#resUser .btn").unbind('click').click(function () {
        //获取使用人参数
        var userValue = document.getElementById("resDetailUser").value;

        var thisHelp = $(this).siblings("select");
        //获取flag，区分获取查找哪个
        var flag = thisHelp.attr("name");
        $.ajax({
            url: loadResourceHelpUrl,
            type: "get",
            data: {"flag": flag},
            dataType: "json",
            success: function (result) {

                //登录信息失效，ajax请求静态页面拦截
                onComplete(result);

                if (result.status == successReturn) {
                    var data = result.data;
                    //往该下拉选中绑定数据
                    //切换update和add的class
                    thisHelp.render(data, de);
                    thisHelp.selectpicker("val",userValue);
                    $('#resUser .selectpicker').selectpicker('refresh');
                }
            },
            error:function(XMLHttpRequest){
    			error_500(XMLHttpRequest.responseText);
            }
        });
    });
    //责任人更新绑定
    $("#resManager .btn").unbind('click').click(function () {
        //获取责任人参数
        var managerValue = document.getElementById("resDetailManager").value;

        var thisHelp = $(this).siblings("select");
        //获取flag，区分获取查找哪个
        var flag = thisHelp.attr("name");
        $.ajax({
            url: loadResourceHelpUrl,
            type: "get",
            data: {"flag": flag},
            dataType: "json",
            success: function (result) {

                //登录信息失效，ajax请求静态页面拦截
                onComplete(result);

                if (result.status == successReturn) {
                    var data = result.data;
                    //往该下拉选中绑定数据
                    //切换update和add的class
                    thisHelp.render(data, de);
                    thisHelp.selectpicker("val",managerValue);
                    $('#resManager .selectpicker').selectpicker('refresh');
                }
            },
            error:function(XMLHttpRequest){
                error_500(XMLHttpRequest.responseText);
            }
        });
    });
}

$('.selectpicker').selectpicker({noneSelectedText:' '});

//详情页面的点击滚动
$('.imgDown').click(function(){
	$('.infoWrap-history-list').animate({
		top: '-123px'
	},1000);
	$('ul.last').removeClass('last').next().addClass('last');
})

//$('.imgUp').click(function(){
//	var toTop = $('.infoWrap-history-list').offset().top + 123 +'px';
//	console.log(toTop);
//	$('.infoWrap-history-list').animate({
//		top: toTop
//	},1000);
//	$('ul.last').removeClass('last').next().addClass('last');
//})
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
/**类似preHandUrlParamF(资产详情页复制功能使用,不记录页数)**/
function preHandUrlParamF(){
	var pp = new Object();
	var mark = getUrlParam("mark");
	if(null == mark){
	    pp.mark = 7;
	}else{
		pp.mark = mark;
	}
//	var page = getUrlParam("page");
//	if(null == page){
//		pp.page = 1;
//	}else{
//		pp.page = page;
//	}
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
/**类似于nextHandUrlParamD (供资产详情复制功能使用,不记录页数)**/
function nextHandUrlParamF(fc){
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
//	var page = fc.page;
//	if(null == page){
//		page = 1;
//	}
//	urlParam += "&page="+page;
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
