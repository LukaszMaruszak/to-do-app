const mysql = require('mysql');
const dotenv = require('dotenv');
let instance = null;
dotenv.config();

const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DB_PORT
});

connection.connect((err) => {
    if(err) throw err;
    console.log('connected');
});

class DbService {
    static getDbServiceInstance(){
        return instance ? instance : new DbService();
    }

    async getAllData(id){
        id = parseInt(id);
        try{
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM task WHERE LIST_ID = ?";

                connection.query(query, [id], (err, results) => {
                    if(err) reject(new Error(err.message))
                    resolve(results)
                })
            });

            return response;
        } catch(error) {
            console.log(error)
        }
    }
    //INSERT INTO task (Title, List_ID, Done, Task_Date) VALUES ('Zakupy', 1, 0, '1999-09-01');

    async insertNewTask(task){
        try {
            const insertId = await new Promise((resolve, reject) => {
                const query = "INSERT INTO task (Title, List_ID, Done, Task_Date) VALUES (?,?,?,?)";

                connection.query(query, [task.Title, task.ListID, task.Done, task.TaskDate], (err, result) => {
                    if(err) reject(new Error(err.message))
                    resolve(result.insertId);
                })
            });

            return {
                id: insertId,
                title: task.Title,
                ListID: task.ListID,
                Done: task.Done,
                TaskDate: task.TaskDate
            };
        }catch (error){
            console.log(error)
        }
    }

    async deleteTask(id){
        id = parseInt(id, 10);
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "DELETE FROM task WHERE Task_ID  = ?";

                connection.query(query, [id], (err, result) => {
                    if(err) reject(new Error(err.message))
                    resolve(result.affectedRows);
                })
            });

            return response === 1 ? true : false;
        }catch (error){
            console.log(error)
            return false;
        }
    }

    async updateTask(id, done){
        id = parseInt(id, 10);
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "UPDATE task SET Done = ? WHERE Task_ID  = ?";

                connection.query(query, [done, id], (err, result) => {
                    if(err) reject(new Error(err.message))
                    resolve(result.affectedRows);
                })
            });

            return response === 1 ? true : false;
        }catch (error){
            console.log(error)
            return false;
        }
    }
}

module.exports = DbService;