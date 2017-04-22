var mysql;
    mysql = require('./db');

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