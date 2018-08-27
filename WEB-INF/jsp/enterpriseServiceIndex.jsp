<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page isELIgnored="false" %> 
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>服务商主页</title>
</head>
<body>
<p>已经完善的共有信息</p>
<p>${enterprise }</p>
<p>已经完善的服务商信息</p>
<p>${enterpriseService }</p>
<a href="enterprise/allInfo"><input type="button" value="修改服务商信息"></a><hr>
<a href="organization"><input type="button" value="服务商部门管理"></a><hr>
<a href="position"><input type="button" value="服务商岗位管理"></a><hr>

<a href="favoriteCategory"><input type="button" value="选择关注的分类"></a><br><hr>
<a href="favoriteCategory/showCategory"><input type="button" value="资源登记"></a><br><hr>
<a href="resourceBelong?flag=0"><input type="button" value="资源认领管理"></a><br><hr>
<!-- <a href="level"><input type="button" value="服务商岗位等级管理"></a><hr> -->
</body>
</html>