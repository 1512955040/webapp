<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page isELIgnored="false" %> 
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>修改项目信息</title>
</head>
<body>
修改项目信息
<c:forEach items="${errors }" var="i">
  <li>${i }</li>
</c:forEach>
<form action="update" method="post" enctype="multipart/form-data">
项目名称：<input type="text" name="proj_name" value="${project.proj_name }" readonly="readonly">*<br>
项目编号：<input type="text" name="proj_code" value="${project.proj_code }" readonly="readonly">*<br>
招标代理机构：<input type="text" name="tender_agent" value="${project.tender_agent }"><br>
招标人：<input type="text" name="tender_person" value="${project.tender_person }"><br>
项目内容：<input type="text" name="proj_content" value="${project.proj_content }"><br>
项目金额：<input type="text" name="projAmount" value="${project.proj_amount }"><br>
项目文档：<input type="file" name="myfile"><br>
备注：<textarea rows="" cols="" name="memo"></textarea>
<input type="submit" value="保存">
<input type="hidden" name="id" value="${project.id }">
<input type="hidden" name="organization_id" value="${project.organization_id }">
</form>
</body>
</html>