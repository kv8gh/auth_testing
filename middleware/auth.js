const jwt = require('jsonwebtoken');
const SECRET_KEY = "NOTESAPI"

const auth = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).send('Access denied. No token provided.');
    }

    try {
        token = token.split(" ")[1];
        let user = jwt.verify(token,SECRET_KEY);
        req.userId = user.id;
        next();
    } catch (error) {
        return res.status(401).send('Invalid token.');
    }
};

module.exports = auth;
