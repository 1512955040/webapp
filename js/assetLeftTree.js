var data =[
    {"title":"资产总览","key":"lastThirty","isFolder":true,"expand":true,addClass:"lastThirtyClass",
        "children": [
//            {"title": "资产分析","key":7,"activate":true},
            {"title": "资产分析","key":7},
            {"title": "最近30天登记的资产","key":8,},
            {"title": "最近30天报废的资产","key":9},
            {"title": "30天内质保将到期的资产","key":10},
            {"title": "未指派的资产","key":11},
            {"title": "不在合同中的资产","key":12},
            {"title":""}
        ]
    },
    {"title":"备件库","key":"libraryThirty","isFolder":true,"expand":false,
    	"children":[
    		{"title":"备件列表","key":100},
    		{"title":"入库记录","key":101},
    		{"title":"出库记录","key":102},
    		{"title":""}
    	]
    },
    {"title":""}
];

$(function(){
  	$("#tree").dynatree({
    	fx:{ height: "toggle", duration: 200 },
  	});
	var tree = $("#treeLazy");
	 $.ajax({
	 	type: 'post',
	 	url:loadCategoryTreeUrl,
	 	dataType:"json",
	 	success:function(result){
            //登录信息失效，ajax请求静态页面拦截
            onComplete(result);
//          console.log(result)
	 		if(result.status == 1){
	 			var category = result.data;
	 			data.splice(1,0,category);
	 			tree.dynatree({  
	 		      fx:{height: "toggle", duration: 200},
	 		      selectMode:1,
	 		      autoCollapse:true,//true:当一个节点是展开的，自动折叠其他兄弟节点,
	 		      children: data
	 		    });
	 		    tree.dynatree("getTree").reload();
	 		    var mark = getUrlParamHH("mark");
	 		    if(null == mark){
	 		    	mark = 7;
	 		    }else if(mark == 0){
	 		    	mark = "categor";
	 		    }
	 		    var ac = tree.dynatree("getTree").getNodeByKey(""+mark);
	 			ac.activate();
	 			ac.expand();
	 		}
	 	},
	 	error:function(XMLHttpRequest){
			error_500(XMLHttpRequest.responseText);
		}
	 });
});
function getUrlParamHH(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}