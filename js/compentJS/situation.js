/*
 *服务商界面 工作台 近12个月工单执行情况
 * 1.近12个月工单执行情况
 * 2.工单统计
 * 3.工单执行柱状图
 * */
var dom = document.getElementById("containerSituation");
var myChart = echarts.init(dom);
var app = {};
option = null;
option = {
	color:['#f0d272','#84c0e4'],
    legend: {
    	itemWidth: 15,
        itemHeight: 10,
	  	top:'15',
        right:"60",
//      borderWidth:10
//      orient: 'vertical',
//      x: 'left',
//      data:res_name
    },
    tooltip: {},
    dataset: {
        source: [
            ['product', '每月完成工单数量', '每月增加工单数量'],
            ['01', 85.8, 93.7],
            ['02', 73.4, 55.1],
            ['03',65.2, 82.5],
            ['04',28, 39.1],
            ['05',18, 53],
            ['06',53.9, 15],
            ['07',26, 5],
            ['08',53.9, 20],
            ['09',47, 2],
            ['10',10, 18],
            ['11',13, 48],
            ['12',8, 30]
        ]
    },
    xAxis: {
    	type: 'category',
//  	axisLine:{
//  		lineStyle:{
//  			color:'#e8e8e8',
//  		}
//  	}
    },
    
    yAxis: {},
    series: [
        {type: 'bar'},
        {type: 'bar'}
    ]
};
if (option && typeof option === "object") {
    myChart.setOption(option);
}
//2
var WorkorderNum=Number($("#WorkorderNum").html())
var WorkorderChange=Number($(".WorkorderChange").html())
var WorkorderChange1=Number($(".WorkorderChange1").html())
var WorkorderChange2=Number($(".WorkorderChange2").html())
if($("#WorkorderNum").html()!==''&&$("#WorkorderNum").html()!=='0'){
	$("#WorkorderColor1").css('width',(WorkorderChange/WorkorderNum)*200+"px")
	$("#WorkorderColor2").css('width',(WorkorderChange1/WorkorderNum)*200+"px")
	$("#WorkorderColor3").css('width',(WorkorderChange2/WorkorderNum)*200+"px")
}else{
	$(".WorkorderChange").html('0')
	$(".WorkorderChange1").html('0')
	$(".WorkorderChange2").html('0')
}
//3
var dom1 = document.getElementById("containerWorkorder");
var myChart = echarts.init(dom1);
var app = {};
option = null;
option = {
	color:['#f0d272','#84c0e4',"red"],
    legend: {
    	itemWidth: 15,
        itemHeight: 10,
	  	bottom:'0',
        right:"150",
        itemGap:45
//      borderWidth:10
//      orient: 'vertical',
//      x: 'left',
//      data:res_name
    },
    tooltip: {},
    dataset: {
        source: [
            ['product', '新增', '处理',"审核"],
            ['01', 85.8, 93.7,30],
            ['02', 73.4, 55.1,40],
            ['03',65.2, 82.5,50],
            ['04',28, 39.1,10],
            ['05',18, 53,20],
            ['06',53.9, 15,30],
            ['07',26, 5,40],
            ['08',53.9, 20,50],
            ['09',47, 2,60],
            ['10',10, 18,70],
            ['11',13, 48,80],
            ['12',8, 30,90]
        ]
    },
    xAxis: {
    	type: 'category',
//  	axisLine:{
//  		lineStyle:{
//  			color:'#e8e8e8',
//  		}
//  	}
    },
    
    yAxis: {},
    series: [
        {type: 'bar'},
        {type: 'bar'},
        {type: 'bar'}
    ]
};
if (option && typeof option === "object") {
    myChart.setOption(option);
}
