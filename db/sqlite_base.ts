import sqlite3 from "sqlite3";
import { Database } from 'sqlite3';
import { bigw } from "../configs/db";

export default class SQLBase {

    private db: sqlite3.Database

    constructor() {
        this.db = new Database('sql_database.db', (err) => {
            if (err) {
                console.log("database already exists")
            } else {
                console.log('Connected to the SQLite database.')
            }
        });
      }

    createTable = async (tableName: String): Promise<void> => {

        return new Promise((resolve, reject) => {
            const createTableSQL = `CREATE TABLE IF NOT EXISTS ${tableName} (${bigw.itemsTable})`;

            if (this.db) {
                this.db.run(createTableSQL, (err: Error | null) => {
                    if (err) {
                        console.error(`Error creating table: ${err.message}`)
                        reject(err)
                    } else {
                        console.log('Table created or already exists.')
                        
                        resolve()
                    }
                });
            } else {
                reject(new Error("Database is not open."))
            }
        })
    }

       
    }













// const db = new sqlite3.Database('sql_database');

// db.serialize(() => {
//     db.run("CREATE TABLE lorem (info TEXT)");

//     const stmt = db.prepare("INSERT INTO lorem VALUES (?)");
//     for (let i = 0; i < 10; i++) {
//         stmt.run("Ipsum " + i);
//     }
//     stmt.finalize();

//     db.each("SELECT rowid AS id, info FROM lorem", (err, row) => {
//         console.log(row.id + ": " + row.info);
//     });
// });

// db.close();