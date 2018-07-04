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
	} else if(_sql == "getMatById") {
		getMatById(req, res);
	} else if(_sql == "getGYSById") {
		getGYSById(req, res);
	} else if(_sql == "insertOrd") {
		insertOrd(req, res);
	} else if(_sql == "insertOrdFrm") {
		insertOrdFrm(req, res);
	} else if(_sql == "insertOrdFrm1") {
		insertOrdFrm1(req, res);
	} else if(_sql == "insertOrdFrm2") {
		insertOrdFrm2(req, res);
	} else if(_sql == "insertGYS") {
		insertGYS(req, res);
	} else if(_sql == "delOrd") {
		delOrd(req, res);
	} else if(_sql == "delGYS") {
		delGYS(req, res);
	} else if(_sql == "delOrd1") {
		delOrd1(req, res);
	} else if(_sql == "delOrdh") {
		delOrdh(req, res);
	} else if(_sql == "delOrdh1") {
		delOrdh1(req, res);
	} else if(_sql == "getPutIn") {
		getPutIn(req, res);
	} else if(_sql == "insertPutin") {
		insertPutin(req, res);
	}  else if(_sql == "insertPutin1") {
		insertPutin1(req, res);
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
	} else if(_sql == "Printorderlist") {
		Printorderlist(req, res);
	} else if(_sql == "toExcelputin") {
		toExcelputin(req, res);
	} else if(_sql == "Printputin") {
		Printputin(req, res);
	} else if(_sql == "toExcelstock") {
		toExcelstock(req, res);
	} else if(_sql == "Printstock") {
		Printstock(req, res);
	} else if(_sql == "toExcelputout") {
		toExcelputout(req, res);
	} else if(_sql == "Printputout") {
		Printputout(req, res);
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
	}  else if(_sql == "delfrmOrd") {
		delfrmOrd(req, res);
	} else if(_sql == "insertCM") {
		insertCM(req, res);
	} else if(_sql == "delCM") {
		delCM(req, res);
	} else if(_sql == "getUninOrd") {
		getUninOrd(req, res);
	}  else if(_sql == "getUninOrd1") {
		getUninOrd1(req, res);
	} else if(_sql == "delRole") {
		delRole(req, res);
	} else if(_sql == "insertRole") {
		insertRole(req, res);
	} else if(_sql == "changeOrderNum") {
		changeOrderNum(req, res);
	} else if(_sql == "toExcelMat") {
		toExcelMat(req,res);
	} else if(_sql == "toExcelputinD") {
		toExcelputinD(req, res);
	} else if(_sql == "toExcelputoutD") {
		toExcelputoutD(req, res);
	} else if(_sql == "toExcelRB"){
		toExcelRB(req,res);
	} else if(_sql == "moveStock"){
		moveStock(req,res);
	}else if(_sql == "UpdateDoc"){
		UpdateDoc(req,res);
	}else if(_sql == "UpdateDate"){
		UpdateDate(req,res);
	}else if(_sql == "UptateMat"){
		UptateMat(req,res);
	}else if(_sql == "UptateGYS"){
		UptateGYS(req,res);
	}else if(_sql == "delfrmPutin") {
		delfrmPutin(req, res);
	}else if(_sql == "delfrmPutout") {
		delfrmPutout(req, res);
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
	/*
	var k_store = req.param('k_store');
	var k_category = req.param('k_category');
	var k_date = req.param('k_date');
	k_store = k_store == '所有' ? '' : k_store;
	k_category = k_category == '所有' ? '' : k_category;
	var ks = k_store == '' ? '所有门店' : k_store;
	var kc = k_category == '' ? '所有分类' : k_category;*/
	var no = req.param('no');
	//获得Excel模板的buffer对象
	var exlBuf = fs.readFileSync("./public/excelop/template/orderlist.xlsx");
	var excelname = setFileName();
	//数据源
	var sql1 = "select * from orderlist where order_no = '" + no + "' order by id desc";
	console.log(sql1);
	mysql.query(sql1, function(error, obj) {
		if(error) {
			console.log(error);
			return false;
		}
		//用数据源(对象)data渲染Excel模板
		var obj_str = '[ [{"date": ""}],';
		obj_str += JSON.stringify(obj) + "]";
		ejsExcel.renderExcelCb(exlBuf, JSON.parse(obj_str), function(exlBuf2) {
			fs.writeFileSync("./public/excelop/temp/" + excelname, exlBuf2);
			res.send(excelname);
		});
	});
}

/*导出采购单*/
function Printorderlist(req, res) {
	var k_store = req.param('k_store');
	var k_category = req.param('k_category');
	var k_date = req.param('k_date');
	var cid = req.param('cid');
	k_store = k_store == '所有' ? '' : k_store;
	k_category = k_category == '所有' ? '' : k_category;
	var ks = k_store == '' ? '所有门店' : k_store;
	var kc = k_category == '' ? '所有分类' : k_category;
	//获得Excel模板的buffer对象
	var exlBuf = fs.readFileSync("./public/excelop/template/p_orderlist.xlsx");
	var excelname = setFileName();
	//数据源
	var sql1 = "select * from c_orderlist where store like '%"+k_store+"%' and category like '%" + k_category + "%' and date = '" + k_date + "' order by no desc";
	mysql.query(sql1, function(error, obj) {
		if(error) {
			console.log(error);
			return false;
		}
		var sql2 = "select * from erprole where id = "+cid;
		mysql.query(sql2, function(error, obj2) {
			//用数据源(对象)data渲染Excel模板
			var obj_str = '[ [{"date": "' + k_date+ '","store":"'+obj2[0].store+'","cname":"'+obj2[0].name+'"}],';
			obj_str += JSON.stringify(obj) + "]";
			ejsExcel.renderExcelCb(exlBuf, JSON.parse(obj_str), function(exlBuf2) {
				fs.writeFileSync("./public/excelop/temp/" + excelname, exlBuf2);
				res.send(excelname);
			});
		});
	});
}

/*导出入库单*/
function toExcelputin(req, res) {
	/*
	var k_store = req.param('k_store');
	var k_category = req.param('k_category');
	var k_date = req.param('k_date');
	var k_date_end = req.param('k_date_end');
	k_store = k_store == '所有' ? '' : k_store;
	k_category = k_category == '所有' ? '' : k_category;
	var ks = k_store == '' ? '所有门店' : k_store;
	var kc = k_category == '' ? '所有分类' : k_category;
	*/
	var no = req.param('no');
	//获得Excel模板的buffer对象
	var exlBuf = fs.readFileSync("./public/excelop/template/putin.xlsx");
	var excelname = setFileName();
	//数据源
	//var sql1 = "select * from c_putin where category like '%"+k_category+"%' and date = '"+k_date+"' order by id desc";
	var sql1 = "select * from putin where order_no = '" + no + "' order by id desc";
	
	mysql.query(sql1, function(error, obj) {
		if(error) {
			console.log(error);
			return false;
		}
		//用数据源(对象)data渲染Excel模板
		var obj_str = '[ [{"date": ""}],';
		obj_str += JSON.stringify(obj) + "]";
		//console.log(obj_str);
		ejsExcel.renderExcelCb(exlBuf, JSON.parse(obj_str), function(exlBuf2) {
			fs.writeFileSync("./public/excelop/temp/" + excelname, exlBuf2);
			res.send(excelname);
		});
	});
}

/*导出入库单*/
function Printputin(req, res) {
	var k_store = req.param('k_store');
	var k_category = req.param('k_category');
	var k_date = req.param('k_date');
	var k_date_end = req.param('k_date_end');
	var cid = req.param('cid');
	k_store = k_store == '所有' ? '' : k_store;
	k_category = k_category == '所有' ? '' : k_category;
	var ks = k_store == '' ? '所有门店' : k_store;
	var kc = k_category == '' ? '所有分类' : k_category;
	//获得Excel模板的buffer对象
	var exlBuf = fs.readFileSync("./public/excelop/template/p_putin.xlsx");
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
		var sql2 = "select * from erprole where id = "+cid;
		mysql.query(sql2, function(error, obj2) {
			//用数据源(对象)data渲染Excel模板
			var obj_str = '[ [{"date": "' + k_date+ '","store":"'+obj2[0].store+'","cname":"'+obj2[0].name+'"}],';
			obj_str += JSON.stringify(obj) + "]";
			ejsExcel.renderExcelCb(exlBuf, JSON.parse(obj_str), function(exlBuf2) {
				fs.writeFileSync("./public/excelop/temp/" + excelname, exlBuf2);
				res.send(excelname);
			});
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
		/*計算总入库消费金额*/
		var totalout = 0;
		for(var i in obj) {
			totalout += obj[i].total;
		}
		totalout = Math.round(totalout * 100) / 100;
		//用数据源(对象)data渲染Excel模板
		var obj_str = '[ [{"date": "' + k_date+'","totalout": "' + totalout+'"}],';
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
	var k_no = req.param('k_no');
	var cate_id = req.param('cate_id');
	var k_n = req.param('k_n');
	k_store = k_store == '所有' ? '' : k_store;
	k_category = k_category == '所有' ? '' : k_category;
	k_no = k_no ? k_no : "";
	cate_id = cate_id ? cate_id : "";
	k_n = k_n ? k_n : "";
	var k_n1 = "";
	if(k_n != ""){
		var tmp = k_n.split(".");
		k_n1 = tmp[1];
	}
	//获得Excel模板的buffer对象
	var exlBuf = fs.readFileSync("./public/excelop/template/stock.xlsx");
	var excelname = setFileName();
	//数据源
	//var sql1 = "select * from stock where category like '%"+k_category+"%' and num > 0 order by id desc";
	var sql1 = "select * from c_stock  order by no desc";
	if(k_category == '') {
		sql1 = "select * from c_stock  order by no desc";
	}
	console.log(sql1);
	mysql.query(sql1, function(error, obj) {
		if(error) {
			console.log(error);
			return false;
		}
		/*计算库存结余金额*/
		var totalout = 0;
		for(var i in obj){
			totalout += (obj[i].unitPrice)*(obj[i].num);
		}
		totalout = Math.round(totalout * 100) / 100;
		//用数据源(对象)data渲染Excel模板
		var obj_str = '[ [{"totalout": "' + totalout + '"}],';
		obj_str += JSON.stringify(obj) + "]";
		
		ejsExcel.renderExcelCb(exlBuf, JSON.parse(obj_str), function(exlBuf2) {
			fs.writeFileSync("./public/excelop/temp/" + excelname, exlBuf2);
			res.send(excelname);
		});
	});
}

function Printstock(req, res) {
	var k_store = req.param('k_store');
	var k_category = req.param('k_category');
	var k_no = req.param('k_no');
	var cate_id = req.param('cate_id');
	var k_n = req.param('k_n');
	var cid = req.param('cid');
	k_store = k_store == '所有' ? '' : k_store;
	k_category = k_category == '所有' ? '' : k_category;
	k_no = k_no ? k_no : "";
	cate_id = cate_id ? cate_id : "";
	k_n = k_n ? k_n : "";
	var k_n1 = "";
	if(k_n != ""){
		var tmp = k_n.split(".");
		k_n1 = tmp[1];
	}
	//获得Excel模板的buffer对象
	var exlBuf = fs.readFileSync("./public/excelop/template/p_stock.xlsx");
	var excelname = setFileName();
	//数据源
	//var sql1 = "select * from stock where category like '%"+k_category+"%' and num > 0 order by id desc";
	var sql1 = "select * from c_stock where store like '%"+k_store+"%' and name like '%"+k_n1+"%' and no like '"+cate_id+"%' and category = '" + k_category + "'  order by no desc";
	if(k_category == '') {
		sql1 = "select * from c_stock where store like '%"+k_store+"%' and name like '%"+k_n1+"%' and no like '"+cate_id+"%' order by no desc";
	}
	console.log(sql1);
	mysql.query(sql1, function(error, obj) {
		if(error) {
			console.log(error);
			return false;
		}
		/*计算库存结余金额*/
		var totalout = 0;
		for(var i in obj){
			totalout += (obj[i].unitPrice)*(obj[i].num);
		}
		totalout = Math.round(totalout * 100) / 100;
		//用数据源(对象)data渲染Excel模板
		var sql2 = "select * from erprole where id = "+cid;
		mysql.query(sql2, function(error, obj2) {
			//用数据源(对象)data渲染Excel模板
			var obj_str = '[ [{"store":"'+obj2[0].store+'","cname":"'+obj2[0].name+'","totalout": "' + totalout + '"}],';
			obj_str += JSON.stringify(obj) + "]";
			ejsExcel.renderExcelCb(exlBuf, JSON.parse(obj_str), function(exlBuf2) {
				fs.writeFileSync("./public/excelop/temp/" + excelname, exlBuf2);
				res.send(excelname);
			});
		});
	});
}

/*导出出库单*/
function toExcelputout(req, res) {
	/*
	var k_category = req.param('k_category');
	var k_store = req.param('k_store');
	var k_date = req.param('k_date');
	var k_date_end = req.param('k_date_end');
	k_category = k_category == '所有' ? '' : k_category;
	k_store = k_store == '所有' ? '' : k_store;
	var ks = k_store == '' ? '所有门店' : k_store;
	var kc = k_category == '' ? '所有分类' : k_category;*/
	var no = req.param('no');
	//获得Excel模板的buffer对象
	var exlBuf = fs.readFileSync("./public/excelop/template/putout.xlsx");
	var excelname = setFileName();
	//数据源
	//var sql1 = "select * from putout where category like '%"+k_category+"%' and date = '"+k_date+"' order by id desc";
	//var sql1 = "select * from c_putout where store like '%"+k_store+"%' and date >= '" + k_date + "' and date <= '" + k_date_end + "' order by id desc";
	var sql1 = "select * from putout where order_no = '"+no+"' order by id desc";
	
	mysql.query(sql1, function(error, obj) {
		if(error) {
			console.log(error);
			return false;
		}
		//用数据源(对象)data渲染Excel模板
		var obj_str = '[ [{"date": ""}],';
		obj_str += JSON.stringify(obj) + "]";
		ejsExcel.renderExcelCb(exlBuf, JSON.parse(obj_str), function(exlBuf2) {
			fs.writeFileSync("./public/excelop/temp/" + excelname, exlBuf2);
			res.send(excelname);
		});
	});
}

function Printputout(req, res) {
	var k_category = req.param('k_category');
	var k_store = req.param('k_store');
	var k_date = req.param('k_date');
	var k_date_end = req.param('k_date_end');
	var cid = req.param('cid');
	k_category = k_category == '所有' ? '' : k_category;
	k_store = k_store == '所有' ? '' : k_store;
	var ks = k_store == '' ? '所有门店' : k_store;
	var kc = k_category == '' ? '所有分类' : k_category;
	//获得Excel模板的buffer对象
	var exlBuf = fs.readFileSync("./public/excelop/template/p_putout.xlsx");
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
		var sql2 = "select * from erprole where id = "+cid;
		mysql.query(sql2, function(error, obj2) {
			//用数据源(对象)data渲染Excel模板
			var obj_str = '[ [{"date": "' + k_date+ '","store":"'+obj2[0].store+'","cname":"'+obj2[0].name+'"}],';
			obj_str += JSON.stringify(obj) + "]";
			ejsExcel.renderExcelCb(exlBuf, JSON.parse(obj_str), function(exlBuf2) {
				fs.writeFileSync("./public/excelop/temp/" + excelname, exlBuf2);
				res.send(excelname);
			});
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
		/*計算总入库消费金额*/
		var totalout = 0;
		for(var i in obj) {
			totalout += obj[i].total;
		}
		totalout = Math.round(totalout * 100) / 100;
		//用数据源(对象)data渲染Excel模板
		var obj_str = '[ [{"date": "' + k_date+'","totalout": "' + totalout+'"}],';
		obj_str += JSON.stringify(obj) + "]";
		ejsExcel.renderExcelCb(exlBuf, JSON.parse(obj_str), function(exlBuf2) {
			fs.writeFileSync("./public/excelop/temp/" + excelname, exlBuf2);
			res.send(excelname);
		});
	});
}

function UptateMat(req, res) {
	var name = req.param('name');
	var cate_id = req.param('cate_id');
	var unit = req.param('unit');
	var gys_id = req.param('gys_id');
	var guige = req.param('guige');
	var weight = req.param('weight');
	var pinpai = req.param('pinpai');
	var yujing = req.param('yujing');
	var isEdit = req.param('id');
	var sql1 = "update material set ";
				sql1 += " name1 = '" + name + "',";
				sql1 += " cate_id = '" + cate_id + "',";
				sql1 += " unit = '" + unit + "',";
				sql1 += " gys_id = '" + gys_id + "',";
				sql1 += " guige = '" + guige + "',";
				sql1 += " weight = '" + weight + "',";
				sql1 += " pinpai = '" + pinpai + "',";
				sql1 += " yujing = '" + yujing + "'";

				sql1 += " where id = " + isEdit;
	mysql.query(sql1, function(error, row) {
		if(error) {
			console.log(error);
			return false;
		}
		res.send('200');
	});
};

function UptateGYS(req, res) {
	var name = req.param('name');
	var account = req.param('account');
	var number = req.param('number');
	var linkname = req.param('linkname');
	var tel = req.param('tel');
	var address = req.param('address');
	var kaihuhang = req.param('kaihuhang');
	var isEdit = req.param('id');
	var sql1 = "update gys set ";
				sql1 += " name = '" + name + "',";
				sql1 += " account = '" + account + "',";
				sql1 += " number = '" + number + "',";
				sql1 += " linkname = '" + linkname + "',";
				sql1 += " tel = '" + tel + "',";
				sql1 += " address = '" + address + "',";
				sql1 += " kaihuhang = '" + kaihuhang + "'";
				sql1 += " where id = " + isEdit;
    console.log(sql1);
	mysql.query(sql1, function(error, row) {
		if(error) {
			console.log(error);
			return false;
		}
		res.send('200');
	});
};

function insertM(req, res) {
	var name = req.param('name');
	var cate_id = req.param('cate_id');
	var unit = req.param('unit');
	var gys_id = req.param('gys_id');
	var guige = req.param('guige');
	var weight = req.param('weight');
	var pinpai = req.param('pinpai');
	var yujing = req.param('yujing');
	var sql1 = "insert into material (name1,cate_id,unit,gys_id,guige,weight,pinpai,yujing) values ('" + name + "'," + cate_id + ",'" + unit + "','" + gys_id + "','" + guige + "','" + weight + "','" + pinpai + "','" + yujing + "')";
	mysql.query(sql1, function(error, row) {
		if(error) {
			console.log(error);
			return false;
		}
		res.send('200');
	});
};

function moveStock(req, res) {
	var f_store = req.param('f_store');
	var s_material = req.param('s_material');
	var s_unitPrice = req.param('s_unitPrice');
	var m_category = req.param('m_category');
	var s_sum = req.param('s_sum');
	var t_store = req.param('t_store');
	var sql1 = "insert into move_stock (f_store,s_material,s_sum,t_store,s_unitPrice,m_category) values ('" + f_store + "','" + s_material + "',"+ s_sum + ",'"+ t_store + "',"+ s_unitPrice + ",'" + m_category + "')";
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

function insertGYS(req, res) {
	var name = req.param('name');
	var account = req.param('account');
	var number = req.param('number');
	var linkname = req.param('linkname');
	var tel = req.param('tel');
	var address = req.param('address');
	var kaihuhang = req.param('kaihuhang');
	var sql1 = "insert into gys (name,account,number,linkname,tel,address,kaihuhang) values ('" + name + "','" + account + "','" + number + "','" + linkname + "','" + tel + "','" + address + "','" + kaihuhang + "')";
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

function delfrmOrd(req, res) {
	var id = req.param('id');
	var sql1 = "delete from frm_orderlist where id = " + id;
	mysql.query(sql1, function(error, row) {
		if(error) {
			console.log(error);
			return false;
		}
		res.send('200');
	});
};

function delfrmPutin(req, res) {
	var id = req.param('id');
	var sql1 = "delete from frm_putin where id = " + id;
	mysql.query(sql1, function(error, row) {
		if(error) {
			console.log(error);
			return false;
		}
		res.send('200');
	});
};

function delfrmPutout(req, res) {
	var id = req.param('id');
	var sql1 = "delete from frm_putout where id = " + id;
	mysql.query(sql1, function(error, row) {
		if(error) {
			console.log(error);
			return false;
		}
		res.send('200');
	});
};


function delGYS(req, res) {
	var id = req.param('id');
	var sql1 = "delete from gys where id = " + id;
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
	var order_no = req.param('order_no');
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
		var sql1 = "insert into orderlist (store,name,category,date,num,unitPrice,order_no) values ('" + store + "','" + name + "','" + category + "','" + date + "','" + num + "',"+unitPrice+",'"+order_no+"')";
		mysql.query(sql1, function(error, row) {
			if(error) {
				console.log(error);
				return false;
			}
			res.send('200');
		});
	});
};

function insertOrdFrm(req, res) {
	var date = req.param('date');
	var order_no = req.param('order_no');
		var sql1 = "insert into frm_orderlist (no,date,createAt) values ('"+order_no+"','"+date+"',now())";
		mysql.query(sql1, function(error, row) {
			if(error) {
				console.log(error);
				return false;
			}
			res.send('200');
		});
};

function insertOrdFrm1(req, res) {
	var date = req.param('date');
	var order_no = req.param('order_no');
	var frm_order_no = req.param('frm_order_no');
		var sql1 = "insert into frm_putin (no,date,createAt,cno) values ('"+order_no+"','"+date+"',now(),'"+frm_order_no+"')";
		mysql.query(sql1, function(error, row) {
			if(error) {
				console.log(error);
				return false;
			}
			res.send('200');
		});
};

function insertOrdFrm2(req, res) {
	var date = req.param('date');
	var order_no = req.param('order_no');
	//var frm_order_no = req.param('frm_order_no');
		var sql1 = "insert into frm_putout (no,date,createAt) values ('"+order_no+"','"+date+"',now())";
		mysql.query(sql1, function(error, row) {
			if(error) {
				console.log(error);
				return false;
			}
			res.send('200');
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
	/*
	var k_store = req.param('k_store');
	var k_category = req.param('k_category');
	var k_date = req.param('k_date');
	var k_name1 = req.param('k_name1');*/
	var order_no = req.param('order_no');
	//k_category = k_category == '所有' ? '' : k_category;
	//k_store = k_store == '所有' ? '' : k_store;
	//var sql1 = "select * from c_orderlist where name like '%"+k_name1+"%' and store like '%" + k_store + "%' and category like '%" + k_category + "%' and date = '" + k_date + "' order by no desc";
	var sql1 = "select * from orderlist where order_no = '"+order_no+"' order by id desc";
	console.log(sql1);
	mysql.query(sql1, function(error, rows) {
		if(error) {
			console.log(error);
			return false;
		}
		res.json(rows);
	});
};

function getMatById(req, res) {
	var id = req.param('id');
	var sql1 = "select * from material where id = "+id;
	mysql.query(sql1, function(error, rows) {
		if(error) {
			console.log(error);
			return false;
		}
		res.json(rows);
	});
};

function getGYSById(req, res) {
	var id = req.param('id');
	var sql1 = "select * from gys where id = "+id;
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

function delOrd1(req, res) {
	var id = req.param('id');
	var oid = req.param('oid');
	var sql1 = "delete from putin where id = " + id;
	mysql.query(sql1, function(error, row) {
		if(error) {
			console.log(error);
			return false;
		}
		var sql2 = "update orderlist set inStock='未入库' where id ="+oid;
		mysql.query(sql2, function(error, row2) {
			if(error) {
				console.log(error);
				return false;
			}
			res.send('200');
		});
	});
};

function delOrdh(req, res) {
	var id = req.param('id');
	var sql1 = "insert into putin_log select * from putin where id = " + id;
	var sql2 = "delete from putin where id = " + id;
	mysql.query(sql1, function(error, row) {
		if(error) {
			console.log(error);
			return false;
		}
		mysql.query(sql2, function(error, row) {
			if(error) {
				console.log(error);
				return false;
			}
			res.send('200');
		});
	});
};

function delOrdh1(req, res) {
	var id = req.param('id');
	var sql1 = "insert into putout_log select * from putout where id = " + id;
	var sql2 = "delete from putout where id = " + id;
	mysql.query(sql1, function(error, row) {
		if(error) {
			console.log(error);
			return false;
		}
		mysql.query(sql2, function(error, row) {
			if(error) {
				console.log(error);
				return false;
			}
			res.send('200');
		});
	});
};

function getPutIn(req, res) {
	/*
	var k_store = req.param('k_store');
	var k_category = req.param('k_category');
	var k_date = req.param('k_date');
	var k_date_end = req.param('k_date_end');
	var k_name1 = req.param('k_name1');
	k_category = k_category == '所有' ? '' : k_category;
	k_store = k_store == '所有' ? '' : k_store;
	var sql1 = "select * from c_putin where name like '%"+k_name1+"%' and state='已入库' and store like '%"+k_store+"%' and category = '" + k_category + "' and date >= '" + k_date + "' and date <= '" + k_date_end + "' order by id desc";
	if(k_category == '') {
		sql1 = "select * from c_putin where  name like '%"+k_name1+"%' and state='已入库' and store like '%"+k_store+"%' and date >= '" + k_date + "' and date <= '" + k_date_end + "' order by id desc";
	}
	*/
	var frm_order_no = req.param('frm_order_no');
	var sql1 = 'select * from putin where order_no = "'+frm_order_no+'" and state="已入库"';
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
	var k_cate_id = req.param('k_cate_id');
	var s_name = req.param('s_name');
	k_store = k_store == '所有' ? '' : k_store;
	k_category = k_category == '所有' ? '' : k_category;
	k_name = k_name == '所有' ? '' : k_name;
	var change1 = '';
	if(k_cate_id != ''){
		change1 = " no like '"+k_cate_id+"%' and ";
	}
	var sql1 = "select * from c_putin where "+change1+" store like '%"+k_store+"%' and category like '%" + k_category + "%' and name like '%" + s_name + "%' and  date >= '" + k_date + "' and date <= '" + k_date_end + "' order by id desc";
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
	var k_cate_id = req.param('k_cate_id');
	var s_name = req.param('s_name');
	k_store = k_store == '所有' ? '' : k_store;
	k_category = k_category == '所有' ? '' : k_category;
	k_name = k_name == '所有' ? '' : k_name;
	var change1 = '';
	if(k_cate_id != ''){
		change1 = " no like '"+k_cate_id+"%' and ";
	}
	var sql1 = "select * from c_putin where "+change1+" store like '%"+k_store+"%' and category = '" + k_category + "' and name like '%" + s_name + "%'  and date like '" + k_date + "%' order by id desc";
	if(k_category == '') {
		sql1 = "select * from c_putin where "+change1+" store like '%"+k_store+"%' and name like '%" + s_name + "%' and  date like '" + k_date + "%' order by id desc";
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
	var order_no = Number(req.param('order_no'));
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
			var sql1 = "insert into putin (name,category,date,num,total,store,unitPrice,difference,state,oid,order_no) values ('" + r0[0].name + "','" + r0[0].category + "','" + r0[0].date + "','" + num + "'," + total + ",'" + r0[0].store + "'," + unitPrice + "," + difference + ",'待入库',"+id+",'"+order_no+"')";
			mysql.query(sql1, function(error, row) {
				if(error) {
					console.log(error);
					return false;
				}
				res.send('200');
				/*
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
				});*/
			});
		});
	});
};

function insertPutin1(req, res) {

	var id = Number(req.param('id'));
	//先根据id得到采购清单数据
	var sql0 = "select * from c_putin where id = " + id;
	mysql.query(sql0, function(error, r0) {
		if(error) {
			console.log(error);
			return false;
		}
		var total = r0[0].total;
		var num = r0[0].num;
		//计算单价 = 总价/数量
		//var num = Number(r0[0].num);
		var arr1 = (r0[0].name).split("-");
		var rname = arr1[0]+"-"+arr1[1]+"-"+arr1[2]+"-"+arr1[3]+"-"+arr1[4];
		var unitPrice = total / num;
		unitPrice = Math.round(unitPrice * 100) / 100;
		//差价 = 总价 - 数量*单价
		var difference = total - num * unitPrice;
		/*把状态设置为已入库*/
		var sql00 = "update c_putin set state = '已入库' where id = " + id;
		mysql.query(sql00, function(error, is1) {
			if(error) {
				console.log(error);
				return false;
			}
			
				
				//入库
				//1.判断是否库存已存在
				//var sql2 = "select * from stock where name = '"+name+"' and unitPrice = "+unitPrice+" and category = '"+category+"'";
				var sql2 = "select * from stock where name = '" + rname + "'";
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
						sql3 = "insert into stock (name,unitPrice,num,category,store) values ('" + rname + "'," + unitPrice + "," + num + ",'" + r0[0].category + "','"+r0[0].store+"')";
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
	var k_cate_id = req.param('k_cate_id');
	k_store = k_store == '所有' ? '' : k_store;
	k_category = k_category == '所有' ? '' : k_category;
	k_name = k_name == '所有' ? '' : k_name;
	var change1 = '';
	if(k_cate_id != ''){
		change1 = " no like '"+k_cate_id+"%' and ";
	}
	var sql1 = "select * from c_stock where "+change1+" name like '%"+k_store+"%' and category = '" + k_category + "' and name like '%" + k_name + "%' and num > 0 order by id desc";
	if(k_category == '') {
		sql1 = "select * from c_stock where "+change1+" name like '%"+k_store+"%' and name like '%" + k_name + "%' and num > 0 order by id desc";
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
	var order_no = req.param('order_no');

	var total = num * unitPrice;
	//插入出库记录
	var sql1 = "insert into putout (name,category,date,num,unitPrice,total,store,order_no) values ('" + name + "','" + category + "','" + date + "'," + num + "," + unitPrice + "," + total + ",'"+store+"','"+order_no+"')";
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
	/*
	var k_category = req.param('k_category');
	var k_store = req.param('k_store');
	var k_date = req.param('k_date');
	var k_date_end = req.param('k_date_end');
	var k_name1 = req.param('k_name1');
	k_category = k_category == '所有' ? '' : k_category;
	k_store = k_store == '所有' ? '' : k_store;
	var sql1 = "select * from c_putout where name like '%"+k_name1+"%' and store like '%"+k_store+"%' and category = '" + k_category + "' and date >= '" + k_date + "' and date <= '" + k_date_end + "' order by id desc";
	if(k_category == '') {
		sql1 = "select * from c_putout where name like '%"+k_name1+"%' and store like '%"+k_store+"%' and date >= '" + k_date + "' and date <= '" + k_date_end + "' order by id desc";
	}*/
	var order_no = Number(req.param('order_no'));
	var sql1 = "select * from putout where order_no = '"+order_no+"'";
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
	var s_name = req.param('s_name');
	k_store = k_store == '所有' ? '' : k_store;
	k_category = k_category == '所有' ? '' : k_category;
	k_name = k_name == '所有' ? '' : k_name;
	var sql1 = "select * from putout where store like '%"+k_store+"%' and category like '%" + k_category + "%' and name like '%" + s_name + "%' and date >= '" + k_date + "' and date <= '" + k_date_end + "' order by id desc";
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
	var k_cate_id = req.param('k_cate_id');
	var s_name = req.param('s_name');

	k_store = k_store == '所有' ? '' : k_store;
	k_category = k_category == '所有' ? '' : k_category;
	k_name = k_name == '所有' ? '' : k_name;

	//k_cate_id = k_cate_id?k_cate_id:'';

	//console.log(k_cate_id);

	var change1 = '';
	if(k_cate_id != ''){
		change1 = " no like '"+k_cate_id+"%' and ";
	}

	var sql1 = "select * from c_putout where  "+change1+"  store like '%"+k_store+"%' and category = '" + k_category + "' and name like '%" + s_name + "%' and date like '" + k_date + "%' order by id desc";
	if(k_category == '') {
		sql1 = "select * from c_putout where  "+change1+"  store like '%"+k_store+"%' and name like '%" + s_name + "%' and date like '" + k_date + "%' order by id desc";
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
	var frm_order_no = req.param('frm_order_no');
	var sql1 = "select * from orderlist where inStock = '未入库' and order_no = '"+frm_order_no+"' order by id desc";
	mysql.query(sql1, function(error, rows) {
		if(error) {
			console.log(error);
			return false;
		}
		res.json(rows);
	});
};

function getUninOrd1(req, res) {
	var frm_order_no = req.param('frm_order_no');
	var sql1 = "select * from putin where state = '待入库' and order_no = '"+frm_order_no+"' order by id desc";
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
	var rolelist = req.param('rolelist');
	var sql1 = "insert into erprole (username,password,name,role_id,store,rolelist) values ('" + username + "','" + password + "','" + name + "'," + role_id + ",'" + store + "','" + rolelist + "')";
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
	var sql1 = "update orderlist set num = "+num + " where id = "+id;
	mysql.query(sql1, function(error, row) {
		if(error) {
			console.log(error);
			return false;
		}
		res.send('200');
	});
}

/*导出材料清单*/
function toExcelMat(req, res) {
	//获得Excel模板的buffer对象
	var exlBuf = fs.readFileSync("./public/excelop/template/mat.xlsx");
	var excelname = setFileName();
	//数据源
	var sql1 = "select * from c_material order by id desc";
	mysql.query(sql1, function(error, obj) {
		if(error) {
			console.log(error);
			return false;
		}
		//用数据源(对象)data渲染Excel模板
		var obj_str = '[ [{"date": "123"}],';
		obj_str += JSON.stringify(obj) + "]";
		//console.log(obj_str);
		ejsExcel.renderExcelCb(exlBuf, JSON.parse(obj_str), function(exlBuf2) {
			fs.writeFileSync("./public/excelop/temp/" + excelname, exlBuf2);
			res.send(excelname);
		});
	});
}

/*导出日入库单*/
function toExcelputinD(req, res) {
	var k_store = req.param('k_store');
	var k_category = req.param('k_category');
	var k_date = req.param('k_date');
	var k_date_end = req.param('k_date_end');
	var k_name = req.param('k_name');
	var k_cate_id = req.param('k_cate_id');
	k_store = k_store == '所有' ? '' : k_store;
	k_category = k_category == '所有' ? '' : k_category;
	k_name = k_name == '所有' ? '' : k_name;
	var change1 = '';
	if(k_cate_id != ''){
		change1 = " no like '"+k_cate_id+"%' and ";
	}
	var sql1 = "select * from c_putin where "+change1+" store like '%"+k_store+"%' and category like '%" + k_category + "%' and name like '%" + k_name + "%' and  date >= '" + k_date + "' and date <= '" + k_date_end + "' order by id desc";
	
	//获得Excel模板的buffer对象
	var exlBuf = fs.readFileSync("./public/excelop/template/putinm.xlsx");
	var excelname = setFileName();
	//数据源
	mysql.query(sql1, function(error, obj) {
		if(error) {
			console.log(error);
			return false;
		}
		/*計算总入库消费金额*/
		var totalout = 0;
		for(var i in obj) {
			totalout += obj[i].total;
		}
		totalout = Math.round(totalout * 100) / 100;
		//用数据源(对象)data渲染Excel模板
		var obj_str = '[ [{"date": "' + k_date +'~'+k_date_end+'","totalout": "' + totalout+'"}],';
		obj_str += JSON.stringify(obj) + "]";
		//console.log(obj_str);
		ejsExcel.renderExcelCb(exlBuf, JSON.parse(obj_str), function(exlBuf2) {
			fs.writeFileSync("./public/excelop/temp/" + excelname, exlBuf2);
			res.send(excelname);
		});
	});
}

/*导出日出库单*/
function toExcelputoutD(req, res) {
	var k_store = req.param('k_store');
	var k_category = req.param('k_category');
	var k_date = req.param('k_date');
	var k_date_end = req.param('k_date_end');
	var k_name = req.param('k_name');
	k_store = k_store == '所有' ? '' : k_store;
	k_category = k_category == '所有' ? '' : k_category;
	k_name = k_name == '所有' ? '' : k_name;
	var sql1 = "select * from putout where store like '%"+k_store+"%' and category like '%" + k_category + "%' and name like '%" + k_name + "%' and date >= '" + k_date + "' and date <= '" + k_date_end + "' order by id desc";
	
	//获得Excel模板的buffer对象
	var exlBuf = fs.readFileSync("./public/excelop/template/putoutm.xlsx");
	var excelname = setFileName();
	//数据源
	mysql.query(sql1, function(error, obj) {
		if(error) {
			console.log(error);
			return false;
		}
		
		/*計算总入库消费金额*/
		var totalout = 0;
		for(var i in obj) {
			totalout += obj[i].total;
		}
		totalout = Math.round(totalout * 100) / 100;
		//用数据源(对象)data渲染Excel模板
		var obj_str = '[ [{"date": "' + k_date +'~'+k_date_end+'","totalout": "' + totalout+'"}],';
		obj_str += JSON.stringify(obj) + "]";
		
		ejsExcel.renderExcelCb(exlBuf, JSON.parse(obj_str), function(exlBuf2) {
			fs.writeFileSync("./public/excelop/temp/" + excelname, exlBuf2);
			res.send(excelname);
		});
	});
}

function toExcelRB(req, res) {
	var bookingno = req.param('d');
	var s1 = bookingno.replace('-','');
	s1 = s1.replace('-','');
	//console.log(s1);
	//获得Excel模板的buffer对象
	var exlBuf = fs.readFileSync("./public/excelop/template/store1.xlsx");
	var excelname = setFileName1(bookingno);
	//数据源
	
	var sql1 = "select * from sbooking where bookingno like '"+s1+"%' order by id asc";
	//console.log(sql1);
	mysql.query(sql1, function(error, obj) {
		if(error) {
			console.log(error);
			return false;
		}
		console.log(obj);
		//用数据源(对象)data渲染Excel模板
		var obj_str = '[ [{"date": "123"}],';
		obj_str += JSON.stringify(obj) + "]";
		//console.log(obj_str);
		ejsExcel.renderExcelCb(exlBuf, JSON.parse(obj_str), function(exlBuf2) {
			fs.writeFileSync("./public/excelop/temp/" + excelname, exlBuf2);
			res.send(excelname);
		});
	});
}

function setFileName1(bn) {
	var myDate = new Date();
	var hh = myDate.getHours();
	var mm = myDate.getMinutes();
	var ss = myDate.getSeconds();
	return bn + "____" + hh + mm + ss + ".xlsx";
}

function UpdateDoc(req, res) {
	var id = req.param('id');
	var num = req.param('num');
	var old_num = req.param('old_num');
	var name = req.param('name');
	
	var sql1 = "update stock set num = "+num+" where id = " + id;
	var sql2 = "insert into stock_log(sid,num,old_num,name,createAt) values('"+id+"','"+num+"','"+old_num+"','"+name+"',now())"
	//console.log(sql2);
	mysql.query(sql1, function(error, row) {
		if(error) {console.log(error);return false;}
		mysql.query(sql2, function(error, row2) {
			if(error) {console.log(error);return false;}
			res.send('200');
		});
	});
};

function UpdateDate(req, res) {
	var id = req.param('id');
	var num = req.param('num');
	
	var sql1 = "update stock set date = '"+num+"' where id = " + id;
	mysql.query(sql1, function(error, row) {
		if(error) {console.log(error);return false;}
		res.send('200');
	});
};

