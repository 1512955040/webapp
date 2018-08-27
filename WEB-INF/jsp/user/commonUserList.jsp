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
<title>用户管理</title>
</head>
<body>
  <div class="error">${error}</div>

<shiro:hasPermission name="user:create">
    <a href="user/create">用户新增</a><br/>
</shiro:hasPermission><br><br>
<br><table  width = "1000px" >
    <thead>
        <tr>
            <th>用户名称</th>
            <th>所属部门</th>
            <th>角色</th>      
            <th>操作</th>
        </tr>
    </thead>
    <tbody>
        <c:forEach items="${commonUserList}" var="comUser">
            <tr>
                <td width = "100px" align = "center">${comUser.user_name}</td>
                <td width = "200px" align = "center">${functions:deptName(comUser.os_id)}</td>
                <td width = "400px" align = "center">${functions:roleName(comUser.role_id)}</td> 
                <c:if test="${comUser.flag == 0 }">
                <td width = "200px" align = "center">
                    <shiro:hasPermission name="user:update">
                        <a href="user/update?userId=${comUser.id}">修改</a>
                    </shiro:hasPermission>

                    <shiro:hasPermission name="user:delete">
                        <a href="user/delete?userId=${comUser.id}">删除</a>
                    </shiro:hasPermission>
                    
                    <shiro:hasPermission name="user:freeze">
                        <a href="user/freeze?userId=${comUser.id}">冻结账号</a>
                    </shiro:hasPermission>
                    
                    <shiro:hasPermission name="user:resetPwd">
                      <a href="user/updateCommonUserPassword?userId=${comUser.id }">重置密码</a>
                    </shiro:hasPermission>
                </td>
                </c:if>
            </tr>
        </c:forEach>
    </tbody>
</table>
</body>
</html>