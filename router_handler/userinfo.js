//导入数据库操作模块
const db = require('../db/index');
//导入 bcryptjs
const bcrypt = require('bcryptjs');

// 获取用户基本信息的处理函数
exports.getUserInfo = (req, res) => {
	// 定义 SQL 语句:
	// 根据用户的 id，查询用户的基本信息
	// 注意：为了防止用户的密码泄露，需要排除 password 字段
	const sql = `select id, username, nickname, email, user_pic from ev_users where id=?`;
	db.query(sql, req.user.id, (err, results) => {
		if (err) return res.cc(err);

		if (results.length !== 1) return res.cc('获取用户信息失败!');

		res.send({
			status: 0,
			message: '获取用户信息成功!',
			data: results[0]
		});
	});
};

//更新用户信息的处理函数
exports.updateUserInfo = (req, res) => {
	//定义 SQL 语句
	// console.log(req.body);
	const sql = `update ev_users set ? where id=?`;
	db.query(sql, [req.body, req.user.id], (err, results) => {
		// 执行 SQL 语句失败
		if (err) return res.cc(err);

		// 执行 SQL 语句成功，但影响行数不为 1
		if (results.affectedRows !== 1) return res.cc('修改用户基本信息失败！');

		// 修改用户信息成功
		return res.cc('修改用户基本信息成功！', 0);
	});
};

//重置密码的处理函数
exports.updatePassword = (req, res) => {
	//!1.根据 id 查询用户是否存在：
	const sql = `select * from ev_users where id =?`;
	db.query(sql, req.user.id, (err, results) => {
		console.log(results);
		if (err) return res.cc(err);

		if (results.length !== 1) return res.cc('用户不存在!');

		//! 2.判断提交的旧密码是否正确
		// compareSync() 函数的返回值为布尔值，true 表示密码正确，false 表示密码错误
		const compareResult = bcrypt.compareSync(req.body.oldPwd, results[0].password);
		if (!compareResult) return res.cc('原密码错误!');
		//! 3.加密新密码更新到数据库中
		//3.1定义 SQL 语句
		const sql1 = `update ev_users set ? where id =?`;
		//3.2 对新密码进行加密
		const newPwd = bcrypt.hashSync(req.body.newPwd, 10);
		//3.3 执行sql1 语句 根据id更新密码
		db.query(sql1, [{ password: newPwd }, req.user.id], (err, results) => {
			console.log(results);
			if (err) return res.cc(err);

			if (results.affectedRows !== 1) return res.cc('更新密码失败！');

			res.cc('更新密码成功!', 0);
		});
	});
};

//更换头像的处理函数
exports.updateAvatar = (req, res) => {
	// 1.定义 SQL 语句
	const sql = `update ev_users set user_pic=? where id=?`;
	//调用 db 函数
	db.query(sql, [req.body.avatar, req.user.id], (err, results) => {
		if (err) return res.cc(err);

		if (results.affectedRows !== 1) return res.cc('更新用户头像失败!');

		res.cc('更新用户头像成功!', 0);
	});
};
