// * 在这里定义和用户相关的路由处理函数，供 /router/user.js 模块进行调用

//导入数据库操作模块
const db = require('../db/index');

//导入加密模块
const bcrypt = require('bcryptjs');

// 用这个包来生成 Token 字符串
const jwt = require('jsonwebtoken');
// 导入配置文件
const config = require('../config');

//注册用户的处理函数
exports.regUser = (req, res) => {
	//获取客户端提交服务器的用户信息
	const userinfo = req.body;
	//对表单进行效验 1.表单是否为空
	/* if (!userinfo.username || !userinfo.password) {
		return res.send({
			status: 1,
			message: '用户名或密码不能为空！'
        });
		return res.cc('用户名或密码不能为空！');
	} */

	//2.检测用户名是否被占用
	const sql = `select * from ev_users where username=?`;
	db.query(sql, userinfo.username, (err, results) => {
		if (err) {
			/* return res.send({
				status: 1,
				message: err.message
            }); */
			return res.cc(err);
		}
		if (results.length > 0) {
			/* return res.send({
				status: 1,
				message: '用户名已被占用!'
            }); */
			return res.cc('用户名已被占用!');
		}
		// 3.对用户的密码,进行 bcrypt 加密，返回值是加密之后的密码字符串
		userinfo.password = bcrypt.hashSync(userinfo.password, 10);
		//4.定义插入新用户的 SQL 语句
		const sql = 'insert into ev_users set ?';
		db.query(sql, { username: userinfo.username, password: userinfo.password }, (err, results) => {
			if (err) {
				/* return res.send({
						status: 1,
						message: err.message
                    }); */
				return res.cc(err);
			}
			if (results.affectedRows !== 1) {
				/* return res.send({
						status: 1,
						message: '注册用户失败,请稍后再试!'
                    }); */
				return res.cc('注册用户失败,请稍后再试!');
			}
			/* res.send({
					status: 0,
					message: '注册成功!'
                }); */
			res.cc('注册成功!', 0);
		});
	});
};

//登录用户的处理函数
exports.login = (req, res) => {
	//获取客户端提交服务器的用户信息
	const userinfo = req.body;
	//定义 SQL 语句
	const sql = `select * from ev_users where username=?`;
	db.query(sql, userinfo.username, (err, results) => {
		// 执行失败
		if (err) return res.cc(err);
		//或者查询数据不等于1
		if (results.length !== 1) return res.cc('登陆失败');

		//判断密码是否正确 对比数据库中的密码

		const compareResult = bcrypt.compareSync(userinfo.password, results[0].password);
		// console.log(userinfo.password, results[0].password, compareResult);
		if (!compareResult) return res.cc('登陆失败');

		//在服务器端生成 token 字符串 剔除用户密码 用户头像
		const user = { ...results[0], password: '', user_pic: '' };
		// 对用户信息进行加密生成 Token 字符串  // token 有效期为 10 个小时
		const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: '10h' });

		res.send({
			status: 0,
			message: '登录成功!',
			token: 'Bearer ' + tokenStr
		});
	});
};
