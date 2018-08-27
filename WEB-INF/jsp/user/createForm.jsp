<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page isELIgnored="false" %> 
<%@taglib prefix = "functions"  uri = "http://com/ekuter/tags/functions" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>账号新增</title>
</head>
<div class="error"><b><p>${error}</p></b></div><br/>
<body>
  <div>
    <form action="create" method="post">
        账号名称<input type = "text" name = "user_name" value = "${commonUserInfo.user_name}"/>*<br><br>
        账号密码<input type = "text" name = "pass_word" value = "${commonUserInfo.pass_word}"/>*<br><br>
                   <input type = "hidden" name = "user_type" value = "${userInfo.user_type}"/>
                   <input type = "hidden" name = "organize_id" value = "${userInfo.organize_id}"/>
        选择部门
       <select name = "os_id">
         <option value="">请选择</option>
	         <c:forEach items="${deptList }" var="dept">
	           <option value="${ dept.id }">${ dept.name }</option>
	         </c:forEach>
       </select><br><br>
        选择角色
       <select name = "role_id">
         <option value="">请选择</option>
           <c:forEach items="${roleList }" var="role">
             <option value="${ role.id }">${ role.name }</option>
           </c:forEach>
       </select><br><br>
        &nbsp;&nbsp;&nbsp;
        <input type = "submit" value = "新增"/>
        &nbsp;
        <input type = "reset" value = "重置"/><br>
    </form>
  </div>
</body>
</html>