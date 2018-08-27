<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page isELIgnored="false" %>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>供应商信息查看</title>
</head>
<body>                     
    厂商名称：${enterpriseSuppliers.name }<br>                                             
    厂商代码：${enterpriseSuppliers.code_name }<br>
    厂商类型：${enterpriseSuppliers.type}<br>
    所在地：${enterpriseSuppliers.location }<br>
    地址：${enterpriseSuppliers.address }<br>
    联系人：${enterpriseSuppliers.contact_person }<br>
    联系电话：${enterpriseSuppliers.contact_tell }<br>
    办公电话：${enterpriseSuppliers.office_phone }<br>
    网址：${enterpriseSuppliers.website }<br>
    关键字：${enterpriseSuppliers.keyword }<br>
    备注：${enterpriseSuppliers.memo }<br>
    <a href = "suppliersInfoEdit?suppliersId=${ enterpriseSuppliers.id}"><input type="button"  value="修改"></a>
    <a href = "suppliersManager?enterpriseId=${enterpriseSuppliers.enterprise_id }"><input type="button" value="返回管理页面"></a>
</body>
</html>