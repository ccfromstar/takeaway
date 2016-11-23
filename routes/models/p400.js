var mysql;
mysql = require('./db');

var alipay = require('../../alipay_config').alipay;

exports.sqldo = function(req, res) {
	var _sql = req.params.sql;
	if(_sql == "checkUser") {
		checkUser(req, res);
	} else if(_sql == "createDoc") {
		createbooking(req, res);
	} else if(_sql == "createDocFront") {
		createbookingfront(req, res);
	} else if(_sql == "createDocWeixin") {
		createbookingweixin(req, res);
	} else if(_sql == "createDocStore") {
		createbookingstore(req, res);
	} else if(_sql == "success") {
		_400success(req, res);
	} else if(_sql == "getpay") {
		getpay(req, res);
	}
};

exports.getsql = function(req, res) {
	var sql1 = "select id,username,name from user";
	var sql2 = "select id,name,b_starttime,i_starttime,b_endtime,i_endtime,sender,tel from address";
	var sql3 = "select m.id,m.name,m.price,m.aheadprice,r.numtoday,r.numtomorrow from menu m left join repertory r on r.menuid = m.id order by m.sortid asc";
	mysql.query(sql1, function(err1, rows1) {
		if(err1) {
			console.log(err1);
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
				res.render('cms/400', {
					url: req.url,
					user_s: rows1,
					address_s: rows2,
					menu_s: rows3
				});
			});
		});
	});
};

function getpay(req, res) {
	var id = req.param('id');
	var sql1 = "select state_id from sbooking where bookingno = '" + id + "'";
	mysql.query(sql1, function(error, obj) {
		if(error) {
			console.log(error);
			return false;
		}
		if(obj[0].state_id == 2) {
			req.session.alipay_id = id;
			res.send("200");
		} else {
			res.send("400");
		}

	});
}

function _400success(req, res) {
	res.render('cms/400success', {
		url: "/cms/400"
	});
}

function createbooking(req, res) {
	//创建订单和价格明细
	var sendtime = req.body.sendtime1;
	var type = (Number(req.body.isToday) == 1) ? "即点" : "预定";
	var pricetotal = req.body.retailpricetotal;
	var isInvoice = req.body.isInvoice;
	var invoicetitle = req.body.invoicetitle;
	var addressdetail = req.body.addressdetail;
	var linkname = req.body.linkname;
	var linktel = req.body.linktel1;
	var addressname = req.body.addressname;
	var numtotal = req.body.numtotal1;
	var isSysuser = req.body.isSysuser;
	var pricetotalold = req.body.pricetotalold;
	var sender = req.body.sender;
	var tel = req.body.tel;
	var remark = req.body.remark;
	var myDate = new Date();
	var y = myDate.getFullYear() + "";
	var m = (((myDate.getMonth() + 1) + "").length == 1) ? "0" + (myDate.getMonth() + 1) : (myDate.getMonth() + 1) + "";
	var d = (((myDate.getDate()) + "").length == 1) ? "0" + (myDate.getDate()) : (myDate.getDate()) + "";
	//创建订单表
	var sql2;
	//订单编号规则:年+月+日+三位流水号
	var bookingno = y + m + d;
	var sqls = "select count(*) as count from booking where bookingno like '" + bookingno + "%'";
	mysql.query(sqls, function(errs, rowss) {
		if(errs) {
			console.log(errs);
			return false;
		}
		var _bno = rowss[0].count;
		_bno += 1;
		_bno += "";
		if(_bno.length == 1) {
			_bno = "00" + _bno;
		} else if(_bno.length == 2) {
			_bno = "0" + _bno;
		}
		bookingno = bookingno + _bno;
		var sql1 = "insert into booking (bookingno,bookingtime,sendtime,pricetotal,isInvoice,invoicetitle,status,addressdetail,type,linkname,linktel,source,addressname,paytype,numtotal,pricetotalold,sender,tel,remark) values ('" + bookingno +
			"',now(),'" + sendtime + "'," + pricetotal + "," + isInvoice + ",'" + invoicetitle + "','配送中','" + addressdetail + "','" + type + "','" + linkname + "','" + linktel +
			"','400','" + addressname + "','货到付款'," + numtotal + "," + pricetotalold + ",'" + sender + "','" + tel + "','" + remark + "')";
		mysql.query(sql1, function(err1, rows1) {
			if(err1) {
				console.log(err1);
				return false;
			}
			//生成明细表
			var _id = rows1.insertId;
			var detail_1 = (req.body.detail_1).split(",");
			var detail_2 = (req.body.detail_2).split(",");
			var detail_3 = (req.body.detail_3).split(",");
			var detail_4 = (req.body.detail_4).split(",");
			var detail_5 = (req.body.detail_5).split(",");
			var detail_6 = (req.body.detail_6).split(",");
			var menu_len = Number(req.body.menu_len);
			var list = '';
			for(var i = 0; i < menu_len; i++) {
				if(Number(detail_4[i] != 0)) {
					var sql4 = "insert into booking_price (bookingid,name,price,aheadprice,num,pricetotal,remark) values (" + _id + ",'" + detail_1[i] + "'," + detail_2[i] + "," + detail_3[i] + "," + detail_4[i] + "," + detail_5[i] + ",'" + detail_6[i] + "')";
					mysql.query(sql4, function(err4, rows4) {
						if(err4) {
							console.log(err4);
							return false;
						}
					});
					list = list + detail_1[i] + "：" + detail_4[i] + "份 ";
				}
			}
			var sql32 = "update booking set detail = '" + list + "' where id = " + _id;
			mysql.query(sql32, function(err32, rows32) {
				if(err32) {
					console.log(err32);
					return false;
				}
			});
			//减库存
			var detail_7 = (req.body.detail_7).split(",");

			var sql5;
			if(Number(req.body.isToday) == 1) {
				for(var i = 0; i < menu_len; i++) {
					if(Number(detail_4[i] != 0)) {
						sql5 = "update repertory set numtoday = numtoday - " + detail_4[i] + " where menuid = " + detail_7[i];
						mysql.query(sql5, function(err5, rows5) {
							if(err5) {
								console.log(err5);
								return false;
							}
						});
					}
				}
			} else {
				for(var i = 0; i < menu_len; i++) {
					if(Number(detail_4[i] != 0)) {
						sql5 = "update repertory set numtomorrow = numtomorrow - " + detail_4[i] + " where menuid = " + detail_7[i];
						mysql.query(sql5, function(err5, rows5) {
							if(err5) {
								console.log(err5);
								return false;
							}
						});
					}
				}
			}
			//判断用户是否存在，如果不存在，新建用户
			if(isSysuser == "0") {
				sql2 = "insert into user (username,name,password,favorable,number,numtotal) values ('" + linktel + "','" + linkname + "','123456','',1," + pricetotal + ")";
				mysql.query(sql2, function(err2, rows2) {
					if(err2) {
						console.log(err2);
						return false;
					}
				});
			} else {
				//如果存在favorable = "";number = number + 1;numtotal = numtotal + numtotal;
				sql2 = "select id,number,numtotal from user where username = '" + linktel + "'";
				mysql.query(sql2, function(err2, rows2) {
					if(err2) {
						console.log(err2);
						return false;
					}
					var _number = Number(rows2[0].number) + 1;
					var _numtotal = Number(rows2[0].numtotal) + Number(pricetotal);
					var sql3 = "update user set favorable = '',number=" + _number + ",numtotal=" + _numtotal + " where id = " + rows2[0].id;
					mysql.query(sql3, function(err3, rows3) {
						if(err3) {
							console.log(err3);
							return false;
						}
					});
				});
			}
			res.redirect("/cms/s400");
		});
	});
}

function createbookingstore(req, res) {
	var pricetotal = req.body.price;
	var detail = req.body.detail;
	var paytype = req.body.paytype1;
	var myDate = new Date();
	var y = myDate.getFullYear() + "";
	var m = (((myDate.getMonth() + 1) + "").length == 1) ? "0" + (myDate.getMonth() + 1) : (myDate.getMonth() + 1) + "";
	var d = (((myDate.getDate()) + "").length == 1) ? "0" + (myDate.getDate()) : (myDate.getDate()) + "";
	//创建订单表
	var sql2;
	//订单编号规则:年+月+日+三位流水号
	var bookingno = y + m + d;
	var sqls = "select count(*) as count from sbooking where bookingno like '" + bookingno + "%'";
	console.log(sqls);
	mysql.query(sqls, function(errs, rowss) {
		if(errs) {
			console.log(errs);
			return false;
		}
		var _bno = rowss[0].count;
		_bno += 1;
		_bno += "";
		if(_bno.length == 1) {
			_bno = "00" + _bno;
		} else if(_bno.length == 2) {
			_bno = "0" + _bno;
		}
		bookingno = bookingno + _bno;
		var sql1 = "insert into sbooking (bookingno,pricetotal,detail) values ('" + bookingno + "'," + pricetotal + ",'" + detail + "')";
		console.log(sql1);
		mysql.query(sql1, function(err1, rows1) {
			if(err1) {
				console.log(err1);
				return false;
			}

			if(paytype == "支付宝") {
				//跳转到支付宝的支付界面
				var data = {
					out_trade_no: bookingno,
					subject: "外卖点餐",
					total_fee: pricetotal,
					body: "",
					show_url: ""
				};

				req.session.alipay_id = bookingno;

				alipay.create_direct_pay_by_user(data, res);

			} else if(paytype == "微信") {
				//跳转到微信的支付界面
				res.redirect('/pay?bookingNo=' + bookingno + '&total_fee=' + (pricetotal * 100));
			}
		});
	});
}

function createbookingfront(req, res) {
	//创建订单和价格明细
	var sendtime = req.body.sendtime1;
	var type = (Number(req.body.isToday) == 1) ? "即点" : "预定";
	var pricetotal = req.body.retailpricetotal;
	var isInvoice = req.body.isInvoice;
	var invoicetitle = req.body.invoicetitle;
	var addressdetail = req.body.addressdetail;
	var linkname = req.body.linkname;
	var linktel = req.body.linktel;
	var addressname = req.body.addressname;
	var numtotal = req.body.numtotal1;
	var isSysuser = req.body.isSysuser;
	var pricetotalold = req.body.pricetotalold;
	var sender = req.body.sender;
	var tel = req.body.tel;
	var paytype = req.body.paytype1;
	var myDate = new Date();
	var y = myDate.getFullYear() + "";
	var m = (((myDate.getMonth() + 1) + "").length == 1) ? "0" + (myDate.getMonth() + 1) : (myDate.getMonth() + 1) + "";
	var d = (((myDate.getDate()) + "").length == 1) ? "0" + (myDate.getDate()) : (myDate.getDate()) + "";
	//创建订单表
	var sql2;
	//订单编号规则:年+月+日+三位流水号
	var bookingno = y + m + d;
	var sqls = "select count(*) as count from booking where bookingno like '" + bookingno + "%'";
	mysql.query(sqls, function(errs, rowss) {
		if(errs) {
			console.log(errs);
			return false;
		}
		var _bno = rowss[0].count;
		_bno += 1;
		_bno += "";
		if(_bno.length == 1) {
			_bno = "00" + _bno;
		} else if(_bno.length == 2) {
			_bno = "0" + _bno;
		}
		bookingno = bookingno + _bno;
		var sql1 = "insert into booking (bookingno,bookingtime,sendtime,pricetotal,isInvoice,invoicetitle,status,addressdetail,type,linkname,linktel,source,addressname,paytype,numtotal,pricetotalold,sender,tel) values ('" + bookingno +
			"',now(),'" + sendtime + "'," + pricetotal + "," + isInvoice + ",'" + invoicetitle + "','未付款','" + addressdetail + "','" + type + "','" + linkname + "','" + linktel +
			"','网站','" + addressname + "','" + paytype + "'," + numtotal + "," + pricetotalold + ",'" + sender + "','" + tel + "')";
		mysql.query(sql1, function(err1, rows1) {
			if(err1) {
				console.log(err1);
				return false;
			}
			//生成明细表
			var _id = rows1.insertId;
			var detail_1 = (req.body.detail_1).split(",");
			var detail_2 = (req.body.detail_2).split(",");
			var detail_3 = (req.body.detail_3).split(",");
			var detail_4 = (req.body.detail_4).split(",");
			var detail_5 = (req.body.detail_5).split(",");
			var detail_6 = (req.body.detail_6).split(",");
			var menu_len = Number(req.body.menu_len);
			var list = '';
			for(var i = 0; i < menu_len; i++) {
				if(Number(detail_4[i] != 0)) {
					var sql4 = "insert into booking_price (bookingid,name,price,aheadprice,num,pricetotal,remark) values (" + _id + ",'" + detail_1[i] + "'," + detail_2[i] + "," + detail_3[i] + "," + detail_4[i] + "," + detail_5[i] + ",'" + detail_6[i] + "')";
					mysql.query(sql4, function(err4, rows4) {
						if(err4) {
							console.log(err4);
							return false;
						}
					});
					list = list + detail_1[i] + "：" + detail_4[i] + "份 ";
				}
			}
			var sql32 = "update booking set detail = '" + list + "' where id = " + _id;
			mysql.query(sql32, function(err32, rows32) {
				if(err32) {
					console.log(err32);
					return false;
				}
			});

			//减库存
			var detail_7 = (req.body.detail_7).split(",");

			var sql5;
			if(Number(req.body.isToday) == 1) {
				for(var i = 0; i < menu_len; i++) {
					if(Number(detail_4[i] != 0)) {
						sql5 = "update repertory set numtoday = numtoday - " + detail_4[i] + " where menuid = " + detail_7[i];
						mysql.query(sql5, function(err5, rows5) {
							if(err5) {
								console.log(err5);
								return false;
							}
						});
					}
				}
			} else {
				for(var i = 0; i < menu_len; i++) {
					if(Number(detail_4[i] != 0)) {
						sql5 = "update repertory set numtomorrow = numtomorrow - " + detail_4[i] + " where menuid = " + detail_7[i];
						mysql.query(sql5, function(err5, rows5) {
							if(err5) {
								console.log(err5);
								return false;
							}
						});
					}
				}
			}
			//判断用户是否存在，如果不存在，新建用户
			if(isSysuser == "0") {
				sql2 = "insert into user (username,name,password,favorable,number,numtotal) values ('" + linktel + "','" + linkname + "','123456','',1," + pricetotal + ")";
				mysql.query(sql2, function(err2, rows2) {
					if(err2) {
						console.log(err2);
						return false;
					}
				});
			} else {
				//如果存在favorable = "";number = number + 1;numtotal = numtotal + numtotal;
				sql2 = "select id,number,numtotal from user where username = '" + linktel + "'";
				mysql.query(sql2, function(err2, rows2) {
					if(err2) {
						console.log(err2);
						return false;
					}
					var _number = Number(rows2[0].number) + 1;
					var _numtotal = Number(rows2[0].numtotal) + Number(pricetotal);
					var sql3 = "update user set favorable = '',number=" + _number + ",numtotal=" + _numtotal + " where id = " + rows2[0].id;
					mysql.query(sql3, function(err3, rows3) {
						if(err3) {
							console.log(err3);
							return false;
						}
					});
				});
			}
			req.session.favorable = "";
			//res.redirect("/bookingsuccess");
			if(paytype == "支付宝") {
				//跳转到支付宝的支付界面
				var data = {
					out_trade_no: bookingno,
					subject: "外卖点餐",
					total_fee: pricetotal,
					body: "",
					show_url: ""
				};

				req.session.alipay_id = bookingno;

				alipay.create_direct_pay_by_user(data, res);
			} else if(paytype == "货到付款") {
				req.session.alipay_id = bookingno;
				res.redirect("/bookingsuccess");
			} else if(paytype == "微信") {
				//跳转到微信的支付界面
				res.redirect('/pay?bookingNo=' + bookingno + '&total_fee=' + (pricetotal * 100));
			}
		});
	});
}

function createbookingweixin(req, res) {
	//创建订单和价格明细
	var sendtime = req.body.sendtime1;
	var type = (Number(req.body.isToday) == 1) ? "即点" : "预定";
	var pricetotal = req.body.retailpricetotal;
	var isInvoice = req.body.isInvoice;
	var invoicetitle = req.body.invoicetitle;
	var addressdetail = req.body.addressdetail;
	var linkname = req.body.linkname;
	var linktel = req.body.linktel;
	var addressname = req.body.addressname;
	var numtotal = req.body.numtotal1;
	var isSysuser = req.body.isSysuser;
	var pricetotalold = req.body.pricetotalold;
	var sender = req.body.sender;
	var tel = req.body.tel;
	var paytype = req.body.paytype1;
	var myDate = new Date();
	var y = myDate.getFullYear() + "";
	var m = (((myDate.getMonth() + 1) + "").length == 1) ? "0" + (myDate.getMonth() + 1) : (myDate.getMonth() + 1) + "";
	var d = (((myDate.getDate()) + "").length == 1) ? "0" + (myDate.getDate()) : (myDate.getDate()) + "";
	//创建订单表
	var sql2;
	//订单编号规则:年+月+日+三位流水号
	var bookingno = y + m + d;
	var sqls = "select count(*) as count from booking where bookingno like '" + bookingno + "%'";
	mysql.query(sqls, function(errs, rowss) {
		if(errs) {
			console.log(errs);
			return false;
		}
		var _bno = rowss[0].count;
		_bno += 1;
		_bno += "";
		if(_bno.length == 1) {
			_bno = "00" + _bno;
		} else if(_bno.length == 2) {
			_bno = "0" + _bno;
		}
		bookingno = bookingno + _bno;
		var status = "未付款";
		if(paytype == "货到付款") {
			status = "配送中";
		}
		var sql1 = "insert into booking (bookingno,bookingtime,sendtime,pricetotal,isInvoice,invoicetitle,status,addressdetail,type,linkname,linktel,source,addressname,paytype,numtotal,pricetotalold,sender,tel) values ('" + bookingno +
			"',now(),'" + sendtime + "'," + pricetotal + "," + isInvoice + ",'" + invoicetitle + "','" + status + "','" + addressdetail + "','" + type + "','" + linkname + "','" + linktel +
			"','微信','" + addressname + "','" + paytype + "'," + numtotal + "," + pricetotalold + ",'" + sender + "','" + tel + "')";
		//console.log(sql1);
		mysql.query(sql1, function(err1, rows1) {
			if(err1) {
				console.log(err1);
				return false;
			}
			//生成明细表
			var _id = rows1.insertId;
			var detail_1 = (req.body.detail_1).split(",");
			var detail_2 = (req.body.detail_2).split(",");
			var detail_3 = (req.body.detail_3).split(",");
			var detail_4 = (req.body.detail_4).split(",");
			var detail_5 = (req.body.detail_5).split(",");
			var detail_6 = (req.body.detail_6).split(",");
			var menu_len = Number(req.body.menu_len);
			var list = '';
			for(var i = 0; i < menu_len; i++) {
				if(Number(detail_4[i] != 0)) {
					var sql4 = "insert into booking_price (bookingid,name,price,aheadprice,num,pricetotal,remark) values (" + _id + ",'" + detail_1[i] + "'," + detail_2[i] + "," + detail_3[i] + "," + detail_4[i] + "," + detail_5[i] + ",'" + detail_6[i] + "')";
					mysql.query(sql4, function(err4, rows4) {
						if(err4) {
							console.log(err4);
							return false;
						}
					});
					list = list + detail_1[i] + "：" + detail_4[i] + "份 ";
				}
			}
			var sql32 = "update booking set detail = '" + list + "' where id = " + _id;
			mysql.query(sql32, function(err32, rows32) {
				if(err32) {
					console.log(err32);
					return false;
				}
			});
			//减库存
			var detail_7 = (req.body.detail_7).split(",");

			var sql5;
			if(Number(req.body.isToday) == 1) {
				for(var i = 0; i < menu_len; i++) {
					if(Number(detail_4[i] != 0)) {
						sql5 = "update repertory set numtoday = numtoday - " + detail_4[i] + " where menuid = " + detail_7[i];
						mysql.query(sql5, function(err5, rows5) {
							if(err5) {
								console.log(err5);
								return false;
							}
						});
					}
				}
			} else {
				for(var i = 0; i < menu_len; i++) {
					if(Number(detail_4[i] != 0)) {
						sql5 = "update repertory set numtomorrow = numtomorrow - " + detail_4[i] + " where menuid = " + detail_7[i];
						mysql.query(sql5, function(err5, rows5) {
							if(err5) {
								console.log(err5);
								return false;
							}
						});
					}
				}
			}
			//判断用户是否存在，如果不存在，新建用户
			if(isSysuser == "0") {
				sql2 = "insert into user (username,name,password,favorable,number,numtotal) values ('" + linktel + "','" + linkname + "','123456','',1," + pricetotal + ")";
				mysql.query(sql2, function(err2, rows2) {
					if(err2) {
						console.log(err2);
						return false;
					}
				});
			} else {
				//如果存在favorable = "";number = number + 1;numtotal = numtotal + numtotal;
				sql2 = "select id,number,numtotal from user where username = '" + linktel + "'";
				mysql.query(sql2, function(err2, rows2) {
					if(err2) {
						console.log(err2);
						return false;
					}
					var _number = Number(rows2[0].number) + 1;
					var _numtotal = Number(rows2[0].numtotal) + Number(pricetotal);
					var sql3 = "update user set favorable = '',number=" + _number + ",numtotal=" + _numtotal + " where id = " + rows2[0].id;
					mysql.query(sql3, function(err3, rows3) {
						if(err3) {
							console.log(err3);
							return false;
						}
					});
				});
			}
			req.session.favorable = "";
			//res.redirect("/weixin/bookingsuccess");
			if(paytype == "微信") {
				//跳转到微信的支付界面
				res.redirect('jsapipay?bookingNo=' + bookingno + '&total_fee=' + (pricetotal * 100));
			} else if(paytype == "货到付款") {
				// req.session.alipay_id = bookingno;
				res.redirect("/weixin/bookingsuccess");
			}
		});
	});
}

function checkUser(req, res) {
	var tel = req.param('tel');
	var sql1 = "select number,name from user where username = '" + tel + "'";
	mysql.query(sql1, function(error, obj) {
		if(error) {
			console.log(error);
			return false;
		}
		var info = "";
		if(!obj[0]) {
			info = "p1@";
		} else {
			if(obj[0].number == 0) {
				info = "p2@" + obj[0].name;
			} else {
				info = "p3@" + obj[0].name;
			}
		}
		res.send(info);
	});
}