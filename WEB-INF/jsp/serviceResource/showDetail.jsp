<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page isELIgnored="false" %> 
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>认领资源</title>
</head>
<body>
<h1>${error }</h1>
<h1>资源的详情信息</h1>
<table border="1" cellspacing="0">
  <tr>
    <th>资源名称</th>
    <th>参数信息</th>
    <th>授权许可</th>
    <th>价格</th>
    <th>出厂日期</th>
    <th>采购日期</th>
    <th>登记日期</th>
    <th>质保期</th>
    <th>报废期</th>
    <th>备注</th>
    <th>认领状态</th>
  </tr>
   <tr>
     <td>${resource.name }</td>
     <td>${para }</td>
     <td>${resource.license }</td>
     <td>${resource.price }</td>
     <td><fmt:formatDate value="${resource.factory_time }" pattern="yyyy-MM-dd"/></td>
     <td><fmt:formatDate value="${resource.procure_time }" pattern="yyyy-MM-dd"/></td>
     <td><fmt:formatDate value="${resource.register_time }" pattern="yyyy-MM-dd"/></td>
     <td><fmt:formatDate value="${resource.warranty }" pattern="yyyy-MM-dd"/></td>
     <td><fmt:formatDate value="${resource.retirement_time }" pattern="yyyy-MM-dd"/></td>
     <td>${resource.memo }</td>
     <td>${resource.flag }</td>
   </tr>
</table>
<c:if test="${userInfo.user_type == 19 }">
<h1>服务商的详情信息</h1>
<table border="1" cellspacing="0">
  <tr>
    <th>公司名称</th>
    <th>公司代码</th>
    <th>企业法人</th>
    <th>企业地址</th>
    <th>企业所在地</th>
    <th>注册类型</th>
    <th>注册地址</th>
    <th>经营范围</th>
    <th>关键字</th>
  </tr>
  <tr>
    <td>${enterprise.name }</td>
    <td>${enterprise.code_name }</td>
    <td>${enterprise.business_corporation }</td>
    <td>${enterprise.address }</td>
    <td>${enterprise.location }</td>
    <td>还没有</td>
    <td>还没有</td>
    <td>还没有</td>
    <td>${enterprise.keyword }</td>
  </tr>
</table>
<!-- 未完成认领 -->
<c:if test="${resource.flag != 3 }" var="res">
  <shiro:hasPermission name="resourceBelong:updateFlag">
		<form action="updateFlag" method="post">
		  <input type="hidden" name="flag" value="1">
	<!-- 	  <input type="radio" name="flag" value="2">不认领该资源<br>
	 -->	  <input type="submit" value="认领该资源">
	    <input type="hidden" name="enterpriseId" value="${enterpriseId }">
		  <input type="hidden" name="resourceId" value="${resource.id }">
		</form>
	</shiro:hasPermission>
</c:if>
<c:if test="${!res }">
  <shiro:hasPermission name="resourceBelong:updateFlag">
	  <form action="updateFlag" method="post">
	    <input type="hidden" name="flag" value="6">
	    <input type="submit" value="退还该资源">
	<%--     <input type="hidden" name="enterpriseId" value="${enterpriseId }">
	 --%>    <input type="hidden" name="resourceId" value="${resource.id }">
	  </form>
  </shiro:hasPermission>
</c:if>
</c:if>
<c:if test="${userInfo.user_type == 17 }">
<h1>认领资源的企业的详情信息</h1>
<table border="1" cellspacing="0">
  <tr>
    <th>公司名称</th>
    <th>公司代码</th>
    <th>企业法人</th>
    <th>企业地址</th>
    <th>企业所在地</th>
    <th>注册类型</th>
    <th>注册地址</th>
    <th>经营范围</th>
    <th>关键字</th>
  </tr>
  <tr>
    <td>${enterprise.name }</td>
    <td>${enterprise.code_name }</td>
    <td>${enterprise.business_corporation }</td>
    <td>${enterprise.address }</td>
    <td>${enterprise.location }</td>
    <td>${enterpriseDetail.register_type }</td>
    <td>${enterpriseDetail.register_address }</td>
    <td>${enterpriseDetail.business_scope }</td>
    <td>${enterprise.keyword }</td>
  </tr>
</table>
<c:if test="${resource.flag == 1 }" var="res">
  <shiro:hasPermission name="resourceBelong:updateFlag">
		<form action="updateFlag" method="post">
		  <input type="radio" name="flag" value="3" checked="checked">同意认领
		  <input type="radio" name="flag" value="4">不同意<br>
		  <input type="submit" value="保存">
		  <input type="hidden" name="resourceId" value="${resource.id }">
		</form>
	</shiro:hasPermission>
</c:if>
<c:if test="${resource.flag == 6 }">
  <shiro:hasPermission name="resourceBelong:updateFlag">
	  <form action="updateFlag" method="post">
	    <input type="radio" name="flag" value="7" checked="checked">同意退还
	    <input type="radio" name="flag" value="8">不同意<br>
	    <input type="submit" value="保存">
	    <input type="hidden" name="resourceId" value="${resource.id }">
	  </form>
  </shiro:hasPermission>
</c:if>
<%-- <c:if test="${resource.flag == 7 }">
  <a href="../resource/serviceUpdateResource?resourceId=${resourceId }">
    <input type="button" value="重新登记该资源">
  </a>
</c:if> --%>
</c:if>
</body>
</html>
<!-- 

11.   服务商信息（同企业信息）
a.    公司名称
b.    公司代码
c.    企业法人
d.    企业地址
e.    企业所在地
f.    注册类型
g.    注册地址
h.    经营范围
i.    企业关键字

资源
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