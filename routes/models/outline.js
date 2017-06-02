var mysql,LIMIT;
    mysql = require('./db');
    LIMIT = 10;

exports.sqldo = function (req, res) {
    var _sql = req.params.sql;
    if(_sql == "insert"){sql_insert(req,res);}
    else if(_sql == "delinfo"){sql_delete(req,res);}
    else if(_sql == "update"){sql_update(req,res);}
    else if(_sql == "getinfo"){sql_select(req,res);}
};

function sql_insert(req, res) {
    var date = req.param('date');
    var num = req.param('num');
    var unitPrice = req.param('unitPrice');
    var sendtime = req.param('sendtime');
    var sendaddress = req.param('sendaddress');
    var linkname = req.param('linkname');
    var tel = req.param('tel');
    var numTotal = req.param('numTotal');
    var head = req.param('head');
    var InvoiceNum = req.param('InvoiceNum');
    var type = req.param('type');
    var sendtype = req.param('sendtype');

    var insertSql = "insert into outbooking (date,num,unitPrice,sendtime,sendaddress,linkname,tel,numTotal,head,InvoiceNum,type,sendtype) values ('"+date+"','"+num+"','"+unitPrice+"','"+sendtime+"','"+sendaddress+"','"+linkname+"','"+tel+"','"+numTotal+"','"+head+"','"+InvoiceNum+"','"+type+"','"+sendtype+"')";
    console.log(insertSql);
    mysql.query(insertSql ,function(error,obj){
          if(error){console.log(error);return false;}
          req.session.infor = "新建成功！";
          res.send("200");
    });
};

function addNumber(_idx){
        var str = '';
        for(var i = 0; i < _idx; i += 1){
        str += Math.floor(Math.random() * 10);
        }
        return str;
}

function sql_delete(req, res) {
    var id = req.param('id');
    var deleteSql = "delete from outbooking where id = "+id;
    mysql.query(deleteSql ,function(error,obj){
          if(error){console.log(error);return false;}
          req.session.infor = "删除成功！";
          res.send("200");
    });
};

function sql_select(req, res) {
    var id = req.param('id');
    var delSql = "select * from outbooking where id = "+id;
    mysql.query(delSql ,function(error,rows1){
          if(error){console.log(error);return false;}
          res.send(rows1);
    });
};

function sql_update(req, res) {
    var date = req.param('date');
    var num = req.param('num');
    var unitPrice = req.param('unitPrice');
    var sendtime = req.param('sendtime');
    var sendaddress = req.param('sendaddress');
    var linkname = req.param('linkname');
    var tel = req.param('tel');
    var numTotal = req.param('numTotal');
    var head = req.param('head');
    var InvoiceNum = req.param('InvoiceNum');
    var type = req.param('type');
    var sendtype = req.param('sendtype');
    var id = req.param('docid');
    var updateSql = "update outbooking set date = '"+date
     +"',num ='"+num
     +"',unitPrice ='"+unitPrice
     +"',sendtime ='"+sendtime
     +"',sendaddress ='"+sendaddress
     +"',linkname ='"+linkname
     +"',tel ='"+tel
     +"',numTotal ='"+numTotal
     +"',head ='"+head
     +"',InvoiceNum ='"+InvoiceNum
     +"',type ='"+type
     +"',sendtype ='"+sendtype
     +"'  where id = "+id;
    mysql.query(updateSql ,function(error,obj){
          if(error){console.log(error);return false;}
          req.session.infor = "修改成功！";
          res.send("200");
    });
};

exports.sql_list = function (req, res) {
    var _info = req.session.infor;
    req.session.infor = null;

    var page = parseInt(req.query.p);
    page = (page && page > 0) ? page : 1;
    var limit = (limit && limit > 0) ? limit : LIMIT;
    var sql1 = "select * from outbooking  order by date desc limit "+(page-1)*limit+","+limit;
    var sql5 = "select count(*) as count from outbooking";
    mysql.query(sql1,function (err, rows1) {
        if(err){console.log(err);return false;}
        for(var i in rows1){
            rows1[i].b_starttime = (rows1[i].b_starttime + "").substring(0,5);
            rows1[i].b_endtime = (rows1[i].b_endtime + "").substring(0,5);
            rows1[i].i_starttime = (rows1[i].i_starttime + "").substring(0,5);
            rows1[i].i_endtime = (rows1[i].i_endtime + "").substring(0,5);
        }
        mysql.query(sql5,function (err1, rows5) {
            if(err1){console.log(err1);return false;}
            var total = rows5[0].count;
            var totalpage = Math.ceil(total/limit);
            var isFirstPage = page == 1 ;
            var isLastPage = ((page -1) * limit + rows1.length) == total;
                res.render('cms/dir_outline', {url:req.url,address:rows1,page:page,total:total,totalpage:totalpage,isFirstPage:isFirstPage,isLastPage:isLastPage,info:_info});
        });
    });
};