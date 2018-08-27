<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page isELIgnored="false" %> 
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>查看项目</title>
</head>
<body>
查看项目
<h1>${error }</h1>
<table border="1" cellspacing="0">
  <tr>
    <th>项目名称</th>
    <th>项目编号</th>
    <th>招标代理机构</th>
    <th>招标人</th>
    <th>项目内容</th>
    <th>项目金额</th>
    <th>项目文档</th>
    <th>项目备注</th>
    <th>修改</th>
    <th>启用/停用</th>
  </tr>
  <c:forEach items="${project }" var="i">
    <tr>
      <td>${i.proj_name }</td>
      <td>${i.proj_code }</td>
      <td>${i.tender_agent }</td>
      <td>${i.tender_person }</td>
      <td>${i.proj_content }</td>
      <td>${i.proj_amount }</td>
      <td>${i.proj_document}  <a href="${path }${i.proj_document}/${i.organization_id}"><input type="button" value="下载"></a></td>
      <td>${i.memo }</td>
      <td>
        <shiro:hasPermission name="project:update">
	        <form action="project/update" method="get">
	          <input type="hidden" name="id" value="${i.id }">
	          <input type="submit" value="修改">
	        </form>
        </shiro:hasPermission>
      </td>
      <td>
        <shiro:hasPermission name="project:updateFlag">
	        <form action="project/updateFlag" method="get">
	          <c:if test="${i.flag == 1 }">
	            <input type="radio" name="flag" value="1" checked="checked">启用
	            <input type="radio" name="flag" value="0">停用
	          </c:if>
	          <c:if test="${i.flag == 0 }">
	            <input type="radio" name="flag" value="1">启用
	            <input type="radio" name="flag" value="0" checked="checked">停用
	          </c:if>
	           <input type="hidden" name="id" value="${i.id }">
	          <input type="submit" value="保存">
	        </form>
        </shiro:hasPermission>
      </td>
    </tr>
  </c:forEach>
</table>
<shiro:hasPermission name="project:add">
  <a href="project/add"><input type="button" value="增加项目"></a>
</shiro:hasPermission>
</body>
</html>