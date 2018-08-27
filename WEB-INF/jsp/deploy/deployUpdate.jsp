<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page isELIgnored="false" %> 
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>修改部署信息</title>
</head>
<body>
修改部署信息：
<c:forEach items="${errors }" var="i">
  <li>${i }</li>
</c:forEach>
<form action="update" method="post">
部署位置：<input type="text" name="deploy_place" value="${deploy.deploy_place }">*<br>
部署日期：<input type="date" name="deploy_date" value="">*<br>
部署详情：<input type="text" name="deploy_details" value="${deploy.deploy_details }"><br>
部署图：<input type="file" name="myfiles" <%-- value="${deploy.location_ico }" --%>><br>
<input type="file" name="myfiles" <%-- value="${deploy.location_ico }" --%>><br>
<input type="file" name="myfiles" <%-- value="${deploy.location_ico }" --%>><br>
部署人员：<input type="text" name="deploy_person" value="${deploy.deploy_person }">*<br>
<input type="submit" value="保存">
<input type="hidden" name="id" value="${deploy.id }">
</form>
</body>
</html>