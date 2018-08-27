<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page isELIgnored="false" %>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>增加购买合同</title>
</head>
<body>
<div class="error"><b><p>${errMessage}</p></b></div><br/>
增加供销合同
<form action="add" method="post">
合同名称：<input type = "text" name = "name" value = "${purchaseContract.name }"/>*<br/><br/>
合同类型：<input type = "text" name = "contract_type"  value = "${purchaseContract.contract_type }"/>(暂时只支持输入数字)<br><br/>
合同编号：<input type = "text" name = "contract_code" value = "${purchaseContract.contract_code }"/><br><br/>
甲方名称：${firstName}(默认当前企业)
                <input type = "hidden" name = "first_code" value = "${purchaseContract.first_code }"/>
乙方名称：<select name = "service_id">
                  <option value="">请选择</option>
                  <c:forEach items="${enterpriseSuppliersInfo }" var="i">
                    <option value="${ i.id }">${ i.name }</option>
                  </c:forEach>
                </select><br><br/>
                <%-- <input type = "hidden" name = "service_code" value = "${serviceContract.service_code }"/> --%>
采购价格：<input type = "text" name = "price" value = "${purchaseContract.price }" /><br><br/>
采购数量：<input type = "text" name = "numbers" value = "${purchaseContract.numbers }" /><br><br/>
出厂日期：<input type = "date" name = "lfactory_date" value = "${purchaseContract.lfactory_date }" /><br><br/>
购买日期：<input type = "date" name = "purchase_date" value = "${purchaseContract.purchase_date }" /><br><br/>
质保期：<input type = "text" name = "warranty" value = "${purchaseContract.warranty }" />月<br><br/>
报废期：<input type = "text" name = "retirement_date" value = "${purchaseContract.retirement_date }" />月<br><br/>
合同金额：<input type = "text" name = "contract_amount" value = "${purchaseContract.contract_amount }" /><br><br/>
合同内容概述：<input type = "text" name = "content" value = "${purchaseContract.content }" /><br><br/>
合同周期：<input type = "text" name = "contract_duration" value = "${purchaseContract.contract_duration }" /><br><br/>
签订日期：<input type = "date" name = "signing_date" value = "${purchaseContract.signing_date }"/><br><br/>
签订地点：<input type = "text" name = "signing_place"  value = "${purchaseContract.signing_place }"/><br><br/>
合同电子稿：<input type = "text" name = "electronic_copy"  value = "${purchaseContract.electronic_copy }"/><br><br/>
备注：<textarea rows = "3" cols = "20" name = "memo"></textarea><br><br/>
<input type = "submit" value = "保存">
<input type = "reset" value = "重置">
</form>
</body>
</html>
<!-- 
8.    合同信息
a.    合同类型
b.    合同编号*
c.    合同名称*
d.    甲方
e.    乙方
f.    合同金额
g.    合同内容概述【模板式】
h.    合同周期
i.    签订日期
j.    签订地点
k.    合同电子稿
l.    备注

 -->

