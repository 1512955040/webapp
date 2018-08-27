<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
 <%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page isELIgnored="false" %> 
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Index</title>
</head>
<body>
<h1>WELCOME < ${userInfo.user_name} >TO EKUTER!!!</h1>
<p>已经完善的企业共有信息</p>
<p>${enterprise }</p>
<hr>
<p>已经完善的企业信息</p>
<p>${enterpriseUserInfo }</p>
<div id="logout">
  <a href = "/ekuter_web/logout"><input type = "button" value = "Logout"/></a><br><hr>
  <a href="password"><input type="button" value="修改密码"/></a><br><hr>
  <a href="enterprise/allInfo"><input type="button" value="修改企业信息"></a><br><hr>
  <a href="favoriteCategory"><input type="button" value="选择关注的分类"></a><br><hr>
  <a href="resourceBelong?flag=0"><input type="button" value="资源认领"></a>
  <a href="resource"><input type="button" value="资源管理"></a><br><hr>
  <a href="serviceContractManager"><input type="button" value="服务合同管理"></a><br><hr>
  <a href="purchaseContractManager"><input type="button" value="供销合同管理"></a><br><hr>
  <a href="project"><input type="button" value="项目管理"></a><br><hr>
  <a href="organization"><input type="button" value="组织架构管理"></a><hr>
  <a href="suppliers/suppliersManager?enterpriseId=${enterprise.id }"><input type="button" value="供应商管理"></a><br><hr>

</div><br>
  <a href="resourceAjax/dashboard"><input type="button" value="dashboard"></a><hr>
<div>
    功能菜单<br/>
    <c:forEach items="${menus}" var="m">
        <a href="${pageContext.request.contextPath}${m.url}" >${m.name}</a><br/>
    </c:forEach>
</div>
</body>
</html>