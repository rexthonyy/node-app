const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const pgKratosQueries = require('../postgres/kratos-queries');
const pgUserQueries = require('../postgres/user-queries');

const fs = require('fs');
const YAML = require('yaml');

const config = YAML.parse(fs.readFileSync('./config/index.yml', 'utf8'));
const expiresIn = config.session.expires_in;

router.get("/", (req, res) => {
	let response_type = req.query.response_type;
    let redirect_uri = req.query.redirect_uri;
	let scopes = req.query.scope.split(" ");
    let state = req.query.state;

	req.session.response_type = response_type;
	req.session.redirect_uri = redirect_uri;
	req.session.scopes = scopes;
	req.session.sate = state;

	let accessToken = req.cookies[process.env.COOKIE_ID];
	if(accessToken == undefined ){
		loginUser(req, res);
	}else{
		jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
			if(err) {
				console.error(err);
				loginUser(req, res);
			}else{
				pgUserQueries.getUserId([user.id], result => {
					if(result.err || result.res.length == 0){
						return loginUser(req, res);
					}

					user = result.res[0];
					let refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);

					return returnRedirect(req, res, accessToken, refreshToken);
				});
			}
		});
	}
	
});

function returnRedirect(req, res, accessToken, refreshToken){
    let redirect_uri = req.session.redirect_uri;
    let state = req.session.state;

	return res.redirect(`${redirect_uri}?state=${state}&accessToken=${accessToken}&refreshToken=${refreshToken}`);
}

function loginUser(req, res){
	res.redirect("/oauth2/login");
}

router.get("/login", (req, res) => {
	res.render("login");
});

router.post("/login", (req, res) => {
	console.log(req.body);
	
	let email = req.body.email;
	let password = req.body.password;

	let values = [
		email,
		password
	];

	console.log(values);

	pgUserQueries.getUserByEmailAndPassword(values, result => {
		if(result.err || result.res.length == 0){
			return res.redirect("/oauth2/login");
		}

		let user = result.res[0];

		let accessToken = generateAccessToken(user);
		let refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);

		pgKratosQueries.createSessionToken([refreshToken], result => {
			if(result.err){
				console.error(result.err);
				res.sendStatus(501);
			}

			res.cookie(process.env.COOKIE_ID, accessToken, { maxAge: 1000 * 60 * 60 * parseInt(expiresIn), httponly: true });
			returnRedirect(req, res, accessToken, refreshToken);
		});
	});
});

router.get("/signup", (req, res) => {
	res.render("signup");
});

function generateAccessToken(user){
	return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: expiresIn });
}

function isAuthenticated(req, res){
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(" ")[1];
	if(token == null) return res.sendStatus(401);
	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
		if(err) return res.sendStatus(403);
		req.user = user;
		next();
	});
}
/*
{
    "data": {
      "externalAuthenticationUrl": {
        "authenticationData": "{\"authorizationUrl\": \"https://saleor-test.eu.auth0.com/authorize?response_type=code&client_id=RUgv72Cvzd5xjlMtgOEQLJ8QF4eQ3e1U&redirect_uri=http%3A%2F%2F127.0.0.1%3A3000%2Fcallback&scope=openid+profile+email+offline_access&state=eyJyZWRpcmVjdFVyaSI6Imh0dHA6Ly8xMjcuMC4wLjE6MzAwMC9jYWxsYmFjayJ9%3A1l1W9H%3AFsxnhejCQKB4JdFL-t0BqNPrHtODh9T0mG2E3KzT-bQ\"}",
        "accountErrors": []
      }
    }
  }
*/









router.get("/authorize", (req, res) => {
	console.log("authorize");
    console.log(req.query);
	console.log(req.body);
    let code = req.params.code;
    let state = req.params.state;

    let token = "";
    let refreshToken = "";
    let csrfToken = "";
    let identityId = "";
    let user_email = "";

    res.json({
        data: {
          externalObtainAccessTokens: {
            token,
            refreshToken,
            csrfToken,
            user: {
              id: identityId,
              email: user_email
            },
            accountErrors: []
          }
        }
      });
});
/*
{
    "data": {
      "externalObtainAccessTokens": {
        "token": "eyJ0eXAiOiJKV1QiL....SzVVNO6oTVMCTbpgFhqo-yRzsq0Q5ZK2GVn3R_KTjmc",
        "refreshToken": "eyJ0eXAiOiJKV1QiLCJ...bi5vcGVuaWRjb25uZWN0In0.o_ZDrQYOImCg1ne7pJKdKB-DNyuW6OKkjNwP05lyPNw",
        "csrfToken": "qRLs15tbipqOfZuFs8kQYzpj927vfhBPqWj4jg0Uc9D1WPPpUbw2jEP1R7p7gVL4",
        "user": {
          "id": "VXNlcjoyNA==",
          "email": "saleor.user@saleor.io"
        },
        "accountErrors": []
      }
    }
  }
*/













router.post("/token/refresh", (req, res) => {
    let refreshToken = req.params.refreshToken;
	if(refreshToken == null) return res.sendStatus(401);

	pgKratosQueries.getSessionToken([refreshToken], result => {
		if(result.err){
			console.error(result.err);
			return res.sendStatus(401);
		}

		if(result.res.length == 0) return res.sendStatus(403);

		jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
			if(err) return res.sendStatus(403);
			const accessToken = generateAccessToken(user);
			res.json({ accessToken, refreshToken });
		});
	});
});
/*
{
    "data": {
      "externalRefresh": {
        "token": "eyJ0eXAiOiJKV1QiLCJhbGci....-pk-qCvbJ1M7tqSzP0",
        "refreshToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIU...sBboyMFcWTIe92NcWlqEI9AYlJL6o",
        "csrfToken": "Ejdvo8PTLG0M9YAGHCnBvyldmDrd6SjmhfQDWBIaCymZzW8eRUAL4sz4Cx91q0yR",
        "accountErrors": []
      }
    }
  }
*/









router.get("/token/verify", isAuthenticated, (req, res) => {
    let isValid = true;
    let verifyData = req.user;
    let user_email = req.user.email;

    res.json({
        data: {
            externalVerify: {
                isValid,
                verifyData,
                user: {
                    email: user_email,
                    userPermissions: []
                },
                accountErrors: []
            }
        }
      });
});
/*
 {
    "data": {
      "externalVerify": {
        "isValid": true,
        "verifyData": "{\"iat\": 1602143144, \"token\": \"xgS4ZELKlUHQ\", \"email\": \"admin@example.com\", \"type\": \"access\", \"user_id\": \"VXNlcjoyNQ==\", \"is_staff\": false, \"exp\": 1602179144, \"oauth_access_key\": \"tM-LHXMbxP5IANhPUd24_y5jjv0SCSj2\", \"owner\": \"mirumee.authentication.openidconnect\"}",
        "user": {
          "email": "admin@example.com",
          "userPermissions": []
        },
        "accountErrors": []
      }
    }
  }
*/


router.get("/keys", (req, res) => {
	console.log("keys");
    console.log(req.query);
	console.log(req.body);
	res.sendStatus(401);
});

router.get("/userDetails", isAuthenticated, (req, res) => {
	pgUserQueries.getUser([req.user.id], result => {
		if(result.err) res.sendStatus(401);
		res.json(result.res);
	});
});


router.get("/logout", (req, res) => {
	console.log("logout");
    console.log(req.query);
	console.log(req.body);
    let returnTo = req.params.returnTo;


    res.json({
        data: {
            externalLogout: {
                logoutData: {
                    logoutUrl: `http://${process.env.HOST}/auth/logout?returnTo=${returnTo}`
                },
                accountErrors: []
            }
        }
      });
});

/*
{
  "data": {
    "externalLogout": {
      "logoutData": "{\"logoutUrl\": \"https://saleor-test.eu.auth0.com/v2/logout?returnTo=http%3A%2F%2Flocalhost%3A3000\"}",
      "accountErrors": []
    }
  }
}
*/
module.exports = router;