/*
 * 弹出资源附件是否删除弹框
  */
   function rowWrapDelete(a,b,c,d,e){
	a.each(function(){
		var madalDelete=$(this);
   	   	madalDelete.find(b).click(function(){
   		 	c.modal('show');
   		 	//当点击删除按钮的时候
   		 	c.find(d).click(function(){
					$.ajax({
						traditional: true,
						url:deleteFileUrl,
						type:"POST",
						data:{"filePath":madalDelete.find(e).html()},
						dataType:"json",
//						cache:false,
					success:function(result){
						//请求成功后执行删除
						 madalDelete.remove();
						 $("#tipMsg").addClass("active").html('删除成功').show();
						 function hideMsg(){
                			$("#tipMsg").addClass("active").html('删除成功').hide()
            			 }
            			 setTimeout(hideMsg,2000);
            			 window.location.reload();//刷新当前页面
					},		
					error:function(XMLHttpRequest){
						 error_500(XMLHttpRequest.responseText);
					}
				})
					
   		 	})
   		})
	})
}