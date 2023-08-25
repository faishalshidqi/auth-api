/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool')

const AuthenticationsTableTestHelper = {
    async addToken(token) {
        const query = {
            text: 'insert into authentications values($1)',
            values: [token]
        }
        await pool.query(query)
    },

    async findToken(token) {
        const query = {
            text: 'select * from authentications where token = $1',
            values: [token]
        }

        const result = await pool.query(query)
        return result.rows
    },

    async cleanTable() {
        await pool.query('truncate table authentications')
    }
}

module.exports = AuthenticationsTableTestHelper
