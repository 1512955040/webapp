<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page isELIgnored="false" %> 
<%@taglib prefix = "functions"  uri = "http://com/ekuter/tags/functions" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>角色新增</title>
</head>
<div class="error"><b><p>${error}</p></b></div><br/>
<body>
  <div>
    <form action="create" method="post">
        角色名称<input type = "text" name = "name" value = "${roleInfo.name}"/>*<br><br>
        角色描述<input type = "text" name = "description" value = "${roleInfo.description}"/><br><br>
                   <input type = "hidden" name = "organize_id" value = "${userInfo.organize_id}"/>
        是否有效<input type = "radio" name = "available" checked = "checked"/>是
                   <input type = "radio" name = "available" />否<br><br>
        权限
        <div>
          <c:forEach items="${promiseList}" var="promise">
            &nbsp;&nbsp;&nbsp;&nbsp;<input type = "checkbox" name = "promise_ids" value = "${promise.id}"/>${promise.name}<br>
          </c:forEach>
        </div><br>
        &nbsp;&nbsp;&nbsp;
        <input type = "submit" value = "新增"/>
        &nbsp;
        <input type = "reset" value = "重置"/><br>
    </form>
  </div>
</body>
</html>