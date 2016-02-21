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
    req.session.infor = null;

    var tel = req.query.tel;
    var page = parseInt(req.query.p);
    page = (page && page > 0) ? page : 1;
    tel = tel ? tel : "";
    var limit = (limit && limit > 0) ? limit : LIMIT;
    var sql1 = "select * from user where username like '%"+tel+"%' limit "+(page-1)*limit+","+limit;
    var sql2 = "select count(*) as count from user where favorable = '' and username like '%"+tel+"%'";
    var sql5 = "select count(*) as count from user where username like '%"+tel+"%'";
    mysql.query(sql1,function (err, rows1) {
        if(err){console.log(err);return false;}
        mysql.query(sql2,function (err2, rows2) {
          if(err2){console.log(err2);return false;}
          mysql.query(sql5,function (err1, rows5) {
            if(err1){console.log(err1);return false;}
            var total = rows5[0].count;
            var fa_total = rows2[0].count;
            var totalpage = Math.ceil(total/limit);
            var isFirstPage = page == 1 ;
            var isLastPage = ((page -1) * limit + rows1.length) == total;
                res.render('cms/customer_left', {url:req.url,record:rows1,page:page,total:total,fa_total:fa_total,totalpage:totalpage,isFirstPage:isFirstPage,isLastPage:isLastPage,info:_info});
          });
        });
    });
};

function getbooking(req,res){
    var id = req.param('id');
    var sql1 = "select * from booking where linktel = '"+id+"' order by bookingtime desc";
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