// 重构版本：325.js — 325 论证器
// 任意整数 → 只含 "325"（3/2/5、32/5、3/25 切分）与 + - * / ( ) 的表达式
// Node:  const zc = require('./zc');  zc(1919810)
// 页面:  <script src="zc.js"></script> 后直接调用 zc(1919810)

const UNITS = {
	0: '(3+2-5)',
	1: '(3*2-5)',
	5: '((3-2)*5)',
	6: '(3-2+5)',
	10: '(3+2+5)',
	11: '(3*2+5)',
	13: '(3+2*5)',
	21: '(3*(2+5))',
	25: '((3+2)*5)',
	27: '(32-5)',
	28: '(3+25)',
	30: '(3*2*5)',
	37: '(32+5)',
	75: '(3*25)',
	160: '(32*5)',
	325: '325',
	'-1': '(3/(2-5))',
	'-4': '(3-2-5)',
	'-7': '(3-2*5)',
	'-9': '(3*(2-5))',
	'-22': '(3-25)',
};

// 对象键是字符串，先转成 [值, 表达式] 列表，避免遍历时反复转换
const UNITS_LIST = Object.entries(UNITS).map(([k, e]) => [Number(k), e]);

// 预计算：单单元 + 双单元组合能表达的所有整数（含负值），同值留最短写法
const known = new Map();
const put = (v, e) => {
	if (!Number.isInteger(v)) return;
	const old = known.get(v);
	if (old === undefined || old.length > e.length) known.set(v, e);
};
for (const [v, e] of UNITS_LIST) put(v, e);
for (const [v1, e1] of UNITS_LIST)
	for (const [v2, e2] of UNITS_LIST) {
		put(v1 + v2, `(${e1}+${e2})`);
		put(v1 - v2, `(${e1}-${e2})`);
		put(v1 * v2, `(${e1}*${e2})`);
		if (v2 !== 0 && v1 % v2 === 0) put(v1 / v2, `(${e1}/${e2})`);
	}

const memo = new Map();

// 主函数：任意整数 → 只含 325 的表达式
function zc(n) {
	n = Math.trunc(n);
	if (!Number.isFinite(n)) throw new TypeError('zc(n): n 需要是有限数字');
	if (known.has(n)) return known.get(n);   // 小数字（含 -1、-4 等负值）直接命中
	if (memo.has(n)) return memo.get(n);

	let res;
	if (n < 0) {
		res = `((3+2-5)-(${zc(-n)}))`;       // 负数兜底：0 - |n|
	} else {
		// 大数：n = 单元值 × 商 + 余，每种切法都试，取最短表达式
		let best = '';
		for (const [v, e] of UNITS_LIST) {
			if (v <= 1) continue;
			const q = Math.floor(n / v), r = n % v;
			if (q < 1) continue;
			const cand =
				r === 0 ? `(${e}*${zc(q)})` :
				q === 1 ? `(${e}+${zc(r)})` :
				`((${e}*${zc(q)}+${zc(r)}))`;
			if (!best || cand.length < best.length) best = cand;
		}
		res = best;
	}
	memo.set(n, res);
	return res;
}

// 双导出：CommonJS（Node / 打包器）+ 浏览器全局
if (typeof module !== 'undefined' && module.exports) module.exports = zc;
if (typeof window !== 'undefined') window.zc = zc;
