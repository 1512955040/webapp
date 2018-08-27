<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page isELIgnored="false" %> 
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>部门列表</title>
</head>
<body>
<h1>${error }</h1>
  <a href="businesPerson?OSId=0"><input type="button" value="企业人员管理"></a>
  <shiro:hasPermission name="organization:add">
  <a href="organization/add"><input type="button" value="增加一级部门"></a>
  </shiro:hasPermission>
<p>上级部门:${parentName }</p>
<table border="1" cellspacing="0">
  <tr>
    <th>部门名称</th>
    <th>部门职能</th>
    <th>相关操作</th>
  </tr>
	<c:forEach items="${organizationStructure }" var="i">
	  <tr>
	    <td>${i.name }</td>
	    <td>${i.function }</td>
	    <td>
        <form action="" method="post">
          <input type="hidden" name="parentId" value="${i.id }">
          <input type="hidden" name="parentName" value="${i.name }">
          <input type="submit" value="查看下级部门">
        </form>
        <shiro:hasPermission name="organization:update">
 	        <a href="organization/update?id=${i.id }"><input type="button" value="修改信息"></a><br>
 	      </shiro:hasPermission>
 	      <shiro:hasPermission name="organization:add">
	        <a href="organization/add?id=${i.id }"><input type="button" value="增加下级部门"></a><br>
	      </shiro:hasPermission>
 	      <shiro:hasPermission name="businesPerson:show">
	        <a href="businesPerson?OSId=${i.id }"><input type="button" value="查看该部门人员"></a>
	      </shiro:hasPermission> 
	    </td>
	  </tr>
	</c:forEach>
</table>
</body>
</html>