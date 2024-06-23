import sqlite3 from "sqlite3";
import { Database } from 'sqlite3';
import { exemptedKeywords } from "../configs/db";

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

    runSqlQueryWrite = async (query: string, successMessage: string, errorMessage: string): Promise<void> => {

        return new Promise((resolve, reject) => {

            if (this.db) {
                this.db.run(query, (err: Error | null) => {
                    if (err) {
                        console.error(`${errorMessage}: ${err.message}`)
                        reject(err)
                    } else {
                        console.log(successMessage)
                        resolve()
                    }
                });
            } else {
                reject(new Error("Database is not open."))
            }
        })
    }

    runSqlQueryRead = async (query: string): Promise<any> => {
        return new Promise((resolve, reject) => {
            this.db.all(query, [], (err, rows) => {
                if (err) {
                    console.error(err.message)
                    reject(err);
                    return
                }
                resolve(rows);
            })
        })
    }
   

    createTable = async (tableName: string, itemsTable: string): Promise<void> => {

            const createTableSQL = `CREATE TABLE IF NOT EXISTS ${tableName} (${itemsTable})`;
            await this.runSqlQueryWrite(createTableSQL, `Table "${tableName}" created or already exists.`, "Error creating table")
    }

    insertIntoTable = async (tableName: string, fieldsValues: {}): Promise<void> => {

            let fields = ""
            let values = ""
            for (const [key, value] of Object.entries(fieldsValues)) {
                
                fields = `${fields}, ${key}`
                if (exemptedKeywords.includes(value as string)) values = `${values}, ${value}`
                else values = `${values}, "${value}"`
            }
            fields = `(${fields.slice(1)})`
            values = `(${values.slice(1)})`


            const insertIntoTable = `INSERT INTO ${tableName} ${fields} VALUES ${values}`
            console.log(insertIntoTable)
            try {
                await this.runSqlQueryWrite(insertIntoTable, "Entry inserted successfully.", "Error inserting into table")
            } catch (error) {
                if (error.code == "SQLITE_CONSTRAINT") console.log("item already exists in table")
                else console.log(error)
            } 


    }

    getValuesFromTable = async (tableName: string, requiredFields: Array<string>): Promise<any> => {
        let getValuesSql = "";
        requiredFields.forEach(element => {
            getValuesSql = `${getValuesSql} ${element},`
        })
        getValuesSql = `SELECT${getValuesSql.slice(0, -1)} FROM ${tableName}`
        return this.runSqlQueryRead(getValuesSql)

    }

    getValuesFromTableWithConditions = async (tableName: string, conditions: {}): Promise<any[]> => {

        let getValuesSql = `SELECT * FROM ${tableName} WHERE`
        for (const [key, value] of Object.entries(conditions)) {
            getValuesSql = `${getValuesSql} ${key}="${value}" AND`

        }
        getValuesSql = getValuesSql.slice(0, -4)

        return this.runSqlQueryRead(getValuesSql)

    }
    
    updateRow = async (tableName: string, updateValues: {}, conditions: {}): Promise<void> => {

        let updateEntry = `UPDATE ${tableName} SET `
        for (const [key, value] of Object.entries(updateValues)) {
            if (exemptedKeywords.includes(value as string))
                updateEntry = `${updateEntry}${key}=${value}, `
            else
                updateEntry = `${updateEntry}${key}="${value}", `
        }
        updateEntry = `${updateEntry.slice(0,-2)} WHERE`
        for (const [key, value] of Object.entries(conditions)) {
            updateEntry = `${updateEntry} ${key}="${value}",`
        }
        updateEntry = updateEntry.slice(0,-1)

        console.log(updateEntry)
        await this.runSqlQueryWrite(updateEntry, `Entry updated`, "Error while updating entry")
    }

    removeRow = async (tableName: string, conditions: {}): Promise<void> => {

        let removeEntry = `DELETE FROM ${tableName} WHERE `
        for (const [key, value] of Object.entries(conditions)) {
            removeEntry = `${removeEntry}${key}="${value}" AND `
        }
        removeEntry = removeEntry.slice(0,-5)

        console.log(removeEntry)
        await this.runSqlQueryWrite(removeEntry, `Entry removed`, "Error while removing entry")
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