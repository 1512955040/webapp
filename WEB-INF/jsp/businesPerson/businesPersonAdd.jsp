<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page isELIgnored="false" %> 
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>增加企业人员信息</title>
</head>
<body>
增加/修改企业人员信息
<c:forEach items="${errors }" var="i">
  <li>${i }</li>
</c:forEach>
<form action="add" method="post">
姓名：<input type="text" name="name" value="${businesPersonForm.name }">*<br>
性别： <input type="radio" name="sex" checked="checked" value="1">男
    <input type="radio" name="sex" value="0">女
    <br>
年龄：<input type="text" name="businesPersonAge" value="${businesPersonForm.age }"><br>
职位：<input type="text" name="position" value="${businesPersonForm.position }"><br>
所属部门：<select name="department">
         <option value="">请选择</option>
         <c:forEach items="" var="i">
           <option value="${i.id }">${i.name }</option>
         </c:forEach>
      </select><br>
办公电话：<input type="text" name="tel" value="${businesPersonForm.tel }"><br>
邮箱：<input type="text" name="email" value="${businesPersonForm.email }"><br>
手机：<input type="text" name="mobilephone" value="${businesPersonForm.mobilephone }"><br>
<input type="submit" value="保存">
<input type="reset" value="重置">
</form>
</body>
</html>
<!-- 
5.    企业人员信息
a.    姓名*
b.    性别
c.    年龄
d.    职位
e.    所属部门
f.    办公电话
g.    邮箱
h.    手机
 -->