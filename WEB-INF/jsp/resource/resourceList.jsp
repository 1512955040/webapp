<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page isELIgnored="false" %> 
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>企业资源列表 </title>
</head>
<body>
<p>${error }</p>
资源查找方式
<form action="resource/showResourceByType" method="get">
按分类查找：<select name="categoryId">
          <option value="">请选择</option>
          <c:forEach items="${favoriteCategory }" var="i">
            <option value="${i.id }">${i.name }</option>
          </c:forEach>
        </select><br>
按品牌查找：<select name="brandId">
          <option value="">请选择</option>
          <c:forEach items="${brandInfo }" var="i">
            <option value="${i.id }">${i.name }</option>
          </c:forEach>
        </select><br>
按登记年度：<select name="saveYear">
          <option value="">请选择</option>
          <option value="2016">2016</option>
          <option value="2015">2015</option>
          <option value="2014">2014</option>
          <option value="2013">2013</option>
          <option value="2012">2012</option>
        </select><br>
按厂商：<select name="suppliersId">
       <option value="">请选择</option> 
       <c:forEach items="${enterpriseSuppliersInfo }" var="i">
         <option value="${i.id }">${i.name }</option>
       </c:forEach>
     </select><br>
  <input type="submit" value="查找">
</form>
<hr>
<h1>所有资源</h1>
<table border="1" cellspacing="0">
  <tr>
    <th>资源名称</th>
    <th>相关操作</th>
  </tr>
  <c:forEach items="${resource }" var="i">
    <tr>
      <td>${i.name }</td>
    <td>
      <shiro:hasPermission name="resource:showDetail">
        <a href="resource/showDetail?id=${i.id }"><input type="button" value="查看"></a>
      </shiro:hasPermission>
      <a href=""><input type="button" value="修改"></a>
    </td>
    </tr>
  </c:forEach>
</table>
<shiro:hasPermission name="resource:add">
  <a href="favoriteCategory/showCategory"><input type="button" value="资源登记"></a>
</shiro:hasPermission>

<hr>
<h1>按不同的查找方式显示结果</h1>
<table border="1" cellspacing="0">
  <tr>
    <th>资源名称</th>
    <th>相关操作</th>
  </tr>
  <c:forEach items="${resourceList }" var="i">
    <tr>
      <td>${i.name }</td>
    <td>
      <shiro:hasPermission name="resource:showDetail">
        <a href="showDetail?id=${i.id }"><input type="button" value="查看"></a>
      </shiro:hasPermission>
      <a href=""><input type="button" value="修改"></a>
    </td>
    </tr>
  </c:forEach>
</table>
</body>
</html>