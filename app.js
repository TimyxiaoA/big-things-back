const express = require('express'); //导入服务器模块
const app = express(); //实例化服务器
const joi = require('@hapi/joi'); //数据验证模块
const cors = require('cors'); //导入并配置跨域中间件
const config = require('./config'); // 导入配置文件
const expressJWT = require('express-jwt'); // 配置解析 token 的中间件

//! 1.跨域处理中间件
app.use(cors());

//! 2.解析表单格式中间件
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//! 3.统一响应,优化 res.send() 的中间件
app.use((req, res, next) => {
	// status = 0 为成功； status = 1 为失败； 默认将 status 的值设置为 1，方便处理失败的情况
	res.cc = function (err, status = 1) {
		res.send({
			// 状态
			status,
			// 状态描述，判断 err 是 错误对象 还是 字符串
			message: err instanceof Error ? err.message : err
		});
	};
	next();
});

//! 4.解析 token
app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api\//] }));

//! 5.自己设计的接口
//导入并使用用户模块
const userRouter = require('./router/user');
app.use('/api', userRouter);

// 导入并使用用户信息路由模块
const userinfoRouter = require('./router/userinfo');
app.use('/my', userinfoRouter); // 注意：以 /my 开头的接口，都是有权限的接口，需要进行 Token 身份认证

//! 6. 错误处理中间件
app.use((err, req, res, next) => {
	// 数据验证失败
	if (err instanceof joi.ValidationError) return res.cc(err);
	// 捕获身份认证失败的错误
	if (err.name === 'UnauthorizedError') return res.cc('身份认证失败！');
	// 未知错误
	res.cc(err);
});

//生成服务器端口
app.listen(3007, () => console.log('Server running on http://127.0.0.1:3007'));
