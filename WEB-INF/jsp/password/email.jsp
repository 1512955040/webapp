<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page isELIgnored="false" %> 
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>输入邮箱</title>
</head>
<body>
<h1>${error }</h1>
<shiro:hasPermission name="password:checkEmail">
<form action="checkEmail" method="post">
请输入注册时的邮箱：<input type="text" name="email">*<br>
<input type="submit" value="确定">
<input type="hidden" name="userId" value="${userId }">
</form>
</shiro:hasPermission>
</body>
</html>