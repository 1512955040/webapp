<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page isELIgnored="false" %> 
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>审核结果</title>
</head>
<body>
<h1>审核结果</h1>
<c:choose>
  <c:when test="${ checkResult==9}">待审核<br>
    <a href="login"><input type="button" value="返回"></a>
  </c:when>
  
  <c:when test="${ checkResult==10}">审核中<br>
    <a href="login"><input type="button" value="返回"></a>
  </c:when>
  
    <c:when test="${ checkResult==11}">审核通过<br>
    <a href="enterprise/allInfo"><input type="button" value="去完善企业信息"></a> 
  </c:when>

  <c:when test="${ checkResult==12}">审核未通过<br>
    <a href="enterpriseUpdateJSP"><input type="button" value="修改信息"></a>
  </c:when>
</c:choose>
</body>
</html>