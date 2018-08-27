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
    <form action="update" method="post">
        账号名称<input type = "text" name = "user_name" value = "${commonUserInfo.user_name}"/>*<br><br>
                   <input type = "hidden" name = "id" value = "${commonUserInfo.id}"/>
                   <input type = "hidden" name = "pass_word" value = "${commonUserInfo.pass_word}"/>
<%--                    <input type = "hidden" name = "organize_id" value = "${commonUserInfo.organize_id}"/>
                   <input type = "hidden" name = "user_type" value = "${userInfo.user_type}"/>
                   
                   <input type = "hidden" name = "flag" value = "${commonUserInfo.flag}"/>
                   <input type = "hidden" name = "locked" value = "${commonUserInfo.locked}"/> --%>
        选择部门
       <select name = "os_id">
         <option value="">请选择</option>
	         <c:forEach items="${deptList }" var="dept">
	           <option value="${ dept.id }" selected = "selected">${ dept.name }</option>
	         </c:forEach>
       </select><br><br>
        选择角色
       <select name = "role_id">
         <option value="">请选择</option>
           <c:forEach items="${roleList }" var="role">
             <option value="${ role.id }" selected = "selected">${ role.name }</option>
           </c:forEach>
       </select><br><br>
        &nbsp;&nbsp;&nbsp;
        <input type = "submit" value = "修改"/>
    </form>
  </div>
</body>
</html>