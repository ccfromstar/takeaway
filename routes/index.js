var address,role, menu, fs, user, customer, p400, booking, immediate, finance_d, mysql, erp,outline,old,gh,amn,box,kq,fina,fedmenu,fixedmenu,fedreport;
address = require('./models/address.js');
outline = require('./models/outline.js');
old = require('./models/old.js');
gh = require('./models/gh.js');
amn = require('./models/amn.js');
box = require('./models/box.js');
kq = require('./models/kq.js');
fina = require('./models/fina.js');
fedmenu = require('./models/fedmenu.js');
fixedmenu = require('./models/fixedmenu.js');
fedreport = require('./models/fedreport.js');
role = require('./models/role.js');
menu = require('./models/menu.js');
user = require('./models/user.js');
customer = require('./models/customer.js');
p400 = require('./models/p400.js');
fs = require('fs');
booking = require('./models/booking.js');
immediate = require('./models/immediate.js');
finance_d = require('./models/finance_d.js');
mysql = require('./models/db');
erp = require('./models/erp.js');

var crypto = require("crypto");
var request = require("request");
var alipay = require('../alipay_config').alipay;
var access_token = "";
var jsapi_ticket = "";
var strat_time = new Date();
var fs = require('fs');

var mysql_model = require('mysql');
var mysqlphp = mysql_model.createPool({
	host: '127.0.0.1',
	user: 'root',
	password: 'password123',
	database: 'takeaway',
	port: 3306
});

exports.servicedo = function(req, res) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	var _sql = req.params.sql;
	if(_sql == "getTotal") {
		var sql = "select count(id) as count from user where id > 150";
		mysqlphp.query(sql, function(err, result) {
			if(err) return console.error(err.stack);
			console.log(result);
			res.json(result);

		});
	} else if(_sql == "checkLogin") {
		var uname = req.param("uname");
		var pwd = req.param("pwd");
		var sql = "select * from c_role where username = '" + uname + "'";
		console.log(sql);
		mysql.query(sql, function(err, result) {
			if(err) return console.error(err.stack);
			if(!result[0]) {
				res.send("400");
				return;
			}
			if(result[0].password == pwd) {
				res.json(result[0]);
			} else {
				res.send("400");
			}
		});
	} else if(_sql == "getList") {
		var sql1 = "select * from sbooking where state_id = 2";
		mysql.query(sql1, function(error, obj) {
			res.send(obj);
		});
	} else if(_sql == "getListf") {
		var sql1 = "select * from sbooking where state_id = 3";
		mysql.query(sql1, function(error, obj) {
			res.send(obj);
		});
	} else if(_sql == "bookfinish") {
		var bookingno = req.param("bookingno");
		var sql1 = "update sbooking set state_id = 3 where state_id = 1 and bookingno = '" + bookingno + "'";
		mysql.query(sql1, function(error, obj) {
			res.send(obj);
		});
	} else if(_sql == "bookend") {
		var bookingno = req.param("bookingno");
		var sql1 = "update sbooking set state_id = 4 where bookingno = '" + bookingno + "'";
		mysql.query(sql1, function(error, obj) {
			res.send(obj);
		});
	} else if(_sql == "getPrint") {
		var sql1 = "select * from sbooking where isPrint = 0 and state_id = 3";
		mysql.query(sql1, function(error, obj) {
			console.log(obj[0]);
			if(!obj[0]){
				res.send("200");
			}else{
				var s = obj[0];
				var sql2 = "update sbooking set isPrint = 1 where bookingno = '" + s.bookingno + "'";
				mysql.query(sql2, function(error, obj2) {
					res.send(obj);
				});
			}
		});
	} else if(_sql == "getPrintc") {
		var sql1 = "select * from sbooking where isPrint = 1 and state_id = 3";
		mysql.query(sql1, function(error, obj) {
			console.log(obj[0]);
			if(!obj[0]){
				res.send("200");
			}else{
				var s = obj[0];
				var sql2 = "update sbooking set isPrint = 2 where bookingno = '" + s.bookingno + "'";
				mysql.query(sql2, function(error, obj2) {
					res.send(obj);
				});
			}
		});
	} 
}

exports.runSQL = function(req, res) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	var sql_statement = req.query.sql;
	sql_statement = sql_statement.toLocaleLowerCase();
	var label = req.query.label;
	if(label != "ddj") {
		res.json({
			'error': 'no access'
		});
		return false;
	}
	if(!sql_statement) {
		res.json({
			'error': 'need sql sql_statement'
		});
		return false;
	}
	if(sql_statement.indexOf('insert') != -1 || sql_statement.indexOf('update') != -1 || sql_statement.indexOf('delete') != -1) {
		res.json({
			'error': 'you can only run select SQL'
		});
		return false;
	}
	mysqlphp.query(sql_statement, function(err, result) {
		if(err) {
			res.json(err.stack);
			return false;
		}
		res.json(result);
	});
}

exports.wechat = function(req, res) {
	var echostr, nonce, signature, timestamp;
	signature = req.query.signature;
	timestamp = req.query.timestamp;
	nonce = req.query.nonce;
	echostr = req.query.echostr;
	if(check(timestamp, nonce, signature, "takeaway")) {
		return res.send(echostr);
	} else {
		return res.end();
	}
};

function check(timestamp, nonce, signature, token) {
	var currSign, tmp;
	tmp = [token, timestamp, nonce].sort().join("");
	currSign = crypto.createHash("sha1").update(tmp).digest("hex");
	return currSign === signature;
};

exports.index = function(req, res) {
	/*
	var sql1 = "select name,imgname,price,aheadprice from menu order by sortid asc limit 0,6";
	var sql2 = "select id,name,b_starttime,i_starttime,b_endtime,i_endtime,sender,tel from address";
	mysql.query(sql1, function(error1, obj1) {
		if(error1) {
			console.log(error1);
			return false;
		}
		mysql.query(sql2, function(error, obj) {
			if(error) {
				console.log(error);
				return false;
			}
			res.render('front/index', {
				address_s: obj,
				obj1: obj1
			});
		});
	});*/
	res.render('front/index', {
		
	});
};

exports.option1 = function(req, res) {
	if(!req.session.cuser) {
		res.redirect('/');
	} else {
		var Sql = "select * from user where id = " + req.session.cid;
		mysql.query(Sql, function(error, obj) {
			if(error) {
				console.log(error);
				return false;
			}
			res.render('front/option1', {
				obj: obj
			});
		});
	}
};

exports.bookingsuccess = function(req, res) {
	if(!req.session.cuser) {
		res.redirect('/');
	} else {
		var alipay_id = req.session.alipay_id;
		var sql1 = "update booking set status = '配送中' where bookingno = '" + alipay_id + "'";
		mysql.query(sql1, function(error, obj) {
			if(error) {
				console.log(error);
				return false;
			}
			res.render('front/bookingsuccess');
		});

	}
};

exports.w_bookingsuccess = function(req, res) {
	res.render('weixin/bookingsuccess');
};

exports.option2 = function(req, res) {
	if(!req.session.cuser) {
		res.redirect('/');
	} else {
		var LIMIT = 10;
		var page = parseInt(req.query.p);
		page = (page && page > 0) ? page : 1;
		var limit = (limit && limit > 0) ? limit : LIMIT;
		var Sql = "select * from booking where linktel = '" + req.session.ctel + "'  order by bookingtime desc limit " + (page - 1) * limit + "," + limit;
		var sql5 = "select count(*) as count from booking where linktel = '" + req.session.ctel + "'";
		mysql.query(Sql, function(error, obj) {
			if(error) {
				console.log(error);
				return false;
			}
			for(var i in obj) {
				var myDate = obj[i].bookingtime;
				var y = myDate.getFullYear();
				var m = (((myDate.getMonth() + 1) + "").length == 1) ? "0" + (myDate.getMonth() + 1) : (myDate.getMonth() + 1);
				var d = (((myDate.getDate()) + "").length == 1) ? "0" + (myDate.getDate()) : (myDate.getDate());
				obj[i].bookingtime = y + "-" + m + "-" + d;
				obj[i].sendtime = (obj[i].sendtime).substring(0, 10);
			}
			mysql.query(sql5, function(err1, rows5) {
				if(err1) {
					console.log(err1);
					return false;
				}
				var total = rows5[0].count;
				var totalpage = Math.ceil(total / limit);
				var isFirstPage = page == 1;
				var isLastPage = ((page - 1) * limit + obj.length) == total;
				res.render('front/option2', {
					record: obj,
					page: page,
					total: total,
					totalpage: totalpage,
					isFirstPage: isFirstPage,
					isLastPage: isLastPage
				});
			});
		});
	}
};

exports.w_login = function(req, res) {
	res.render('weixin/login', {
		openid: req.session.openid
	});
}

exports.f_login = function(req, res) {
	res.render('fedex/login', {
		
	});
}

exports.f_booking = function(req, res) {
	//获取code
	var code = req.query.code;
	console.log("code:" + code);
	if(code) {
		var appId = "wxe2a20ae8d978330b";
		var appSecret = "5160fed55fa7f8cffe2677213b270608";
		var url = "https://api.weixin.qq.com/sns/oauth2/access_token?grant_type=authorization_code&appid=" + appId + "&secret=" + appSecret + "&code=" + code;
		console.log(url);
		request({
			url: url,
			timeout: 3000
		}, function(err, response, body) {
			if(err) {
				console.log("err:" + err);
			}
			if(!err && response.statusCode == 200) {
				var openid = JSON.parse(body).openid;
				console.log("body:" + body);
				console.log("openid:" + openid);
				req.session.openid = openid;
				res.render('fedex/booking', {});
			}
		});
	}else{
		res.render('fedex/booking', {});
	}	
	
}

exports.w_reg = function(req, res) {
	res.render('weixin/reg', {
		openid: req.session.openid
	});
}

exports.booking_w_login = function(req, res) {
	res.render('weixin/bookinglogin', {
		openid: req.session.openid
	});
}

exports.booking_w_reg = function(req, res) {
	res.render('weixin/bookingreg', {
		openid: req.session.openid
	});
}

exports.booking_f_reg = function(req, res) {
	res.render('fedex/bookingreg', {
		
	});
}

exports.w_option = function(req, res) {
	res.render('weixin/option', {
		
	});
};

exports.f_option = function(req, res) {
	res.render('fedex/option', {
		
	});
};

exports.f_read = function(req, res) {
	var id = req.query.id;
	var sql1 = "select * from fedbooking where bookingno = '"+id+"'";
	var sql2 = "select * from fedbooking_price where num != 0 and bno = '"+id+"'";
	mysql.query(sql1 ,function(error,obj1){
        if(error){console.log(error);return false;}
        obj1[0].createAt = (obj1[0].createAt).Format("yyyy-MM-dd hh:mm:ss")
        mysql.query(sql2 ,function(error,obj2){
          if(error){console.log(error);return false;}
          	res.render('fedex/read', {
				obj1:obj1,
				obj2:obj2
			});
    	});  
    });
};

exports.f_get = function(req, res) {
	var id = req.query.id;
	var sql1 = "select * from fedbooking where bookingno = '"+id+"'";
	var sql2 = "select * from fedbooking_price where num != 0 and bno = '"+id+"'";
	var sql3 = "update fedbooking set state = '已取餐' where bookingno = '"+id+"'";
	mysql.query(sql1 ,function(error,obj1){
        if(error){console.log(error);return false;}
        obj1[0].createAt = (obj1[0].createAt).Format("yyyy-MM-dd hh:mm:ss")
        mysql.query(sql2 ,function(error,obj2){
          if(error){console.log(error);return false;}
          	mysql.query(sql3 ,function(error,obj3){
	          if(error){console.log(error);return false;}
	          	res.render('fedex/get', {
					obj1:obj1,
					obj2:obj2
				});
	    	}); 
    	});  
    });
};

exports.w_query = function(req, res) {
	res.render('weixin/query', {
		
	});
};

exports.booking_front = function(req, res) {
	if(!req.session.cuser) {
		res.redirect('/');
	} else {
		var favorable = req.session.favorable;
		var sql0 = "select canbooking from settings where id = 1";
		var sql1 = "select * from user where id = " + req.session.cid;
		var sql2 = "select id,name,b_starttime,i_starttime,b_endtime,i_endtime,sender,tel from address";
		var sql3 = "select m.maincourse,m.jardiniere,m.staplefood,m.imgname,m.id,m.name,m.price,m.aheadprice,r.numtoday,r.numtomorrow from menu m left join repertory r on r.menuid = m.id order by m.sortid asc";
		var sql4 = "select address_id,addressdetail from address_booking where linktel = '" + req.session.ctel + "' order by bookingtime desc limit 0,1";
		mysql.query(sql0, function(err0, rows0) {
			if(err0) {
				console.log(err0);
				return false;
			}
			mysql.query(sql1, function(err1, rows1) {
				if(err1) {
					console.log(err1);
					return false;
				}
				mysql.query(sql4, function(err4, rows4) {
					if(err4) {
						console.log(err4);
						return false;
					}
					mysql.query(sql2, function(err2, rows2) {
						if(err2) {
							console.log(err2);
							return false;
						}
						for(var i in rows2) {
							rows2[i].b_starttime = (rows2[i].b_starttime + "").substring(0, 5);
							rows2[i].b_endtime = (rows2[i].b_endtime + "").substring(0, 5);
							rows2[i].i_starttime = (rows2[i].i_starttime + "").substring(0, 5);
							rows2[i].i_endtime = (rows2[i].i_endtime + "").substring(0, 5);
						}
						mysql.query(sql3, function(err3, rows3) {
							if(err3) {
								console.log(err3);
								return false;
							}
							res.render('front/booking', {
								url: req.url,
								user_s: rows1,
								address_s: rows2,
								menu_s: rows3,
								favorable: favorable,
								canbooking: rows0[0].canbooking,
								la: rows4[0]
							});
						});
					});
				});
			});
		});
	}
};

exports.w_orderaddress = function(req, res) {
	res.render('weixin/orderaddress');
}

exports.getAddressByAPI = function(req, res) {
	var _address = req.param('address');
	var _url = "http://apis.map.qq.com/ws/place/v1/suggestion/?region=上海&keyword=" + _address + "&key=D7HBZ-7QRKG-RANQN-IO2IT-D4N5E-4UBOZ&region_fix=1";
	console.log(_url);
	request({
		url: _url,
		timeout: 3000
	}, function(err, response, body) {
		if(!err && response.statusCode == 200) {
			res.send(body);
		}
	});
}

exports.w_booking = function(req, res) {
	//获取code
	var code = req.query.code;
	console.log("code:" + code);
	if(code) {
		var appId = "wxe2a20ae8d978330b";
		var appSecret = "5160fed55fa7f8cffe2677213b270608";
		var url = "https://api.weixin.qq.com/sns/oauth2/access_token?grant_type=authorization_code&appid=" + appId + "&secret=" + appSecret + "&code=" + code;
		console.log(url);
		//res.redirect('/weixin/red?p='+url);
		//return false;
		request({
			url: url,
			timeout: 3000
		}, function(err, response, body) {
			if(err) {
				console.log("err:" + err);
			}
			if(!err && response.statusCode == 200) {
				var openid = JSON.parse(body).openid;
				console.log("body:" + body);
				console.log("openid:" + openid);
				if(JSON.parse(body).errcode != null) {
					console.log(body);
					res.redirect(req.url);
					return false;
				}
				req.session.openid = openid;
				console.log(openid);
				//根据openid判断是不是绑定过
				var sql1 = "select * from user where openid = '" + openid + "'";
				mysql.query(sql1, function(error, user) {
					if(error) {
						console.log(error);
						return false;
					}
					if(user[0]) {
						//已绑定
						var userid = user[0].id;
						res.locals.cuser = user[0].name;
						var ctel = user[0].username;
						res.locals.ctel = ctel;
						//session
						req.session.cid = user[0].id;
						req.session.cuser = user[0].name;
						req.session.ctel = user[0].username;
						req.session.favorable = user[0].favorable;

						var favorable = user[0].favorable;
						var sql0 = "select canbooking from settings where id = 1";
						var sql1 = "select * from user where id = " + userid;
						var sql2 = "select id,name,b_starttime,i_starttime,b_endtime,i_endtime,sender,tel from address";
						var sql3 = "select m.maincourse,m.jardiniere,m.staplefood,m.imgname,m.id,m.name,m.price,m.aheadprice,r.numtoday,r.numtomorrow from menu m left join repertory r on r.menuid = m.id order by m.sortid asc";
						var sql4 = "select address_id,addressdetail from address_booking where linktel = '" + ctel + "' order by bookingtime desc limit 0,1";
						mysql.query(sql0, function(err0, rows0) {
							if(err0) {
								console.log(err0);
								return false;
							}
							mysql.query(sql1, function(err1, rows1) {
								if(err1) {
									console.log(err1);
									return false;
								}
								mysql.query(sql4, function(err4, rows4) {
									if(err4) {
										console.log(err4);
										return false;
									}
									mysql.query(sql2, function(err2, rows2) {
										if(err2) {
											console.log(err2);
											return false;
										}
										for(var i in rows2) {
											rows2[i].b_starttime = (rows2[i].b_starttime + "").substring(0, 5);
											rows2[i].b_endtime = (rows2[i].b_endtime + "").substring(0, 5);
											rows2[i].i_starttime = (rows2[i].i_starttime + "").substring(0, 5);
											rows2[i].i_endtime = (rows2[i].i_endtime + "").substring(0, 5);
										}
										mysql.query(sql3, function(err3, rows3) {
											if(err3) {
												console.log(err3);
												return false;
											}
											res.render('weixin/booking', {
												url: req.url,
												user_s: rows1,
												address_s: rows2,
												menu_s: rows3,
												favorable: favorable,
												canbooking: rows0[0].canbooking,
												la: rows4[0]
											});
										});
									});
								});
							});
						});
					} else {
						//没有绑定
						res.redirect("/weixin/list");
					}
				});
			}
		});
	} else {
		var userid = req.session.cid;
		res.locals.cuser = req.session.cuser;
		var ctel = req.session.ctel;
		res.locals.ctel = ctel;
		var favorable = req.session.favorable;
		var sql0 = "select canbooking from settings where id = 1";
		var sql1 = "select * from user where id = " + userid;
		var sql2 = "select id,name,b_starttime,i_starttime,b_endtime,i_endtime,sender,tel from address";
		var sql3 = "select m.maincourse,m.jardiniere,m.staplefood,m.imgname,m.id,m.name,m.price,m.aheadprice,r.numtoday,r.numtomorrow from menu m left join repertory r on r.menuid = m.id order by m.sortid asc";
		var sql4 = "select address_id,addressdetail from address_booking where linktel = '" + ctel + "' order by bookingtime desc limit 0,1";
		mysql.query(sql0, function(err0, rows0) {
			if(err0) {
				console.log(err0);
				return false;
			}
			mysql.query(sql1, function(err1, rows1) {
				if(err1) {
					console.log(err1);
					return false;
				}
				mysql.query(sql4, function(err4, rows4) {
					if(err4) {
						console.log(err4);
						return false;
					}
					mysql.query(sql2, function(err2, rows2) {
						if(err2) {
							console.log(err2);
							return false;
						}
						for(var i in rows2) {
							rows2[i].b_starttime = (rows2[i].b_starttime + "").substring(0, 5);
							rows2[i].b_endtime = (rows2[i].b_endtime + "").substring(0, 5);
							rows2[i].i_starttime = (rows2[i].i_starttime + "").substring(0, 5);
							rows2[i].i_endtime = (rows2[i].i_endtime + "").substring(0, 5);
						}
						mysql.query(sql3, function(err3, rows3) {
							if(err3) {
								console.log(err3);
								return false;
							}
							res.render('weixin/booking', {
								url: req.url,
								user_s: rows1,
								address_s: rows2,
								menu_s: rows3,
								favorable: favorable,
								canbooking: rows0[0].canbooking,
								la: rows4[0]
							});
						});
					});
				});
			});
		});
	}
};

exports.w_list = function(req, res) {
	var sql3 = "select m.maincourse,m.jardiniere,m.staplefood,m.imgname,m.id,m.name,m.price,m.aheadprice,r.numtoday,r.numtomorrow from menu m left join repertory r on r.menuid = m.id order by m.sortid asc";
	mysql.query(sql3, function(err3, rows3) {
		if(err3) {
			console.log(err3);
			return false;
		}
		res.render('weixin/list', {
			url: req.url,
			menu_s: rows3
		});
	});
}

exports.w_export = function(req,res){
		res.render('weixin/export', {
			
		});
}

exports.reg = function(req, res) {
	res.render('front/reg');
};

exports.login = function(req, res) {
	req.session.user = null;
	res.render('cms/login');
};

exports.logindo = function(req, res) {
	user.checklogin(req, res);
};

exports.address = function(req, res) {
	address.sql_list(req, res);
};

exports.addressdo = function(req, res) {
	address.sqldo(req, res);
};

exports.outline = function(req, res) {
	outline.sql_list(req, res);
};

exports.outlinedo = function(req, res) {
	outline.sqldo(req, res);
};

exports.old = function(req, res) {
	old.sql_list(req, res);
};

exports.olddo = function(req, res) {
	old.sqldo(req, res);
};

exports.gh = function(req, res) {
	gh.sql_list(req, res);
};

exports.ghdo = function(req, res) {
	gh.sqldo(req, res);
};

exports.amn = function(req, res) {
	amn.sql_list(req, res);
};

exports.amndo = function(req, res) {
	amn.sqldo(req, res);
};

exports.box = function(req, res) {
	box.sql_list(req, res);
};

exports.boxdo = function(req, res) {
	box.sqldo(req, res);
};

exports.fina = function(req, res) {
	fina.sql_list(req, res);
};

exports.finado = function(req, res) {
	fina.sqldo(req, res);
};

exports.kq = function(req, res) {
	kq.sql_list(req, res);
};

exports.kqdo = function(req, res) {
	kq.sqldo(req, res);
};

exports.fedreport = function(req, res) {
	fedreport.sql_list(req, res);
};

exports.fedreportdo = function(req, res) {
	fedreport.sqldo(req, res);
};

exports.user = function(req, res) {
	user.sql_list(req, res);
};

exports.userdo = function(req, res) {
	user.sqldo(req, res);
};

exports.fedreport1 = function(req, res) {
	fedreport.sql_list1(req, res);
};

exports.fedreportdo1 = function(req, res) {
	fedreport.sqldo1(req, res);
};

exports.fedmenu = function(req, res) {
	fedmenu.sql_list(req, res);
};

exports.fedmenudo = function(req, res) {
	fedmenu.sqldo(req, res);
};

exports.fixedmenu = function(req, res) {
	fixedmenu.sql_list(req, res);
};

exports.fixedmenudo = function(req, res) {
	fixedmenu.sqldo(req, res);
};

exports.role = function(req, res) {
	role.sql_list(req, res);
};

exports.roledo = function(req, res) {
	role.sqldo(req, res);
};

exports.menu = function(req, res) {
	menu.sql_list(req, res);
};

exports.menudo = function(req, res) {
	menu.sqldo(req, res);
};

exports.upload = function(req, res) {
	res.render('cms/upload');
};

exports.uploadsuccess = function(req, res) {
	var p = req.query.p;
	res.render('cms/uploadsuccess', {
		url: getUrl(req),
		p: p
	});
};

exports.option = function(req, res) {
	menu.sql_list_option(req, res);
};

exports.uploaddo = function(req, res) {
	var fname = req.files.img_url.path.replace("public\\pic\\", "").replace("public/pic/", "");
	res.redirect("/cms/uploadsuccess?p=" + fname);
};

exports.booking = function(req, res) {
	booking.sql_list(req, res);
};

exports.immediate = function(req, res) {
	res.render('cms/immediate', {
		url: getUrl(req)
	});
};

exports.r400 = function(req, res) {
	p400.getsql(req, res);
};

exports.s400 = function(req, res) {
	res.render('cms/400success', {
		url: "/cms/400"
	});
};

exports.r400do = function(req, res) {
	p400.sqldo(req, res);
};

exports.customer = function(req, res) {
	res.render('cms/customer', {
		url: getUrl(req)
	});
};

exports.customerdo = function(req, res) {
	customer.sqldo(req, res);
};

exports.customer_left = function(req, res) {
	customer.sql_list(req, res);
};

exports.booking_left = function(req, res) {
	booking.sql_list(req, res);
};

exports.immediate_left = function(req, res) {
	immediate.sql_list(req, res);
};

exports.finance_d = function(req, res) {
	finance_d.sql_list(req, res);
};

exports.finance_total = function(req, res) {
	finance_d.sql_list_t(req, res);
};

exports.finance_ddo = function(req, res) {
	finance_d.sqldo(req, res);
};

exports.finance_m = function(req, res) {
	finance_d.sql_list_m(req, res);
};

exports.finance_y = function(req, res) {
	finance_d.sql_list_y(req, res);
};

exports.finance_z = function(req, res) {
	finance_d.sql_list_z(req, res);
};

function getUrl(req) {
	return req.url;
}

exports.checkLogin = function(req, res, next) {
	if(!req.session.user) {
		res.locals.user = null;
		res.locals.role = null;
		res.redirect("/cms/login");
	} else {
		res.locals.user = req.session.user;
		res.locals.role = req.session.role;
	}
	next();
}

exports.checkuserLogin = function(req, res, next) {
	if(!req.session.cuser) {
		res.locals.cuser = null;
	} else {
		res.locals.cuser = req.session.cuser;
	}
	next();
}

function sign(jsapi_ticket, nonceStr, timestamp, url) {
	var ret = {
		jsapi_ticket: jsapi_ticket,
		nonceStr: nonceStr,
		timestamp: timestamp,
		url: url
	};
	var string = raw(ret);
	jsSHA = require('jssha');
	shaObj = new jsSHA(string, 'TEXT');
	ret.signature = shaObj.getHash('SHA-1', 'HEX');

	return ret;
};

function raw(args) {
	var keys = Object.keys(args);
	keys = keys.sort()
	var newArgs = {};
	keys.forEach(function(key) {
		newArgs[key.toLowerCase()] = args[key];
	});

	var string = '';
	for(var k in newArgs) {
		string += '&' + k + '=' + newArgs[k];
	}
	string = string.substr(1);
	return string;
};

exports.weixin_js = function(req, res) {
	var timestamp = parseInt(new Date().getTime() / 1000) + '';
	var nonceStr = Math.random().toString(36).substr(2, 15);
	var appId = "wxe2a20ae8d978330b";
	var appSecret = "5160fed55fa7f8cffe2677213b270608";
	var wx_url = "http://www.4000191177.com" + req.url;
	console.log("wx_url:" + wx_url);
	//判断access_token和jsapi_ticket是否已经获得，并且时效在2小时(7200s)以内
	var end_time = new Date();
	var timediff = end_time.getTime() - strat_time.getTime() //时间差的毫秒数
		//console.log(end_time + "-->" + strat_time);
	timediff = timediff / 1000;
	//if(access_token == "" || jsapi_ticket == "" || Number(timediff) > 7200){
	if(1 == 1) {
		console.log("first access_token");
		//1.获取access_token
		var url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + appId + "&secret=" + appSecret;
		request(url, function(err, response, body) {
			if(!err && response.statusCode == 200) {
				console.log("body:" + body);
				var o = JSON.parse(body);
				access_token = o.access_token;
				console.log("access_token:" + access_token);
				//2.获取jsapi_ticket
				var url_jsapi = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=' + access_token + '&type=jsapi';
				request(url_jsapi, function(err_jsapi, response_jsapi, body_jsapi) {
					if(!err_jsapi && response_jsapi.statusCode == 200) {
						console.log("body_jsapi:" + body_jsapi);
						jsapi_ticket = (JSON.parse(body_jsapi)).ticket;
						console.log("jsapi_ticket:" + jsapi_ticket);
						strat_time = new Date();
						var signature = sign(jsapi_ticket, nonceStr, timestamp, wx_url);
						//var url_info = 'https://api.weixin.qq.com/cgi-bin/user/info?access_token='+access_token+'&openid=oEDF2xBoerpEFGh3brZPkWfVRZZg&lang=zh_CN';
						var url_info = 'https://api.weixin.qq.com/cgi-bin/user/get?access_token=' + access_token + '&next_openid=';
						request(url_info, function(err_info, response_info, body_info) {
							if(!err_info && response_info.statusCode == 200) {

								res.render('weixin_js', {
									signature: signature,
									jsapi_ticket: jsapi_ticket,
									body_info: body_info
								});
							}
						});
					}
				});
			}
		});
	} else {
		console.log("not first access_token");
		var signature = sign(jsapi_ticket, nonceStr, timestamp, wx_url);
		//var url_info = 'https://api.weixin.qq.com/cgi-bin/user/info?access_token='+access_token+'&openid=oEDF2xBoerpEFGh3brZPkWfVRZZg&lang=zh_CN';
		var url_info = 'https://api.weixin.qq.com/cgi-bin/user/get?access_token=' + access_token + '&next_openid=';
		request(url_info, function(err_info, response_info, body_info) {
			if(!err_info && response_info.statusCode == 200) {
				res.render('weixin_js', {
					signature: signature,
					jsapi_ticket: jsapi_ticket,
					body_info: body_info
				});
			}
		});
	}
}

exports.uploadimg = function(req, res) {
	var media_id = req.param('media_id');
	var url = 'http://file.api.weixin.qq.com/cgi-bin/media/get?access_token=' + access_token + '&media_id=' + media_id;
	request(url, function(err, response, body) {
		if(!err && response.statusCode == 200) {
			console.log(body);
			/*
			var type = response.headers["content-type"];
			    response.setEncoding('binary');
			    var data = {
			        type: type,
			        body: body
			    };
			    var img = new Buffer(body, 'binary');
			    fs.writeFile('message.jpg', img, function (err) {
			      if (err) throw err;
			      console.log('It\'s saved!');
			    });
			*/
		}
	});
}

var createNonceStr = function() {
	return Math.random().toString(36).substr(2, 15);
};

function paysign(appid, attach, body, mch_id, nonce_str, notify_url, openid, out_trade_no, spbill_create_ip, total_fee, trade_type) {
	var ret = {
		appid: appid,
		attach: attach,
		body: body,
		mch_id: mch_id,
		nonce_str: nonce_str,
		notify_url: notify_url,
		//openid:openid,
		out_trade_no: out_trade_no,
		spbill_create_ip: spbill_create_ip,
		total_fee: total_fee,
		trade_type: trade_type
	};
	var string = raw(ret);
	string = string + '&key=1234567890abcdefghijklmnopqrstuv';
	var crypto = require('crypto');
	return crypto.createHash('md5').update(string, 'utf8').digest('hex');
};

function paysignjsapi(appid, attach, body, mch_id, nonce_str, notify_url, openid, out_trade_no, spbill_create_ip, total_fee, trade_type) {
	var ret = {
		appid: appid,
		attach: attach,
		body: body,
		mch_id: mch_id,
		nonce_str: nonce_str,
		notify_url: notify_url,
		openid: openid,
		out_trade_no: out_trade_no,
		spbill_create_ip: spbill_create_ip,
		total_fee: total_fee,
		trade_type: trade_type
	};
	var string = raw(ret);
	string = string + '&key=1234567890abcdefghijklmnopqrstuv';
	var crypto = require('crypto');
	return crypto.createHash('md5').update(string, 'utf8').digest('hex');
};

exports.pay = function(req, res) {
	console.log('run--p1');
	var bookingNo = req.query.bookingNo;
	var total_fee = req.query.total_fee;
	//var total_fee = 1;
	var body = "外卖费用";
	var url = "https://api.mch.weixin.qq.com/pay/unifiedorder";
	var formData = "<xml>";
	formData += "<appid>wxe2a20ae8d978330b</appid>"; //appid
	formData += "<attach>test</attach>";
	formData += "<body>" + body + "</body>";
	formData += "<mch_id>1282215201</mch_id>"; //商户号
	formData += "<nonce_str>ibuaiVcKdpRxkhJA</nonce_str>";
	formData += "<notify_url>http://www.4000191177.com/pay</notify_url>";
	//formData  += "<openid>oEDF2xBoerpEFGh3brZPkWfVRZZg</openid>";
	formData += "<out_trade_no>" + bookingNo + "</out_trade_no>";
	formData += "<spbill_create_ip>14.23.150.211</spbill_create_ip>";
	formData += "<total_fee>" + total_fee + "</total_fee>";
	formData += "<trade_type>NATIVE</trade_type>";
	//formData  += "<sign>66191B931A9919156237AD17E40856E7</sign>";
	formData += "<sign>" + paysign('wxe2a20ae8d978330b', 'test', body, '1282215201', 'ibuaiVcKdpRxkhJA', 'http://www.4000191177.com/pay', 'oEDF2xBoerpEFGh3brZPkWfVRZZg', bookingNo, '14.23.150.211', total_fee, 'NATIVE') + "</sign>";
	formData += "</xml>";
	console.log(formData);
	request({
		url: url,
		method: 'POST',
		body: formData
	}, function(err, response, body) {
		if(!err && response.statusCode == 200) {
			console.log('run--p2');
			console.log(body);
			var prepay_id = getXMLNodeValue('prepay_id', body.toString("utf-8"));
			var tmp = prepay_id.split('[');
			var tmp1 = tmp[2].split(']');
			//console.log(tmp1[0]);
			var code_url = getXMLNodeValue('code_url', body.toString("utf-8"));
			var tmp = code_url.split('[');
			var tmp3 = tmp[2].split(']');
			
			res.render('pay', {
				prepay_id: tmp1[0],
				code_url: tmp3[0],
				total_fee: total_fee / 100
			});

			//res.redirect(tmp3[0]);
		}
	});
}

exports.jsapipay = function(req, res) {
	var bookingNo = req.query.bookingNo;
	var total_fee = req.query.total_fee;
	var openid = req.session.openid;
	console.log('openid:' + openid);
	//var total_fee = 1;
	var body = "外卖费用";
	var url = "https://api.mch.weixin.qq.com/pay/unifiedorder";
	var formData = "<xml>";
	formData += "<appid>wxe2a20ae8d978330b</appid>"; //appid
	formData += "<attach>test</attach>";
	formData += "<body>" + body + "</body>";
	formData += "<mch_id>1282215201</mch_id>"; //商户号
	formData += "<nonce_str>ibuaiVcKdpRxkhJA</nonce_str>";
	formData += "<notify_url>http://www.4000191177.com/pay</notify_url>";
	formData += "<openid>" + openid + "</openid>";
	formData += "<out_trade_no>" + bookingNo + "</out_trade_no>";
	formData += "<spbill_create_ip>14.23.150.211</spbill_create_ip>";
	formData += "<total_fee>" + total_fee + "</total_fee>";
	formData += "<trade_type>JSAPI</trade_type>";
	//formData  += "<sign>66191B931A9919156237AD17E40856E7</sign>";
	formData += "<sign>" + paysignjsapi('wxe2a20ae8d978330b', 'test', body, '1282215201', 'ibuaiVcKdpRxkhJA', 'http://www.4000191177.com/pay', openid, bookingNo, '14.23.150.211', total_fee, 'JSAPI') + "</sign>";
	formData += "</xml>";
	request({
		url: url,
		method: 'POST',
		body: formData
	}, function(err, response, body) {
		if(!err && response.statusCode == 200) {
			console.log(body);
			var prepay_id = getXMLNodeValue('prepay_id', body.toString("utf-8"));
			var tmp = prepay_id.split('[');
			var tmp1 = tmp[2].split(']');
			//签名
			var _paySignjs = paysignjs('wxe2a20ae8d978330b', 'ibuaiVcKdpRxkhJA', 'prepay_id=' + tmp1[0], 'MD5', '1414411784');
			res.render('jsapipay', {
				prepay_id: tmp1[0],
				_paySignjs: _paySignjs,
				bookingNo:bookingNo
			});
			//res.render('jsapipay',{rows:body});
			//res.redirect(tmp3[0]);
		}
	});
}

function paysignjs(appid, nonceStr, package, signType, timeStamp) {
	var ret = {
		appId: appid,
		nonceStr: nonceStr,
		package: package,
		signType: signType,
		timeStamp: timeStamp
	};
	var string = raw1(ret);
	string = string + '&key=1234567890abcdefghijklmnopqrstuv';
	console.log(string);
	var crypto = require('crypto');
	return crypto.createHash('md5').update(string, 'utf8').digest('hex');
};

function raw1(args) {
	var keys = Object.keys(args);
	keys = keys.sort()
	var newArgs = {};
	keys.forEach(function(key) {
		newArgs[key] = args[key];
	});

	var string = '';
	for(var k in newArgs) {
		string += '&' + k + '=' + newArgs[k];
	}
	string = string.substr(1);
	return string;
};

exports.wechat = function(req, res) {

	var echostr, nonce, signature, timestamp;
	signature = req.query.signature;
	timestamp = req.query.timestamp;
	nonce = req.query.nonce;
	echostr = req.query.echostr;
	if(check(timestamp, nonce, signature, "weixin")) {
		return res.send(echostr);
	} else {
		return res.end();
	}
};

function check(timestamp, nonce, signature, token) {
	var currSign, tmp;
	tmp = [token, timestamp, nonce].sort().join("");
	currSign = crypto.createHash("sha1").update(tmp).digest("hex");
	return currSign === signature;
};

exports.wechatdo = function(req, res) {
	var _da;
	req.on("data", function(data) {
		_da = data.toString("utf-8");

	});
	req.on("end", function() {
		//console.log("end");
		var ToUserName = getXMLNodeValue('ToUserName', _da);
		var FromUserName = getXMLNodeValue('FromUserName', _da);
		var CreateTime = getXMLNodeValue('CreateTime', _da);
		var MsgType = getXMLNodeValue('MsgType', _da);
		var Content = getXMLNodeValue('Content', _da);
		var MsgId = getXMLNodeValue('MsgId', _da);
		console.log(ToUserName);
		console.log(FromUserName);
		console.log(CreateTime);
		console.log(MsgType);
		console.log(Content);
		console.log(MsgId);
		var xml = '<xml><ToUserName>' + FromUserName + '</ToUserName><FromUserName>' + ToUserName + '</FromUserName><CreateTime>' + CreateTime + '</CreateTime><MsgType>' + MsgType + '</MsgType><Content>' + Content + '</Content></xml>';
		res.send(xml);
	});
};

exports.paydo = function(req, res) {
	var _da;
	req.on("data", function(data) {
		_da = data.toString("utf-8");

	});
	req.on("end", function() {
		console.log(_da);
		var out_trade_no = getXMLNodeValue('out_trade_no', _da.toString("utf-8"));
		var tmp = out_trade_no.split('[');
		var tmp1 = tmp[2].split(']');
		var bookingno = tmp1[0];
		var sql1 = "update sbooking set state_id = 3 where state_id = 1 and bookingno = '" + bookingno + "'";
		mysql.query(sql1, function(error, obj) {
			if(error) {
				console.log(error);
				return false;
			}
			console.log(bookingno + '微信付款成功');
		});
		//console.log(tmp1[0]);
	});
};

function getXMLNodeValue(node_name, xml) {
	var tmp = xml.split("<" + node_name + ">");
	var _tmp = tmp[1].split("</" + node_name + ">");
	return _tmp[0];
}

exports.erp_index = function(req, res) {
	var sql1 = "select * from c_material order by id desc";
	var sql2 = "select * from store order by id desc";
	var sql3 = "select * from category order by id desc";
	var sql4 = "select * from material_category";
	mysql.query(sql1, function(error, obj2) {
		if(error) {
			console.log(error);
			return false;
		}
		mysql.query(sql2, function(error, obj) {
			if(error) {
				console.log(error);
				return false;
			}
			mysql.query(sql3, function(error, obj3) {
				if(error) {
					console.log(error);
					return false;
				}
				mysql.query(sql4, function(error, obj4) {
					if(error) {
						console.log(error);
						return false;
					}
					res.render('erp/index', {
						obj: obj,
						obj2: obj2,
						obj3: obj3,
						obj4: obj4
					});
				});
			});
		});
	});
};

exports.erp_material = function(req, res) {
	var sql1 = "select * from c_material order by id desc";
	var sql2 = "select * from material_category";
	var sql3 = "select * from gys";
	mysql.query(sql1, function(error, obj) {
		if(error) {
			console.log(error);
			return false;
		}
		mysql.query(sql2, function(error, obj2) {
			if(error) {
				console.log(error);
				return false;
			}
			mysql.query(sql3, function(error, obj3) {
				if(error) {
					console.log(error);
					return false;
				}
				res.render('erp/material', {
					obj: obj,
					obj2: obj2,
					obj3: obj3
				});
			});
		});
	});
};

exports.erpdo = function(req, res) {
	erp.sqldo(req, res);
};

exports.erp_putin = function(req, res) {
	var sql1 = "select * from c_material order by id desc";
	var sql2 = "select * from category order by id desc";
	var sql3 = "select * from store order by id desc";
	mysql.query(sql1, function(error, obj2) {
		if(error) {
			console.log(error);
			return false;
		}
		mysql.query(sql2, function(error, obj3) {
			if(error) {
				console.log(error);
				return false;
			}
			mysql.query(sql3, function(error, obj4) {
				if(error) {
					console.log(error);
					return false;
				}
				res.render('erp/putin', {
					obj2: obj2,
					obj3: obj3,
					obj4: obj4
				});
			});
		});
	});
};

exports.erp_stock = function(req, res) {
	var k_store = req.query.s;
	var k_category = req.query.p;
	var k_no = req.query.q;
	var k_cate = k_category;
	var k_s = k_store;
	var k_n = req.query.n;
	k_category = k_category == '所有' ? '' : k_category;
	k_store = k_store == '所有' ? '' : k_store;
	k_no = k_no ? k_no : "";
	k_n = k_n ? k_n : "";
	var k_n1 = "";
	if(k_n != "") {
		var tmp = k_n.split(".");
		k_n1 = tmp[1];
	}
	//var sql1 = "select * from stock where category like '%"+k_category+"%' and num > 0 order by id desc";
	//var sql1 = "select * from c_stock where store like '%" + k_store + "%' and name like '%" + k_n1 + "%' and no like '" + k_no + "%' and category = '" + k_category + "'  order by no desc";
	//if(k_category == '') {
	//	sql1 = "select * from c_stock where store like '%" + k_store + "%' and name like '%" + k_n1 + "%' and no like '" + k_no + "%'  order by no desc";
	//}
	var sql1 = "select * from stock";
	console.log(sql1);
	var sql2 = "select * from category order by id desc";
	var sql3 = "select * from material_category";
	var sql4 = "select * from store order by id desc";
	var sql5 = "select * from c_material order by id desc";
	console.log(sql1);
	mysql.query(sql1, function(error, obj2) {
		if(error) {
			console.log(error);
			return false;
		}
		mysql.query(sql2, function(error, obj3) {
			if(error) {
				console.log(error);
				return false;
			}
			mysql.query(sql3, function(error, obj4) {
				if(error) {
					console.log(error);
					return false;
				}
				mysql.query(sql4, function(error, obj5) {
					if(error) {
						console.log(error);
						return false;
					}
					mysql.query(sql5, function(error, obj6) {
						if(error) {
							console.log(error);
							return false;
						}
						/*计算库存结余金额*/
						var totalout = 0;
						for(var i in obj2) {
							totalout += (obj2[i].unitPrice) * (obj2[i].num);
						}
						totalout = Math.round(totalout * 100) / 100;
						res.render('erp/stock', {
							obj2: obj2,
							k_cate: k_cate,
							obj3: obj3,
							obj4: obj4,
							obj5: obj5,
							obj6: obj6,
							k_no: k_no,
							k_store: k_s,
							k_n: k_n,
							totalout: totalout
						});
					});
				});
			});
		});
	});
};

exports.erp_putout = function(req, res) {
	var sql1 = "select * from c_stock order by id desc";
	var sql2 = "select * from category order by id desc";
	var sql3 = "select * from c_material order by id desc";
	var sql4 = "select * from store order by id desc";
	var sql5 = "select * from material_category";
	mysql.query(sql1, function(error, obj2) {
		if(error) {
			console.log(error);
			return false;
		}
		//res.render('erp/putout',{obj2:obj2});
		mysql.query(sql2, function(error, obj3) {
			if(error) {
				console.log(error);
				return false;
			}
			mysql.query(sql3, function(error, obj4) {
				if(error) {
					console.log(error);
					return false;
				}
				mysql.query(sql4, function(error, obj5) {
					if(error) {
						console.log(error);
						return false;
					}
					mysql.query(sql5, function(error, obj6) {
						if(error) {
							console.log(error);
							return false;
						}
						res.render('erp/putout', {
							obj2: obj2,
							obj3: obj3,
							obj4: obj4,
							obj5: obj5,
							obj6: obj6
						});
					});
				});
			});
		});
	});
};

exports.erp_byday = function(req, res) {
	var sql1 = "select * from c_material order by id desc";
	var sql2 = "select * from category order by id desc";
	var sql3 = "select * from store order by id desc";
	var sql4 = "select * from material_category";
	mysql.query(sql1, function(error, obj2) {
		if(error) {
			console.log(error);
			return false;
		}
		mysql.query(sql2, function(error, obj3) {
			if(error) {
				console.log(error);
				return false;
			}
			mysql.query(sql3, function(error, obj4) {
				if(error) {
					console.log(error);
					return false;
				}
				mysql.query(sql4, function(error, obj5) {
					if(error) {
						console.log(error);
						return false;
					}
					res.render('erp/byday', {
						obj2: obj2,
						obj3: obj3,
						obj4: obj4,
						obj5: obj5
					});
				});
			});
		});
	});
};

exports.erp_bymonth = function(req, res) {
	var sql1 = "select * from c_material order by id desc";
	var sql2 = "select * from category order by id desc";
	var sql3 = "select * from store order by id desc";
	var sql4 = "select * from material_category";
	mysql.query(sql1, function(error, obj2) {
		if(error) {
			console.log(error);
			return false;
		}
		mysql.query(sql2, function(error, obj3) {
			if(error) {
				console.log(error);
				return false;
			}
			mysql.query(sql3, function(error, obj4) {
				if(error) {
					console.log(error);
					return false;
				}
				mysql.query(sql4, function(error, obj5) {
					if(error) {
						console.log(error);
						return false;
					}
					res.render('erp/bymonth', {
						obj2: obj2,
						obj3: obj3,
						obj4: obj4,
						obj5: obj5
					});
				});
			});
		});
	});
};

exports.erp_category = function(req, res) {
	var sql1 = "select * from category order by id desc";
	var sql2 = "select * from store order by id desc";
	mysql.query(sql1, function(error, obj) {
		if(error) {
			console.log(error);
			return false;
		}
		mysql.query(sql2, function(error, obj2) {
			if(error) {
				console.log(error);
				return false;
			}
			res.render('erp/category', {
				obj: obj,
				obj2: obj2
			});
		});
	});
};

exports.erp_store = function(req, res) {
	var sql1 = "select * from store order by name desc";
	mysql.query(sql1, function(error, obj) {
		if(error) {
			console.log(error);
			return false;
		}
		res.render('erp/store', {
			obj: obj
		});
	});
};

exports.erp_gys = function(req, res) {
	var sql1 = "select * from gys order by id desc";
	mysql.query(sql1, function(error, obj) {
		if(error) {
			console.log(error);
			return false;
		}
		res.render('erp/gys', {
			obj: obj
		});
	});
};

exports.erp_cmaterial = function(req, res) {
	var sql1 = "select * from material_category order by id desc";
	mysql.query(sql1, function(error, obj) {
		if(error) {
			console.log(error);
			return false;
		}
		res.render('erp/cmaterial', {
			obj: obj
		});
	});
};

exports.erp_role = function(req, res) {
	var sql1 = "select * from c_role order by id desc";
	var sql2 = "select * from rolecat order by id desc";
	var sql3 = "select * from store order by id desc";
	mysql.query(sql1, function(error, obj) {
		if(error) {
			console.log(error);
			return false;
		}
		mysql.query(sql2, function(error, obj2) {
			if(error) {
				console.log(error);
				return false;
			}
			mysql.query(sql3, function(error, obj3) {
				if(error) {
					console.log(error);
					return false;
				}
				res.render('erp/role', {
					obj: obj,
					obj2: obj2,
					obj3: obj3
				});
			});
		});
	});
};

exports.erp_log = function(req, res) {
	var sql1 = "select * from v_stock_log order by id desc";
	mysql.query(sql1, function(error, obj) {
		if(error) {
			console.log(error);
			return false;
		}
		for(var i in obj){
			obj[i].createAt = (obj[i].createAt).Format("yyyy-MM-dd hh:mm:ss")
		}
		res.render('erp/log', {
			obj: obj
		});
	});
};

exports.erp_home = function(req, res) {
	res.render('erp/home', {});
};

/*store begin*/
exports.s_list = function(req, res) {
	var sql3 = "select m.maincourse,m.jardiniere,m.staplefood,m.imgname,m.id,m.name,m.price,m.aheadprice,r.numtoday,r.numtomorrow from menu m left join repertory r on r.menuid = m.id order by m.sortid asc";
	console.log(sql3);
	mysql.query(sql3, function(err3, rows3) {
		if(err3) {
			console.log(err3);
			return false;
		}
		res.render('store/list', {
			url: req.url,
			menu_s: rows3
		});
	});
}

exports.s_cart = function(req, res) {
	res.render('store/cart');
}

exports.s_bookingsuccess = function(req, res) {
	var alipay_id = req.session.alipay_id;
	var sql1 = "update sbooking set state_id = 3 where state_id = 1 and bookingno = '" + alipay_id + "'";
	console.log(sql1);
	mysql.query(sql1, function(error, obj) {
		if(error) {
			console.log(error);
			return false;
		}
		res.render('store/bookingsuccess', {
			no: alipay_id
		});
	});
};

exports.s_kitchen = function(req, res) {
	res.render('store/kitchen');
}

exports.s_wait = function(req, res) {
	res.render('store/wait');
}

exports.s_print = function(req, res) {
	res.render('store/print');
}

exports.s_cprint = function(req, res) {
	res.render('store/cprint');
}

exports.s_tprint = function(req, res) {
	res.render('store/temp_print');
}

exports.scan_js = function(req, res) {
		var timestamp = parseInt(new Date().getTime() / 1000) + '';
		var nonceStr = Math.random().toString(36).substr(2, 15);
		var appId = "wxe2a20ae8d978330b";
		var appSecret = "5160fed55fa7f8cffe2677213b270608";
		var wx_url = "http://www.4000191177.com" + req.url;
		console.log("wx_url:" + wx_url);
		//判断access_token和jsapi_ticket是否已经获得，并且时效在2小时(7200s)以内
		var end_time = new Date();
		var timediff = end_time.getTime() - strat_time.getTime() //时间差的毫秒数
			//console.log(end_time + "-->" + strat_time);
		timediff = timediff / 1000;
		//if(access_token == "" || jsapi_ticket == "" || Number(timediff) > 7200){
		if(1 == 1) {
			console.log("first access_token");
			//1.获取access_token
			var url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + appId + "&secret=" + appSecret;
			request(url, function(err, response, body) {
				if(!err && response.statusCode == 200) {
					console.log("body:" + body);
					var o = JSON.parse(body);
					access_token = o.access_token;
					console.log("access_token:" + access_token);
					//2.获取jsapi_ticket
					var url_jsapi = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=' + access_token + '&type=jsapi';
					request(url_jsapi, function(err_jsapi, response_jsapi, body_jsapi) {
						if(!err_jsapi && response_jsapi.statusCode == 200) {
							console.log("body_jsapi:" + body_jsapi);
							jsapi_ticket = (JSON.parse(body_jsapi)).ticket;
							console.log("jsapi_ticket:" + jsapi_ticket);
							strat_time = new Date();
							var signature = sign(jsapi_ticket, nonceStr, timestamp, wx_url);
							//var url_info = 'https://api.weixin.qq.com/cgi-bin/user/info?access_token='+access_token+'&openid=oEDF2xBoerpEFGh3brZPkWfVRZZg&lang=zh_CN';
							var url_info = 'https://api.weixin.qq.com/cgi-bin/user/get?access_token=' + access_token + '&next_openid=';
							request(url_info, function(err_info, response_info, body_info) {
								if(!err_info && response_info.statusCode == 200) {

									res.render('scan', {
										signature: signature,
										jsapi_ticket: jsapi_ticket,
										body_info: body_info
									});
								}
							});
						}
					});
				}
			});
		} else {
			console.log("not first access_token");
			var signature = sign(jsapi_ticket, nonceStr, timestamp, wx_url);
			//var url_info = 'https://api.weixin.qq.com/cgi-bin/user/info?access_token='+access_token+'&openid=oEDF2xBoerpEFGh3brZPkWfVRZZg&lang=zh_CN';
			var url_info = 'https://api.weixin.qq.com/cgi-bin/user/get?access_token=' + access_token + '&next_openid=';
			request(url_info, function(err_info, response_info, body_info) {
				if(!err_info && response_info.statusCode == 200) {
					res.render('scan', {
						signature: signature,
						jsapi_ticket: jsapi_ticket,
						body_info: body_info
					});
				}
			});
		}
	}
	/*store end*/

exports.tp = function(req, res) {
	var url = 'http://0101.9pintang.cn/mobile.php?act=module&do=votes&name=classvote&weid=2099&vid=32&zid=431&yzm=';
	request({
		url: url,
		method: 'POST'
	}, function(err, response, body) {
		console.log(response.statusCode);
		if(!err && response.statusCode == 200) {
			console.log(body);
			console.log(response);
		}else{
			console.log(err);
		}
	});
};