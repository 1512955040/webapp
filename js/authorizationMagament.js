
/*all: 切换左侧栏*/
function changeLeft(index) {
    if(this.tagName==undefined){  /* 初始化左侧栏 */
        index = Number(getUrlParamH("leftPos"));
    }else if(this.tagName == "LI"){  /* 点击左侧栏 */
        index = $(this).index();
    }
    console.log(index);
    /* 页面切换 */
    $('.left-item' + index).addClass('active').siblings().removeClass('active');
    $('.right' + index).removeClass('dn').siblings().addClass('dn');
    /* 内容切换 */
    switch(index){
        case 0:
        // url中没有标识时
        case 1:
            console.log('1')
            break;
        case 2:
            console.log('2')
            break;
    }
}

$(function(){
	//点击权限管理里面的角色管理 和用户管理切换页面
	changeLeft()
	$(".left-item").click(changeLeft)
//	$(".left-item").click(function(){
//		$(this).addClass('active').siblings().removeClass('active');
//		if($(".left-item1").hasClass('active')){
//			$(".right1").removeClass('dn').siblings().addClass('dn')
//		}
//		if($(".left-item2").hasClass('active')){
//			$(".right2").removeClass('dn').siblings().addClass('dn')		
//		}
//	})
	//点击角色分配
	$('.castingAssignment').off().on('click',function(){
		$("#Roleassignment").modal('show');
	})
	//点击分配角色里面的复选框
	$(".modal-body-icon").on('click',function(){
		if($(this).hasClass("active")){
		  $(this).removeClass("active")
	   }else{
	   	   $(this).addClass("active")
	   }
	})
	//点击创建新角色按钮跳转
	$("#rolePart").click(function(){
		window.location.href="createNewRole.html"
	})
	//点击角色分配弹窗
	$(".right2-content-assignment").off().on('click',function(){
		$("#CastingAssignments").modal('show');
	})
	//点击角色分配里面人员的复选框
	$(".modal-body-powermen li i").off().on('click',function(){
		if($(this).hasClass('active')){
			$(this).removeClass('active')
		}else{
			$(this).addClass('active');
		}
	})
})


