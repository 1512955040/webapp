<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page isELIgnored="false" %> 
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>资源详情</title>
<script type="text/javascript">
function test(a)
{
	alert('大佛一個叫愛對方');
}
</script>

</head>
<body>
<h1>资源基本信息</h1>
<table border="1" cellspacing="0">
  <tr>
    <th>名称</th>
    <th>参数信息</th>
    <th>授权许可</th>
    <th>价格</th>
    <th>出厂日期</th>
    <th>采购日期</th>
    <th>登记日期</th>
    <th>质保期</th>
    <th>报废期</th>
    <th>备注</th>
  </tr>
   <tr>
     <td>${resource.name }</td>
     <td>${resourcePara }</td>
     <td>${resource.license }</td>
     <td>${resource.price }</td>
     <td><fmt:formatDate value="${resource.factory_time }" pattern="yyyy-MM-dd"/></td>
     <td><fmt:formatDate value="${resource.procure_time }" pattern="yyyy-MM-dd"/></td>
     <td><fmt:formatDate value="${resource.register_time }" pattern="yyyy-MM-dd"/></td>
     <td><fmt:formatDate value="${resource.warranty }" pattern="yyyy-MM-dd"/></td>
     <td><fmt:formatDate value="${resource.retirement_time }" pattern="yyyy-MM-dd"/></td>
     <td>${resource.memo }</td>
   </tr>
</table>
<hr>
<h1>资源关联信息</h1>
<h3>销售厂商</h3><br>
<table border="1" cellspacing="0">      
  <tr>
    <th>厂商名称</th>
    <th>厂商代码</th>
    <th>厂商类型</th>
    <th>所在地</th>
    <th>地址</th>
    <th>联系人</th>
    <th>联系电话</th>
    <th>办公电话</th>
    <th>网址</th>
    <th>关键字</th>
    <th>备注</th>
  </tr>
  <tr>
    <td>${enterpriseSuppliers.name }</td>
    <td>${enterpriseSuppliers.code_name }</td>
    <td>${enterpriseSuppliers.type }</td>
    <td>${enterpriseSuppliers.location }</td>
    <td>${enterpriseSuppliers.address }</td>
    <td>${enterpriseSuppliers.contact_person }</td>
    <td>${enterpriseSuppliers.contact_tell }</td>
    <td>${enterpriseSuppliers.office_phone }</td>
    <td>${enterpriseSuppliers.website }</td>
    <td>${enterpriseSuppliers.keyword }</td>
    <td>${enterpriseSuppliers.memo }</td>
  </tr>    
</table>
<h3>项目信息</h3><br>
<table border="1" cellspacing="0">
  <tr>
    <th>项目名称</th>
    <th>项目编号</th>
  </tr>
  <tr>
    <td>${project.name }</td>
    <td>${project.proj_code }</td>
  </tr>
</table>
<a href=""><input type="button" value="设置关联项目"></a>
<h3>部署信息</h3>
<table border="1" cellspacing="0">
  <tr>
    <th>部署位置</th>
    <th>部署日期 </th>
    <th>部署详情</th>
    <th>部署图</th>
    <th>部署人员</th>
  </tr>
  <tr>
    <td>${deploy.deploy_place }</td>
    <td><fmt:formatDate value="${deploy.deploy_date }" pattern="yyyy-MM-dd"/></td>
    <td>${deploy.deploy_details }</td>
    <td>
    <c:forEach items="${imgNameList}" var="i"> 
      <a href="${path }${i}/${enterpriseId}">
        <img src="${path}${i}/${enterpriseId}" height="100px";width="100px">
        ${i }
      </a>
    </c:forEach>
    </td>
    <td>${deploy.deploy_person }</td>
  </tr>
</table>
<shiro:hasPermission name="deploy/add">
  <a href="../deploy/add?id=${resource.id }"><input type="button" value="增加"></a>
</shiro:hasPermission>
<shiro:hasPermission name="deploy/update">
  <a href="../deploy/update?id=${deploy.id }"><input type="button" value="修改"></a><br>
</shiro:hasPermission>
<h3>（采购）合同信息</h3><br>
<table border="1" cellspacing="0">
  <tr>
    <th>合同名称</th>
    <th>合同编号</th>
  </tr>
  <tr>
    <td>${purchaseContract.name }</td>
    <td>${purchaseContract.contract_code }</td>
  </tr>
</table>
<h3>责任人</h3><br>
<table border="1" cellspacing="0">
  <tr>
    <th>姓名</th>
    <th>电话</th>
  </tr>
  <tr>
    <td>${businesPerson.name }</td>
    <td>${businesPerson.age }</td>
  </tr>
</table>
<h3>责任人</h3><br>
<table border="1" cellspacing="0">
  <tr>
    <th>姓名</th>
    <th>电话</th>
  </tr>
  <tr>
    <td>${user.name }</td>
    <td>${user.age }</td>
  </tr>
</table>
</body>
</html>