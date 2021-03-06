DROP VIEW IF EXISTS `menu_booking`;
CREATE VIEW menu_booking
AS
SELECT a.*,b.type,b.bookingno
FROM booking_price a
LEFT JOIN booking b
ON a.bookingid = b.id;

DROP VIEW IF EXISTS `address_booking`;
CREATE VIEW address_booking
AS
SELECT a.*,b.id as address_id
FROM booking a
LEFT JOIN address b
ON a.addressname = b.name;

DROP VIEW IF EXISTS `c_material`;
CREATE VIEW c_material
AS
SELECT a.*,b.no,b.name as cname,c.name as gname
FROM material a
LEFT JOIN material_category b
ON a.cate_id = b.id
LEFT JOIN gys c
ON a.gys_id = c.id;

DROP VIEW IF EXISTS `c_orderlist`;
CREATE VIEW c_orderlist
AS
SELECT a.*,b.unit,b.no,b.cname
FROM orderlist a
LEFT JOIN c_material b
ON a.name = b.name;

DROP VIEW IF EXISTS `c_putin`;
CREATE VIEW c_putin
AS
SELECT a.*,b.unit,b.cname,b.no
FROM putin a
LEFT JOIN c_material b
ON a.name = b.name;

DROP VIEW IF EXISTS `c_stock`;
CREATE VIEW c_stock
AS
SELECT a.*,b.unit,b.no
FROM stock a
LEFT JOIN c_material b
ON a.name = b.name;

DROP VIEW IF EXISTS `c_putout`;
CREATE VIEW c_putout
AS
SELECT a.*,b.unit,b.cname,b.no
FROM putout a
LEFT JOIN c_material b
ON a.name = b.name;

DROP VIEW IF EXISTS `c_role`;
CREATE VIEW c_role
AS
SELECT a.*,b.name as cname
FROM erprole a
LEFT JOIN rolecat b
ON a.role_id = b.id;

alter table booking_price add CONSTRAINT FK_PRICE_BOOKING FOREIGN KEY (bookingid) REFERENCES booking (id) ON DELETE CASCADE ON UPDATE NO ACTION;
alter table material add constraint unique_name UNIQUE(name);

DROP VIEW IF EXISTS `v_com_booking`;
CREATE VIEW v_com_booking
AS
SELECT a.*,b.name as cname
FROM com_booking a
LEFT JOIN address b
ON a.cid = b.id;

DROP VIEW IF EXISTS `v_stock_log`;
CREATE VIEW v_stock_log
AS
SELECT a.*,b.name as cname,store,category
FROM stock_log a
LEFT JOIN stock b
ON a.sid = b.id;

DROP VIEW IF EXISTS `v_fedbooking`;
CREATE VIEW v_fedbooking
AS
SELECT a.*,b.date,b.type,b.state,b.userid,b.createAt,c.name as uname
FROM fedbooking_price a
LEFT JOIN fedbooking b
ON a.bno = b.bookingno
LEFT JOIN user c
ON b.userid = c.username;

DROP VIEW IF EXISTS `v_user_fedbooking`;
CREATE VIEW v_user_fedbooking
AS
SELECT a.*,b.name,c.name as cname
FROM fedbooking a
LEFT JOIN user b
ON a.userid = b.username
LEFT JOIN fedbooking_price c
ON a.bookingno = c.bno;

DROP VIEW IF EXISTS `v_outbooking`;
CREATE VIEW v_outbooking
AS
SELECT a.*,b.price as price
FROM outbooking a
LEFT JOIN box b
ON a.box = b.name;

DROP VIEW IF EXISTS `v_oldbooking`;
CREATE VIEW v_oldbooking
AS
SELECT a.*,b.price as price
FROM oldbooking a
LEFT JOIN box b
ON a.box = b.name;

DROP VIEW IF EXISTS `m_gys`;
CREATE VIEW m_gys
AS
SELECT a.*,b.name as gname
FROM material a
LEFT JOIN gys b
ON a.gys_id = b.id;