<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page isELIgnored="false" %> 
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>服务商登记的资源</title>
</head>
<body>
资源查找方式：......
<h1>${error }</h1>
<c:if test="${enterprise.type == 19 }">
<shiro:hasPermission name="resourceBelong:show">
  <a href="resourceBelong?flag=0"><input type="button" value="疑似企业资源组"></a><br>
</shiro:hasPermission>
<shiro:hasPermission name="resourceBelong:show">
  <a href="resourceBelong?flag=0&enterpriseMessage=0"><input type="button" value="未认领"></a>
</shiro:hasPermission>
<shiro:hasPermission name="resourceBelong:show">
  <a href="resourceBelong?flag=1"><input type="button" value="等待服务商确认"></a>
</shiro:hasPermission>
<shiro:hasPermission name="resourceBelong:show">
  <a href="resourceBelong?flag=4"><input type="button" value="服务商拒绝"></a>
</shiro:hasPermission>
<shiro:hasPermission name="resourceBelong:show">
  <a href="resourceBelong?flag=3"><input type="button" value="服务商同意(完成认领)"></a>
</shiro:hasPermission>
<shiro:hasPermission name="resourceBelong:show">
  <a href="resourceBelong?flag=8"><input type="button" value="服务商不同意退还"></a>
</shiro:hasPermission>
</c:if>
<c:if test="${enterprise.type == 17 }">
<shiro:hasPermission name="resourceBelong:show">
  <a href="resourceBelong?flag=0"><input type="button" value="已登记"></a>
</shiro:hasPermission>
<shiro:hasPermission name="resourceBelong:show">
  <a href="resourceBelong?flag=1"><input type="button" value="企业已初步认领，需要审核"></a>
</shiro:hasPermission>
<shiro:hasPermission name="resourceBelong:show">
  <a href="resourceBelong?flag=6"><input type="button" value="企业申请退还的资源"></a>
</shiro:hasPermission>
<shiro:hasPermission name="resourceBelong:show">
  <a href="resourceBelong?flag=7"><input type="button" value="企业已退回的资源"></a>
</shiro:hasPermission>
</c:if>
<table border="1" cellspacing="0">
  <tr>
    <th>资源名称</th>
    <th>授权许可</th>
    <th>价格</th>
    <th>相关操作</th>
  </tr>
  <c:forEach items="${resource }" var="i">
    <tr>
      <td>${i.name }</td>
      <td>${i.license }</td>
      <td>${i.price }</td>
    <td>
      <shiro:hasPermission name="resourceBelong:showDetail">
        <a href="resourceBelong/showDetail?id=${i.id }"><input type="button" value="查看详情"></a>
      </shiro:hasPermission>
    </td>
    </tr>
  </c:forEach>
</table>
</body>
</html>
<!-- 
a.    名称   * 
b.    参数信息（版本）【模板式】
c.    销售厂商
d.    授权许可（？）
e.    价格
f.    出厂日期
g.    采购日期
h.    登记日期
i.    质保期（到期日）
j.    报废期（到期日）
k.    备注
 -->