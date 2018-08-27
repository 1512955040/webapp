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
	  <div>合同名称：<input type = "text" name = "name" value = "${purchaseContract.name }"/>*
	                           <input type = "hidden" name = "id" value = "${purchaseContract.id }"/>
	  </div>
	  <br/>
	  <div>合同类型：<input type = "text" name = "contract_type" value = "${purchaseContract.contract_type }"/>(暂时只支持输入数字)</div>
	  <br/>
	  <div>合同编号：<input type = "text" name = "contract_code" value = "${purchaseContract.contract_code }"/></div>
	  <br/>
	  <div>甲方名称：<b>${firstName }</b><input type = "hidden" name = "first_code" value = "${purchaseContract.first_code }"/>&nbsp;&nbsp;&nbsp;&nbsp;
	              乙方名称：
	             <select name = "service_id">
                  <option value="">请选择</option>
                  <c:forEach items="${enterpriseSuppliersInfo }" var="i">
                    <option value="${ i.id }"  selected = "selected">${ i.name }</option>
                  </c:forEach>
                </select>
    </div>
	  <br/>
	  <div>采购价格：<input type = "text" name = "price" value = "${purchaseContract.price}"/></div>
	  <br/>
	  <div>采购数量：<input type = "text" name = "numbers" value = "${purchaseContract.numbers}"/></div>
	  <br/>
	  <div>出厂日期：<input type = "date" name = "lfactory_date" value = "${purchaseContract.lfactory_date}"/></div>
	  <br/>
	  <div>购买日期：<input type = "date" name = "purchase_date" value = "${purchaseContract.purchase_date}"/></div>
	  <br/>
	  <div>质保期：<input type = "text" name = "warranty" value = "${purchaseContract.warranty}"/>月</div>
	  <br/>
	  <div>报废期：<input type = "text" name = "retirement_date" value = "${purchaseContract.retirement_date }"/>月</div>
	  <br/>
	  <div>合同金额：<input type = "text" name = "contract_amount" value = "${purchaseContract.contract_amount }"/></div>
	  <br/>
	  <div>合同内容概述：<input type = "text" name = "content" value = "${purchaseContract.content }"/></div>
	  <br/>
	  <div>合同周期：<input type = "text" name = "contract_duration" value = "${purchaseContract.contract_duration }"/></div>
	  <br/>
	  <div>签订日期：<input type = "date" name = "signing_date" value = "${purchaseContract.signing_date }"/></div>
	  <br/>
	  <div>签订地点：<input type = "text" name = "signing_place" value = "${purchaseContract.signing_place }"/></div>
	  <br/>
	  <div>合同电子稿：<input type = "text" name = "electronic_copy" value = "${purchaseContract.electronic_copy }"/></div>
	  <br/>
	  <div>备注：<input type = "text" name = "memo" value = "${purchaseContract.memo }"/></div>
	  <br/>
	  <div>合同创建时间：<b><fmt:formatDate value="${purchaseContract.create_time }" pattern="yyyy/MM/dd HH:mm:ss"/></b></div>
	  <br/>
	  <div>合同修改时间：<b><fmt:formatDate value="${purchaseContract.modify_time }" pattern="yyyy/MM/dd HH:mm:ss"/></b></div>
	  <br/>
	  <div><input type = "submit" value = "保存"/>&nbsp;&nbsp;
	     <a href = "detailPurchaseContractInfo?purContactId=${purchaseContract.id}"><input type = "button" value = "返回"/></a>
	  </div>
  </form>
</body>
</html>