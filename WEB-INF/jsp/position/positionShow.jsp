<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page isELIgnored="false" %> 
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>企业的所有岗位</title>
</head>
<body>
<h1>${error }</h1>
<table border="1" cellspacing="0">
  <tr>
    <th>岗位名称</th>
    <th>岗位描述</th>
    <th>相关操作</th>
  </tr>
  <c:forEach items="${position }" var="i">
    <tr>
      <td>${i.name }</td>
      <td>${i.functions }</td>
      <td>
        <shiro:hasPermission name="position:update">
	        <a href="position/update?id=${i.id }"><input type="button" value="修改"></a>
	      </shiro:hasPermission>  
	      <shiro:hasPermission name="grade:show">
	        <a href="grade/show?id=${i.id }"><input type="button" value="查看该岗位等级信息"></a>
	      </shiro:hasPermission>
      </td>
    </tr>
  </c:forEach>
</table>
<shiro:hasPermission name="position:add">
  <a href="position/add"><input type="button" value="增加岗位"></a>
</shiro:hasPermission>
</body>
</html>