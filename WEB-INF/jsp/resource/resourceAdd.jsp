<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page isELIgnored="false" %>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>资源登记</title>
<!-- 现在目录：web/src/webapp/WEB-INF/jsp/resource/resourceAdd.jsp-->
<!-- 目标目录：web/src/webapp/scripts/jquery.min.js-->
<script type="text/javascript"  src="../scripts/jquery.min.js"></script> 

<script type="text/javascript">
  //根据分类ID和品牌ID查找对应的品牌型号
  $(function(){
    $("#brand_select").change(function(){
      //alert("-----+++++");
      var brand_id = $("#brand_select option:selected").val();
      var category_id = $("#category_id_hidden").val();
      //$("#brand_select option:selected").text()  是获取选中的文本的值
      //                                  .val()   是获取选中的value值
      //alert(brand_id);
      $.ajax({      
        url:"showBrandModel",
        type:"post",
        data:{"brandId":brand_id,"categoryId":category_id},
        dateType:"json",
        success:function(data){
        	$("#production_model_select").html("");
          for(var i=0;i<data.length;i++){
            var id=data[i].id;
            var name=data[i].name;
            $("#production_model_select").append(
              "<option value="+id+">"+name+"</option>"    
            );
          }
        }
      });
    });
  });
</script>

<script type="text/javascript">
  //根据品牌名称模糊查询品牌
  $(function(){
    $("#brandName_btn").click(function(){
      var brandName = $("#brandName").val();
      //alert(brandName);
      $.ajax({      
        url:"showBrand",
        type:"post",
        data:{"name":brandName},
        dateType:"json",
        success:function(data){
        	$("#brand_name_select").html("");
          for(var i=0;i<data.length;i++){
            var id=data[i].id;
            var name=data[i].name;
            $("#brand_name_select").append(
              "<option value="+id+">"+name+"</option>"    
            );
          }
        }
      });
    });
  });
</script>

<script type="text/javascript">
  //根据名字查找企业人员
  $(function(){
    $("#businesPersonName_btn").click(function(){
      var businesPersonName = $("#businesPersonName").val();
      $.ajax({      
          url:"showBusinesPerson",
          type:"post",
          data:{"name":businesPersonName},
          dateType:"json",
          success:function(data){
        	  $("#businesPerson_select").html("");
            for(var i=0;i<data.length;i++){
              var id=data[i].id;
              var name=data[i].name;
              $("#businesPerson_select").append(
                "<option value="+id+">"+name+"</option>"    
              );
            }
          }
        });
    });
  });
</script>

<script type="text/javascript">
  //根据名称模糊查询供应商
  $(function(){
	  $("#suppliers_btn").click(function(){
		  var suppliersName = $("#suppliers_name").val();
		  //alert(suppliersName);
		  $.ajax({
			  url:"showSuppliers",
			  type:"post",
			  data:{"name":suppliersName},
			  dateType:"json",
			  success:function(data){
				  $("#suppliers_select").html("");
				  for(var i=0;i<data.length;i++){
					  var id = data[i].id;
					  var name = data[i].name;
					  $("#suppliers_select").append(
						  "<option value="+id+">"+name+"</option>"	  
					  );
				  }
			  }
		  });
	  });
  });
</script>
</head>
<body>
<h1>资源登记</h1>
<c:forEach items="${errors }" var="i">
  <li>${i }</li>
</c:forEach>
<form action="add" method="post">
资源名称：<input type="text" name="name" value="${resource.name }">*<br>
参数信息：<input type="text" name="parameterInfo" value="${resource.parameter_info }"><br>
销售厂商：<select name="sale_id">
          <option value="">请选择</option>
            <c:forEach items="${enterpriseSuppliers }" var="x">
              <option value="${x.id }">${x.name }</option>
            </c:forEach>
       </select>
       <a href="../suppliers/add"><input type="button" value="新增"></a><br>
品牌：<select name="brand_id" id="brand_select">
         <option value="">请选择</option>
         <c:forEach items="${brandInfo }" var="y">
           <option value="${y.id }">${y.name }</option>
         </c:forEach>
       </select>
品牌型号：<select name="brand_model_id" id="production_model_select">
         <option value="">请选择</option>
       </select><br>
授权许可：<input type="text" name="license" value="${resource.license }"><br>
价格：<input type="text" name="resourcePrice" value="${resource.price }"><br>
出厂日期：<input type="date" name="factory_time"  value="${resource.factory_time }"><br>
采购时间：<input type="date" name="procure_time" value="${resource.procure_time }"><br>
登记时间：<input type="date" name="register_time" value="${resource.register_time }"><br>
质保期：<input type="date" name="warranty"  value="${resource.warranty }"><br>
报废期：<input type="date" name="retirement_time" value="${resource.retirement_time }"><br>
采购信息（合同）： <select name="purchase_contract_id">
                <option value="">请选择</option>
              <c:forEach items="${purchaseContract }" var="i"> 
                <option value="${i.id }">${i.name }</option>
              </c:forEach>
            </select>
          <a href="../showPurchaseContractAddForm"><input type="button" value="新增"></a><br>
责任人：<select name="charge_person_id" >
         <option value="">请选择</option>
       <c:forEach items="${businesPerson }" var="j"> 
         <option value="${j.id }">${j.name }</option>
       </c:forEach>
     </select>
     <a href="../businesPerson/add"><input type="button" value="新增"></a><br>
使用人：<select name="use_person_id">
         <option value="">请选择</option>
       <c:forEach items="${businesPerson }" var="k"> 
         <option value="${k.id }">${k.name }</option>
       </c:forEach>
     </select>
     <a href="../businesPerson/add"><input type="button" value="新增"></a><br>
备注：<textarea rows="3" cols="20" name="memo"></textarea><br>
<input type="submit" value="保存">
<input type="hidden" id="category_id_hidden" name="category_id" value="${categoryInfo.id }">

<hr>
按照名称查品牌：<input type="text" id="brandName">
           <input type="button" value="查品牌" id="brandName_btn">
品牌：<!-- 如果使用，加上name属性。 name="brand_id" -->
    <select  id="brand_name_select">
      <option value="">请选择</option>
    </select><br>
按照名字查人员：<input type="text" id="businesPersonName">
           <input type="button" value="查人员" id="businesPersonName_btn">
责任人或者使用人：<!-- 如果使用，加上name属性。 name="charge_person_id" -->
            <select  id="businesPerson_select">
             <option value="">请选择</option>
           </select><br>     
按照名称查供应商：<input type="text" id="suppliers_name">
            <input type="button" value="查供应商" id="suppliers_btn">
供应商：<select id="suppliers_select">
        <option value="">请选择</option>
     </select>      
</form>
</body>
</html>