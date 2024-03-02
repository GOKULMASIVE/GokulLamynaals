var jwt = require('jsonwebtoken');
var SESSION_tokenSECRET = process.env.SESSION_tokenSECRET
var SESSION_refreshTokenSECRET = process.env.SESSION_refreshTokenSECRET

function verifyToken(req, res, next) {
    if (req.headers['x-access-token']) {
        var token = req.headers['x-access-token'];
        jwt.verify(token, SESSION_tokenSECRET, { complete: true }, function (err, decoded) {
            if (err) {
                return res.status(404).send({ error: true, message: 'Failed to authenticate user.' });
            } else {
                req.userId = decoded.payload.id;
                next();
            }


        });
    } else if (req.headers['x-refresh-token']) {
        var token = req.headers['x-refresh-token'];
        jwt.verify(token, SESSION_refreshTokenSECRET, { complete: true }, function (err, decoded) {
            if (err) {
                return res.status(404).send({ error: true, message: 'Failed to authenticate user.' });
            }
            else {
                req.userId = decoded.payload.id;
                next();
            }

        });
    } else {
        res.status(403).send({ error: true, message: 'Invalid User' });
    }

}
module.exports = verifyToken;