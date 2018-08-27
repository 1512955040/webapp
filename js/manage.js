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
})
