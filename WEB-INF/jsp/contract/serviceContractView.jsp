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
  <div>合同名称：<b>${serviceContract.name }</b></div>
  <br/>
  <div>合同类型：<b>${serviceContract.contract_type }</b></div>
  <br/>
  <div>合同编号：<b>${serviceContract.contract_code }</b></div>
  <br/>
  <div>甲方名称：<b>${firstName }</b>&nbsp;&nbsp;&nbsp;&nbsp;乙方名称：<b>${secondName }</b></div>
  <br/>
  <div>甲方组织机构代码：<b>${serviceContract.first_code }</b>&nbsp;&nbsp;&nbsp;乙方组织机构代码：<b>${serviceContract.service_code }</b></div>
  <br/>
  <div>合同金额：<b>${serviceContract.contract_amount }</b></div>
  <br/>
  <div>合同内容概述：<b>${serviceContract.content }</b></div>
  <br/>
  <div>合同周期：<b>${serviceContract.contract_duration }</b></div>
  <br/>
  <div>签订日期：<b><fmt:formatDate value="${serviceContract.signing_date }" pattern="yyyy/MM/dd"/></b></div>
  <br/>
  <div>签订地点：<b>${serviceContract.signing_place }</b></div>
  <br/>
  <div>合同电子稿：<b>${serviceContract.electronic_copy }</b></div>
  <br/>
  <div>备注：<b>${serviceContract.memo }</b></div>
  <br/>
  <div>合同创建时间：<b><fmt:formatDate value="${serviceContract.create_time }" pattern="yyyy/MM/dd HH:mm:ss"/></b></div>
  <br/>
  <div>合同修改时间：<b><fmt:formatDate value="${serviceContract.modify_time }" pattern="yyyy/MM/dd HH:mm:ss"/></b></div>
  <br/>
  <div><a href = "update?serContactId=${serviceContract.id}"><input type = "button" value = "修改合同信息"/></a>&nbsp;&nbsp;
     <a href = "serviceContractManager"><input type = "button" value = "返回"/></a>
  </div>
</body>
</html>