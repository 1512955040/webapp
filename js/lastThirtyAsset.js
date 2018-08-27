var assetDetailHtml = "assetDetail.html";
var COMPARE = "data_per.create_time";
var SORT = "DESC";
var SORT_ASC = "ASC";
var ASSERT_LIST_HTML = "lastThirtyAsset.html";
var resStatusData,resStatusValue;//影响下拉选的数据
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

/*-----------------------资产饼状五个统计资产数量图-----------------------------*/
/*----------------------------------开始----------------------------------------*/
/**
 * 绘制统计图
 * @author si.yu
 * */
function drawPie1(res_id,res_counts,res_total,color1,color2){
    var circleChart = echarts.init(document.getElementById('res_'+res_id));
    var option = {
        title:{
            text:res_counts,
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
                name:'资产',
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
                data:[res_counts]
            },
            {
                type:'pie',   //饼图
                name:'资产',
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
                data:[res_total-res_counts,res_counts],
                hoverAnimation: false
            }
        ]
    };
    circleChart.setOption(option);
}

/**
 * 加载资产分类饼图统计
 * @author si.yu
 * */
function resourceBallCount(mark){
    if(mark == "undefined"){
        mark = $("#treeLazy").dynatree("getActiveNode").data.key;
    }
    var color = [
    	//移入颜色                           图例颜色
        {"color1":'#5286ce',color2:'#84c0e4'},//硬件
        {"color1":'#d7b23e',color2:'#f0d272'},//软件
        {"color1":'#c47e95',color2:'#eda6bb'},//智能仪器
       	{"color1":'#e0904f',color2:'#fdb071'}//其他
    ];
    $.ajax({
        url:resourceClassifyCountsUrl,
        dataType:"json",
        type:'POST',
        async:true,
        data:{timeInterval:30,mark:mark},
        contentType:'application/x-www-form-urlencoded; charset=UTF-8',//防止乱码
        complete: onComplete,
        success: function (data) {
            //登录信息失效，ajax请求静态页面拦截
            onComplete(data);
			//console.log(data);
        	$('#res_countsData').html('');
            var len = data.length;
//          if(len==0){//无数据显示4个0环形图
//          }
            //alert(color[len].color1);
            while(len--){
                createDiv(data[len].name,data[len].id);
                drawPie1(data[len].id,data[len].conuts,data[len].total,color[len].color1,color[len].color2);
            }
        }
    });
}
/**
 * 资产分类饼图统计刷新
 * */
var upCountsData = document.getElementById("resCountsUp");
upCountsData.onclick = function () {
    resourceBallCount("undefined");
}
/**
 * 动态加载资产分类统计图
 * @author si.yu
 * */
function createDiv(res_name,res_id){
    var liDiv = document.createElement("li");//创建li标签
    var flContentBox=document.createElement('div');
    flContentBox.className="flContentBox";
    var frameDiv = document.createElement("div");//创建div标签
    var bodyFa = document.getElementById('res_countsData');//获取到父节点
    frameDiv.setAttribute("id","res_"+res_id);
    frameDiv.className = 'circle';
    liDiv.className = "fl";

    var p = document.createElement("span");
    p.className = 'res-countsData-num';
    p.innerHTML = res_name;

    flContentBox.appendChild(frameDiv);
    flContentBox.appendChild(p);
    liDiv.appendChild(flContentBox);
    
    bodyFa.appendChild(liDiv);
    frameDiv.onmousedown = function(){
        searchData(res_id);
    }
}
/*----------------------------------结束----------------------------------------*/
/*-----------------------资产饼状五个统计资产数量图-----------------------------*/

/**
 * 点击分类球体加载数据
 * @param categoryIdBall
 */
function searchData(categoryIdBall){
//	alert(categoryIdBall);
	$("#categoryIdHelp").val(categoryIdBall);
	var fc = findCondition();
//	var fcUrl = nextHandUrlParam(fc);
//	window.location.href = ASSERT_LIST_HTML+"?"+fcUrl;
	showResourceByDate(fc);
}
/**
 * 每个资源前面是否打对勾
 */
function res_click(){
    //checked active di对勾样式   checked di 无对勾样式
    if(!$(this).children().hasClass("checked di active")){
        $(this).children().addClass("active");
    }else{
        $(this).children().removeClass("active");
    }
    //每次点击小框，需要判断一下ids[]，改变“新建”“删除”“指派部门等样式”
	var ids = getCheckBoxIds();
    chengeType(ids);
    clickOperation();
}

/**
 * 当重新查找时，比如下一页，重新排序等
 * 需要把小框的选中和“新建”“删除”“指派部门等样式去掉
 */
function removeCheckBox(){
	//removeClass可以作用在一个数组上
	$("#tableWrap").find(".checked.di.active").removeClass("active");
}
/**
 * 通过每个资源前面的小框，
 * 获取被选中的所有资源。
 */
function getCheckBoxIds(){
	var ids = [];
	var $checkboxs = $("#tableWrap").find(".checked.di.active").children("input");
	//遍历jquery对象
	$checkboxs.each(function(){
		ids.push($(this).val());
	});
	return ids;
}
/**
 * 改变“新建”“删除”“指派部门等样式”
 * @param ids
 */
function chengeType(ids){
	
    if(ids.length != 0){
        $(".opeBto").removeClass('default').addClass("active");
    }else{
        $(".opeBto").removeClass('active').addClass("default");
    }
}

/**
 * 资产列表按钮操作点击事件绑定
 * @author si.yu
 * */
function clickOperation(){
    var delBtn = document.getElementById("delete");
    var chooseDeptBtn = document.getElementById("chooseDept");
    var changeStateBtn = document.getElementById("changeState");
    var depreciatedBtn = document.getElementById("depreciated");
    var conn_contractBtn = document.getElementById("conn_contract");
    var delConfirm = document.getElementById("delConfirm");
    var setDeptConfirm = document.getElementById("setDeptConfirm");
    var changeStatusConfirm = document.getElementById("changeStatusConfirm");
    var depreciateConfirm = document.getElementById("depreciateConfirm");
    var conn_contractConfirm = document.getElementById("conn_contractConfirm");
    var upConPage = document.getElementById("upConPageId");
    var nextConPage = document.getElementById("nextConPageId");

    //删除点击事件
    delBtn.onclick = function () {
        var ids = getCheckBoxIds();
        //console.log(ids);
        if(ids.length != 0){
            //alert("选中删除测试");
            $("#pupDelete").modal('show');
            delConfirm.onclick = function () {
                $("#pupDelete").modal('hide');
                res_delete(ids);
            }
        }
    }
 // tree_id  存放树 ul id
 // menu_id  存放树的 div id
 // input_id 显示选项的 input id
 // code_id  当前选中项的 code
 // url      请求数据的url
    //分配部门点击事件
    chooseDeptBtn.onclick = function(){
        var ids = getCheckBoxIds();
        if(ids.length != 0){
            $("#assign").modal('show');
            var department_select = creatTree("department-tree","department-menu","department","departmentCode",departmentDataUrl);
            $("#chooseDepartment").html("");
            setDeptConfirm.onclick = function () {
                var deptId = document.getElementById("departmentCode").value;

                if(null != deptId){
                    $("#assign").modal('hide');
                    res_setDept(ids,deptId);
                }else{
                    alert("请选择部门！");
                }
            }
        }
    }

    //修改状态点击事件
    changeStateBtn.onclick = function(){
        var ids = getCheckBoxIds();
        if(ids.length != 0){
            $("#changeStatus").modal('show');
            changeStatusConfirm.onclick = function () {
                var statusSelect = document.getElementById("statusSelect");
                var statusValue = statusSelect.options[statusSelect.selectedIndex].value;
                if(null != statusValue){
                    $("#changeStatus").modal('hide');
                    res_changeState(ids,statusValue);
                }else{
                    alert("请选择资产！");
                }
            }
        }
    }
    //配置折旧点击事件
    depreciatedBtn.onclick = function () {
        var ids = getCheckBoxIds();
        if(ids.length != 0){
            $("#depreciate").modal('show');
            depreciateConfirm.onclick = function () {
                $("#depreciate").modal('hide');
                alert("选中配置折旧测试");
            }
        }
    }
    //关联合同点击事件
    var contractId = [];
    conn_contractBtn.onclick = function () {
        var ids = getCheckBoxIds();
        contractId = [];
        if(ids.length != 0){
            $("#relateAsset").modal('show');
            //初始化合同列表
            $("#modal-body-bottom-rowWrap").html("");
            var currPage = $("#currPage").val();
            if("" == currPage){
                currPage = 1;
            }
            //加载合同数据
            getContractData(currPage,null);
            //初始化关联合同模糊查询方法
            $("#contractSearch").keydown(function(e){
                var currKey = 0;e = e||event;
                currKey = e.keyCode||e.which||e.charCode;
                //回车搜索
                if(currKey == 13){
                    //获取模糊查询条件
                    var searchText = document.getElementById("contractSearch").value ;
                    //var currPage = $("#currPage").val();
                    if("" == searchText){
                        alert("请输入查询条件!");
                    }
                    $("#modal-body-bottom-rowWrap").html("");
                    getContractData(1,searchText);
                }
            });
            /**
             * 点击上一页操作
             * */
            upConPage.onclick = function () {
                //获取模糊查询条件
                var searchText = $("#contractSearch").val();
                //从页面获取当前页数
                var currPage = $("#currPage").val();
                if(currPage - 1 == 0){
                    $("#tipMsg").addClass("active").html("第一页").show();
                    function hideMsg(){
                        $("#tipMsg").addClass("active").html("第一页").hide()
                    }
                    setTimeout(hideMsg,1500);
                }else{
                    currPage--;
                }
                //清空列表
                $("#modal-body-bottom-rowWrap").html("");
                getContractData(currPage,searchText);
            }
            /**
             * 点击下一页操作
             * */
            nextConPage.onclick = function () {
                //获取模糊查询条件
                var searchText = $("#contractSearch").val();
                //从页面获取当前页面和总页数
                var currPage = $("#currPage").val();
                var totalPage = $("#totalPage").val();

                if(totalPage - currPage == 0 || totalPage - 1 == 0){
                    $("#tipMsg").addClass("active").html("最后一页").show();
                    function hideMsg(){
                        $("#tipMsg").addClass("active").html("最后一页").hide()
                    }
                    setTimeout(hideMsg,1500);
                }else{
                    currPage++;
                }
                //清空列表
                $("#modal-body-bottom-rowWrap").html("");
                getContractData(currPage,searchText);
            }

            //点击选择需要关联的合同
            $("#modal-body-bottom-rowWrap").on("click","div",function(){
                contractId = [];
                if(!$("#modal-body-bottom-rowWrap").children().hasClass("active")){
                    $(this).addClass("active");
                    contractId.push($(this).find("input").val());
                }else{
                    $("#modal-body-bottom-rowWrap").children().removeClass("active");
                    $(this).addClass("active");
                    contractId.push($(this).find("input").val());
                }
                //console.log(contractId);
            });
            conn_contractConfirm.onclick = function () {
                if(contractId.length != 0){
                    $("#relateAsset").modal('hide');
                    res_connContract(ids,contractId);
                }else{
                    alert("请选择需要关联的合同！");
                }
            }
        }
    }
}

/**
 * 删除操作
 * @author si.yu
 * */
function res_delete(ids){

    $.ajax({
        traditional: true,
        url:res_deleteUrl,
        dataType:"json",
        type:'POST',
        data:{ids:ids},
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

            var ids  = getCheckBoxIds();
            chengeType(ids);
            resourceBallCount("undefined");
            var fc = findCondition();
//            var fcUrl = nextHandUrlParam(fc);
//            window.location.href = ASSERT_LIST_HTML+"?"+fcUrl;
        	showResourceByDate(fc);
        },
        error:function(XMLHttpRequest){
			error_500(XMLHttpRequest.responseText);
		}
    });
}


/**
 * 指派部门操作
 * @author si.yu
 * */
function res_setDept(ids,deptValueId){
    $.ajax({
        traditional: true,
        url:res_setDeptUrl,
        dataType:"json",
        type:'POST',
        async:true,
        data:{ids:ids,deptId:deptValueId},
        contentType:'application/x-www-form-urlencoded; charset=UTF-8',//防止乱码
//		complete: onComplete,
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

            var ids  = getCheckBoxIds();
            chengeType(ids);
            var fc = findCondition();
//            var fcUrl = nextHandUrlParam(fc);
//            window.location.href = ASSERT_LIST_HTML+"?"+fcUrl;
        	showResourceByDate(fc);
        },
        error:function(XMLHttpRequest){
			error_500(XMLHttpRequest.responseText);
		}
    });
}

/**
 * 修改状态操作
 * @author si.yu
 * */
function res_changeState(ids,statusValue){
    $.ajax({
        traditional:true,
        url:res_changeStateUrl,
        dataType:"json",
        type:'POST',
        async:true,
        data:{ids:ids,res_status:statusValue},
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

            var ids  = getCheckBoxIds();
            chengeType(ids);
            var fc = findCondition();
//            var fcUrl = nextHandUrlParam(fc);
//            window.location.href = ASSERT_LIST_HTML+"?"+fcUrl;
        	showResourceByDate(fc);
        },
        error:function(XMLHttpRequest){
			error_500(XMLHttpRequest.responseText);
		}
    });
}

/**
 * 配置折旧操作
 * @author si.yu
 * */
function res_depreciated(ids){
    $.ajax({
        traditional: true,
        url:res_depreciatedUrl,
        dataType:"json",
        type:'POST',
        async:true,
        data:{ids:ids},
        contentType:'application/x-www-form-urlencoded; charset=UTF-8',//防止乱码
//        complete: onComplete,
        success: function (data) {

            //登录信息失效，ajax请求静态页面拦截
            onComplete(data);

        },
        error:function(XMLHttpRequest){
			error_500(XMLHttpRequest.responseText);
		}
    });
}

/**
 * 加载合同数据
 * @author si.yu
 * */
function getContractData(currPage,searchText){
    var eachPageCount = 5;

    $.ajax({
        url:getContractsUrl,
        dataType : "json",
        type : 'GET',
        data:{page:currPage,count:5,searchText:searchText},
        contentType:'application/x-www-form-urlencoded; charset=UTF-8',//防止乱码
//        complete: onComplete,
        success:function(data){

            //登录信息失效，ajax请求静态页面拦截
            onComplete(data);

            //console.log(data);
            var len  = data.length;
            var totalPage = data[0].pagenumbers;
            var totalCount = data[0].total_numbers;
            $("#totalPage").val(totalPage);
            var test = $("#totalPage").val();
            var beginCount = (currPage-1)*(eachPageCount)+1;
            var endCount;
            if(len - eachPageCount == 0){
                endCount = beginCount-1 + eachPageCount;
            }else{
                endCount = beginCount-1 + (len)%(eachPageCount);
            }
            //console.log("totalCount="+totalCount+"////totalPage="+totalPage+"/////currPage="+currPage+"////////beginCount="+beginCount+"////////endCount="+endCount);
            //分页数据
            var contractPage = {
                "beginCount":beginCount,
                "endCount":endCount,
                "totalCount":totalCount,
                "currPage":currPage,
                "totalPage":totalPage
            }
            var contractPageClass = {
                upConPage:{
                    class:function(){
                        if(currPage - 1 == 0){
                            return "di up-page-left";
                        }else{
                            return "di up-page-left active";
                        }
                    }
                },
                nextConPage:{
                    class:function(){
                        if(totalPage - 1 == 0 || totalPage-currPage == 0){
                            return "di up-page-right";
                        }else{
                            return "di up-page-right active";
                        }
                    }
                }
            }
            //向页面绑定数据
            $("#contractPage").render(contractPage,contractPageClass);

            while(len--){
                var fatherDiv = document.getElementById('modal-body-bottom-rowWrap');//获取到父节点

                var dataDiv = document.createElement("div");
                dataDiv.className = 'modal-body-bottom-row';

                var idInput = document.createElement("input");
                idInput.setAttribute("type","hidden");
                idInput.setAttribute("value",data[len].id);
                dataDiv.appendChild(idInput);

                var pName = document.createElement("p");
                pName.className = 'di modal-body-bottom-rowItem';
                pName.innerHTML = data[len].name;
                dataDiv.appendChild(pName);

                var pNum = document.createElement("p");
                pNum.className = 'di modal-body-bottom-rowItem';
                var pNumCode = data[len].contract_code;
                if(null == pNumCode){
                    pNum.innerHTML = "/";
                }else{
                    pNum.innerHTML = data[len].contract_code;
                }
                dataDiv.appendChild(pNum);

                var pFirm = document.createElement("p");
                pFirm.className = 'di modal-body-bottom-rowItem';
                var pFirmName = data[len].partB_enterprise;
                if(null == pFirmName){
                    pFirm.innerHTML = "/";
                }else{
                    pFirm.innerHTML = data[len].partB_enterprise;
                }
                dataDiv.appendChild(pFirm);

                var pSignDate = document.createElement("p");
                pSignDate.className = 'di modal-body-bottom-rowItem';
                var pSignVal =  data[len].signing_date;
                if(null == pSignVal){
                    pSignDate.innerHTML = "/";
                }else{
                    pSignDate.innerHTML = data[len].signing_date;
                }
                dataDiv.appendChild(pSignDate);

                var pTime = document.createElement("p");
                pTime.className = 'di modal-body-bottom-rowItem';
                var pTimeVal = data[len].end_time;
                if(null ==  pTimeVal){
                    pTime.innerHTML = "/";
                }else{
                    pTime.innerHTML = data[len].end_time;
                }
                dataDiv.appendChild(pTime);

                fatherDiv.appendChild(dataDiv);
            }
            return fatherDiv;
        },
        error:function(XMLHttpRequest){
			error_500(XMLHttpRequest.responseText);
		}
    });
}

 /**
 * 关联合同操作
 * @author si.yu
 * */
function res_connContract(ids,contractId){
    $.ajax({
        traditional:true,
        url:res_connContractUrl,
        dataType:"json",
        type:'POST',
        async:true,
        data:{ids:ids,contractId:contractId},
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

            var ids  = getCheckBoxIds();
            chengeType(ids);
            var fc = findCondition();
//            var fcUrl = nextHandUrlParam(fc);
//            window.location.href = ASSERT_LIST_HTML+"?"+fcUrl;
        	showResourceByDate(fc);
        },
        error:function(XMLHttpRequest){
			error_500(XMLHttpRequest.responseText);
		}
    });
}
var numEachPage;//每页显示多少条数据
/**
 * 加载每页显示多少条数据
 * @param callBackFun 加载完需要执行的函数
 */
function loadPageEachNum(callBackFun){
	$.ajax({
		url:loadPageEachNumUrl,
		type:"get",
		data:{},
		dataType:"json",
		success:function(result){
			//登录信息失效，ajax请求静态页面拦截
            onComplete(result);
            numEachPage = result.data;
            if(null != callBackFun){
            	callBackFun();
            }
		},
		error:function(XMLHttpRequest){
			error_500(XMLHttpRequest.responseText);
		}
	});
}
/**
 * 点击左侧树xx天
 * 展示选中的近xx天登记（报废，不在合同中的）资产
 * @param mark
 * @param categoryIdBall 球形分类id
 */
var successResult = 1;
var addHtml = "assetAdd.html";
function showResourceByDate(fc){
   //console.log(fc);
	$.ajax({
	    url:showResourceListUrl,
	    type:"post",
	    data:{"mark":fc.mark,"page":fc.page,"sort":fc.sort,
	    	  "comparable":fc.comparable,"likeInput":fc.likeInput,
	    	  "categoryId":fc.categoryIdBall,"flag":fc.assetListFlag},
	    	   dataType:"json",
	    success:function(result){
            //登录信息失效，ajax请求静态页面拦截
            onComplete(result);
	      //请求成功
	      if(result.status == successResult){
	    	  //先把分类球体隐藏
	    	  var dataSub = result.dataSub;
	    	  if("categoryFlag" == dataSub.flag){
	    		  $("div.rightTip").hide();

	    	  }else if("lastThirtyFlag" == dataSub.flag){
	    		  $("div.rightTip").show();
	    	  }
	    	  //绑定标题，不需要经过数据库查找
	    	  $("#titleSubId").html(fc.titleSub);
	    	  bandData(result);			 
	      }
	    },
	    error:function(XMLHttpRequest){
			error_500(XMLHttpRequest.responseText);
		}
	  });
}
function getQueryString(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		var r = window.location.search.substr(1).match(reg);
		if (r != null) return unescape(r[2]); return null;
	}
//获取url中的参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}
/**
 * 处理路径中的url参数，
 * @returns 返回一个查询条件的对象，和本页面中的fc类似。
 */
function preHandUrlParam(){
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
    	pp.categoryIdBall = "";
	}else{
		pp.categoryIdBall = categoryId;
	}
//	var flag = getUrlParam("flag");
	var assetListFlag=getUrlParam("assetListFlag");
	if(null == assetListFlag){
//	  pp.flag = "lastThirtyFlag";
	  pp.assetListFlag="lastThirtyFlag";
	}else{
//		pp.flag = flag;
		pp.assetListFlag=assetListFlag
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
function nextHandUrlParam(fc){
	var urlParam = "";
	var isResList = fc.isResList;
	if(null == isResList){
		isResList = 0;
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
    urlParam += "&likeInput="+encodeURIComponent(encodeURIComponent(likeInput));//
	var categoryId = fc.categoryIdBall;
    if(null == categoryId){
    	categoryId = "";
	}
    urlParam += "&categoryId="+categoryId;
//	var flag = fc.flag;
	var assetListFlag=fc.assetListFlag; 
	if(null == assetListFlag){
//	  flag = "lastThirtyFlag";
	assetListFlag= "lastThirtyFlag";
	}
//	urlParam += "&flag="+flag;
	urlParam+="&assetListFlag="+assetListFlag;
	return urlParam;
}
/**
 * 到页面上找查询条件,返回值是一个对象。
 */
function findCondition(){
	var fc = new Object();
    var currentNode = $("#treeLazy").dynatree("getActiveNode");
    //根据nodeLevel来判断查找什么
    var nodeLevel = currentNode.getLevel();
    var titleSub = currentNode.data.title;
    //资产分析
    if(1 != nodeLevel && "lastThirty" == currentNode.getParent().data.key){
    	//最近30天
//  	fc.flag = "lastThirtyFlag";
		fc.assetListFlag = "lastThirtyFlag";
    }else if(1 != nodeLevel && "lastThirty" != currentNode.getParent().data.key){
    	//资产分类。分类
//  	fc.flag = "categoryFlag";
		fc.assetListFlag = "categoryFlag";
    }else if(1 == nodeLevel && "lastThirty" != currentNode.data.key){
//  	fc.flag = "categoryFlag";
		fc.assetListFlag="categoryFlag";
    }
	var markVal = currentNode.data.key;
	if(null == markVal){
		//设置默认值，如果是最近30天的，默认为8，如果是资产分类的，默认为1？或者？
        if(1 != nodeLevel && "lastThirty" == currentNode.getParent().data.key){
        	fc.mark = 8;
        }else if(1 != nodeLevel && "lastThirty" != currentNode.getParent().data.key){
        	fc.mark = 1;//第一个分类的id
        }
	}else if("categor" == markVal){
		fc.mark = 0;
	}else{
		fc.mark = markVal;
	}
	if(null == titleSub){
		fc.titleSub == ""
	}else{
		fc.titleSub == titleSub;
	}
	var pageHelp = $("#currentPageId").html();  //当前页数
	if("" == pageHelp || 0==pageHelp){
		fc.page = 1;
	}else{
		fc.page = pageHelp;
	}
	var sortHelp = $('#sort span').filter(".active").children("input").val(); //升序/降序
	if("" == sortHelp){
		fc.sort = SORT;
	}else{
		fc.sort = sortHelp;
	}
	var comparableHelp = $("#comparableSel option:selected").val();  //排序依据
	if(null == comparableHelp){
		fc.comparable = COMPARE;
	}else{
		fc.comparable = comparableHelp;
	}
	var categoryIdBallHelp = $("#categoryIdHelp").val();
	if("" == categoryIdBallHelp){
		fc.categoryIdBall = "";
	}else{
		fc.categoryIdBall = categoryIdBallHelp;
	}
	var likeInpu = $("#likeId").val();
	if("" == likeInpu){
		fc.likeInput = "";
	}else{
		fc.likeInput = likeInpu;
	}
	return fc;

}
/**
 * 根据url参数，得到的对象，初始化页面的查询条件
 * @param pp 处理url参数后得到的对象
 */
function initConditionByUrl(pp){
	var sort = pp.sort;
	$("#sortUp").removeClass("active");
	$("#sortDown").removeClass("active");
	if(null == sort){
		$("#sortDown").addClass("active");
	}else if(SORT_ASC == sort){
		$("#sortUp").addClass("active");
	}else{
		$("#sortDown").addClass("active");
	}
	var comparable = pp.comparable;
    if(null == comparable){
    	$("select.init").selectpicker('val',COMPARE);
	}else{
		$("select.init").selectpicker('val',comparable);
	}
	var likeInput = pp.likeInput;
    if(null == likeInput){
    	$("#likeId").val('');
	}else{
		$("#likeId").val(decodeURIComponent(likeInput));//decodeURIComponent(likeInput)
	}
	var categoryId = pp.categoryIdBall;
    if(null == categoryId){
    	$("#categoryIdHelp").val('');
	}else{
		$("#categoryIdHelp").val(categoryId);
	}
}
/**
 * 清空页面上的查询条件
 */
function initCondition(){
    $("#categoryIdHelp").val('');//清空分类球体所在的hidden input
    $("#likeId").val('');//清空索搜框
	var fc = new Object();
	fc.page = 1; //默认第一页
	fc.sort = "DESC"; //默认降序
	fc.comparable = COMPARE;  //默认按照创建时间排序
	//升序降序样式
	$("#sortUp").removeClass("active");
	$("#sortDown").removeClass("active");
	$("#sortDown").addClass("active");
	$("select.init").selectpicker('val',COMPARE);
	return fc;
}

/**
 * 隐藏“更新”按钮
 */
function removeUpdateBtn(){
	$("button.table-asset-status").hide();
}
/**
 * 还原页面上的样式
 */
function initClass(){
	//还原样式
	removeCheckBox(); //复选框
	var ids = getCheckBoxIds();
    chengeType(ids);  //"删除"、“指派部门等样式”
    removeUpdateBtn();
}
var LeftHeight;
/**
 * 往页面上绑定数据
 * @param result
 */
function bandData(result,leftHeight){

	var resource = result.data;
    //判断是否有数据
	var hasNoData = $('#hasNoData');
	var dataDiv = $('#tableWrap');
	hasNoData.hide();
	dataDiv.hide();
	var leftListHeight;
	//分页的数据
	var pageMsg;
    var dePage={
    		nextPageFlag:{
    			class:function(){
    				if(this.totalPage - 1 == 0 || this.totalPage-this.currentPage == 0){
    					return "di pageChange-span-down";
    				}else{
    					return "di pageChange-span-down active";
    				}
    			}
    		},
    		prevPageFlag:{
    			class:function(){
    				if(this.currentPage - 1 == 0 || this.currentPage == 0){
    					return "di pageChange-span-up";
    				}else{
    					return "di pageChange-span-up active";
    				}
    			}
    		},
    		prevPageFlagSmall:{
    			class:function(){
    				if(this.currentPage - 1 == 0 || this.currentPage == 0){
    					return "rightCon-page-left di";
    				}else{
    					return "rightCon-page-left di active";
    				}
    			}
    		},
    		nextPageFlagSmall:{
    			class:function(){
    				if(this.totalPage - 1 == 0 || this.totalPage-this.currentPage == 0){
    					return "rightCon-page-right di";
    				}else{
    					return "rightCon-page-right di active";
    				}
    			}
    		},
    		prevPageDis:{
    			class:function(){
    				if(this.currentPage - 1 == 0 || this.currentPage == 0){
    					return "pageChange-span1 pageChange-span di disabled";
    				}else{
    					return "pageChange-span1 pageChange-span di";
    				}
    			}
    		},
    		nextPageDis:{
    			class:function(){
    				if(this.totalPage - 1 == 0 || this.totalPage-this.currentPage == 0){
    					return "pageChange-span3 pageChange-span di disabled";
    				}else{
    					return "pageChange-span3 pageChange-span di";
    				}
    			}
    		},
    		pageInput:{
    			disabled:function(){
    				if(this.totalPage - 1 == 0 || this.totalPage == 0){
    					return "suibian";//这里return的不能为""，其余的什么都可以。
    				}

    			}
    		}
    }
    if(resource.length - 0 == 0){
    	//dataDiv.hide();
    	//显示背景图片+文字;
    	$('.takePlace').removeClass('dn');

    	//分页的数据
        pageMsg = {"currentPage":0,
    		       "totalPage":0,
    		       "firstData":0,
    		       "lastData":0,
    		       "totalNums":0
                  };
    	hasNoData.show();
    	$('#pageSmall').hide();
    	$('#pageHelp').hide();
    	setLeftHeight();
	}
    if(resource.length - 0 > 0){
    	//隐藏背景图片+文字;
    	$('.takePlace').addClass('dn');
    	dataDiv.show();
    	$('#pageSmall').show();
    	$('#pageHelp').show();
    	//dataDiv.show();

    	initClass();
        //1.绑定资源数据
        //设置在保/过保颜色
        var de;
        de={
          departmentEditId:{
        	id:function(){
        		return "departmentEditId"+this.id;
        	}
          },
          departmentCodeEditId:{
          	id:function(){
          		return "departmentCodeEditId"+this.id;
          	}
           },
           sectionMenuId:{
        	 id:function(){
        		 return "sectionMenuId"+this.id;
        	 }
           },
           sectionTreeId:{
          	id:function(){
          		return "sectionTreeId"+this.id;
          	}
          },
          status_id:{
        	  id:function(){
        		  return "selector_status"+this.id;
        	  }
          },
          user_id:{
        	  id:function(){
        		  return "selector_user"+this.id;
        	  }
          },
          statusSel:{
        	  id:function(){
        		  return "statusSel"+this.id;
        	  }
          },
          userSel:{
        	  id:function(){
        		  return "userSel"+this.id;
        	  }
          },
            updateBtn:{
                id:function(){
                    return "updateBtn"+this.id;
                }
            },
            updateResDept:{
                id: function () {
                    return "updateResDept"+this.id;
                }
            },
            resStatus:{
                id: function () {
                    return "resStatus"+this.id;
                }
            },
            resUser:{
                id: function () {
                    return "resUser"+this.id;
                }
            },
          protect:{
               class:function(){
                   if(this.protect == "过保"){
                       return "tableRow-status tableRow-status-overPro";
                   }else if(this.protect == "未过保"){
                      return "tableRow-status tableRow-status-paul";
                   }
//                   else if(this.protect == "未知"){
//                      return "tableRow-status tableRow-status-unknown";
//                   }
               }
           },
           categoryImg:{
        	   class:function(){
        		   if("硬件" == this.category_name){
        			   return "tableCol-type hardware di";
        		   }else if("软件" == this.category_name){
        			   return "tableCol-type softword di";
        		   }else if("智能仪器" == this.category_name){
        			   return "tableCol-type test di";
        		   }else if("其他" == this.category_name){
        			   return "tableCol-type other di";
        		   }
        	   }
           },
           resource_usestatus_name:{
        	   value:function(){
        		   return this.resource_usestatus;
        	   }
           },
           use_person_id_name:{
        	   value:function(){
        		   return this.resource_use_person_id;
        	   }
           }
         };
        dataDiv.render(resource,de);
       	setLeftHeight();
		

        //检测上面渲染的分类,是否有空值.若有空值,就去掉'-'
        $("#tableWrap [data-bind=level_2_name]").each(function(){
          if ($(this).html()=="") {
            $(this).prev().html("");  //移出前面的 -
//            $(this).html("");  //移出自己
          }else {
            $(this).prev().html(" - ");  //添加前面的 -
          }
        });
        $("#tableWrap [data-bind=level_3_name]").each(function(){
          if ($(this).html()=="") {
            $(this).prev().html("");  //移出前面的 -
//            $(this).html("");  //移出自己
          }else {
            $(this).prev().html(" - ");  //添加前面的 -
          }
        });

        //2.绑定分页数据
        //总页数和当前页数
        var totalPage = resource[0].page;//总页数
        var currentPage = result.dataSub.page;//当前页数
        var totalNums = resource[0].total_numbers;//总条数

   		//控制表格底部和右上角按钮隐藏显示
        if(totalNums==0){
        	$('#pageSmall').css('display','none');
        	$('#pageHelp').css('display','none');
        }else if(totalNums>0){
        	//$('#tableWrap').html('');
        	$('#pageSmall').css('display','block');
        	$('#pageHelp').css('display','block');
        }
        var firstData = (currentPage-1)*(numEachPage)+1;
        var lastData;
        if(resource.length - numEachPage == 0){
            lastData = firstData-1 + numEachPage;
        }else{
            lastData = firstData-1 + (resource.length)%(numEachPage);
        }
        //分页的数据
        pageMsg = {"currentPage":currentPage,
    		       "totalPage":totalPage,
    		       "firstData":firstData,
    		       "lastData":lastData,
    		       "totalNums":totalNums
                  };
    }
    //给两个分页区域绑定数据
    $("#pageHelp,#pageSmall").render(pageMsg,dePage);

        //绑定三个能更新内容的数据  1.使用状态  2.部门  3.使用人
		var updateDiv = $("div.updateStatusFlag");  //10个
		var updateStatusSelect = $("select.updateStatusFlag"); //10个
		for(var i=0;i<resource.length;i++){
			updateDiv.eq(i).remove();
			$("#selector_status"+resource[i].id).append(updateStatusSelect.eq(i));
			updateStatusSelect.eq(i).selectpicker({noneSelectedText:' '});
			updateStatusSelect.eq(i).selectpicker('refresh');
		}

        for(var i=0;i<resource.length;i++){
            $("#departmentEditId"+resource[i].id).attr("value",resource[i].department_name);
            $("#departmentCodeEditId"+resource[i].id).attr("value",resource.resource_organization_id);
        }

		var updateUserDiv = $("div.updateUserFlag");  //10个
		var updateUserSelect = $("select.updateUserFlag"); //10个
		for(var i=0;i<resource.length;i++){
			updateUserDiv.eq(i).remove();
			$("#selector_user"+resource[i].id).append(updateUserSelect.eq(i));
			updateUserSelect.eq(i).selectpicker({noneSelectedText:' '});
			updateUserSelect.eq(i).selectpicker('refresh');
		}
    loadResStatusInfo();
    loadResDeptInfo();
    loadResUpdateInfo();
}

/**
 * 点击升序
 */
function sortUpClick(){

	var sortHelp = $(this).children("input").val();
	if(!$(this).hasClass("active")){
	  //改变降序样式
	  $(this).next().removeClass("active");
	  $(this).addClass("active");
    }
	var fc = findCondition();
//	var fcUrl = nextHandUrlParam(fc);
//	window.location.href = ASSERT_LIST_HTML+"?"+fcUrl;
	showResourceByDate(fc);
}

/**
 * 点击降序
 */
function sortDownClick(){
	var sortHelp = $(this).children("input").val();
	if(!$(this).hasClass("active")){
	  //改变升序样式
	  $(this).prev().removeClass("active");
	  $(this).addClass("active");
	}
	var fc = findCondition();
//	var fcUrl = nextHandUrlParam(fc);
//	window.location.href = ASSERT_LIST_HTML+"?"+fcUrl;
	showResourceByDate(fc);
}

/**
 * 点击排序规则（下拉选）
 */
function comparableClick(){

	var comparableHelp = $(this).val();
	var fc = findCondition();
	fc.comparable = comparableHelp;
//	var fcUrl = nextHandUrlParam(fc);
//	window.location.href = ASSERT_LIST_HTML+"?"+fcUrl;
	showResourceByDate(fc);
}
/**
 * 点击下一页
 */
function nextPageClick(){
	//点击下一页
	var pageHelp = $("#nextPageId").prev().html();
	var totalPage = $("#totalPageId").val();
	//判断当前页数与总页数大小
	if(totalPage - pageHelp > 0){
		pageHelp++;
		var fc = findCondition();
		fc.page = pageHelp;
//		var fcUrl = nextHandUrlParam(fc);
//		window.location.href = ASSERT_LIST_HTML+"?"+fcUrl;
    	showResourceByDate(fc);
	}else{
		 $("#tipMsg").addClass("active").html("最后一页").show();
        function hideMsg(){
            $("#tipMsg").addClass("active").html("最后一页").hide()
        }
        setTimeout(hideMsg,1500);
	}
}


/**
 * 点击上一页
 */
function prePageClick(){

	var pageHelp = $("#prePageId").next().html();
	if(pageHelp - 0 > 1){
		pageHelp--;
		var fc = findCondition();
		fc.page = pageHelp;
//		var fcUrl = nextHandUrlParam(fc);
//		window.location.href = ASSERT_LIST_HTML+"?"+fcUrl;
    	showResourceByDate(fc);
	}else{
		 $("#tipMsg").addClass("active").html("第一页").show();
	    function hideMsg(){
	        $("#tipMsg").addClass("active").html("第一页").hide()
	    }
	    setTimeout(hideMsg,1500);
	}
}

/**
 * 点击跳转某一页
 */
function goPageClick(){

	var goPage = $("#goPageInput").val();
	var totalPage = $("#totalPageId").val();
	var fc = findCondition();
	if(isNaN(goPage) || "" == goPage || goPage < 1){
		fc.page = 1;
	}else if(goPage - totalPage > 0){
		fc.page = totalPage;
	}else{
		fc.page = goPage;
	}
	$("#goPageInput").val("");
//	var fcUrl = nextHandUrlParam(fc);
//	window.location.href = ASSERT_LIST_HTML+"?"+fcUrl;
	showResourceByDate(fc);
}

/**
 * 输入搜索条件。按enter健，触发模糊检索
 */
function likeClick(){
	var likeHelp = $("#likeId").val();
	var fc = findCondition();
	fc.likeInput = likeHelp;
//	var fcUrl = nextHandUrlParam(fc);
//	window.location.href = ASSERT_LIST_HTML+"?"+fcUrl;
	showResourceByDate(fc);
//	$("#likeId").keydown(function(e){
//		var currKey = 0;e = e||event;
//        currKey = e.keyCode||e.which||e.charCode;
//		if(currKey == 13){
//			var likeHelp = $(this).val();
//			var fc = findCondition();
//			fc.like = likeHelp;
//			showResourceByDate(fc);
//		}
//	});
}

/**
 * 点击“新建”按钮，跳转到新增页面  (待修改)
 */
function resourceAddClick(){
	//单选树
	var tree =  $("#treeLazy").dynatree("getActiveNode");
	if(tree != null){
//		if(!tree.hasChildren()){
//			var categoryTopId = $("#treeLazy").dynatree("getActiveNode").
//                                  getParent().getParent().data.key;
//            var categoryBottomId = $("#treeLazy").dynatree("getActiveNode").data.key;
//            //发送ajax请求，加载两个分类的属性模板
//            window.location.href = addHtml+"?categoryTopId="+categoryTopId+
//                                            "&categoryBottomId="+categoryBottomId;
//
//		}else{
//			window.location.href = addHtml;
//		}
		//根据nodeLevel来判断查找什么
        var nodeLevel = tree.getLevel();
        var categoryBottomId = tree.data.key;
        var assetListPosUrl=nextHandUrlParam(findCondition());
        //console.log(nodeLevel);
        //console.log("value="+categoryBottomId);
        switch(nodeLevel){
          //最外面一级分类，此处是“资产分类”四个字
          case 1:
//      	  window.location.href = addHtml;
			  window.location.href = addHtml+"?"+assetListPosUrl+"&flag=add";
        	  break;
        	  //“资产分类下一级”，此处是“硬件”，“软件”，“智能仪器”，“其他”
          case 2:
        	  var parent = tree.getParent().data.key;
        	  if("lastThirty" != parent && !tree.hasChildren()){
        		  //window.location.href = addHtml+"?categoryBottomId="+categoryBottomId+"&hasChild=0";
        		   window.location.href = addHtml+"?"+assetListPosUrl+"&categoryBottomId="+categoryBottomId+"&hasChild=0"+'&flag=add';
        	  }else{
        	  	  //记录当前页面状态(供返回使用)
        	  	  window.location.href = addHtml+"?"+assetListPosUrl+"&categoryBottomId="+categoryBottomId+"&hasChild=1"+'&flag=add';
        		  //window.location.href = addHtml+"?categoryBottomId="+categoryBottomId+"&hasChild=1";
        	  }
        	  break;
        	  //default分类
          default:
        	  if(!tree.hasChildren()){
        	  	  window.location.href = addHtml+"?"+assetListPosUrl+"&categoryBottomId="+categoryBottomId+"&hasChild=0"+'&flag=add';
//        		  window.location.href = addHtml+"?categoryBottomId="+categoryBottomId+"&hasChild=0";
        	  }else{
        	  	  window.location.href = addHtml+"?"+assetListPosUrl+"&categoryBottomId="+categoryBottomId+"&hasChild=1"+'&flag=add';
//      		  window.location.href = addHtml+"?categoryBottomId="+categoryBottomId+"&hasChild=1";
        	  }
        	  break;
        }
	}else{
		//window.location.href = addHtml;
		 window.location.href = addHtml+"?"+assetListPosUrl+"&flag=add";
	}
}

/**
 * 双击某一个资源跳转到详情页面
 */
function resourceDatail(){
	var resourceId = $(this).prev().find("[data-bind = 'id']").val();
	var fc = findCondition();
	var fcUrl = nextHandUrlParam(fc);
	window.location.href = assetDetailHtml+'?resourceId='+resourceId+"&"+fcUrl;
}
//点击列表页保存按钮后跳转
function addAsset(){
	var fc = findCondition();
	var fcUrl = nextHandUrlParam(fc);
	window.location.href = addHtml+"?"+fcUrl;
}
/**
 * 点击某一个资源名称跳转到详情页面
 */
function resourceDatailHelp(){
	var resourceId = $(this).parents("#dataHelp").find("[data-bind = 'id']").val();
	var fc = findCondition();
	var fcUrl = nextHandUrlParam(fc);
	window.location.href = assetDetailHtml+'?resourceId='+resourceId+"&"+fcUrl;
}
/**
 * 资源事件折线图
 */
function loadResEvent(){
	$.ajax({
		url:loadResourceEventUrl,
		type:"get",
		dataType:"json",
		success:function(result){
			//登录信息失效，ajax请求静态页面拦截
            onComplete(result);
			if(result.status == 1){
				var y = result.data;
				var x = result.dataSub;
        //无数据时,制造一些数据,使显示表格内容
        if (y.length===0) {
          y = [{
            data:[0,0,0,0,0,0,0,0,0,0,0,0],
            name:'无数据',
            type:"line",
          }];
        }
                var myChart = echarts.init(document.getElementById('echart-line'));
                var option = {
                		//智能仪器,硬件,软件,其他
						color:['#EDA6BB','#84C0E4','#F0D272','#FDB071'],
                		title: {
                	        text: '资产分类事件趋势图',
            	        	left:'25',
            	            top:10,
            	            textStyle: {
            	                fontSize: '12',
            	                fontWeight: 'lighter'
            	            }
                	    },
                	    tooltip: {
                	        trigger: 'axis'
                	    },
                	    legend: {
                	    	bottom:'10',
//                	    	orient:"vertical",
                	        // data:['硬件','软件','智能仪器','其他'],
                          data:['智能仪器','硬件','软件','其他'],
                	    },
                	    grid: {
                	        left: '3%',
                	        right: '4%',
                	        bottom: '15%',
                	        containLabel: true
                	    },
                	    xAxis: {
                	        type: 'category',
                	        boundaryGap: false,
                	        axisTick:{
                	        	interval:0
                	        },
                	        data: x
                	    },
                	    yAxis: {
                	        type: 'value'
                	    },

                	    series:  y


                	};
            	myChart.setOption(option);
			}
		},
		error:function(XMLHttpRequest){
			error_500(XMLHttpRequest.responseText);
		}
	});
}
/**
 * 点击加载部门的数据
 * @author 王雷
 */
function departClick(){
	var resourceId = $(this).prev().val();
	var newSelect = new selectMenu("sectionTreeId"+resourceId,
									"sectionMenuId"+resourceId,
									"departmentEditId"+resourceId,
									"departmentCodeEditId"+resourceId,
									departmentDataUrl);
	newSelect.onSelect('id','parent_id','name');
	newSelect.show();
}



//监听click事件,把container的高度赋值到左面,使左栏高度和谐
//function changeLeftHeight(){
//setTimeout(function(){
//  var height;
//  if ($(".rightCont")[0].style.display=="none") {
//    height = $("#right").outerHeight();
//  }else {
//    height = $(".rightCont").outerHeight();
//  }
//  $(".leftCol").css("height",height+26);
//},100)
//}
function setLeftHeight(){
	setTimeout(function(){      	
			if($('#treeLazy').height()>$('#right').height()+20){//左侧ztree内容高度大于右侧高度
				$('.leftList').css('height','');
				console.log($('#treeLazy').height()+'px');
				$('.leftCol').css('height',$('#treeLazy').outerHeight()+'px');
			}else{
				$('.leftList').css('height',$('#right').outerHeight()+20+'px');
//				$('.leftList').css('height',$('#right1').outerHeight()+20+'px');
				$('.leftCol').css('height',$('.leftList').outerHeight()+'px');
			}
		},300);	
	}
$(function(){
	//初始化左侧属性菜单及左侧纵边栏高度
	$('.leftList').css('height',$('.rightCont').height()+20+'px');
	getHistory();
	loadPageEachNum();
	/**
	 * 解析url，初始化页面的数据
	 */
	$("#right").hide();
	$("div.rightCont").hide();
	$("#right1").hide();
	var proUrl = preHandUrlParam();
	$("span.navlist-img3").addClass("active");
	$("ul.fl").find(".navlist-img3").addClass("active");
	var proMark = proUrl.mark;
	var isResList = proUrl.isResList;
	console.log(proMark);
	if(0 == isResList){
		if(7 == proMark){
			$("div.rightCont").show();
			$("#right1").hide();
			lastThirtyResource(); //加载最近三十天资产登记数量柱状图
			classfiyData();//加载资产分类图
			loadResEvent();	//资源事件折线图
		}
//		else if("libraryThirty" == proMark){
//			$("div.rightCont").h();
//		}
		else{
			$("#right").show();
//			$("#right1").hide();
			resourceBallCount(proUrl.mark);
			loadPageEachNum(function(){
				showResourceByDate(proUrl);
			});
		}
		//往页面上写查询条件
		initConditionByUrl(proUrl);
	}else{
		$("div.rightCont").show();
		lastThirtyResource(); //加载最近三十天资产登记数量柱状图
		classfiyData();//加载资产分类图
		loadResEvent();	//资源事件折线图
	}

    /**
     * 最近30天登记资产分类柱状图刷新
     * */
    var updateColumn = document.getElementById("upResource_column");
    updateColumn.onclick = function () {
        lastThirtyResource();
    }
    /**
     * 资产分类图表刷新
     * */
    var updateClassify = document.getElementById("upClassify");
    updateClassify.onclick = function () {
        classfiyData();
    }
	
    var tree = $("#treeLazy");
	//点击左侧树，发送ajax请求
    tree.dynatree({
        //树的激活状态
    	onClick: function(node) {
    	  var test = node.span;
    	  var li=node.li;
		  var leftListHeight;
        //选中一个树枝后改变样式
      // var trees = $("#treeLazy").dynatree("getRoot").getChildren();
         mark = node.data.key;
//		 console.log(mark);	
        //window.localStorage.setItem('mark',mark);
        //根据nodeLevel来判断查找什么
        var title = node.data.title;
        //window.localStorage.setItem('title',title);
        var nodeLevel = node.getLevel();
        //window.localStorage.setItem('nodeLevel',nodeLevel);
        var parentKey=node.getParent().data.key;
        //window.localStorage.setItem('parentKey',parentKey);
    	var expandLeftHeight;
    	var queryExpandLeftHeight;
        //资产分析  .rightCont 其余 #right
        //资产分析
        if(7 == mark ||"lastThirty" == mark){
        	$("#right").hide();
        	$("div.rightCont").show();
        	$("#right1").hide();
        	$('.takePlace').addClass('dn');//点击左侧dynatree菜单默认隐藏右侧站位区域
        	lastThirtyResource();
        	classfiyData();
        	loadResEvent();	//资源事件折线图
        	$('.leftList').css('height',$('.rightCont').outerHeight()+20+'px');
        	$('.leftCol').css('height',$('.leftList').outerHeight()+'px');
        }else if(7 != mark && "lastThirty" != node.data.key && "libraryThirty" != node.data.key){
//      	console.log(node.data.key);
        	$("#right").show();
        	$("div.rightCont").hide();
        	$("#right1").hide();
        	//console.log(node.getParent().data.key);
//   		console.log(nodeLevel)
        	if(1 != nodeLevel && "lastThirty" == node.getParent().data.key){
        		$("#right1").hide();
            	//调最近30天的接口(最近30天登记的资产);
            	var fc = initCondition();
                fc.mark = mark;
//              fc.flag = "lastThirtyFlag";
				fc.assetListFlag="lastThirtyFlag";
                fc.titleSub = title;
//        		var fcUrl = nextHandUrlParam(fc);
//        		window.location.href = ASSERT_LIST_HTML+"?"+fcUrl;
                showResourceByDate(fc);
                resourceBallCount(mark);
          }else if(1 != nodeLevel && "lastThirty" != node.getParent().data.key && "libraryThirty" !=node.getParent().data.key){
          		$("#right1").hide();
            	//资产分类。调分类的接口
            	var fc = initCondition();
            	fc.mark = mark;
            	fc.titleSub = title;
//          	fc.flag="categoryFlag";
				fc.assetListFlag="categoryFlag";
//            	var fcUrl = nextHandUrlParam(fc);
//            	window.location.href = ASSERT_LIST_HTML+"?"+fcUrl;
            	showResourceByDate(fc);
          }else if(1 == nodeLevel && "lastThirty" != node.data.key && "libraryThirty" !=node.data.key){
          		$("#right1").hide();
          		console.log(node.data.key)
            	//点击“资产分类”四个字的时候,查找所有分类的接口
            	var fc = initCondition();
            	fc.mark = 0;
            	fc.titleSub = title;
//          	fc.flag="categoryFlag";
				fc.assetListFlag="categoryFlag";
//            	var fcUrl = nextHandUrlParam(fc);
//            	window.location.href = ASSERT_LIST_HTML+"?"+fcUrl;
            	showResourceByDate(fc);
           }
        }
        //备件库
        if(7 != mark && nodeLevel == 1 && node.data.key =="libraryThirty"){
//      	console.log(nodeLevel);
			$("#librarySpare").html('备件库');
      		$("#right").hide();
    		$("div.rightCont").hide();
    		$("#right1").show();
    		$("div.right2-content").hide()
    		$('.leftList').css('height',$('#right1').outerHeight()+20+'px');
			$('.leftCol').css('height',$('.leftList').outerHeight()+'px');
       	}else if(1 != nodeLevel && node.getParent().data.key == "libraryThirty"){
    			$("#right").hide();
    			$("div.rightCont").hide();
    			$("#right1").show();
    		if(1 != nodeLevel && node.getParent().data.key == "libraryThirty" && mark == 100){
    			$("#librarySpare").html('备件列表');
    			$("#right1 .right1-content").show();	
    		}
    		if(1 != nodeLevel && node.getParent().data.key == "libraryThirty" && mark == 101){
    			$("#librarySpare").html('入库记录');
    			$("#right1 .right1-content").hide();
    			$("div.right2-content").show();
    		}
//  		if(1 != nodeLevel && node.getParent().data.key == "libraryThirty" && mark == 102){
//  			
//  		}
    	}
        
      }
     
    });
    var dataDiv = $("#tableWrap");
    //点击每个资源前面的小框选中或者取消选中
    dataDiv.on("click","#checkBoxId",res_click);
    //点击升序
    $("#sort").on("click","#sortUp",sortUpClick);
    //点击降序
    $("#sort").on("click","#sortDown",sortDownClick);
    //更换排序规则
	$("#comparableSel").change(comparableClick);
	//点击下一页
	$("#nextPageId,#nextPageSmallId").click(nextPageClick);
	//点击上一页
	$("#prePageId,#prevPageSmallId").click(prePageClick);
	//点击跳转到某一页
	$("#goPageId").click(goPageClick);
	//模糊搜索
	$("#AssetFind").click(likeClick);
	//点击新建按钮
	$("#createHelp,#create,.addButton").click(resourceAddClick);
	//双击某一个资源，到详情页面
	dataDiv.on("dblclick","div.tableCol-2",resourceDatail);
	//点击某个资源的名称,到详情页面
	dataDiv.on("click","#nameClickId",resourceDatailHelp);
	//点击某个资源的部门，加载所有的部门信息
    dataDiv.on("click","button.depart",departClick);
	//资产分类事件趋势图更新
	$("div.echart-2 p.update").click(loadResEvent);
	//添加新设备
	$("#addEquipment").click(function(){$("#createNewUserModal").modal('show')})
	//入库
	$("#equipmentStorage").click(function(){$("#createStorage").modal('show')})
	//出库
	$("#equipmentDelivery").click(function(){$("#createOutStorage").modal('show')})
	//入库期点击
	$(".right1-content-twc").off().on('click',function(){
		$(this).addClass('active');
		$(this).siblings().removeClass('active');
	})
  });

  //监听click事件,把container的高度赋值到左面,使左栏高度和谐
  //$("#container").click(changeLeftHeight);


/**
 * 更新点击事件
 * */
function updateClick(resourceId){
    var updateBtn = document.getElementById("updateBtn"+resourceId);
        updateBtn.onclick = function () {
            //获取资产状态值
            var res_statusSelect = document.getElementById("statusSel"+resourceId);
            var res_statusValue = res_statusSelect.options[res_statusSelect.selectedIndex].value;
            //获取部门值
            var res_dept = document.getElementById("departmentCodeEditId"+resourceId).value;
            //获取使用人值
            var res_userSelect = document.getElementById("userSel"+resourceId);
            var res_userValue = res_userSelect.options[res_userSelect.selectedIndex].value;

            updateResInfo(resourceId,res_statusValue,res_dept,res_userValue);
    }
}
 /**
 * 资产列表资产状态，部门，使用人的更新
 * */
function updateResInfo(resourceId,res_statusValue,res_dept,res_userValue){

     if("无" == res_statusValue || "" == res_statusValue || null == res_statusValue){
         res_statusValue = 0;
     }
    $.ajax({
        traditional: true,
        url:updateResListInfoUrl,
        dataType:"json",
        type:'POST',
        data:{resourceId:resourceId,resStatusId:res_statusValue,deptId:res_dept,userId:res_userValue},
        contentType:'application/x-www-form-urlencoded; charset=UTF-8',//防止乱码
	    //complete: onComplete,
        success: function (data) {

            //登录信息失效，ajax请求静态页面拦截
            onComplete(data);

            //console.log(data);
            $("#updateBtn"+resourceId).hide();

            if ("true" == data.code) {
                $("#tipMsg").addClass("active").html(data.msg).show();
            } else {
                $("#tipMsg").addClass("active").html(data.msg).show();
            }
            function hideMsg(){
                $("#tipMsg").addClass("active").html(data.msg).hide()
            }
            setTimeout(hideMsg,2000);
            var fc = findCondition();
//            var fcUrl = nextHandUrlParam(fc);
//            window.location.href = ASSERT_LIST_HTML+"?"+fcUrl;
        	showResourceByDate(fc);
        },
        error:function(XMLHttpRequest){
			error_500(XMLHttpRequest.responseText);
		}
    });
}

/**
 * 删除数组中的某一个元素
 * @param arr
 * @param val 元素值
 */
function removeByValue(arr, val) {
	  for(var i=0; i<arr.length; i++) {
	    if(arr[i] == val) {
	      arr.splice(i, 1);
	      return;
	    }
	  }
}

/**
 * 点击部门右边的小三角，加载该资产对应的部门.
 * ”更新“按钮先隐藏，点击小三角后，显示更新按钮和选项
 * */
function loadResDeptInfo() {

    $("#tableWrap").on("click","input.depart",function () {
        var resourceId = $(this).parents("#updateResDiv").find("[data-bind='id']").val();
        $("#updateBtn"+resourceId).show();
        updateClick(resourceId);
    });
}

/**
 * 点击资产状态右边的小三角，加载该资产对应的资产状态.
 * ”更新“按钮先隐藏，点击小三角后，显示更新按钮和选项
 * */
function loadResStatusInfo() {

        $("#tableWrap").on('click',"div.updateStatusFlag",function () {
            var resourceId = $(this).parents("#updateResDiv").find("[data-bind='id']").val();
            //console.log(resourceId);
            //获取当前资产状态值
            var res_statusSelect = document.getElementById("statusSel"+resourceId);
            var res_statusValue = res_statusSelect.options[res_statusSelect.selectedIndex].value;
            $("#updateBtn"+resourceId).show();
            $("#statusSel"+resourceId).render(resStatusData,resStatusValue);
            $("#statusSel"+resourceId).selectpicker('val',res_statusValue);
            $('#updateResDiv .selectpicker').selectpicker('refresh');
            updateClick(resourceId);
        });
}

var successReturn = 1; //请求成功
/**
 * 点击使用人右边的小三角，加载该资产对应的使用人.
 * ”更新“按钮先隐藏，点击小三角后，显示更新按钮和选项
 * */
function loadResUpdateInfo() {
    var de = {
        use_person_id_name: {
            value: function () {
                return this.id;
            }
        }
    };

    //$("#resUser"+resourceId).unbind('click').click(function () {
    $("#tableWrap").on("click","div.updateUserFlag", function () {
        var resourceId = $(this).parents("#updateResDiv").find("[data-bind='id']").val();
        $("#updateBtn"+resourceId).show();
        var thisHelp = $(this).find("select");
        //获取flag，区分获取查找哪个
        var flag = thisHelp.attr("name");
        $.ajax({
            url: loadResourceHelpUrl,
            type: "get",
            data: {"flag": flag},
            dataType: "json",
	    	complete: onComplete,
            success: function (result) {
                //登录信息失效，ajax请求静态页面拦截
                onComplete(result);
                if (result.status == successReturn) {
                    //获取当前使用人值
                    var res_userSelect = document.getElementById("userSel"+resourceId);
                    var res_userValue = res_userSelect.options[res_userSelect.selectedIndex].value;
                    var data = result.data;
                    thisHelp.render(data, de);
                    thisHelp.selectpicker("val",res_userValue);
                    $('#updateResDiv .selectpicker').selectpicker('refresh');
                }
            },
            error:function(XMLHttpRequest){
    			error_500(XMLHttpRequest.responseText);
    		}
        });
        updateClick(resourceId);
    });
}
$('.selectpicker').selectpicker({noneSelectedText:' '});
