export const common = {
    categoriesTable: "id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, store TEXT NOT NULL, UNIQUE(name, store)"
}
export const bigw = {
    itemsTable: "id INTEGER PRIMARY KEY AUTOINCREMENT, item TEXT NOT NULL UNIQUE, price NUMERIC NOT NULL, category TEXT NOT NULL, date DATE",

}
export const exemptedKeywords = [
    "datetime('now')"
]