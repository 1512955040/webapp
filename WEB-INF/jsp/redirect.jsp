<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
    <%@ page isELIgnored="false" %> 
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<title>Login To Ekuter</title>
	<style>.error{color:red;}</style>
</head>
<body>
<div class="error">${error}</div>
	<form action="" method="post" value="<shiro:principal/>">
	  Admin:<input type="text" name="account" ><br>
	  Password:    <input type="password" name="password"><br>
    RememberMe:<input type="checkbox" name="rememberMe" value="true"><br/>
	              <input type="submit" value="Login">
	             <a href = "/ekuter_web/register" ><input type="button" value="Register"/></a>
	</form>
	<a href="password/findBack"><input type="button" value="忘记密码"></a> 
  
</body>
</html>