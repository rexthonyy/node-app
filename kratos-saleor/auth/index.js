const express = require("express");
const router = express.Router();
const { authenticator } = require('otplib');

router.get("/", (req, res) => {
  	console.log(req);
    let redirectUrl = req.params.redirectUrl;
    let state = authenticator.generateSecret();
    let client_id = req.params.client_id;
    let scope = req.params.scope;
    let response_type = "code";

    let localhost = process.env.HOST;

    res.json({
        data: {
          externalAuthenticationUrl: {
            authenticationData: {
                authorizationUrl: `http://${localhost}/authorize?response_type=${response_type}&client_id=${client_id}&redirect_uri=${redirectUrl}&scope=${scope}&state=${state}`
            },
            accountErrors: []
          }
        }
      });
});
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













router.get("/token/refresh", (req, res) => {
    let refreshToken = req.params.refreshToken;
    let csrfToken = req.params.csrfToken;

    let token = "";

    res.json({
        data: {
            externalRefresh: {
            token,
            refreshToken,
            csrfToken,
            accountErrors: []
          }
        }
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









router.get("/token/verify", (req, res) => {
    let accessToken = req.params.token;
    let refreshToken = req.params.refreshToken;
    let csrfToken = req.params.csrfToken;

    let isValid = true;
    let verifyData = "";
    let user_email = "";

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


router.get("/logout", (req, res) => {
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