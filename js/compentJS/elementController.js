//rule = [true,true,true,false,false,false,false];
rules ={rule0:['elemenet_name','element2'],
        rule1:['ele2','ele3']
		};
elements = ['elemenet_name','element2','ele2','ele3','ele4'];
/**
 * 通过权限规则来判断，按钮等元素的显示或者隐藏
 * 参数：
 * elements:所有需要判断的元素，
 * userPower:权限标识
 * rules:自定义的规则，格式参考上以下：
 *      rules ={rule0:['elemenet_name','element2'],
 *             rule1:['ele2','ele3']
 *		       };
 *      elements = ['elemenet_name','element2','ele2','ele3','ele4'];
 *   
 * 返回值：对象，show属性，需要显示的元素
 *           hide属性，需要隐藏的元素
 * 
 */
var showElements = function showElements(elements,userPower,rules){
	var showEle = [];
	var ele = new Object();
	if(null != userPower && null != rules[userPower] && null != elements){
//		showEle = showEle.concat(rules[userPower]);
		var passRules= rules[userPower];
		for(x in passRules){
			if(-1 != $.inArray(passRules[x], elements)){
				var ss = passRules[x];
				showEle.push(passRules[x]);
				removeByValue(elements,passRules[x]);
			}
		}
		ele.show = showEle;
		ele.hide = elements;
	}else{
		ele.show = elements;
	}
	return ele;
}
/**
 * 删除数组中的制定元素
 * @param arr 数组
 * @param val 需要删除的元素
 */
function removeByValue(arr, val) {
	  for(var i=0; i<arr.length; i++) {
	    if(arr[i] == val) {
	      arr.splice(i, 1);
	      return;
	    }
	  }
}