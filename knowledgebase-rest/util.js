const fetch = require('node-fetch');
const consts = require('./consts');
const jwt = require('jsonwebtoken');


async function sendRequest(url, options =  {method: "GET"}) {
	let response = await fetch(url, options);
	//console.log(response);
	return response.json();
}

function authenticateToken(req, res, next){
	const accessToken = req.cookies[consts.COOKIE_ID];
	if(accessToken == undefined) return res.status(403).json({ status: "error", message: "Authentication failed" });
	jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
		if(err) return res.status(403).json({ status: "error", message: "Authentication failed" });
		req.user = user;
		next();
	});
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

function authenticateHeader(req, res, next){
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];
	if(token == null) return res.status(401).json({ status: 401, message: "Unauthorized" });

	// get the identity details
    let endpoint = `:4434/identities/${token}`;
    let options =  {
		method: "GET",
		headers: {
			'Content-Type': 'application/json'
		}
	};
    sendRequest(consts.KRATOS_ROOT + endpoint, options)
    .then(json => {
		if(json.error) return res.status(401).json({ status: 401, message: "Unauthorized" });
		req.user = json;
        next();
    }).catch(err => {
        console.error(err);
		res.status(500).json({ status: 500, message: "Internal error" });
    });
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
	authenticateToken,
	paginate,
	authenticateHeader,
	sortByUpdatedAt,
	sortByPosition,
	isEmailValid
};