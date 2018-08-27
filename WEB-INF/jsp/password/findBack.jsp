<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page isELIgnored="false" %> 
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>输入账号</title>
</head>
<body>
<h1>${error }</h1>
<shiro:hasPermission name="password:checkUserName">
<form action="checkUserName" method="post">
请输入需要找回密码的账号:<input type="text" name="userName">*<br>
<input type="submit" value="确定">
</form>
</shiro:hasPermission>
</body>
</html>