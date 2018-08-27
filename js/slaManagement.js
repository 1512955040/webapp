/**
 * SLA协议管理 Created by EKuter-si.yu on 2017/3/29.
 */

/**
 * 加载SLA列表数据
 * */
function loadSLAList(){
    $.ajax({
        traditional:true,
        url:loadSLAListUrl,
        dataType:"json",
        type:'POST',
        async:true,
        data:{flag:false},
        contentType:'application/x-www-form-urlencoded; charset=UTF-8',//防止乱码
        success:function(data){
            //登录信息失效，ajax请求静态页面拦截
            onServiceComplete(data);
            //console.log(data);
            var sla_de = {
                slaEditBtn:{
                    id: function () {
                        return "slaEditBtn"+this.sla_id;
                    }
                },
                slaDelBtn:{
                    id: function () {
                        return "slaDelBtn"+this.sla_id;
                    }
                },
                boxBtn:{
                  id: function () {
                      return "boxBtn"+this.sla_id;
                  },
                  class: function () {
                      if(this.sla_status == 1){
                          return "box active";
                      }else{
                          return "box";
                      }
                  }
                },
                slaUl:{
                  id: function () {
                      return "slaUl"+this.sla_id;
                  },
                  class: function () {
                      if(this.sla_status == 0){
                          return "disabledUl";
                      }
                  }
                },
                LogoClass:{
                    class: function () {
                        if(this.LOGO == 1){
                            return "fl jin";
                        }else if(this.LOGO == 2){
                            return "fl yin";
                        }else if(this.LOGO == 3){
                            return "fl tong";
                        }else if(this.LOGO == 4){
                            return "fl one";
                        }else if(this.LOGO == 5){
                            return "fl two";
                        }else if(this.LOGO == 6){
                            return "fl three";
                        }else if(this.LOGO == 7){
                            return "fl high";
                        }else if(this.LOGO == 8){
                            return "fl middle";
                        }else if(this.LOGO == 9){
                            return "fl low";
                        }
                    }
                }
            }

            $("#SLAData").render(data,sla_de);
            // setLeftHeight();
        },
        error:function(XMLHttpRequest){
			error_500(XMLHttpRequest.responseText);
		}
    });
}

/**
 * 开启/关闭SLA协议
 * */
function openOrCloseSLA(sla_id,flag){

    $.ajax({
        traditional:true,
        url:openOrCloseSLAUrl,
        dataType:"json",
        type:'POST',
        async:true,
        data:{id:sla_id,sla_status:flag},

        contentType:'application/x-www-form-urlencoded; charset=UTF-8',//防止乱码
        success:function(data){

            //登录信息失效，ajax请求静态页面拦截
            onServiceComplete(data);

            if(data.code == "0"){//code=0 代表该SLA开启/关闭操作成功
                if($("#boxBtn"+sla_id).hasClass("active")){
                    $("#slaUl"+sla_id).addClass("disabledUl");
                    $("#boxBtn"+sla_id).removeClass('active');
                }else{
                    $("#slaUl"+sla_id).removeClass("disabledUl");
                    $("#boxBtn"+sla_id).addClass('active');
                }

                $("#tipMsg").addClass("active").html(data.msg).show();
                function hideMsg(){
                    $("#tipMsg").addClass("active").html(data.msg).hide()
                }
                setTimeout(hideMsg,2000);

            }else if(data.code == "1"){//code=1 代表该SLA被关联无法执行开启/关闭操作
                $("#tipMsg").addClass("active").html(data.msg).show();
                function hideMsg(){
                    $("#tipMsg").addClass("active").html(data.msg).hide()
                }
                setTimeout(hideMsg,2000);
            }
        },
        error:function(XMLHttpRequest){
			error_500(XMLHttpRequest.responseText);
		}
    });
}

/**
 * 删除SLA协议
 * */
function removeSLAtoRecycle(sla_id){

    $.ajax({
        traditional:true,
        url:removeSLAtoRecycleUrl,
        dataType:"json",
        type:'POST',
        async:true,
        data:{id:sla_id},

        contentType:'application/x-www-form-urlencoded; charset=UTF-8',//防止乱码
        success:function(data){

            //登录信息失效，ajax请求静态页面拦截
            onServiceComplete(data);

            $("#tipMsg").addClass("active").html(data.msg).show();
            function hideMsg(){
                $("#tipMsg").addClass("active").html(data.msg).hide()
            }
            setTimeout(hideMsg,2000);

            loadSLAList();
        },
        error:function(XMLHttpRequest){
			error_500(XMLHttpRequest.responseText);
		}
    });
}
// function setLeftHeight(){
// 	$('#container-left').css('height',$('#container-right').outerHeight()+20+'px');
// }
/**
 * jquery函数
 * */
$(function () {
	
    loadSLAList();

    //点击开启/关闭SLA信息
    $("#SLAData").on("click","div.box", function () {
        var sla_id = $(this).find(".btnOperation").next().val();
        if($("#boxBtn"+sla_id).hasClass("active")){
            openOrCloseSLA(sla_id,false);
        }else{
            openOrCloseSLA(sla_id,true);
        }
    });

    //点击SLA删除按钮操作
    $("#SLAData").on("click","li.delete", function () {
        var sla_id = $(this).next().val();
        if($("#slaUl"+sla_id).hasClass("disabledUl")){
            $("#tipMsg").addClass("active").html("关闭状态不可删除协议信息！").show();
            function hideMsg(){
                $("#tipMsg").addClass("active").html("关闭状态不可删除协议信息！").hide()
            }
            setTimeout(hideMsg,2000);
        }else{
            $("#pupDelete").modal("show");
            $("#delConfirm").click(function () {
                $("#pupDelete").modal("hide");
                removeSLAtoRecycle(sla_id);
            });
        }
    });


    //点击SLA协议编辑按钮
    $("#SLAData").on("click","li.edit", function () {
        var sla_id = $(this).next().next().val();
        if($("#slaUl"+sla_id).hasClass("disabledUl")){
            $("#tipMsg").addClass("active").html("关闭状态不可修改协议信息！").show();
            function hideMsg(){
                $("#tipMsg").addClass("active").html("关闭状态不可修改协议信息！").hide()
            }
            setTimeout(hideMsg,2000);
        }else{
            window.location.href = 'slaBuilt.html?sla_id='+sla_id;
        }
    });

    //点击创建SLA协议跳转
    $("#createSLABtn").click(function () {
        window.location.href = 'slaBuilt.html';
    });
})