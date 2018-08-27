/**
 * 合同管理 Created by EKuter-si.yu on 2017/1/12.
 */
var timeIntervalData,timeIntervalValue;//时间下拉选的数据
var contractStatusData,contractStatusValue;//合同状态下拉选数据
timeIntervalData = [
    {
        value:"",
        timeIntervalVal:"---选择---"
    },
    {
        value:34,
        timeIntervalVal:"所有时间"
    },
    {
        value:30,
        timeIntervalVal:"今天"
    },
    {
        value:31,
        timeIntervalVal:"昨天"
    },
    {
        value:32,
        timeIntervalVal:"本周"
    },
    {
        value:33,
        timeIntervalVal:"本月"
    },
    {
        value:35,
        timeIntervalVal:"自定义"
    }
];
timeIntervalValue = {
    timeIntervalVal:{
        value:function(){
            return this.value;
        }
    }
};
contractStatusData = [
    {
        value:"",
        conStatusVal:"---选择---"
    },
    {
        value:85,
        conStatusVal:"拟定中"
    },
    {
        value:86,
        conStatusVal:"审阅中"
    },
    {
        value:87,
        conStatusVal:"未执行"
    },
    {
        value:88,
        conStatusVal:"履行中"
    },
    {
        value:89,
        conStatusVal:"已过期"
    },
    {
        value:90,
        conStatusVal:"未知"
    }
];
contractStatusValue = {
    conStatusVal:{
        value:function(){
            return this.value;
        }
    }
};
var contractDetail = 'contractDetail.html';

/**
 * 加载合同数据
 * */
var count = 10;//页面加载条数为10条
function loadContractData(paramObj){
    $.ajax({
        traditional:true,
        url:loadContractDataUrl,
        dataType:"json",
        type:'POST',
        async:true,
        data:{page:paramObj.currPage,count:count,searchText:paramObj.searchText,careAbout:paramObj.careAbout,
            unKnow:paramObj.unKnow,firmName:paramObj.firmName,sortSelect:paramObj.sortSelect,sort:paramObj.sort,conStatus:paramObj.conStatus,
            expire:paramObj.expire,today_expire:paramObj.today_expire,future_expire:paramObj.future_expire,checking:paramObj.checking,
            type:paramObj.typeIds,contract_amount_one:paramObj.conPrice_one,contract_amount_two:paramObj.conPrice_two,
            contract_amount_three:paramObj.conPrice_three,contract_amount_four:paramObj.conPrice_four},
        contentType:'application/x-www-form-urlencoded; charset=UTF-8',//防止乱码
        success:function(data){
			
            //登录信息失效，ajax请求静态页面拦截
            onComplete(data);
			console.log(data);
            $("#contract_body").show();
            //分页区域的样式
            var contractPageClass = {
                    upConPage:{
                        class:function(){
                            if(this.currPage - 1 == 0 || this.currPage == 0){
                                return "title-page-left title-page";
                            }else{
                                return "title-page-left title-page active";
                            }
                        }
                    },
                    nextConPage:{
                        class:function(){
                            if(this.totalPage - 1 == 0 || this.totalPage-this.currPage == 0){
                                return "title-page-right title-page";
                            }else{
                                return "title-page-right title-page active";
                            }
                        }
                    },
                    nextPage:{
                    	class:function(){
                    		if(this.totalPage - 1 == 0 || this.totalPage-this.currPage == 0){
                    			return "di pageChange-span-down";
                    		}else{
                    			return "di pageChange-span-down active";
                    		}
                    	}
                    },
                    prePage:{
                        class:function(){
                    		if(this.currPage - 1 == 0 || this.currPage == 0){
                    			return "di pageChange-span-up";
                    		}else{
                    			return "di pageChange-span-up active";
                    		}
                    	}
                    },
                    prePageId:{
            			class:function(){
            				if(this.currPage - 1 == 0 || this.currPage == 0){
            					return "pageChange-span1 pageChange-span di disabled";
            				}else{
            					return "pageChange-span1 pageChange-span di";
            				}
            			}
            		},
            		nextPageId:{
            			class:function(){
            				if(this.totalPage - 1 == 0 || this.totalPage-this.currPage == 0){
            					return "pageChange-span3 pageChange-span di disabled";
            				}else{
            					return "pageChange-span3 pageChange-span di";
            				}
            			}
            		},
            		goPageInput:{
            			disabled:function(){
            				if(this.totalPage - 1 == 0 || this.totalPage == 0){
            					return "suibian";//这里return的不能为""，其余的什么都可以。
            				}
            			}
            		}
                }
            var contractPage;
            var len = data.length;
 
            if(len != 0){
                //right-table-body-status perform  //style="display: none"
                //合同状态的样式
                var conClass = {
                    conStatusClass:{
                        class:function(){
                            if("履行中" == this.contract_status){
                                return "right-table-body-status perform";
                            }else if("已过期" == this.contract_status){
                                return "right-table-body-status overdue";
                            }else if("未执行" == this.contract_status){
                                return "right-table-body-status unexecuted";
                            }else if("未知状态" == this.contract_status){
                                return "right-table-body-status unknown";
                            }else if("拟定中" == this.contract_status){
                                return "right-table-body-status drawUp";
                            }else if("审阅中" == this.contract_status){
                                return "right-table-body-status underReview";
                            }
                        }
                    },
                    checkBox:{
                        style:function(){
                            if(28 == this.contract_type){
                                if((this.approval_status == 79  || this.approval_status == 82)
                                    && this.create_enterprise == this.party_A){
                                    return "";
                                }else{
                                    return "display: none";
                                }
                            }else{
                                return "";
                            }
                        }
                    }
                };
                //绑定合同数据
                $('.contractNoData').addClass('dn');
                 $('#pageMsg').show();
                $('#contractPage').show();
                $('.right-body-table').show();
                $("#contract_body").render(data,conClass);

                var len  = data.length;
                var totalPage = data[0].pagenumbers;
                var totalNum = data[0].total_numbers;

                var beginCount = (paramObj.currPage-1)*(count)+1;
                var endCount;
                if(len - count == 0){
                    endCount = beginCount-1 + count;
                }else{
                    endCount = beginCount-1 + (len)%(count);
                }

                contractPage = {
                    "beginCount":beginCount,
                    "endCount":endCount,
                    "totalCount":totalNum,
                    "currPage":paramObj.currPage,
                    "totalPage":totalPage
                }

                //向页面绑定分页数据
//                $("#contractPage").render(contractPage,contractPageClass);
            }else{
            	contractPage = {
                        "beginCount":0,
                        "endCount":0,
                        "totalCount":0,
                        "currPage":0,
                        "totalPage":0
                    }
                $(".right-body-table").hide();
                $('.contractNoData').removeClass('dn');
                $('#pageMsg').hide();
                $('#contractPage').hide();
            }
            //绑定两个分页区域的数据
        	$("#contractPage").render(contractPage,contractPageClass);
        	$("#pageMsg").render(contractPage,contractPageClass);

        },
        error:function(XMLHttpRequest){
			error_500(XMLHttpRequest.responseText);
		}

    });
}


/**
 * 筛选组织查询条件参数
 * */
function selectParam(){

    var paramObj = new Object();

//  //条件：我关注的
//  if($("#cAIcon").hasClass("active")){
//      paramObj.careAbout = true;
//  }else{
//      paramObj.careAbout = false;
//  }
    //条件：所有未知的
    if($("#uKIcon").hasClass("active")){
        paramObj.unKnow = true;
    }else{
        paramObj.unKnow = false;
    }
    //条件：合同厂商
    var firmName = $("select.firmName option:selected").val();
    if(""==firmName || "所有厂商" == firmName){
        paramObj.firmName = null;
    }else{
        paramObj.firmName = firmName;
    }
    //条件：已生效合同
    //var timeInterval = $("select.timeInterval option:selected").val();
    //if("" == timeInterval){
    //    paramObj.timeInterval = null;
    //}else{
    //    paramObj.timeInterval = timeInterval;
    //}
    //查询条件：排序条件
    var sortSelectVal = $("#sortSelect option:selected").val();
    if("" == sortSelectVal){
        paramObj.sortSelect = "contract.create_time";
    }else{
        paramObj.sortSelect = sortSelectVal;
    }

    //查询条件：排序
    if($("#upSort").hasClass("active")){
        paramObj.sort = "ASC"; //升序
    }
    if($("#downSort").hasClass("active")){
        paramObj.sort = "DESC"; //降序
    }

    //条件：合同状态
    var conStatusVal = $("select.conStatus option:selected").val();
    if("" == conStatusVal){
        paramObj.conStatus = null;
    }else{
        paramObj.conStatus = conStatusVal;
    }
    //条件：合同到期时间
    if($("#expire").hasClass("active")){//已到期
        paramObj.expire = true;
    }else{
        paramObj.expire = false;
    }
    if($("#today_expire").hasClass("active")){//今天到期
        paramObj.today_expire = true;
    }else{
        paramObj.today_expire = false;
    }
    if($("#future_expire").hasClass("active")){//30天后到期
        paramObj.future_expire = true;
    }else{
        paramObj.future_expire = false;
    }
    if($("#checking").hasClass("active")){//待审阅
    	paramObj.checking = true;
    }else{
    	paramObj.checking = false;
    }
    //条件：合同类型
    var typeIds = [];
    if($("#type_1").hasClass("active")){
        typeIds.push($("#type_1_id").val());
    }
    if($("#type_2").hasClass("active")){
        typeIds.push($("#type_2_id").val());
    }
    if($("#type_3").hasClass("active")){
        typeIds.push($("#type_3_id").val());
    }
    if($("#type_4").hasClass("active")){
        typeIds.push($("#type_4_id").val());
    }
    if($("#type_5").hasClass("active")){
        typeIds.push($("#type_5_id").val());
    }
    if("" == typeIds){
        paramObj.typeIds = null;
    }else{
        paramObj.typeIds = typeIds;
    }
    //合同金额
    if($("#conPrice_one").hasClass("active")){//小于100万
        paramObj.conPrice_one = true;
    }else{
        paramObj.conPrice_one = false;
    }
    if($("#conPrice_two").hasClass("active")){//100万-500万
        paramObj.conPrice_two = true;
    }else{
        paramObj.conPrice_two = false;
    }
    if($("#conPrice_three").hasClass("active")){//500万-1000万
        paramObj.conPrice_three = true;
    }else{
        paramObj.conPrice_three = false;
    }
    if($("#conPrice_four").hasClass("active")){//1000万以上
        paramObj.conPrice_four = true;
    }else{
        paramObj.conPrice_four = false;
    }

    //条件：当前页数
    var currPage = $("#currPage").val();
    if("" == currPage || 0 == currPage){
        paramObj.currPage = 1;
    }else{
        paramObj.currPage = currPage;
    }
    //获取模糊查询条件
    var searchText = $("#contractSearch").val();
    if("" == searchText){
        paramObj.searchText = null;
    }else{
        paramObj.searchText = searchText;
    }

    return paramObj;
}

/**
 * 根据合同状态，条件查询
 * */
function loadContractDataByConStatus(){
    $("#contractStatus").change(function () {
        var conStatusSelect = document.getElementById("conStatusId");
        var conStatusValueId = conStatusSelect.options[conStatusSelect.selectedIndex].value;

        $("#conStatusId").selectpicker('val',conStatusValueId);
        $('#contractStatus .selectpicker').selectpicker('refresh');

        if("" == conStatusValueId){
            var paramObj = selectParam();
            paramObj.conStatus = null;
            loadContractData(paramObj);
        }else{
            var paramObj = selectParam();
            paramObj.conStatus = conStatusValueId;
            loadContractData(paramObj);
        }
    })
}


/**
 * 切换排序条件加载
 * */
function loadBySortSelect(){
    var sortSelectVal = $("#sortSelect option:selected").val();
    var paramObj = selectParam();
    paramObj.sortSelect = sortSelectVal;
    loadContractData(paramObj);
}

/**
 * 排序顺序：正序/倒序 加载
 * */
function contractSortClick(){
    //点击正序加载
    $("#upSort").click(function () {
        if($("#downSort").hasClass("active")){
            $("#upSort").addClass("active");
            $("#downSort").removeClass("active");
            var paramObj = selectParam();
            paramObj.sort = "ASC";
            loadContractData(paramObj);
        }
    });
    //点击倒序加载
    $("#downSort").click(function () {
        if($("#upSort").hasClass("active")){
            $("#downSort").addClass("active");
            $("#upSort").removeClass("active");
            var paramObj = selectParam();
            paramObj.sort = "DESC";
            loadContractData(paramObj);
        }
    });
}
/**
 * 上一页
 */
function prePageCon(){
	//从页面获取当前页数
	var currPage = $("#currPage").val();
	if(currPage - 0 > 1){
	      currPage--;
	}else{
	  
	    $("#tipMsg").addClass("active").html("第一页").show();
	    function hideMsg(){
	        $("#tipMsg").addClass("active").html("第一页").hide()
	    }
	    setTimeout(hideMsg,1500);
	}
	//清空列表
	//$("#contract_body").html("");
	var paramObj = selectParam();
	paramObj.currPage = currPage;
	//console.log(paramObj);
	loadContractData(paramObj);
}
/**
 * 下一页
 */
function nextPageCon() {

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
    //console.log(currPage);
    //清空列表
    //$("#contract_body").html("");
    //加载数据
    var paramObj = selectParam();
    paramObj.currPage = currPage;
    //console.log(paramObj);
    loadContractData(paramObj);
}
/**
 * 跳转到某一页
 */
function toPage(){
	var goPage = $("#goPageInput").val();
	var totalPage = $("#totalPageId").val();
	var fc = selectParam();
	if(isNaN(goPage) || "" == goPage || goPage < 1){
		fc.currPage = 1;
	}else if(goPage - totalPage > 0){
		fc.currPage = totalPage;
	}else{
		fc.currPage = goPage;
	}
	$("#goPageInput").val("");
	loadContractData(fc);
}
/**
 * 上下页跳转操作
 * */
function upOrNextPage(){

    var upConPage = document.getElementById("upConPageId");
    var nextConPage = document.getElementById("nextConPageId");

    /**
     * 点击上一页操作
     * */
    upConPage.onclick = prePageCon;
    /**
     * 点击下一页操作
     * */
    nextConPage.onclick = nextPageCon;
}

/**
 * 加载合同厂商的名称
 * */
function loadFirmName(flag,selectOne){
    //$("#firm .btn").unbind('click').click(function () {
        //var thisHelp = $(this).siblings("select");
        $.ajax({
            traditional: true,
            url: loadFirmNameUrl,
            dataType: "json",
            type: 'POST',
            async: true,
            data: '',
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',//防止乱码
            success: function (data) {
				//登录信息失效，ajax请求静态页面拦截
                onComplete(data);
                //console.log(data);
                var len = data.length;
                if(len != 0){
                    $("#firmId").render(data);
                    $("#firmId").selectpicker('val',"所有厂商");
                    $('#firm .selectpicker').selectpicker('refresh');
                    if(flag){selectOne();}
                }
            },
            error:function(XMLHttpRequest){
    			error_500(XMLHttpRequest.responseText);
    		}
        });
    //});

    $("#firm .dropdown-menu").click(function () {
        //$("#firm .filter-option").show();
        var firmName = $("select.firmName option:selected").val();
        var paramObj = selectParam();
        if(firmName == "所有厂商"){
            paramObj.firmName = null;
        }else{
            paramObj.firmName = firmName;
        }
        //console.log(paramObj);
        loadContractData(paramObj);
    });
}

/**
 * 根据已生效合同时间，条件查询
 * */
//function loadContractDataByTimeInterval(){
//
//    $("#timeIntervalId").change(function () {
//        var timeIntervalSelect = document.getElementById("selectTimeId");
//        var timeIntervalValueId = timeIntervalSelect.options[timeIntervalSelect.selectedIndex].value;
//
//        $("#selectTimeId").selectpicker('val',timeIntervalValueId);
//        $('#timeIntervalId .selectpicker').selectpicker('refresh');
//
//        if("" == timeIntervalValueId){
//            var paramObj = selectParam();
//            paramObj.timeInterval = null;
//            loadContractData(paramObj);
//        }else if("35" != timeIntervalValueId){
//            var paramObj = selectParam();
//            paramObj.timeInterval = timeIntervalValueId;
//            //console.log(paramObj);
//            loadContractData(paramObj);
//        }else{
//            $("#customTime").modal('show');
//            $("#customTime input").val("");
//            $("button.btn-keep").click(function(){
//                var paramObj = selectParam();
//                paramObj.start_time = $("[name='startDate']").val();
//                paramObj.end_time = $("[name='endDate']").val();
//                //console.log(paramObj.start_time+"////"+paramObj.end_time);
//                //如果某一个时间没有输入，则返回“所有时间”数据
//                if("" == paramObj.start_time || "" == paramObj.end_time){
//                    paramObj.timeInterval = "";
//                }else{
//                    paramObj.timeInterval = "35";
//                }
//                $("#customTime").modal('hide');
//                loadContractData(paramObj);
//            });
//        }
//
//    });
//}

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
 * 合同类型（多选）：条件加载数据
 * */
function contractTypeLoad(){

    var typeIds = [];
    //买卖合同：条件加载
    $("#type_1_id").click(function () {
		
		if($("#type_1").hasClass("active")){
            $("#type_1").removeClass("active");
            removeByValue(typeIds,$("#type_1_id").val());
        }else{
            $("#type_1").addClass("active");
            typeIds.push($("#type_1_id").val());
        }
        var paramObj = selectParam();
        paramObj.typeIds = typeIds;
        //console.log(paramObj);
        loadContractData(paramObj);
    });
    //建筑施工合同：条件加载
    $("#type_2_id").click(function () {

        if($("#type_2").hasClass("active")){
            $("#type_2").removeClass("active");
            removeByValue(typeIds,$("#type_2_id").val());
        }else{
            $("#type_2").addClass("active");
            typeIds.push($("#type_2_id").val());
        }
        var paramObj = selectParam();
        paramObj.typeIds = typeIds;
        //console.log(paramObj);
        loadContractData(paramObj);
    });
    //技术合同：条件加载
    $("#type_3_id").click(function () {

        if($("#type_3").hasClass("active")){
            $("#type_3").removeClass("active");
            removeByValue(typeIds,$("#type_3_id").val());
        }else{
            $("#type_3").addClass("active");
            typeIds.push($("#type_3_id").val());
        }
        var paramObj = selectParam();
        paramObj.typeIds = typeIds;
        //console.log(paramObj);
        loadContractData(paramObj);
    });
    //服务合同：条件加载
    $("#type_4_id").click(function () {

        if($("#type_4").hasClass("active")){
            $("#type_4").removeClass("active");
            removeByValue(typeIds,$("#type_4_id").val());
        }else{
            $("#type_4").addClass("active");
            typeIds.push($("#type_4_id").val());
        }
        var paramObj = selectParam();
        paramObj.typeIds = typeIds;
        //console.log(paramObj);
        loadContractData(paramObj);
    });
    //其他合同：条件加载
    $("#type_5_id").click(function () {

        if($("#type_5").hasClass("active")){
            $("#type_5").removeClass("active");
            removeByValue(typeIds,$("#type_5_id").val());
        }else{
            $("#type_5").addClass("active");
            typeIds.push($("#type_5_id").val());
        }
        var paramObj = selectParam();
        paramObj.typeIds = typeIds;
        //console.log(paramObj);
        loadContractData(paramObj);
    });
}

/**
 * 合同资金区间（多选）：条件加载数据
 * */
function contractPriceLoad(){
    //小于100万

    $("#conPrice_one_id").click(function () {
        var paramObj = selectParam();
        if($("#conPrice_one").hasClass("active")){

            $("#conPrice_one").removeClass("active");
            paramObj.conPrice_one = false;
        }else{
            $("#conPrice_one").addClass("active");
            paramObj.conPrice_one = true;
        }
        //console.log(paramObj);
        loadContractData(paramObj);
    });
    //100万-500万
    $("#conPrice_two_id").click(function () {
        var paramObj = selectParam();
        if($("#conPrice_two").hasClass("active")){

            $("#conPrice_two").removeClass("active");
            paramObj.conPrice_two = false;
        }else{
            $("#conPrice_two").addClass("active");
            paramObj.conPrice_two = true;
        }
        //console.log(paramObj);
        loadContractData(paramObj);
    });
    //500万-1000万
    $("#conPrice_three_id").click(function () {
        var paramObj = selectParam();
        if($("#conPrice_three").hasClass("active")){

            $("#conPrice_three").removeClass("active");
            paramObj.conPrice_three = false;
        }else{
            $("#conPrice_three").addClass("active");
            paramObj.conPrice_three = true;
        }
        //console.log(paramObj);
        loadContractData(paramObj);
    });
    //1000万以上
    $("#conPrice_four_id").click(function () {
        var paramObj = selectParam();
        if($("#conPrice_four").hasClass("active")){

            $("#conPrice_four").removeClass("active");
            paramObj.conPrice_four = false;
        }else{
            $("#conPrice_four").addClass("active");
            paramObj.conPrice_four = true;
        }
        //console.log(paramObj);
        loadContractData(paramObj);
    });

}

/**
 * 模糊查询:条件加载
 * */
function search(){
    //模糊查询:回车查询
    $("#contractSearch").keydown(function(e){
        var currKey = 0;e = e||event;
        currKey = e.keyCode||e.which||e.charCode;
        //回车搜索
        if(currKey == 13){
            //获取模糊查询条件
            var searchText = document.getElementById("contractSearch").value ;
            if("" == searchText){
                $("#tipMsg").addClass("active").html("请输入查询条件").show();
                function hideMsg(){
                    $("#tipMsg").addClass("active").html("请输入查询条件").hide()
                }
                setTimeout(hideMsg,1500);
            }else{
                var paramObj = selectParam();
                paramObj.searchText = searchText;
                //console.log(paramObj);
                loadContractData(paramObj);
            }
        }
    });
    //模糊查询:点击查询
    $("#clickSearch").click(function(){
        var searchText = document.getElementById("contractSearch").value ;
        if("" == searchText){
            $("#tipMsg").addClass("active").html("请输入查询条件").show();
            function hideMsg(){
                $("#tipMsg").addClass("active").html("请输入查询条件").hide()
            }
            setTimeout(hideMsg,1500);
        }else{
            var paramObj = selectParam();
            paramObj.searchText = searchText;
            loadContractData(paramObj);
        }
    });
}

/*----------------------------------------开始----------------------------------------------*/
/*------------------------------------合同删除操作------------------------------------------*/
/**
 * 点击每条合同前面的小方块
 * 1.给小方框加上样式
 * 2.获取当前选中的合同条数，改变“删除”的样式，只有的选中了合同，才可以点击“删除”
 */
function conChooseClick(){

    if($(this).hasClass("active")){
        $(this).removeClass("active");
         $(this).find('i').removeClass('active');
    }else{
        $(this).addClass("active");
        $(this).find('i').addClass('active');
    }
    var con_ids = getCheckCon();
    //console.log(con_ids);
    changeAddConClass(con_ids);
}
/**
 * 获取当前合同未关联的资产列表中选中资产的ids
 * @returns {Array}
 */
function getCheckCon(){
    var con_ids = [];
    var $checkPro = $("#contract_body").find("i.active").parents('.right-table-body').prev();
    $checkPro.each(function(){
        con_ids.push($(this).val());
    });
    return con_ids;
}
/**
 * 改变“附加合同”样式
 * @param res_ids
 */
function changeAddConClass(con_ids){

    if(con_ids.length == 0){
        $("#deleteCon").addClass("default");
    }else{
        $("#deleteCon").removeClass("default");
    }
}
/**
 * 点击删除
 */
function conDeleteClick(){
    var ids = [];
    ids = getCheckCon();
    if(ids != 0){
        //console.log(ids);
        $("#pupDelete").modal('show');
        $("#delConfirm").click(function(){
            $("#pupDelete").modal('hide');
            $.ajax({
                url:contractDeleteUrl,
                traditional: true,
                data:{"ids":ids},
                type:"post",
                dataType:"json",
                success:function(data){

                    //登录信息失效，ajax请求静态页面拦截
                    onComplete(data);

                    //console.log(data);
                    if ("true" == data.code) {
                        $("#tipMsg").addClass("active").html(data.msg).show();
                    } else {
                        $("#tipMsg").addClass("active").html(data.msg).show();
                    }
                    function hideMsg(){
                        $("#tipMsg").addClass("active").html(data.msg).hide()
                    }
                    setTimeout(hideMsg,2000);
                    //清除选中的样式
                    $("#contract_body").find(".table-col1").removeClass("active");
                    $("#contract_body").find("i.active").removeClass("active");
                    
                    $("#deleteCon").addClass("default");
                    //操作完成加载数据
                    var paramObj = selectParam();
                    loadContractData(paramObj);
                },
                error:function(XMLHttpRequest){
        			error_500(XMLHttpRequest.responseText);
        		}
            });
        });

    }

}
/*------------------------------------合同删除操作------------------------------------------*/
/*----------------------------------------结束----------------------------------------------*/

/**
 * 添加新合同和创建合同按钮跳转
 * */
function skipCreateCon(){
    window.location.href = 'newContract.html';
}
/**
 * 初始化页面的查询条件
 */
var active = "active";
var f = "true";
function loadCondition(){
	var fc = preLoadData("searchText","firmName","careAbout","checking",
			             "conPrice_four",
			             "conPrice_one","conPrice_three","conPrice_two",
			             "currPage","expire","future_expire",
			             "conStatus","today_expire","typeIds",
			             "unKnow");
	$("#firmId").selectpicker('val',fc.firmName);//合同厂商
//	$("#firmId").selectpicker("refresh");
    $("i.active").removeClass(active);
    $("#conStatusId").selectpicker('val',fc.conStatus);
//    $("#conStatusId").selectpicker("refresh");
    if(fc.expire == f){
    	$("#expire").addClass(active);
    }
    if(fc.today_expire == f){
    	$("#today_expire").addClass(active);
    }
    if(fc.future_expire == f){
    	$("#future_expire").addClass(active);
    }
    if(fc.checking == f){
    	$("#checking").addClass(active);
    }
    if(fc.conPrice_one == f){
    	$("#conPrice_one").addClass(active);
    }
    if(fc.conPrice_two == f){
    	$("#conPrice_two").addClass(active);
    }
    if(fc.conPrice_three == f){
    	$("#conPrice_three").addClass(active);
    }
    if(fc.conPrice_four == f){
    	$("#conPrice_four").addClass(active);
    }
    $("#contractSearch").val(fc.searchText);
    var typeIds = fc.typeIds;
    if(null != typeIds){
    	 var ids = typeIds.split(",");
    	    for(var i=0;i<ids.length;i++){
    	    	switch(parseInt(ids[i])){
    	    	case 25:$("#type_1").addClass(active);break;
    	    	case 26:$("#type_2").addClass(active);break;
    	    	case 27:$("#type_3").addClass(active);break;
    	    	case 28:$("#type_4").addClass(active);break;
    	    	case 29:$("#type_5").addClass(active);break;
    	    	}
    	    }
    }
}

/**
 * jquery
 */
$(function () {
	getHistory();
	$("span.navlist-img4").addClass("active");
	var flag = getUrlParamSpecial("x");
	var paramObj;
	//解析url中的参数。是否是从详情页面过来的
	//是
	if(0 == flag){
		var fc = preLoadData("searchText","firmName","careAbout","checking",
			                 "conPrice_four",
			                 "conPrice_one","conPrice_three","conPrice_two",
			                 "currPage","expire","future_expire",
			                 "conStatus","today_expire","typeIds",
			                 "unKnow");
		//初始化页面的查询条件
		loadFirmName(true,loadCondition);
		paramObj = fc;
	}else{
		//不是
		//合同厂商，条件加载
	    loadFirmName(false);
		//第一次默认加载数据
	    paramObj = selectParam();
	    paramObj.currPage = 1;
	}
	  loadContractData(paramObj);
    //上下分页（列表右上角）
    upOrNextPage();
    //列表底部的上下分页
    $("#nextPageId").click(nextPageCon);//下一页
    $("#prePageId").click(prePageCon);//上一页
    $("#goPageId").click(toPage);//跳转到某一页
//  //我关注的，条件加载
//  $("#careAbout").click(function () {
//      var paramObj = selectParam();
//      if($("#cAIcon").hasClass("active")){
//          //$("#careAbout").addClass("active");
//          $("#cAIcon").removeClass("active");
//          paramObj.careAbout = false;
//      }else{
//          $("#cAIcon").addClass("active");
//          paramObj.careAbout = true;
//      }
//      //console.log(paramObj);
//      loadContractData(paramObj);
//  });
    //所有未知的，条件加载
    $("#unKnow").click(function(){
        var paramObj = selectParam();
        if($("#uKIcon").hasClass("active")){
            //$("#unKnow").addClass("active");
            $("#uKIcon").removeClass("active");
            paramObj.unKnow = false;
        }else{
            $("#uKIcon").addClass("active");
            paramObj.unKnow = true;
        }
        //console.log(paramObj);
        loadContractData(paramObj);
    });

    //加载合同状态条件
    $("#conStatusId").render(contractStatusData,contractStatusValue);
    $("#conStatusId").selectpicker('val',"");
    $('#contractStatus .selectpicker').selectpicker('refresh');

    //加载已生效合同条件
    //$("#selectTimeId").render(timeIntervalData,timeIntervalValue);
    //$("#selectTimeId").selectpicker('val',"");
    //$('#timeIntervalId .selectpicker').selectpicker('refresh');

    ////选择已生效合同选项，条件加载
    //loadContractDataByTimeInterval();

    //排序条件：条件加载
    $("#sortSelect").change(loadBySortSelect);
    //排序顺序：正序/倒序 加载
    contractSortClick();
    //选择合同状态，条件加载
    loadContractDataByConStatus();

    //合同到期时间，条件加载：
    //已到期
    $("#expireId").click(function () {
        var paramObj = selectParam();
        if($("#expire").hasClass("active")){
            $("#expire").removeClass("active");
            paramObj.expire = false;
        }else{
            $("#expire").addClass("active");
            paramObj.expire = true;
        }
        //console.log(paramObj);
        loadContractData(paramObj);
    });
    //今天
    $("#today_expireId").click(function () {
        var paramObj = selectParam();
        if($("#today_expire").hasClass("active")){
            $("#today_expire").removeClass("active");
            paramObj.today_expire = false;
        }else{
            $("#today_expire").addClass("active");
            paramObj.today_expire = true;
        }
        //console.log(paramObj);
        loadContractData(paramObj);
    });
    //30天后到期
    $("#future_expireId").click(function () {
        var paramObj = selectParam();
        if($("#future_expire").hasClass("active")){
            $("#future_expire").removeClass("active");
            paramObj.future_expire = false;
        }else{
            $("#future_expire").addClass("active");
            paramObj.future_expire = true;
        }
        //console.log(paramObj);
        loadContractData(paramObj);
    });
    //待审阅
    //$("#checkingId").click(function(){
    //    var paramObj = selectParam();
    //    var checkingI = $("#checking");
    //    if(checkingI.hasClass("active")){
    //    	checkingI.removeClass("active");
    //        paramObj.checking = false;
    //    }else{
    //    	checkingI.addClass("active");
    //        paramObj.checking = true;
    //    }
    //    //console.log(paramObj);
    //    loadContractData(paramObj);
    //});

    //合同类型，条件加载
    contractTypeLoad();
    //合同金额，条件加载：
    contractPriceLoad();
    //模糊查询
    search();
    //清空所有查询条件
    clearAllSearch();
    //双击合同跳转到合同详情页面
    $("#contract_body").on("dblclick","ul",function(){
        var contractId = $(this).prev().val();
        var fc = selectParam();
        if(null == fc.searchText){
        	fc.searchText = "";
        }
        if(null == fc.firmName){
        	fc.firmName = "";
        }
        var nextUrl = nextUrlDeal(fc,"searchText","firmName","careAbout","checking",
        		                     "conPrice_four",
        		                     "conPrice_one","conPrice_three","conPrice_two",
        		                     "currPage","expire","future_expire",
        		                     "conStatus","today_expire","typeIds",
        		                     "unKnow");
        window.location.href = contractDetail+"?contractId="+contractId+"&"+nextUrl;
    });

    //点击该合同未关联的每个资产前面的小框
    $("#contract_body").on("click",".table-col1",conChooseClick);
    //合同点击删除
    $("#deleteCon").click(conDeleteClick);
    //新建合同页面跳转
    $("#addContract,#createContract").click(skipCreateCon);
});

/**
 * 清空所有查询条件：加载所有数据
 * */
function clearAllSearch(){
	
    $("#clearAll").click(function () {
        //$("#firm .filter-option").hide();
        $("i.active").removeClass("active");
        var paramObj = new Object();
        paramObj.careAbout = false;
        paramObj.unKnow = false;
        paramObj.firmName = null;
        $("#firmId").selectpicker('val',"所有厂商");
        //paramObj.timeInterval = "";
        //$("#selectTimeId").selectpicker('val',"");
        paramObj.conStatus = "";
        $("#conStatusId").selectpicker('val',"");

        paramObj.sortSelect = "contract.create_time";
        $("#sortSelect").val("contract.create_time");
        paramObj.sort = "DESC";
        if($("#upSort").hasClass("active")){
            $("#downSort").addClass("active");
            $("#upSort").removeClass("active");
        }
        paramObj.expire = false;
        paramObj.today_expire = false;
        paramObj.future_expire = false;
        paramObj.checking = false;
        paramObj.typeIds = [];
        paramObj.conPrice_one = false;
        paramObj.conPrice_two = false;
        paramObj.conPrice_three = false;
        paramObj.conPrice_four = false;
        paramObj.searchText = null;
        $("#contractSearch").val("");
        paramObj.currPage = 1;
        //console.log(paramObj);
        loadContractData(paramObj);
    });
}

$('.selectpicker').selectpicker({noneSelectedText:' '});
