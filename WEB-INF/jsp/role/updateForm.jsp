<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page isELIgnored="false" %> 
<%@taglib prefix = "functions"  uri = "http://com/ekuter/tags/functions" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>角色修改</title>
</head>
<body>
<div class="error"><b><p>${error}</p></b></div><br/>
  <div>
    <form action="update" method="post">
        角色名称<input type = "text" name = "name" value = "${roleInfo.name}"/><br><br>
                   <input type = "hidden" name = "id" value = "${roleInfo.id }"/>
                   <input type = "hidden" name = "type" value = "${roleInfo.type }"/>
        角色描述<input type = "text" name = "description" value = "${roleInfo.description}"/><br><br>
        是否有效<c:if test="${roleInfo.available == true }">
							       <input type = "radio" name = "available"  value = "${roleInfo.available}" checked = "checked" />是
                     <input type = "radio" name = "available"  value = "${roleInfo.available}"/>否<br><br>  
							     </c:if>
							     <c:if test="">
							       <input type = "radio" name = "available"  value = "${roleInfo.available}" />是
                     <input type = "radio" name = "available"  value = "${roleInfo.available}"checked = "checked"/>否<br><br>  
							     </c:if>
        
        
        <%-- <input type = "radio" name = "available"  value = "${roleInfo.available}"/>是
                   <input type = "radio" name = "available"  value = "${roleInfo.available}"/>否<br><br> --%>
        权限
        <div>
          <c:forEach items="${promiseList}" var="promise">
            &nbsp;&nbsp;&nbsp;&nbsp;<input type = "checkbox" name = "promise_ids" value = "${promise.id}"/>${promise.name}<br>
          </c:forEach>
        </div><br>
        &nbsp;&nbsp;&nbsp;
        <input type = "submit" value = "修改"/>
        &nbsp;
        <input type="button"  onclick="javascript:history.back(-1);" value="返回">
    </form>
  </div>
</body>
</html>