const dbQuery = require('../db/dbQuery');

exports.requestDump = async (req, res, next) => {
    console.log(req.originalUrl+" : "+ req.method+" : "+ res.statusCode);
    next();
}