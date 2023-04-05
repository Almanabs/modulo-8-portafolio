const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ error: 'Acceso denegado' });
    }

    try {
        const decoded = jwt.verify(token, '123456');
        req.usuario = decoded;
        next();
    } catch (error) {
        res.status(400).json({ error: 'Token inválido' });
    }
}

module.exports = verificarToken;
