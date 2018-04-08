const sqlite = require('sqlite3')

String.format = function () {
	var s = arguments[0]
	for (var i = 0; i < arguments.length - 1; i++) {
		var reg = new RegExp('\\{' + i + '\\}', 'gm')
		s = s.replace(reg, arguments[i + 1])
	}
	return s
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
	this._database = new sqlite.Database(this._filename, (err) => {
		if (err) {
			console.error('Invalid path file' + err)
		}
	})
	this._database.serialize(() => {
		const createUser = 'CREATE TABLE IF NOT EXISTS `Users` (' +
			'`user_id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,' +
			'`username`	TEXT NOT NULL UNIQUE,' +
			'`password`	TEXT NOT NULL,' +
			'`email`	TEXT NOT NULL' +
			');'
		const createAdmin = 'CREATE TABLE IF NOT EXISTS `Admins` (' +
			'`admin_id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,' +
			'`user_id`	INTEGER NOT NULL,' +
			'FOREIGN KEY(`user_id`) REFERENCES `Users`(`user_id`)' +
			');'
		const createArticle = 'CREATE TABLE IF NOT EXISTS `Articles` (' +
			'`article_id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,' +
			'`admin_id`	INTEGER NOT NULL,' +
			'`last_update`	TEXT NOT NULL,' +
			'`title`	TEXT NOT NULL,' +
			'`content`	TEXT NOT NULL,' +
			'FOREIGN KEY(`admin_id`) REFERENCES `Admins`(`admin_id`)' +
			');'
		const createComment = 'CREATE TABLE `Comments` (' +
			'`comment_id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,' +
			'`article_id`	INTEGER NOT NULL,' +
			'`user_id`	INTEGER NOT NULL,' +
			'`content`	TEXT NOT NULL,' +
			'FOREIGN KEY(`user_id`) REFERENCES `Users`(`user_id`),' +
			'FOREIGN KEY(`article_id`) REFERENCES `Articles`(`article_id`)' +
			');'
		this._database.run(createUser)
		this._database.run(createAdmin)
		this._database.run(createArticle)
		this._database.run(createComment)
	})
	this._database.close()
}

exports.insertUser = (username, password, email) => {
	this._database = new sqlite.Database(this._filename, (err) => {
		if (err) {
			console.error('Invalid path file:\n	 ' + err)
		}
	})
	this._database.serialize(() => {
		const InsertUser = String.format('INSERT INTO Users(\'username\', \'password\', \'email\') ' +
			'VALUES (\'{0}\', \'{1}\', \'{2}\');', username, password, email)
		console.log(InsertUser)
		this._database.run(InsertUser, (err) => {
			if (err) {
				console.error('Can\'t insert the values into User table' + err)
				throw new Error('Can\'t insert values into User table')
			}
		})

	})
	this._database.close()
}

exports.insertAdmin = (user_id) => {
	this._database = new sqlite.Database(this._filename, (err) => {
		if (err) {
			console.error('Invalid path file:\n	 ' + err)
		}
	})
	this._database.serialize(() => {
		const InsertUser = String.format('INSERT INTO Admnins(\'user_id\') ' +
			'VALUES (\'{0}\');', user_id)
		console.log(InsertUser)
		this._database.run(InsertUser, (err) => {
			if (err) {
				console.error('Can\'t insert the values into Admin table' + err)
				throw new Error('Can\'t insert values into Admin table')
			}
		})

	})
	this._database.close()
}

exports.insertArticle = (admin_id, last_update, title, content) => {
	this._database = new sqlite.Database(this._filename, (err) => {
		if (err) {
			console.error('Invalid path file:\n	 ' + err)
		}
	})
	this._database.serialize(() => {
		const InsertUser = String.format('INSERT INTO Articles(\'admin_id\', \'last_update\', \'title\', \'content\') ' +
			'VALUES (\'{0}\', {1}, {2}, {3});', admin_id, new Date(), title, content)
		console.log(InsertUser)
		this._database.run(InsertUser, (err) => {
			if (err) {
				console.error('Can\'t insert the values into Articles table' + err)
				throw new Error('Can\'t insert values into Articles table')
			}
		})

	})
	this._database.close()
}

exports.insertComment = (article_id, user_id, content) => {
	this._database = new sqlite.Database(this._filename, (err) => {
		if (err) {
			console.error('Invalid path file:\n	 ' + err)
		}
	})
	this._database.serialize(() => {
		const InsertUser = String.format('INSERT INTO Comments(\'article_id\', \'user_id\', \'content\') ' +
			'VALUES (\'{0}\', {1}, {2});', article_id, user_id, content)
		this._database.run(InsertUser, (err) => {
			if (err) {
				throw new Error('Can\'t insert values into Comments table')
			}
		})

	})
	this._database.close()
}

exports.getEntity = (ENTITY, key) => {
	let query = 'SELECT * FROM \'{0}\' WHERE {1} = \'{2}\';'
	let res = null
	this._database = new sqlite.Database(this._filename, (err) => {
		if (err) {
			console.error('Invalid path file:\n	 ' + err)
		}
	})
	if (ENTITY === 'Admin') {
		query = String.format(query, 'Admins', 'admin_id', key)
	} else if (ENTITY === 'Comment') {
		query = String.format(query, 'Comments', 'comment_id', key)
	} else if (ENTITY === 'User') {
		query = String.format(query, 'Users', 'username', key)
	} else if (ENTITY === 'Article') {
		query = String.format(query, 'Articles', 'article_id', key)
	} else {
		throw new Error('Invalid Entity request')
	}
	this._database.serialize(() => {
		this._database.get(query, (err, result) => {
			console.log(result)
			if (err) {
				throw new Error('Can\'t get values from table\n' + err)
			} else {
				res = result
			}
			console.log(result)
		})
	})
	this._database.close()
	return res
}

exports.removeEntity = (ENTITY, key) => {
	this._database = new sqlite.Database(this._filename, (err) => {
		if (err) {
			console.error('Invalid path file:\n	 ' + err)
		}
	})
	let query = 'DELETE FROM \'{0}\' WHERE {1} = \'{2}\';'
	if (ENTITY === 'Admin') {
		query = String.format(query, 'Admins', 'admin_id', key)
	} else if (ENTITY === 'Comment') {
		query = String.format(query, 'Comments', 'comment_id', key)
	} else if (ENTITY === 'User') {
		query = String.format(query, 'Users', 'username', key)
	} else if (ENTITY === 'Article') {
		query = String.format(query, 'Articles', 'article_id', key)
	} else {
		throw new Error('Invalid Entity request')
	}
	this._database.serialize(() => {
		this._database.run(query, (err) => {
			if (err) {
				throw new Error('Can\'t delete values from table \n' + err)
			} 
		})
	})
	this._database.close()
}

exports.updateEntity = () => {
	// TODO: Continue this, maybe i need to make it so that we change only some parts of this. Also, the admin should not be updated.
	// Only the articles or the comments should be updated
	this._database = new sqlite.Database(this._filename, (err) => {
		if (err) {
			console.error('Invalid path file:\n	 ' + err)
		}
	})
	this._database.close()
}