var zTree1 = null;  //树形插件对象1(部门)
var zTree2 = null;  //树形插件对象2(人员)
var zTree3 = null;  //树形插件对象3(添加员工弹窗)
var zTree4 = null;  //树形插件对象4(添加员工弹窗)
var companyObj = null;  //树插件-根元素

/*all: 切换左侧栏*/
function changeLeft(index) {
    if(this.tagName==undefined){  /* 初始化左侧栏 */
        index = Number(getUrlParamH("leftPos"));
    }else if(this.tagName == "LI"){  /* 点击左侧栏 */
        index = $(this).index();
    }
    /* 页面切换 */
    $('.left-item' + index).addClass('active').siblings().removeClass('active');
    $('.right-content' + index).removeClass('dn').siblings('.right-content').addClass('dn');
    $('.title-name').html($('.left-item' + index).text());
    loadEnterpriseInfo()
    /* 内容切换 */
    switch(index){
        case 0:
        // url中没有标识时
        case 1:
            loadEnterpriseInfo();
            break;
        case 2:
			Maintained();
            break;
        case 3:
			 var paramobj;
            //加载人员管理树模型
			DepartmentInfornation()
 			//加载部门树
			creatTree("department-tree", "department-menu", "department", "departmentCode",departmentDataUrl, true);
			//初次加载
			paramobj=selectorfinder()
			//加载新员工
			NewEmployee(paramobj)
			//模糊查询
	  		search();
            break;
        case 4:
            break; 
    }
}

/* section1: 加载信息 */
function loadEnterpriseInfo(){
    $.ajax({
        url: getEnterpriseInfoUrl,
        type: 'get',
        data: { },
        dataType: 'json',
        success: function(result){
            //登录信息失效，ajax请求静态页面拦截
            onComplete(result);
            if (result.status==1) {
            	$(".Company-department-management").html(result.data.name+'部门管理');
                $(".right-content1").render(result.data);
                $(".right-content1-list1").render(result.data.userinfo);
                $(".right-content1-list2").render( result.data.person ,{
                    sex: {text: function(e){return (this.sex==38)?"男":"女";}},
                    name: {"data-id": function(e){return this.id;}}
                });
                
                /* 设置<textarea>高度样式 */
                initTextareaHeight();
            }
        },
        error: function(XMLHttpRequest){
            error_500(XMLHttpRequest.responseText);
        }
    });

    /*section1:　[编辑键]*/
    $('#editBtn').off().on("click",editEnterpriseInfo);
    /* 更换登记人 */
    $('#changeRegistrantBtn').off().on("click",changeRegistrant);
}

/*section1: info/editing 切换 */
function editEnterpriseInfo() {
    var $section1list1 = $(".right-content1-list1");

    $section1list1.addClass("editing");
    $section1list1.find("input:not(.protect),textarea").attr("disabled",false);
    /* 保存源 */
    $section1list1.find("input,textarea").each(function(i,val){
        $(val).attr("data-reset", val.value);
    });

    /* [保存键] */
    $section1list1.find(".saveBtn").off().on("click", function(){
        var seralizeStr = $("#rightContent1Info").serialize(); // form数据url化
        seralizeStr = decodeURIComponent(seralizeStr,true);  // 解析汉字

        $.ajax({
            url: updateEnterpriseInfoUrl,
            type: "post",
            data: seralizeStr,
            success: function(result){
                //登录信息失效，ajax请求静态页面拦截
                onComplete(result);
                if (result.status == 1) {
                    loadEnterpriseInfo();
                    $section1list1.removeClass("editing").find("input,textarea").attr("disabled", true);
                } else {
                    outBoxCloseRes(result.msg, false);
                }
            },
            error: function(XMLHttpRequest){
                error_500(XMLHttpRequest.responseText);
            }
        });
    });

    /* [取消键] */
    $section1list1.find(".cancelBtn").off().on("click",function(){
        $section1list1.removeClass("editing");
        /* 恢复源 */
        $section1list1.find("input,textarea").each(function(i,val){
            $(val).val( $(val).attr("data-reset") ).attr("disabled",true);
        });
    });
}

/* section1: 更换登记人 */
function changeRegistrant() {
    $changeRegistrantModal = $('#changeRegistrantModal');

    $changeRegistrantModal.modal('show');
    $.get(loadPersonManagerListUrl,{seachText: "",departmentId: 0} ,function(result){
        //登录信息失效，ajax请求静态页面拦截
        onComplete(result);
        if(result.status==1){
            $select = $changeRegistrantModal.find("select");
            $select.render(result.data,{
                "person_name": {value: function(e){return this.id;}}
            });
            $select.selectpicker("refresh");
            /* 设置默认值 */
            $select.val( $("#registrantName").attr("data-id") );
            $select.selectpicker('refresh');
        }else{
            outBoxCloseRes(result.msg, false);
        }
    });
    /* [保存键] */
    $changeRegistrantModal.find(".saveBtn").off().on("click", function(){
        $.ajax({
            url: updateBusinesInfoUrl,
            type: "post",
            data: {
                id: $("#rightContent1Info").find("input[name=id]").val(),
                register_id: $changeRegistrantModal.find("select").val()
            },
            dataType: "json",
            success: function(result){
                //登录信息失效，ajax请求静态页面拦截
                onComplete(result);
                
            },
            error: function(XMLHttpRequest){
                error_500(XMLHttpRequest.responseText);
            }
        });
    });
}

/* section2:加载部门管理列表; section3:加载部门管理列表 */

//function loadDepartmentList( flag ){
//  var listData = [];  /* 部门列表数据 */
//  $.get(loadDepartmentListUrl, function (result) {
//      //登录信息失效，ajax请求静态页面拦截
//      onComplete(result);
//      console.log(result)
//      if (result.status == 1) {
//          $.each(result.data, function (i, val) {
//              if((flag==1) && (val.parent_id==0)){
//                  companyObj = val;
//                  $(".right-content2 .company-name").text(val.name);
//                  return true;  /* 等效continue */
//              }
//              var itemData = {};
//              itemData.id = val.id;
//              itemData.pId = val.parent_id;
//              itemData.name = val.name;
//              itemData.function = val.function;
//              listData.push(itemData);
//          });
//
//          if (flag == 1) {
//              initTree1(listData);
//          } else if (flag == 2) {
//              initTree2(listData);
//          } else if (flag == 3) {
//              initTree3(listData);
//          } else if (flag == 4) {
//              initTree4(listData);
//          }
//
//      } else {
//          outBoxCloseRes(result.msg, false);
//      }
//  });
//}

/* section2: 创建新部门modal */
//function createNewDepartModal(setParam){
//  var $createNewDepartModal = $("#createNewDepartmentModal");
//  var $createNewDepartModalSave = $createNewDepartModal.find("button.save");
//  $createNewDepartModal.find("input,textarea").val("");
//  $createNewDepartModal.find(".modal-name").text(setParam.title);
//  $createNewDepartModal.modal("show");
//
//  if(setParam.class==1||setParam.class==2){  /* 1:创建新部门; 2:新建子部门 */
//      var parentId = setParam.parentId; /* 新创建的部门在根部 */
//      $createNewDepartModalSave.off().on("click",function(){
//          $.ajax({
//              url: createDepartmentNewUrl,
//              type: 'POST',
//              data: {
//                  parent_id: setParam.parentId,
//                  name: $createNewDepartModal.find("input").val(),
//                  function: $createNewDepartModal.find("textarea").val(),
//              },
//              dataType: 'json',
//              success: function(result){
//                  //登录信息失效，ajax请求静态页面拦截
//                  onComplete(result);
//                  if(result.status==1){
//                      $createNewDepartModal.modal("hide");
//                      loadDepartmentList(1); /* 1:zTree1; 2:zTree2; 3:zTree3; */
//                  }else{
//                      outBoxCloseRes(result.msg, false);
//                  }
//              },
//              err: function(XMLHttpRequest){
//                  error_500(XMLHttpRequest.responseText);
//              }
//          });
//      });
//  }else if(setParam.class==3){  /* 3:编辑部门 */
//      $createNewDepartModal.find("input").val(setParam.name);
//      $createNewDepartModal.find("textarea").val(setParam.function);
//      $createNewDepartModalSave.off().on("click",function(){
//          $.ajax({
//              url: updateDepartmentNewUrl,
//              type: 'POST',
//              data: {
//                  parent_id: setParam.parentId,
//                  id: setParam.id,
//                  name: $createNewDepartModal.find("input").val(),
//                  function: $createNewDepartModal.find("textarea").val(),
//              },
//              dataType: 'json',
//              success: function(result){
//                  //登录信息失效，ajax请求静态页面拦截
//                  onComplete(result);
//                  if(result.status==1){
//                      $createNewDepartModal.modal("hide");
//                      /* 1:zTree1; 2:zTree2; 3:zTree3; 4:zTree4 */
//                      loadDepartmentList(2); 
//                  }else{
//                      outBoxCloseRes(result.msg, false);
//                  }
//              },
//              err: function(XMLHttpRequest){
//                  error_500(XMLHttpRequest.responseText);
//              }
//          });
//      });
//  }
//}

//树属性的定义
var setting = {
	//页面上的显示效果
	view: {
	        addHoverDom: addHoverDom, //当鼠标移动到节点上时，显示用户自定义控件
	        removeHoverDom: removeHoverDom, //离开节点时的操作
	        dblClickExpand: false
	    },
	    edit: {
	        enable: false, //单独设置为true时，可加载修改、删除图标 (需求：修改和删除单独处理)
	    },
	    data: {
	        simpleData: {
	            enable:true,
	        }
	    },
	    callback: {
	    	beforeExpand:beforeExpand,//展开前事件
//	    	beforeRemove:beforeRemove,//删除前事件
	    	beforeRename:beforeRename,//删除前事件
	    	beforeClick:function(treeId, treeNode){$('.opreationBox').remove()}, // 清除三个按钮:先全部删除再添加
	        onClick: clickNode, //单击事件
	        onExpand: onExpand,//展开事件,
	        onCollapse:onCollapse,//折叠事件
	        onNodeCreated:onNodeCreated//创建节点后事件
	}
}   
//载入部门管理Ztree
function Maintained(){
	$.ajax({
		url:loadDepartmentListUrl,
		type:"post",
		data:{},
		dataType:"json",
		success:function(result){
			//登录信息失效，ajax请求静态页面拦截
		    onComplete(result);
//		    console.log(result);
		    $("#createNewDepartmentName").html(result.data[0].id);
			//Ztree绑定数据
			function zNodes(){
				var zNode='';
				zNode="[";
				if(null != result.data){
					for(let i=0;i<result.data.length;i++){
						if(result.data[i].parent_id==null){
						    zNode += "{id:"+result.data[i].id+",pId:0,name:'"+result.data[i].name+"',function:'"+result.data[i].function+"'},";
						}else{
						    zNode += "{id:"+result.data[i].id+",pId:"+result.data[i].parent_id+",name:'"+result.data[i].name+"',function:'"+result.data[i].function+"'},";
						}
					}
					if(result.data.length > 1 )
						zNode = zNode.substring(0, zNode.length-1);
						zNode += "]";
						var testOne = eval("(" + zNode + ")");
						return testOne; 
					}	
				}
			    var zTree = $.fn.zTree.init($("#tree"), setting, zNodes());
			  	$("#createNewDepartment").bind("click", { isParent: true }, addNode);
			},
			error:function(XMLHttpRequest){
				error_500(XMLHttpRequest.responseText);
			}
		});
	}
//添加hover事件
function addHoverDom(treeId, treeNode) {
   	var sObj = $("#" + treeNode.tId + "_span"); //获取节点信息
    if ($("#addBtn_"+treeNode.tId).length>0||$("#editBtn_"+treeNode.tId).length>0||$("#removeBtn_"+treeNode.tId).length>0) return;
    var str = "<span class='opreationBox fr'><span class='button add' id='addBtn_" + treeNode.tId + "' title='新建子部门' onfocus='this.blur();'></span><span class='button edit' id='editBtn_" + treeNode.tId + "' title='编辑' onfocus='this.blur();'></span><span class='button remove' id='removeBtn_" + treeNode.tId + "' title='删除' onfocus='this.blur();'></span></span>"; //定义添加,编辑,删除按钮
    $(".opreationBox span").css("border",'none');
    sObj.after(str); //加载添加,编辑，删除按钮
    $("#tooltipdiv").remove();
    var addBtn = $("#addBtn_"+treeNode.tId);  //每一节点的添加按钮
	var editBtn=$("#editBtn_"+treeNode.tId);  //每一节点的编辑按钮
	var removeBtn=$("#removeBtn_"+treeNode.tId);//每一节点的移除按钮
//	console.log(treeNode)
	 if(treeNode.children!==undefined){
		$("span.remove").remove();
	}
	 if(treeNode.children!==undefined&&treeNode.pId==null){
	 	$("span.edit").remove();
	 	$("span.remove").remove();
	 }
	var zTree = $.fn.zTree.getZTreeObj("tree");
    //绑定添加事件，并定义添加操作
    if (addBtn) addBtn.on("click", function(){
        $('#createNewDepartmentModal .modal-header .modal-name').html('新建子部门');
        $('#createNewDepartmentModal').modal('show');
        var treeNodeId=treeNode.id;
        $('#createNewDepartmentModalSave').unbind('click').click(function(){
         	var name=$("#modalInptu").val();//添加name这个节点的值
         	var function1 =$(".modalTextArea").val();//添加描述内容
         	var	Ztreea=zTree.addNodes(treeNode, {id:treeNode.id, pId:treeNode.pId, name:name}); //页面上添加节点
			$.ajax({
				url:createDepartmentNewUrl,
				type:"post",
				data:{parent_id:Ztreea[0].id,name:name,function:function1},
				dataType:"json",
				success:function(result){
					//登录信息失效，ajax请求静态页面拦截
					onComplete(result);
					if(result.status == 1){
						$("#tipMsg").addClass("active").html("添加成功").show();
							function tipHide(){
								$("#tipMsg").hide();
							}
							setTimeout(tipHide,2000);
					}else{
						$("#errorBtn").modal('show');
						$("#errorInfo").html(result.msg)
					}
					//重新载入部门管理
					Maintained();		
				    $('#createNewDepartmentModal').modal('hide');		
				},
				error:function(XMLHttpRequest){
					error_500(XMLHttpRequest.responseText);
				}
			});
 		})
    });
    
    //点击创建新部门按钮创建，只能创建最高父节点的子节点
    $("#createNewDepartment").on("click", function(){
    	var name=$("#modalInptu").val('');//添加name这个节点的值
        var function1 =$(".modalTextArea").val('');//添加描述内容
    	$('#createNewDepartmentModalSave').off().on("click",function(){
    		var name=$("#modalInptu").val();//添加name这个节点的值
         	var function1 =$(".modalTextArea").val();//添加描述内容
         	var	Ztreea=zTree.addNodes(treeNode, {id:treeNode.id, pId:$("#createNewDepartmentName").html(), name:name}); //页面上添加节点
			    $.ajax({
					url:createDepartmentNewUrl,
					type:"post",
					data:{parent_id:$("#createNewDepartmentName").html(),name:name,function:function1},
					dataType:"json",
					success:function(result){
						//登录信息失效，ajax请求静态页面拦截
//						console.log(result)
					    onComplete(result);
						if(result.status == 1){
							$("#tipMsg").addClass("active").html("添加成功").show();
							function tipHide(){
								$("#tipMsg").hide();
							}
							setTimeout(tipHide,2000);
						}else{
							$("#errorBtn").modal('show');
							$("#errorInfo").html(result.msg)
						}
						//重新载入部门管理
						  Maintained();	
			          	  $('#createNewDepartmentModal').modal('hide');		
					},
					error:function(XMLHttpRequest){
						error_500(XMLHttpRequest.responseText);
					}	
				});
 			})
    	});
//  //绑定编辑事件
    if (editBtn) {
        editBtn.on("click", function(){
			$('#createNewDepartmentModal .modal-header .modal-name').html('编辑');
		    $('#createNewDepartmentModal').modal('show');
		    var name1=$("#modalInptu").val(treeNode.name);//绑定name这个节点的值
       	 	var function2 =$(".modalTextArea").val(treeNode.function);//绑定描述内容
		    $('#createNewDepartmentModalSave').off().on("click",function(){
		        var treeNodepId=treeNode.pId;
		        var treeNodeId=treeNode.id;
				var name1=$("#modalInptu").val();//添加name这个节点的值
       	 		var function2 =$(".modalTextArea").val();//添加描述内容
         	 	if(treeNodepId==null){
         	 		treeNodepId=0
         	 	}
			$.ajax({
				url:updateDepartmentNewUrl,
				type:"post",
				data:{parent_id:treeNodepId,id:treeNodeId,name:name1,function:function2},
				dataType:"json",
				success:function(result){
					//登录信息失效，ajax请求静态页面拦截
					onComplete(result);
					if( result.status == 1){
						$("#tipMsg").addClass("active").html("修改成功").show();
						function tipHide(){
							$("#tipMsg").hide();
						}
						setTimeout(tipHide,2000);
						$('#createNewDepartmentModal').modal('hide');
						//重新载入部门管理
						Maintained(); 
					}else{
						$("#errorBtn").modal('show');
						$("#errorInfo").html(result.msg)
					}
					
				},
				error:function(XMLHttpRequest){
					error_500(XMLHttpRequest.responseText);
				}
			});
		})
    });
}
    //绑定移除事件
	if (removeBtn) removeBtn.on("click", function(){
	    $('#pupDelete').modal('show');
		var treeNodeId=treeNode.id;
	    $('#delConfirm').off().on("click",function(){
	        if(treeNode.children!==undefined){
		        $("#pupDelete").modal('hide');
				$("#errorBtn").modal('show');
				$("#errorInfo").html('该部门下还有子部门，不能删除');
				return false;
			}
	        $.ajax({
				url:deleteDepartmentNewUrl,
				type:"post",
				data:{departmentId:treeNodeId},
				dataType:"json",
				success:function(result){
					//登录信息失效，ajax请求静态页面拦截
					onComplete(result);
					if( result.status==1){
						$("#tipMsg").addClass("active").html("移除成功").show();
						function tipHide(){
							$("#tipMsg").hide();
						}
						setTimeout(tipHide,2000);
						$('#createNewDepartmentModal').modal('hide');
						var treeObj = $.fn.zTree.getZTreeObj("tree");
		 				var nodes = treeObj.getSelectedNodes();
						for (var i=0, l=nodes.length; i < l; i++) {
							treeObj.removeNode(nodes[i]);
						}
			        	//重新载入部门管理
						Maintained();
					}else{
						$("#pupDelete").modal('hide');
						$("#errorBtn").modal('show');
						$("#errorInfo").html(result.msg);
						return false;
					}
				},
				error:function(XMLHttpRequest){
					error_500(XMLHttpRequest.responseText);
				}
			});
			$('#pupDelete').modal('hide');
			setLeftHeight();
	      })
	   	});
    };
//添加remove事件    
function removeHoverDom(treeId, treeNode){
    $target = $("#"+treeNode.tId+"_a");
    if($target.hasClass("curSelectedNode")){
        return false;
    }else{
        $target.find('.opreationBox').remove();
        $target.find("#addBtn_"+treeNode.tId).unbind().remove(); //移除新建按钮
        $target.find('#editBtn_'+treeNode.tId).off().remove(); //移除编辑按钮
        $target.find('#removeBtn_'+treeNode.tId).off().remove(); //移除删除按钮
    }
};

//重命名前事件
function beforeRename(treeId, treeNode, newName, isCancel) {
    if (newName.length == 0) {
       return false;
    }
   	 return true;
}

//展开前事件
function beforeExpand(treeId, treeNode) {
	setLeftHeight();
	var pNode = null;
	var treeNodeP = null;
	if(!pNode) {
		singlePath(treeNode, treeId);
	}
}
//点击事件
function clickNode(e,treeId,treeNode){
    setLeftHeight();
    var zTree = $.fn.zTree.getZTreeObj("tree");
//	zTree.expandNode(treeNode);
}
   	var newCount=1;
//增加节点事件
function addNode(e){
    $('#createNewDepartmentModal .modal-header .modal-name').html('创建新部门');
	$('#createNewDepartmentModal').modal('show');
	$('#createNewDepartmentModalSave').unbind('click').click(function(){
		var isParent = e.data.isParent,
    	treeNode = zTree.addNodes(null, { id: (100 + newCount), pId: 0, isParent: isParent, name: "新父节点" + (newCount++) });
    	$('#createNewDepartmentModal').modal('hide');
	})
    setLeftHeight();
};
//展开事件
function onExpand(event, treeId, treeNode) {
	curExpandNode = treeNode;
	setLeftHeight();
}
//折叠事件
function onCollapse(){
	setLeftHeight();
}
//节点被创建事件
function onNodeCreated(){
	setTimeout(setLeftHeight,300);
}
	var curExpandNode=null;
//打开单一节点
function singlePath(newNode, treeId) {
	if(newNode === curExpandNode) return;
	var zTree = $.fn.zTree.getZTreeObj(treeId),
	rootNodes, tmpRoot, tmpTId, i, j, n;
	if(!curExpandNode) {
		tmpRoot = newNode;
		while(tmpRoot) {
			tmpTId = tmpRoot.tId;
			tmpRoot = tmpRoot.getParentNode();
		}
		rootNodes = zTree.getNodes();
		for(i = 0, j = rootNodes.length; i < j; i++) {
			n = rootNodes[i];
			if(n.tId != tmpTId) {
				zTree.expandNode(n, false);
			}
		}
	} else if(curExpandNode && curExpandNode.open) {
		if(newNode.parentTId === curExpandNode.parentTId) {
			zTree.expandNode(curExpandNode, false);
		} else {
			var newParents = [];
			while(newNode) {
				newNode = newNode.getParentNode();
				if(newNode === curExpandNode) {
					newParents = null;
					break;
				} else if(newNode) {
					newParents.push(newNode);
				}
			}
			if(newParents != null) {
				var oldNode = curExpandNode;
				var oldParents = [];
				while(oldNode) {
					oldNode = oldNode.getParentNode();
					if(oldNode) {
						oldParents.push(oldNode);
					}
				}
				if(newParents.length > 0) {
					zTree.expandNode(oldParents[Math.abs(oldParents.length - newParents.length) - 1], false);
				} else {
					zTree.expandNode(oldParents[oldParents.length - 1], false);
				}
			}
		}
	}
		curExpandNode = newNode;
};

/* section3: 加载人员列表 */






var setting3 = {
	//页面上的显示效果
	view: {
		dblClickExpand: false
	},
	edit: {
	    	enable: true //单独设置为true时，可加载修改、删除图标
		},
	data: {
	    	simpleData: {
	        	enable:true,
	    	}
		},
	callback: {
	    	onExpand: onExpandd,//展开事件,
	    	onCollapse:onCollapses,//折叠事件
	    	onClick: zTreeOnclick //单击事件
		}
	};
	//当进入页面的时候加载
	function DepartmentInfornation(){
		$.ajax({
			url:loadDepartmentListUrl,
			type:"post",
			data:{},
			dataType:"json",
			success:function(result){
				//登录信息失效，ajax请求静态页面拦截
				onComplete(result);
//				console.log(result);
				$(".addCompanyName").html(result.data[0].name);
				$(".addCompanyid").html(result.data[0].id);
		   	//Ztree绑定数据
				function zNodes3(){
					var zNode='';
					zNode="[";
					if(null != result.data){
					    for(var i=0;i<result.data.length;i++){
					      	if(result.data[i].parent_id==null){
					        	zNode += "{id:"+result.data[i].id+",pId:0,name:'"+result.data[i].name+"'},";
					      	}else{
					        	zNode += "{id:"+result.data[i].id+",pId:"+result.data[i].parent_id+",name:'"+result.data[i].name+"'},";
					      	}
					    }
					    if(result.data.length > 1 ){
					        zNode = zNode.substring(0, zNode.length-1);
					        zNode += "]";
					        var testOne = eval("(" + zNode + ")");
//					        var newNode={id:0,name:$(".addCompanyName").html(),pId:null,open:false};
//		    				testOne.push(newNode);
					        return testOne;
					    } 
					}
				}
		   	 		var zTree3 = $.fn.zTree.init($("#tree3"), setting3, zNodes3());
			},
			error:function(XMLHttpRequest){
				error_500(XMLHttpRequest.responseText);
			}
		});
	}
	//折叠事件
	function onCollapses(){
		setLeftHeight();
	}
	//展开事件
	function onExpandd(){
		setLeftHeight();
	}
	//点击事件
	function zTreeOnclick(e, treeId, treeNode) {
		var zTree = $.fn.zTree.getZTreeObj("tree3");
//  	zTree.expandNode(treeNode);
	  	var nodes = zTree.getSelectedNodes();
//		 console.log(treeNode);
		 if($("li a").hasClass('curSelectedNode')){
		 	$("#department").attr("value",treeNode.name);
		 }
		//通过点击事件查找绑定ID
		$thisdepartmentId();
		var departmentId=treeNode.id;
		var SearchDefalut=$("#SearchDefalut").val(departmentId);
 		if(departmentId!==''||departmentId!==NULL||departmentId!==undefined){
 			var paramobj = selectorfinder();
 			paramobj.departmentId=departmentId;
 			NewEmployee(paramobj)
 		}else{
 			var paramobj = selectorfinder();
 			paramobj.departmentId=0;
 			NewEmployee(paramobj)
 		}
	}
//}
	//页面载入时加载员工信息
	function NewEmployee(paramobj){
		//添加serachText参数
		var paramobj=selectorfinder()
		$.ajax({
			traditional:true,
			url:loadPersonManagerListUrl,
			type:"POST",
			async:true,
			data:{searchText:paramobj.searchText,departmentId:paramobj.departmentId},
			dataType:"json",
			contentType:'application/x-www-form-urlencoded; charset=UTF-8',//防止乱码
			success:function(result){
				//登录信息失效，ajax请求静态页面拦截
				onComplete(result);
				console.log(result);
				if(result.status==1){	
					if(result.data.length>0){
						$("ul.right-content3-body-content").removeClass("dn")
						$(".RightContentBody").render(result.data);
						var personName = {
							person_name: {
								value: function() {
									return this.id;
								}
							}
						}
						$("#statusSelect").render(result.data,personName);
						$("#statusSelect").selectpicker('val',$('#registerId').html());
						$("#statusSelect").selectpicker('refresh')
						setLeftHeight();
					}else{
						$("ul.right-content3-body-content").addClass("dn")
					}
				}else{
					$("ul.right-content3-body-content").addClass("dn")
					$("#errorBtn").modal('show');
					$("#errorInfo").html(result.msg)
				}
			},
			error:function(XMLHttpRequest){
				error_500(XMLHttpRequest.responseText);
			}
		});	
	}
	//获取部门id
	function $thisdepartmentId(){
		$.ajax({
            type:"post",
            url:departmentDataUrl,
            async:true,
            dataType:"json",
            data:'',
            contentType:'application/x-www-form-urlencoded; charset=UTF-8',//防止乱码
            success:function(data){
//          	console.log(data)
            	if(null != data && data.length>0){
            		$.each(data, function(m,n) {
                    	if($("#department").val()==data[m].name){
                 			$("#departmentCode").attr("value",data[m].id)
                    	}
                   });	
            	}
            },
            error:function(XMLHttpRequest){
    			error_500(XMLHttpRequest.responseText);
    		}
        });
	}
	//筛选条件参数
	function selectorfinder(){
		var paramobj=new Object();
		//点击左侧查询
		var departmentId=$("#SearchDefalut").val();
		if(departmentId!==''){
			paramobj.departmentId=departmentId;
		}else{
			paramobj.departmentId=0;
		}
		//获取模糊查询条件
    	var searchText = $("#likeId").val();
    	if("" == searchText){
        	paramobj.searchText = '';
    	}else{
        	paramobj.searchText = searchText;
    	}
    		return paramobj;
	}
	//根据点击或者Enter键查询
	function search(){
    //模糊查询:回车查询
    $("#likeId").keydown(function(e){
        var currKey = 0;e = e||event;
        currKey = e.keyCode||e.which||e.charCode;
        //回车搜索
        if(currKey == 13){
            //获取模糊查询条件
            var searchText = document.getElementById("likeId").value ;
            if("" == searchText){
                $("#tipMsg").addClass("active").html("请输入查询条件").show();
                function hideMsg(){
                    $("#tipMsg").addClass("active").html("请输入查询条件").hide()
                }
                setTimeout(hideMsg,1500);
            }else{
                var paramobj = selectorfinder();
                paramobj.searchText = searchText;
                //console.log(paramObj);
                NewEmployee(paramobj);
            }
        }
    });
    //模糊查询:点击查询
  	$(".likeClass").click(function(){
        var searchText = document.getElementById("likeId").value ;
        if("" == searchText){
            $("#tipMsg").addClass("active").html("请输入查询条件").show();
            function hideMsg(){
                $("#tipMsg").addClass("active").html("请输入查询条件").hide()
            }
            setTimeout(hideMsg,1500);
        }else{
            var paramobj = selectorfinder();
            paramobj.searchText = searchText;
            NewEmployee(paramobj);
    	}
  	});
}
	//创建新员工
	function createNewEmployee(){
		var options;
				options = {
					url:createNewEmployeeUrl,
//					beforeSubmit:beforeSubmit, //提交前处理
					success:afterAddSubmit, //提交后处理
					error:function(XMLHttpRequest){
						error_500(XMLHttpRequest.responseText);
					},
					dataType:"json"
				};		
		$("#Createnewpeoples").ajaxSubmit(options);
	}
	//提交给用户提示函数
	function beforeSubmitted(){
		$('.positioninputs').blur(function(){
			if($(this).val()==''){
				$(".Namenull").addClass('active');
			}else{
				$(".Namenull").removeClass('active');
			}
		}).focus(function(){
			$(".Namenull").removeClass('active');
		});
	}
	
	//ajax提交创建新员工后函数
	function afterAddSubmit(responseText,statusText){
		//登录信息失效，ajax请求静态页面拦截
  		onComplete(responseText);
//		console.log(responseText)
  		if(responseText.status == 1){
  			var paramobj = selectorfinder();
			NewEmployee(paramobj);
  			$("#createNewpersonelModal").modal('hide');
  			$("#tipMsg").addClass("active").html("添加成功").show();
			$("#createNewpersonelModal .modal-body-row-leftText1").val('');
			$("#createNewpersonelModal #department").attr("value",'');
			function tipHide(){
				$("#tipMsg").hide();
  			}
			setTimeout(tipHide,2000);
		}else{
			$("#errorBtn").modal('show');
			$("#errorInfo").html(responseText.msg)
		}
	}
	//ajax查询单个员工信息
	function updateEmployee(updateEmployeeId){
		//查询单个员工情况
		$('#personalId').modal("show");
		$(".Namenull").removeClass('active');
		$.ajax({
			url:loadEmployeeDetailUrl,
			type:"get",
			data:{personId:updateEmployeeId},
			dataType:"json",
			success:function(result){
				//登录信息失效，ajax请求静态页面拦截
				onComplete(result);
				console.log(result);
				if(result.status==1){
					$("#personalId").render(result.data);
					$("#createNewUserModal").render(result.data);
					$("#createNewpersonelModal").render(result.data);
					$("#SexualDistinction").selectpicker('refresh')
					$("#department").attr('value',result.data.department_name);
					$("#departmentCode").attr('value',result.data.department_id);
				}else{
					$("#errorBtn").modal('show');
					$("#errorInfo").html(result.msg)
				}
			},
			error:function(XMLHttpRequest){
				error_500(XMLHttpRequest.responseText);
			}
		});	
	}
	//人员里面点击编辑内容
	function EditCancellation(){
		$("#personalId").modal('hide');
		$("#createNewpersonelModal").modal('show');
//		$(".Namenull").removeClass('active');
	}
	//点击编辑人员保存按钮
	function Editandsave(updateEmployeeId,paramobj){
		var name=$(".person_name").val();
		var oarchitecture_id=$(".oarchitecture_id").val()//部门Id
		var jobposition=$(".jobposition").val()//职位
		var telphone=$(".telphone").val();//电话
		var mobilephone=$(".mobilephone").val();//手机
		var position_email=$(".email").val();//邮箱
		var departId=$(".departId").val()
		var age=$(".age").val();
		var sex=$("#SexualDistinction").selectpicker('val');
		$.ajax({
			url:updateEmployeeUrl,
			type:"post",
			data:{id:updateEmployeeId,name:name,age:age,sex:sex,position:jobposition,oarchitecture_id:oarchitecture_id,tel:telphone,mobilephone:mobilephone,email:position_email},
			dataType:"json",
			success:function(result){
				//登录信息失效，ajax请求静态页面拦截
				onComplete(result);
//				console.log(result);	  
				if(result.status==1){
					$("#createNewpersonelModal").modal('hide');
					$("#tipMsg").addClass("active").html("修改成功").show();
					//重新加载页面
					NewEmployee(paramobj);
            		function hideMsg(){
                		$("#tipMsg").addClass("active").html("修改成功").hide()
            		}
            		setTimeout(hideMsg,1500)
				}else{
					$("#errorBtn").modal('show');
					$("#errorInfo").html(result.msg)
				}
			},
			error:function(XMLHttpRequest){
				error_500(XMLHttpRequest.responseText);
			}
		});
	}
	//点击删除员工
	function freezeEmployee(updateEmployeeId,paramobj){
		$.ajax({
			url:freezeEmployeeUrl,
			type:"post",
			data:{personId:updateEmployeeId,whetherRemove:false},
			dataType:"json",
			success:function(result){
				//登录信息失效，ajax请求静态页面拦截
				onComplete(result);
//				console.log(result);	  
				if(result.status==1){
					$("#tipMsg").addClass("active").html("删除成功").show();
					//重新加载页面
					NewEmployee(paramobj);
					$("#personalId").modal('hide');
            		function hideMsg(){
                		$("#tipMsg").addClass("active").html("删除成功").hide()
            		}
            		setTimeout(hideMsg,1500)	
				}else{
					$("#errorBtn").modal('show');
					$("#errorInfo").html(result.msg)
				}
			},
			error:function(XMLHttpRequest){
				error_500(XMLHttpRequest.responseText);
			}
		})
	}




























/*设置左侧高度*/
	function setLeftHeight() {
  	//清除人员管理(第三部分)右侧内容的高度
	  $(".right-content3-right").height("");
	  var heightLeft = $(".left").height();
	  var heightRight = $(".right").height();
	  $(".left").height(heightRight);
	    //设置人员管理(第三部分)右侧内容的高度
	  $(".right-content3-right").height(heightRight-66);
	}
	
$(function () {
    /* all */
    changeLeft(); //进入页面,设置左侧栏选中页签
    $('.left-item').click(changeLeft); /*点击,设置左侧栏选中页签*/
    $('.back').click(function(){ window.location.href = "serviceManagement.html"; }); /*返回[管理主页]*/
    $('.selectPicker').selectpicker({
        noneSelectedText: '--请选择--'
    });
    /* section2 */
	//点击部门管理
	if($(".left-item2").hasClass('active')){
	   	//载入部门管理Ztree
		Maintained();
	}
    /* section3 */
    	//点击人员管理
	   	var paramobj;
		if($(".left-item3").hasClass('active')){
	   		//载入页面
			DepartmentInfornation();
	   		//加载部门树
			creatTree("department-tree", "department-menu", "department", "departmentCode",departmentDataUrl, true);
			//初次加载
			paramobj=selectorfinder()
			//加载新员工
			NewEmployee(paramobj)
			//模糊查询
		  	search();
		}  		
		//点击创建新员工
		$('#createNewUser').on('click',function(){
			$('#createNewpersonelModal').modal('show');
			var createNewpersonelModal=$('#createNewpersonelModal');
			//点击新建的时候清空输入框里面的内容，如果未点击部门默认最大的部门以及部门id
			$(".person_name,.age,.jobposition,.telphone,.mobilephone,.email").val('');
			if($("#department").val()==''){
				$("#department").attr('value',$(".addCompanyName").html());
				$("#departmentCode").attr('value',$(".addCompanyid").html());
			}
			//姓名错误提示信息
			beforeSubmitted();
			//点击创建新员工
			$('#createNewpersonelModalSave').off().on('click',createNewEmployee);
		})	
		//点击查询单个员工内容
		$(".RightContentBody").on('click','li.personalId',function(){
			$("#personalId").modal('show');
			var updateEmployeeId=$(this).next().next().next().next().next().next().next().val();
				//查询单个员工信息
				updateEmployee(updateEmployeeId);
//				//加载部门树
//				creatTree("departmentree", "departmentMenu", "departmentry", "departmentCoder",departmentDataUrl, true);
				//点击编辑
				$("div.edit").off().on('click',function(){
				//点击编辑
				EditCancellation();
				//姓名错误提示信息
				beforeSubmitted();
				//点击保存按钮
				$("#createNewpersonelModalSave").off().on('click',function(){Editandsave(updateEmployeeId,paramobj)})
			})
			//点击删除按钮
			$("#editordelete").off().on('click',function(){freezeEmployee(updateEmployeeId,paramobj)})
	})
    /* section4 */

});



/* 提示弹窗 */
function outBoxCloseRes(msg , isSuccess){
    $msg = $("#tipMsg");
    // isSuccess是否成功: true/false(默认)
    if(isSuccess){
        $msg.addClass("active")
    }else{
        $msg.removeClass("active")
    }

	$msg.html(msg).show();
	function tipHide(){
		$("#tipMsg").hide();
	}
    setTimeout(tipHide,2000);
}

/* 重置<textarea>的高度 */
function initTextareaHeight(){
    $("textarea").each(function(i,ele){
        /* 清除旧高度, 设置新高度 */
        $(ele).height("").height($(this)[0].scrollHeight );
    })
}


