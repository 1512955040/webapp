<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page isELIgnored="false" %>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>合同关联项目</title>
</head>
<body>
<div class="error"><b><p>${errMessage}</p></b></div><br/>
  <form action="addProject" method = "post">
  <div>项目名称：${serviceContract.name }
    <input type = "hidden" name = "serConId" value = "${serviceContract.id }"/>
  </div>
  <div>
      请选择需要关联的项目：
      <select name = "projectId">
                  <option value="">请选择</option>
                  <c:forEach items="${project }" var="p">
                    <option value="${ p.id }">${ p.proj_name }</option>
                  </c:forEach>
                </select><br>
    </div><br/>
   <div> <input type = "submit" value = "提交"></div>
  </form>
</body>
</html>