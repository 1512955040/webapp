<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page isELIgnored="false" %> 
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>修改人员信息</title>
</head>
<body>
修改企业人员信息
<c:forEach items="${errors }" var="i">
  <li>${i }</li>
</c:forEach>
<form action="update" method="post">
姓名：<input type="text" name="name" value="${businesPerson.name }">*<br>
性别： <c:if test="${businesPerson.sex == 39 }">
       <input type="radio" name="sex" value="39" checked="checked">男
       <input type="radio" name="sex" value="38">女      
    </c:if>
    <c:if test="${businesPerson.sex == 38}">
      <input type="radio" name="sex" value="39">男
      <input type="radio" name="sex" value="38" checked="checked">女
    </c:if>
    <br>
年龄：<input type="text" name="businesPersonAge" value="${businesPerson.age }"><br>
<%-- 职位：<input type="text" name="position" value="${businesPersonForm.position }"><br>
 --%>所属部门：<select name="oarchitecture_id">
         <option value="${businesPerson.oarchitecture_id }">${businesPerson.oarchitecture_id }</option>
         <c:forEach items="${organizationStructure }" var="i">
           <option value="${i.id }">${i.name }</option>
         </c:forEach>
      </select><br>
办公电话：<input type="text" name="tel" value="${businesPerson.tel }"><br>
邮箱：<input type="text" name="email" value="${businesPerson.email }"><br>
手机：<input type="text" name="mobilephone" value="${businesPerson.mobilephone }"><br>
<input type="submit" value="保存">
<input type="reset" value="重置">
<input type="hidden" name="OSId" value="${businesPerson.oarchitecture_id }">
<input type="hidden" name="id" value="${businesPerson.id }">
</form>
</body>
</html>