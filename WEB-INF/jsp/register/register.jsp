<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page isELIgnored="false" %> 
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>用户注册</title>
</head>
<body>
<c:forEach items="${errors }" var="i">
  <li>${i }</li>
</c:forEach>
<form action="ifRegister" method="post">

用户类型：<input type="radio" name="user_type" value="17" checked="checked">服务用户
       <input type="radio" name="user_type" value="19">企业用户 <br>
<hr>
用户名：<input type="text" name="user_name" value="${rgisterUser.user_name }">*<br>
密码：<input type="password" name="pass_word">*<br>
用户姓名：<input type="text" name="name" value="${businesPerson.name }">*<br>
性别：<input type="radio" name="sex" value="1" checked="checked">男
    <input type="radio" name="sex" value="0">女<br>
联系电话：<input type="text" name="tel" value="${businesPerson.tel }">*<br>
邮箱：<input type="text" name="email" value="${businesPerson.email }"><br>

<input type="submit" value="注册"> <input type="reset" value="重置">
</form>
</body>
</html>