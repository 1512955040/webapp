<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page isELIgnored="false" %>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>增加供应商</title>
</head>
<body>
增加供应商
<c:forEach items="${errors }" var="i">
  <li>${i }</li>
</c:forEach>
<form action="add" method="post">                                               
厂商名称：<input type="text" name="name" value="${enterpriseSuppliers.name }">*<br>                                             
厂商代码：<input type="text" name="code_name" value="${enterpriseSuppliers.code_name }">*<br>
厂商类型：<select name="type">
        <option value="">请选择</option>
        <option value="13">生产厂商</option>
        <option value="14">销售厂商</option>
        <option value="15">系统集成厂商</option>
        <option value="16">运维厂商</option>
      </select><br>
所在地：<input type="text" name="location" value="${enterpriseSuppliers.location }"><br>
地址：<input type="text" name="address" value="${enterpriseSuppliers.address }"><br>
联系人：<input type="text" name="contact_person" value="${enterpriseSuppliers.contact_person }"><br>
联系电话：<input type="text" name="contact_tell" value="${enterpriseSuppliers.contact_tell }"><br>
办公电话：<input type="text" name="office_phone" value="${enterpriseSuppliers.office_phone }"><br>
网址：<input type="text" name="website" value="${enterpriseSuppliers.website }"><br>
关键字：<input type="text" name="keyword" value="${enterpriseSuppliers.keyword }"><br>
备注：<textarea rows="" cols="" name="memo"></textarea><br>
<input type="submit" value="保存">
<input type="reset" value="重置"> 
</form>
</body>
<!-- 
  private Long id;
  private Long enterprise_id;
  private String name;
  private String code_name;
  private Integer type;
  private String location;
  private String address;
  private String contact_person;
  private String contact_tell;
  private String office_phone;
  private String website;
  private String keyword;
  private String memo;
 -->
</html>