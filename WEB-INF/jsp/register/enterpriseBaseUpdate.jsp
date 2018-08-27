<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page isELIgnored="false" %> 
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>修改企业信息</title>
</head>
<body>
<c:forEach items="${errors }" var="i">
  <li>${i }</li>
</c:forEach>
<form action="enterpriseUpdate" method="post">
当前登录的用户信息<br>
用户姓名：<input type="text" name="businesPerson.name" value="${businesPerson.name }">*<br>
性别：<c:if test="${businesPerson.sex == 1}" var="rs">
       <input type="radio" name="sex" value="1" checked="checked">男
       <input type="radio" name="sex" value="0">女
    </c:if>
    <c:if test="${!rs }">
       <input type="radio" name="sex" value="1">男
       <input type="radio" name="sex" value="0" checked="checked">女
    </c:if><br>
联系电话：<input type="text" name="tel" value="${businesPerson.tel }">*<br>
邮箱：<input type="text" name="email" value="${businesPerson.email }"><br>
<hr>
企业名称：<input type="text" name="enterprise.name" value="${enterprise.name }">*<br>
机构代码：<input type="text" name="code_name" value="${enterprise.code_name }">*<br>
企业法人：<input type="text" name="business_corporation" value="${enterprise.business_corporation }"><br>
企业地址：<input type="text" name="address" value="${enterprise.address }"><br>
企业所在地：<input type="text" name="location" value="${enterprise.location }"><br>
<input type="submit" value="登记"> <input type="reset" value="重置">
<input type="hidden" name="businesPerson.id" value="${businesPerson.id }">
<input type="hidden" name="enterprise.id" value="${enterprise.id }">
<input type="hidden" name="type" value="${enterprise.type }"> 
</form>
</body>
</html>