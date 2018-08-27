/**
 * 服务商工单管理 Created by EKuter-si.yu on 2017/2/21.
 */
var create_date = "data_per.create_date";
//将Long型的时间转换成小时和分钟的字符串
function formatLongTime(longTypeTime,flag){
    var formatTime = "";
    if(longTypeTime <= 0){
        return "已超时";
    }
    var min = Math.round(Math.round(longTypeTime/1000)/60)%60;
    var hour = Math.round(Math.round(Math.round(longTypeTime/1000)/60)/60);
    if(hour<10 && min<10){
        formatTime = "0"+hour+"时0"+min+"分";
    }else if(hour<10 && min >10){
        formatTime = "0"+hour+"时"+min+"分";
    }else if(hour>10 && min<10){
        formatTime = ""+hour+"时0"+min+"分";
    }else{
        formatTime = hour+"时"+min+"分";
    }
    if(2 == flag){
        return "耗时："+formatTime;
    }else{
        return "剩余："+formatTime;
    }

    return formatTime;
}

/**
 * echarts时效图绘制
 * */
function drawEchartsPictureOfTimer(workOrderId,workOrderName,goneTime,totalTime,color1,color2){
    var workOrderEchart = echarts.init(document.getElementById('workOrder'+workOrderId));
//    var workOrderEchartTest = echarts.init(document.getElementById('ddd'));
//    console.log(formatLongTime(totalTime-goneTime),1);
    var workOrder_option = {
        title:{
            text:workOrderName,
            bottom:20,
            left:'center',
            textStyle: {
                fontSize: '12',
                fontWeight: 'bold',
                color:'#000'
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a}</br>{b}:{c} "
        },
        color: [color1,color2],
        borderWidth: 10,
        series: [
            {
                type:'pie',   //饼图
                name:'工单',
                radius: ['60%', '90%'],     //极坐标
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
                data:[formatLongTime(totalTime-goneTime,1),formatLongTime(goneTime,2)],
                hoverAnimation: false
            }
        ]
    };
    workOrderEchart.setOption(workOrder_option);
//    workOrderEchartTest.setOption(workOrder_option);
}

var createTimeData,createTimeValue;//创建时间下拉选的数据
createTimeData = [
    {
        value:"",
        createTimeSelect:"---选择---"
    },
    {
        value:3,
        createTimeSelect:"今天"
    },
    {
        value:4,
        createTimeSelect:"最近24小时"
    },
    {
        value:5,
        createTimeSelect:"本周"
    },
    {
        value:6,
        createTimeSelect:"本月"
    },
    {
        value:7,
        createTimeSelect:"最近30天"
    },
    {
        value:8,
        createTimeSelect:"自定义"
    }
];
createTimeValue = {

    createTimeSelect:{
        value:function(){
            return this.value;
        }
    }
};

var workOrderData,workOrderValue;//工单状态下拉选的数据
workOrderData = [
    {
        value:"",
        workOrderStateSelect:"---选择---"
    },
    {
        value:65,
        workOrderStateSelect:"待接单"
    },
    {
        value:66,
        workOrderStateSelect:"工单处理中"
    },
    {
        value:67,
        workOrderStateSelect:"工单内审中"
    },
    {
        value:68,
        workOrderStateSelect:"工单终审中"
    },
    {
        value:69,
        workOrderStateSelect:"已关闭"
    }
];
workOrderValue = {
    workOrderStateSelect:{
        value:function(){
            return this.value;
        }
    }
};

var eventStatusData,eventStatusValue;//事件处理状态下拉选的数据
eventStatusData = [
    {
        value:"",
        eventStatusSelect:"---选择---"
    },
    {
        value:59,
        eventStatusSelect:"未解决"
    },
    {
        value:60,
        eventStatusSelect:"已解决"
    },
    {
        value:61,
        eventStatusSelect:"不予解决"
    },
    {
        value:62,
        eventStatusSelect:"已合并处理"
    }
];
eventStatusValue = {
    eventStatusSelect: {
        value: function () {
            return this.value;
        }
    }
}

/**
 * 加载当前用户工单列表
 * */
var pageNum = 10;//列表每页显示条数为10条
function loadWorkOrderList(paramObj){
	
    var color = [
        {"color1":'#7CA7DA',"color2":'#A1CCF9'},
        {"color1":'#DFDFDF',"color2":'#DFDFDF'},
        {"color1":'#DA7D87',"color2":'#FCBFC4'},
        {"color1":'#DC464C',"color2":'#DC464C'}
    ];

    var workOrderName = [
        {"workOrderName1":'响应\n时效',"workOrderName2":'解决\n时效',"workOrderName3":'已\n关闭',"workOrderName4":'已\n超时',"workOrderName5":'终\n审中'}
    ];
    var workOrderStateName = [
        {"waitAccept":'待接单',"disposing":'工单处理',"inChecking":'工单内审',"outChecking":'工单终审'},
        {"waitAccept":'已接单',"disposing":'处理中',"inChecking":'提交内审',"outChecking":'工单终审'},
        {"waitAccept":'已接单',"disposing":'已处理',"inChecking":'内审中',"outChecking":'提交终审'},
        {"waitAccept":'已接单',"disposing":'已处理',"inChecking":'已内审',"outChecking":'终审中'},
        {"waitAccept":'已接单',"disposing":'已处理',"inChecking":'已内审',"outChecking":'已终审'}
    ];
    //console.log(paramObj);
    $.ajax({
        traditional:true,
        url:loadWorkOrderDataUrl,
        dataType:"json",
        type:'POST',
        async:true,
        data:{myCol:paramObj.myCol,aboutMe:paramObj.aboutMe,canSee:paramObj.canSee,createTime:paramObj.createTime,
            begin_time:paramObj.start_time,end_time:paramObj.end_time,workOrderState:paramObj.workOrderState,
            serviceLevel:paramObj.serviceLevel,transactor:paramObj.transactor,stakeholder:paramObj.stakeholder,
            timeLimit_today:paramObj.timeLimit_today,timeLimit_hours:paramObj.timeLimit_hours,timeLimit_inner:paramObj.timeLimit_inner,
            timeLimit_out:paramObj.timeLimit_out,sortSelect:paramObj.sortSelect,sort:paramObj.sort,searchText:paramObj.searchText,
            page:paramObj.currPage,pageNum:pageNum},

        contentType:'application/x-www-form-urlencoded; charset=UTF-8',//防止乱码
        success:function(data){

            //登录信息失效，ajax请求静态页面拦截
            onServiceComplete(data);

            var len = data.length;
            //console.log(data);
            if(len != 0){
                var totalPage = data[0].PageNum;
                var totalNum = data[0].totalNum;
				
                var beginCount = (paramObj.currPage-1)*(pageNum)+1;
                var endCount;
                if(len - pageNum == 0){
                    endCount = beginCount-1 + pageNum;
                }else{
                    endCount = beginCount-1 + (len)%(pageNum);
                }
				
                var workOrderPage = {
                    "beginCount":beginCount,
                    "endCount":endCount,
                    "totalCount":totalNum,
                    "currPage":paramObj.currPage,
                    "totalPage":totalPage
                }
                var workOrderPageClass = {
                    upWorkOrderPage:{
                        class:function(){
                            if(paramObj.currPage - 1 == 0){
                                return "title-page-left title-page";
                            }else{
                                return "title-page-left title-page active";
                            }
                        }
                    },
                    nextWorkOrderPage:{
                        class:function(){
                            if(totalPage - 1 == 0 || totalPage-paramObj.currPage == 0){
                                return "title-page-right title-page";
                            }else{
                                return "title-page-right title-page active";
                            }
                        }
                    },
                    prevPageDis:{
                    	class:function(){
		    				if(paramObj.currPage - 1 == 0 || paramObj.currPage == 0){
		    					return "pageChange-span1 pageChange-span di disabled";
		    				}else{
		    					return "pageChange-span1 pageChange-span di";
		    				}
		    			}
                    },
                    nextPageDis:{
                    	class:function(){
		    				if(this.totalPage - 1 == 0 || this.totalPage-paramObj.currPage == 0){
		    					return "pageChange-span3 pageChange-span di disabled";
		    				}else{
		    					return "pageChange-span3 pageChange-span di";
		    				}
	    				}
                 	},
                 	nextPageFlag:{
		    			class:function(){
		    				if(this.totalPage - 1 == 0 || this.totalPage-paramObj.currPage == 0){
		    					return "di pageChange-span-down";
		    				}else{
		    					return "di pageChange-span-down active";
		    				}
		    			}
		    		},
		    		prevPageFlag:{
		    			class:function(){
		    				if(paramObj.currPage - 1 == 0 || paramObj.currPage== 0){
		    					return "di pageChange-span-up";
		    				}else{
		    					return "di pageChange-span-up active";
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
                //向页面绑定分页数据
                $('#workOrderList').show();
                $("#workOrderPage").render(workOrderPage,workOrderPageClass);
                $("#pageHelp").render(workOrderPage,workOrderPageClass);

                //绑定工单数据
                var workOrder_de = {
                    assignClass:{
                        style: function () {
                            if(this.work_order_status == 65){
                                return "display:none";
                            }
                        }
                    },
                    submitClass:{
                        style: function () {
                            if(this.work_order_status == 65 || this.work_order_status == 66 || this.work_order_status == 67){
                                return "display:none";
                            }
                        }
                    },
                    closeClass:{
                        style: function () {
                            if(this.work_order_status != 69){
                                return "display:none";
                            }
                        }
                    },
                    executorAndStake:{
                        style:function(){
                            if(this.work_order_status == 65){
                                return "display:none";
                            }
                        }
                    },
                    echartsAreaId:{
                        id:function(){
                            return "workOrder"+this.work_order_id;
                        }
                    },
                    waitAccept:{
                        id:function(){
                            return "waitAccept"+this.work_order_id;
                        },
                        //根据工单状态绑定不同进度条展示
                        text:function(){
                            if(this.work_order_status == 65){
                                return workOrderStateName[0].waitAccept;
                            }else if(this.work_order_status == 66){
                                return workOrderStateName[1].waitAccept;
                            }else if(this.work_order_status == 67){
                                return workOrderStateName[2].waitAccept;
                            }else if(this.work_order_status == 68){
                                return workOrderStateName[3].waitAccept;
                            }else if(this.work_order_status == 69){
                                return workOrderStateName[4].waitAccept;
                            }
                        }
                    },
                    disposing:{
                        id:function(){
                            return "disposing"+this.work_order_id;
                        },
                        //根据工单状态绑定不同进度条展示
                        text:function(){
                            if(this.work_order_status == 65){
                                return workOrderStateName[0].disposing;
                            }else if(this.work_order_status == 66){
                                return workOrderStateName[1].disposing;
                            }else if(this.work_order_status == 67){
                                return workOrderStateName[2].disposing;
                            }else if(this.work_order_status == 68){
                                return workOrderStateName[3].disposing;
                            }else if(this.work_order_status == 69){
                                return workOrderStateName[4].disposing;
                            }
                        }
                    },
                    inChecking:{
                        id:function(){
                            return "inChecking"+this.work_order_id;
                        },
                        //根据工单状态绑定不同进度条展示
                        text:function(){
                            if(this.work_order_status == 65){
                                return workOrderStateName[0].inChecking;
                            }else if(this.work_order_status == 66){
                                return workOrderStateName[1].inChecking;
                            }else if(this.work_order_status == 67){
                                return workOrderStateName[2].inChecking;
                            }else if(this.work_order_status == 68){
                                return workOrderStateName[3].inChecking;
                            }else if(this.work_order_status == 69){
                                return workOrderStateName[4].inChecking;
                            }
                        }
                    },
                    outChecking:{
                        id:function(){
                            return "outChecking"+this.work_order_id;
                        },
                        //根据工单状态绑定不同进度条展示
                        text:function(){
                            if(this.work_order_status == 65){
                                return workOrderStateName[0].outChecking;
                            }else if(this.work_order_status == 66){
                                return workOrderStateName[1].outChecking;
                            }else if(this.work_order_status == 67){
                                return workOrderStateName[2].outChecking;
                            }else if(this.work_order_status == 68){
                                return workOrderStateName[3].outChecking;
                            }else if(this.work_order_status == 69){
                                return workOrderStateName[4].outChecking;
                            }
                        }
                    },
                    service_level_name:{
                        class:function(){
                            if(this.service_level_name == "紧急"){
                                return "urgency";
                            }else if(this.service_level_name == "高"){
                                return "height";
                            }else if(this.service_level_name == "中"){
                                return "center";
                            }else if(this.service_level_name == "低"){
                                return "low";
                            }
                        }
                    },
                    workOrder_process:{
                    	
                        id: function () {
                            return "process"+this.work_order_id;
                        },
                        class: function () {
                            if(this.work_order_status == 65){//待接单
                                if(this.position == 0){//0代表组长，1代表组员。只有组长才有接单权限
                                    return "process1 active";
                                }else{
                                    return "process1";
                                }
                            }else if(this.work_order_status == 66){//工单处理中
                                if(this.position == 0 && this.executor_user_id == this.user_id){
                                    return "process2 active";
                                }else if(this.position == 0 && this.executor_user_id != this.user_id){
                                    return "process2";
                                }else if(this.position == 1 && this.executor_user_id != this.user_id){
                                    return "process2";
                                }else if(this.position == 1 && this.executor_user_id == this.user_id){
                                    return "process2 active";
                                }else if(this.dispatch_flag == 76){//转派中
                                    return "process2 changing"
                                }
                            }else if(this.work_order_status == 67){//工单内审中
                                if(this.position == 0){
                                    return "process3 active";
                                }else{
                                    return "process3";
                                }
                            }else if(this.work_order_status == 68){//工单终审中
                                return "process4 active";
                            }else if(this.work_order_status == 69){//工单已关闭
                                return "process4";
                            }
                        }
                    }
                }
                //if(this.work_order_status == 65){
                //    $("#executorAndStake"+this.workOrderId).hide();
                //}
                //绑定工单数据
                $('.right-con-body .takePlace').hide();
                $("#workOrderList").render(data,workOrder_de);

                while(len--){
                    //根据工单状态绘制每条数据的Echarts图

                    if(data[len].gone_time > data[len].total_time){
                        drawEchartsPictureOfTimer(data[len].work_order_id,workOrderName[0].workOrderName4,0,0,color[3].color1,color[3].color2);
                    }else{
                        if(data[len].work_order_status == 65){
                            drawEchartsPictureOfTimer(data[len].work_order_id,workOrderName[0].workOrderName1,data[len].gone_time,data[len].total_time,color[0].color1,color[0].color2);
                        }else if(data[len].work_order_status == 68){
                            drawEchartsPictureOfTimer(data[len].work_order_id,workOrderName[0].workOrderName5,0,0,color[1].color1,color[1].color2);
                        }else if(data[len].work_order_status == 69){
                            drawEchartsPictureOfTimer(data[len].work_order_id,workOrderName[0].workOrderName3,0,0,color[1].color1,color[1].color2);
                        }else{
                            drawEchartsPictureOfTimer(data[len].work_order_id,workOrderName[0].workOrderName2,data[len].gone_time,data[len].total_time,color[2].color1,color[2].color2);
                        }
                    }
                }
            }else{
            	var workOrderPage = {
                    "beginCount":0,
                    "endCount":0,
                    "totalCount":0,
                    "currPage":0,
                    "totalPage":0
                }
            	var workOrderPageClass = {
                    upWorkOrderPage:{
                        class:function(){
                            if(this.currPage == 0){
                                return "title-page-left title-page";
                            }else{
                                return "title-page-left title-page active";
                            }
                        }
                    },
                    nextWorkOrderPage:{
                        class:function(){
                            if(this.totalPage == 0 || this.totalPage-this.currPage == 0){
                                return "title-page-right title-page";
                            }else{
                                return "title-page-right title-page active";
                            }
                        }
                    },
                    prevPageDis:{
                    	class:function(){
		    				if(this.currPage - 1 == 0 || this.currPage == 0){
		    					return "pageChange-span1 pageChange-span di disabled";
		    				}else{
		    					return "pageChange-span1 pageChange-span di";
		    				}
		    			}
                    },
                    nextPageDis:{
                    	class:function(){
		    				if(this.totalPage - 1 == 0 || this.totalPage-this.currPage == 0){
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
            	$('#workOrderList').hide();
            	$('.right-con-body .takePlace').show();
            	$('#workOrderPage').render(workOrderPage,workOrderPageClass);
                $("#pageHelp").render(workOrderPage,workOrderPageClass);
            }
        },
        error:function(XMLHttpRequest){
			error_500(XMLHttpRequest.responseText);
		}
    });
}

/**
 * 点击上一页操作
 * */
function upWorkOrderPage(){
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
        //清空列表
        var paramObj = selectSearchParam();
        paramObj.currPage = currPage;
        //console.log(paramObj);
        loadWorkOrderList(paramObj);
    }
}

/**
 * 点击下一页操作
 * */
function nextWorkOrderPage(){
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
        //console.log(currPage);
        //清空列表
        //加载数据
        var paramObj = selectSearchParam();
        paramObj.currPage = currPage;
        //console.log(paramObj);
        loadWorkOrderList(paramObj);
    }
}


/**
 * 选页跳转
 * */
function choosePageToConfirm(){

    var choosePageVal = $("#choosePage").val();
    var totalPage = $("#totalPage").val();
    if("" != choosePageVal){
        if(choosePageVal <= totalPage){
            var paramObj = selectSearchParam();
            paramObj.currPage = choosePageVal;
            loadWorkOrderList(paramObj);
        }else{
            $("#tipMsg").addClass("active").html("无效查询页！").show();
            function hideMsg(){
                $("#tipMsg").addClass("active").html("无效查询页!").hide()
            }
            setTimeout(hideMsg,1500);
        }
    }else{
        $("#tipMsg").addClass("active").html("请输入页数查询！").show();
        function hideMsg(){
            $("#tipMsg").addClass("active").html("请输入页数查询!").hide()
        }
        setTimeout(hideMsg,1500);
    }
}

/**
 * 筛选查询条件
 * */
function selectSearchParam(){

    var paramObj = new Object();

    //查询条件：我执行的(该项加载时默认选中)
    if($("#myColIcon").hasClass("active")){
        paramObj.myCol = true;
    }else{
        paramObj.myCol = false;
    }

    //查询条件：我参与的
    if($("#aboutMeIcon").hasClass("active")){
        paramObj.aboutMe = true;
    }else{
        paramObj.aboutMe = false;
    }

    //查询条件：我可见的
//  if($("#canSeeIcon").hasClass("active")){
//      paramObj.canSee = true;
//  }else{
//      paramObj.canSee = false;
//  }

    //查询条件：创建时间
    var createTimeVal = $("select.createTime option:selected").val();
    if("" == createTimeVal){
        paramObj.createTime = null;
    }else{
        paramObj.createTime = createTimeVal;
    }

    //查询条件：工单状态
    var workOrderStateVal = $("select.workOrderState option:selected").val();
    if("" == workOrderStateVal){
        paramObj.workOrderState = null;
    }else{
        paramObj.workOrderState = workOrderStateVal;
    }

    //查询条件：执行人
    var transactor = $("#transactor").val();
    if("" == transactor){
        paramObj.transactor = null;
    }else{
        paramObj.transactor = transactor;
    }

    //查询条件：干系人
    var stakeholder = $("#searchStake").val();
    if("" == stakeholder){
        paramObj.stakeholder =null;
    }else{
        paramObj.stakeholder = stakeholder;
    }

    //查询条件：服务级别
    var serviceLevelIds = [];
    /* 紧急 */
    if($("#serviceLevel_1_li").hasClass("active")){
        serviceLevelIds.push($("#serviceLevel_1").val());
    }
    /* 高 */
    if($("#serviceLevel_2_li").hasClass("active")){
        serviceLevelIds.push($("#serviceLevel_2").val());
    }
    /* 中 */
    if($("#serviceLevel_3_li").hasClass("active")){
        serviceLevelIds.push($("#serviceLevel_3").val());
    }
    /* 低 */
    if($("#serviceLevel_4_li").hasClass("active")){
        serviceLevelIds.push($("#serviceLevel_4").val());
    }
    if("" == serviceLevelIds){
        paramObj.serviceLevel = null;
    }else{
        paramObj.serviceLevel = serviceLevelIds;
    }

    //查询条件：服务期限
    /* 今日内将逾期 */
    if($("#timeLimit_today_li").hasClass("active")){
        paramObj.timeLimit_today = true;
    }else{
        paramObj.timeLimit_today = false;
    }
    /* 24小时内将逾期 */
    if($("#timeLimit_hours_li").hasClass("active")){
        paramObj.timeLimit_hours = true;
    }else{
        paramObj.timeLimit_hours = false;
    }
    /* 期内 */
    if($("#timeLimit_inner_li").hasClass("active")){
        paramObj.timeLimit_inner = true;
    }else{
        paramObj.timeLimit_inner = false;
    }
    /* 逾期 */
    if($("#timeLimit_out_li").hasClass("active")){
        paramObj.timeLimit_out = true;
    }else{
        paramObj.timeLimit_out = false;
    }

    //查询条件：排序条件
    var sortSelectVal = $("#sortSelect option:selected").val();
    if("" == sortSelectVal || undefined == sortSelectVal){
        paramObj.sortSelect = create_date;
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

    //查询条件：模糊查询
    var searchTextVal = $("#searchText").val();
    if("" == searchTextVal){
        paramObj.searchText = null;
    }else{
        paramObj.searchText = searchTextVal;
    }

    //查询条件：当前页数
    var currPage = $("#currPage").val();
    if("" == currPage||0 == currPage||1 == currPage){
        paramObj.currPage = 1;
    }else{
        paramObj.currPage = currPage;
    }

    return paramObj;
}

/**
 * 点击“我执行的”：条件加载
 * */
function loadByMyCol(){

    if(!$("#myColIcon").hasClass("active")){

        var paramObj = selectSearchParam();
        $("#aboutMeIcon").removeClass("active");
//      $("#canSeeIcon").removeClass("active");
        paramObj.aboutMe = false;
        paramObj.canSee = false;
        $("#myColIcon").addClass("active");
        paramObj.myCol = true;

        loadWorkOrderList(paramObj);
    }
}

/**
 * 点击“我参与的”：条件加载(默认为选中条件)
 * */
function loadByAboutMe(){

    if(!$("#aboutMeIcon").hasClass("active")){

        var paramObj = selectSearchParam();
        $("#myColIcon").removeClass("active");
//      $("#canSeeIcon").removeClass("active");
        paramObj.myCol = false;
        paramObj.canSee = false;
        $("#aboutMeIcon").addClass("active");
        paramObj.aboutMe = true;

        loadWorkOrderList(paramObj);
    }
}

/**
 * 点击“我可见的”：条件加载(默认为选中条件)
 * */
//function loadByICanSee(){
////    console.log("123");
//  if(!$("#canSeeIcon").hasClass("active")){
//
//      var paramObj = selectSearchParam();
//      $("#myColIcon").removeClass("active");
//      $("#aboutMeIcon").removeClass("active");
//      paramObj.myCol = false;
//      paramObj.aboutMe = false;
//      $("#canSeeIcon").addClass("active");
//      paramObj.canSee = true;
//
//      loadWorkOrderList(paramObj);
//  }
//
//}

/**
 * 点击选中创建时间选项：条件加载
 * */
function loadByCreateTime(){

    var createTimeVal = $("select.createTime option:selected").val();

    if("" == createTimeVal) {

        var paramObj = selectSearchParam();
        paramObj.createTime = null;
        loadWorkOrderList(paramObj);

    }else if(8 != createTimeVal){

        var paramObj = selectSearchParam();
        paramObj.createTime = createTimeVal;
        loadWorkOrderList(paramObj);

    }else{
        $("#customTime").modal("show");
        $("#customTime input").val("");
        $("button.btn-keep").click(function(){
            var paramObj = selectSearchParam();
            paramObj.start_time = $("[name='startDate']").val();
            paramObj.end_time = $("[name='endDate']").val();
            //console.log(paramObj.start_time+"////"+paramObj.end_time);
            //如果某一个时间没有输入，则返回“所有时间”数据
            if("" == paramObj.start_time || "" == paramObj.end_time){
                paramObj.timeInterval = "";
            }else{
                paramObj.timeInterval = "8";
            }
            $("#customTime").modal('hide');
            loadWorkOrderList(paramObj);
        });
    }

}

/**
 * 点击选中的工单状态选项，条件加载
 * */
function loadByWorkOrderState(){
    var paramObj = selectSearchParam();
    var workOrderStateVal = $("select.workOrderState option:selected").val();
    //console.log("workOrderStateVal="+workOrderStateVal);
    paramObj.workOrderState = workOrderStateVal;
    loadWorkOrderList(paramObj);
}

/**
 * 点击执行人搜索按钮：条件加载
 * */
function loadByTransactorSearch(){
    var transactorVal = $("#transactor").val();
    if("" == transactorVal){
        $("#tipMsg").addClass("active").html("请输入查询条件").show();
        function hideMsg(){
            $("#tipMsg").addClass("active").html("请输入查询条件").hide()
        }
        setTimeout(hideMsg,1500);
    }else{
        var newSelect = new selectMenuH("transactor-tree","transactor-menu","transactor","transactorId"
            ,searchSerIdByInsertUrl,loadByTransactor);

        newSelect.onSelect('id','parent_id','name',transactorVal);
        newSelect.show();
    }
}

/**
 * 根据执行人ID加载数据
 * */
function loadByTransactor(){
    var transactorId = $("#transactorId").val();
    var paramObj = selectSearchParam();
    paramObj.transactor = transactorId;
    loadWorkOrderList(paramObj);
}

/**
 * 点击干系人搜索按钮：条件加载
 * */
function loadByStakeholderSearch(){
    var stakeholderVal = $("#searchStake").val();
    if("" == stakeholderVal){
        $("#tipMsg").addClass("active").html("请输入查询条件").show();
        function hideMsg(){
            $("#tipMsg").addClass("active").html("请输入查询条件").hide()
        }
        setTimeout(hideMsg,1500);
    }else{
        var newSelect = new selectMenuH("stakeholder-tree","stakeholder-menu","stakeholder","stakeholderId"
            ,searchSerIdByInsertUrl,loadByStakeholder);

        newSelect.onSelect('id','parent_id','name',stakeholderVal);
        newSelect.show();

    }
}

/**
 * 根据干系人id加载数据
 * */
function loadByStakeholder(){
    var transactorId = $("#stakeholderId").val();
    var paramObj = selectSearchParam();
    paramObj.stakeholder = transactorId;
    loadWorkOrderList(paramObj);
}

/**
 * 选择服务级别加载(多选)
 * */
function loadByServiceLevel(){

    var serviceLevelIds = [];
    // 紧急:条件加载
    $("#serviceLevel_1").click(function () {
        if($("#serviceLevel_1_li").hasClass("active")){
            $("#serviceLevel_1_li").removeClass("active");
            removeByValue(serviceLevelIds,$("#serviceLevel_1").val());
        }else{
            $("#serviceLevel_1_li").addClass("active");
            serviceLevelIds.push($("#serviceLevel_1").val());
        }
        var paramObj = selectSearchParam();
        paramObj.serviceLevel = serviceLevelIds;
        loadWorkOrderList(paramObj);
    });
    // 高：条件加载
    $("#serviceLevel_2").click(function () {
        if($("#serviceLevel_2_li").hasClass("active")){
            $("#serviceLevel_2_li").removeClass("active");
            removeByValue(serviceLevelIds,$("#serviceLevel_2").val());
        }else{
            $("#serviceLevel_2_li").addClass("active");
            serviceLevelIds.push($("#serviceLevel_2").val());
        }
        var paramObj = selectSearchParam();
        paramObj.serviceLevel = serviceLevelIds;
        loadWorkOrderList(paramObj);
    });
    // 中：条件加载
    $("#serviceLevel_3").click(function () {
        if($("#serviceLevel_3_li").hasClass("active")){
            $("#serviceLevel_3_li").removeClass("active");
            removeByValue(serviceLevelIds,$("#serviceLevel_3").val());
        }else{
            $("#serviceLevel_3_li").addClass("active");
            serviceLevelIds.push($("#serviceLevel_3").val());
        }
        var paramObj = selectSearchParam();
        paramObj.serviceLevel = serviceLevelIds;
        loadWorkOrderList(paramObj);
    });
    // 低：条件加载
    $("#serviceLevel_4").click(function () {
        if($("#serviceLevel_4_li").hasClass("active")){
            $("#serviceLevel_4_li").removeClass("active");
            removeByValue(serviceLevelIds,$("#serviceLevel_4").val());
        }else{
            $("#serviceLevel_4_li").addClass("active");
            serviceLevelIds.push($("#serviceLevel_4").val());
        }
        var paramObj = selectSearchParam();
        paramObj.serviceLevel = serviceLevelIds;
        loadWorkOrderList(paramObj);
    });

}

/**
 * 选择服务期限加载（多选）
 * */
function loadByServiceTime(){
    //今日内将逾期
    //console.log($("#timeLimit_today"));
    $("#timeLimit_today").click(function () {
        var paramObj = selectSearchParam();
        if($("#timeLimit_today_li").hasClass("active")){
            $("#timeLimit_today_li").removeClass("active");
            paramObj.timeLimit_today = false;
        }else{
            $("#timeLimit_today_li").addClass("active");
            paramObj.timeLimit_today = true;
        }
        loadWorkOrderList(paramObj);
    });

    //24小时内将逾期
    $("#timeLimit_hours").click(function () {
        var paramObj = selectSearchParam();
        if($("#timeLimit_hours_li").hasClass("active")){
            $("#timeLimit_hours_li").removeClass("active");
            paramObj.timeLimit_hours = false;
        }else{
            $("#timeLimit_hours_li").addClass("active");
            paramObj.timeLimit_hours = true;
        }
        loadWorkOrderList(paramObj);
    });

    //期内
    $("#timeLimit_inner").click(function () {
        var paramObj = selectSearchParam();
        if($("#timeLimit_inner_li").hasClass("active")){
            $("#timeLimit_inner_li").removeClass("active");
            paramObj.timeLimit_inner = false;
        }else{
            $("#timeLimit_inner_li").addClass("active");
            paramObj.timeLimit_inner = true;
        }
        //console.log(paramObj);
        loadWorkOrderList(paramObj);
    });

    //逾期
    $("#timeLimit_out").click(function () {
        var paramObj = selectSearchParam();
        if($("#timeLimit_out_li").hasClass("active")){
            $("#timeLimit_out_li").removeClass("active");
            paramObj.timeLimit_out = false;
        }else{
            $("#timeLimit_out_li").addClass("active");
            paramObj.timeLimit_out = true;
        }
        loadWorkOrderList(paramObj);
    });
}

/**
 * 切换排序条件加载
 * */
function loadBySortSelect(){
    var sortSelectVal = $("#sortSelect option:selected").val();
    var paramObj = selectSearchParam();
    paramObj.sortSelect = sortSelectVal;
    loadWorkOrderList(paramObj);
}

/**
 * 排序顺序：正序/倒序 加载
 * */
function workOrderSortClick(){
    //点击正序加载
    $("#upSort").click(function () {
        if($("#downSort").hasClass("active")){
            $("#upSort").addClass("active");
            $("#downSort").removeClass("active");
            var paramObj = selectSearchParam();
            paramObj.sort = "ASC";
            loadWorkOrderList(paramObj);
        }
    });
    //点击倒序加载
    $("#downSort").click(function () {
        if($("#upSort").hasClass("active")){
            $("#downSort").addClass("active");
            $("#upSort").removeClass("active");
            var paramObj = selectSearchParam();
            paramObj.sort = "DESC";
            loadWorkOrderList(paramObj);
        }
    });
}

/**
 * 模糊查询：回车查询加载
 * */
function enterVagueSearch(e){
    var currKey = 0;e = e||event;
    currKey = e.keyCode||e.which||e.charCode;
    //回车搜索
    if(currKey == 13) {
        //获取模糊查询条件
        var searchTextVal = $("#searchText").val();
        if ("" == searchTextVal) {
            $("#tipMsg").addClass("active").html("请输入查询条件").show();
            function hideMsg() {
                $("#tipMsg").addClass("active").html("请输入查询条件").hide()
            }
            setTimeout(hideMsg, 1500);
        }else{
            var paramObj = selectSearchParam();
            paramObj.searchText = searchTextVal;
            loadWorkOrderList(paramObj);
        }
    }
}

/**
 * 模糊查询：点击查询按钮加载
 * */
function clickVagueSearch(){

    var searchTextVal = $("#searchText").val();
    if("" == searchTextVal){
        $("#tipMsg").addClass("active").html("请输入查询条件").show();
        function hideMsg(){
            $("#tipMsg").addClass("active").html("请输入查询条件").hide()
        }
        setTimeout(hideMsg,1500);
    }else{
        var paramObj = selectSearchParam();
        paramObj.searchText = searchTextVal;
        loadWorkOrderList(paramObj);
    }
}

/**
 * 清空按钮：清除所有查询条件并加载初始数据
 * */
function clearAllSearchParam(){
    //去除所有勾选样式
    $(".left-wrap-title i#myColIcon").addClass('active').parents('ul').siblings().find('i.active').removeClass('active');//无法清除
    
    //所有查询参数回归初始加载参数值
    var paramObj = new Object();
    paramObj.myCol = true;/**我执行的**/
    //$("#aboutMeIcon").addClass("active");
    paramObj.aboutMe = false;/**我参与的**/
    paramObj.canSee=false;/**我可见的**/
    paramObj.createTime = null;/**创建时间**/
    $("#createTimeId").selectpicker('val',"");
    paramObj.workOrderState = null;/**工单状态**/
    $("#workOrderStateId").selectpicker('val',"");
    $("#transactor").val("");/**执行人干系人**/
    paramObj.transactor = null;
//  paramObj.stakeholder = null;
    $("#searchStake").val("");
    paramObj.stakeholder = null;
    paramObj.serviceLevel = null;/**服务级别**/
//  paramObj.sortSelect="data_per.create_date";
	$("select").selectpicker("val",0);//几个下拉选
	$("select").selectpicker("refresh");
	paramObj.sortSelect="data_per.create_date";/**创建日期**/
    paramObj.timeLimit_today = false;/**今日内将逾期**/
    paramObj.timeLimit_hours = false;/**24小时内将逾期**/
    paramObj.timeLimit_inner = false;/**期内**/
    paramObj.timeLimit_out = false;/**逾期**/

    paramObj.sort = "DESC";/**排序**/
    if($("#upSort").hasClass("active")){
        $("#downSort").addClass("active");
        $("#upSort").removeClass("active");
    }
    paramObj.searchText = null;/**模糊搜索框**/
    $("#searchText").val("");
    paramObj.currPage = 1;/**当前页数**/
    //调用加载列表函数
    //console.log(paramObj);
    loadWorkOrderList(paramObj);
}
/**
 * 点击退单--保存
 */
function cancelClickSave() {
	var workOrderId = $("#acceptId").val();
	var text = $("#backOrderText");
    var backOrderText = text.val();
    if("" != backOrderText){
        //console.log(workOrderId+"///"+backOrderText);
        //退单提交后台请求
        $.ajax({
            url:orderBackSaveUrl,
            traditional: true,
            data:{"workOrderId":workOrderId,backOrderText:backOrderText},
            type:"post",
            dataType:"json",
            success:function(data){

                //登录信息失效，ajax请求静态页面拦截
                onServiceComplete(data);

                $("#tipMsg").addClass("active").html(data.msg).show();
                function hideMsg(){
                    $("#tipMsg").addClass("active").html(data.msg).hide()
                }
                setTimeout(hideMsg,2000);
                $("#orderBack").modal("hide");
                //重新加载最新数据
                var paramObj = selectSearchParam();
                loadWorkOrderList(paramObj);
            },
            error:function(XMLHttpRequest){
    			error_500(XMLHttpRequest.responseText);
    		}
        });
    }else{
        $("#tipMsg").addClass("active").html("请填写退单说明！").show();
        function hideMsg(){
            $("#tipMsg").addClass("active").html("请填写退单说明").hide()
        }
        setTimeout(hideMsg,2000);
    }
}
/**
 * 点击退单
 */
function cancelClick() {
	//清空退单说明文本框
	var text = $("#backOrderText");
	text.val("");
    $("#pupAcceptWorkOrder").modal("hide");
    $("#orderBack").modal("show");
}
/**
 * 接单保存
 */
function acceptClickSave() {
	var workOrderId = $("#acceptId").val();
    var transactorChooseVal = $("select.transactorChoose option:selected").val();
    var stakeholderChooseVal = $("#stakeholderChooseSelectId").val();//获取下拉多选值
    if(null !=stakeholderChooseVal && null!=transactorChooseVal && 
       "" != transactorChooseVal && "" != stakeholderChooseVal){
        //接单分派人员提交后台请求
        $.ajax({
            url:orderAcceptSaveUrl,
            traditional: true,
            data:{"workOrderId":workOrderId,transactorId:transactorChooseVal,stakeholderId:stakeholderChooseVal},
            type:"post",
            dataType:"json",
            success:function(data){

                //登录信息失效，ajax请求静态页面拦截
                onServiceComplete(data);

                $("#tipMsg").addClass("active").html(data.msg).show();
                function hideMsg(){
                    $("#tipMsg").addClass("active").html(data.msg).hide()
                }
                setTimeout(hideMsg,1500);
                $("#allocate").modal("hide");
                //重新加载最新数据
                var paramObj = selectSearchParam();
                loadWorkOrderList(paramObj);
            },
            error:function(XMLHttpRequest){
    			error_500(XMLHttpRequest.responseText);
    		}
        });
    }else{
        $("#tipMsg").addClass("active").html("请选择分派人员！").show();
        function hideMsg(){
            $("#tipMsg").addClass("active").html("请选择分派人员").hide()
        }
        setTimeout(hideMsg,1500);
    }
}
/**
 * 点击弹框里的“接单”
 */
function acceptClick() {
    $("#pupAcceptWorkOrder").modal("hide");
    $("#allocate").modal("show");

    var workOrderId = $("#acceptId").val();
    loadServiceMembers(workOrderId);
}
/**
 * 接单操作（只限组长有此权限）
 * */
function acceptWorkOrder(){
	$("#acceptId").val("");
    var workOrderId = $(this).parent().find("input").val();
    if($("#process"+workOrderId).hasClass("process1") && $("#process"+workOrderId).hasClass("active")){
        //console.log("acceptWorkOrder");
        $("#pupAcceptWorkOrder").modal("show");
        $("#acceptId").val(workOrderId);
    }
}

/**
 * 点击加载绑定执行人和干系人数据
 * @param workOrderId,工单id
 * @param flag,标记，区分点击的是执行人还是干系人
 * */

function loadServiceMembers(workOrderId){
    var ServiceMembersValue = {
        stakeholderChooseSelect:{
            value:function(){
                return this.persion_id;
            },
            text: function () {
                return this.NAME;
            }
        },
        transactorChooseSelect:{
            value:function(){
                return this.persion_id;
            },
            text: function () {
                return this.NAME;
            }
        }
    };
    $.ajax({
        url:loadServiceMembersUrl,
        traditional: true,
        data:{workOrderId:workOrderId},
        type:"post",
        dataType:"json",
        success:function(data){

            //登录信息失效，ajax请求静态页面拦截
            onServiceComplete(data);

            var $doPersonSel = $("#transactorChooseSelectId");//执行人的下拉选
            var $relaPersonSel = $("#stakeholderChooseSelectId");//干系人的下拉选
            // 定义render数据的函数
            var renderFunc = function($target, data){
                $target.render(data,ServiceMembersValue);
                $target.selectpicker({noneSelectedText:'--请选择--'});
                $target.selectpicker("val", null);
                $target.selectpicker("refresh");
            };
            // render执行人
            renderFunc( $doPersonSel, data);
            $doPersonSel.selectpicker("val", "");
            // render干系人
            renderFunc( $relaPersonSel, data);
            // 执行人改变后, 修改对应干系人数据
            $doPersonSel.on("change",data,  function (e) {
                var value1 = $doPersonSel.val();

                if(value1){
                    var newData = [];
                    e.data.forEach(function (val, i) {
                        if (val.persion_id != value1) {
                            newData.push(val);
                        }
                    });
                    renderFunc( $relaPersonSel, newData);
                }
            });
            // 没有执行人信息时,不能选择干系人
            $("#stakeholderChoose .btn-default").off().on("click" ,function(e){
                var value1 = $doPersonSel.val();
                
                if(!value1){
                    alert("请选择执行人!");
                    e.stopPropagation();
                }
            });
        },
        error:function(XMLHttpRequest){
			error_500(XMLHttpRequest.responseText);
		}
    });
}
/**
 * 工单提交内审
 */
function submitInnerWorkOrderClick() {
	var workOrderId = $("#workOrderIdInner").val();
    $.ajax({
        url:submitInnerWorkOrderUrl,
        traditional: true,
        data:{workOrderId:workOrderId},
        type:"post",
        dataType:"json",
        success:function(data){

            //登录信息失效，ajax请求静态页面拦截
            onServiceComplete(data);

            $("#tipMsg").addClass("active").html(data.msg).show();
            function hideMsg(){
                $("#tipMsg").addClass("active").html(data.msg).hide()
            }
            setTimeout(hideMsg,2000);
            $("#innerSubWorkOrder").modal("hide");
            //重新加载最新数据
            var paramObj = selectSearchParam();
            loadWorkOrderList(paramObj);
        },
        error:function(XMLHttpRequest){
			error_500(XMLHttpRequest.responseText);
		}
    });
}
/**
 * 提交内审操作（只有该工单执行人可操作）
 * */
function submitInnerWorkOrder(){
	$("#workOrderIdInner").val("");
    var workOrderId = $(this).parent().find("input").val();
    if($("#process"+workOrderId).hasClass("process2") && $("#process"+workOrderId).hasClass("active")){
        //console.log("submitInnerWorkOrder");
        $("#innerSubWorkOrder").modal("show");
        $("#workOrderIdInner").val(workOrderId);
    }
}
/**
 * 提交终审保存
 */
function outSubWorkOrderSave() {
	var workOrderId =  $("#submitOutWorkOrder").val();
    var eventStatusVal = $("select.eventStatus option:selected").val();
    //console.log(eventStatusVal)
    if("" != eventStatusVal){
        $("#processState").modal("hide");
        $("#outSubWorkOrder").modal("show");

        $("#outSubmit").click(function () {
            $.ajax({
                url:submitOutWorkOrderUrl,
                traditional: true,
                data:{workOrderId:workOrderId,events_status:eventStatusVal},
                type:"post",
                dataType:"json",
                success:function(data){

                    //登录信息失效，ajax请求静态页面拦截
                    onServiceComplete(data);

                    $("#tipMsg").addClass("active").html(data.msg).show();
                    function hideMsg(){
                        $("#tipMsg").addClass("active").html(data.msg).hide()
                    }
                    setTimeout(hideMsg,1500);
                    $("#outSubWorkOrder").modal("hide");
                    //重新加载最新数据
                    var paramObj = selectSearchParam();
                    loadWorkOrderList(paramObj);
                },
                error:function(XMLHttpRequest){
        			error_500(XMLHttpRequest.responseText);
        		}
            });
        });
    }else{
        $("#tipMsg").addClass("active").html("请选择处理状态！").show();
        function hideMsg(){
            $("#tipMsg").addClass("active").html("请选择处理状态!").hide()
        }
        setTimeout(hideMsg,2000);
    }

}
/**
 * 提交终审操作（只有该工单所在运维小组组长可操作）
 * */
function  submitOutWorkOrder(){

	$("#submitOutWorkOrder").val("");
    var workOrderId = $(this).parent().find("input").val();
    if($("#process"+workOrderId).hasClass("process3") && $("#process"+workOrderId).hasClass("active")){
        //console.log("submitOutWorkOrder");
        $("#processState").modal("show");
        //加载绑定事件处理状态数据
        $("#eventStatusId").render(eventStatusData,eventStatusValue);
        $("#eventStatusId").selectpicker('val',"");
        $('#eventStatus .selectpicker').selectpicker('refresh');
        $("#submitOutWorkOrder").val(workOrderId);
    }
}

var testHe;
/****/
/**
 * 左侧菜单执行人搜索
 */
function transactorSearch(){
	var name=$(this).val();
	
	if(testHe === name)
		return;
	testHe = name;
	var newSelect = new selectMenuH("transactor-tree","transactor-menu","transactor","transactorId",
			                        searchSerIdByInsertUrl,directUse);
	if(null == name || ""==name){
		newSelect.hide();
		$("#transactorId").val("");
		directUse();
	}else{
		newSelect.onSelect('id','parent_id','name',name);
		newSelect.show();
	}
}
var testH;
/**
 * 左侧菜单干系人人搜索
 */
function stakeholderSearch(){
	var name = $(this).val();
	if(testH === name)
		return;
	restH = name;
	var newSelect = new selectMenuH("searchStake-tree","searchStake-menu","searchStake",
			                         "searchStakeId",searchSerIdByInsertUrl,directUse);
	if(null == name || ""==name){
		newSelect.hide();
		$("#searchStakeId").val("");
		directUse();
	}else{
		newSelect.onSelect('id','parent_id','name',name);
		newSelect.show();
	}
}
function directUse(){
	 //筛选查询条件
    var paramObj = selectSearchParam();
    paramObj.currPage = 1;
    //加载当前用户的工单列表
    loadWorkOrderList(paramObj);
}
/**
 * 企业部门、人员管理。ps：简版
 */
function organizationManagerSer(){
	//<a href="organization"><input type="button" value="组织架构管理"></a>
	window.location.href = "organization";
}
/**
 * jQuery函数
 * */
$(function () {
	
    //往页面绑定工单状态的数据
    $("#workOrderStateId").render(workOrderData,workOrderValue);
    $("#workOrderStateId").selectpicker('val',"");
    $('#workOrderState .selectpicker').selectpicker('refresh');

    //往页面绑定创建时间的数据
    $("#createTimeId").render(createTimeData,createTimeValue);
    $("#createTimeId").selectpicker('val',"");
    $('#createTime .selectpicker').selectpicker('refresh');

    //筛选查询条件
    var paramObj = selectSearchParam();
    paramObj.currPage = 1;
    //加载当前用户的工单列表
    loadWorkOrderList(paramObj);

    //获取服务商工单的ID
    //var workOrderId = $("#workOrderId").val();

    //点击“我执行的”：条件加载
    $("#myCol").click(loadByMyCol);

    //点击“我参与的”：条件加载
    $("#aboutMe").click(loadByAboutMe);

//  //点击“我可见的”：条件加载
//  $("#canSee").click(loadByICanSee);

    //点击选中创建时间选项：条件加载
    $("#createTime .selectpicker").change(loadByCreateTime);

    //点击选中的工单状态选项，条件加载
    $("#workOrderState .selectpicker").change(loadByWorkOrderState);

    //点击执行人搜索按钮：条件加载
    //$("#searchTransactor").click(loadByTransactorSearch);
	$("#transactor").keyup(transactorSearch);
	
    //点击干系人搜索按钮：条件加载
    //$("#searchStakeholder").click(loadByStakeholderSearch);
	$("#searchStake").keyup(stakeholderSearch);
	
    //服务级别:条件加载
    loadByServiceLevel();

    //服务期限：条件加载
    loadByServiceTime();

    //排序条件：条件加载
    $("#sortSelect").change(loadBySortSelect);

    //排序顺序：正序/倒序 加载
    workOrderSortClick();

    //模糊查询：回车加载
    $("#searchText").keydown(enterVagueSearch);
    //模糊查询：点击搜索按钮加载
    $("#clickSearch").click(clickVagueSearch);

    //清空按钮
    $("#clearAll").click(clearAllSearchParam);

    //接单：点击某条工单的接单按钮，
    // 进行接单操作（只限组长可操作）
    $("#workOrderList").on("click","span.waitAccept",acceptWorkOrder);
    //提交内审操作（只有工单执行人可操作）
    $("#workOrderList").on("click","span.inChecking",submitInnerWorkOrder);
    //提交终审操作（只有该工单所在运维小组组长可操作）
    $("#workOrderList").on("click","span.outChecking",submitOutWorkOrder);

    //上一页/下一页跳转
    $("#upWorkOrderPageId").click(upWorkOrderPage);
    $("#nextWorkOrderPageId").click(nextWorkOrderPage);
    $("#upWorkOrderPageFoot").click(upWorkOrderPage);
    $("#nextWorkOrderPageFoot").click(nextWorkOrderPage);
    $("#pageConfirm").click(choosePageToConfirm);

    //点击工单标题直接跳转到工单详情页
    $("#workOrderList").on("click","div .active",function(){
        var workOrderId = $(this).parent().parent().parent().find("input").val();
        var position = $(this).parent().parent().parent().find("input").next().val();
        var executor_user_id = $(this).parent().parent().parent().find("input").next().next().val();
        var user_id = $(this).parent().parent().parent().find("input").next().next().next().val();
        window.location.href = orderDetail+"?workOrderId="+workOrderId+"&position="+position+"&executor_user_id="+executor_user_id+"&user_id="+user_id;
    });
    //双击工单跳转到工单详情页面
    var orderDetail = 'orderDetail.html';
    $("#workOrderList").on("dblclick","ul",function(){
        var workOrderId = $(this).find("input").val();
        var position = $(this).find("input").next().val();
        var executor_user_id = $(this).find("input").next().next().val();
        var user_id = $(this).find("input").next().next().next().val();
        //console.log(executor_user_id);
        window.location.href = orderDetail+"?workOrderId="+workOrderId+"&position="+position+"&executor_user_id="+executor_user_id+"&user_id="+user_id;
    });
    //点击“管理”，
	$("li.manager").click(organizationManagerSer);
	 //点击接单按钮弹出接单分派工单框
    $("#accept").click(acceptClick);
    //点击"接单分派工单框"中的保存
    $("#allocateSave").click(acceptClickSave);
    //点击退单按钮弹出退单框
    $("#unTreat").click(cancelClick);
    //退单保存
    $("#orderBackSave").click(cancelClickSave);
    //点击提交内审
    $("#innerSubmit").click(submitInnerWorkOrderClick);
    //点击选择处理状态并提交
    $("#eventStatusSub").click(outSubWorkOrderSave);
})


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