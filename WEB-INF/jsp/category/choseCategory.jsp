<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page isELIgnored="false" %>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>选择关注的产品分类</title>
<!-- <script type="text/javascript">

/*   function chose(){
	  document.forms.form.action="choseCategory";
	  document.forms.form.submit();
  } */
  
  function finish(){
	  var focusIDs=document.getElementsByName("focusIDs");
	  check_val = [];
	    for(k in focusIDs){
	        if(focusIDs[k].checked)
	            check_val.push(focusIDs[k].value);
	    }
	    document.getElementsByName("hiddeen").value=check_val;
	   /*  document.getElementById("form2").submit(); */
	   /*  document.forms.form2.action="saveCategory";*/
	    document.forms.form2.action="saveCategory";
	    document.forms.form2.submit(); 
  }

</script> -->
</head>
<body>
选择关注的分类
<h1>${error }</h1>
<p>父分类：${ categoryInfo.name}</p>

<c:forEach items="${categorySub }" var="i">
<shiro:hasPermission name="favoriteCategory:chose">
 <form action="" method="post">
  ${i.name }
  <input type="hidden" name="id" value="${i.id }"> 
  <input type="hidden" name="name" value="${i.name }">
  <input type="submit" value="查看子类">
  </form>
  </shiro:hasPermission>
</c:forEach>
<hr>
选择关注的分类
<shiro:hasPermission name="favoriteCategory:add">
<form method="post" action="favoriteCategory/add">
<c:forEach items="${categorySub }" var="i">
   
   ${i.name }
  <input type="checkbox" name="favoriteCategoryId" value="${i.id }"><br>

</c:forEach>
  <input type="submit" value="完成">
</form>
</shiro:hasPermission>
</body>
</html>