var mysql,LIMIT;
    mysql = require('./db');
    LIMIT = 10;

exports.sqldo = function (req, res) {
    var _sql = req.params.sql;
    if(_sql == "insert"){sql_insert(req,res);}
    if(_sql == "addfile"){addfile(req,res);}
    else if(_sql == "delinfo"){sql_delete(req,res);}
    else if(_sql == "update"){sql_update(req,res);}
    else if(_sql == "getinfo"){sql_select(req,res);}
};

function addfile(req, res) {
    var docid = req.param('docid');
    var type = req.param('type');
    var filename = req.param('filename');
    

    var insertSql = "insert into attachement (docid,type,filename) values ('"+docid+"','"+type+"','"+filename+"')";
    console.log(insertSql);
    mysql.query(insertSql ,function(error,obj){
          if(error){console.log(error);return false;}
          req.session.infor = "新建成功！";
          res.send("200");
    });
};

function sql_insert(req, res) {
    var date = req.param('date');
    var numa = req.param('numa');
    var numb = req.param('numb');
    var numc = req.param('numc');
    var numd = req.param('numd');
    var nume = req.param('nume');
    var numf = req.param('numf');
    var numg = req.param('numg');
    var numh = req.param('numh');
    var numi = req.param('numi');
    var numj = req.param('numj');
    var numk = req.param('numk');
    var numl = req.param('numl');
    var numm = req.param('numm');
    var numn = req.param('numn');
    var numo = req.param('numo');
    var nump = req.param('nump');
    var numq = req.param('numq');
    var numr = req.param('numr');
    var nums = req.param('nums');
    var numt = req.param('numt');
    var numu = req.param('numu');
    var numv = req.param('numv');
    var numw = req.param('numw');
    var numx = req.param('numx');
    var numy = req.param('numy');
    var numz = req.param('numz');
    var numaa = req.param('numaa');
    var numab = req.param('numab');
    var numac = req.param('numac');
    var numad = req.param('numad');
    var numae = req.param('numae');
    var numaf = req.param('numaf');
    var numag = req.param('numag');
    var numah = req.param('numah');
    var numai = req.param('numai');
    var priceTotal = req.param('priceTotal');

    var insertSql = "insert into finance (date,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,aa,ab,ac,ad,ae,af,ag,ah,ai,priceTotal) values ('"
    +date+"','"+numa+"','"+numb+"','"+numc+"','"+numd+"','"+nume+"','"+numf+"','"+numg+"','"+numh+"','"+numi+"','"+numj+"','"+numk+"','"+numl+"','"+numm+"','"+numn+"','"+numo+"','"+
    nump+"','"+numq+"','"+numr+"','"+nums+"','"+numt+"','"+numu+"','"+numv+"','"+numw+"','"+numx+"','"+numy+"','"+numz+"','"+
    numaa+"','"+numab+"','"+numac+"','"+numad+"','"+numae+"','"+numaf+"','"+numag+"','"+numah+"','"+numai+"','"+priceTotal+"')";
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
    var deleteSql = "delete from finance where id = "+id;
    mysql.query(deleteSql ,function(error,obj){
          if(error){console.log(error);return false;}
          req.session.infor = "删除成功！";
          res.send("200");
    });
};

function sql_select(req, res) {
    var id = req.param('id');
    var delSql = "select * from finance where id = "+id;
    mysql.query(delSql ,function(error,rows1){
          if(error){console.log(error);return false;}
          res.send(rows1);
    });
};

function sql_update(req, res) {
    var date = req.param('date');
    var numa = req.param('numa');
    var numb = req.param('numb');
    var numc = req.param('numc');
    var numd = req.param('numd');
    var nume = req.param('nume');
    var numf = req.param('numf');
    var numg = req.param('numg');
    var numh = req.param('numh');
    var numi = req.param('numi');
    var numj = req.param('numj');
    var numk = req.param('numk');
    var numl = req.param('numl');
    var numm = req.param('numm');
    var numn = req.param('numn');
    var numo = req.param('numo');
    var nump = req.param('nump');
    var numq = req.param('numq');
    var numr = req.param('numr');
    var nums = req.param('nums');
    var numt = req.param('numt');
    var numu = req.param('numu');
    var numv = req.param('numv');
    var numw = req.param('numw');
    var numx = req.param('numx');
    var numy = req.param('numy');
    var numz = req.param('numz');
    var numaa = req.param('numaa');
    var numab = req.param('numab');
    var numac = req.param('numac');
    var numad = req.param('numad');
    var numae = req.param('numae');
    var numaf = req.param('numaf');
    var numag = req.param('numag');
    var numah = req.param('numah');
    var numai = req.param('numai');
    var priceTotal = req.param('priceTotal');
    var id = req.param('docid');
    var updateSql = "update finance set date = '"+date
     +"',a ='"+numa
     +"',b ='"+numb
     +"',c ='"+numc
     +"',d ='"+numd
     +"',e ='"+nume
     +"',f ='"+numf
     +"',g ='"+numg
     +"',h ='"+numh
     +"',i ='"+numi
     +"',j ='"+numj
     +"',k ='"+numk
     +"',l ='"+numl
     +"',m ='"+numm
     +"',n ='"+numn
     +"',o ='"+numo
     +"',p ='"+nump
     +"',q ='"+numq
     +"',r ='"+numr
     +"',s ='"+nums
     +"',t ='"+numt
     +"',u ='"+numu
     +"',v ='"+numv
     +"',w ='"+numw
     +"',x ='"+numx
     +"',y ='"+numy
     +"',z ='"+numz
     +"',aa ='"+numaa
     +"',ab ='"+numab
     +"',ac ='"+numac
     +"',ad ='"+numad
     +"',ae ='"+numae
     +"',af ='"+numaf
     +"',ag ='"+numag
     +"',ah ='"+numah
     +"',ai ='"+numai
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
    var sql1 = "select * from finance order by date desc limit "+(page-1)*limit+","+limit;
    var sql5 = "select count(*) as count from finance";
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
              res.render('cms/dir_fina', {rows6:rows6,url:req.url,address:rows1,page:page,total:total,totalpage:totalpage,isFirstPage:isFirstPage,isLastPage:isLastPage,info:_info});
            });
        });
    });
};