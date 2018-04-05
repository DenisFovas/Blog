const pg = require('pg')
const POOL = pg.Pool
const CLIENT = pg.Client

let DBConnection = (_dbName, _user, _password, _server, _port, _db) => {
    this._dbname = _dbName
    this._user = _user
    this._password = _password
    this._server = _server
    this._port = _port
    this._db = _db
    console.log(this);
}
module.exports = DBConnection