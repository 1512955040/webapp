/**
 * 嵌入图表
 * 1、资产分类占比饼图
 * 2、最近30天登记资产动态柱状图
 * @author si.yu
 */
// 绘制资产分析占比饼图
function drawPie(data,res_name){

    var myChart = echarts.init(document.getElementById("classify"));
    var option = {
    	  color:['#eda6bb','#84c0e4','#f0d272','#fdb071'],
        title:{
            text:'资产分类占比',
            top:10,
            left:'25',
            textStyle: {
                fontSize: '12',
                fontWeight: 'lighter'
            }

        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
        	bottom:'10',
        	right:"10",
          	orient: 'vertical',
//            x: 'left',
            data:res_name
        },
        series: [
            {
                name:'访问来源',
                type:'pie',
                radius: ['60', '70%'],
                avoidLabelOverlap: false,
                label: {
                    normal: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        show: true,
                        textStyle: {
                            fontSize: '30',
                            fontWeight: 'bold'
                        }
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data:(function(){
                    var res = [];
                    var len = res_name.length;
                    while(len--){
                        res.push(data[len]);
                    }
                    return res;
                })()
            }
        ]
    };
    myChart.setOption(option);
}

/**
 * 请求资产分类数据
 * */
function classfiyData(){
    var res_data=[];
    var resourceName=[];

    $.ajax({
        url:classifyUrl,
        dataType:"json",
        type:'POST',
        async:true,
        data:'',
        contentType:'application/x-www-form-urlencoded; charset=UTF-8',//防止乱码
//		complete: onComplete,
        success:function(data){

            //登录信息失效，ajax请求静态页面拦截
            onComplete(data);

            $.each(data,function(name,value){
                resourceName.push(name);
                res_data.unshift({'name':name,'value':value});
                //resourceCount.push(value);
            });


           if(isEmptyObject(data)||data==0||data.length==0){//无数据显示站位文字和图片
           		//$('.echart-1').html('');
           		$('.takePlace').removeClass('dn');
           	}else{

           		//$('.echart-1').html('');
           		drawPie(res_data,resourceName);
           	}

        },
        error:function(XMLHttpRequest){
			error_500(XMLHttpRequest.responseText);
		}
    });
}


//判断对象是否为空
function isEmptyObject(obj) {
  for (var key in obj) {
    return false;
  }
  return true;
}



/**
 * 最近30天登记资产分类数量柱状图
 * */
function lastThirtyResource(){
    var resCountChart = echarts.init(document.getElementById("resource_column"));
    var option = {
    	color:['#eda6bb','#84c0e4','#f0d272','#fdb071'],
        title : {
            text:'最近30天登记资产分类数量',
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
                data : []
            }
        ],
        yAxis : [],
        series : []
    };
    var columnData = [];//绘制柱状图数据
    var res_data = [];
    /**
     * 加载数据
     * */
    $.ajax({
        url:lashThirtyUrl,
        type:'POST',
        dataType:'json',
        async:true,
        contentType:'application/x-www-form-urlencoded; charset=UTF-8',//防止乱码
        data:{dateTime:30},
        success: function (data) {
            //登录信息失效，ajax请求静态页面拦截
            onComplete(data);
          //console.log(data);
            var legends = [];
            var Series = [];
            var Item = function(){
                return {
                    name:'',
                    type:'bar',
                    barWidth : 20,
                    stack: '资产分类',
                    data:[]
                }
            };
            //获取查询资产分类数量数据
            columnData=data.columnData;

            //无数据时,制造一些数据,使能显示表格内容
            if (isEmptyObject(columnData)) {
              columnData["无数据"] = new Array(31);
              for (var i = 0; i < data.xAxisData.length; i++) {
                columnData["无数据"][i]=0;
              }
            }

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
//            var data1 = Series[0].data;
//            var data2 = Series[1].data;
//            var data3 = Series[2].data;
//            var data4 = Series[3].data;
//            var dataLen = data1.length;
//            var sumMax = data1[0]+data2[0]+data3[0]+data4[0];
//            for(var i=0;i<dataLen;i++){
//                if(sumMax<data1[i]+data2[i]+data3[i]+data4[i])
//                    sumMax = data1[i]+data2[i]+data3[i]+data4[i];
//            }
            // console.log(sumMax);
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

            //获取横坐标数据
            option.xAxis[0].data = data.xAxisData;
            if(sumMax != 0){
              option.legend.data = legends;
            }
            option.series = Series; // 设置图表

            resCountChart.setOption(option);// 重新加载图表
            //drawLastMonthData(xAxisData);
        },
        error:function(XMLHttpRequest){
			error_500(XMLHttpRequest.responseText);
		}
    });
}
/**
 * 构造假数据
 * res_data  数据本身的格式
 * Series    需要构造的假数据
 * len  需要构造到几个。
 */
//var createFalseData = function createFalseData(res_data,Series,len){
//    //构造假数据，使Series的长度为4
//
//}
