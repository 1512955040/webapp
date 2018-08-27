<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page isELIgnored="false" %>
<%@taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>合同详细信息</title>
</head>
<body>
  <div>合同名称：<b>${purchaseContract.name }</b></div>
  <br/>
  <div>合同类型：<b>${purchaseContract.contract_type }</b></div>
  <br/>
  <div>合同编号：<b>${purchaseContract.contract_code }</b></div>
  <br/>
  <div>甲方名称：<b>${firstName }</b>&nbsp;&nbsp;&nbsp;&nbsp;乙方名称：<b>${secondName }</b></div>
  <br/>
  <div>甲方组织机构代码：<b>${purchaseContract.first_code }</b>&nbsp;&nbsp;&nbsp;乙方组织机构代码：<b>${purchaseContract.service_code }</b></div>
  <br/>
  <div>采购价格：<b>${purchaseContract.price }</b></div>
  <br/>
  <div>采购数量：<b>${purchaseContract.numbers }</b></div>
  <br/>
  <div>出厂日期：<b><fmt:formatDate value="${purchaseContract.lfactory_date }" pattern="yyyy/MM/dd"/></b></div>
  <br/>
  <div>购买日期：<b><fmt:formatDate value="${purchaseContract.purchase_date }" pattern="yyyy/MM/dd"/></b></div>
  <br/>
  <div>合同金额：<b>${purchaseContract.contract_amount }</b></div>
  <br/>
  <div>质保期：<b>${purchaseContract.warranty }月</b></div>
  <br/>
  <div>报废期：<b>${purchaseContract.retirement_date }月</b></div>
  <br/>
  <div>合同内容概述：<b>${purchaseContract.content }</b></div>
  <br/>
  <div>合同周期：<b>${purchaseContract.contract_duration }</b></div>
  <br/>
  <div>签订日期：<b><fmt:formatDate value="${purchaseContract.signing_date }" pattern="yyyy/MM/dd"/></b></div>
  <br/>
  <div>签订地点：<b>${purchaseContract.signing_place }</b></div>
  <br/>
  <div>合同电子稿：<b>${purchaseContract.electronic_copy }</b></div> 
  <br/>
  <div>备注：<b>${purchaseContract.memo }</b></div>
  <br/> 
  <div>合同创建时间：<b><fmt:formatDate value="${purchaseContract.create_time }" pattern="yyyy/MM/dd HH:mm:ss"/></b></div>
  <br/>
  <div>合同修改时间：<b><fmt:formatDate value="${purchaseContract.modify_time }" pattern="yyyy/MM/dd HH:mm:ss"/></b></div>
  <br/>
  <div>
  <shiro:hasPermission name="purchaseContract:update">
     <a href = "update?purContactId=${purchaseContract.id}"><input type = "button" value = "修改合同信息"/></a>
  </shiro:hasPermission>
  </div>
</body>
</html>