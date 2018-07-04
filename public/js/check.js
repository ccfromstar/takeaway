$(function(){
    var cid = window.sessionStorage.getItem('cid');
    if(cid){
        //$('#userinfo').html('当前用户；'+window.sessionStorage.getItem('cname')+'【'+window.sessionStorage.getItem('crolename')+'】| <span id="exit"> 退出</span>');
        $("#cname").html(window.sessionStorage.getItem('cname')+'【'+window.sessionStorage.getItem('crolename')+'】');
    }else{
        window.location = '/login.html';
    }

    /*权限判断*/
    var rid = window.sessionStorage.getItem('croleid');
    var rolelist = window.sessionStorage.getItem('crolelist');

    if(rid == 1){
        $('nav').find('a').eq(2).css('display','none');
        $('nav').find('li').eq(1).css('display','none');
        $('nav').find('li').eq(2).css('display','none');
        $('nav').find('li').eq(3).css('display','none');
    }else if(rid == 2){
        $('nav').find('a').eq(2).css('display','none');
        $('nav').find('li').eq(1).css('display','none');
        $('nav').find('li').eq(2).css('display','none');
        $('nav').find('li').eq(3).css('display','none');
        $('#addorder').css('display','none');
    }else if(rid == 3){
        $('nav').find('a').eq(1).css('display','none');
        $('nav').find('li').eq(2).css('display','none');
        $('nav').find('li').eq(3).css('display','none');
    }else if(rid == 4){
        $('nav').find('li').eq(0).css('display','none');
        /*$('nav').find('li').eq(1).css('display','none');*/
       $('nav').find('a').eq(5).css('display','none');
        $('nav').find('li').eq(3).css('display','none');
    }else if(rid == 5){
        //$('nav').find('li').eq(3).css('display','none');
        $('nav').find('a').eq(10).css('display','none');
        $('nav').find('a').eq(11).css('display','none');
    }else if(rid == 7){
    	var arr1 = rolelist.split("*");
    	for(var i=0;i<arr1.length;i++){
    		console.log(arr1[i]);
    		if(arr1[i] == "0"){
    			$('nav').find('.dda').eq(i).css('display','none');
    		}
    	}
    }



    /*门店判断*/
    var store = window.sessionStorage.getItem('cstore');
    var cname = window.sessionStorage.getItem('cname');
    var url = window.location.href;
    //console.log(url);
    /*
    if(store != '-'){
        $('nav').find('a').eq(4).attr('href',"/erp/stock?p=所有&s=" + store);
    }
    if(store != '-'){
        if(url.indexOf('index') != -1){
            $('#store').val(store).attr('disabled','disabled');
            $('#k_store').val(store).attr('disabled','disabled');
            setDate(1,store);setCat(0);setCat(1);
            getDate();
        }else if(url.indexOf('putin') != -1){
            $('#k_store').val(store).attr('disabled','disabled');
            setCat(1);
            getDate();
            getStockDatebyKey(store);
        }else if(url.indexOf('stock') != -1){
            $('#k_store').val(store).attr('disabled','disabled');
            setCat(1);
            //if(url.indexOf('&s=%E6%89%80%E6%9C%89') != -1){
               // getDate();
            //}
        }else if(url.indexOf('putout') != -1){
            $('#k_store').val(store).attr('disabled','disabled');
            $('#sk_store').val(store).attr('disabled','disabled');
            setCat(0);setCat(1);
            getDate();
            getStockDate();
        }else if(url.indexOf('byday') != -1){
            $('#k_store').val(store).attr('disabled','disabled');
            setCat(1);
            filter();
        }else if(url.indexOf('bymonth') != -1){
            $('#k_store').val(store).attr('disabled','disabled');
            setCat(1);
            filter();
        }else if(url.indexOf('role') != -1){
            $('#store').val(store).attr('disabled','disabled');
            getRolebyKey(store,cname);
        }
        $('.btn_del').css('display','none');
    }else{
         if(url.indexOf('index') != -1){
            getDate();
        }else if(url.indexOf('putin') != -1){
            getDate();
            getStockDate();
        }else if(url.indexOf('stock') != -1){
           
        }else if(url.indexOf('putout') != -1){
            getDate();
            getStockDate();
        }else if(url.indexOf('byday') != -1){  
            filter();
        }else if(url.indexOf('bymonth') != -1){
            filter();
        }
    }*/

    $('#exit').bind('click',function(){
        window.sessionStorage.removeItem("cid");
        window.sessionStorage.removeItem("cname");
        window.sessionStorage.removeItem('croleid');
        window.sessionStorage.removeItem('crolename');
        window.sessionStorage.removeItem('cstore');
        window.location = '/login.html';
    });
});