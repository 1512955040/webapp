<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page isELIgnored="false" %> 
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>登记企业信息</title>
</head>
<body>
<c:forEach items="${errors }" var="i">
  <li>${i }</li>
</c:forEach>
<form action="enterpriseSave" method="post">
企业名称：<input type="text" name="enterprise.name" value="${enterprise.name }">*<br>
机构代码：<input type="text" name="code_name" value="${enterprise.code_name}">*<br>
企业法人：<input type="text" name="business_corporation" value="${enterprise.business_corporation }"><br>
企业地址：<input type="text" name="address" value="${enterprise.address }"><br>
企业所在地：<input type="text" name="location" value="${enterprise.location }"><br>
<input type="submit" value="登记"> <input type="reset" value="重置">
<!-- 上一个表单的数据 -->
<input type="hidden" name="user_name" value="${userInfo.user_name }"><br>
<input type="hidden" name="pass_word" value="${userInfo.pass_word }"><br>
<input type="hidden" name="user_type" value="${userInfo.user_type }">
<input type="hidden" name="businesPerson.name" value="${businesPerson.name}"><br>
<input type="hidden" name="sex" value="${businesPerson.sex }">
<input type="hidden" name="tel" value="${businesPerson.tel }"><br>
<input type="hidden" name="email" value="${businesPerson.email }"><br>
</form>
</body>
</html>