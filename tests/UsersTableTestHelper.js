/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool')

const UsersTableHelper = {
    async addUser({
        id = 'user-qwe', username = 'dicoding', password = 'secret', fullname = 'Dicoding Indonesia'
    }) {
        const query = {
            text: 'insert into users values($1, $2, $3, $4)',
            values: [id, username, password, fullname]
        }

        await pool.query(query)
    },

    async findUserById(id) {
        const query = {
            text: 'select * from users where id = $1',
            values: [id]
        }

        const result = await pool.query(query)
        return result.rows
    },

    async cleanTable() {
        await pool.query('truncate table users')
    }
}

module.exports = UsersTableHelper
