var mysql,LIMIT,ejsExcel,fs;
    mysql = require('./db');
    LIMIT = 5;
    ejsExcel = require("./ejsExcel");
    fs = require("fs");

exports.sqldo = function (req, res) {
    var _sql = req.params.sql;
    if(_sql == "setinfo"){sql_setinfo(req,res);}
    else if(_sql == "toExcel"){sql_toExcel(req,res);}
    else if(_sql == "toExcelm"){sql_toExcelm(req,res);}
    else if(_sql == "toExcely"){sql_toExcely(req,res);}
    else if(_sql == "toExcelz"){sql_toExcelz(req,res);}
    else if(_sql == "getleft"){sql_getleft(req,res);}
    else if(_sql == "getleft_m"){sql_getleft_m(req,res);}
    else if(_sql == "getright"){sql_getright(req,res);}
    else if(_sql == "getrightbottom"){sql_getrightbottom(req,res);}
};

exports.sql_list = function (req, res) {
    var _info = req.session.infor;
    req.session.infor = null;

    var myDate = new Date();
    var y = myDate.getFullYear(); 
    var m = (((myDate.getMonth()+1)+"").length==1)?"0"+(myDate.getMonth()+1):(myDate.getMonth()+1);
    var d = (((myDate.getDate())+"").length==1)?"0"+(myDate.getDate()):(myDate.getDate());
    var bookingno = y+m+d;
    var bookingdate = y+"-"+m+"-"+d;

    var page = parseInt(req.query.p);
    var key = req.query.key;
    var bd = req.query.bd;
    key = key?key:bookingno;
    bookingdate =  bd?bd:bookingdate;
    page = (page && page > 0) ? page : 1;
    var limit = (limit && limit > 0) ? limit : LIMIT;
    var sql1 = "select * from v_com_booking where date1 like '"+bd+"' limit "+(page-1)*limit+","+limit;
    var sql5 = "select count(*) as count from v_com_booking where date1 like '"+bd+"'";
    mysql.query(sql1,function (err, rows1) {
        if(err){console.log(err);return false;}
          mysql.query(sql5,function (err1, rows5) {
            if(err1){console.log(err1);return false;}
            var total = rows5[0].count;
            var totalpage = Math.ceil(total/limit);
            var isFirstPage = page == 1 ;
            var isLastPage = ((page -1) * limit + rows1.length) == total;
            for(var i in rows1){
            	rows1[i].date2 = (rows1[i].date2).Format("yyyy-MM-dd hh:mm:ss");
            }
            res.render('cms/finance_d', {bookingdate:bookingdate,url:req.url,record:rows1,page:page,total:total,totalpage:totalpage,isFirstPage:isFirstPage,isLastPage:isLastPage,info:_info});
          });
    });
};

exports.sql_list_z = function (req,res){
    var _info = req.session.infor;
    req.session.infor = null;

    var myDate = new Date();
    var y = myDate.getFullYear(); 
    var m = (((myDate.getMonth()+1)+"").length==1)?"0"+(myDate.getMonth()+1):(myDate.getMonth()+1);
    var d = (((myDate.getDate())+"").length==1)?"0"+(myDate.getDate()):(myDate.getDate());
    var bookingno = y+m+d;
    var bookingdate = y+"-"+m+"-"+d;

    var page = parseInt(req.query.p);
    var key = req.query.key;
    var key_end = req.query.key_end;
    var bd = req.query.bd;
    var bd_end = req.query.bd_end;
    key = key?key:bookingno;
    var bookingdate_end = bd_end?bd_end:bookingdate;
    var dat = new Date(bookingdate_end);
    var time=dat.getTime();
    time+=1000*60*60*24*1;
    dat.setTime(time);
    var d_y = dat.getFullYear(); 
    var d_m = (((dat.getMonth()+1)+"").length==1)?"0"+(dat.getMonth()+1):(dat.getMonth()+1);
    var d_d = (((dat.getDate())+"").length==1)?"0"+(dat.getDate()):(dat.getDate());
    key_end = d_y+d_m+d_d;
    //key_end = key_end?key_end:bookingno;

    bookingdate =  bd?bd:bookingdate;
    
    page = (page && page > 0) ? page : 1;
    var limit = (limit && limit > 0) ? limit : 10;
    var sql1 = "select * from booking where bookingno > '"+key+"' and bookingno < '"+key_end+"' limit "+(page-1)*limit+","+limit;
    var sql5 = "select count(*) as count from booking where bookingno > '"+key+"' and bookingno < '"+key_end+"'";
    console.log(sql1);
    mysql.query(sql1,function (err, rows1) {
        if(err){console.log(err);return false;}
          mysql.query(sql5,function (err1, rows5) {
            if(err1){console.log(err1);return false;}
            var total = rows5[0].count;
            var totalpage = Math.ceil(total/limit);
            var isFirstPage = page == 1 ;
            var isLastPage = ((page -1) * limit + rows1.length) == total;
            res.render('cms/finance_z', {bookingdate:bookingdate,bookingdate_end:bookingdate_end,url:req.url,record:rows1,page:page,total:total,totalpage:totalpage,isFirstPage:isFirstPage,isLastPage:isLastPage,info:_info});
          });
    });
}

function sql_setinfo(req, res) {
    var id = req.param('id');
    var Sql1 = "update booking set makeout = '已确认' where id = "+id;
    mysql.query(Sql1 ,function(error,obj){
          if(error){console.log(error);return false;}
          req.session.infor = "确认收款成功！";
          res.send("200");
    });
};

function sql_toExcel(req, res){
    var key = req.param('id');
    //获得Excel模板的buffer对象
    var exlBuf = fs.readFileSync("./public/excelop/template/finance_d.xlsx");
    var myDate = new Date();
    var y = myDate.getFullYear(); 
    var m = (((myDate.getMonth()+1)+"").length==1)?"0"+(myDate.getMonth()+1):(myDate.getMonth()+1);
    var d = myDate.getDate(); 
    var hh = myDate.getHours();
    var mm = myDate.getMinutes();
    var ss = myDate.getSeconds();
    var excelname = "~"+y+m+d+hh+mm+ss+".xlsx"
    //数据源
    var sql1 = "select * from booking where bookingno like '"+key+"%'";
    mysql.query(sql1 ,function(error,obj){
        if(error){console.log(error);return false;} 
        //用数据源(对象)data渲染Excel模板
        ejsExcel.renderExcelCb(exlBuf, obj, function(exlBuf2){
            fs.writeFileSync("./public/excelop/temp/"+excelname, exlBuf2);
            res.send(excelname);
        });
    });
}

function sql_toExcelz(req, res){
    var key = req.param('id');
    //获得Excel模板的buffer对象
    var exlBuf = fs.readFileSync("./public/excelop/template/finance_d.xlsx");
    var myDate = new Date();
    var y = myDate.getFullYear(); 
    var m = (((myDate.getMonth()+1)+"").length==1)?"0"+(myDate.getMonth()+1):(myDate.getMonth()+1);
    var d = myDate.getDate(); 
    var hh = myDate.getHours();
    var mm = myDate.getMinutes();
    var ss = myDate.getSeconds();
    var excelname = "~"+y+m+d+hh+mm+ss+".xlsx"

    var bookingdate_end = req.param('id_end');
    var dat = new Date(bookingdate_end);
    var time=dat.getTime();
    time+=1000*60*60*24*1;
    dat.setTime(time);
    var d_y = dat.getFullYear(); 
    var d_m = (((dat.getMonth()+1)+"").length==1)?"0"+(dat.getMonth()+1):(dat.getMonth()+1);
    var d_d = (((dat.getDate())+"").length==1)?"0"+(dat.getDate()):(dat.getDate());
    key_end = d_y+d_m+d_d;
    //数据源
    var sql1 = "select * from booking where bookingno > '"+key+"' and  bookingno < '"+key_end+"'";
    console.log(sql1);
    mysql.query(sql1 ,function(error,obj){
        if(error){console.log(error);return false;} 
        //用数据源(对象)data渲染Excel模板
        ejsExcel.renderExcelCb(exlBuf, obj, function(exlBuf2){
            fs.writeFileSync("./public/excelop/temp/"+excelname, exlBuf2);
            res.send(excelname);
        });
    });
}

function sql_getleft(req,res){
    var key = req.param('id');
    var key1 = req.param('_yesterday');
    var sql1 = "select * from menu_booking where bookingno like '"+key+"%'";
    var sql3 = "select * from menu_booking where bookingno like '"+key1+"%'";
    mysql.query(sql1 ,function(error,obj){
    if(error){console.log(error);return false;} 
    mysql.query(sql3 ,function(error3,obj3){
    if(error3){console.log(error3);return false;} 
        var sql2 = "select name from menu";
        mysql.query(sql2 ,function(error2,obj2){
            if(error2){console.log(error2);return false;} 
            var arr1 = new Array();
            var arr_yd_y = new Array(); //昨天
            var arr_yd = new Array();
            var arr_jd = new Array();
            var arr_total = new Array();
            for(var i in obj2){
                arr1.push(obj2[i].name);
                arr_yd.push(0);
                arr_jd.push(0);
                arr_total.push(0);
                arr_yd_y.push(0);
            }
            for(var i in obj){
                for(var j=0;j<arr1.length;j++ ){
                    if(obj[i].name == arr1[j] && obj[i].type=="预定"){
                        arr_yd[j] = Number(arr_yd[j])+obj[i].num;
                    }else if(obj[i].name == arr1[j] && obj[i].type=="即点"){
                        arr_jd[j] = Number(arr_jd[j])+obj[i].num;
                        arr_total[j] = Number(arr_total[j])+obj[i].num;
                    }
                }
            }
            for(var i in obj3){
                for(var j=0;j<arr1.length;j++ ){
                    if(obj3[i].name == arr1[j] && obj3[i].type=="预定"){
                        arr_yd_y[j] = Number(arr_yd_y[j])+obj3[i].num;
                        arr_total[j] = Number(arr_total[j])+obj3[i].num;
                    }
                }
            }
            var _o = {
                name:arr1,
                ydy:arr_yd_y,
                yd:arr_yd,
                jd:arr_jd,
                total:arr_total
            }
            res.send(_o);
        });
    });
    });
}

function sql_getleft_m(req,res){
    var key = req.param('id');
    var sql1 = "select * from menu_booking where bookingno like '"+key+"%'";
    mysql.query(sql1 ,function(error,obj){
        if(error){console.log(error);return false;} 
        var sql2 = "select name from menu";
        mysql.query(sql2 ,function(error2,obj2){
            if(error2){console.log(error2);return false;} 
            var arr1 = new Array();
            var arr_yd = new Array();
            var arr_jd = new Array();
            var arr_total = new Array();
            for(var i in obj2){
                arr1.push(obj2[i].name);
                arr_yd.push(0);
                arr_jd.push(0);
                arr_total.push(0);
            }
            for(var i in obj){
                for(var j=0;j<arr1.length;j++ ){
                    if(obj[i].name == arr1[j] && obj[i].type=="预定"){
                        arr_yd[j] = Number(arr_yd[j])+obj[i].num;
                    }else if(obj[i].name == arr1[j] && obj[i].type=="即点"){
                        arr_jd[j] = Number(arr_jd[j])+obj[i].num;
                    }
                    if(obj[i].name == arr1[j]){
                        arr_total[j] = Number(arr_total[j])+obj[i].num;
                    }
                }
            }
            var _o = {
                name:arr1,
                yd:arr_yd,
                jd:arr_jd,
                total:arr_total
            }
            res.send(_o);
        });
    });
}

function sql_getright(req,res){
    var key = req.param('id');
    var key1 = req.param('_tomorrow');
    var sql1 = "select * from booking where sendtime like '"+key+"%'";
    console.log(sql1);
    var sql2 = "select * from booking where sendtime like '"+key1+"%'";
    mysql.query(sql1 ,function(error,obj){
        if(error){console.log(error);return false;} 
        mysql.query(sql2 ,function(error2,obj2){
        if(error2){console.log(error2);return false;} 
            var arr1 = "微信,支付宝,货到付款应收,货到付款实收".split(",");
            var arr_yd = "0,0,0,0".split(",");
            var arr_ydtm = "0,0,0,0".split(",");

            for(var i in obj){
                    if(obj[i].paytype == "货到付款"){
                        arr_yd[2] = Number(arr_yd[2])+obj[i].pricetotal;
                        if(obj[i].makeout == "已确认"){
                            arr_yd[3] = Number(arr_yd[3])+obj[i].pricetotal;
                        }
                    }else if(obj[i].paytype == "微信"){
                        arr_yd[0] = Number(arr_yd[0])+obj[i].pricetotal;
                    }else if(obj[i].paytype == "支付宝"){
                        arr_yd[1] = Number(arr_yd[1])+obj[i].pricetotal;
                    }
            }

            for(var i in obj2){
                    if(obj2[i].paytype == "货到付款"){
                        arr_ydtm[2] = Number(arr_ydtm[2])+obj2[i].pricetotal;
                        if(obj2[i].makeout == "已确认"){
                            arr_ydtm[3] = Number(arr_ydtm[3])+obj2[i].pricetotal;
                        }
                    }else if(obj2[i].paytype == "微信"){
                        arr_ydtm[0] = Number(arr_ydtm[0])+obj2[i].pricetotal;
                    }else if(obj2[i].paytype == "支付宝"){
                        arr_ydtm[1] = Number(arr_ydtm[1])+obj2[i].pricetotal;
                    }
            }

            var _o = {
                name:arr1,
                yd:arr_yd,
                ydtm:arr_ydtm
            }
            res.send(_o);
        });
    });
}

function sql_getrightbottom(req,res){
    var key = req.param('id');
    var sql1 = "select * from booking where sendtime like '"+key+"%'";
    mysql.query(sql1 ,function(error,obj){
        if(error){console.log(error);return false;} 
            var ys = 0;
            var ss = 0;
            
            for(var i in obj){
                ys = ys + Number(obj[i].pricetotal);
                if(obj[i].paytype == "货到付款"){
                    if(obj[i].makeout == "已确认"){
                        ss = ss + Number(obj[i].pricetotal);
                    }
                }else{
                    ss = ss + Number(obj[i].pricetotal);
                }
                
            }
            var _o = {
                ys:ys,
                ss:ss
            }
            res.send(_o);
    });
}

exports.sql_list_m = function (req, res) {
    var _info = req.session.infor;
    req.session.infor = null;

    var myDate = new Date();
    var y = myDate.getFullYear(); 
    var m = (((myDate.getMonth()+1)+"").length==1)?"0"+(myDate.getMonth()+1):(myDate.getMonth()+1);
    var d = (((myDate.getDate())+"").length==1)?"0"+(myDate.getDate()):(myDate.getDate());
    var bookingno = y+m+d;
    var bookingdate = y+"-"+m;

    var page = parseInt(req.query.p);
    var key = req.query.key;
    var bd = req.query.bd;
    key = key?key:bookingno;
    bookingdate =  bd?bd:bookingdate;
    page = (page && page > 0) ? page : 1;
    var limit = (limit && limit > 0) ? limit : LIMIT;
    var sql1 = "select * from v_com_booking where date1 like '"+bd+"%' limit "+(page-1)*limit+","+limit;
    var sql5 = "select count(*) as count from v_com_booking where date1 like '"+bd+"%'";
    mysql.query(sql1,function (err, rows1) {
        if(err){console.log(err);return false;}
          mysql.query(sql5,function (err1, rows5) {
            if(err1){console.log(err1);return false;}
            var total = rows5[0].count;
            var totalpage = Math.ceil(total/limit);
            var isFirstPage = page == 1 ;
            var isLastPage = ((page -1) * limit + rows1.length) == total;
            for(var i in rows1){
            	rows1[i].date2 = (rows1[i].date2).Format("yyyy-MM-dd hh:mm:ss");
            }
            res.render('cms/finance_m', {bookingdate:bookingdate,url:req.url,record:rows1,page:page,total:total,totalpage:totalpage,isFirstPage:isFirstPage,isLastPage:isLastPage,info:_info});
          });
    });
};

exports.sql_list_y = function (req, res) {
    var _info = req.session.infor;
    req.session.infor = null;
    var key = req.query.key;
    var bd = req.query.bd;

    var myDate = new Date();
    var y = myDate.getFullYear(); 
    var m = (((myDate.getMonth()+1)+"").length==1)?"0"+(myDate.getMonth()+1):(myDate.getMonth()+1);
    var d = myDate.getDate(); 
    var bookingno = y;
    var bookingdate = y;
    key = key ? key:bookingno;
    bookingdate = bd ? bd:bookingdate;
    var sql1 = "select bookingno,numtotal,type,pricetotal,paytype from booking where bookingno like '"+key+"%'";
    mysql.query(sql1 ,function(error,obj){
        if(error){console.log(error);return false;} 
        //得到所选月份的所有订单,按月份来计算数据
        var bookingnno,m,_day,num_1,num_2,num_3,num_4,num_5,num_6,num_7,num_8,num_9;
        for(var i=1;i<13;i++){
            if(!_day){
                _day=i;
                num_1="0";num_2="0";num_3="0";num_4="0";num_5="0";num_6="0";num_7="0";num_8="0";num_9="0";
            }else{
                _day = _day + "," +i;
                num_1 = num_1 + ",0";
                num_2 = num_2 + ",0";
                num_3 = num_3 + ",0";
                num_4 = num_4 + ",0";
                num_5 = num_5 + ",0";
                num_6 = num_6 + ",0";
                num_7 = num_7 + ",0";
                num_8 = num_8 + ",0";
                num_9 = num_9 + ",0";
            }
        }
        _day = _day.split(",");
        num_1 = num_1.split(",");
        num_2 = num_2.split(",");
        num_3 = num_3.split(",");
        num_4 = num_4.split(",");
        num_5 = num_5.split(",");
        num_6 = num_6.split(",");
        num_7 = num_7.split(",");
        num_8 = num_8.split(",");
        num_9 = num_9.split(",");
        for(var i in obj){
            for(var j=0;j<_day.length;j++){
                bookingnno = obj[i].bookingno;
                m = Number(bookingnno.substring(4,6));
                if(m == Number(_day[j])){
                    if(obj[i].type == "预定"){
                        num_1[j] = Number(num_1[j]) + Number(obj[i].numtotal);
                        num_2[j] = Number(num_2[j]) + Number(obj[i].pricetotal);
                    }else{
                        num_3[j] = Number(num_3[j]) + Number(obj[i].numtotal);
                        num_4[j] = Number(num_4[j]) + Number(obj[i].pricetotal);
                    }
                    if(obj[i].paytype == "微信"){
                        num_5[j] = Number(num_5[j]) + Number(obj[i].pricetotal);
                    }else if(obj[i].paytype == "支付宝"){
                        num_6[j] = Number(num_6[j]) + Number(obj[i].pricetotal);
                    }else{
                        num_7[j] = Number(num_7[j]) + Number(obj[i].pricetotal);
                    }
                    num_8[j] = Number(num_8[j]) + Number(obj[i].numtotal);
                    num_9[j] = Number(num_9[j]) + Number(obj[i].pricetotal);
                }
            }
        }
        res.render('cms/finance_y', {bookingdate:bookingdate,url:req.url,num_1:num_1,num_2:num_2,num_3:num_3,num_4:num_4,num_5:num_5,num_6:num_6,num_7:num_7,num_8:num_8,num_9:num_9});
    });
};

Date.prototype.Format = function(fmt) {
	var d = this;
	var o = {
		"M+": d.getMonth() + 1, //月份
		"d+": d.getDate(), //日
		"h+": d.getHours(), //小时
		"m+": d.getMinutes(), //分
		"s+": d.getSeconds(), //秒
		"q+": Math.floor((d.getMonth() + 3) / 3), //季度
		"S": d.getMilliseconds() //毫秒
	};
	if(/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (d.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	for(var k in o) {
		if(new RegExp("(" + k + ")").test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		}
	}
	return fmt;
}

function sql_toExcelm(req, res){
    var key = req.param('id');
    var bd = req.param('bd');
    //获得Excel模板的buffer对象
    var exlBuf = fs.readFileSync("./public/excelop/template/finance_m.xlsx");
    var myDate = new Date();
    var y = myDate.getFullYear(); 
    var m = (((myDate.getMonth()+1)+"").length==1)?"0"+(myDate.getMonth()+1):(myDate.getMonth()+1);
    var d = myDate.getDate(); 
    var hh = myDate.getHours();
    var mm = myDate.getMinutes();
    var ss = myDate.getSeconds();
    var excelname = "~"+y+m+d+hh+mm+ss+".xlsx"
    //数据源
    var sql1 = "select bookingno,numtotal,type,pricetotal,paytype from booking where bookingno like '"+key+"%'";
    mysql.query(sql1 ,function(error,obj){
        if(error){console.log(error);return false;} 
        //得到所选月份的所有订单,按月份来计算数据
        var bookingnno,m,_day,num_1,num_2,num_3,num_4,num_5,num_6,num_7,num_8,num_9;
        for(var i=1;i<32;i++){
            if(!_day){
                _day=i;
                num_1="0";num_2="0";num_3="0";num_4="0";num_5="0";num_6="0";num_7="0";num_8="0";num_9="0";
            }else{
                _day = _day + "," +i;
                num_1 = num_1 + ",0";
                num_2 = num_2 + ",0";
                num_3 = num_3 + ",0";
                num_4 = num_4 + ",0";
                num_5 = num_5 + ",0";
                num_6 = num_6 + ",0";
                num_7 = num_7 + ",0";
                num_8 = num_8 + ",0";
                num_9 = num_9 + ",0";
            }
        }
        _day = _day.split(",");
        num_1 = num_1.split(",");
        num_2 = num_2.split(",");
        num_3 = num_3.split(",");
        num_4 = num_4.split(",");
        num_5 = num_5.split(",");
        num_6 = num_6.split(",");
        num_7 = num_7.split(",");
        num_8 = num_8.split(",");
        num_9 = num_9.split(",");
        for(var i in obj){
            for(var j=0;j<_day.length;j++){
                bookingnno = obj[i].bookingno;
                m = Number(bookingnno.substring(6,8));
                if(m == Number(_day[j])){
                    if(obj[i].type == "预定"){
                        num_1[j] = Number(num_1[j]) + Number(obj[i].numtotal);
                        num_2[j] = Number(num_2[j]) + Number(obj[i].pricetotal);
                    }else{
                        num_3[j] = Number(num_3[j]) + Number(obj[i].numtotal);
                        num_4[j] = Number(num_4[j]) + Number(obj[i].pricetotal);
                    }
                    if(obj[i].paytype == "微信"){
                        num_5[j] = Number(num_5[j]) + Number(obj[i].pricetotal);
                    }else if(obj[i].paytype == "支付宝"){
                        num_6[j] = Number(num_6[j]) + Number(obj[i].pricetotal);
                    }else{
                        num_7[j] = Number(num_7[j]) + Number(obj[i].pricetotal);
                    }
                    num_8[j] = Number(num_8[j]) + Number(obj[i].numtotal);
                    num_9[j] = Number(num_9[j]) + Number(obj[i].pricetotal);
                }
            }
        }
        var _data = "[";
        var j = 0;
        var n1=0;var n2=0;var n3=0;var n4=0;var n5=0;var n6=0;var n7=0;var n8=0;var n9=0;
        for(var i=0;i<num_8.length;i++){
            j = j + 1;
            if(Number(num_8[i])!=0){
                _data += "{'dt':'"+bd + "-" + ((j+"").length==1?"0"+j:j)+"',";
                _data += "'num1':'"+num_1[i]+"',"
                _data += "'num2':'"+num_2[i]+"',"
                _data += "'num3':'"+num_3[i]+"',"
                _data += "'num4':'"+num_4[i]+"',"
                _data += "'num5':'"+num_5[i]+"',"
                _data += "'num6':'"+num_6[i]+"',"
                _data += "'num7':'"+num_7[i]+"',"
                _data += "'num8':'"+num_8[i]+"',"
                _data += "'num9':'"+num_9[i]+"'},"
                n1 = n1 + Number(num_1[i]);
                n2 = n2 + Number(num_2[i]);
                n3 = n3 + Number(num_3[i]);
                n4 = n4 + Number(num_4[i]);
                n5 = n5 + Number(num_5[i]);
                n6 = n6 + Number(num_6[i]);
                n7 = n7 + Number(num_7[i]);
                n8 = n8 + Number(num_8[i]);
                n9 = n9 + Number(num_9[i]);
            }
        }
                _data += "{'dt':'合计',";
                _data += "'num1':'"+n1+"',"
                _data += "'num2':'"+n2+"',"
                _data += "'num3':'"+n3+"',"
                _data += "'num4':'"+n4+"',"
                _data += "'num5':'"+n5+"',"
                _data += "'num6':'"+n6+"',"
                _data += "'num7':'"+n7+"',"
                _data += "'num8':'"+n8+"',"
                _data += "'num9':'"+n9+"'}"
        _data += "]";
        var _xls = eval('(' + _data + ')');
        //用数据源(对象)data渲染Excel模板
        ejsExcel.renderExcelCb(exlBuf, _xls, function(exlBuf2){
            fs.writeFileSync("./public/excelop/temp/"+excelname, exlBuf2);
            res.send(excelname);
        });
    });
}

function sql_toExcely(req, res){
    var key = req.param('id');
    var bd = req.param('bd');
    //获得Excel模板的buffer对象
    var exlBuf = fs.readFileSync("./public/excelop/template/finance_m.xlsx");
    var myDate = new Date();
    var y = myDate.getFullYear(); 
    var m = (((myDate.getMonth()+1)+"").length==1)?"0"+(myDate.getMonth()+1):(myDate.getMonth()+1);
    var d = myDate.getDate(); 
    var hh = myDate.getHours();
    var mm = myDate.getMinutes();
    var ss = myDate.getSeconds();
    var excelname = "~"+y+m+d+hh+mm+ss+".xlsx"
    //数据源
    var sql1 = "select bookingno,numtotal,type,pricetotal,paytype from booking where bookingno like '"+key+"%'";
    mysql.query(sql1 ,function(error,obj){
        if(error){console.log(error);return false;} 
        //得到所选月份的所有订单,按月份来计算数据
        var bookingnno,m,_day,num_1,num_2,num_3,num_4,num_5,num_6,num_7,num_8,num_9;
        for(var i=1;i<13;i++){
            if(!_day){
                _day=i;
                num_1="0";num_2="0";num_3="0";num_4="0";num_5="0";num_6="0";num_7="0";num_8="0";num_9="0";
            }else{
                _day = _day + "," +i;
                num_1 = num_1 + ",0";
                num_2 = num_2 + ",0";
                num_3 = num_3 + ",0";
                num_4 = num_4 + ",0";
                num_5 = num_5 + ",0";
                num_6 = num_6 + ",0";
                num_7 = num_7 + ",0";
                num_8 = num_8 + ",0";
                num_9 = num_9 + ",0";
            }
        }
        _day = _day.split(",");
        num_1 = num_1.split(",");
        num_2 = num_2.split(",");
        num_3 = num_3.split(",");
        num_4 = num_4.split(",");
        num_5 = num_5.split(",");
        num_6 = num_6.split(",");
        num_7 = num_7.split(",");
        num_8 = num_8.split(",");
        num_9 = num_9.split(",");
        for(var i in obj){
            for(var j=0;j<_day.length;j++){
                bookingnno = obj[i].bookingno;
                m = Number(bookingnno.substring(4,6));
                if(m == Number(_day[j])){
                    if(obj[i].type == "预定"){
                        num_1[j] = Number(num_1[j]) + Number(obj[i].numtotal);
                        num_2[j] = Number(num_2[j]) + Number(obj[i].pricetotal);
                    }else{
                        num_3[j] = Number(num_3[j]) + Number(obj[i].numtotal);
                        num_4[j] = Number(num_4[j]) + Number(obj[i].pricetotal);
                    }
                    if(obj[i].paytype == "微信"){
                        num_5[j] = Number(num_5[j]) + Number(obj[i].pricetotal);
                    }else if(obj[i].paytype == "支付宝"){
                        num_6[j] = Number(num_6[j]) + Number(obj[i].pricetotal);
                    }else{
                        num_7[j] = Number(num_7[j]) + Number(obj[i].pricetotal);
                    }
                    num_8[j] = Number(num_8[j]) + Number(obj[i].numtotal);
                    num_9[j] = Number(num_9[j]) + Number(obj[i].pricetotal);
                }
            }
        }
        var _data = "[";
        var j = 0;
        var n1=0;var n2=0;var n3=0;var n4=0;var n5=0;var n6=0;var n7=0;var n8=0;var n9=0;
        for(var i=0;i<num_8.length;i++){
            j = j + 1;
            if(Number(num_8[i])!=0){
                _data += "{'dt':'"+bd + "-" + ((j+"").length==1?"0"+j:j)+"',";
                _data += "'num1':'"+num_1[i]+"',"
                _data += "'num2':'"+num_2[i]+"',"
                _data += "'num3':'"+num_3[i]+"',"
                _data += "'num4':'"+num_4[i]+"',"
                _data += "'num5':'"+num_5[i]+"',"
                _data += "'num6':'"+num_6[i]+"',"
                _data += "'num7':'"+num_7[i]+"',"
                _data += "'num8':'"+num_8[i]+"',"
                _data += "'num9':'"+num_9[i]+"'},"
                n1 = n1 + Number(num_1[i]);
                n2 = n2 + Number(num_2[i]);
                n3 = n3 + Number(num_3[i]);
                n4 = n4 + Number(num_4[i]);
                n5 = n5 + Number(num_5[i]);
                n6 = n6 + Number(num_6[i]);
                n7 = n7 + Number(num_7[i]);
                n8 = n8 + Number(num_8[i]);
                n9 = n9 + Number(num_9[i]);
            }
        }
                _data += "{'dt':'合计',";
                _data += "'num1':'"+n1+"',"
                _data += "'num2':'"+n2+"',"
                _data += "'num3':'"+n3+"',"
                _data += "'num4':'"+n4+"',"
                _data += "'num5':'"+n5+"',"
                _data += "'num6':'"+n6+"',"
                _data += "'num7':'"+n7+"',"
                _data += "'num8':'"+n8+"',"
                _data += "'num9':'"+n9+"'}"
        _data += "]";
        var _xls = eval('(' + _data + ')');
        //用数据源(对象)data渲染Excel模板
        ejsExcel.renderExcelCb(exlBuf, _xls, function(exlBuf2){
            fs.writeFileSync("./public/excelop/temp/"+excelname, exlBuf2);
            res.send(excelname);
        });
    });
}