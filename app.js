//导入服务器模块
const express = require('express');
//实例化服务器
const app = express();

const joi = require('@hapi/joi');
//导入并配置跨域中间件
const cors = require('cors');
app.use(cors());

//配置 表单格式中间件
app.use(express.json());
app.use(express.urlencoded({ extend: false }));

// 响应数据的中间件
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
//导入并使用用户模块
const userRouter = require('./router/user');
app.use('/api', userRouter);

// 错误中间件
app.use((err, req, res, next) => {
	// 数据验证失败
	if (err instanceof joi.ValidationError) return res.cc(err);
	// 未知错误
	res.cc(err);
});

//生成服务器端口
app.listen(3007, () => console.log('Server running on http://127.0.0.1:3007'));
