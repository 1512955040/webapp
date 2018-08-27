//点击基本功能，高级功能，管理功能弹框
	$(".left-content-checkone span i").off().on('click',function(){
		if($(this).hasClass('active')){
			$(this).removeClass('active')
		}else{
			$(this).addClass('active')
		}
	})
	$(".leftContentSituation").off().on('click',function(){
		if($(this).parent().next().find('span i').hasClass('active')){
			$(this).removeClass('active')
			$(this).parent().next().find('span i').removeClass('active')
		}else{
			$(this).addClass('active')
			$(this).parent().next().find('span i').addClass('active')
		}
	})
	/*创建新角色*/
		var CreateNewRole={
			
		}
	/**/
	$(function(){
		
	
	})