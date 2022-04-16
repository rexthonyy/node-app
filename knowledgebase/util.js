const fetch = require('node-fetch');

async function sendRequest(url, options =  {method: "GET"}) {
	let response = await fetch(url, options);
	return response.json();
}

function paginate(req, values){
	let page = req.query.page ? Number(req.query.page) : 1;
	let limit = req.query.limit ? Number(req.query.limit) : 5;
	const startIndex = (page - 1) * limit;
	const endIndex = page * limit;
	const result = {};
	result.totalPages = Math.ceil(values.length/limit);
	if(endIndex < values.length){
		result.next = {
			page: page + 1,
			limit: limit
		};
	}
	if(startIndex > 0){
		result.previous = {
			page: page - 1,
			limit: limit
		}
	}

	result.results = values.slice(startIndex, endIndex);
	return result;
}

function sortByUpdatedAt(a,b){
	return new Date(b.updated_at) - new Date(a.updated_at);
}

function sortByPosition(a,b){
	return a.position - b.position;
}

function isEmailValid(email){
	return String(email)
		.toLowerCase()
		.match(
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		);
}

module.exports = {
	sendRequest,
	paginate,
	sortByUpdatedAt,
	sortByPosition,
	isEmailValid
};