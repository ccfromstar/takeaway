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
    var name = req.param('name');
    var priceTotal = req.param('priceTotal');

    var insertSql = "insert into orderb2b (date,name,priceTotal) values ('"+date+"','"+name+"','"+priceTotal+"')";
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
    var deleteSql = "delete from orderb2b where id = "+id;
    mysql.query(deleteSql ,function(error,obj){
          if(error){console.log(error);return false;}
          req.session.infor = "删除成功！";
          res.send("200");
    });
};

function sql_select(req, res) {
    var id = req.param('id');
    var delSql = "select * from orderb2b where id = "+id;
    mysql.query(delSql ,function(error,rows1){
          if(error){console.log(error);return false;}
          res.send(rows1);
    });
};

function sql_update(req, res) {
    var date = req.param('date');
    var name = req.param('name');
    var priceTotal = req.param('priceTotal');
    var id = req.param('docid');
    var updateSql = "update orderb2b set date = '"+date
     +"',name ='"+name
     +"',priceTotal ='"+priceTotal
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
    var sql1 = "select * from orderb2b order by date desc limit "+(page-1)*limit+","+limit;
    var sql5 = "select count(*) as count from orderb2b";
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
            //获取企业信息
            var sql6 = "select * from address";
            mysql.query(sql6,function (err1, rows6) {
              if(err1){console.log(err1);return false;}
              //console.log(rows6);
              res.render('cms/dir_kq', {rows6:rows6,url:req.url,address:rows1,page:page,total:total,totalpage:totalpage,isFirstPage:isFirstPage,isLastPage:isLastPage,info:_info});
            });
        });
    });
};