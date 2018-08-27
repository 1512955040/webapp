<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page isELIgnored="false" %> 
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>增加岗位信息</title>
</head>
<body>
<c:forEach items="${errors }" var="i">
  <li>${i }</li>
</c:forEach>
<form action="add" method="post">
岗位名称：<input type="text" name="name" value="${position.name }">*<br>
岗位描述：<input type="text" name="functions" value="${position.functions }"><br>
<input type="submit" value="保存">
</form>
</body>
</html>