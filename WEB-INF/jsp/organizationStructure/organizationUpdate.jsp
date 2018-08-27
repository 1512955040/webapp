<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page isELIgnored="false" %> 
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>更新部门信息</title>
</head>
<body>
<c:forEach items="${errors }" var="i">
  <li>${i }</li>
</c:forEach>
部门信息：
<form action="update" method="post">
部门名称：<input type="text" name="name" value="${organizationStructure.name }">*<br>
部门职能：<input type="text" name="function" value="${organizationStructure.function }"><br>
<input type="submit" value="保存">
<input type="hidden" value="${organizationStructure.id }" name="id">
</form>
</body>
</html>