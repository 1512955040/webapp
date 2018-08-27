
//主页面轮播图
	var index=0;   //记录 当前选中状态的 下标。
	$('.wrap-Carousels').find($(".contents-Carousels")).each(function(){
		$(this).css('width',$(this).children().length*100+'px')
		$(this).parent().css('width',$(this).css('width',$(this).children().length*100+'px'))
	})
	
	$(".contents-Carousels").find($('.content-Carousel')).each(function(){
		$(this).parent().parent().next().children(':first').attr('src',$(this).src);
	})
	//上一个
	$('.boxs-lefts-rights').find($('.pre')).off().on('click',function(){
		if(index>=1){
			index--;
			$(this).prev().attr('src',$(".content-Carousel")[index].src)
		}
		var $that=$(this).parent().prev().children(':first')
//		console.log($(this).parent().prev().children(':first'));
		if($that[0].offsetLeft<0){
			$that.css('left',$that[0].offsetLeft+$that.children()[0].offsetWidth+'px');
		}
	})
	//下一个
	$('.boxs-lefts-rights').find($('.next')).off().on('click',function(){
		if(index<$(this).parent().prev().children(':first').children().length-1){
			index++;
			$(this).prev().prev().attr('src',$(".content-Carousel")[index].src)
		}
		var $thats=$(this).parent().prev().children(':first');
//		console.log($thats[0].offsetLeft+$thats[0].offsetWidth)
//		console.log($thats.parent()[0].offsetWidth)
		if($thats[0].offsetLeft+$thats[0].offsetWidth>=$thats.parent()[0].offsetWidth){
			var  $aaa=$(this).parent().prev().children()[0].offsetLeft;
			var $bbb=$(this).parent().prev().children(':first').children()[0].offsetWidth;
			console.log($aaa,$bbb);
			$thats.css('left',$aaa-$bbb+'px');
		}
	})
	//弹窗轮播图
	var index1=0;   //记录 当前选中状态的 下标。
	$('.wrap-Carousels0').find($(".contents-Carousels0")).each(function(){
		$(this).css('width',$(this).children().length*100+'px')
		$(this).parent().css('width',$(this).css('width',$(this).children().length*100+'px'))
	})
	
	$(".contents-Carousels0").find($('.content-Carousel0')).each(function(){
		$(this).parent().parent().next().children(':first').attr('src',$(this).src);
	})
	//添加删除图标
	var Carouselicon=$("<i class='Carouselicon'></i>");
	$(".content-Carousel0").after(Carouselicon);
//	console.log($(".Carouselicon").length);
	//上一个
	$('.boxs-lefts-rights0').find($('.pre')).off().on('click',function(){
		if(index1>=1){
			index1--;
			$(this).prev().attr('src',$(".content-Carousel0")[index1].src)
		}
		var $that=$(this).parent().prev().children(':first')
//		console.log($(this).parent().prev().children(':first'));
		if($that[0].offsetLeft<0){
			$that.css('left',$that[0].offsetLeft+$that.children()[0].offsetWidth+'px');
		}
	})
	//下一个
	$('.boxs-lefts-rights0').find($('.next')).off().on('click',function(){
		if(index1<$(this).parent().prev().children(':first').children().length-1){
			index1++;
			$(this).prev().prev().attr('src',$(".content-Carousel0")[index1].src)
		}
		var $thats=$(this).parent().prev().children(':first');
		//console.log($thats[0].offsetLeft+$thats[0].offsetWidth)
		//console.log($thats.parent()[0].offsetWidth)
		if($thats[0].offsetLeft+$thats[0].offsetWidth>=$thats.parent()[0].offsetWidth){
			var $aaa=$(this).parent().prev().children()[0].offsetLeft;
			var $bbb=$(this).parent().prev().children(':first').children()[0].offsetWidth;
			console.log($aaa,$bbb);
			$thats.css('left',$aaa-$bbb+'px');
		}
	})
	//点击图标删除图片
	$(".contents-Carousels0").find($(".Carouselicon")).off().on('click',function(){
		$(this).prev().hide();
		if($(this).prev($("content-Carousel0:last")).hide()){
//			alert('123');
			$(".box-lefts-rights0").attr('src',$(this).prev().prev().prev()[0].src)
		}else{
			$(".box-lefts-rights0").attr('src',$(this).next()[0].src)
		}
		
		console.log($(".Carouselicon").length)
//		if($(".contents-Carousels0").children('.content-Carousel0').hide()){
//			$(".box-lefts-rights0").attr('src','')
//		}
	})