// === JWT 토큰 header 정보를 포함하는 파일입니다 ===

module.exports = {
    secretKey : 'YoUrSeCrEtKeY', // 원하는 시크릿 키
    options : {
        algorithm : "HS256", // 해싱 알고리즘
        expiresIn : "30m",  // 토큰 유효 기간
        issuer : "covid19" // 발행자
    }
}