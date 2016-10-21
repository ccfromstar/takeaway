var mysql, LIMIT, ejsExcel, fs;
mysql = require('./db');
LIMIT = 5;
ejsExcel = require("./ejsExcel");
fs = require("fs");

exports.sqldo = function(req, res) {
	var _sql = req.params.sql;
	if(_sql == "insertM") {
		insertM(req, res);
	} else if(_sql == "delM") {
		delM(req, res);
	} else if(_sql == "getOrd") {
		getOrd(req, res);
	} else if(_sql == "insertOrd") {
		insertOrd(req, res);
	} else if(_sql == "delOrd") {
		delOrd(req, res);
	} else if(_sql == "getPutIn") {
		getPutIn(req, res);
	} else if(_sql == "insertPutin") {
		insertPutin(req, res);
	} else if(_sql == "delPutin") {
		delPutin(req, res);
	} else if(_sql == "getStock") {
		getStock(req, res);
	} else if(_sql == "insertPutout") {
		insertPutout(req, res);
	} else if(_sql == "getPutout") {
		getPutout(req, res);
	} else if(_sql == "delPutout") {
		delPutout(req, res);
	} else if(_sql == "getPutInbyDay") {
		getPutInbyDay(req, res);
	} else if(_sql == "getPutoutbyDay") {
		getPutoutbyDay(req, res);
	} else if(_sql == "getPutInbyMonth") {
		getPutInbyMonth(req, res);
	} else if(_sql == "getPutoutbyMonth") {
		getPutoutbyMonth(req, res);
	} else if(_sql == "toExcelorderlist") {
		toExcelorderlist(req, res);
	} else if(_sql == "toExcelputin") {
		toExcelputin(req, res);
	} else if(_sql == "toExcelstock") {
		toExcelstock(req, res);
	} else if(_sql == "toExcelputout") {
		toExcelputout(req, res);
	} else if(_sql == "insertC") {
		insertC(req, res);
	} else if(_sql == "delC") {
		delC(req, res);
	} else if(_sql == "toExcelputinM") {
		toExcelputinM(req, res);
	} else if(_sql == "toExcelputoutM") {
		toExcelputoutM(req, res);
	} else if(_sql == "insertStore") {
		insertStore(req, res);
	} else if(_sql == "delStore") {
		delStore(req, res);
	} else if(_sql == "insertCM") {
		insertCM(req, res);
	} else if(_sql == "delCM") {
		delCM(req, res);
	} else if(_sql == "getUninOrd") {
		getUninOrd(req, res);
	} else if(_sql == "delRole") {
		delRole(req, res);
	} else if(_sql == "insertRole") {
		insertRole(req, res);
	} else if(_sql == "changeOrderNum") {
		changeOrderNum(req, res);
	}
	
};

function setFileName() {
	var myDate = new Date();
	var y = myDate.getFullYear();
	var m = (((myDate.getMonth() + 1) + "").length == 1) ? "0" + (myDate.getMonth() + 1) : (myDate.getMonth() + 1);
	var d = myDate.getDate();
	var hh = myDate.getHours();
	var mm = myDate.getMinutes();
	var ss = myDate.getSeconds();
	return "~" + y + m + d + hh + mm + ss + ".xlsx";
}

/*导出采购单*/
function toExcelorderlist(req, res) {
	var k_store = req.param('k_store');
	var k_category = req.param('k_category');
	var k_date = req.param('k_date');
	k_store = k_store == '所有' ? '' : k_store;
	k_category = k_category == '所有' ? '' : k_category;
	var ks = k_store == '' ? '所有门店' : k_store;
	var kc = k_category == '' ? '所有分类' : k_category;
	//获得Excel模板的buffer对象
	var exlBuf = fs.readFileSync("./public/excelop/template/orderlist.xlsx");
	var excelname = setFileName();
	//数据源
	var sql1 = "select * from c_orderlist where store like '%"+k_store+"%' and category like '%" + k_category + "%' and date = '" + k_date + "' order by no desc";
	mysql.query(sql1, function(error, obj) {
		if(error) {
			console.log(error);
			return false;
		}
		//用数据源(对象)data渲染Excel模板
		var obj_str = '[ [{"date": "' + k_date + ' ' + ks + ' ' + kc + '"}],';
		obj_str += JSON.stringify(obj) + "]";
		ejsExcel.renderExcelCb(exlBuf, JSON.parse(obj_str), function(exlBuf2) {
			fs.writeFileSync("./public/excelop/temp/" + excelname, exlBuf2);
			res.send(excelname);
		});
	});
}

/*导出入库单*/
function toExcelputin(req, res) {
	var k_store = req.param('k_store');
	var k_category = req.param('k_category');
	var k_date = req.param('k_date');
	var k_date_end = req.param('k_date_end');
	k_store = k_store == '所有' ? '' : k_store;
	k_category = k_category == '所有' ? '' : k_category;
	var ks = k_store == '' ? '所有门店' : k_store;
	var kc = k_category == '' ? '所有分类' : k_category;
	//获得Excel模板的buffer对象
	var exlBuf = fs.readFileSync("./public/excelop/template/putin.xlsx");
	var excelname = setFileName();
	//数据源
	//var sql1 = "select * from c_putin where category like '%"+k_category+"%' and date = '"+k_date+"' order by id desc";
	var sql1 = "select * from c_putin where store like '%"+k_store+"%' and category = '" + k_category + "' and date >= '" + k_date + "' and date <= '" + k_date_end + "' order by id desc";
	if(k_category == '') {
		sql1 = "select * from c_putin where store like '%"+k_store+"%' and date >= '" + k_date + "' and date <= '" + k_date_end + "' order by id desc";
	}
	mysql.query(sql1, function(error, obj) {
		if(error) {
			console.log(error);
			return false;
		}
		//用数据源(对象)data渲染Excel模板
		var obj_str = '[ [{"date": "' + k_date + "~" + k_date_end + ' ' + ks + ' ' + kc + '"}],';
		obj_str += JSON.stringify(obj) + "]";
		//console.log(obj_str);
		ejsExcel.renderExcelCb(exlBuf, JSON.parse(obj_str), function(exlBuf2) {
			fs.writeFileSync("./public/excelop/temp/" + excelname, exlBuf2);
			res.send(excelname);
		});
	});
}

/*导出月度入库单*/
function toExcelputinM(req, res) {
	var k_category = req.param('k_category');
	var k_date = req.param('k_date');
	var k_name = req.param('k_name');
	k_category = k_category == '所有' ? '' : k_category;
	k_name = k_name == '所有' ? '' : k_name;
	//获得Excel模板的buffer对象
	var exlBuf = fs.readFileSync("./public/excelop/template/putinm.xlsx");
	var excelname = setFileName();
	//数据源
	var sql1 = "select * from c_putin where category = '" + k_category + "' and name like '%" + k_name + "%' and date like '" + k_date + "%' order by id desc";
	if(k_category == '') {
		sql1 = "select * from c_putin where name like '%" + k_name + "%' and date like '" + k_date + "%' order by id desc";
	}
	mysql.query(sql1, function(error, obj) {
		if(error) {
			console.log(error);
			return false;
		}
		//用数据源(对象)data渲染Excel模板
		var obj_str = '[ [{"date": "' + k_date + '"}],';
		obj_str += JSON.stringify(obj) + "]";
		//console.log(obj_str);
		ejsExcel.renderExcelCb(exlBuf, JSON.parse(obj_str), function(exlBuf2) {
			fs.writeFileSync("./public/excelop/temp/" + excelname, exlBuf2);
			res.send(excelname);
		});
	});
}

/*导出库存单*/
function toExcelstock(req, res) {
	var k_store = req.param('k_store');
	var k_category = req.param('k_category');
	k_store = k_store == '所有' ? '' : k_store;
	k_category = k_category == '所有' ? '' : k_category;
	//获得Excel模板的buffer对象
	var exlBuf = fs.readFileSync("./public/excelop/template/stock.xlsx");
	var excelname = setFileName();
	//数据源
	//var sql1 = "select * from stock where category like '%"+k_category+"%' and num > 0 order by id desc";
	var sql1 = "select * from c_stock where store like '%"+k_store+"%' and category = '" + k_category + "'  order by no desc";
	if(k_category == '') {
		sql1 = "select * from c_stock where store like '%"+k_store+"%' order by no desc";
	}
	mysql.query(sql1, function(error, obj) {
		if(error) {
			console.log(error);
			return false;
		}
		//用数据源(对象)data渲染Excel模板
		ejsExcel.renderExcelCb(exlBuf, obj, function(exlBuf2) {
			fs.writeFileSync("./public/excelop/temp/" + excelname, exlBuf2);
			res.send(excelname);
		});
	});
}

/*导出出库单*/
function toExcelputout(req, res) {
	var k_category = req.param('k_category');
	var k_store = req.param('k_store');
	var k_date = req.param('k_date');
	var k_date_end = req.param('k_date_end');
	k_category = k_category == '所有' ? '' : k_category;
	k_store = k_store == '所有' ? '' : k_store;
	var ks = k_store == '' ? '所有门店' : k_store;
	var kc = k_category == '' ? '所有分类' : k_category;
	//获得Excel模板的buffer对象
	var exlBuf = fs.readFileSync("./public/excelop/template/putout.xlsx");
	var excelname = setFileName();
	//数据源
	//var sql1 = "select * from putout where category like '%"+k_category+"%' and date = '"+k_date+"' order by id desc";
	var sql1 = "select * from c_putout where store like '%"+k_store+"%' and category = '" + k_category + "' and date >= '" + k_date + "' and date <= '" + k_date_end + "' order by id desc";
	if(k_category == '') {
		sql1 = "select * from c_putout where store like '%"+k_store+"%' and date >= '" + k_date + "' and date <= '" + k_date_end + "' order by id desc";
	}
	mysql.query(sql1, function(error, obj) {
		if(error) {
			console.log(error);
			return false;
		}
		//用数据源(对象)data渲染Excel模板
		var obj_str = '[ [{"date": "' + k_date + "~" + k_date_end  + ' ' + ks + ' ' + kc + '"}],';
		obj_str += JSON.stringify(obj) + "]";
		ejsExcel.renderExcelCb(exlBuf, JSON.parse(obj_str), function(exlBuf2) {
			fs.writeFileSync("./public/excelop/temp/" + excelname, exlBuf2);
			res.send(excelname);
		});
	});
}

/*导出月度出库单*/
function toExcelputoutM(req, res) {
	var k_category = req.param('k_category');
	var k_date = req.param('k_date');
	var k_name = req.param('k_name');
	var k_hasInvoice = req.param('k_hasInvoice');
	k_category = k_category == '所有' ? '' : k_category;
	k_name = k_name == '所有' ? '' : k_name;
	k_hasInvoice = k_hasInvoice == '所有' ? '' : k_hasInvoice;
	//获得Excel模板的buffer对象
	var exlBuf = fs.readFileSync("./public/excelop/template/putoutm.xlsx");
	var excelname = setFileName();
	//数据源
	var sql1 = "select * from c_putout where category = '" + k_category + "' and name like '%" + k_name + "%' and date like '" + k_date + "%' order by id desc";
	if(k_category == '') {
		sql1 = "select * from c_putout where name like '%" + k_name + "%' and date like '" + k_date + "%' order by id desc";
	}
	mysql.query(sql1, function(error, obj) {
		if(error) {
			console.log(error);
			return false;
		}
		//用数据源(对象)data渲染Excel模板
		var obj_str = '[ [{"date": "' + k_date + '"}],';
		obj_str += JSON.stringify(obj) + "]";
		ejsExcel.renderExcelCb(exlBuf, JSON.parse(obj_str), function(exlBuf2) {
			fs.writeFileSync("./public/excelop/temp/" + excelname, exlBuf2);
			res.send(excelname);
		});
	});
}

function insertM(req, res) {
	var name = req.param('name');
	var cate_id = req.param('cate_id');
	var unit = req.param('unit');
	var sql1 = "insert into material (name,cate_id,unit) values ('" + name + "'," + cate_id + ",'" + unit + "')";
	mysql.query(sql1, function(error, row) {
		if(error) {
			console.log(error);
			return false;
		}
		res.send('200');
	});
};

function insertStore(req, res) {
	var name = req.param('name');
	var sql1 = "insert into store (name) values ('" + name + "')";
	mysql.query(sql1, function(error, row) {
		if(error) {
			console.log(error);
			return false;
		}
		res.send('200');
	});
};

function delStore(req, res) {
	var id = req.param('id');
	var sql1 = "delete from store where id = " + id;
	mysql.query(sql1, function(error, row) {
		if(error) {
			console.log(error);
			return false;
		}
		res.send('200');
	});
};

function insertC(req, res) {
	var name = req.param('name');
	var sname = req.param('sname');
	var sql1 = "insert into category (name,sname) values ('" + name + "','" + sname + "')";
	mysql.query(sql1, function(error, row) {
		if(error) {
			console.log(error);
			return false;
		}
		res.send('200');
	});
};

function delC(req, res) {
	var id = req.param('id');
	var sql1 = "delete from category where id = " + id;
	mysql.query(sql1, function(error, row) {
		if(error) {
			console.log(error);
			return false;
		}
		res.send('200');
	});
};

function insertOrd(req, res) {
	var name = req.param('name');
	var store = req.param('store');
	var category = req.param('category');
	var date = req.param('date');
	var num = req.param('num');
	/*先获取库存里是否有，有的话计算出单价*/
	var sql0 = "select * from stock where name = '"+name+"' and store = '"+store+"' and category = '"+category+"'";
	mysql.query(sql0, function(error, row0) {
		if(error) {
			console.log(error);
			return false;
		}
		var unitPrice = 0;
		if(row0[0]){
			unitPrice = row0[0].unitPrice;
		}
		var sql1 = "insert into orderlist (store,name,category,date,num,unitPrice) values ('" + store + "','" + name + "','" + category + "','" + date + "','" + num + "',"+unitPrice+")";
		mysql.query(sql1, function(error, row) {
			if(error) {
				console.log(error);
				return false;
			}
			res.send('200');
		});
	});
};

function delM(req, res) {
	var id = req.param('id');
	var sql1 = "delete from material where id = " + id;
	mysql.query(sql1, function(error, row) {
		if(error) {
			console.log(error);
			return false;
		}
		res.send('200');
	});
};

function getOrd(req, res) {
	var k_store = req.param('k_store');
	var k_category = req.param('k_category');
	var k_date = req.param('k_date');
	k_category = k_category == '所有' ? '' : k_category;
	k_store = k_store == '所有' ? '' : k_store;
	var sql1 = "select * from c_orderlist where store like '%" + k_store + "%' and category like '%" + k_category + "%' and date = '" + k_date + "' order by no desc";
	console.log(sql1);
	mysql.query(sql1, function(error, rows) {
		if(error) {
			console.log(error);
			return false;
		}
		res.json(rows);
	});
};

function delOrd(req, res) {
	var id = req.param('id');
	var sql1 = "delete from orderlist where id = " + id;
	mysql.query(sql1, function(error, row) {
		if(error) {
			console.log(error);
			return false;
		}
		res.send('200');
	});
};

function getPutIn(req, res) {
	var k_store = req.param('k_store');
	var k_category = req.param('k_category');
	var k_date = req.param('k_date');
	var k_date_end = req.param('k_date_end');
	k_category = k_category == '所有' ? '' : k_category;
	k_store = k_store == '所有' ? '' : k_store;
	var sql1 = "select * from c_putin where store like '%"+k_store+"%' and category = '" + k_category + "' and date >= '" + k_date + "' and date <= '" + k_date_end + "' order by id desc";
	if(k_category == '') {
		sql1 = "select * from c_putin where store like '%"+k_store+"%' and date >= '" + k_date + "' and date <= '" + k_date_end + "' order by id desc";
	}
	console.log(sql1);
	mysql.query(sql1, function(error, rows) {
		if(error) {
			console.log(error);
			return false;
		}
		res.json(rows);
	});
};

function getPutInbyDay(req, res) {
	var k_store = req.param('k_store');
	var k_category = req.param('k_category');
	var k_date = req.param('k_date');
	var k_date_end = req.param('k_date_end');
	var k_name = req.param('k_name');
	k_store = k_store == '所有' ? '' : k_store;
	k_category = k_category == '所有' ? '' : k_category;
	k_name = k_name == '所有' ? '' : k_name;
	var sql1 = "select * from c_putin where store like '%"+k_store+"%' and category like '%" + k_category + "%' and name like '%" + k_name + "%' and  date >= '" + k_date + "' and date <= '" + k_date_end + "' order by id desc";
	console.log(sql1);
	mysql.query(sql1, function(error, rows) {
		if(error) {
			console.log(error);
			return false;
		}
		res.json(rows);
	});
};

function getPutInbyMonth(req, res) {
	var k_store = req.param('k_store');
	var k_category = req.param('k_category');
	var k_date = req.param('k_date');
	var k_name = req.param('k_name');
	k_store = k_store == '所有' ? '' : k_store;
	k_category = k_category == '所有' ? '' : k_category;
	k_name = k_name == '所有' ? '' : k_name;
	var sql1 = "select * from c_putin where store like '%"+k_store+"%' and category = '" + k_category + "' and name like '%" + k_name + "%'  and date like '" + k_date + "%' order by id desc";
	if(k_category == '') {
		sql1 = "select * from c_putin where store like '%"+k_store+"%' and name like '%" + k_name + "%' and  date like '" + k_date + "%' order by id desc";
	}
	console.log(sql1);
	mysql.query(sql1, function(error, rows) {
		if(error) {
			console.log(error);
			return false;
		}
		res.json(rows);
	});
};

function insertPutin(req, res) {
	var total = Number(req.param('total'));
	var num = Number(req.param('num'));
	var id = Number(req.param('id'));
	//先根据id得到采购清单数据
	var sql0 = "select * from orderlist where id = " + id;
	mysql.query(sql0, function(error, r0) {
		if(error) {
			console.log(error);
			return false;
		}
		//计算单价 = 总价/数量
		//var num = Number(r0[0].num);
		var unitPrice = total / num;
		unitPrice = Math.round(unitPrice * 100) / 100;
		//差价 = 总价 - 数量*单价
		var difference = total - num * unitPrice;
		/*把状态设置为已入库*/
		var sql00 = "update orderlist set inStock = '已入库' where id = " + id;
		mysql.query(sql00, function(error, is1) {
			if(error) {
				console.log(error);
				return false;
			}
			var sql1 = "insert into putin (name,category,date,num,total,store,unitPrice,difference) values ('" + r0[0].name + "','" + r0[0].category + "','" + r0[0].date + "','" + num + "'," + total + ",'" + r0[0].store + "'," + unitPrice + "," + difference + ")";
			mysql.query(sql1, function(error, row) {
				if(error) {
					console.log(error);
					return false;
				}
				//入库
				//1.判断是否库存已存在
				//var sql2 = "select * from stock where name = '"+name+"' and unitPrice = "+unitPrice+" and category = '"+category+"'";
				var sql2 = "select * from stock where name = '" + r0[0].name + "' and category = '" + r0[0].category + "' and store = '"+r0[0].store+"'";
				mysql.query(sql2, function(error, row2) {
					if(error) {
						console.log(error);
						return false;
					}
					var sql3 = "";
					if(row2[0]) {
						//库存存在，单价做加权平均
						var n_unitPrice = (row2[0].num * row2[0].unitPrice + num * unitPrice) / (row2[0].num + num);
						n_unitPrice = Math.round(n_unitPrice * 100) / 100;
						sql3 = "update stock set num = " + (row2[0].num + num) + ",unitPrice = " + n_unitPrice + " where id = " + row2[0].id;
					} else {
						//库存不存在，新增
						sql3 = "insert into stock (name,unitPrice,num,category,store) values ('" + r0[0].name + "'," + unitPrice + "," + num + ",'" + r0[0].category + "','"+r0[0].store+"')";
					}
					mysql.query(sql3, function(error, row3) {
						if(error) {
							console.log(error);
							return false;
						}
						res.send('200');
					});
				});
			});
		});
	});
};

function delPutin(req, res) {
	var id = req.param('id');
	var category = req.param('category');
	var unitPrice = req.param('unitPrice');
	var name = req.param('name');
	var num = req.param('num');
	//先判断库存数是不是小于删除的数量
	var sql0 = "select * from stock where name = '" + name + "' and category = '" + category + "'";
	mysql.query(sql0, function(error, row0) {
		if(error) {
			console.log(error);
			return false;
		}
		if(row0[0].num < num) {
			res.send('300');
		} else {
			var sql1 = "delete from putin where id = " + id;
			mysql.query(sql1, function(error, row) {
				if(error) {
					console.log(error);
					return false;
				}
				//库存中删除相应的库存数,单价做加权平均
				var n_unitPrice = (row0[0].num * row0[0].unitPrice - num * unitPrice) / (row0[0].num - num);
				//console.log(row0[0].num);
				//console.log(row0[0].unitPrice);
				//console.log(num);
				//console.log(unitPrice);
				//console.log(n_unitPrice);
				n_unitPrice = Math.round(n_unitPrice * 100) / 100;
				var sql2 = "update stock set num = num-" + num + ",unitPrice = '" + n_unitPrice + "' where name = '" + name + "' and category = '" + category + "'";
				//console.log(sql2);
				mysql.query(sql2, function(error, row2) {
					if(error) {
						console.log(error);
						return false;
					}
					res.send('200');
				});
			});
		}
	});
};

function getStock(req, res) {
	var k_store = req.param('k_store');
	var k_category = req.param('k_category');
	var k_name = req.param('k_name');
	k_store = k_store == '所有' ? '' : k_store;
	k_category = k_category == '所有' ? '' : k_category;
	k_name = k_name == '所有' ? '' : k_name;
	var sql1 = "select * from c_stock where store like '%"+k_store+"%' and category = '" + k_category + "' and name like '%" + k_name + "%' and num > 0 order by id desc";
	if(k_category == '') {
		sql1 = "select * from c_stock where store like '%"+k_store+"%' and name like '%" + k_name + "%' and num > 0 order by id desc";
	}
	console.log(sql1);
	mysql.query(sql1, function(error, rows) {
		if(error) {
			console.log(error);
			return false;
		}
		res.json(rows);
	});
};

function insertPutout(req, res) {
	var store = req.param('store');
	var name = req.param('name');
	var category = req.param('category');
	var date = req.param('date');
	var num = Number(req.param('num'));
	var unitPrice = Number(req.param('unitPrice'));
	var id = req.param('id');
	var total = num * unitPrice;
	//插入出库记录
	var sql1 = "insert into putout (name,category,date,num,unitPrice,total,store) values ('" + name + "','" + category + "','" + date + "'," + num + "," + unitPrice + "," + total + ",'"+store+"')";
	mysql.query(sql1, function(error, row) {
		if(error) {
			console.log(error);
			return false;
		}
		//库存中扣除相应的库存数
		var sql2 = "update stock set num = num - " + num + " where id = " + id;
		mysql.query(sql2, function(error, row2) {
			if(error) {
				console.log(error);
				return false;
			}
			res.send('200');
		});
	});
};

function getPutout(req, res) {
	//var sql1 = "select * from putout where category like '%"+k_category+"%' and date = '"+k_date+"' order by id desc";
	var k_category = req.param('k_category');
	var k_store = req.param('k_store');
	var k_date = req.param('k_date');
	var k_date_end = req.param('k_date_end');
	k_category = k_category == '所有' ? '' : k_category;
	k_store = k_store == '所有' ? '' : k_store;
	var sql1 = "select * from c_putout where store like '%"+k_store+"%' and category = '" + k_category + "' and date >= '" + k_date + "' and date <= '" + k_date_end + "' order by id desc";
	if(k_category == '') {
		sql1 = "select * from c_putout where store like '%"+k_store+"%' and date >= '" + k_date + "' and date <= '" + k_date_end + "' order by id desc";
	}
	console.log(sql1);
	mysql.query(sql1, function(error, rows) {
		if(error) {
			console.log(error);
			return false;
		}
		res.json(rows);
	});
};

function getPutoutbyDay(req, res) {
	var k_store = req.param('k_store');
	var k_category = req.param('k_category');
	var k_date = req.param('k_date');
	var k_date_end = req.param('k_date_end');
	var k_name = req.param('k_name');
	k_store = k_store == '所有' ? '' : k_store;
	k_category = k_category == '所有' ? '' : k_category;
	k_name = k_name == '所有' ? '' : k_name;
	var sql1 = "select * from putout where store like '%"+k_store+"%' and category like '%" + k_category + "%' and name like '%" + k_name + "%' and date >= '" + k_date + "' and date <= '" + k_date_end + "' order by id desc";
	console.log(sql1);
	mysql.query(sql1, function(error, rows) {
		if(error) {
			console.log(error);
			return false;
		}
		res.json(rows);
	});
};

function getPutoutbyMonth(req, res) {
	var k_store = req.param('k_store');
	var k_category = req.param('k_category');
	var k_date = req.param('k_date');
	var k_name = req.param('k_name');
	var k_hasInvoice = req.param('k_hasInvoice');
	k_store = k_store == '所有' ? '' : k_store;
	k_category = k_category == '所有' ? '' : k_category;
	k_name = k_name == '所有' ? '' : k_name;
	var sql1 = "select * from c_putout where store like '%"+k_store+"%' and category = '" + k_category + "' and name like '%" + k_name + "%' and date like '" + k_date + "%' order by id desc";
	if(k_category == '') {
		sql1 = "select * from c_putout where store like '%"+k_store+"%' and name like '%" + k_name + "%' and date like '" + k_date + "%' order by id desc";
	}
	console.log(sql1);
	mysql.query(sql1, function(error, rows) {
		if(error) {
			console.log(error);
			return false;
		}
		res.json(rows);
	});
};

function delPutout(req, res) {
	var id = req.param('id');
	var category = req.param('category');
	var unitPrice = req.param('unitPrice');
	var name = req.param('name');
	var num = req.param('num');
	var sql1 = "delete from putout where id = " + id;
	mysql.query(sql1, function(error, row) {
		if(error) {
			console.log(error);
			return false;
		}
		//库存中增加相应的库存数
		var sql2 = "update stock set num = num+" + num + " where name = '" + name + "' and unitPrice = " + unitPrice + " and category = '" + category + "'";
		mysql.query(sql2, function(error, row2) {
			if(error) {
				console.log(error);
				return false;
			}
			res.send('200');
		});
	});
};

function insertCM(req, res) {
	var name = req.param('name');
	var no = req.param('no');
	var sql1 = "insert into material_category (name,no) values ('" + name + "','" + no + "')";
	mysql.query(sql1, function(error, row) {
		if(error) {
			console.log(error);
			return false;
		}
		res.send('200');
	});
};

function delCM(req, res) {
	var id = req.param('id');
	var sql1 = "delete from material_category where id = " + id;
	mysql.query(sql1, function(error, row) {
		if(error) {
			console.log(error);
			return false;
		}
		res.send('200');
	});
};

function getUninOrd(req, res) {
	var sql1 = "select * from c_orderlist where inStock = '未入库' order by id desc";
	mysql.query(sql1, function(error, rows) {
		if(error) {
			console.log(error);
			return false;
		}
		res.json(rows);
	});
};

function delRole(req, res) {
	var id = req.param('id');
	var sql1 = "delete from erprole where id = " + id;
	mysql.query(sql1, function(error, row) {
		if(error) {
			console.log(error);
			return false;
		}
		res.send('200');
	});
};

function insertRole(req, res) {
	var username = req.param('username');
	var password = req.param('password');
	var name = req.param('name');
	var role_id = req.param('role_id');
	var store = req.param('store');
	var sql1 = "insert into erprole (username,password,name,role_id,store) values ('" + username + "','" + password + "','" + name + "'," + role_id + ",'" + store + "')";
	mysql.query(sql1, function(error, row) {
		if(error) {
			console.log(error);
			return false;
		}
		res.send('200');
	});
};

function changeOrderNum(req,res){
	var num = req.param('num');
	var id = req.param('id');
	var sql1 = "update orderlist set num = "+num + "where id = "+id;
	mysql.query(sql1, function(error, row) {
		if(error) {
			console.log(error);
			return false;
		}
		res.send('200');
	});
}
