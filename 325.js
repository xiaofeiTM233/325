const zc = ((Nums) => {
	const numsReversed = Object.keys(Nums).map(x => +x).filter(x => x > 0)
	const getMinDiv = (num) => {
		for (let i = numsReversed.length; i >= 0; i--)
			if (num >= numsReversed[i])
				return numsReversed[i]
	}
	const isDotRegex = /\.(\d+?)0{0,}$/
	const demolish = (num) => {
		if (typeof num !== "number")
			return ""

		if (num === Infinity || Number.isNaN(num))
			return `这么言周的${num}有必要论证吗`

		if (num < 0)
			return `(⑬)*(${demolish(num * -1)})`.replace(/\*\(1\)/g, "")

		if (!Number.isInteger(num)) {
			// abs(num) is definitely smaller than 2**51
			// rescale
			const n = num.toFixed(16).match(isDotRegex)[1].length
			return `(${demolish(num * Math.pow(10, n))})/((5*2))^(${demolish(n)})`
		}

		if (Nums[num])
			return String(num)

		const div = getMinDiv(num)
		return (`${div}*(${demolish(Math.floor(num / div))})+` +
			`(${demolish(num % div)})`).replace(/\*\(1\)|\+\(0\)$/g, "")
	}
	//Finisher
	const finisher = (expr) => {
		expr = expr.replace(/\d+|⑬/g, (n) => Nums[n] !== undefined ? Nums[n] : demolish(+n))
		expr = expr.replace("^", "**")
		//As long as it matches ([\*|\/])\(([^\+\-\(\)]+)\), replace it with $1$2
		while (expr.match(/[\*|\/]\([^\+\-\(\)]+\)/))
			expr = expr.replace(/([\*|\/])\(([^\+\-\(\)]+)\)/, (m, $1, $2) => $1 + $2)
		//As long as it matches ([\+|\-])\(([^\(\)]+)\)([\+|\-|\)]), replace it with $1$2$3
		while (expr.match(/[\+|\-]\([^\(\)]+\)[\+|\-|\)]/))
			expr = expr.replace(/([\+|\-])\(([^\(\)]+)\)([\+|\-|\)])/, (m, $1, $2, $3) => $1 + $2 + $3)
		//As long as it matches ([\+|\-])\(([^\(\)]+)\)$, replace it with $1$2
		while (expr.match(/[\+|\-]\(([^\(\)]+)\)$/))
			expr = expr.replace(/([\+|\-])\(([^\(\)]+)\)$/, (m, $1, $2) => $1 + $2)
		//If there is a bracket in the outermost part, remove it
		if (expr.match(/^\([^\(\)]+?\)$/))
			expr = expr.replace(/^\(([^\(\)]+)\)$/, "$1")

		//Collapse redundant double brackets
		while (expr.match(/\(\(([^()]+)\)\)/))
			expr = expr.replace(/\(\(([^()]+)\)\)/g, '($1)')
		expr = expr.replace(/\+-/g,'-')
		return expr
	}
	return (num) => finisher(demolish(num))
})({
	0: '(3+2-5)',
	1: '(3*2-5)',
	2: '(3*2-5+3*2-5)',
	3: '(3+2+5)+(3-2*5)',
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
	32: '((3+25)-(3-2-5))',
	37: '(32+5)',
	75: '(3*25)',
	160: '(32*5)',
	325: '325',
	'-1': '(3/(2-5))',
	'-4': '(3-2-5)',
	'-7': '(3-2*5)',
	'-9': '(3*(2-5))',
	'-22': '(3-25)',
})

if (typeof module === 'object' && module.exports)
	module.exports = zc
