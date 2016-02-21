/**
 * @author xiao
 * 功能:javascript代码.用于对Cookie进行操作.    其中主要有3个方法
 *    setCookie,创建一个新的ookie.
 *        第一个参数为cookie变量名.
 *        第二个参数为cookie值.
 *        第三个参数为过期时间.当为number数值类型时.解析为过期日期.当为非数字类型时.解析为时间.
 *        第四个糁为为cookie所在的路径.默认为根录."\"
 *    getCookie 接收一个cookie名.返回cookie值
 *    deketeCookie接收一个cookie名.删除指定cookie
 *
 *
 */

// utility function called by getCookie( )

/*
 function getCookieVal(offset) {

 var endstr = document.cookie.indexOf (";", offset);

 if (endstr == -1) {
 endstr = document.cookie.length;
 }

 return unescape(document.cookie.substring(offset, endstr));

 }

 */
// primary function to retrieve cookie by name

function getCookie(name) {
    /*

     var arg = name + "=";
     var alen = arg.length;
     var clen = document.cookie.length;
     var i = 0;
     while (i < clen) {
     var j = i + alen;
     if (document.cookie.substring(i, j) == arg) {
     return getCookieVal(j);
     }
     i = document.cookie.indexOf(" ", i) + 1;
     if (i == 0) break;
     }

     */
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1, c.length);
        }
        if (c.indexOf(nameEQ) == 0) {
            return unescape(c.substring(nameEQ.length, c.length));
        }
    }
    return null;
}


// store cookie value with optional details as needed

function setCookie(name, value, expires, path, domain, secure) {
    if (expires) {
        if (typeof expires == "number") {
            expires = getExpDate(expires, 0, 0)
        }
        else {
            expires = expires.toGMTString;
        }
    }

    if (!path) {
        path = "/";
    }
    /*


     alert(name + " = " + escape (value) +

     ((expires) ? "; expires=" + expires : "") +

     ((path) ? "; path=" + path : "") +

     ((domain) ? "; domain=" + domain : "") +

     ((secure) ? "; secure" : ""));

     */


    document.cookie = name + " = " + escape(value) +

        ((expires) ? "; expires=" + expires : "") +

        ((path) ? "; path=" + path : "") +

        ((domain) ? "; domain=" + domain : "") +

        ((secure) ? "; secure" : "");

}


// remove the cookie by setting ancient expiration date

function deleteCookie(name, path, domain) {

    setCookie(name, "", -1);

}


function getExpDate(days, hours, minutes) {

    var expDate = new Date();

    if (typeof days == "number" && typeof hours == "number" &&

        typeof hours == "number") {

        expDate.setDate(expDate.getDate() + parseInt(days));

        expDate.setHours(expDate.getHours() + parseInt(hours));

        expDate.setMinutes(expDate.getMinutes() + parseInt(minutes));

        return expDate.toGMTString();

    }
}


