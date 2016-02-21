_checkIE();

var method = 1;
var global_code = 0;
var global_time = 60;

$(document).ready(function(){
    $("#btn_sendlogin").bind("click",function(){
        login_sendSMS();
    });

    $('select').select2();
});

function _checkIE(){
    var browser=navigator.appName; 
    var b_version=navigator.appVersion; 
    if(b_version.indexOf(';') == -1){
        return false;
    }
    var version=b_version.split(";"); 
    var trim_Version=version[1].replace(/[ ]/g,""); 
    if(browser=="Microsoft Internet Explorer" && trim_Version=="MSIE6.0") { 
        //alert("IE 6.0"); 
        _showNotAllow();
    } else if(browser=="Microsoft Internet Explorer" && trim_Version=="MSIE7.0") { 
        //alert("IE 7.0"); window.location.href="http://xxxx.com";
        _showNotAllow();
    } else if(browser=="Microsoft Internet Explorer" && trim_Version=="MSIE8.0") { 
        //alert("IE 8.0"); 
        _showNotAllow();
    } else if(browser=="Microsoft Internet Explorer" && trim_Version=="MSIE9.0") { 
        //alert("IE 9.0"); 
        _showNotAllow();
    }else{
        //your code goes here
    }
}

function _showNotAllow(){
    alert("对不起，您的浏览器版本过低，请升级IE或改用其他浏览器访问！");
    window.location = "/page/ieupdate.html";
}

function toLocation(page){
    window.location = page;
}

var url = window.location.href;

function login(i) {
    if(method == 1){
        if($("#pwd").val()==""){
            alert("登陆密码必填！");return false;
        }
    }else{
        if($("#gcode").val()==""){
            alert("动态密码必填！");return false;
        }

        if(Number($("#gcode").val())!=Number(global_code)){
            alert("动态密码错误！");return false;
        }
    }

    if($("#login_name").val()==""){
        alert("手机号码必填！");return false;
    }
    
    //判断是否记住
    if(document.getElementById("txtRememberKey").checked){
        setCookie("username",document.getElementById("login_name").value,30);
        setCookie("password",document.getElementById("pwd").value,30);
        setCookie("remember",document.getElementById("txtRememberKey").checked,30);
    }else{
        deleteCookie("username");
        deleteCookie("password");
        deleteCookie("remember");
    }
    $.ajax({ type:"POST" , url: "/role/chekuserlogin", data:{
        username:$("#login_name").val(),
        password:$("#pwd").val(),
        method:method
        }, success: function(data){
        if(data==200){
            $('#loginModal').modal('hide');
            if(i == 0){
                toLocation("/");  
            }else if(i == 2){
                var key = $("#address_s").val();
                toLocation("booking?p="+key);    
            }else{
                toLocation("booking");    
            }
            
        }else{
            alert("手机号或密码错误！");return false;
        }
    }});
}

function showlogin(i){
    //是否记住用户名，密码
    var remember = getCookie("remember");
    if (remember) {
        $("#login_name").val(getCookie("username"));
        $("#pwd").val(getCookie("password"));
        $("#txtRememberKey").attr("checked","checked");
    }
    if(i == 0){
        $("#login1").attr("onclick","login(0)");
    }else if(i == 2){
        $("#login1").attr("onclick","login(2)");
    }else{
        $("#login1").attr("onclick","login(1)");
    }
    
    $('#loginModal').modal('show');
}

function changeMethod(i){
      if(i == 1){
          $("#method1").css("display","block");$("#method2").css("display","none");
          $("#logintype1").addClass("loginactive");$("#logintype2").removeClass("loginactive");
      }else{
          $("#method2").css("display","block");$("#method1").css("display","none");
          $("#logintype2").addClass("loginactive");$("#logintype1").removeClass("loginactive");
      }
      method = i;
}

function addNumber(_idx){
        var str = '';
        for(var i = 0; i < _idx; i += 1){
        str += Math.floor(Math.random() * 10);
        }
        return str;
}

    //短信发送
    function login_sendSMS(){
        if($("#login_name").val()==""){
            alert("手机号必填！");return false;
        }
        var re = /^1\d{10}$/; 
        if (!re.test($("#login_name").val())) { 
            alert("手机号格式错误！");return false;
        }
        //生成随机6位验证码
        global_code = addNumber(6);
        console.log(global_code);
        global_time = 60;
        //发送按钮倒计时
        $("#btn_sendlogin").css("background","#ccc").html("60秒").unbind("click");
        //发送短信
        $.ajax({ type:"POST" , url: "/role/sendSMS",data:{mobile:$("#login_name").val(),code:global_code},  success: function(data){
            if(data == "200"){
                var t = setInterval(function(){
                    if(global_time == 1){
                        clearInterval(t);
                        $("#btn_sendlogin").css("background","#40BAD7").html("发送验证码");
                        $("#btn_sendlogin").bind("click",function(){
                            login_sendSMS();
                        });
                        return false;
                    }
                    global_time = global_time -1;
                    $("#btn_sendlogin").html(global_time+"秒");
                },1000);
            }
        }});
    }