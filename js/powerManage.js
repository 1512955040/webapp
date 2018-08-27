/*切换主要内容*/
function changeLeft(){
	$(this).addClass('active').siblings().removeClass('active');
	$('.right-content'+$(this).index()).removeClass('dn').siblings('.right-content').addClass('dn');
	$('.title-name').html($(this).text());
	// setLeftHeight();
}
function setLeftPos(){
	var leftPosIdx=getUrlParamH('leftPos');
	if(Number(leftPosIdx)>0){
		$('.left-item'+leftPosIdx).addClass('active').siblings().removeClass('active');
		$('.right-content'+leftPosIdx).removeClass('dn').siblings('.right-content').addClass('dn');
		$('.title-name').html($('.left-item'+leftPosIdx).text());
		// setLeftHeight();
	}
}
// /*设置左侧高度*/
// function setLeftHeight(){
// 	var heightLeft= $(".left").height();
// 	var heightRight= $(".right").height();
// 	$(".left").height(heightRight);

// }
function addNewRole(){
	window.location.href="newRole.html?flag=add";
}
function editRole(){
	window.location.href="newRole.html?flag=edit";
}
function createNewUser(){
	$('#createNewUserModal').modal('show');
}

/*返回[管理主页]*/
function goBackMainPage(){
  window.location.href = "manage.html";
}

function getHistory(){
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
//加载角色列表
	function loadSystemRolesDetaiList(){
		$.ajax({
			url:loadSystemRoles,
			type:"get",
			data:{organize_id:''},
			dataType:"json",
			//		cache:false,
			success:function(result){
				console.log(result);
            	//登录信息失效，ajax请求静态页面拦截
            	onComplete(result);
			},
			error:function(XMLHttpRequest){
				error_500(XMLHttpRequest.responseText);
			}
		});
	}
//创建新角色
function createRolesController(){
	$.ajax({
			url:createRoles,
			type:"post",
			data:{},
			dataType:"json",
			//		cache:false,
			success:function(result){
				console.log(result);
            	//登录信息失效，ajax请求静态页面拦截
            	onComplete(result);
			},
			error:function(XMLHttpRequest){
				error_500(XMLHttpRequest.responseText);
			}
		});
	}
	
$(function(){
	getHistory();
	setLeftPos();//设置左侧位置及初始化高度
	//载入角色列表
	loadSystemRolesDetaiList();
	//点击角色管理
	$(".left-item1").click(function(){
		loadSystemRolesDetaiList();
	});
	//切换内容
	$('.left-item').click(changeLeft);
	$('#createNewRoles').click(addNewRole);//创建新角色
	//点击角色分配
	$(".admin-descrip-role").off().on('click',function(){
		$("#Roleassignment").modal('show');
	})
	//点击分配角色里面的复选框
	$(".modal-body-powermen li i").off().on('click',function(){
		if($(this).hasClass("active")){
		  $(this).removeClass("active")
	   }else{
	   	   $(this).addClass("active")
	   }
	})
	$('.admin-descrip-edit').click(editRole);//列表一行编辑
	$('#createNewUser').click(createNewUser);//创建新用户
	$(".right-table-body-edit").off().on('click',function(){
		$("#ChangeAssignments").modal('show');
	})										//点击变换按钮
	$('.back').click(goBackMainPage);  /*返回[管理主页]*/
})
