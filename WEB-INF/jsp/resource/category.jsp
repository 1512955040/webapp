<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page isELIgnored="false" %> 
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>选择分类</title>
</head>
<body>
<c:forEach items="${errors }" var="i">
  <li>${i }</li>
</c:forEach>
<h1>${error }</h1>
<p>父分类：${name}</p>
<c:forEach items="${favoriteCategory }" var="i">
<shiro:hasPermission name="favoriteCategory:showCategory">
 <form action="" method="post">
  ${i.name }
  <input type="hidden" name="parent_id" value="${i.id }"> 
  <input type="hidden" name="name" value="${i.name}"> 
  <input type="submit" value="查看子类">
  </form>
  </shiro:hasPermission>
</c:forEach>
<hr>
<form action="../resource/add" method="get">
产品分类：<select name="id">
         <option value="">请选择</option>
         <c:forEach items="${favoriteCategory }" var="i">
           <option value="${i.id }">${i.name }</option>
         </c:forEach>
       </select><br>
<input type="submit" value="登记资源"> 
</form>
</body>
</html>