_checkIE();

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

$(function(){
    $('.group-item').hover(function(){
        $(this).addClass('divOver');        
    },function(){
        $(this).removeClass('divOver'); 
    });

    $('.g-item').hover(function(){
        $(this).addClass('divOver');        
    },function(){
        $(this).removeClass('divOver'); 
    });

    if(url.indexOf("address")!=-1){
        $('.clockpicker').clockpicker();
    }
});