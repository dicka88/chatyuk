const { Pool } = require('pg')

const { DB_USER, DB_PASS, DB_HOST, DB_PORT, DB_DATABASE } = process.env

const connectionString = `postgresql://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}`

const pool = new Pool({
    connectionString,
    // ssl: {
    //     rejectUnauthorized: false,
    // }
})

const insert_user = async(userLogin) => {
    const { user_id, login, name, github, avatar_url } = userLogin

    // select this user_id
    const selectUser = `SELECT * FROM chatyuk.user WHERE user_id = '${user_id}' and github = '${github}'`
    try {
        let select = await pool.query(selectUser)
        let count = await select.rowCount
        if (count) {
            return select.rows
        }
    } catch (e) {
        console.log("gagal select: " + e)
    }

    const insert = `INSERT into chatyuk.user (user_id, login, name, github, path_photo) values('${user_id}', '${login}', '${name}', '${github}', '${avatar_url}')`
    try {
        let exec = await pool.query(insert)
        if (exec) {
            console.log("success insert user");
        }

        return []
    } catch (e) {
        console.log("gagal insert : "+ e)
    }
}

const insert_messages = async({ time, user_id, message }) => {
    console.log(time)
    try {
        const queryInsert = `INSERT INTO chatyuk.message (time, user_id, message) values('${time}', '${user_id}', '${message}')`
        await pool.query(queryInsert)
    } catch (e) {
        console.log(e)
    }

}

const get_messages = async(pagination = 0) => {
    try {
        const querySelect = `SELECT * FROM chatyuk.message m INNER JOIN chatyuk.user u on m.user_id = u.user_id order by time desc limit 50 offset ${pagination}`
        const exec = await pool.query(querySelect)
        return exec.rows
    } catch (e) {
        console.log(e)
    }
}

module.exports = { pool, insert_user, insert_messages, get_messages }