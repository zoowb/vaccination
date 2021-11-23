// === JWT 토큰 생성 및 해석 ===
// 로그인 용도로 사용됩니다

const jwt = require("jsonwebtoken");
const secretKey = require('../config/token.js').secretKey;
const options = require('../config/token.js').options;

const TOKEN_EXPIRED = -1;
const TOKEN_INVALID = -2;

module.exports = {
    sign: async (user) => { // 토큰을 생성합니다 (jwt.sign로 인해 비동기 방식으로 동작합니다)
        const payload = { // 유저 정보
            id: user.id,
            ssn: user.ssn
        };
        const result = { token : jwt.sign(payload, secretKey, options) } // 토큰 생성
        return result;
    },
    verify: async (token) => { // 토큰을 해석합니다
        let decoded;
        try {
            decoded = jwt.verify(token, secretKey);
        } catch (err) {
            if (err.message === 'jwt expired') {
                console.log('expired token');
                return TOKEN_EXPIRED;
            } else if (err.message === 'invalid token') {
                console.log('invalid token');
                console.log(TOKEN_INVALID);
                return TOKEN_INVALID;
            } else {
                console.log("invalid token");
                return TOKEN_INVALID;
            }
        }
        return decoded;
    }
}