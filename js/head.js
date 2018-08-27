//滚动的菜单栏
function scrollNav() {
	var addlist = $('.nav-add-list');
	var trangleLeft = $('.nav-add-trangleLeft');
	var trangleRight = $('.nav-add-trangleRight');

	var ulWidth = addlist.width();
	var lastLeft = -270;
	var currLeft = 0;

	trangleLeft.on('click', function() {
		if(currLeft == 0) {
			trangleLeft.unbind('click');
		} else {
			currLeft += 270;
			addlist.animate({
				left: currLeft
			}, 500);
		}

	});
	trangleRight.on('click', function() {
		if(currLeft == lastLeft) {
			trangleRight.unbind('click');
		} else {
			currLeft -= 270;
			addlist.animate({
				left: currLeft
			}, 500);
		}
	});
}
scrollNav();

//更换最后一个菜单
function changeNav() {
	var navAddItem = $('.nav-add-item');
	var navChangeItem = $('.navlist.navChangeList');

	navAddItem.click(function() {
		$('.nav-add-item.hide').removeClass('hide').show(); //被替换的显示
		$(this).addClass('hide'); //被点击的隐藏
		$('.navlist.lastNavlist').removeClass('lastNavlist navNoChangeList').hide();
		var keyStr = $(this).attr('id');
		for(var i = 0; i < navChangeItem.length; i++) {
			_this = navChangeItem.eq(i);
			isHasKey = _this.hasClass(keyStr);
			if(isHasKey) {
				_this.addClass('lastNavlist navNoChangeList').show();
			}
		}
		//		lineFollow();
	});
}
changeNav();

//left值
//function moveLeft(index) {
//	var left = 0;
//	if(index==0){
//		return left+12;
//	}else{
//		for(var i=0;i<index;i++){
//			left += $('.navNoChangeList').eq(i).width()+72;
//		}
//		left += 12;
//		return left;
//	}
//}

//线跟随
//function lineFollow(){
//	var navNoList = $('.navNoChangeList');
//
//	navNoList.on('click',function () {
//
//		$(this).addClass('now').siblings('navNoChangeList').removeClass('now');
//		$(this).find('span').addClass('active').parent().siblings('navNoChangeList').children().removeClass('active');
//		var nowCurr = $('.navNoChangeList.now');
//		var nowCurrIdx = nowCurr.index();
//		var nowCurrWidth = nowCurr.width();
//		var nowCurrLeft = moveLeft(nowCurrIdx);
//		console.log(nowCurrWidth);
//		console.log(nowCurrLeft);
//		$('.navMove').animate({
//			width: nowCurrWidth+'px',
//			left: nowCurrLeft+'px'
//		},50);
//	});
//

/**鼠标移入移出**/
//	navNoList.hover(function () {
//      var index = $(this).index();
//      if(index>5){
//      	index = 5;
//      }
//		var moveWidth = $(this).width();
//		var left = moveLeft(index);
//		$('.navMove').stop().animate({
//			width: moveWidth,
//			left: left
//		},50,"linear");
//  }, function () {
//		var moveWidth = $('.navNoChangeList.now').width();
//		var index = $('.navNoChangeList.now').index();
//		var left = moveLeft(index);
//		$('.navMove').stop().animate({
//			width: moveWidth,
//			left: left
//		},50,"linear");
//  });
//}
//lineFollow();
//
//
//function clickNav() {
//
//	if($(this).hasClass("navlist1")) {
//		window.location.href = "workbench.html";
//	} else if($(this).hasClass("navlist2")) {
//		window.location.href = "eventList.html";
//	} else if($(this).hasClass("navlist3")) {
//		window.location.href = "lastThirtyAsset.html";
//	} else if($(this).hasClass("navlist4")) {
//		window.location.href = "contract.html";
//	} else if($(this).hasClass("navlist5")) {
//		window.location.href = "projectList.html";
//	} else if($(this).hasClass("navlist6")) {
//
//	} else if($(this).hasClass("navlist7")) {
//
//	}
//}

function diffientHtml(){
	var thisText = $(this).text();
//	console.log(thisText);
	if("新建资产" == thisText){
		window.location.href = "assetAdd.html";
	}else if("新建合同" == thisText){
		window.location.href = "newContract.html";
	}else if("新建事件" == thisText){
		window.location.href = "eventAdd.html";
	}else if("新建项目" == thisText){
		window.location.href = "newProject.html";
	}else if("新建供应商" == thisText){
		window.location.href = "supplierAdd.html";
	}
}
var openDropDown=function(){

	$(this).siblings('.right-search-wrap').removeClass('dn');
}
var indexold=-1;//执行一遍
var clickSearchList=function(){
		$(this).addClass('selected').siblings().removeClass('selected');
		var index=$(this).index();
		var selectedVal=$(this).html();
		$('.nav-right-selectedWord').html(selectedVal);

		if($('.nav-right-selectedWord').html()=='供应商'){
			$('#nav .nav-right-search input').css('paddingLeft','80px');
		}else{
			$('#nav .nav-right-search input').css('paddingLeft','68px');
		}

		if($('.nav-right-selectedWord').html()){
			$(this).parents('.right-search-wrap').addClass('dn');
			$('.nav-right-search input').focus();
		}

	    if(index==indexold){
	        $('.nav-right-selectedWord').val(selectedVal);
	    }else if(indexold==-1){
	         indexold=index;
	    }else{
	          $('.nav-right-search input').val('');
	          indexold=index;
	    }
	     $('.nav-right-selectedWord').val(selectedVal);
}


/**
 * jquery函数
 */
$(function() {
//	$('.nav-right-selectedWord').css('left','14px');
	$('.nav-right-search .dropdownDiv').click(openDropDown);
	var lis=$('.right-search-list');

	lis.each(function(){
        $(this).click(clickSearchList);
	})
	$('.searchInput').bind('keypress',function(event){

       if(event.keyCode == "13"||event.which=="13"||event.charCode=="13"){
       	//window.location.href="" 跳转到搜索页面
        }

    });//
	//$("ul.fl").on("click","li",clickNav);
	var $line = $('.moveWrap .navMove'),
		$li = $('ul.fl li.navlist');
	$line.css('left', $('ul.fl li.navlist.active')[0].offsetLeft + 'px');
	$line.css('width', $('ul.fl li.navlist.active').width()+'px');
	var width=$('ul.fl li.navlist.active').width()+'px';
	$li.hover(function() {
			var left = this.offsetLeft;

			var width = $(this).width();
			$line.stop().animate({
				left: left + 'px',
				width: width + "px"
			}, 300)
		}, function() {
			var activeEle = $('ul.fl li.navlist.active')[0];
			if(!activeEle) {
				return false;
			}
			var left = activeEle.offsetLeft;
			//var width = activeEle.style.width;
			$line.stop().animate({
				left: left + 'px',
				width: width
			}, 300)
		}).click(function() {

			if($(this).hasClass("navlist1")) {
				window.location.href = "workbench.html";
			} else if($(this).hasClass("navlist2")) {
				window.location.href = "eventList.html";
			} else if($(this).hasClass("navlist3")) {
				window.location.href = "lastThirtyAsset.html";
			} else if($(this).hasClass("navlist4")) {
				window.location.href = "contract.html";
			} else if($(this).hasClass("navlist5")) {
				window.location.href = "projectList.html";
			} else if($(this).hasClass("navlist6")) {
				window.location.href = "supplier.html";
			} else if($(this).hasClass("navlist7")) {
				window.location.href = "manage.html";
			}
			$(this).addClass('active').siblings().removeClass('active');
		});

    checkStatusOfLogin();
    $("#logout").click(function () {

        window.location = "logout";
    });
//    var sid = $.cookie();
//    console.log(sid);
//    if(sid != undefined){
//    	sid = "zhangsan";
//    	console.log("------",sid);
//
//    }
}());
var message;
/**
 * 检测是否处于登录状态
 * 返回用户信息
 * */
function checkStatusOfLogin(){

    $.ajax({
        url:checkSignInStatusUrl,
        dataType:"json",
        type:'GET',
        async:true,
        data:'',

        contentType:'application/x-www-form-urlencoded; charset=UTF-8',//防止乱码

        success:function(result){
            //console.log(data);
            if(result.status == 0){

            	var data = result.data;
            	//查看通知
            	getInform(data.sId);
                var dataPersonInfo = data.person;
                var dataUserInfo = data.userInfo;
                dataUserInfo.personId = dataPersonInfo.id;
                dataUserInfo.personName = dataPersonInfo.name;
                var userInfo = {
                    userName:{
                        value: function () {
                            return this.personId;
                        },
                        text: function () {
                            return this.personName;
                        }
                    },
                    position:{
                        value: function () {
                            return this.department_id;
                        },
                        text: function () {
                            return this.department_name;
                        }
                    },
                    department:{
                        value: function () {
                            return this.position_id;
                        },
                        text: function () {
                            return this.position_name;
                        }
                    }
                }
	           $("#userInfo").render(dataUserInfo,userInfo);

            }else{
                window.location.href = "login.html";
            }
        },
        error:function(XMLHttpRequest){
            error_500(XMLHttpRequest.responseText);
        }
    });

    //右上角“+”号跳转到不同页面
    $("div.nav-right-newAdd").on("click","li",diffientHtml);
}

//var inst = $('[data-remodal-id=modal]').remodal();

/**
 * 获取session id。来获取通知
 * @param message  sId
 * @param fun 处理数据
 */
function getInform(message){
	   var socket;
	    if (window.WebSocket) {
	        socket = new WebSocket("ws://192.168.1.253:8085/websocket");
	        socket.onmessage = function (event) {
	        	if(null != event && null != event.data){
//	        		$('#show').html(event.data);
//	        		inst.open();
	        		$("#errorInfo").html("通知："+event.data);
	        		$("#errorBtn").modal("show");
	        	}
	        }
	        socket.onopen = function (event) {
	        	send("sid:"+message);
	        };
//	        socket.onclose = function (event) {
//	            alert("Web Socket closed.");
//	        };
	        //浏览器关闭 关闭websocket连接
//	        window.onbeforeunload = function(){
//	        	ws.close();
//	        	return "确定要离开??";
//	        };
	    } else {
	        alert("Your browser does not support Websockets. (Use Chrome)");
	    }
	    function send(message) {
	        if (!window.WebSocket) {
	            return;
	        }
	        if (socket.readyState == WebSocket.OPEN) {
	            socket.send(message);
	        } else {
	            alert("The socket is not open.");
	        }
	    }
//	    function writeMessage(message){
//	    	document.getElementById("myTextArea").innerHTML=document.getElementById("myTextArea").innerHTML+message+"\n";
//	    }
}
/**
 * 弹框的关闭
 * @param msg 弹框关闭后的提示信息
 * @param hideArea 弹框id,需要隐藏的弹框id
 * @param hidePrompt 提示信息2s后显示，该提示信息id
 */
var outBoxCloseHead = function outBox(msg,hideArea,hidePrompt){
	$("#tipMsg").addClass("active").html(msg).show();
	function tipHide(){
		$("#"+hidePrompt).hide();
	}
    setTimeout(tipHide,2000);
	$("#"+hideArea).modal('hide');
}
