<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page isELIgnored="false" %>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>供应商管理</title>
	<style type="text/css">
	  .div1
	  {
	    border:1px solid #ccc;
	    width:1500px;
	    height:600px;
	    margin-top:200px;
	    align:center;
	    margin-left:200px;
	  }
	</style>
</head>
<body>
  <div  class = "div1">
      <div id = "title" style = "width:100%;height:10px; align:center;">供应商管理</div><br/>
      <div id = "functionButton" style = "width:400px;height:30px; align:right;margin-right:0px;float:right;">
      <shiro:hasPermission name="purchase:add">
        <a href = "purchase/add"><input type = "button" value = "增加供应商" /></a>
      </shiro:hasPermission>
        <!-- <button id = "view" name = "view">查看合同详情</button>
        <button id = "connect" name = "connect" >设置关联项目</button> -->
      </div><br/>
      <div id = "SuppliersList">
        <form action = "suppliersManager" method = "">
          <table border = "1px" width = "1500px" align = "center">
            <tr align = "center">
              <td>供应商名称</td>
              <td>机构代码</td>
              <td>供应商类型</td>
              <td>企业所在地</td>
              <td>企业所在地</td>
              <td>企业法人</td>
              <td>联系电话</td>
              <td>办公电话</td>
              <td>企业网址</td>
              <td>关键字</td>
              <td>备注</td>
              <td>操作</td>
            </tr>
            
           <c:forEach items="${ enterpriseSuppliers }" var="sup" >
              <tr align = "center">
                <td>${sup.name}</td>
                <td>${sup.code_name}</td>
                <td>${sup.type}</td>
                <td>${sup.location}</td>
                <td>${sup.address}</td>
                <td>${sup.contact_person}</td>
                <td>${sup.contact_tell}</td>
                <td>${sup.office_phone}</td>
                <td>${sup.website}</td>
                <td>${sup.keyword}</td>
                <td>${sup.memo}</td>
                <td>
                <shiro:hasPermission name="purchase:update">
                   <a href="purchase/update?suppliersId=${sup.id}">修改 </a>
                </shiro:hasPermission>
                <shiro:hasPermission name="purchase:delete">
                   <a href="purchase/delete?suppliersId=${sup.id }&enterpriseId=${sup.enterprise_id}">删除 </a>
                 </shiro:hasPermission>
                </td>
              </tr>
            </c:forEach>
          </table>
        </form>
      </div>
  </div>
</body>
</html>