<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page isELIgnored="false" %> 
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>新密码</title>
</head>
<body>
<h1>${error }</h1>
<shiro:hasPermission name="password:update">
<form action="update" method="post">
请输入新密码:<input type="password" name="pwdNew">*<br>
请输入确认密码:<input type="password" name="pwdSure">*<br> 
<input type="submit" value="保存">
</form>
</shiro:hasPermission>
</body>
</html>