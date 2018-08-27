<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
    <%@ page isELIgnored="false" %> 
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<title>Login To Ekuter</title>
	<style>.error{color:red;}</style>
	<link rel="stylesheet" href="css/login.css" type="text/css">
</head>
<%-- <body>
	<div class="error">${error}</div>
	<form action="" method="post" value="<shiro:principal/>">
	  Admin:<input type="text" name="account" ><br>
	  Password:    <input type="password" name="password"><br>
    RememberMe:<input type="checkbox" name="rememberMe" value="true"><br/>
	              <input type="submit" value="Login">
	             <a href = "/ekuter_web/register" ><input type="button" value="Register"/></a>
	</form>
	<a href="password/findBack"><input type="button" value="忘记密码"></a>
</body> --%>
<body>
  <div id="containter" class="w">
    <div id="logo"></div>
    <div id="login-con">
      <form action="" method="post" value="<shiro:principal/>">
        <p class="login-p1">
          <span class="userImg"></span>
            <input type="text" class="login-user login-input" placeholder="用户名" name="account" autocomplete="off">
        </p>
          <span class="userError error"></span>
        <p class="login-p2">
          <span class="passImg"></span>
           <input type="password" class="login-pass login-input" placeholder="密码" name="password" autocomplete="off">
        </p>
        <!--<span class="pwdError error"></span>-->
        <!--<span class="elseError error"></span>-->
        <p class="login-p3">
            <span class="login-p3-tip" name="jcaptchaCode">请输入验证码</span>
            <img class="login-check" src="ekuter_web/jcaptcha.jpg" title="点击更换验证码">
            <span><a class="login-p3-change" href="javascript:;">换一张</a></span>
        </p>
        <p class="login-p4">
          <input type="checkbox" name="rememberMe" value="true">
          <span class="login-p4-left">两周内自动登录</span>
          <span class="login-p4-right">忘记密码?</span>
        </p>
        <p class="login-p5"><input type="submit" ></p>
        <p class="login-p6"><span>立即注册</span></p>
      </form>
      
    </div>
  </div>

  <script src="../js/compentJS/jquery.min.js" type="text/javascript"></script>

    <script>
    $(function() {
        $(".login-check").click(function() {
            $(".login-p3-change").attr("src", 'ekuter_web/jcaptcha.jpg?'+new Date().getTime());
        });
        });
    </script>
</body>
</html>