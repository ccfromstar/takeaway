var mysql,LIMIT;
    mysql = require('./db');
    LIMIT = 10;
var request = require("request");  

exports.sqldo = function (req, res) {
    var _sql = req.params.sql;
    if(_sql == "insert"){sql_insert(req,res);}
    else if(_sql == "delinfo"){sql_delete(req,res);}
    else if(_sql == "update"){sql_update(req,res);}
    else if(_sql == "getinfo"){sql_select(req,res);}
    else if(_sql == "chekuserlogin"){chekuserlogin(req,res);}
    else if(_sql == "louout"){logout(req,res);}
    else if(_sql == "regUser"){regUser(req,res);}
    else if(_sql == "chekwxuserlogin"){chekwxuserlogin(req,res);}
    else if(_sql == "unbind"){unbind(req,res);}
    else if(_sql == "regwxUser"){regwxUser(req,res);}
    else if(_sql == "sendSMS"){sendSMS(req,res);}
    else if(_sql == "updateUser"){updateUser(req,res);}
    else if(_sql == "getCinfo"){getCinfo(req,res);}
    else if(_sql == "getMenu"){getMenu(req,res);}
    else if(_sql == "insertBooking"){insertBooking(req,res);}
    else if(_sql == "queryBooking"){queryBooking(req,res);}
    else if(_sql == "queryBooking2"){queryBooking2(req,res);}
};

function sendSMS(req,res){
	/*
    var mobile = req.param('mobile');
    var code = req.param('code');
    var url = "http://121.199.16.178/webservice/sms.php?method=Submit&account=&password=&mobile="+mobile+"&content=您的动态码是："+code+"。请不要把动态码泄露给其他人。";
    request(url,function(err,response,body){
        if(!err && response.statusCode == 200){
              console.log(body);
              res.send("200");
        }
    }); */
   console.log('接口已屏蔽');
}

function updateUser(req,res){
    var pwd = req.param('pwd');
    var login_name = req.param('login_name');
    var name = req.param('name');
    var sql1 = "update user set name = '"+name+"',password = '"+pwd+"' where username = '"+login_name+"'";
    mysql.query(sql1 ,function(error,obj){
          if(error){console.log(error);return false;}
          req.session.infor = "修改成功！";
          res.send("200");
    });
}

function logout(req,res){
    req.session.cuser = null;
    res.redirect("/");
}

function sql_insert(req, res) {
    var username = req.param('username');
    var password = req.param('password');
    var name = req.param('name');
    var role = req.param('role');
    var insertSql = "insert into role (username,password,name,role) values ('"+username+"','"+password+"','"+name+"','"+role+"')";
    mysql.query(insertSql ,function(error,obj){
          if(error){console.log(error);return false;}
          req.session.infor = "新建成功！";
          res.send("200");
    });
};

function insertBooking(req, res) {
    var cid = req.param('cid');
    var date1 = req.param('date1');
    var numA = req.param('numA');
    var numB = req.param('numB');
    var numTotal = req.param('numTotal');
    var priceTotal = req.param('priceTotal');
    var insertSql = "insert into com_booking (cid,date1,date2,numA,numB,numTotal,priceTotal) values ('"+cid+"','"+date1+"',now(),'"+numA+"','"+numB+"','"+numTotal+"','"+priceTotal+"')";
    mysql.query(insertSql ,function(error,obj){
          if(error){console.log(error);return false;}
          var sql2 = 'select * from com_booking where id = '+obj.insertId;
          mysql.query(sql2 ,function(error,obj2){
		    if(error){console.log(error);return false;}
		    obj2[0].date2 = (obj2[0].date2).Format("yyyy-MM-dd hh:mm:ss");
		    res.send(obj2);   
		  });
    });
};

function queryBooking(req, res) {
    var cid = req.param('cid');
    var date = req.param('date');
    var insertSql = "select * from com_booking where cid = "+cid + " and date1 = '"+date+"'";
    console.log(insertSql);
    mysql.query(insertSql ,function(error,obj){
        if(error){console.log(error);return false;}
        if(obj[0]){
        	obj[0].date2 = (obj[0].date2).Format("yyyy-MM-dd hh:mm:ss");
        	res.json(obj);
        }else{
        	res.send("400");
        }
    });
};

function queryBooking2(req, res) {
    var cid = req.param('cid');
    var date = req.param('date');
    var insertSql = "select sum(numTotal) as numTotal,sum(priceTotal) as priceTotal from com_booking where cid = "+cid + " and date1 like '"+date+"%'";
    console.log(insertSql);
    mysql.query(insertSql ,function(error,obj){
        if(error){console.log(error);return false;}
        res.json(obj);
    });
};

function regUser(req, res) {
    var name = req.param('name');
    var password = req.param('password');
    var username = req.param('username');
    var sql1 = "select id from user where username = '"+username+"'";
    mysql.query(sql1 ,function(error1,obj1){
          if(error1){console.log(error1);return false;}
          if(obj1[0]){
            res.send("300");
          }else{
            var sql2 = "insert into user (username,name,password) values ('"+username+"','"+name+"','"+password+"')";
            mysql.query(sql2 ,function(error2,obj2){
              if(error2){console.log(error2);return false;}
                req.session.cuser = name;
                req.session.cid =  obj2.insertId;
                req.session.ctel =  username;
                req.session.favorable = "首单优惠";
                res.send("200");
            });
          }
    });
};

function regwxUser(req, res) {
    var name = req.param('name');
    var password = req.param('password');
    var username = req.param('username');
    var sql1 = "select id from user where username = '"+username+"'";
    mysql.query(sql1 ,function(error1,obj1){
          if(error1){console.log(error1);return false;}
          if(obj1[0]){
            res.send("300");
          }else{
            var sql2 = "insert into user (username,name,password,openid) values ('"+username+"','"+name+"','"+password+"','"+req.session.openid+"')";
            mysql.query(sql2 ,function(error2,obj2){
              if(error2){console.log(error2);return false;}
                req.session.cuser = name;
                req.session.cid =  obj2.insertId;
                req.session.ctel =  username;
                req.session.favorable = "首单优惠";
                res.send("200");
            });
          }
    });
};

function sql_delete(req, res) {
    var id = req.param('id');
    var deleteSql = "delete from role where id = "+id;
    mysql.query(deleteSql ,function(error,obj){
          if(error){console.log(error);return false;}
          req.session.infor = "删除成功！";
          res.send("200");
    });
};

function sql_select(req, res) {
    var id = req.param('id');
    var delSql = "select * from role where id = "+id;
    mysql.query(delSql ,function(error,rows1){
          if(error){console.log(error);return false;}
          res.send(rows1);
    });
};

function sql_update(req, res) {
    var username = req.param('username');
    var password = req.param('password');
    var name = req.param('name');
    var role = req.param('role');
    var id = req.param('docid');
    var updateSql = "update role set username = '"+username
     +"',password ='"+password
     +"',name ='"+name
     +"',role ='"+role
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
    var sql1 = "select * from role limit "+(page-1)*limit+","+limit;
    var sql5 = "select count(*) as count from role";
    mysql.query(sql1,function (err, rows1) {
        if(err){console.log(err);return false;}
        mysql.query(sql5,function (err1, rows5) {
            if(err1){console.log(err1);return false;}
            var total = rows5[0].count;
            var totalpage = Math.ceil(total/limit);
            var isFirstPage = page == 1 ;
            var isLastPage = ((page -1) * limit + rows1.length) == total;
                res.render('cms/dir_role', {url:req.url,record:rows1,page:page,total:total,totalpage:totalpage,isFirstPage:isFirstPage,isLastPage:isLastPage,info:_info});
        });
    });
};

function chekuserlogin (req, res) {
  var username = req.param('username');
  var password = req.param('password');
  var method = Number(req.param('method'));
  var Sql = "select id,username,password,name,favorable from user where username = '"+username+"'";
    mysql.query(Sql ,function(error,obj){
      if(error){console.log(error);return false;}
      if(obj[0]){
        if(method == 1){
          if(obj[0].password == password){
            res.send(obj[0].id);
          }else{
              res.send("300");
          }
        }else{
            req.session.cuser = obj[0].name;
            req.session.cid =  obj[0].id;
            req.session.ctel =  obj[0].username;
            req.session.favorable = obj[0].favorable;
            res.send("200");
        }
      }else{
        res.send("300");
      }
      
  });
}

function getCinfo(req, res) {
    var id = req.param('id');
    var delSql = "select * from address where id = "+id;
    mysql.query(delSql ,function(error,rows1){
          if(error){console.log(error);return false;}
          res.send(rows1);
    });
};

function getMenu(req, res) {
    var companyName = req.param('companyName');
    var delSql = "select * from menu where name = '"+companyName+"'";
    console.log(delSql);
    mysql.query(delSql ,function(error,rows1){
          if(error){console.log(error);return false;}
          res.send(rows1);
    });
};

function chekwxuserlogin (req, res) {
  var username = req.param('username');
  var password = req.param('password');
  var method = Number(req.param('method'));
    var Sql = "select * from address where tel = '"+username+"'";
    mysql.query(Sql ,function(error,obj){
      if(error){console.log(error);return false;}
      if(obj[0]){
        if(method == 1){
          if(obj[0].code == password){
          	console.log(obj[0].id);
            res.send(obj[0].id+"");
          }else{
              res.send("400");
          }
        }else{
            req.session.cuser = obj[0].name;
            req.session.cid =  obj[0].id;
            req.session.ctel =  obj[0].username;
            req.session.favorable = obj[0].favorable;
            //bind openid
            var sql2 = "select openid from user where id = "+obj[0].id;	            
            mysql.query(sql2 ,function(error,obj2){
                if(obj2[0].openid){
                  res.send("500");
                }else{
                  var sql1 = "update user set openid = '"+req.session.openid+"' where id = "+obj[0].id;
                  mysql.query(sql1 ,function(error,obj1){
                    if(error){console.log(error);return false;}
                    res.send("200");
                  });
                }
            });
        }
      }else{
        res.send("300");
      }
      
  });
}

function unbind (req, res) {
  //unbind openid
  var sql1 = "update user set openid = Null where openid = '"+req.session.openid + "'";
  mysql.query(sql1 ,function(error,obj1){
      if(error){console.log(error);return false;}
      res.send("200");
  });       
}

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