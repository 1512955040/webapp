<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page isELIgnored="false" %> 
<%@taglib prefix = "functions"  uri = "http://com/ekuter/tags/functions" %>
<%@taglib prefix="shiro" uri="http://shiro.apache.org/tags" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>角色管理</title>
</head>
<body>
  <div class="error">${error}</div>

<shiro:hasPermission name="role:create">
    <a href="role/create">角色新增</a><br/>
</shiro:hasPermission><br><br>
<br><table  width = "1000px" >
    <thead>
        <tr>
            <th>角色名称</th>
            <th>角色描述</th>
            <th>拥有的资源</th>
            <th>操作</th>
        </tr>
    </thead>
    <tbody>
        <c:forEach items="${roleList}" var="role">
            <tr>
                <td width = "100px" align = "center">${role.name}</td>
                <td width = "200px" align = "center">${role.description}</td>
                <td width = "400px" align = "center">${functions:resourceNames(role.promise_ids)}</td>
                
                <c:if test="${role.type == 1 }">
	                <td width = "100px" align = "center">
	                    <shiro:hasPermission name="role:update">
	                        <a href="role/update?roleId=${role.id}">修改</a>
	                    </shiro:hasPermission>
	
	                    <shiro:hasPermission name="role:delete">
	                        <a href="role/delete?roleId=${role.id}">删除</a>
	                    </shiro:hasPermission>
                  </td>
                </c:if>   
            </tr>
        </c:forEach>
    </tbody>
</table>
</body>
</html>