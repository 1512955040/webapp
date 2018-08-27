//var JSON = function(sJSON){
//  this.objType = (typeof sJSON);
//  this.self = [];
//  (function(s,o){for(var i in o){o.hasOwnProperty(i)&&(s[i]=o[i],s.self[i]=o[i])};})(this,(this.objType=='string')?eval('0,'+sJSON):sJSON);
//}
//JSON.prototype = {
//  toString:function(){
//      return this.getString();
//  },
//  valueOf:function(){
//      return this.getString();
//  },
//  getString:function(){
//      var sA = [];
//      (function(o){
//          var oo = null;
//          sA.push('{');
//          for(var i in o){
//              if(o.hasOwnProperty(i) && i!='prototype'){
//                  oo = o[i];
//                  if(oo instanceof Array){
//                      sA.push(i+':[');
//                      for(var b in oo){
//                          if(oo.hasOwnProperty(b) && b!='prototype'){
//                              sA.push(oo[b]+',');
//                              if(typeof oo[b]=='object') arguments.callee(oo[b]);
//                          }
//                      }
//                      sA.push('],');
//                      continue;
//                  }else{
//                      sA.push(i+':'+oo+',');
//                  }
//                  if(typeof oo=='object') arguments.callee(oo);
//              }
//          }
//          sA.push('},');
//      })(this.self);
//      return sA.slice(0).join('').replace(/\[object object\],/ig,'').replace(/,\}/g,'}').replace(/,\]/g,']').slice(0,-1);
//  },
//  push:function(sName,sValue){
//      this.self[sName] = sValue;
//      this[sName] = sValue;
//  }
//}



//
////添加cookie
//var setCookie=function(c_name,value,expiredays){
//  var exdate=new Date();
//  exdate.setDate(exdate.getDate()+expiredays);   //设置过期时间
//  cookieVal=c_name+ "=" +escape(value)+((expiredays==null) ? "" : ";expires="+exdate.toGMTString());
////  alert(cookieVal);
//  document.cookie=cookieVal;
//}
////获取cookie
//function getCookie(c_name){
//  if (document.cookie.length>0){
//    	c_start=document.cookie.indexOf(c_name + "=")
//    	if (c_start!=-1){ 
//      	c_start=c_start + c_name.length+1 
//      	c_end=document.cookie.indexOf(";",c_start)
//      	if (c_end==-1) c_end=document.cookie.length
////          	document.write(document.cookie.substring(c_start,c_end)+"<br>");
//      	return unescape(document.cookie.substring(c_start,c_end))
//      } 
//  }
//  return "";
//}
//
////添加历史记录
//var addHistory=function(num,id){
//  stringCookie=getCookie('history');
//  var stringHistory=""!=stringCookie?stringCookie:"{history:[]}";
//  var json=new JSON(stringHistory);
//  var obj = {};
//  obj.num = num;
//  obj.id = id;
//  json['history'].push(obj);//添加一个新的记录
//  setCookie('history',json.toString(),1);
//}
//
//
////添加一个li元素
//var addLi=function(num,id,pid){
//	var hrefObj = [
//		{'href':'www.baidu.com','hrefName':'工作台'},
//		{'href':'www.baidu.com','hrefName':'事件'},
//		{'href':'www.baidu.com','hrefName':'资产'},
//		{'href':'www.baidu.com','hrefName':'合同'},
//		{'href':'www.baidu.com','hrefName':'项目'},
//		{'href':'www.baidu.com','hrefName':'供应商'},
//		{'href':'www.baidu.com','hrefName':'工作台'},
//	];
//  var a=document.createElement('a');
// 	var href = hrefObj[num].href;
//  var t = hrefObj[num].hrefName;
//  a.setAttribute('href',href);
//  a.innerHTML=t;
//  var li=document.createElement('li');
//  li.className = 'nav-right-reRecordItem';
//  li.appendChild(a);
//  document.getElementById(pid).appendChild(li);
//}
//
//
////显示历史记录
//var DisplayHistory=function(){
//  var p_ele=document.getElementById('history');
//  while (p_ele.firstChild) {
//    p_ele.removeChild(p_ele.firstChild);
//  }
//	var historyJSON=getCookie('history');
//  var json=new JSON(historyJSON);
//  var displayNum=6;
//  for(i=json['history'].length-1;i>0;i--){
//      addLi(json['history'][i]['num'],json['history'][i]['id'],"history");
//      displayNum--;
//      if(displayNum==0){break;}
//  }
//}
//
//addHistory(1,1);
//addHistory(2,2);
//addHistory(3,3);
//addHistory(4,4);
//addHistory(5,3);
//addHistory(6,4);
//
//DisplayHistory();
//
//
//
//
//存
var setHistory=function(title){
	 var strUrl = window.location.href;
	 var arrUrl = strUrl.split("/");
	 var strPage = arrUrl[arrUrl.length - 1];

	 var art_title =title;//对象名称
	 var art_url = strPage;//当前页url
	 var history;//保存cookie
	 var json1;//保存解析cookie
	 var jsonArr=[];//保存json数组
	 var canAdd= true;
	 //var json1=eval("({sitename:'dreamdu',sitedate:new Date(1980, 12, 17, 12, 0, 0)})");

	 if(!$.cookie("history")){
	 //第一次的时候需要初始化
	 	jsonArr.unshift(JSON.parse("{\"title\":\""+art_title+"\",\"url\":\""+art_url+"\"}"));//入新值
		jsonStr=JSON.stringify(jsonArr);
		history = $.cookie("history",jsonStr);
	 }else {

		 //已经存在
		 history = $.cookie("history");
		 json1 = eval("("+history+")");
		 $(json1).each(function(i){
		  if(this.title==art_title){//如果当前访问页面存在cookie中,删除原数组中该元素,然后重新圧入新值
			//获取该对象下标splice
			var newJson1=json1.splice(i,1);
			newJson1.unshift(this);//入新值
			jsonStr=JSON.stringify(newJson1);
			history = $.cookie("history",jsonStr);
		  }
		 })
		 if(canAdd){//需求:压一出一 最多10条对象
		    if(json1.length<10){
		    	json1.unshift(JSON.parse("{\"title\":\""+art_title+"\",\"url\":\""+art_url+"\"}"));//入新值
		    	jsonStr=JSON.stringify(json1);
		    	//存入cookie
		    	$.cookie("history",jsonStr,{expires:24});
		    }else{
		    	json1.unshift(JSON.parse("{\"title\":\""+art_title+"\",\"url\":\""+art_url+"\"}"));//入新值
		    	json1.pop();
		    	jsonStr=JSON.stringify(json1);//末尾弹出一个重新存入cookie
		    	//存入cookie
		    	$.cookie("history",jsonStr,{expires:24});
		    }

		}
	}
}
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
	 	}else if(this.url.indexOf('supplierDetail')>=0){//供应商详情
	 		list = list + "<li><i class='add-img5'></i><a class='title' href="+this.url+" title="+this.title+">"+this.title+"</a></li>";
	 	}

	 })
	 $("#history").html(list);
	 }
}
var getHistory1=function(){
	if($.cookie("history")){
	 var json = eval("("+$.cookie("history")+")"); 
	 var list =""; 
	 $(json).each(function(){
	 	if(this.url.indexOf('orderDetail')>=0){//工单详情
	 		list = list + "<li><i class='add-img1'></i><a class='title' href="+this.url+">"+this.title+"</a></li>";
	 	}
//	 	else if(this.url.indexOf('assetDetail')>=0){//资产详情
//	 		list = list + "<li><i class='add-img2'></i><a class='title' href="+this.url+">"+this.title+"</a></li>";
//	 	}
	 	else if(this.url.indexOf('serviceContractDetail')>=0){//合同详情
	 		list = list + "<li><i class='add-img3'></i><a class='title' href="+this.url+">"+this.title+"</a></li>";
	 	}
//	 	else if(this.url.indexOf('projectDetail')>=0){//项目详情
//	 		list = list + "<li><i class='add-img4'></i><a class='title' href="+this.url+">"+this.title+"</a></li>";
//	 	}
	 })
	 $("#history").html(list);
	 } 
}





