/* 供应商管理 */

function getSuppliersList(){

    $.ajax({
        traditional: true,
        url: getSuppliesInfoListUrl,
        dataType: "json",
        type: 'POST',
        async: true,
        data: {
            contract_execute:false,
            supply_type:"",
            location:"",
            partnership:"",
            like:"",
            page:1,
            pageSize:10
        },
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',//防止乱码
        success: function (result) {
    function changeSearchCondition1(){
                $(/*"#left .left-wrap1,*/"#left .left-wrap2").removeClass('active');
                $(this).addClass('active');
            }

            //登录信息失效，ajax请求静态页面拦截
            onComplete(result);

            console.log(result);
            var data = result.data;

            //var suppliersClass = {
            //    iIcon:{
            //        id: function () {
            //            return this.id();
            //        }
            //    }
            //}

            $("#supplierList").render(data);

        },
        error:function(XMLHttpRequest){
            error_500(XMLHttpRequest.responseText);
        }
    });
}

/** 
 * 点击每条合同前面的小方块
 * 1.给小方框加上样式
 * 2.获取当前选中的供应商，改变“删除”的样式，只有的选中了供应商，才可以点击“删除”
 */
function supplierChooseClick(){

    if($(this).hasClass("active")){
        $(this).removeClass("active");
        $(this).find('i').removeClass('active');
    }else{
        $(this).addClass("active");
        $(this).find('i').addClass('active');
    }
    var supplier_ids = getCheckCon();
    //console.log(con_ids);
    changeDelClass(supplier_ids);
}
/**
 * 获取当前选中供应商的ids
 * @returns {Array}
 */
function getCheckCon(){
    var supplier_ids = [];
    var $checkPro = $("#supplierList").find("i.active").parents('.right-table-body').prev();
    $checkPro.each(function(){
        supplier_ids.push($(this).val());
    });
    return supplier_ids;
}



function showSupplierDetail(){
  window.location.href = 'supplierDetail.html';
}

/**
 * 获取当前选中的所有的id
 * @returns {Array}
 */
function getCheckSupplier(){
	var ids = [];
	var $checkPro = $(".right-table-body").find("i.active").next();
	$checkPro.each(function(){
		ids.push($(this).val());
	});
	return ids;
}
/**
 * 改变“删除”样式
 * @param ids
 */
function changeDelClass(ids){

	if(ids.length == 0){
		$("button.delete").addClass("default");
	}else{
		$("button.delete").removeClass("default");
	}
}
/**
 * 点击删除
 */
function deleteClick(){
	var ids = [];
	ids = getCheckSupplier();
	if(ids != 0){
		$("#pupDelete").modal('show');
	}
}

$(function(){
	getHistory();
  /*上部分*/
    //加载供应商列表
    getSuppliersList();

    $(".right-body-btn.create,button.create").on('click', function(){window.location.href = 'supplierAdd.html'});

	//删除按钮
	$('button.right-body-btn').click(deleteClick);

    /*左部分*/

    //点击该合同未关联的每个资产前面的小框
    $("#supplierList").on("click",".icon",supplierChooseClick);

    // 双击进入详情
    $("#supplierList").on('dblclick','.right-table-body',showSupplierDetail);
  /*左部分*/
  // 筛选 - 第一二项
  $(/*"#left .left-wrap1,*/"#left .left-wrap2").on('click',changeSearchCondition1);
  // 筛选 - 供应商
  $("#left .left-item-check").on('click',changeSearchCondition2);
  /*内容部分*/
  // 单击选中
  $("#right .right-table-body").on('click',selectSupplierDetail);
  // 双击进入详情
  $("#right .right-table-body").on('dblclick',showSupplierDetail);
  
  /*下部分*/
});
