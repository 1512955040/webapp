
/**
 * 处理路径中的参数，返回一个对象（该页的查询条件）
 * 参数：这个对象的属性
 * 返回值：对象
 */
var preLoadData = function preLoadData(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t){
	var condition = new Object();
	var a1 = getUrlParamSpecial("a");
	if(null != a1){
		condition[a] = decodeURIComponent(a1);
	}
	var a2 = getUrlParamSpecial("b");
	if(null != a2){
		condition[b] = decodeURIComponent(a2);
	}
	var a3 = getUrlParamSpecial("c");
	if(null != a3){
		condition[c] = decodeURIComponent(a3);
	}
	var a4 = getUrlParamSpecial("d");
	if(null != a4){
		condition[d] = a4;
	}
	var a5 = getUrlParamSpecial("e");
	if(null != a5){
		condition[e] = a5;
	}
	var a6 = getUrlParamSpecial("f");
	if(null != a6){
		condition[f] = a6;
	}
	var a7 = getUrlParamSpecial("g");
	if(null != a7){
		condition[g] = a7;
	}
	var a8 = getUrlParamSpecial("h");
	if(null != a8){
		condition[h] = a8;
	}
	var a9 = getUrlParamSpecial("i");
	if(null != a9){
		condition[i] = a9;
	}
	var a10 = getUrlParamSpecial("j");
	if(null != a10){
		condition[j] = a10;
	}
	var a11 = getUrlParamSpecial("k");
	if(null != a11){
		condition[k] = a11;
	}
	var a12 = getUrlParamSpecial("l");
	if(null != a12){
		condition[l] = a12;
	}
	var a13 = getUrlParamSpecial("m");
	if(null != a13){
		condition[m] = a13;
	}
	var a14 = getUrlParamSpecial("n");
	if(null != a14){
		condition[n] = a14;
	}
	var a15 = getUrlParamSpecial("o");
	if(null != a15){
		condition[o] = a15;
	}
	var a16 = getUrlParamSpecial("p");
	if(null != a16){
		condition[p] = a16;
	}
	var a17 = getUrlParamSpecial("q");
	if(null != a17){
		condition[q] = a17;
	}
	var a18 = getUrlParamSpecial("r");
	if(null != a18){
		condition[r] = a18;
	}
	var a19 = getUrlParamSpecial("s");
	if(null != a19){
		condition[s] = a19;
	}
	var a20 = getUrlParamSpecial("t");
	if(null != a20){
		condition[t] = a20;
	}
	return condition;
}
/**
 * 把对象（该页的查询条件）转换成一个字符串，拼接成一个url。跳转到下一个页面
 * 参数：fc，对象本身
 * abcdefghi...对象属性
 * 返回值：一个字符串
 * 备注：路径中的中文乱码问题。有中文的时候，把该属性放在前三个位置。我想不到更好的办法了
 */
var isList = 0;//判断是不是从列表页进入的详情页。0代表是。非0，代表不是。
var nextUrlDeal = function nextUrlDeal(fc,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t){
	
	var str = "x="+isList;
	var a0 = fc[a];
	if(null != a0){
		str += "&a="+encodeURIComponent(encodeURIComponent(a0));
	}
	var a1 = fc[b];
	if(null != a1){
		str += "&b="+encodeURIComponent(encodeURIComponent(a1));
	}
	var a2 = fc[c];
	if(null != a2){
		str += "&c="+encodeURIComponent(encodeURIComponent(a2));
	}
	var a3 = fc[d];
	if(null != a3){
		str += "&d="+a3;
	}
	var a4 = fc[e];
	if(null != a4){
		str += "&e="+a4;
	}
	var a5 = fc[f];
	if(null != a5){
		str += "&f="+a5;
	}
	var a6 = fc[g];
	if(null != a6){
		str += "&g="+a6;
	}
	var a7 = fc[h];
	if(null != a7){
		str += "&h="+a7;
	}
	var a8 = fc[i];
	if(null != a8){
		str += "&i="+a8;
	}
	var a9 = fc[j];
	if(null != a9){
		str += "&j="+a9;
	}
	var a10 = fc[k];
	if(null != a10){
		str += "&k="+a10;
	}
	var a11 = fc[l];
	if(null != a11){
		str += "&l="+a11;
	}
	var a12 = fc[m];
	if(null != a12){
		str += "&m="+a12;
	}
	var a13 = fc[n];
	if(null != a13){
		str += "&n="+a13;
	}
	var a14 = fc[o];
	if(null != a14){
		str += "&o="+a14;
	}
	var a15 = fc[p];
	if(null != a15){
		str += "&p="+a15;
	}
	var a16 = fc[q];
	if(null != a16){
		str += "&q="+a16;
	}
	var a17 = fc[r];
	if(null != a17){
		str += "&r="+a17;
	}
	var a18 = fc[s];
	if(null != a18){
		str += "&s="+a18;
	}
	var a19 = fc[t];
	if(null != a19){
		str += "&t="+a19;
	}
//	var a = fc[e];
//	if(null != a19){
//		str += "&q="+a19;
//	}
//	var a5 = fc[f];
//	if(null != a5){
//		str += "&r="+a5;
//	}
	return str;

}

var getUrlParamSpecial = function getUrlParamSpecial(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}