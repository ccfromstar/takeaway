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
    var name = req.param('name');
    var b_starttime = req.param('b_starttime');
    var b_endtime = req.param('b_endtime');
    var i_starttime = req.param('i_starttime');
    var i_endtime = req.param('i_endtime');
    var sender = req.param('sender');
    var tel = req.param('tel');
    var insertSql = "insert into address (name,b_starttime,b_endtime,i_starttime,i_endtime,sender,tel) values ('"+name+"','"+b_starttime+"','"+b_endtime+"','"+i_starttime+"','"+i_endtime+"','"+sender+"',"+tel+")";
    mysql.query(insertSql ,function(error,obj){
          if(error){console.log(error);return false;}
          req.session.infor = "新建成功！";
          res.send("200");
    });
};

function sql_delete(req, res) {
    var id = req.param('id');
    var deleteSql = "delete from address where id = "+id;
    mysql.query(deleteSql ,function(error,obj){
          if(error){console.log(error);return false;}
          req.session.infor = "删除成功！";
          res.send("200");
    });
};

function sql_select(req, res) {
    var id = req.param('id');
    var delSql = "select * from address where id = "+id;
    mysql.query(delSql ,function(error,rows1){
          if(error){console.log(error);return false;}
          for(var i in rows1){
            rows1[i].b_starttime = (rows1[i].b_starttime + "").substring(0,5);
            rows1[i].b_endtime = (rows1[i].b_endtime + "").substring(0,5);
            rows1[i].i_starttime = (rows1[i].i_starttime + "").substring(0,5);
            rows1[i].i_endtime = (rows1[i].i_endtime + "").substring(0,5);
          }
          res.send(rows1);
    });
};

function sql_update(req, res) {
    var name = req.param('name');
    var b_starttime = req.param('b_starttime');
    var b_endtime = req.param('b_endtime');
    var i_starttime = req.param('i_starttime');
    var i_endtime = req.param('i_endtime');
    var sender = req.param('sender');
    var tel = req.param('tel');
    var id = req.param('docid');
    var updateSql = "update address set name = '"+name
     +"',b_starttime ='"+b_starttime
     +"',b_endtime ='"+b_endtime
     +"',i_starttime ='"+i_starttime
     +"',i_endtime ='"+i_endtime
     +"',sender ='"+sender
     +"',tel ='"+tel
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
    var sql1 = "select * from address limit "+(page-1)*limit+","+limit;
    var sql5 = "select count(*) as count from address";
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
                res.render('cms/dir_address', {url:req.url,address:rows1,page:page,total:total,totalpage:totalpage,isFirstPage:isFirstPage,isLastPage:isLastPage,info:_info});
        });
    });
};