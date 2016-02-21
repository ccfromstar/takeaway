var mysql,LIMIT;
    mysql = require('./db');
    LIMIT = 10;

exports.sqldo = function (req, res) {
    var _sql = req.params.sql;
    if(_sql == "insert"){sql_insert(req,res);}
    else if(_sql == "delinfo"){sql_delete(req,res);}
    else if(_sql == "update"){sql_update(req,res);}
    else if(_sql == "getinfo"){sql_select(req,res);}
    else if(_sql == "createrepertory"){sql_repertory(req,res);}
    else if(_sql == "closebooking"){sql_closebooking(req,res);}
    else if(_sql == "openbooking"){sql_openbooking(req,res);}
    else if(_sql == "update_status"){sql_update_status(req,res);}
};

function sql_repertory(req, res) {
    //生成库存信息
    var sql0 = "delete from repertory";
    var sql1 = "select id,aheadnum,immediatelynum from menu";
    mysql.query(sql0 ,function(error0,obj0){
          if(error0){console.log(error0);return false;}
          mysql.query(sql1 ,function(error,obj){
            if(error){console.log(error);return false;}
            for(var i in obj){
              var sql2 = "insert into repertory (menuid,numtoday,numtomorrow) values ("+obj[i].id+","+obj[i].immediatelynum+","+obj[i].aheadnum+")";
              mysql.query(sql2 ,function(error1,obj1){});
            }
            res.send("200");
          });
    });
}

function sql_closebooking(req,res){
  var sql1 = "update settings set canbooking = 0 where id = 1";
  mysql.query(sql1 ,function(error,obj){
    if(error){console.log(error);return false;}
    res.send("200");
  });
}

function sql_openbooking(req,res){
  var sql1 = "update settings set canbooking = 1 where id = 1";
  mysql.query(sql1 ,function(error,obj){
    if(error){console.log(error);return false;}
    res.send("200");
  });
}

function sql_insert(req, res) {
    var name = req.param('name');
    var price = req.param('price');
    var aheadprice = req.param('aheadprice');
    var aheadnum = req.param('aheadnum');
    var immediatelynum = req.param('immediatelynum');
    var sortid = req.param('sortid');
    var maincourse = req.param('maincourse');
    var jardiniere = req.param('jardiniere');
    var staplefood = req.param('staplefood');
    var  imgname = req.param('imgname');
    var insertSql = "insert into menu (name,price,aheadprice,aheadnum,immediatelynum,sortid,maincourse,jardiniere,staplefood,imgname) values ('"+name+"',"+price+","+aheadprice+","+aheadnum+","+immediatelynum+","+sortid+",'"+maincourse+"','"+jardiniere+"','"+staplefood+"','"+imgname+"')";
    mysql.query(insertSql ,function(error,obj){
          if(error){console.log(error);return false;}
          req.session.infor = "新建成功！";
          res.send("200");
    });
};

function sql_delete(req, res) {
    var id = req.param('id');
    var deleteSql = "delete from menu where id = "+id;
    mysql.query(deleteSql ,function(error,obj){
          if(error){console.log(error);return false;}
          req.session.infor = "删除成功！";
          res.send("200");
    });
};

function sql_select(req, res) {
    var id = req.param('id');
    var delSql = "select * from menu where id = "+id;
    mysql.query(delSql ,function(error,rows1){
          if(error){console.log(error);return false;}
          res.send(rows1);
    });
};

function sql_update(req, res) {
    var name = req.param('name');
    var price = req.param('price');
    var aheadprice = req.param('aheadprice');
    var aheadnum = req.param('aheadnum');
    var immediatelynum = req.param('immediatelynum');
    var sortid = req.param('sortid');
    var maincourse = req.param('maincourse');
    var jardiniere = req.param('jardiniere');
    var staplefood = req.param('staplefood');
    var  imgname = req.param('imgname');
    var id = req.param('docid');
    var updateSql = "update menu set name = '"+name
     +"',price ="+price
     +",aheadprice ="+aheadprice
     +",aheadnum ="+aheadnum
     +",immediatelynum ="+immediatelynum
     +",sortid ="+sortid
     +",maincourse ='"+maincourse
     +"',jardiniere ='"+jardiniere
     +"',staplefood ='"+staplefood
     +"',imgname ='"+imgname
     +"'  where id = "+id;
    mysql.query(updateSql ,function(error,obj){
          if(error){console.log(error);return false;}
          req.session.infor = "修改成功！";
          res.send("200");
    });
};

function GetDateStr(AddDayCount) { 
    var myDate = new Date(); 
    myDate.setDate(myDate.getDate()+AddDayCount);//获取AddDayCount天后的日期 
    var y = myDate.getFullYear(); 
    var m = (((myDate.getMonth()+1)+"").length==1)?"0"+(myDate.getMonth()+1):(myDate.getMonth()+1);
    var d = (((myDate.getDate())+"").length==1)?"0"+(myDate.getDate()):(myDate.getDate());
    return y+"-"+m+"-"+d; 
  }

function sql_update_status(req, res) {
    var sendtime = GetDateStr(1);
    var updateSql = "update booking set status = '已送达' where status = '配送中' and sendtime < '"+sendtime+"'";
    mysql.query(updateSql ,function(error,obj){
          if(error){console.log(error);return false;}
          req.session.infor = "修改成功！";
          res.send("200");
    });
};

exports.sql_list_option = function (req, res) {
    var sql1 = "select canbooking from settings where id = 1";
    mysql.query(sql1 ,function(error,obj){
      if(error){console.log(error);return false;}
      var canbooking = obj[0].canbooking == 1?"开启":"关闭";
      res.render('cms/option', {url:req.url,canbooking:canbooking});
    });
};

exports.sql_list = function (req, res) {
    var _info = req.session.infor;
    req.session.infor = null;

    var page = parseInt(req.query.p);
    page = (page && page > 0) ? page : 1;
    var limit = (limit && limit > 0) ? limit : LIMIT;
    var sql1 = "select * from menu limit "+(page-1)*limit+","+limit;
    var sql5 = "select count(*) as count from menu";
    mysql.query(sql1,function (err, rows1) {
        if(err){console.log(err);return false;}
        mysql.query(sql5,function (err1, rows5) {
            if(err1){console.log(err1);return false;}
            var total = rows5[0].count;
            var totalpage = Math.ceil(total/limit);
            var isFirstPage = page == 1 ;
            var isLastPage = ((page -1) * limit + rows1.length) == total;
                res.render('cms/dir_menu', {url:req.url,record:rows1,page:page,total:total,totalpage:totalpage,isFirstPage:isFirstPage,isLastPage:isLastPage,info:_info});
        });
    });
};