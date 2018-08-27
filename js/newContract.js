/**
 * 新建合同 Created by EKuter-amu on 2017/2/10.
 */
var flag = "contract_file";
var conTypeData,conTypeValue;//合同类型下拉选的数据
conTypeData = [
    {
        value:"",
        contract_type_name:"---请选择---"
    },
    {
        value:25,
        contract_type_name:"买卖合同"
    },
    {
        value:26,
        contract_type_name:"建筑施工合同"
    },
    {
        value:27,
        contract_type_name:"技术合同"
    },
    {
        value:28,
        contract_type_name:"服务合同"
    },
    {
        value:29,
        contract_type_name:"其他合同"
    }
];
conTypeValue = {
    contract_type_name:{
        value:function(){
            return this.value;
        }
    }
};

var successReturn = 1;//操作成功
var errorReturn = 2;
var formError = -1;

/**
 * 加载合同厂商
 * */
var clickNum=0;
function loadAllFirmName(){
	$("div.slaShowOrNot").hide();
    var thisHelp = $("#contractFirm");
//  thisHelp.selectpicker({noneSelectedText: "---请选择---"});
//  $('#conFirm .selectpicker').selectpicker('refresh');

//  $("#conFirm .btn").click(function () {
//      //先把提示的错误信息清除掉
//      $(".error").html("");
//      var conType = $("select.conType option:selected").val();
//      if("" == conType){
//          $("span.conFirmErr").html("请选择合同类型加载厂商！");
//      }
//  });
	
	$('#manufacturerContract').click(function(){
		$(".error").html("");
        var conType = $("select.conType option:selected").val();
//	    console.log(conType);
		clickNum++;
		if(clickNum%2==0){
			$('#contractFirmBox').hide();
		}else if(clickNum%2!==0){
			$('#contractFirmBox').show();
		}
        if("" == conType){
            $("span.conFirmErr").html("请选择合同类型加载厂商！");
            $('#contractFirmBox').hide();
        }
        
	});
}

/**
 * 加载合同类型数据
 * */
function loadConTypeInfo(){
    $("#conTypeInfo").render(conTypeData,conTypeValue);
    $("#conTypeInfo").selectpicker('val',"");
    $('#conType .selectpicker').selectpicker('refresh');
	setTimeout(function(){
  		loadServiceInfo();
	},100)
}

var fileInput = "file-1";
var fileNamesOld;//旧的合同文件名称
/**
 * 保存新建/修改合同信息
 * */
function saveConInfo(){
	$("#fileHelpId").val("");
	//先把提示的错误信息清除掉
	$(".errorB").html("");
	//获取区分增加和修改时的标志
	var updatePrivate = $("#conUpdateFlag").val();
	//是否有文件需要上传
	var filesCount = $('#'+fileInput).fileinput('getFilesCount');
	var fileNames = [];//新上传的文件
	//如果没有文件需要上传，直接提交表单
	if(filesCount - 0 != 0){
		//获取需要上传的文件名称，写在一个隐藏域内
		fileNames = newfileNames(fileInput,fileNamesOld);
		$("#fileHelpId").val(fileNames);
			console.log($("#fileHelpId").val())
		if("" !== updatePrivate){
			//点击保存，进行“修改”
//			checkFileNames(fileNames,setConFlag);
			checkFileNames(fileNames,contractUpdateSubmit);
		}else{
			//点击保存，进行“增加”
			//上传文件
			checkFileNames(fileNames,setConFlag);
		}
    }else{
    	if("" !== updatePrivate){
    		//点击保存，进行“修改”
    		contractUpdateSubmit();
    	}else{
    		createContractInfoFormSubmit(false);
    	}
    }
  	//window.location.href='contract.html'
}
/**
 * ajax回调转换，只是为了设置一个参数true
 */
function setConFlag(){
    createContractInfoFormSubmit(true);
}
/**
 * 保存新建合同信息
 * */
function createContractInfoFormSubmit(flag){
    var options;
    if(flag){
        options = {
            url:contractCreateUrl,
            success:contractFormSubmitYseFile, //提交后处理
            error:function(XMLHttpRequest){
            	error_500(XMLHttpRequest.responseText);
    		},
            dataType:"json"
        };
    }else if(!flag){
        options = {
            url:contractCreateUrl,
            success:contractFormSubmitNoFile, //提交后处理
            error:function(XMLHttpRequest){
            	error_500(XMLHttpRequest.responseText);
    		},
            dataType:"json"
        };
    }
    $("#contractForm").ajaxSubmit(options);
}

/**
 * 合同含有文件表单提交后处理
 * @param responseText
 * @param statusText
 */
function contractFormSubmitYseFile(responseText,statusText){
	console.log(responseText);
    //登录信息失效，ajax请求静态页面拦截
    onComplete(responseText);
    if(responseText.status  == formError){
        //显示所有的错误信息
        $("span.conNameErr").html(responseText.data.conNameError);
        $("span.conFirmErr").html(responseText.data.conFirmError);
        $("span.conPriceErr").html(responseText.data.conPriceError);
        $("span.conTypeErr").html(responseText.data.conTypeError);
    }else{
        var contractId = responseText.data;
        var filesCount = $('#file-1').fileinput('getFilesCount');
        if(responseText.status == successReturn){
        	$("#file_help_id").val(contractId);
			$("#file_help_flag").val(flag);
            if(filesCount - 0 != 0){
				uploadFile("file-1",contractId,updateContractFileUrl);
			}else{
				//toContractDetail(contractId);
			}
        }else{
        	outBoxCloseCon("操作失败");
        }
    }
}

/**
 * 增加或者修改合同，有文件上成功后，需要修改数据库中的文件字段
 * @param contractId
 */
function updateContractFileUrl(contractId,flag){
	var fileAll = $("#fileHelpId").val();//所有的文件名称
	var fileFail = flag.dataSub;//本次上传失败的文件名称（list）
	var fileSuccess = flag.data;//本次上传成功的文件名称（list）
	var fileReal = "";//数据库中需要存的文件名称（之前的名称+本次上传的文件名称）
	if(fileSuccess.length>0){
		//修改数据库中的文件字段
		if(null != fileNamesOld){
			fileReal += fileNamesOld+",";
		}
		fileReal += fileSuccess.toString();
		if(null != fileReal && "" != fileReal){
			$.ajax({
				url:updateConFileUrl,
				type:"post",
				data:{id:contractId,fileUrl:fileReal},
				dataType:"json",
				success:function(result){
					//登录信息失效，ajax请求静态页面拦截
		            onComplete(result);
					console.log(result)
		            if(fileFail.length>0){
		            	//提示用户没有上传成功的文件名称
		            	outBoxCloseEvent(fileFail.toString()+"，未上传成功，请重试！");
		            	//再次点击保存时，进行修改。
		            	$("#conUpdateFlag").val("updatePrivate");
		            	$("#contractIdId").val(contractId);
		            	fileNamesOld = fileReal;
		            	$('#'+fileInput).fileinput('clear');
		            }else{
		            	toContractDetail(contractId);//修改完数据库中的文件字段后，跳转页面
		            }
				},
				error:function(XMLHttpRequest){
					error_500(XMLHttpRequest.responseText);
				}
			});
		}
	}else{
		//提示用户没有上传成功的文件名称
    	outBoxCloseEvent(fileFail.toString()+"，未上传成功，请重试！");
    	//再次点击保存时，进行修改。
    	$("#conUpdateFlag").val("updatePrivate");
    	$("#contractIdId").val(contractId);
    	fileNamesOld = fileReal;
    	$('#'+fileInput).fileinput('clear');
	}

}
/**
 * 弹框的关闭
 * @param msg 弹框关闭后的提示信息
 */
function outBoxCloseCon(msg){
	$("#tipMsg").addClass("active").html(msg).show();
	function tipHide(){
		$("#tipMsg").hide();
	}
    setTimeout(tipHide,2000);
}
function toContractDetail(contractId){
    window.location.href = 'contractDetail.html?contractId='+contractId;
}

/**
 * 合同不含文件的增加成功之后的操作
 * @param responseText
 * @param statusText
 */
function contractFormSubmitNoFile(responseText,statusText){
    //登录信息失效，ajax请求静态页面拦截
    onComplete(responseText);
    if(responseText.status  == formError){
        //显示所有的错误信息
        $("span.conNameErr").html(responseText.data.conNameError);
        $("span.conFirmErr").html(responseText.data.conFirmError);
        $("span.conPriceErr").html(responseText.data.conPriceError);
        $("span.conTypeErr").html(responseText.data.conTypeError);
    }else if(responseText.status == successReturn){
        var contractId = responseText.data;
        window.location.href = 'contractDetail.html?contractId='+contractId;
    }else{
    	outBoxCloseCon("增加合同失败！");
    }
}
/*------------------------开始------------------------*/
/*--------------------合同编辑操作---------------------*/
/**
 *合同信息加载及绑定
 * */
function contractInfoEdit(contractId){

    var deValue = {
        enterprise_name: {
            value: function () {
                return this.party_B;
            }
        },
        contract_type_name:{
            value:function(){
                return this.contract_type;
            }
        }
    };

    $.ajax({
        traditional:true,
        url:loadContractDetailUrl,
        dataType:"json",
        type:'POST',
        async:true,
        data:{contractId:contractId},
        contentType:'application/x-www-form-urlencoded; charset=UTF-8',//防止乱码
        success:function(data){
            //登录信息失效，ajax请求静态页面拦截
            onComplete(data);
	        console.log(data);
            if(null != data){
                fileNamesOld = data.electronic_copy;
                //显示出合同厂商partB_enterprise
                $('#manufacturerContract').val(data.partB_enterprise);
                //单独设置选中类型contract_type
//              $('#conType option:selected').text(data.contract_type);
                $("#conType select").selectpicker("val",data.contract_type);
            	delete data.contract_type;
	            delete data.contract_type_name;
	            
                //向页面绑定合同信息数据
                $("#resourceEditData").render(data,deValue);
                //用于区分修改和增加
                $("#conUpdateFlag").val("conUpdateFlag");
                if(28 == data.contract_type){
                		var slaId = data.sla_id;
                		$("#sla_id").val(slaId);
                		loadSLA();
                }
                
            }
        },
        error:function(XMLHttpRequest){
			error_500(XMLHttpRequest.responseText);
		}
    });
}

/**
 * 合同信息修改后表单提交
 * */
function contractUpdateSubmit(){
    var options = {
        url:contractUpdateInfoUrl,
        success:contractFormSubmitYseFile, //提交后处理
        dataType:"json"
    };
    $("#contractForm").ajaxSubmit(options);
}
/*--------------------合同编辑操作---------------------*/
/*------------------------结束------------------------*/

/**
 * 加载所有的服务商
 * @王雷
 */
function loadServiceInfo(){
	var slaDiv = $("div.slaShowOrNot");
	slaDiv.hide();
	var conType = $("#conTypeInfo").val();
	var urlH;
	if(28 == conType){
//		slaDiv.show();
		//加载服务商数据
		urlH = loadConServiceUrl;
		$.ajax({
			url:urlH,
			type:"get",
			dataType:"json",
			success:function(result){
                //登录信息失效，ajax请求静态页面拦截
                onComplete(result);
				var diData={
						enterprise_name:{
							value:function(){
								return this.id;
							}
						}
				};

				$('.sort_letter').remove();
				$("#ulist").render(result.data,diData);
//				$('#manufacturerContract').val('');
				loadSLA();
				manufacturerContractClick();  //切换供应商内容
//				$("#contractFirm").render(result.data,diData);
//				$("#contractFirm").selectpicker('val',"");
//				$("#contractFirm").selectpicker('refresh');
				},
				error:function(XMLHttpRequest){
					error_500(XMLHttpRequest.responseText);
				}

		});
	}else{
		$.ajax({
	        traditional: true,
	        url: loadConFirmInfoUrl,
	        dataType: "json",
	        type: 'POST',
	        async: true,
	        data: '',
	        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',//防止乱码
	        success: function (data) {
	        	//console.log(data)
                //登录信息失效，ajax请求静态页面拦截
                onComplete(data);

	            var len = data.length;
	            if(len != 0){
	            	var diData={
							enterprise_name:{
								value:function(){
									return this.party_B;
								}
							}
					}

					$('.sort_letter').remove();
					$("#ulist").render(data,diData);
//					$('#manufacturerContract').val('');
					manufacturerContractClick();  //切换供应商内容
//	                $('#conFirm .selectpicker').selectpicker('refresh');
//	                $("#contractFirm").render(data,diData);
//	                $("#contractFirm").selectpicker("val","");
//					$("#contractFirm").selectpicker('refresh');
	            }
	        },
	        error:function(XMLHttpRequest){
				error_500(XMLHttpRequest.responseText);
			}
	    });
	}

}
/**
 * 加载所选服务商的SLA信息
 * @王雷
 */
function loadSLA(){
	var slaDiv = $("div.slaShowOrNot");
	slaDiv.hide();
	var slaP = $("div.slaDiv");
	var conType = $("#conTypeInfo").val();
	if(28 == conType){
//		var serviceId = $("#contractFirm").val();
		var serviceId=$('#party_B').val();
		if("" == serviceId){
		}else{
			slaDiv.show();
	   		$.ajax({
				url:loadSLAInfoUrl,
				data:{"serviceId":serviceId},
				type:"get",
				dataType:"json",
				success:function(result){
	                //登录信息失效，ajax请求静态页面拦截
	                onComplete(result);

					var data = result.data;//sla总信息
					if(null != data){
						var diData = {
								sla_info:{
									addressVal:{
										text:function(){
											return this.address;
										},
										value:function(){
											if(83==this.service_time){
												return "工作时间";
											}else{
												return "日历时间";
											}

											timeTips(this.service_time);
										}
									},
									responseVal:{
										text:function(){
											return this.address;
										},
										value:function(){
											if(83==this.service_time){
												return "工作时间";
											}else{
												return "日历时间";
											}

										}
									}

								},
								sla_id:{
									value:function(){
										return this.sla_id;
									}
								},
								sla_logo:{
				                    class: function () {
				                        if(this.LOGO == 1){
				                            return "serviceLevel jin";
				                        }else if(this.LOGO == 2){
				                            return "serviceLevel yin";
				                        }else if(this.LOGO == 3){
				                            return "serviceLevel tong";
				                        }else if(this.LOGO == 4){
				                            return "serviceLevel one";
				                        }else if(this.LOGO == 5){
				                            return "serviceLevel two";
				                        }else if(this.LOGO == 6){
				                            return "serviceLevel three";
				                        }else if(this.LOGO == 7){
				                            return "serviceLevel high";
				                        }else if(this.LOGO == 8){
				                            return "serviceLevel middle";
				                        }else if(this.LOGO == 9){
				                            return "serviceLevel low";
				                        }
				                    }
				                },
				                checkBoxActive:{
				                	class:function(){
				                		var activeSla = $("[name='sla_id']").val();
				                		if("" == activeSla){
				                			return "checkBox";
				                		}else if(this.sla_id == activeSla){
				                			return "checkBox active";
				                		}
				                	}
				                }

							};

					    slaP.render(data,diData);
              /*每次渲染后,初始化样式*/
              slaP.find(".slaTableInfo").removeClass("active");
					}
				},
				error:function(XMLHttpRequest){
					error_500(XMLHttpRequest.responseText);
				}
			});
		}
	}
}
/**
 * 点击选中某一个sla
 * wanglei
 */
function choseSLA(){
	$("i.checkBox").removeClass("active");
	var idSubmit = $("[name='sla_id']");
	idSubmit.val("");
	$(this).addClass("active");
	var slaId = $(this).next().val();
	idSubmit.val(slaId);
}
function titleChoseSLA(){
	$("i.checkBox").removeClass("active");
	$('slaTableInfo.ative').removeClass('active');
	var idSubmit = $("[name='sla_id']");
	idSubmit.val("");
	$(this).find('.checkBox').addClass("active");
	$(this).parent().addClass('active').siblings().removeClass("active");
	var slaId = $(this).find('#sla_id').val();
	idSubmit.val(slaId);
}
/**slaTips信息**/
function timeTips(){

	$("body").on("mouseover mouseout mousemove", '.timeTips', function(e) {
		var _text=e.target.value;
		if(e.type == "mousemove") {
			$("#timeTipdiv").css({
				"top": (e.pageY-15) + "px",
				"left": (e.pageX+15) + "px"
			}).show();
		} else if(e.type == "mouseout") {
			$("#timeTipdiv").hide();
		} else if(e.type == "mouseover") {

			if($("#timeTipdiv") != undefined) {

				_tooltip = "<div id='timeTipdiv' style='font-size:14px'></div>";
				$("body").append(_tooltip);
			}

			$("#timeTipdiv").html("<i></i>"+_text);
			$("#timeTipdiv").show();

		}
	});

}

/**合同厂商初始化**/
var initialsArr = [];
function initials() {//排序
    var SortList=$(".sort_list");
    var SortBox=$(".sort_box");
    SortList.sort(asc_sort).appendTo('.sort_box');//按首字母排序
    function asc_sort(a, b) {
//  	console.log(a);
//  	console.log(b);
        return makePy($(b).text().charAt(0))[0].toUpperCase() < makePy($(a).text().charAt(0))[0].toUpperCase() ? 1 : -1;
    }


    var num=0;
    initialsArr.length=0;
    SortList.each(function(i) {
        var initial = makePy($(this).text().charAt(0))[0].toUpperCase();
        if(initial>='A'&&initial<='Z'){

            if (initialsArr.indexOf(initial) === -1)
                initialsArr.push(initial);

        }else{
            num++;
        }

    });

    $.each(initialsArr, function(index, value) {//添加首字母标签
        SortBox.append('<div class="sort_letter" id="'+ value +'">' + value + '</div>');
    });
	if(num!=0){SortBox.append('<div class="sort_letter" id="default">#</div>');}
    for (var i =0;i<SortList.length;i++) {//插入到对应的首字母后面
        var letter=makePy(SortList.eq(i).text().charAt(0))[0].toUpperCase();
        switch(letter){
            case "A":
                $('#A').after(SortList.eq(i));
                break;
            case "B":
                $('#B').after(SortList.eq(i));
                break;
            case "C":
                $('#C').after(SortList.eq(i));
                break;
            case "D":
                $('#D').after(SortList.eq(i));
                break;
            case "E":
                $('#E').after(SortList.eq(i));
                break;
            case "F":
                $('#F').after(SortList.eq(i));
                break;
            case "G":
                $('#G').after(SortList.eq(i));
                break;
            case "H":
                $('#H').after(SortList.eq(i));
                break;
            case "I":
                $('#I').after(SortList.eq(i));
                break;
            case "J":
                $('#J').after(SortList.eq(i));
                break;
            case "K":
                $('#K').after(SortList.eq(i));
                break;
            case "L":
                $('#L').after(SortList.eq(i));
                break;
            case "M":
                $('#M').after(SortList.eq(i));
                break;
            case "N":
                $('#N').after(SortList.eq(i));
                break;
            case "O":
                $('#O').after(SortList.eq(i));
                break;
            case "P":
                $('#P').after(SortList.eq(i));
                break;
            case "Q":
                $('#Q').after(SortList.eq(i));
                break;
            case "R":
                $('#R').after(SortList.eq(i));
                break;
            case "S":
                $('#S').after(SortList.eq(i));
                break;
            case "T":
                $('#T').after(SortList.eq(i));
                break;
            case "U":
                $('#U').after(SortList.eq(i));
                break;
            case "V":
                $('#V').after(SortList.eq(i));
                break;
            case "W":
                $('#W').after(SortList.eq(i));
                break;
            case "X":
                $('#X').after(SortList.eq(i));
                break;
            case "Y":
                $('#Y').after(SortList.eq(i));
                break;
            case "Z":
                $('#Z').after(SortList.eq(i));
                break;
            default:
                $('#default').after(SortList.eq(i));
                break;
        }
    };
}
var clickNum=0;
// 点击"合同厂商"
function manufacturerContractClick(){
	initials();
	
	$('#contractFirmBox .sort_list').click(function(){
		$('#manufacturerContract').val($(this).text());
		$('#party_B').val($(this).val()); //获取合同厂商id的值
		if(null!==$('#manufacturerContract').val()){
			loadSLA();
		}
		$('#contractFirmBox').hide();

	});
    $(".initials ul li").unbind("click").click(function(e){

        var _text=$(this).text();

        if(_text=='#'){
        	$('#default').addClass('active').siblings().removeClass('active');
        	$("#contractFirm").mCustomScrollbar('scrollTo','bottom');
        }else{
        	$('#'+_text).addClass('active').siblings().removeClass('active');
	        if(initialsArr.indexOf(_text)!==-1){
	          	$(this).addClass('active').siblings().removeClass('active');
	            $("#contractFirm").mCustomScrollbar('scrollTo',$('#'+_text).position().top+'px');
	        }
        }


    });

}
/**
 * jQuery函数
 * */
$(function () {
	getHistory();
	var Initials=$('.initials');
    var LetterBox=$('#letter');
	Initials.find('ul').append('<li>A</li><li>B</li><li>C</li><li>D</li><li>E</li><li>F</li><li>G</li><li>H</li><li>I</li><li>J</li><li>K</li><li>L</li><li>M</li><li>N</li><li>O</li><li>P</li><li>Q</li><li>R</li><li>S</li><li>T</li><li>U</li><li>V</li><li>W</li><li>X</li><li>Y</li><li>Z</li><li>#</li>');

	manufacturerContractClick();

	//需要和编辑数据的时候配合，所以当页面加载的时候把该id置为""
	$("[name='sla_id']").val('');
	$("span.navlist-img4").addClass("active");
    //点击加载合同厂商信息
     loadAllFirmName();
//    $("#conFirm .btn-default").click(loadAllFirmName);

    //保存新建合同信息
    $("#saveConInfo").click(saveConInfo);

    //点击加载合同类型数据
     loadConTypeInfo();
//  //首次加载合同厂商
	  loadServiceInfo();
//    $("#conType .btn-default").click(loadConTypeInfo);
    //如果选择了服务合同，则加载服务商
    $("#conTypeInfo").change(loadServiceInfo);
    //选择了一个服务商之后，则加载该服务商的sla
    //$("#contractFirm").change(loadSLA);

//  $("#manufacturerContract").on('input',function(e){
//  	alert(123);
//	});

    //点击方框，选择某一个sla服务
    $("div.slaDiv").on("click","i.checkBox",choseSLA);
    $("div.slaDiv").on("click",".slaTableTitle",titleChoseSLA);

    //合同信息编辑页面跳转
    //获取合同ID
    var contractId = getUrlParam("contractId");
    //console.log(contractId);
    if(null != contractId){
        contractInfoEdit(contractId);
    }
    //新建合同起始日期，有效日期显示日期
    $('#start_time').val(DateToday);
    $('#end_time').val(nextDateToday);

    //设置合同金输入限制
    $('#conPrice').blur(function(){
    	var thes=$(this);
    	var conPriceVal=$(this).val();
    	isInteger(conPriceVal,thes);
    });

    //鼠标移入出现工作时间或日历时间
   	 timeTips();
});
//获取当前日期
function DateToday(){
	var d = new Date();
	var year= d.getFullYear();
	var month=d.getMonth()+1;
	if(month<10){
		month='0'+month;
	}
	var day=d.getDate();
	if(day<10){
		day='0'+day;
	}
	var str = year+"-"+month+"-"+day;
	return str;

}
//获取明年今日(修改为明年的今天前一天)
function nextDateToday(){
	var d = new Date();
	var year= d.getFullYear()+1;
	var month=d.getMonth()+1;
	if(month<10){
		month='0'+month;
	}
	var day=d.getDate()-1;
	if(day<10){
		day='0'+day;
	}
	var str = year+"-"+month+"-"+day;
	return str;
}

 //设置合同金输入限制
 function isInteger(obj,thes) {
    reg = /^[-+]?\d+$/;
    if (!reg.test(obj) || obj < 0) {
    	thes.val('');
        return false;
    } else {
        return true;
    }
}

//获取url中的参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}
