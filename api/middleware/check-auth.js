const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        // Mengambil token tanpa include Bearer
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decoded;
        next();
    } catch (error) {
        return res.status(401)/json({
            message: 'Unauthorized'
        });
    }
}