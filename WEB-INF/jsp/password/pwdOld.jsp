<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page isELIgnored="false" %> 
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>修改密码</title>
</head>
<body>
<h1>${error }</h1>
<shiro:hasPermission name="password:check">
<form action="password/check" method="post">
请您输入旧密码：<input type="password" name="pwdOld">*<br>
<input type="submit" value="确定">
</form>
</shiro:hasPermission>
</body>
</html>