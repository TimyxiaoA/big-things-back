//导入数据库操作模块
const db = require('../db/index');

// 获取文章分类列表的处理函数
exports.getArticleCates = (req, res) => {
	// 1.定义 SQL 语句
	const sql = `select * from ev_article_cate where is_delete=0 order by id asc`;

	//调用db 函数
	db.query(sql, (err, results) => {
		if (err) return res.cc(err);
		res.send({
			status: 0,
			message: '获取文章分类成功!',
			data: results
		});
	});
};

//新增文章分类的处理函数
exports.addArticleCates = (req, res) => {
	// 1定义查询 分类名称 与 分类别名 是否被占用的 SQL 语句
	const sql = `select * from ev_article_cate where name=? or alias=?`;

	//2.调用 db.query() 执行查重的操作：
	db.query(sql, [req.body.name, req.body.alias], (err, results) => {
		if (err) return res.cc(err);
		// return res.send(results);
		// name 被一条数据占用了 alias被另一条数据占用了
		if (results.length === 2) return res.cc('分类名称和分类别名都被占用!');
		//name 和 alias 被一条数据占用了
		if (results.length === 1 && req.body.name === results[0].name && req.body.alias === results[0].alias) return res.cc('分类名称和分类别名都被占用!');
		// name 被占用
		if (results.length === 1 && req.body.name === results[0].name) return res.cc('分类名称被占用,请更换后再试!');
		// alias 被占用
		if (results.length === 1 && req.body.alias === results[0].alias) return res.cc('分类别名被占用,请更换后再试!');

		//! 未被占用后更新数据库
		const sql = `insert into ev_article_cate set ?`;
		db.query(sql, req.body, (err, results) => {
			if (err) return res.cc(err);

			if (results.affectedRows !== 1) return res.cc('添加文章分类失败!');

			res.cc('添加文章分类成功!', 0);
		});
	});
};

//根据 id 删除文章分类的处理函数
exports.deleteCateById = (req, res) => {
	// 定义 SQL 语句 软删除 (通过标记)
	const sql = `update ev_article_cate set is_delete=1 where id=?`;
	//调用 db 函数
	db.query(sql, req.params.id, (err, results) => {
		if (err) return res.cc(err);

		if (results.affectedRows !== 1) return res.cc('删除文章分类失败!');

		res.cc('删除文章分类成功!', 0);
	});
};

//根据 id 获取文章分类的处理函数
exports.getCateById = (req, res) => {
	// 定义 SQL 语句 软删除 (通过标记)
	const sql = `select * from ev_article_cate where is_delete=0 and id=?`;
	//调用 db 函数
	db.query(sql, req.params.id, (err, results) => {
		if (err) return res.cc(err);

		if (results.length !== 1) return res.cc('获取文章分类失败!');

		res.send({
			status: 0,
			message: '获取文章分类成功!',
			data: results[0]
		});
	});
};

// 根据 id 更新文章分类的处理函数
exports.updateCateById = (req, res) => {
	// 1定义查询 分类名称 与 分类别名 是否被占用的 SQL 语句
	const sql = `select * from ev_article_cate where is_delete=0 and id=? and(name=? or alias=?)`;

	//2.调用 db.query() 执行查重的操作：
	db.query(sql, [req.body.Id, req.body.name, req.body.alias], (err, results) => {
		if (err) return res.cc(err);
		// return res.send(results);
		// name 被一条数据占用了 alias被另一条数据占用了
		if (results.length === 2) return res.cc('分类名称和分类别名都被占用!');
		//name 和 alias 被一条数据占用了
		if (results.length === 1 && req.body.name === results[0].name && req.body.alias === results[0].alias) return res.cc('分类名称和分类别名都被占用!');
		// name 被占用
		if (results.length === 1 && req.body.name === results[0].name) return res.cc('分类名称被占用,请更换后再试!');
		// alias 被占用
		if (results.length === 1 && req.body.alias === results[0].alias) return res.cc('分类别名被占用,请更换后再试!');

		//! 未被占用后更新数据库
		const sql = `update ev_article_cate set ? where id=?`;
		db.query(sql, [req.body, req.body.Id], (err, results) => {
			if (err) return res.cc(err);

			if (results.affectedRows !== 1) return res.cc('更新文章分类失败!');

			res.cc('更新文章分类成功!', 0);
		});
	});
};
