
var mysql,LIMIT,ejsExcel,fs;
    mysql = require('./db');
    LIMIT = 5;
    ejsExcel = require("./ejsExcel");
    fs = require("fs");

exports.checklogin = function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var Sql = "select password,name,role from role where username = '"+username+"'";
    mysql.query(Sql ,function(error,obj){
          if(error){console.log(error);return false;}
          if(obj[0].password == password){
              req.session.user = obj[0].name;
              req.session.role = obj[0].role;
              res.redirect("/cms/finance_d");
          }else{
            res.redirect("/cms/login");
          }
    });
};

exports.sql_list = function (req, res) {
    var _info = req.session.infor;
    req.session.infor = null;


    var page = parseInt(req.query.p);
    
    page = (page && page > 0) ? page : 1;
    var limit = (limit && limit > 0) ? limit : LIMIT;
   
    var sql1 = "select * from user where password='fedex2017'";
    var sql5 = "select count(*) as count from user where password='fedex2017'";
  
    mysql.query(sql1,function (err, rows1) {
        if(err){console.log(err);return false;}
          mysql.query(sql5,function (err1, rows5) {
            if(err1){console.log(err1);return false;}
            var total = rows5[0].count;
            var totalpage = Math.ceil(total/limit);
            var isFirstPage = page == 1 ;
            var isLastPage = ((page -1) * limit + rows1.length) == total;
            
            res.render('cms/user', {numTotal:rows5[0].count,url:req.url,record:rows1,page:page,total:total,totalpage:totalpage,isFirstPage:isFirstPage,isLastPage:isLastPage,info:_info});     
        });
    });
};