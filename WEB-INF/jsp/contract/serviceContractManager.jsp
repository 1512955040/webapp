<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page isELIgnored="false" %>
<%@taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Service Contract</title>

<style type="text/css">
  .div1
  {
    border:1px solid #ccc;
    width:1000px;
    height:600px;
    margin-top:200px;
    align:center;
    margin-left:450px;
  }
</style>
</head>

<body>
<div  class = "div1">
      <div id = "title" style = "width:100%;height:10px; align:center;">服务合同管理</div><br/>
      <div id = "functionButton" style = "width:400px;height:30px; margin-right:0px;float:right;">
      <shiro:hasPermission name="serviceContract:add">
        <a href = "serviceContract/add"><input type = "button" value = "增加合同" /></a>
      </shiro:hasPermission>
        <!-- <button id = "view" name = "view">查看合同详情</button>
        <button id = "connect" name = "connect" >设置关联项目</button> -->
      </div><br/>
      <div id = "ContractList">
        <form action = "contractManager" method = "">
          <table border = "1px" width = "1000px" align = "center">
            <tr align = "center">
              <td>合同名称</td>
              <td>合同类型</td>
              <td>甲方名称</td>
              <td>乙方名称</td>
              <td>关联项目</td>
              <td>合同周期</td>
              <td>签订日期</td>
              <td>相关操作</td>
            </tr>
            
           <c:forEach items="${ serviceContract }" var="con" varStatus="loop">
              <tr align = "center">
                <td>${con.name}</td>
                <td>${con.contract_type}</td>
                <td>${firstName}</td>
                <td>${secondName[loop.count-1]}</td>
                <td>${connectProject[loop.count-1]}</td>
                <td>${con.contract_duration}</td>
                <td><fmt:formatDate value="${con.signing_date}" pattern="yyyy/MM/dd"/></td>
                <td>
                <shiro:hasPermission name="serviceContract:view">
                   <a href="serviceContract/view?serContactId=${con.id}">
                      <input type = "button" value = "查看合同详情"/>
                   </a>
                </shiro:hasPermission>
                <shiro:hasPermission name="serviceContract:addProject">
                   <a href="serviceContract/addProject?serContractId=${ con.id}">
                      <input type = "button" value = "设置关联项目"/>
                   </a>
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