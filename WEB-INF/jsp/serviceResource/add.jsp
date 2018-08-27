<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page isELIgnored="false" %> 
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Insert title here</title>
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
</head>
<body>
<h1>资源登记</h1>
<c:forEach items="${errors }" var="i">
  <li>${i }</li>
</c:forEach>
<form action="add" method="post">
资源名称：<input type="text" name="name" value="${resource.name }">*<br>
参数信息：<input type="text" name="parameterInfo" value="${resource.parameter_info }"><br>
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
备注：<textarea rows="3" cols="20" name="memo"></textarea><br>
<%-- 该资源归属企业：<select name="resourceAgentId">
            <option value="">请选择</option>
            <c:forEach items="${enterprise }" var="i">
              <option value="${i.id }">${i.name }</option>
            </c:forEach>
           </select> --%>
该资源归属的企业名称：<input type="text" name="resourceAgentName"><br>
<input type="submit" value="保存">
<input type="hidden" name="category_id" value="${categoryInfo.id }">
</form>
</body>
</html>