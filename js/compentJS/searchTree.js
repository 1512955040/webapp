//拼接字符串
function testString(a,b,c,json){   
   
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


/**creatTree**/
//创建树
//callBackF
var creatTree = function(tree_id, menu_id, input_id, code_id, url, flag,callBackF) {
	
	var newSelect = new selectMenu(tree_id, menu_id, input_id, code_id, url, flag,callBackF);
	newSelect.onSelect('id', 'parent_id', 'name');
	$('#' + input_id).click(function() {
		newSelect.show();
	});

}
//下拉菜单
var selectMenu = function(tree_id, menu_id, input_id, code_id, url, flag,callBackF) {
	this.tree_id = tree_id;
	this.menu_id = menu_id;
	this.input_id = input_id;
	this.code_id = code_id;
	this.flag = flag;
	var thes = this;
	var curExpandNode = null;

	//点击前
	function beforeClick(treeId, treeNode) {
		var flag = treeNode.open;
		//console.log(flag);
		var zTree_Menu = $.fn.zTree.getZTreeObj(thes.tree_id);
		//console.log(treeId);
		if(flag) {

			return true;
		} else {

			var check = (treeNode && !treeNode.isParent);
			if(check) { //true 叶子节点
				$('#' + menu_id).hide();
			}
			
			//return check;
		}
	}
	//点击事件
	function click(e, treeId, treeNode) {
		var zTree = $.fn.zTree.getZTreeObj(thes.tree_id);
		zTree.expandNode(treeNode, null, null, null, true);

		nodes = zTree.getSelectedNodes(),
			//console.log(nodes);
			v = "";
		if(nodes[0].isParent != true) {
			nodes.sort(function compare(a, b) {
				return a.id - b.id;
			});
			for(var i = 0, l = nodes.length; i < l; i++) {
				v += nodes[i].name + ",";
				if(code_id) {
					$('#' + code_id).attr("value", nodes[i].title);//赋值到输入框上显示
				}
			}
			if(v.length > 0) v = v.substring(0, v.length - 1);
			$("#" + input_id).attr("value", v);
		}

		if(null != callBackF){
			
    		callBackF();
    	}

	}
	//点击事件
	this.onClick = function(e, treeId, treeNode) {

		click(e, treeId, treeNode);
	}
	//双击事件
	this.onDblClick = function(e, treeId, treeNode) {
		click(e, treeId, treeNode);

	}
	//展开事件
	this.onExpand = function(event, treeId, treeNode) {
		curExpandNode = treeNode;
	}
	//展开前事件
	this.beforeExpand = function(treeId, treeNode) {
		var pNode = null;
		var treeNodeP = null;

		if(!pNode) {
			singlePath(treeNode, treeId);
		}
	}
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
	//配置信息
	this.options = {
		view: {
			dblClickExpand: false
		},
		data: {
			simpleData: {
				enable: true
			}
		},
		callback: {
			beforeClick: beforeClick,
			onClick: this.onClick,
			//onDblClick: this.onDblClick,
			onExpand: this.onExpand,
			beforeExpand: this.beforeExpand,

		}
	};
	//ztree展开
	this.show = function() {
		$("#" + menu_id).slideDown("fast");
		$("body").bind("mousedown", this.down);
	}
	//ztree隐藏
	this.hide = function() {
		$("#" + menu_id).fadeOut("fast");
		$("body").unbind("mousedown", this.down);
	}
	//ztree展开方式
	this.down = function(event) {
		if(!(event.target.id == menu_id || $(event.target).parents("#" + menu_id).length > 0)) {
			thes.hide();
		}
	}
	/**
	 * ajax
	 * */
	this.onSelect = function(id, parent_id, name) {
		$.ajax({
			type: "post",
			url: url,
			async: true,
			dataType: "json",
			data: '',
			contentType: 'application/x-www-form-urlencoded; charset=UTF-8', //防止乱码
			success: function(data) {
				if(null != data && data.length > 0) {
					treeData = data;
					var rolejson = testString(id, parent_id, name, data);
					$.fn.zTree.init($("#" + tree_id), thes.options, rolejson);
				} else {
					$("#" + menu_id).append("<ul>未找到相关数据</ul>");
				}
			},
			error: function(XMLHttpRequest) {
				error_500(XMLHttpRequest.responseText);
			}
		});
	}
}