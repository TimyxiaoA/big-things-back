const joi = require('@hapi/joi');

// 定义 分类名称 和 分类别名 的校验规则
const name = joi.string().required();
const alias = joi.string().alphanum().required();

// 定义 id 的效验规则
const id = joi.number().min(1).required();

// 添加分类 的效验规则对象
exports.add_cate_schema = {
	body: {
		name,
		alias
	}
};

// 根据 id 删除分类 的效验规则对象
exports.delete_cate_schema = {
	params: {
		id
	}
};

//根据 id 获取文章分类的 效验规则对象
exports.get_cate_schema = {
	params: {
		id
	}
};

//根据 id 更新文章分类的 效验规则对象
exports.update_cate_schema = {
	body: {
		Id: id,
		name,
		alias
	}
};
