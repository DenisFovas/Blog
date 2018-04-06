const sqlite = require('sqlite3')

String.format = function () {
    var s = arguments[0];
    for (var i = 0; i < arguments.length - 1; i++) {
        var reg = new RegExp("\\{" + i + "\\}", "gm");
        s = s.replace(reg, arguments[i + 1]);
    }
    return s;
}

/**
 * Create a database object.
 * @param {path to a file, representing the sqlite database} filename 
 */
exports.create = (filename) => {
    this._filename = filename
    this._database = null
    return this
}

/** Create the tables for the database*/
exports.createTables = () => {
    this._database = new sqlite.Database(this._filename, (err, success) => {
        if (err) {
            console.error("Invalid path file" + err)
        }
    })
    this._database.serialize(() => {
        const createUser = "CREATE TABLE IF NOT EXISTS `Users` (" + 
                "`user_id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE," + 
                "`username`	TEXT NOT NULL UNIQUE," +
                "`password`	TEXT NOT NULL," +
                "`email`	TEXT NOT NULL" +
            ");"
        const createAdmin = "CREATE TABLE IF NOT EXISTS `Admins` (" + 
                "`admin_id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT," +
                "`user_id`	INTEGER NOT NULL," + 
                "FOREIGN KEY(`user_id`) REFERENCES `Users`(`user_id`)" +
            ");"
        const createArticle = "CREATE TABLE IF NOT EXISTS `Articles` (" + 
                "`article_id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT," + 
                "`admin_id`	INTEGER NOT NULL," +
                "`last_update`	TEXT NOT NULL," +
                "`title`	TEXT NOT NULL," +
                "`content`	TEXT NOT NULL," +
                "FOREIGN KEY(`admin_id`) REFERENCES `Admins`(`admin_id`)" +
            ");"
        const createComment = "CREATE TABLE `Comments` (" + 
                "`comment_id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT," +
                "`article_id`	INTEGER NOT NULL," +
                "`user_id`	INTEGER NOT NULL," +
                "`content`	TEXT NOT NULL," +
                "FOREIGN KEY(`user_id`) REFERENCES `Users`(`user_id`)," +
                "FOREIGN KEY(`article_id`) REFERENCES `Articles`(`article_id`)" +
            ");"
        this._database.run(createUser) 
        this._database.run(createAdmin) 
        this._database.run(createArticle) 
        this._database.run(createUser) 
    })
    this._database.close()
}

exports.insertUser = (username, password, email) => {
    this._database = new sqlite.Database(this._filename, (err, success) => {
        if (err) {
            console.error("Invalid path file:\n\t " + err)
        }
    })
    this._database.serialize(() => {
        const InsertUser = String.format("INSERT INTO Users('username', 'password', 'email') " + 
            "VALUES ('{0}', '{1}', '{2}');", username, password, email);
        console.log(InsertUser)
        this._database.run(InsertUser, (err, result) => {
            if (err) {
                console.error("Can't insert the values into User table" + err)
                throw new Error('Can\'t insert values into User table')
            }
        })

    })
    this._database.close()
}