<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page isELIgnored="false" %> 
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>所有人员</title>
</head>
<body>
<h1>${error }</h1>
<table border="1" cellspacing="0">
  <tr>
    <th>姓名</th>
    <th>性别</th>
    <th>年龄</th>
    <!-- <th>职位</th> -->
    <th>办公电话</th>
    <th>手机</th>
    <th>邮箱</th>
    <th>所属部门</th>
    <th>相关操作</th>
  </tr>
  <c:forEach items="${businesPerson }" var="i">
    <tr>
      <td>${i.name }</td>
      <td>${i.sex }</td>
      <td>${i.age }</td>
     <%--  <td>${i.position }</td> --%>
      <td>${i.tel }</td>
      <td>${i.mobilephone }</td>
      <td>${i.email }</td>
      <td>${i.oarchitecture_id }</td>
      <td>
        <shiro:hasPermission name="businesPerson:update">
	        <a href="businesPerson/update?id=${i.id }"><input type="button" value="修改"></a>
	      </shiro:hasPermission>
	      <shiro:hasPermission name="businesPerson:delete">
<%-- 	        <a href="businesPerson/delete?id=${i.id }&OSId=${i.oarchitecture_id}"><input type="button" value="删除"></a>
 --%>	      </shiro:hasPermission>
      </td>
    </tr>
  </c:forEach>
</table>
<shiro:hasPermission name="businesPerson:add">
  <a href="businesPerson/add?OSId=${OSId }"><input type="button" value="增加人员"></a>
</shiro:hasPermission>
</body>
</html>
<!-- 
.    企业人员信息
a.    姓名*
b.    性别
c.    年龄
d.    职位
e.    所属部门
f.    办公电话
g.    邮箱
h.    手机

 -->