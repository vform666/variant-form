
export function formatDate1(date) {
	if (new Date(Date.parse(date.replace(/-/g, "/"))) === "Invalid Date") {
		return date;
	}
	date = new Date(Date.parse(date.replace(/-/g, "/"))); //转换成Date
	let y = date.getFullYear();
	let m = date.getMonth() + 1;
	m = m < 10 ? '0' + m : m;
	let d = date.getDate();
	d = d < 10 ? ('0' + d) : d;
	return y + '-' + m + '-' + d;
}

export function formatDate2(date) {
	if (new Date(Date.parse(date.replace(/-/g, "/"))) === "Invalid Date") {
		return date;
	}
	date = new Date(Date.parse(date.replace(/-/g, "/"))); //转换成Date
	let y = date.getFullYear();
	let m = date.getMonth() + 1;
	m = m < 10 ? '0' + m : m;
	let d = date.getDate();
	d = d < 10 ? ('0' + d) : d;
	return y + '/' + m + '/' + d;
}

export function formatDate3(date) {
	if (new Date(Date.parse(date.replace(/-/g, "/"))) === "Invalid Date") {
		return date;
	}
	date = new Date(Date.parse(date.replace(/-/g, "/"))); //转换成Date
	let y = date.getFullYear();
	let m = date.getMonth() + 1;
	m = m < 10 ? '0' + m : m;
	let d = date.getDate();
	d = d < 10 ? ('0' + d) : d;
	return y + '年' + m + '月' + d +'日';
}

export function formatDate4(date) {
	if (new Date(Date.parse(date.replace(/-/g, "/"))) === "Invalid Date"){
		return date;
	}
	date = new Date(Date.parse(date.replace(/-/g, "/"))); //转换成Date
	return date.toLocaleString()
}

export function formatDate5(date) {
	if (new Date(Date.parse(date.replace(/-/g, "/"))) === "Invalid Date") {
		return date;
	}
	date = new Date(Date.parse(date.replace(/-/g, "/"))); //转换成Data();
	return date.toLocaleString('chinese', { hour12: false })
}

// ###,###,###,##0.######
export function formatNumber1(v) {
	if (typeof(v) != "number") {
		return v;
	}

	let length = v.toString().split(".")[1].length;
	switch(length){
		case 0:
				v = v.toFixed(0)
				break;
		case 1:
				v = v.toFixed(1)
				break;
		case 2:
				v = v.toFixed(2)
				break;
		case 3:
				v = v.toFixed(3)
				break;
		case 4:
				v = v.toFixed(4)
				break;
		case 5:
				v = v.toFixed(5)
				break;
		default:
				v = v.toFixed(6)
	}
	let res = v.toString().replace(/\d+/, function(n){ // 先提取整数部分
		return n.replace(/(\d)(?=(\d{3})+$)/g,function($1){
			return $1+",";
			});
		})
	return res;
}

//###,###,###,##0.00####
export function formatNumber2(v) {
	if (typeof(v) != "number") {
		return v;
	}

	let length = v.toString().split(".")[1].length;
	switch(length){
		case 0:
		case 1:
		case 2:
				v = v.toFixed(2)
				break;
		case 3:
				v = v.toFixed(3)
				break;
		case 4:
				v = v.toFixed(4)
				break;
		case 5:
				v = v.toFixed(5)
				break;
		default:
				v = v.toFixed(6)
	}

	let res = v.toString().replace(/\d+/, function(n){ // 先提取整数部分
		return n.replace(/(\d)(?=(\d{3})+$)/g,function($1){
			return $1+",";
			});
		})
	return res;
}

// ###,###,###,##0.000000
export function formatNumber3(v) {
	if (typeof(v) != "number") {
		return v;
	}

	v = v.toFixed(6)
	let res = v.toString().replace(/\d+/, function(n){ // 先提取整数部分
		return n.replace(/(\d)(?=(\d{3})+$)/g,function($1){
			return $1+",";
			});
		})
	return res;
}
// ###,###,###,##0.000
export function formatNumber4(v) {
	if (typeof(v) != "number") {
		return v;
	}

	v = v.toFixed(3)
	let res = v.toString().replace(/\d+/, function(n){ // 先提取整数部分
		return n.replace(/(\d)(?=(\d{3})+$)/g,function($1){
			return $1+",";
			});
		})
	return res;
}

// ###,###,###,##0.00
export function formatNumber5(v) {
	if (typeof(v) != "number") {
		return v;
	}

	v = v.toFixed(2)
	let res = v.toString().replace(/\d+/, function(n){ // 先提取整数部分
		return n.replace(/(\d)(?=(\d{3})+$)/g,function($1){
			return $1+",";
			});
		})
	return res;
}

// ###,###,###,##0
export function formatNumber6(v) {
	if (typeof(v) != "number") {
		return v;
	}

	v = v.toFixed(0)
	let res = v.toString().replace(/\d+/, function(n){ // 先提取整数部分
		return n.replace(/(\d)(?=(\d{3})+$)/g,function($1){
			return $1+",";
			});
		})
	return res;
}

// ###,##0.00##%
export function formatNumber7(v) {
	if (typeof(v) != "number") {
		return v;
	}

	let length = v.toString().split(".")[1].length;
	v = v*100
	switch(length){
		case 0:
		case 1:
		case 2:
				v = v.toFixed(2)
				break;
		case 3:
				v = v.toFixed(3)
				break;
		default:
				v = v.toFixed(4)
	}

	let res = v.toString().replace(/\d+/, function(n){ // 先提取整数部分
		return n.replace(/(\d)(?=(\d{3})+$)/g,function($1){
			return $1+",";
			});
		})
	return res+'%';
}
