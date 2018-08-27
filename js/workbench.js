var contractHtml = "contractDetail.html";
/**
 * 绘制统计图
 * @author si.yu
 * */
function drawPie1(res_id,res_counts,res_total,color1,color2){
    var circleChart = echarts.init(document.getElementById('res_'+res_id));
    var option = {
        title:{
            text:res_counts,
            top:10,
            left:'25',
            textStyle: {
                fontSize: '16',
                fontWeight: 'bold',
                color:'#fff'
            }
        },
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
 * 动态加载资产分类统计图
 * @author si.yu
 * */
function createDiv1(res_name,res_id){
    var liDiv = document.createElement("li");//创建li标签
    var frameDiv = document.createElement("div");//创建div标签
    var bodyFa = document.getElementById('res_countsData');//获取到父节点
    frameDiv.setAttribute("id","res_"+res_id);
    frameDiv.className = 'circle';
    liDiv.className = "fl";


    var p = document.createElement("p");
    p.className = 'res-countsData-num';
    p.innerHTML = res_name;
    liDiv.appendChild(frameDiv);
    liDiv.appendChild(p);
    bodyFa.appendChild(liDiv);
      frameDiv.onmousedown = function(){
          searchData(res_id);
      }
}

/**
 * 加载资产分类饼图统计
 * @author si.yu
 * */
function resourceBallCount(){

    var color = [
        {"color1":'#5286ce',color2:'#84c0e4'},
        {"color1":'#d7b23e',color2:'#f0d272'},
        {"color1":'#c47e95',color2:'#eda6bb'},
        {"color1":'#7871af',color2:'#b3ace2'},
        {"color1":'#5286ce',color2:'#84c0e4'}
    ];
    $.ajax({
        url:resourceClassifyCountsUrl,
        dataType:"json",
        type:'POST',
        async:true,
        data:{timeInterval:30,mark:8},
        contentType:'application/x-www-form-urlencoded; charset=UTF-8',//防止乱码
//      complete:err(data),
        success: function (data) {

            //登录信息失效，ajax请求静态页面拦截
            onComplete(data);

        	$('#res_countsData').html('');
            var len = data.length;
            //alert(color[len].color1);
            while(len--){
                createDiv1(data[len].name,data[len].id);
                drawPie1(data[len].id,data[len].conuts,data[len].total,color[len].color1,color[len].color2);
            }
        },
        error:function(XMLHttpRequest){
			error_500(XMLHttpRequest.responseText);
		}
    });
}

/**
 * 查询企业30天内到期的合同
 */
function contractDeadLine(){

	$.ajax({
		url:loadContractDeadLineUrl,
		type:"get",
		dataType:"json",
//		complete:err(data),
		success:function(result){

            //登录信息失效，ajax请求静态页面拦截
            onComplete(result);
			$("#contractInfo").render(result.data);
		},
		error:function(XMLHttpRequest){
			error_500(XMLHttpRequest.responseText);
		}
	});
}
/**
 * 跳转到合同详情页面
 */
function contractDetail(){
	var contractId = $(this).next().val();
	window.location.href = contractHtml+"?contractId="+contractId;
}
/**
 * 企业部门、人员管理。ps：简版
 */
function organizationManager(){
	//<a href="organization"><input type="button" value="组织架构管理"></a>
	window.location.href = "organization";
}
/**
 * 事件统计，企业工作台页面，柱状图统计(最近12个月事件动态)
 */
function eventStatistics(){
	var myChart = echarts.init(document.getElementById("eventStatisticsBox"));
	var option = {
		color:['#b3ace2','#eda5bb'],
        title : {
            text:'最近12个月事件动态',
            left:'25',
            top:10,
            textStyle: {
                fontSize: '12',
                fontWeight: 'lighter'
            }
        },

        tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        legend: {
        	bottom:'10',

            show:true,
            data:[]
        },
        grid: {
            left: '30',
            right: '30',
            bottom: '50',
            containLabel: true
        },
        xAxis : [
            {
                type : 'category',
                splitArea : {show : true},
                splitNumber: 5,
                boundaryGap:true,
                axisTick: {
                	alignWithLabel: true//基轴对齐
            	},
                data : []//x轴周数据
            }
        ],
        yAxis : [],
        series : []
    };
	var columnData = [];//绘制柱状图数据
    var res_data = [];
	$.ajax({
		url:eventStatisticsUrl,
		type:"get",
		dataType:"json",
		success:function(result){
			//登录信息失效，ajax请求静态页面拦截
            //console.log(result);
            onComplete(result);
			if(result.status == 1){
//				console.log(result);//纵坐标数据  (未完结 已完结)
//				console.log(result.dataSub);//横坐标数据
				var legends = [];//name未完结 已完结
            	var Series = [];//value
	            var Item = function(){
	                return {
	                    name:'',
	                    type:'bar',
	                    barWidth : 20,
	                    stack: '请求动态',
	                    data:[]
	                }
	            };
	            //获取查询资产分类数量数据
	            columnData=result.data;
	            $.each(columnData, function (name,value){
	                res_data.push({'name':name,'value':value});
	            });

	            for(var i=0;i < res_data.length;i++){
	                var it = new Item();
	                it.name = res_data[i].name;
	                legends.push(res_data[i].name);
	                it.data = res_data[i].value;
	                Series.push(it);
	            }
                /**
                 * 设置：数据最大值小于5时，纵坐标刻度为1，最大刻度设为5
                 * */
                /*=======================Begin=========================*/
	            var sumMax = 0;
	            var days = Series[0].data;
	            for(var i=0;i<days.length;i++){
	            	var sum = 0;
	            	for(var j=0;j<Series.length;j++){
	            		sum += Series[j].data[i];
	            	}
	            	if(sumMax < sum){
	            		sumMax = sum;
	            	}
	            }
//                var data1 = Series[0].data;
//                var data2 = Series[1].data;
//                var dataLen = data1.length;
//                var sumMax = data1[0]+data2[0];
//                for(var i=0;i<dataLen;i++){
//                    if(sumMax<data1[i]+data2[i])
//                        sumMax = data1[i]+data2[i];
//                }
                //console.log(sumMax);
                if(sumMax <= 5){
                    option.yAxis = [{
                        max:5
                    }];
                }else{
                    option.yAxis = [{
                        type:'value',
                        min:0
                    }];
                }
                /*========================End==============================*/
//	            //获取横坐标数据
	            option.xAxis[0].data = result.dataSub;
	            option.legend.data = legends;
	            option.series = Series; // 设置图表

	            myChart.setOption(option);// 重新加载图表
			}else{
				console.log(result.msg);
			}
		},
		error:function(XMLHttpRequest){
			error_500(XMLHttpRequest.responseText);
		}
	});
}
eventStatistics();
/*-----------------------事件请求五个统计资产数量图-----------------------------*/
/*----------------------------------开始----------------------------------------*/
function searchData(res_id){
//	console.log(res_id);
    //点击事件球形图，跳转到事件详情页面
    window.location.href="eventList.html?flag="+res_id;
}

function createDiv2(res_name,res_id){
    var liDiv = document.createElement("li");//创建li标签
    var flContentBox=document.createElement('div');
    flContentBox.className="flContentBox";
    var frameDiv = document.createElement("div");//创建div标签 canvas父节点div
    var bodyFa = document.getElementById('eventCount');//获取到父节点
    frameDiv.setAttribute("id","res"+res_id);
    frameDiv.className = 'circle';
    liDiv.className = "fl";

    var p = document.createElement("span");
    p.className = 'eventCountMark';
    p.innerHTML = res_name;
    flContentBox.appendChild(frameDiv);
    flContentBox.appendChild(p);
    liDiv.appendChild(flContentBox);

    bodyFa.appendChild(liDiv);
    frameDiv.onmousedown = function(){
        searchData(res_id);
    }
}

function drawPie2(res_id,res_counts,res_total,res_mark,color1,color2){
    var circleChart1 = echarts.init(document.getElementById('res'+res_id));
    var option1 = {
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
        color: [color1,color2],
        borderWidth: 10,
        series: [
            {
                name:res_mark,
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
                name:res_mark,
                radius: ['70%', '100%'],     //极坐标
                avoidLabelOverlap: false,   //标签重叠策略
                hoverAnimation: false,
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
                data:[res_total-res_counts,res_counts]

            }
        ]
    };
    circleChart1.setOption(option1);
}
/**
 * 事件统计，企业工作台页面，球形图统计（事件摘要）
 */
function eventStatisticsByStatus(){
	var color = [
        {"color1":'#c47e95',color2:'#eda6bb'},//逾期
        {"color1":'#e0904f',color2:'#fdb071'},//今日到期
        {"color1":'#d7b23e',color2:'#f0d272'},//本周新生
        {"color1":'#5286ce',color2:'#84c0e4'},//处理中
        {"color1":'#74bc8e',color2:'#88dba7'}//未发布
    ];
	$.ajax({
		url:eventStatisticsByStatusUrl,
		type:"get",
		dataType:"json",
		success:function(result){
			//登录信息失效，ajax请求静态页面拦截
            onComplete(result);

			if(result.status == 1){
                $('#eventCount').html('');
				var len = result.data.length;

				for(var i=0;i<len;i++){

					createDiv2(result.data[i].mark,result.data[i].id);
					drawPie2(result.data[i].id,result.data[i].count,result.data[i].total,result.data[i].mark,color[i].color1,color[i].color2);
				}

				//console.log(result.data);//数据
			}else{
				console.log(result.msg);
			}
		},
		error:function(XMLHttpRequest){
			error_500(XMLHttpRequest.responseText);
		}
	});
}

/*----------------------------------结束----------------------------------------*/
/*-----------------------事件请求五个统计资产数量图-----------------------------*/


function getResTrendsData(){

    var trendsChart = echarts.init(document.getElementById("resource_trends"));
    var trendsOption = {
        color:['#b3ace2','#eda5bb'],
        title : {
            text:'最近12个月资产动态',
            left:'25',
            top:10,
            textStyle: {
                fontSize: '12',
                fontWeight: 'lighter'
            }
        },

        tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        legend: {
            bottom:'10',

            show:true,
            data:[]
        },
        grid: {
            left: '30',
            right: '30',
            bottom: '50',
            containLabel: true
        },
        xAxis : [
            {
                type : 'category',
                splitArea : {show : true},
                splitNumber: 5,
                boundaryGap:true,
                axisTick: {
                    alignWithLabel: true//基轴对齐
                },
                data : []//x轴周数据
            }
        ],
        yAxis :[],
        series : []
    };

    var TrendsColumnData = [];//绘制柱状图数据
    var resTrends_data = [];

    $.ajax({
        url:getResTrendsDataUrl,
        type:"get",
        dataType:"json",
        success:function(data){
            //登录信息失效，ajax请求静态页面拦截
            onComplete(data);
            //console.log(data);

            var legends = [];//name未完结 已完结
            var Series = [];//value
            var Item = function(){
                return {
                    name:'',
                    type:'bar',
                    barWidth : 20,
                    data:[]
                }
            };
            //获取查询资产动态数据
            TrendsColumnData=data.columnData;
            $.each(TrendsColumnData, function (name,value){
                resTrends_data.push({'name':name,'value':value});
            });
            for(var i=0;i < resTrends_data.length;i++){
                var it = new Item();
                it.name = resTrends_data[i].name;
                legends.push(resTrends_data[i].name);
                it.data = resTrends_data[i].value;
                Series.push(it);
            }
//            createData(resTrends_data,Series,2);
            /**
             * 设置：数据最大值小于5时，纵坐标刻度为1，最大刻度设为5
             * */
            /*-----------------------Begin--------------------------*/
            var serLen = Series.length;
            var max = [];
            while(serLen--){
                var singleData = Series[serLen].data;
                    //console.log(serLen+"="+singleData);
                var dataLen = singleData.length;
                var maxValue = singleData[0];
                for(var i=0;i<=dataLen;i++){
                    if(maxValue<singleData[i]){
                        maxValue = singleData[i];
                    }
                }
                max.push(maxValue);
            }
            var dataMax = 0;
            if(max[0] > max[1]){
                dataMax = max[0];
            }else{
                dataMax = max[1];
            }
            //console.log(dataMax);
            if(dataMax <= 5){
                trendsOption.yAxis = [{
                        max:5
                }];
            }else{
                trendsOption.yAxis = [{
                    type:'value',
                    min:0
                }];
            }
            /*-----------------------end--------------------------*/

            //获取横坐标数据
            trendsOption.xAxis[0].data = data.xAxisData;
            trendsOption.legend.data = legends;
            trendsOption.series = Series; // 设置图表

            //if (data.columnData)
            trendsChart.setOption(trendsOption);// 重新加载图表

        },
        error:function(XMLHttpRequest){
            error_500(XMLHttpRequest.responseText);
        }
    });
}

var getHistory=function(){
	if($.cookie("history")){
	 var json = eval("("+$.cookie("history")+")");
	 var list ="";

	 $(json).each(function(){
	 	if(this.url.indexOf('eventDetail')>=0){//事件详情
	 		list = list + "<li><i class='add-img1'></i><a class='title' href="+this.url+" title="+this.title+">"+this.title+"</a></li>";
	 	}else if(this.url.indexOf('assetDetail')>=0){//资产详情
	 		list = list + "<li><i class='add-img2'></i><a class='title' href="+this.url+" title="+this.title+">"+this.title+"</a></li>";
	 	}else if(this.url.indexOf('contractDetail')>=0){//合同详情
	 		list = list + "<li><i class='add-img3'></i><a class='title' href="+this.url+" title="+this.title+">"+this.title+"</a></li>";
	 	}else if(this.url.indexOf('projectDetail')>=0){//项目详情
	 		list = list + "<li><i class='add-img4'></i><a class='title' href="+this.url+" title="+this.title+">"+this.title+"</a></li>";
	 	}
	 })
	 $("#history").html(list);
	 }
}
$(function(){
	getHistory();
	$("span.navlist-img1").addClass("active");
	//30天内将要到期的合同
	contractDeadLine();

	//事件球体
    eventStatisticsByStatus();
    $("#resCountsUp").click(function () {

        eventStatisticsByStatus();
    });

    //加载资产分类饼状图
    classfiyData();
    /**
     * 资产分类图表刷新
     * */
    var updateClassify = document.getElementById("upClassify");
    updateClassify.onclick = function () {
        classfiyData();
    }

    //加载资产动态数据
    getResTrendsData();
    //刷新资产动态数据
    $("#upResource_trends").click(function () {
        getResTrendsData();
    });

	//点击某一个合同的名字，跳到合同详情页面
	$("#contractInfo").on("click","li span[data-bind='name']",contractDetail);
	//点击刷新按钮
	$("#title-update").click(contractDeadLine);
	//点击“管理”，
	$("li.manager").click(organizationManager);
	//事件统计，企业工作台页面，柱状图统计

	$('#upEventStatistics').click(eventStatistics);
	//事件统计，企业工作台页面，球形图统计
});
/**
 * 构造假数据
 * res_data  数据本身的格式
 * Series    需要构造的假数据
 * len  需要构造到几个。
 */
//var createData = function createFalseData(res_data,Series,len){
//    //构造假数据，使Series的长度为4
//    if(res_data.length>0 && Series.length<len){
//    	var nameHelp = "";
//        var itHelp = res_data[0].value;
//        var it = new Item();
//        it.name = nameHelp;
//        it.data = itHelp;
//        for(var i=0;i<(len-res_data.length);i++){
//        	Series.push(it);
//        }
//    }
//}
