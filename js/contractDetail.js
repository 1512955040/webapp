/**
 * 合同详情页 Created by EKuter-si.yu on 2017/1/22.
 */
var contractList = "contract.html";
var printContract = "printContrat.html";
var contractId;//合同id
var startHistoryItem = 0; //记录请求历史信息时的起始位置
var numbersHistoryItem = 8;  //记录请求历史信息的条数;
/**
 * 加载合同详情信息
 * @param dataArea .绑定数据的区域
 * */
function loadContractDetail(contractId,dataArea){
    $.ajax({
        traditional:true,
        url:loadContractDetailUrl,
        dataType:"json",
        type:'POST',
        async:true,
        data:{contractId:contractId},
        contentType:'application/x-www-form-urlencoded; charset=UTF-8',//防止乱码

        success:function(data){
			console.log(data);
            //登录信息失效，ajax请求静态页面拦截
            onComplete(data);
            if(null != data){
            	//判断合同类型，只有服务合同按钮才有不同
            	if(28 == data.contract_type){
                    $("#SLAInfo").show();
                    $("#operationGroup").show();
            		var elements = ["conEdit","addResource","conCheck","conChenckRes",
            		                "conContinue","revoke","deleteCon"];
            		//隐藏所有的按钮
            		for(var i=0;i<elements.length;i++){
            			$("#"+elements[i]).hide();
            		}
            		//1.根据创建者来筛选
            		var creater = data.create_enterprise;
            		if(0 == creater){
            			//非创建者
            			creater = 0;
            		}else{
            			//是创建者
            			creater = 1;
            		}
            		var rules1 = {
            			0:["addResource","conChenckRes","conContinue"],
            			1:["conEdit","addResource","conCheck",
   		                   "conContinue","revoke","deleteCon"]
            		};
            		var fileterByCreater = showElements(elements, creater, rules1).show;
            		//2.根据合同状态来筛选
            		var conCheckStatus = data.approval_status;
            		var rules2 = {
            				79:["conEdit","addResource","deleteCon"],
            				80:["conChenckRes","revoke"],
            				81:["conContinue"],
            				82:["conEdit","addResource","deleteCon"],
            				83:["conEdit","addResource","conCheck","deleteCon"]//表示具备提交审阅的条件
            		};
            		var showEle = showElements(fileterByCreater,conCheckStatus,rules2).show;
            		//显示需要显示的按钮
            		if(null != showEle){
            			for(var i=0;i<showEle.length;i++){
            				$("#"+showEle[i]).show();
            			}
            		}
            	}else{
            		//其他合同隐藏“提交审阅”，“审阅”,"撤回"按钮
            		$("#conCheck,#conChenckRes,#revoke").hide();
            	}
                //获取附件的个数
                var fileDownloads=data.fileDownload.length;
                if(null != fileDownloads){
//                  var attachmentCount = electronic_type.split(",").length;
                    data.attachment = fileDownloads;
                }else{
                    data.attachment = 0;
                }
                var hrefVal={
                		fileDownLoad:{
                			href:function(){
                				return this.filePath;
                			}
                		}
                }
                //上传人
                $(".filePerson").html(data.person_name);
                //绑定文件的下载路径
                $("div.contractFile").render(data.fileDownload,hrefVal);
                //$("#attachment").render(attachmentCount);
                //console.log(data);
                $('#oldStart_time').val(data.start_time);
                $('#oldEnd_time').val(data.end_time);
                data.start_time=formatDate(data.start_time);
                data.end_time=formatDate(data.end_time);
                //console.log(data);
                $("#conDetailRight").render(data);
                $("#conDetailLeft").render(data);
                $('.conright-infoWrap-right').css('height',$('.conright-infoWrap-left').height()+'px');
                var formatDateStr=formatDate(data.create_time_string);
                data.create_time_string=formatDateStr;
                $("#titleInfo").render(data);
                //$("#resourceDetailId").render(data);

                var serviceId = $("#party_B_id").val();
                var conStatus = data.approval_status;//审阅状态
                $("#conStatus").val(conStatus);
                loadConDetailSLAList(serviceId,conStatus);
                var groupId = data.operstion_group_id;
                loadOperationGroupInfo(groupId);
                setHistory(data.name);
                getHistory();
                //往打印的弹框里绑定数据
                if(null != dataArea){
                	dataArea.contractInfo.render(data);
                	dataArea.contractEnterprise.render(data);
                }
                //是否删除附件信息
//				rowWrapDelete($('.modal-body-bottom-rowWrap'),$('.fileDelete'),$('#ServiceContractDelete'),$('.ServiceContractDetail'),$("[data-bind='filePath']"));
            }
        },
        error:function(XMLHttpRequest){
			error_500(XMLHttpRequest.responseText);
		}
    });
}
var formatDate=function(time_string){
	var timeString=time_string.split('-');
	//console.log(timeString);
	return timeString[0]+'年'+timeString[1]+'月'+timeString[2]+'日';
}

/**
 * 加载归属该合同的所有资产清单
 * @param contractId 合同ID
 * @param page 页数
 * @param count 限定的条数
 * */
var count = 5;

function loadResListOfTheContract(contractId,currPage,resource_type){
	//console.log(contractId,currPage,count,resource_type);
    //console.log("////////////////////..."+resource_type+"//==/"+currPage+"///"+contractId);
    $.ajax({
        traditional:true,
        url:loadResListOfTheContractUrl,
        dataType:"json",
        type:'get',
        async:true,
        data:{contractId:contractId,page:currPage,count:count,resource_type:resource_type},
        contentType:'application/x-www-form-urlencoded; charset=UTF-8',//防止乱码

        success:function(data){

            //登录信息失效，ajax请求静态页面拦截
            onComplete(data);

            //console.log(data);
            var conStatus = $("#conStatus").val();
            if("81" == conStatus || "80" == conStatus){
                $("#con_res_list").find("i").remove();
                $("#res_add").remove();
                $("#res_delete").remove();
            }
            var len = data.length;
              //console.log(len);
            if(len != 0){

				$('.takePlace').addClass('dn');
				$(".conAsset-data-item").removeClass('dn');
                $("#con_res_list").show();
                $('.conright-item-title').show();
                $('.conAsset-body-title').show();
                $('#contractPage').show();

				//console.log(data);//
                $("#con_res_list").render(data);

                var len  = data.length;
                var totalPage = data[0].page;
                var totalNum = data[0].total_numbers;

                var beginCount = (currPage-1)*(count)+1;
                var endCount;
                if(len - count == 0){
                    endCount = beginCount-1 + count;
                }else{
                    endCount = beginCount-1 + (len)%(count);
                }

                var contractPage = {
                    "beginCount":beginCount,
                    "endCount":endCount,
                    "totalCount":totalNum,
                    "currPage":currPage,
                    "totalPage":totalPage
                }
                var contractPageClass = {
                    upConPage:{
                        class:function(){
                            if(currPage - 1 == 0){
                                return "conAsset-left conAsset-img";
                            }else{
                                return "conAsset-left conAsset-img active";
                            }
                        }
                    },
                    nextConPage:{
                        class:function(){
                            if(totalPage - 1 == 0 || totalPage-currPage == 0){
                                return "conAsset-right conAsset-img";
                            }else{
                                return "conAsset-right conAsset-img active";
                            }
                        }
                    }
                }
                //向页面绑定分页数据
                $("#contractPage").render(contractPage,contractPageClass);
    			setLeftHeight();
                $('.conright-infoWrap-right').css('height',$('.conright-infoWrap-left').height()+'px');
            }else{

                $(".conAsset-data-item").addClass('dn');
                $('.conAsset-body-title').hide();
                $('.takePlace').removeClass('dn');
                $('#contractPage').hide();
//              var contractPage = {
//                  "beginCount":0,
//                  "endCount":0,
//                  "totalCount":0,
//                  "currPage":0,
//                  "totalPage":0
//              }
//              $("#contractPage").render(contractPage);
            }
        },
        error:function(XMLHttpRequest){
			error_500(XMLHttpRequest.responseText);
		}
    });
}

/**
 * 点击合同已关联每个资源前面的小方块
 * 1.给小方框加上样式
 * 2.获取当前选中的资产个数，只有的选中了资产，才会显示“删除”按钮
 */
function ResProClick(){

    if($(this).find('i').hasClass("active")){
        $(this).find('i').removeClass("active");
    }else{
        $(this).find('i').addClass("active");
    }
    var ids = getCheckRes();
//    console.log(ids);
    showDelButton(ids);
    //deleteClick(contractId,currPage);
}
/**
 * 获取当前合同已关联的资产中选中资产的ids
 * @returns {Array}
 */
function getCheckRes(){
    var ids = [];
    var $checkPro = $("#con_res_list").find("i.active").next();
    $checkPro.each(function(){
        ids.push($(this).val());
    });
    return ids;
}
/**
 * 改变“删除”样式
 * @param ids
 */
function showDelButton(ids){

    if(ids.length == 0){
        $('#res_delete').attr('disabled','true');
        $('#res_delete .conAsset-delete').addClass('disabled');

    }else{
        $('#res_delete').attr('disabled',false);
        $('#res_delete .conAsset-delete').removeClass('disabled');
    }
}
/**
 * 点击删除
 */
function deleteClick(){

    var ids = [];
    ids = getCheckRes();
    if(ids != 0){

        $("#pupDelete").modal('show');
        $("#delConfirm").click(function(){
            $("#pupDelete").modal('hide');
            //从页面上获取当前资产分类选中条件
            var con_categoryCode = $("#con_categoryCode").val();
            //从页面上获取当前合同的ID
            var contractId = document.getElementById("contract_id").value;
            //从页面上获取页数信息
            var currPage = $("#currPage").val();
            if("" == currPage){
                currPage = 1;
            }else{
                currPage = $("#currPage").val();
            }
            $.ajax({
                url:contractResDelUrl,
                traditional: true,
                data:{"ids":ids,"contract_id":contractId},
                type:"post",
                dataType:"json",
                success:function(data){

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
                    //清除选中的样式
                    $("#con_res_list").find("i.active").removeClass("active");
                    $('#res_delete').attr('disabled','true');
                    $('#res_delete .conAsset-delete').addClass('disabled');

                    //操作完成加载数据
                    loadResListOfTheContract(contractId,currPage,con_categoryCode);

                },
                error:function(XMLHttpRequest){
        			error_500(XMLHttpRequest.responseText);
        		}
            });
        });

    }

}
/**
 * 上下页跳转操作
 * */
function upOrNextPage(contractId){

    var upConPage = document.getElementById("upConPageId");
    var nextConPage = document.getElementById("nextConPageId");

    /**
     * 点击上一页操作
     * */
    if(null != upConPage){
        upConPage.onclick = function () {

            //从页面获取当前页数
            //从页面上获取当前资产分类选中条件
            var con_categoryCode = $("#con_categoryCode").val();
            var currPage = $("#currPage").val();
            if(currPage - 1 == 0){
                $("#tipMsg").addClass("active").html("第一页").show();
                function hideMsg(){
                    $("#tipMsg").addClass("active").html("第一页").hide()
                }
                setTimeout(hideMsg,1500);
            }else{
                currPage--;
                loadResListOfTheContract(contractId,currPage,con_categoryCode);
            }
        }
    }
    /**
     * 点击下一页操作
     * */
    if(null != nextConPage){
        nextConPage.onclick = function () {

            //从页面上获取当前资产分类选中条件
            var con_categoryCode = $("#con_categoryCode").val();
            //从页面获取当前页面和总页数
            var currPage = $("#currPage").val();
            var totalPage = $("#totalPage").val();
            if(totalPage - currPage == 0 || totalPage - 1 == 0){
                $("#tipMsg").addClass("active").html("最后一页").show();
                function hideMsg(){
                    $("#tipMsg").addClass("active").html("最后一页").hide();
                }
                setTimeout(hideMsg,1500);
            }else{
                currPage++;
                loadResListOfTheContract(contractId,currPage,con_categoryCode);
            }

        }
    }
}


/**
 * 加载运维小组成员信息
 * */
function loadOperationGroupInfo(groupId){

    if(null != groupId){
        $.ajax({
            traditional: true,
            url: searchOperationGroupUrl,
            dataType: "json",
            type: 'POST',
            async: true,
            data: {groupId:groupId},
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8', //防止乱码

            success: function(data) {

                //登录信息失效，ajax请求静态页面拦截
                onServiceComplete(data);
                //console.log(data);
                var groupLeader = data.headman;
                var groupMembers = data.member_group;
                $("#groupLeaderInfo").render(groupLeader);

                var groupMem = {
                    delButton:{
                        id: function () {
                            return "delMem"+this.per_id;
                        }
                    }
                }
                $("#groupMembersInfo").render(groupMembers,groupMem);
            },
            error: function(XMLHttpRequest) {
                error_500(XMLHttpRequest.responseText);
            }
        });
    }else{
        $("#yunweiGroup").remove();
    }
}

/**
 * 加载并绑定SLA数据
 * */
function loadConDetailSLAList(serviceId,conStatus,dataArea){

    $.ajax({
        traditional:true,
        url:loadSLAInfoUrl,
        dataType:"json",
        type:'POST',
        async:true,
        data:{serviceId:serviceId},
        contentType:'application/x-www-form-urlencoded; charset=UTF-8',//防止乱码

        success:function(result){

            //登录信息失效，ajax请求静态页面拦截
            onServiceComplete(result);
            var data = [];
            //默认选中关联该合同的SLA
            var slaId = $("#con_slaId").val();

            //判断如果合同已经生效，则SLA信息只显示该合同已选中的
            if(null != conStatus){
            	if("81" == conStatus || "80" == conStatus){
                    var dataSub = result.data;
                    if(null != dataSub){
                    	var len = dataSub.length;
                        while(len--){
                            if(dataSub[len].sla_id == slaId){
                                data.push(dataSub[len]);
                            }
                        }
                    }
                }else{
                    data = result.data;
                }
            }

            var SLAInfoDefined = {
                LogoSmallClass:{
                    class: function () {
                        if(this.LOGO == 1){
                            return "jin";
                        }else if(this.LOGO == 2){
                            return "yin";
                        }else if(this.LOGO == 3){
                            return "tong";
                        }else if(this.LOGO == 4){
                            return "one";
                        }else if(this.LOGO == 5){
                            return "two";
                        }else if(this.LOGO == 6){
                            return "three";
                        }else if(this.LOGO == 7){
                            return "high";
                        }else if(this.LOGO == 8){
                            return "middle";
                        }else if(this.LOGO == 9){
                            return "low";
                        }
                    }
                },
                LogoBigClass:{
                    class: function () {
                        if(this.LOGO == 1){
                            return "jinpai";
                        }else if(this.LOGO == 2){
                            return "yinpai";
                        }else if(this.LOGO == 3){
                            return "tongpai";
                        }else if(this.LOGO == 4){
                            return "one";
                        }else if(this.LOGO == 5){
                            return "two";
                        }else if(this.LOGO == 6){
                            return "three";
                        }else if(this.LOGO == 7){
                            return "high";
                        }else if(this.LOGO == 8){
                            return "middle";
                        }else if(this.LOGO == 9){
                            return "low";
                        }
                    }
                },
                sla_info:{
                    serviceTimeType:{
                        text: function () {
                            if(83 == this.service_time){
                                return "工作时间";
                            }else if(84 == this.service_time){
                                return "日历时间";
                            }
                        }
                    }
                },
                slaCheckIcon:{
                    class: function () {
                    	if(null != conStatus){
                    		if("81" == conStatus || "80" == conStatus){
                                return "";
                            }else{
                                if(this.sla_id == slaId){
                                    return "slaCheckBox active";
                                }else{
                                    return "slaCheckBox";
                                }
                            }
                    	}
                    }
                },
                /*合同生效时,显示此合同内容*/
                slaInfoContent:{
                    class: function () {
                        if(this.sla_id == slaId){
                            return "slaInfoContent";
                        }else{
                            return "slaInfoContent dn";
                        }
                    }
                },
                /*合同生效时,显示此合同标题*/
//              slaInfoTitle:{
//                class:function(){
//                  if(this.sla_id == slaId){
//                      return "slaInfoTitle";
//                  }else{
//                      return "slaInfoTitle dn";
//                  }
//                }
//              }

            }

            $("#slaList").render(data,SLAInfoDefined);
            openAndCloseSLAInfo(conStatus);
            //绑定打印弹框的数据
            if(null != dataArea){
            	$(dataArea).render(data,SLAInfoDefined);
            }
        },
        error:function(XMLHttpRequest){
            error_500(XMLHttpRequest.responseText);
        }
    });
}

/**
 * 合同详情SLA信息列表信息展开/切换操作
 * */
function openAndCloseSLAInfo(conStatus){
	if(conStatus!=80&&conStatus!=81){//拟定中
			$(".slaInfoBox").on("click", ".slaInfoTitle", function(e) {
			//var _this = $(this);
			if($(e.target).hasClass('slaCheckBox')) {
				//执行点击切换单选框操作
				//console.log('slaCheckBox');

			} else {
				if($(this).hasClass('active')) {
					//收起
					$(this).removeClass('active');
					$(this).find('.slaInfoTitleInfo').removeClass('dn');

					$(this).next().hide();
					$(this).parent().css('background', '#fff');
					$(this).find('.slaListCaret').removeClass('active');
					$(this).find('.slaInfoTitleInfo').css('display', 'block');
					setLeftHeight();
				} else {
					//展开
					$(this).find('.slaInfoTitleInfo').addClass('dn');
					$(this).addClass('active').parent().siblings('.slaInfoList').find('.slaInfoTitle.active').removeClass('active');
					$(this).parent().siblings('.slaInfoList').find('.slaInfoTitleInfo').removeClass('dn');
					$(this).parent().siblings('.slaInfoList').css('background', '#fff').find('.slaInfoContent').hide();

					$(this).next().show();
					$(this).parent().css('background', '#f5f5f5');
					$(this).find('.slaListCaret').addClass('active');
					$(this).find('.slaInfoTitleInfo').css('display', 'none');
					setLeftHeight();

				}
			}
		})
	}else{
	    var $this = $(this);
	    if ($this.hasClass("active")) {
	      $this.removeClass("active").next().slideUp();
	      $this.parent().css('background', '#fff');
	    }else {
	      $this.addClass("active").next().slideDown();
	      $this.parent().css('background', '#f5f5f5');
	      $this.parent().siblings().css('background', '#fff').find(".slaInfoTitle").removeClass("active").next().slideUp();
	    }
	    $('.slaInfoTitle').hover(function(){
    		$(this).css({"background-color":"#fff",'color':'#696969','cursor':'Default'});
		},function(){
		    $(this).css({"background-color":"#fff",'color':'#696969','cursor':'Default'});
		});
	    $('.slaInfoTitleCaret').hide();//隐藏箭头
	    $('.slaInfoTitleInfo').hide();//隐藏图标

	}
}


/**
 * 点击切换选择sla服务
 * */
function changeSLARule(contractId){

    $(".slaInfoBox").on("click",'.slaCheckBox',function(e){
        e.stopPropagation();  //阻止冒泡,防止有展开关闭的切换
        var sla_id = $(this).parent().parent().find("input").val();
        var con_status = $("#status").val();
        //默认选中关联该合同的SLA
        var slaId = $("#con_slaId").val();
        if(81 == con_status){
            $("#tipMsg").addClass("active").html("已生效合同不可变更SLA服务").show();
            function hideMsg(){
                $("#tipMsg").addClass("active").html("已生效合同不可变更SLA服务").hide()
            }
            setTimeout(hideMsg,3000);
        }else if(sla_id != slaId){
            //console.log(sla_id);
            //console.log(contractId);
            $("#pupDelete5").modal("show");
            $("#changeConfirm").click(function () {
                $.ajax({
                    traditional:true,
                    url:changeContractSLAUrl,
                    dataType:"json",
                    type:'POST',
                    async:true,
                    data:{contractId:contractId,slaId:sla_id},
                    contentType:'application/x-www-form-urlencoded; charset=UTF-8',//防止乱码

                    success:function(data){

                        //登录信息失效，ajax请求静态页面拦截
                        onServiceComplete(data);

                        $("#pupDelete5").modal("hide");
                        $("#tipMsg").addClass("active").html(data.msg).show();
                        function hideMsg(){
                            $("#tipMsg").addClass("active").html(data.msg).hide()
                        }
                        setTimeout(hideMsg,2000);

                        loadContractDetail(contractId);

                        //$(this).addClass('active').parent().parent().parent().siblings('.slaInfoList').find('.slaCheckBox.active').removeClass('active');
                    },
                    error:function(XMLHttpRequest){
                        error_500(XMLHttpRequest.responseText);
                    }
                });
            });
        }

    })
}

/*-------------------------------------开始----------------------------------------------*/
/*-------------------------------附加合同处理程序----------------------------------------*/
/**
 * 展示添加资产框
 * */
function showAddResource(){
    $("#conAsset").modal('show');
    //从页面上获取页数信息
    var currPage_add = $("#currPage_add").val();
    if("" == currPage_add){
        currPage_add = 1;
    }else{
        currPage_add = $("#currPage_add").val();
    }
    $("#addResSearchText").val("")
    $("#addResSearch").click(function () {
        //获取搜索框内容
        var addResSearchText = $("#addResSearchText").val();
        loadResListExcept(currPage_add,addResSearchText);
    });
    //加载未在合同中的资产列表
    loadResListExcept(currPage_add,null);
}

/**
 * 加载未在合同中的资产列表
 * */
function loadResListExcept(currPage_add,addResSearchText){
    var pageNum = 10;

    $.ajax({
        traditional:true,
        url:loadResListExceptUrl,
        dataType:"json",
        type:'POST',
        async:true,
        data:{page:currPage_add,count:pageNum,searchText:addResSearchText},
        contentType:'application/x-www-form-urlencoded; charset=UTF-8',//防止乱码

        success:function(data) {

            //登录信息失效，ajax请求静态页面拦截
            onComplete(data);

              console.log(data);
            var len = data.length;
            if (len != 0) {

                $("#resExcept_list").render(data);

                var len = data.length;
                var totalPage = data[0].page;
                var totalNum = data[0].total_numbers;

                var beginCount = (currPage_add - 1) * (pageNum) + 1;
                var endCount_add;
                if (len - pageNum == 0) {
                    endCount_add = beginCount - 1 + pageNum;
                } else {
                    endCount_add = beginCount - 1 + (len) % (pageNum);
                }

                var contractPage_add = {
                    "beginCount_add": beginCount,
                    "endCount_add": endCount_add,
                    "totalCount_add": totalNum,
                    "currPage_add": currPage_add,
                    "totalPage_add": totalPage
                }
                var contractPageClass_add = {
                    upConPage_add: {
                        class: function () {
                            if (currPage_add - 1 == 0) {
                                return "up-page-left di";
                            } else {
                                return "up-page-left di active";
                            }
                        }
                    },
                    nextConPage_add: {
                        class: function () {
                            if (totalPage - 1 == 0 || totalPage - currPage_add == 0) {
                                return "up-page-right di";
                            } else {
                                return "up-page-right di active";
                            }
                        }
                    }
                }
                //向页面绑定分页数据
                $("#contractPage_add").render(contractPage_add, contractPageClass_add);
            }else{
                $("#resExcept_list").render(data);
            }
        },
        error:function(XMLHttpRequest){
			error_500(XMLHttpRequest.responseText);
		}
    });
}
/**
 * 点击每个附加合同资源前面的小方块
 * 1.给小方框加上样式
 * 2.获取当前选中的资产个数，改变“附加合同”的样式，只有的选中了资产，才可以点击“附加合同”
 */
function unResProClick(){

    $(this).find("i").toggleClass("active");

    var res_ids = getCheckUnRes();
    changeAddResClass(res_ids);
}
/**
 * 获取当前合同未关联的资产列表中选中资产的ids
 * @returns {Array}
 */
function getCheckUnRes(){
    var res_ids = [];
    var $checkPro = $("#resExcept_list").find("i.active").parent().prev();
    $checkPro.each(function(){
        res_ids.push($(this).val());
    });
    return res_ids;
}
/**
 * 改变“附加合同”样式
 * @param res_ids
 */
function changeAddResClass(res_ids){

    if(res_ids.length == 0){
        $("#addToContract").addClass("default");
    }else{
        $("#addToContract").removeClass("default");
    }
}
/**
 * 上下页跳转操作
 * */
function ResAddUpOrNextPage(){

    var upConPage = document.getElementById("upConPageId_add");
    var nextConPage = document.getElementById("nextConPageId_add");

    /**
     * 点击上一页操作
     * */
    if(null != upConPage){
        upConPage.onclick = function () {

            //从页面获取当前页数
            var currPage_add = $("#currPage_add").val();
            if(currPage_add - 1 == 0){
                $("#tipMsg").addClass("active").html("第一页").show();
                function hideMsg(){
                    $("#tipMsg").addClass("active").html("第一页").hide()
                }
                setTimeout(hideMsg,1500);
            }else{
                currPage_add--;
                loadResListExcept(currPage_add);
            }
        }
    }
    /**
     * 点击下一页操作
     * */
    if(null != nextConPage){
        nextConPage.onclick = function () {

            //从页面获取当前页面和总页数
            var currPage_add = $("#currPage_add").val();
            var totalPage_add = $("#totalPage_add").val();
            if(totalPage_add - currPage_add == 0 || totalPage_add - 1 == 0){
                $("#tipMsg").addClass("active").html("最后一页").show();
                function hideMsg(){
                    $("#tipMsg").addClass("active").html("最后一页").hide()
                }
                setTimeout(hideMsg,1500);
            }else{
                currPage_add++;
                loadResListExcept(currPage_add);
            }
        }
    }
}

/**
 * 附加到合同操作
 * */
function addResToContract(){

    var res_ids = [];
    res_ids = getCheckUnRes();
    if(res_ids != 0){
        //从页面上获取当前资产分类选中条件
        var con_categoryCode = $("#con_categoryCode").val();
        //从页面上获取当前合同的ID
        var contractId = document.getElementById("contract_id").value;
        //从页面上获取页数信息
        var currPage = $("#currPage").val();
        if("" == currPage || 0 == currPage){
            currPage = 1;
        }else{
            currPage = $("#currPage").val();
        }
        $.ajax({
            traditional: true,
            url: addResToContractUrl,
            dataType: "json",
            type: 'POST',
            async: true,
            data: {contractId:contractId,ids:res_ids},
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',//防止乱码

            success: function (data) {

                //登录信息失效，ajax请求静态页面拦截
                onComplete(data);

                $("#conAsset").modal('hide');
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
                $("#resExcept_list").find("i.active").removeClass("active");
                $("#addToContract").addClass("default");
                //操作完成加载数据
                loadContractDetail(contractId);
                loadResListOfTheContract(contractId,currPage,con_categoryCode);
            },
            error:function(XMLHttpRequest){
    			error_500(XMLHttpRequest.responseText);
    		}
        });
    }

}
/*-------------------------------附加合同处理程序----------------------------------------*/
/*-------------------------------------结束----------------------------------------------*/

/**
 * 合同信息和合同资产页面切换
 * */
function changeConInfoAndRes(contractId,currPage){
    // 点击属性
    $("#conInfo").click(function () {

        $(this).addClass("active").siblings().removeClass("active");
        // $(".container-right-item:eq(0)").show().siblings().hide();
        $("#conDetailLeft").show();
        $(".conAsset").hide();
        $("#yunweiGroup").hide();
        $("#slaList").hide();
        $(".conHistory").hide();

        $('.conright-infoWrap-left').css('height','');
        $('.conright-infoWrap-right').css('height',$('.conright-infoWrap-left').height()+'px');
       	setLeftHeight();
    });
    // 点击合同资产
    $("#conResource").click(function () {
        $(this).addClass("active").siblings().removeClass("active");
        $("#conDetailLeft").hide();
        $(".conAsset").show();
        $("#yunweiGroup").hide();
        $("#slaList").hide();
        $(".conHistory").hide();

        $('#res_delete').attr('disabled','true');
        $('#res_delete .conAsset-delete').addClass('disabled');
        //加载归属该合同的所有资产清单
        var con_categoryCode = $("#con_categoryCode").val();
        loadResListOfTheContract(contractId,currPage,con_categoryCode);
        $('.inputRemove').click(function(){
        	$('#con_category').attr('value','');//清空之前的查询子节点
        	$('#con_categoryCode').attr('value','');//清空id
			loadResListOfTheContract(contractId,currPage,"");
		})
        $('.conright-infoWrap-left').css('height','');
        $('.conright-infoWrap-right').css('height',$('.conright-infoWrap-left').height()+'px');
       	setLeftHeight();

    });
    // 点击SLA信息
    $("#SLAInfo").click(function () {
        $(this).addClass("active").siblings().removeClass("active");
        $("#conDetailLeft").hide();
        $(".conAsset").hide();
        $("#yunweiGroup").hide();
        $("#slaList").show();
        $(".conHistory").hide();

        $('.conright-infoWrap-left').css('height','');
        $('.conright-infoWrap-right').css('height',$('.conright-infoWrap-left').height()+'px');
       	setLeftHeight();
    });
    // 点击运维小组
    $("#operationGroup").click(function () {
        $(this).addClass("active").siblings().removeClass("active");
        $("#conDetailLeft").hide();
        $(".conAsset").hide();
        $("#yunweiGroup").show();
        $("#slaList").hide();
        $(".conHistory").hide();

        $('.conright-infoWrap-left').css('height','');
        $('.conright-infoWrap-right').css('height',$('.conright-infoWrap-left').height()+'px');
       	setLeftHeight();
    });
    //点击历史信息
    $("#conHistory").click(function(){
      $(this).addClass("active").siblings().removeClass("active");
      $("#conDetailLeft").hide();
      $(".conAsset").hide();
      $("#yunweiGroup").hide();
      $("#slaList").hide();
      $(".conHistory").show();
      conHistoryClick(conHistoryDeal,0)
    });
}


//合同信息编辑页面跳转
function conInfoEdit(){
    //从页面上获取当前合同的ID
    var contractId = document.getElementById("contract_id").value;
    window.location.href = "newContract.html?contractId="+contractId;
}

//合同关联资产列表选中资产分类条件加载资产
function loadConResByType(){
    //$("#con_res_list").html("");
    //从页面上获取当前资产分类选中条件
    var con_categoryCode = $("#con_categoryCode").val();
    //从页面上获取当前合同的ID
    var contractId = document.getElementById("contract_id").value;
    //从页面上获取页数信息
    var currPage = $("#currPage").val();
    if("" == currPage){
        currPage = 1;
    }else{
        currPage = $("#currPage").val();
    }
    loadResListOfTheContract(contractId,currPage,con_categoryCode);
}

/**
 * 合同提交审阅
 */
//把原来的删除弹框注了，记得改回来
function conCheckClick(){
	var contractId = getUrlParam("contractId");
	$("#pupDelete4").modal("show");
	$("button.btn-pupDelete4").click(function(){
		$.ajax({
			url:conCheckUrl,
			data:{contractId:contractId},
			type:"get",
			dataType:"json",
			success:function(result){

                //登录信息失效，ajax请求静态页面拦截
                onComplete(result);

				if(1 == result.status){
					outBoxCon(result.msg,"pupDelete4");
					loadContractDetail(contractId);
				}
			},
			error:function(XMLHttpRequest){
				error_500(XMLHttpRequest.responseText);
			}
		});
	});
}
/**
 * 合同审阅通过
 */
function checkYes(){
	var contractId = getUrlParam("contractId");
	var start = $("[data-bind='start_time']").next().val();
	var end = $("[data-bind='end_time']").next().val();//待检查
	//console.log(start);
	$.ajax({
		url:conCheckResultUrl,
		data:{contractId:contractId,flag:true,start:start,end:end},
		type:"get",
		dataType:"json",
		success:function(result){

            //登录信息失效，ajax请求静态页面拦截
            onComplete(result);

			if(1 == result.status){
				outBoxCon(result.msg,"pupDelete2");
				loadContractDetail(contractId);
			}
		},
		error:function(XMLHttpRequest){
			error_500(XMLHttpRequest.responseText);
		}
	});
}
/**
 * 合同审阅不通过
 */
function checkNo(){
	var contractId = getUrlParam("contractId");
	$.ajax({
		url:conCheckResultUrl,
		data:{contractId:contractId,flag:false},
		type:"get",
		dataType:"json",
		success:function(result){

            //登录信息失效，ajax请求静态页面拦截
            onComplete(result);

			if(1 == result.status){
				outBoxCon(result.msg,"pupDelete2");
				loadContractDetail(contractId);
			}
		},
		error:function(XMLHttpRequest){
			error_500(XMLHttpRequest.responseText);
		}
	});
}
/**
 * 合同审阅
 */
function conChenckResClick(){
	$("#pupDelete2").modal("show");
}
/**
 * 点击撤回
 */
function revokeClick(){
	var contractId = getUrlParam("contractId");
	$("#pupDelete3").modal("show");
	$("button.btn-pupDelete3").click(function(){
		$.ajax({
			url:conRevokeUrl,
			data:{contractId:contractId},
			type:"get",
			dataType:"json",
			success:function(result){

                //登录信息失效，ajax请求静态页面拦截
                onComplete(result);

				if(1 == result.status){
					outBoxCon(result.msg,"pupDelete3");
					loadContractDetail(contractId);
				}
			},
			error:function(XMLHttpRequest){
				error_500(XMLHttpRequest.responseText);
			}
		});
	});
}
/**
 * 点击删除合同
 */
function deleteConClick(){
	 var contractId = getUrlParam("contractId");
	 $.ajax({
		 url:contractDeleteUrl,
		 data:{ids:contractId},
		 type:"get",
		 dataType:"json",
		 success:function(result){

             //登录信息失效，ajax请求静态页面拦截
             onComplete(result);
             $("#pupDelete6").modal("hide");
			 if("true" == result.code){
				 outBoxCon(result.msg);
				 setTimeout(goToList,2000);
			 }else{
				 outBoxCon(result.msg);
			 }
		 },
		 error:function(XMLHttpRequest){
				error_500(XMLHttpRequest.responseText);
			}
	 });
}
function goToList(){
	window.location.href = contractList;
}
/**
 * 点击返回
 * wanglei
 */
function backWard(){
	var flag = getUrlParam("x");
	if(0 == flag){
		//组织url
		var fc = preLoadData("searchText","firmName","careAbout","checking",
			                 "conPrice_four",
			                 "conPrice_one","conPrice_three","conPrice_two",
			                 "currPage","expire","future_expire",
			                 "conStatus","today_expire","typeIds",
			                 "unKnow");
		var back = nextUrlDeal(fc,"searchText","firmName","careAbout","checking",
				                  "conPrice_four",
				                  "conPrice_one","conPrice_three","conPrice_two",
				                  "currPage","expire","future_expire",
				                  "conStatus","today_expire","typeIds",
				                  "unKnow");
		window.location.href = contractList;
	}else{
		window.history.back();
	}
}
/**
 * 加载与合同关联的所有资源
 * @param areaRes
 */
function loadAllResource(areaRes){

    $.ajax({
        traditional:true,
        url:loadResListOfTheContractUrl,
        dataType:"json",
        type:'get',
        async:true,
        data:{contractId:contractId,page:-1},
        contentType:'application/x-www-form-urlencoded; charset=UTF-8',//防止乱码

        success:function(data){
        	if(null != areaRes){
        		areaRes.render(data);
        	}
        },
        error:function(XMLHttpRequest){
			error_500(XMLHttpRequest.responseText);
		}
    });
}
/**
 * 该合同的sla信息
 * @param contractId 合同id
 * @param areaRes 绑定数据的区域
 */
function loadConSla(slaId,areaRes){
    $.ajax({
        url:loadSLADetailUrl,
        dataType:"json",
        type:'get',
        async:true,
        data:{sla_id:slaId},
        contentType:'application/x-www-form-urlencoded; charset=UTF-8',//防止乱码

        success:function(data){
            var SLAInfoDefined = {
            		sla_level:{
                    serviceTimeType:{
                        text: function () {
                            if(83 == this.service_time){
                                return "工作时间";
                            }else if(84 == this.service_time){
                                return "日历时间";
                            }
                        }
                    }
                }
            }
        	if(null != areaRes){
        		areaRes.render(data,SLAInfoDefined);
        	}
        },
        error:function(XMLHttpRequest){
			error_500(XMLHttpRequest.responseText);
		}
    });
}
var dataArea = new Object();//合同数据
dataArea.contractInfo = $("div.contrctInfo");
dataArea.contractEnterprise = $("div.contractEnterprise");
dataArea.areaSla = $("div.contractSlaP");//合同的sla数据
dataArea.areaRes = $("#con_list");//合同资源
/**
 * 打印合同的数据
 * @param contractId
 */
var printConData = function printData(slaId,dataArea){
	var dataAreaHrelp = new Object();
	dataAreaHrelp.contractInfo = dataArea.contractInfo;
	dataAreaHrelp.contractEnterprise = dataArea.contractEnterprise;
	loadContractDetail(contractId,dataAreaHrelp);//合同数据+合同厂商数据
//	var sla = $("#con_slaId").val();
	if(null == slaId){
		 var serviceId = $("#party_B_id").val();
         loadConDetailSLAList(serviceId,81,dataArea.areaSla);
	}else{
		loadConSla(slaId,dataArea.areaSla);//合同sla数据
	}
	loadAllResource(dataArea.areaRes);//与合同关联的资源数据
}
/**
 * 点击页面上的”打印“，弹出打印框
 */
function conPrintClick(){
	var slaId;
	printConData(slaId,dataArea);
	$("#print").modal("show");

  /*只在第一项上打勾,只显示第一项的内容*/
  $("i.classRe").removeClass("active");
  $("i.classRe:first").addClass("active");
  $("#print .modal-box").css("display","none");
  $("#print .modal-box:first").css("display","block");
}
/**
 * 点击弹出框里的打印，跳到一个新的页面，调用网页的打印方法
 */
function openNeWindowClick(){

  var canPrint = 0;  //打印项数量
  var printFlag = "";  //打印信息

  if ($("#contract_info").hasClass("active")) {
    printFlag += "&contract_info=1";
    canPrint++;
  }else{
    printFlag += "&contract_info=2";
  }
  if ($("#contract_asset").hasClass("active")) {
    printFlag += "&contract_asset=1";
    canPrint++;
  }else{
    printFlag += "&contract_asset=2";
  }
  if ($("#contract_company").hasClass("active")) {
    printFlag += "&contract_company=1";
    canPrint++;
  }else{
    printFlag += "&contract_company=2";
  }
  if ($("#contract_sla").hasClass("active")) {
	var slaId = $("#con_slaId").val();
    printFlag += "&contract_sla=1&sla_id="+slaId;
    canPrint++;
  }else{
    printFlag += "&contract_sla=2";
  }

  if (canPrint == 0) {
    $("#pupDelete7").modal("show");
  }else {
    window.open("printContrat.html?contractId="+contractId+printFlag);
  }
}

var contractId=getUrlParam("contractId");

/*设置左侧栏高度*/
//function setLeftHeight(){
//setTimeout(function(){
//  var height = $("#container-right").outerHeight();
//  $("#container-left").height(height+30);
//
//  // $("#conDetailRight").height(height);
//},400);
//}
function setLeftHeight(){
	$('.container-right-infoWrap').css('height','');
	if($('.conright-infoWrap-left').outerHeight()>parseInt($('.conright-infoWrap-right').css('minHeight'))){
		$('.container-right-infoWrap').css('height',$('.conright-infoWrap-left').outerHeight()+'px');
		$('.conright-infoWrap-right').css('height','100%');
		$('#container-left').css('height',$('#container-right').outerHeight()+30+'px');
	}else{
		$('#container-left').css('height',$('#container-right').outerHeight()+30+'px');
	}
}


/**
 * 文件下载
 */
function fileDownload(){
	 var count = $("a.attachCount").text();
	 if(null != count && count>0){
		 $("#accessory").modal("show");
	 }
}

/*切换打印弹框的打印选项*/
function choosePrint(){
  var $i = $(this).children("i");
  var checkedFlag = $i.hasClass("active");
  var idx = $(this).index()-1;

  if (checkedFlag) {
    $i.removeClass("active");
    $("#print .modal-box").eq(idx).css("display","none");
  }else {
    $i.addClass("active");
    $("#print .modal-box").eq(idx).css("display","block");
  }
}

/**
 * 点击历史
 */
function conHistoryClick(conHistoryDeal,arrowType){
    // arrow代表值  0:置顶; 1:下一条; -1:上一条
    if (arrowType == 0) {
      startHistoryItem = 0;
    }else {
      startHistoryItem = startHistoryItem + arrowType;
    }
    if (startHistoryItem < 0) {
      startHistoryItem = 0;
    }

    $.ajax({
      url: getHistoricalInfoUrl,
      type: 'get',
      data: {
        'type':93,
        'type_id': contractId,
        'numbers':numbersHistoryItem,
        'start': startHistoryItem
      },
      dataType: 'json',
      success: function(result){
        // 登录信息失效，ajax请求静态页面拦截
        onComplete(result);

        if(1 == result.status){
          // 给[上一条]定权限
          if (startHistoryItem > 0) {
            $(".conHistory-content-right-top").addClass("active");
          }else {
            $(".conHistory-content-right-top").removeClass("active");
          }
          // 给[下一条]定权限
          if (result.data.length < numbersHistoryItem) {
            $(".conHistory-content-right-bottom").removeClass("active");
          }else {
            $(".conHistory-content-right-bottom").addClass("active");
          }

          conHistoryDeal(result);
        }else{
          $(".conHistory-content").addClass("dn");
        }
      },
      error:function(XMLHttpRequest){
  			error_500(XMLHttpRequest.responseText);
  		}
    });
}
/**
 * 往页面上绑定数据--历史
 */
 function conHistoryDeal(result){
   var data=[];  //定义写入的数据
   $.each(result.data, function(i,value){
     var time = calcTime3(result.data[i].operation_time);
     data.push({
       action: result.data[i].action,
       name: result.data[i].name,
       number: result.data[i].number,
       status_name:result.data[i].status_name,
       oper_user_name: result.data[i].oper_user_name,
       calc_time1: time.year+"-"+time.month,
       calc_time2: time.date+"日 "+time.hour+":"+time.minute,
     });
   });

   //去掉重复的日期
   var evaluate = data[0].calc_time1;  //设置 去重的比较值
   for(var i=1; i<data.length; i++){
     if (evaluate == data[i].calc_time1) {
       data[i].calc_time1 = "";
     }else {
       evaluate = data[i].calc_time1;
     }
   }
   $(".conHistory-content-dataBind").render(data);
  //  计算历史记录中时间轴的竖线
   var start = $(".conHistory-content-right:first").find(".history-point i")[0].getBoundingClientRect().bottom;
   var end = $(".conHistory-content-right:last").find(".history-point i")[0].getBoundingClientRect().top;
   $(".conHistory-content-right:first").find(".history-point>div").css('height',(end-start));

   setLeftHeight();
 }

 /*计算时间函数,历史记录用*/
 function calcTime3(operationTime){
   var time = new Date(operationTime);
   var year = time.getFullYear();  //年
   var month = time.getMonth();  //月
   if (month < 10) {
     month = "0" + month;
   }
   var date = time.getDate();  //日
   if (date < 10) {
     date = "0" + date;
   }
   var hour = time.getHours();  //小时
   var minute = time.getMinutes();  //分钟
   if (minute < 10) {
     minute = "0" + minute;
   }
   return {"year": year,"month": month,"date": date,"hour": hour,"minute": minute};
 }


$(function () {
	$("span.navlist-img4").addClass("active");
    //获取页面跳转传值
	contractId = getUrlParam("contractId");
    //从页面上获取页数信息
    var currPage = $("#currPage").val();
    if("" == currPage){
        currPage = 1;
    }else{
        currPage = $("#currPage").val();
    }
    //从页面上获取当前资产分类选中条件
    var con_categoryCode = $("#con_categoryCode").val();

    //初始加载数据
    loadContractDetail(contractId);
    //合同信息和合同资产页面切换
    changeConInfoAndRes(contractId,currPage,con_categoryCode);

    //与当前合同关联的资产上下页操作
    upOrNextPage(contractId);
    //附加资产列表的上下页操作
    ResAddUpOrNextPage();
    //点击该合同已关联的每个资产前面的小框
    $("#con_res_list").on("click",".table-col1",ResProClick);
    //点击该合同未关联的每个资产前面的小框
    // $("#resExcept_list").on("click","i",unResProClick);
    $("#resExcept_list ").on("click",".modal-body-bottom-row",unResProClick);
    //点击删除按钮
    $("#res_delete").click(deleteClick);

    //添加资产（资产选择框）
    $("#addResource").click(showAddResource);
    $("#res_add").click(showAddResource);
    $('.addButton').click(showAddResource);

    //附加到合同操作
    $("#addToContract").click(addResToContract);

    //编辑合同
    $("#conEdit").click(conInfoEdit);

    //加载分类树,如果没有分类id，则在当前页面选择一个分类id，再发送ajax请求,加载对应的属性模板
    creatTree("con_category-tree","con_category-menu","con_category","con_categoryCode",loadCategoryZTreeUrl,true,loadConResByType);

    //选中分类条件即加载数据
    //$("#resource_type .ztree").click(loadConResByType);
    //点击提交审阅
    $("#conCheck").click(conCheckClick);
    //点击审阅
    $("#conChenckRes").click(conChenckResClick);
    //点击撤回
    $("#revoke").click(revokeClick);
    //点击删除
    $("#deleteCon").click(function () {
        $("#pupDelete6").modal("show");
    });
    $("#delCon").click(deleteConClick);


    //合同详情SLA信息列表信息展开/切换操作
    // $(".slaInfoBox").on("click", ".slaInfoTitle", openAndCloseSLAInfo);
//   openAndCloseSLAInfo();

    //点击切换选择sla服务
    changeSLARule(contractId);
    //点击页面上的”打印“，弹出打印框
    $("#conPrint").click(conPrintClick);
    //点击弹出框里的打印，跳到一个新的页面，调用网页的打印方法
    $("#openNeWindow").click(openNeWindowClick);
    //点击返回，返回上一页
    $("span.container-right-title-back").click(backWard);
	  $("button.btn-pupDelete2").click(checkYes);//合同审阅--通过
	  $("button.btn-pupDelete-no").click(checkNo);//合同审阅--不通过
    //设置页面左侧栏的高度
	  setLeftHeight();
    //点击附件，弹出弹框，可以下载文件
    $("a.attachCount").click(fileDownload);

    //打印弹窗 - 切换打印内容
    $("#print .modal-body-id li:has(i)").on("click",choosePrint);
    //点击历史(左侧) && 置顶历史信息
    $(".conHistory-content-toTop").on("click",function(){conHistoryClick(conHistoryDeal,0)});
    // 点击历史-前一条
    $(".conHistory-content-right-top.active").on("click",function(){
      if ($(this).hasClass("active")) {
        conHistoryClick(conHistoryDeal,-1)
      }

    });
    // 点击历史-后一条
    $(".conHistory-content-right-bottom.active").on("click",function(){
      if ($(this).hasClass("active")) {
        conHistoryClick(conHistoryDeal,1)
      }
    });

});


//获取url中的参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}
function outBoxCon(msg,hideArea){
	$("#tipMsg").addClass("active").html(msg).show();
	function tipHide(){
		$("#tipMsg").hide();
	}
    setTimeout(tipHide,2000);
	$("#"+hideArea).modal('hide');
}
