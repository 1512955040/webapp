<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="ISO-8859-1"%>
 <%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
 <%@ page isELIgnored="false" %>
 
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>TestPermission</title>
</head>
<body>
	<div>
	  <table>
	  
	    <tr>
	      <th>Role</th>
	      <th>Description</th>
	      <th>Resource_Ids</th>
	    </tr>
	    
	    <c:forEach items="${rolelist }" var="i">
	     <tr>
	       <td>${ i.name } </td>
	       <td>${ i.description }</td>
	       <td>${ i.promise_ids }</td>
	     </tr>
	    </c:forEach>
	  </table>
	</div>
</body>
</html>