<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page isELIgnored="false" %>
<%@taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>修改合同信息</title>
</head>
<body>
<div class="error"><b><p>${errMessage}</p></b></div><br/>
<form action = "update" method = "post">
	  <div>合同名称：<input type = "text" name = "name" value = "${serviceContract.name }"/>*
	                           <input type = "hidden" name = "id" value = "${serviceContract.id }"/>
	  </div>
	  <br/>
	  <div>合同类型：<input type = "text" name = "contract_type" value = "${serviceContract.contract_type }"/>(暂时只支持输入数字)</div>
	  <br/>
	  <div>合同编号：<input type = "text" name = "contract_code" value = "${serviceContract.contract_code }"/></div>
	  <br/>
	  <div>甲方名称：<b>${firstName }</b><input type = "hidden" name = "first_code" value = "${serviceContract.first_code }"/>&nbsp;&nbsp;&nbsp;&nbsp;
	              乙方名称：
	             <select name = "service_id">
                  <option value="">请选择</option>
                  <c:forEach items="${enterpriseServiceInfo }" var="i">
                    <option value="${ i.id }"  selected = "selected">${ i.name }</option>
                  </c:forEach>
                </select>
    </div>
	  <br/>
	  <div>合同金额：<input type = "text" name = "contract_amount" value = "${serviceContract.contract_amount }"/></div>
	  <br/>
	  <div>合同内容概述：<input type = "text" name = "content" value = "${serviceContract.content }"/></div>
	  <br/>
	  <div>合同周期：<input type = "text" name = "contract_duration" value = "${serviceContract.contract_duration }"/></div>
	  <br/>
	  <div>签订日期：<input type = "date" name = "signing_date" value = "${serviceContract.signing_date }"/></div>
	  <br/>
	  <div>签订地点：<input type = "text" name = "signing_place" value = "${serviceContract.signing_place }"/></div>
	  <br/>
	  <div>合同电子稿：<input type = "text" name = "electronic_copy" value = "${serviceContract.electronic_copy }"/></div>
	  <br/>
	  <div>备注：<input type = "text" name = "memo" value = "${serviceContract.memo }"/></div>
	  <br/>
	  <div>合同创建时间：<b><fmt:formatDate value="${serviceContract.create_time }" pattern="yyyy/MM/dd HH:mm:ss"/></b></div>
	  <br/>
	  <div>合同修改时间：<b><fmt:formatDate value="${serviceContract.modify_time }" pattern="yyyy/MM/dd HH:mm:ss"/></b></div>
	  <br/>
	  <div><input type = "submit" value = "保存"/>&nbsp;&nbsp;
	     <a href = "detailServiceContractInfo?serContactId=${serviceContract.id}"><input type = "button" value = "返回"/></a>
	  </div>
  </form>
</body>
</html>