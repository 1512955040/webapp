//拼接字符串
function testString(a,b,c,json){
    //a编码  b父编码  c名称
    var node='';
    node="[";
    if(null != json){
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
}





var func_test_string = function (a,b,c,json){
    return testString(a,b,c,json);
    }
// tree_id  存放树 ul id
// menu_id  存放树的 div id
// input_id 显示选项的 input id
// code_id  当前选中项的 code
// url      请求数据的url

var selectMenu = function(tree_id,menu_id,input_id,code_id,url,flag){
    this.tree_id = tree_id;
    this.menu_id = menu_id;
    this.input_id = input_id;
    this.code_id = code_id;
    this.flag = flag;
    var thes = this;
    var curExpandNode = null;
    function zTreeBeforeDblClick(treeId, treeNode) {
    	console.log(55);
        return true;
    }
//
    function beforeClick(treeId, treeNode) {
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

          // button和input,不同的元素用不同的方式写入.
          if ($("#"+input_id).attr("type")=="button") {
            $("#"+input_id+" .departContent").html(v)
          }else {
            $("#"+input_id).attr("value", v);
          }
        }
            //zTree = $.fn.zTree.getZTreeObj("menu_tree_left");

    }
    this.onClick = function(e, treeId, treeNode){
    	click(e, treeId, treeNode);
    }
    this.onDblClick = function(e, treeId, treeNode){
    	click(e, treeId, treeNode);
    }
    this.onExpand=function(event, treeId, treeNode) {
   	 	curExpandNode = treeNode;
	}
	this.beforeExpand=function(treeId, treeNode){
		var pNode = null;
			var treeNodeP =null;
			if (!pNode) {
				singlePath(treeNode,treeId);
			}
	}
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
            beforeClick: beforeClick,
            onClick: this.onClick,
            //onDblClick: this.onDblClick,
            onExpand: this.onExpand,
            beforeExpand: this.beforeExpand,

        }
    };

    this.show = function(){
        $("#"+menu_id).slideDown("fast");
        $("body").bind("mousedown", this.down);
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
            data:'',
            contentType:'application/x-www-form-urlencoded; charset=UTF-8',//防止乱码
            success:function(data){
            	if(null != data && data.length>0){
            		treeData = data;
                    var rolejson=testString(id,parent_id,name,data);
                    $.fn.zTree.init($("#"+tree_id), thes.options , rolejson);
            	}else{
            		$("#"+menu_id).append(noData);
            	}
            },
            error:function(XMLHttpRequest){
    			error_500(XMLHttpRequest.responseText);
    		}
        });
    }
}
var noData = "<ul>未找到相关数据</ul>";
//创建下拉树
/**
 * @para flag boolean值，如果flase，则表示只能选择叶子节点，不传默认为false
 *                         true，可以选择非叶子节点
 */
var creatTree = function(tree_id,menu_id,input_id,code_id,url,flag){
	var newSelect = new selectMenu(tree_id,menu_id,input_id,code_id,url,flag);
	newSelect.onSelect('id','parent_id','name');
    $('#'+input_id).click(function(){
    	newSelect.show();
    });
}
/**
 * 请求人、管理人等的搜索框
 * @param tree_id 需要创建的树的id
 * @param menu_id 树所在的div的id
 * @param input_id 显示名称的id
 * @param code_id 隐藏的id，用于保存所选的内容对应的id
 * @param flag  一个辅助标志
 * @param likeCondition  需要进行模糊搜索的条件
 * @param callBackF 点击选中后需要执行的函数
 */
var selectMenuH = function(tree_id,menu_id,input_id,code_id,url,callBackF){
    this.tree_id = tree_id;
    this.menu_id = menu_id;
    this.input_id = input_id;
    this.code_id = code_id;
    var thes = this;

    function zTreeBeforeDblClick(treeId, treeNode) {
        return true;
    }
    function click(){
    	var zTree = $.fn.zTree.getZTreeObj(thes.tree_id),
        nodes = zTree.getSelectedNodes(),
        v = "";
        nodes.sort(function compare(a,b){return a.id-b.id;});
        for (var i=0, l=nodes.length; i<l; i++) {
            v += nodes[i].name + ",";
            if(code_id){
            	$('#'+code_id).val(nodes[i].title);
            }
        }
        if (v.length > 0 ) v = v.substring(0, v.length-1);
        $("#"+input_id).val(v);
    }
    this.onClick = function(e, treeId, treeNode){

    	click();
    	$('#'+menu_id).hide();
    	if(null != callBackF){
    		callBackF();
    	}
    }
//    this.onDblClick = function(e, treeId, treeNode){
//    	click();
//
//    }
    this.options = {
        view: {dblClickExpand: false},
        data: {simpleData: {enable: true}},
        callback: {
//            beforeClick: beforeClick,
            onClick: this.onClick,
//            onDblClick: this.onDblClick
        }
    };
    this.show = function(){
        $("#"+menu_id).slideDown("fast");
        $("body").bind("mousedown", this.down);
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
     * 事件加载ztree数据
     * */
    this.nSelect = function(id,parent_id,name,flag,likeCondition){
        $.ajax({
            type:"post",
            url:url,
            async:true,
            dataType:"json",
            data:{"like":likeCondition,"flag":flag},
            contentType:'application/x-www-form-urlencoded; charset=UTF-8',//防止乱码
            success:function(data){
            	if(1 == data.status){
            		$("#"+tree_id).empty();
            		var person = data.data;
            		if(null != person && person.length>0){
            			var rolejson=testString(id,parent_id,name,person);
                        $.fn.zTree.init($("#"+tree_id), thes.options , rolejson);
            		}else{
            			$("#"+tree_id).append(noData);
            		}
            	}else{
            		outBoxClose(data.msg);
            	}
            },
            error:function(XMLHttpRequest){
    			error_500(XMLHttpRequest.responseText);
    		}
        });
    }

    /**
     * 工单加载ztree数据
     * */
    this.onSelect = function(id,parent_id,name,likeCondition){
        $.ajax({
            type:"post",
            url:url,
            async:true,
            dataType:"json",
            data:{"name_like":likeCondition},
            contentType:'application/x-www-form-urlencoded; charset=UTF-8',//防止乱码
            success:function(data){
            	$("#"+tree_id).empty();
            	if(data.length != 0){
	                 var rolejson=testString(id,parent_id,name,data);
	                $.fn.zTree.init($("#"+tree_id), thes.options , rolejson);           		
            	}else{
            		$("#"+tree_id).append(noData);
            	}

            },
            error:function(XMLHttpRequest){
    			error_500(XMLHttpRequest.responseText);
    		}
        });
    }
}
