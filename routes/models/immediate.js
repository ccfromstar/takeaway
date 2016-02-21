var mysql,LIMIT;
    mysql = require('./db');
    LIMIT = 10;

exports.sqldo = function (req, res) {
    var _sql = req.params.sql;
    if(_sql == "getbooking"){getbooking(req,res);}
    else if(_sql == "getbookingdetail"){getbookingdetail(req,res);}
};

exports.sql_list = function (req, res) {
    var _info = req.session.infor;
    var _address = req.query.address;
    req.session.infor = null;

    var page = parseInt(req.query.p);
    page = (page && page > 0) ? page : 1;
    var limit = (limit && limit > 0) ? limit : LIMIT;
    var s_info = "所有楼宇";
    if(_address){
        var parm = _address.split("@");
        _address = parm[0];
        s_info = parm[0] + " 送达时间：" + parm[1].substring(0,5) + "-" + parm[2].substring(0,5);
    }else{
        _address = "";
    }
    var myDate = new Date();
    var y = myDate.getFullYear(); 
    var m = (((myDate.getMonth()+1)+"").length==1)?"0"+(myDate.getMonth()+1):(myDate.getMonth()+1);
    var d = (((myDate.getDate())+"").length==1)?"0"+(myDate.getDate()):(myDate.getDate());
    var sendtime = y+"-"+m+"-"+d;
    //_address = _address ? _address : "";
    var sql1 = "select * from booking where type = '即点' and sendtime like '"+sendtime+"%' and addressname like '%"+_address+"%' order by bookingtime desc limit "+(page-1)*limit+","+limit;
    var sql5 = "select count(*) as count from booking where type = '即点' and sendtime like '"+sendtime+"%' and addressname like '%"+_address+"%'";
    var sql3 = "select numtotal from booking where type = '即点' and sendtime like '"+sendtime+"%' and addressname like '%"+_address+"%'";
    var sql2 = "select name,i_starttime,i_endtime from address";
    mysql.query(sql1,function (err, rows1) {
        if(err){console.log(err);return false;}
          mysql.query(sql5,function (err1, rows5) {
            if(err1){console.log(err1);return false;}
            mysql.query(sql3,function (err3, rows3) {
            if(err3){console.log(err3);return false;}
            mysql.query(sql2,function (err2, rows2) {
                if(err2){console.log(err2);return false;}
                var total = rows5[0].count;
                var totalpage = Math.ceil(total/limit);
                var isFirstPage = page == 1 ;
                var isLastPage = ((page -1) * limit + rows1.length) == total;
                var totalnum = 0;
                for(var i in rows3){
                    totalnum = totalnum + Number(rows3[i].numtotal);
                }
                //var s_info = (_address=="")?"所有楼宇":rows1[0].addressname+ " 送达时间："+rows1[0].sendtime;
                res.render('cms/immediate_left', {totalnum:totalnum,s_info:s_info,address_s:rows2,url:req.url,record:rows1,page:page,total:total,totalpage:totalpage,isFirstPage:isFirstPage,isLastPage:isLastPage,info:_info});
            });
            });
          });
    });
};

function getbooking(req,res){
    var id = req.param('id');
    var sql1 = "select * from booking where linktel = '"+id+"'";
    mysql.query(sql1,function (err, rows1) {
        if(err){console.log(err);return false;} 
        res.send(rows1);       
    });     
}

function getbookingdetail(req,res){
    var id = req.param('id');
    var sql1 = "select * from booking_price where bookingid = '"+id+"'";
    mysql.query(sql1,function (err, rows1) {
        if(err){console.log(err);return false;} 
        res.send(rows1);       
    });     
}