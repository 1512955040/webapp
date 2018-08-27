/**
 * 服务商合同管理 Created by EKuter-amu on 2017/3/15.
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
var serviceContractDetail = 'serviceContractDetail.html';
/**
 * 加载所有服务商合同
 * */
var count = 10;//页面加载条数为10条
function loadServiceContractList(paramObj){
    //timeInterval:paramObj.timeInterval,start_time:paramObj.start_time,
    //    end_time:paramObj.end_time,
    $.ajax({
        traditional:true,
        url:loadServiceContractDataUrl,
        dataType:"json",
        type:'POST',
        async:true,
        data:{page:paramObj.currPage,count:count,searchText:paramObj.searchText,careAbout:paramObj.careAbout,
            aboutMe:paramObj.aboutMe,firmName:paramObj.firmName,expire:paramObj.expire,conStatus:paramObj.conStatus,
            today_expire:paramObj.today_expire,future_expire:paramObj.future_expire,sortSelect:paramObj.sortSelect,sort:paramObj.sort,
            wait_confirm:paramObj.wait_confirm,contract_amount_one:paramObj.conPrice_one,contract_amount_two:paramObj.conPrice_two,
            contract_amount_three:paramObj.conPrice_three,contract_amount_four:paramObj.conPrice_four},

        contentType:'application/x-www-form-urlencoded; charset=UTF-8',//防止乱码

        success:function(data){

            //登录信息失效，ajax请求静态页面拦截
            onServiceComplete(data);
            //console.log(data);
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
            //console.log(data);
            if(len != 0){
                //right-table-body-status perform
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
                        //class:function(){
                        //    if("88" == this.c_status){
                        //        return "right-table-body-status perform";
                        //    }else if("89" == this.c_status){
                        //        return "right-table-body-status overdue";
                        //    }else if("87" == this.c_status){
                        //        return "right-table-body-status unexecuted";
                        //    }else if("90" == this.c_status){
                        //        return "right-table-body-status unknown";
                        //    }else if("85" == this.c_status){
                        //        return "right-table-body-status drawUp";
                        //    }else if("86" == this.c_status){
                        //        return "right-table-body-status underReview";
                        //    }
                        //}
                    },
                    //contract_status:{
                    //    text: function () {
                    //        if("88" == this.c_status){
                    //            return "履行中";
                    //        }else if("89" == this.c_status){
                    //            return "已过期";
                    //        }else if("87" == this.c_status){
                    //            return "未执行";
                    //        }else if("90" == this.c_status){
                    //            return "未知状态";
                    //        }else if("85" == this.c_status){
                    //            return "拟定中";
                    //        }else if("86" == this.c_status){
                    //            return "审阅中";
                    //        }
                    //    }
                    //},
                    IIcon:{
                        style: function () {
                            if(this.approval_status == 80 || this.approval_status == 81){
                                return "display: none";
                            }else if(this.party_B != this.create_enterprise){
                                return "display: none";
                            }
                        }
                    }
                };
                //绑定合同数据
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
            }else{
            	 contractPage = {
                         "beginCount":0,
                         "endCount":0,
                         "totalCount":0,
                         "currPage":0,
                         "totalPage":0
                     }
                $("#contract_body").hide();
            }
            //绑定两个分页区域的数据

        	$("#contractPage").render(contractPage,contractPageClass);
        	$("#pageMsg").render(contractPage,contractPageClass);
        	//$('#left').css('height',$('#right').outerHeight()+20+'px');
        },
        error:function(XMLHttpRequest){
			error_500(XMLHttpRequest.responseText);
		}
    });
}

/**
 * 筛选组织查询条件参数
 * */
function selectServiceConParam(){

    var paramObj = new Object();

//  //条件：我关注的
//  if($("#cAIcon").hasClass("active")){
//      paramObj.careAbout = true;
//  }else{
//      paramObj.careAbout = false;
//  }
    //条件：所有未知的
    if($("#aMIcon").hasClass("active")){
        paramObj.aboutMe = true;
    }else{
        paramObj.aboutMe = false;
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
    if($("#wait_confirm").hasClass("active")){//待审核
        paramObj.wait_confirm = true;
    }else{
        paramObj.wait_confirm = false;
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
 * 切换排序条件加载
 * */
function loadBySortSelect(){
    var sortSelectVal = $("#sortSelect option:selected").val();
    var paramObj = selectServiceConParam();
    paramObj.sortSelect = sortSelectVal;
    loadServiceContractList(paramObj);
}

/**
 * 排序顺序：正序/倒序 加载
 * */
function serContractSortClick(){
    //点击正序加载
    $("#upSort").click(function () {
        if($("#downSort").hasClass("active")){
            $("#upSort").addClass("active");
            $("#downSort").removeClass("active");
            var paramObj = selectServiceConParam();
            paramObj.sort = "ASC";
            loadServiceContractList(paramObj);
        }
    });
    //点击倒序加载
    $("#downSort").click(function () {
        if($("#upSort").hasClass("active")){
            $("#downSort").addClass("active");
            $("#upSort").removeClass("active");
            var paramObj = selectServiceConParam();
            paramObj.sort = "DESC";
            loadServiceContractList(paramObj);
        }
    });
}
/**
 * 上一页
 */
function prePageSerCon() {

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
    //$("#contract_body").html("");
    var paramObj = selectServiceConParam();
    paramObj.currPage = currPage;
    //console.log(paramObj);
    loadServiceContractList(paramObj);
}
/**
 * 下一页
 */
function nextPageSerCon() {

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
    var paramObj = selectServiceConParam();
    paramObj.currPage = currPage;
    //console.log(paramObj);
    loadServiceContractList(paramObj);
}
/**
 * 跳转到某一页
 */
function toPageSerCon(){
	var goPage = $("#goPageInput").val();
	var totalPage = $("#totalPageId").val();
	var fc = selectServiceConParam();
	if(isNaN(goPage) || "" == goPage || goPage < 1){
		fc.currPage = 1;
	}else if(goPage - totalPage > 0){
		fc.currPage = totalPage;
	}else{
		fc.currPage = goPage;
	}
	$("#goPageInput").val("");
	loadServiceContractList(fc);
}
/**
 * 上下页跳转操作
 * */
function serviceUpOrNextPage(){

    var upConPage = document.getElementById("upConPageId");
    var nextConPage = document.getElementById("nextConPageId");

    /**
     * 点击上一页操作
     * */
    upConPage.onclick =prePageSerCon;
    /**
     * 点击下一页操作
     * */
    nextConPage.onclick = nextPageSerCon;
}

/**
 * 根据合同状态，条件查询
 * */
function loadServiceContractDataByConStatus(){
    $("#contractStatus").change(function () {
        var conStatusSelect = document.getElementById("conStatusId");
        var conStatusValueId = conStatusSelect.options[conStatusSelect.selectedIndex].value;

        $("#conStatusId").selectpicker('val',conStatusValueId);
        $('#contractStatus .selectpicker').selectpicker('refresh');

        if("" == conStatusValueId){
            var paramObj = selectServiceConParam();
            paramObj.conStatus = null;
            loadServiceContractList(paramObj);
        }else{
            var paramObj = selectServiceConParam();
            paramObj.conStatus = conStatusValueId;
            loadServiceContractList(paramObj);
        }
    })
}

/**
 * 根据已生效合同时间，条件查询
 * */
//function loadServiceContractDataByTimeInterval(){
//
//    $("#timeIntervalId").change(function () {
//        var timeIntervalSelect = document.getElementById("selectTimeId");
//        var timeIntervalValueId = timeIntervalSelect.options[timeIntervalSelect.selectedIndex].value;
//
//        $("#selectTimeId").selectpicker('val',timeIntervalValueId);
//        $('#timeIntervalId .selectpicker').selectpicker('refresh');
//
//        if("" == timeIntervalValueId){
//            var paramObj = selectServiceConParam();
//            paramObj.timeInterval = null;
//            loadServiceContractList(paramObj);
//        }else if("35" != timeIntervalValueId){
//            var paramObj = selectServiceConParam();
//            paramObj.timeInterval = timeIntervalValueId;
//            //console.log(paramObj);
//            loadServiceContractList(paramObj);
//        }else{
//            $("#customTime").modal('show');
//            $("#customTime input").val("");
//            $("button.btn-keep").click(function(){
//                var paramObj = selectServiceConParam();
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
//                loadServiceContractList(paramObj);
//            });
//        }
//
//    });
//}

/**
 * 根据合同金额查询
 * */
function serviceContractPriceLoad(){

    //小于100万
    $("#conPrice_one_id").click(function () {
        var paramObj = selectServiceConParam();
        if($("#conPrice_one").hasClass("active")){

            $("#conPrice_one").removeClass("active");
            paramObj.conPrice_one = false;
        }else{
            $("#conPrice_one").addClass("active");
            paramObj.conPrice_one = true;
        }
        //console.log(paramObj);
        loadServiceContractList(paramObj);
    });
    //100万-500万
    $("#conPrice_two_id").click(function () {
        var paramObj = selectServiceConParam();
        if($("#conPrice_two").hasClass("active")){

            $("#conPrice_two").removeClass("active");
            paramObj.conPrice_two = false;
        }else{
            $("#conPrice_two").addClass("active");
            paramObj.conPrice_two = true;
        }
        //console.log(paramObj);
        loadServiceContractList(paramObj);
    });
    //500万-1000万
    $("#conPrice_three_id").click(function () {
        var paramObj = selectServiceConParam();
        if($("#conPrice_three").hasClass("active")){

            $("#conPrice_three").removeClass("active");
            paramObj.conPrice_three = false;
        }else{
            $("#conPrice_three").addClass("active");
            paramObj.conPrice_three = true;
        }
        //console.log(paramObj);
        loadServiceContractList(paramObj);
    });
    //1000万以上
    $("#conPrice_four_id").click(function () {
        var paramObj = selectServiceConParam();
        if($("#conPrice_four").hasClass("active")){

            $("#conPrice_four").removeClass("active");
            paramObj.conPrice_four = false;
        }else{
            $("#conPrice_four").addClass("active");
            paramObj.conPrice_four = true;
        }
        //console.log(paramObj);
        loadServiceContractList(paramObj);
    });
}

/**
 * 服务商合同列表模糊查询
 * */
function serviceConSearch(){
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
                var paramObj = selectServiceConParam();
                paramObj.searchText = searchText;
                //console.log(paramObj);
                loadServiceContractList(paramObj);
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
            var paramObj = selectServiceConParam();
            paramObj.searchText = searchText;
            loadServiceContractList(paramObj);
        }
    });
}

/**
 * 创建服务商合同
 * */
function createServiceContract(){
    window.location.href = 'newServiceContract.html';
}

/**
 * 加载合同厂商的名称
 * */
function serConLoadFirmName(){

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
                onServiceComplete(data);

                //console.log(data);
                var len = data.length;
                if(len != 0){
                    $("#firmId").render(data);
                    $("#firmId").selectpicker('val',"所有厂商");
                    $('#firm .selectpicker').selectpicker('refresh');
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
        var paramObj = selectServiceConParam();
        if(firmName == "所有厂商"){
            paramObj.firmName = null;
        }else{
            paramObj.firmName = firmName;
        }
        //console.log(paramObj);
        loadServiceContractList(paramObj);
    });
}

/**
 * 清空所有查询条件
 * */
function serConClearAllSearch(){
    $("#clearAll").click(function () {
        //$("#firm .filter-option").hide();
        $("i.active").removeClass("active");
        var paramObj = new Object();
        paramObj.careAbout = false;
        paramObj.aboutMe = false;
        paramObj.firmName = null;
        $("#firmId").selectpicker('val',"所有厂商");
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
        paramObj.conPrice_one = false;
        paramObj.conPrice_two = false;
        paramObj.conPrice_three = false;
        paramObj.conPrice_four = false;
        paramObj.searchText = null;
        $("#contractSearch").val("");
        paramObj.currPage = 1;
        //console.log(paramObj);
        loadServiceContractList(paramObj);
    });
}

/*----------------------------------------开始----------------------------------------------*/
/*------------------------------------合同删除操作------------------------------------------*/
/**
 * 点击每条合同前面的小方块
 * 1.给小方框加上样式
 * 2.获取当前选中的合同条数，改变“删除”的样式，只有的选中了合同，才可以点击“删除”
 */
function serConChooseClick(){

    if($(this).find('i').hasClass("active")){
        $(this).find('i').removeClass("active");
    }else{
        $(this).find('i').addClass("active");
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
    var $checkPro = $("#contract_body").find("i.active").next();
    $checkPro.each(function(){
        con_ids.push($(this).val());
    });
    return con_ids;
}
/**
 * 改变“删除”样式
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
function serConDeleteClick(){

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
                    onServiceComplete(data);

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
                    $("#contract_body").find("i.active").removeClass("active");
                    $("#deleteCon").addClass("default");
                    //操作完成加载数据
                    var paramObj = selectServiceConParam();
                    loadServiceContractList(paramObj);
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

$(function () {

    //第一次默认加载数据
    var paramObj = selectServiceConParam();
    //console.log(paramObj);
    paramObj.currPage = 1;
    loadServiceContractList(paramObj);
    //上下分页（列表右上角）
    serviceUpOrNextPage();
    $("#prePageId").click(prePageSerCon);//上一页（列表底部)
    $("#nextPageId").click(nextPageSerCon);//下一页（列表底部）
    $("#goPageId").click(toPageSerCon);//跳转到某一页
    //创建服务商合同(跳转)
    $("#createServiceContract").click(createServiceContract);
    $("#addServiceContract").click(createServiceContract);

//  //我关注的，条件加载
//  $("#careAbout").click(function () {
//      var paramObj = selectServiceConParam();
//      if($("#cAIcon").hasClass("active")){
//          //$("#careAbout").addClass("active");
//          $("#cAIcon").removeClass("active");
//          paramObj.careAbout = false;
//      }else{
//          $("#cAIcon").addClass("active");
//          paramObj.careAbout = true;
//      }
//      //console.log(paramObj);
//      loadServiceContractList(paramObj);
//  });

    //与我相关的，条件加载
    
    $("#aboutMe").click(function(){
        var paramObj = selectServiceConParam();
        if($("#aMIcon").hasClass("active")){
            //$("#unKnow").addClass("active");
            $("#aMIcon").removeClass("active");
            paramObj.unKnow = false;
        }else{
            $("#aMIcon").addClass("active");
            paramObj.unKnow = true;
        }
        //console.log(paramObj);
        loadServiceContractList(paramObj);
    });

    //加载已生效合同条件
    //$("#selectTimeId").render(timeIntervalData,timeIntervalValue);
    //$("#selectTimeId").selectpicker('val',"");
    //$('#timeIntervalId .selectpicker').selectpicker('refresh');

    //加载合同状态条件
    $("#conStatusId").render(contractStatusData,contractStatusValue);
    $("#conStatusId").selectpicker('val',"");
    $('#contractStatus .selectpicker').selectpicker('refresh');

    //排序条件：条件加载
    $("#sortSelect").change(loadBySortSelect);

    //排序顺序：正序/倒序 加载
    serContractSortClick();
    ////选择已生效合同选项，条件加载
    //loadServiceContractDataByTimeInterval();
    //选择合同状态选项，条件加载
    loadServiceContractDataByConStatus();

    //合同到期时间，条件加载：
    //已到期
    $("#expireId").click(function () {
        var paramObj = selectServiceConParam();
        if($("#expire").hasClass("active")){
            $("#expire").removeClass("active");
            paramObj.expire = false;
        }else{
            $("#expire").addClass("active");
            paramObj.expire = true;
        }
        //console.log(paramObj);
        loadServiceContractList(paramObj);
    });
    //今天
    $("#today_expireId").click(function () {
        var paramObj = selectServiceConParam();
        if($("#today_expire").hasClass("active")){
            $("#today_expire").removeClass("active");
            paramObj.today_expire = false;
        }else{
            $("#today_expire").addClass("active");
            paramObj.today_expire = true;
        }
        //console.log(paramObj);
        loadServiceContractList(paramObj);
    });
    //30天后到期
    $("#future_expireId").click(function () {
        var paramObj = selectServiceConParam();
        if($("#future_expire").hasClass("active")){
            $("#future_expire").removeClass("active");
            paramObj.future_expire = false;
        }else{
            $("#future_expire").addClass("active");
            paramObj.future_expire = true;
        }
        //console.log(paramObj);
        loadServiceContractList(paramObj);
    });
    //待审核
    //$("#wait_confirm_Id").click(function () {
    //    var paramObj = selectServiceConParam();
    //    if($("#wait_confirm").hasClass("active")){
    //        $("#wait_confirm").removeClass("active");
    //        paramObj.wait_confirm = false;
    //    }else{
    //        $("#wait_confirm").addClass("active");
    //        paramObj.wait_confirm = true;
    //    }
    //    //console.log(paramObj);
    //    loadServiceContractList(paramObj);
    //});

    //合同金额，条件加载：
    serviceContractPriceLoad();

    //模糊查询
    serviceConSearch();

    //加载与该服务商签订过合同的企业
    serConLoadFirmName();

    //清空所有查询条件
    serConClearAllSearch();

    //双击合同跳转到合同详情页面
    $("#contract_body").on("dblclick","ul",function(){
      // var contractId = $(this).prev().val();
        var contractId = $(this).find("input[data-bind=id]").val();
        window.location.href = serviceContractDetail+"?contractId="+contractId;
    });

    //点击该合同未关联的每个资产前面的小框
//  $("#contract_body").on("click","i",serConChooseClick);
	//扩大点击范围
	$("#contract_body").on("click","li.table-col1",serConChooseClick);

    //服务商合同删除操作
    $("#deleteCon").click(serConDeleteClick);
})
