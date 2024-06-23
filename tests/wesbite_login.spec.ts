import { test, expect } from '@playwright/test';
import BigWHomePage from '../pages/bigw/homePage'
import ClearancePage, {categoryFilterOptions} from '../pages/bigw/clearancePage'
import SQLBase from '../db/sqlite_base';
import { bigw, common } from "../configs/db";
import { ChangedItem, ItemTablesItem, NewItem } from '../models/common';
import Email from '../helpers/email';

test('bigw', async ({ page }) => {
    let store = "bigw"
    let storeDBObject = bigw
    let homeScreen = new BigWHomePage(page)
    const sql = new SQLBase()
    let email = new Email()
    sql.createTable("categories", common.categoriesTable)
    sql.createTable(store, storeDBObject.itemsTable)
    // sql.updateRow(store, {price:100, date:"datetime('now')"}, {item:"b.box Fill 'n Feed Squeeze Pouch"})

    await homeScreen.goto()

    await homeScreen.searchForText("clearance")
    let clearancePage = new ClearancePage(page)
    await page.waitForTimeout(3000); 
    // await clearancePage.scrollToCategoryFilter()
    // await clearancePage.clickFilter("category")
    
    // let categories = await clearancePage.getCategories()
    // for (let cat of categories) {
    //     let query = {
    //         name: cat,
    //         store
    //     }
    //     await sql.insertIntoTable("categories", query)
    // }

       
    await clearancePage.selectFilterOption(categoryFilterOptions.BabyNursery)
    const websiteItemList = await clearancePage.getItems()
    // console.log(websiteItemList)
    let priceChangeItems: ChangedItem[] = []
    let newItems: NewItem[] = []

    for (const item of websiteItemList) {
        let newPrice = item.price
        let name = item.name
        let tableItemDetails = await sql.getValuesFromTableWithConditions(store, {item: name}) as ItemTablesItem[]
        // if item doesn't exist, add it to newItems array and to the items table
        if (tableItemDetails.length == 0) {
            let newItem: NewItem = {
                name,
                price: newPrice
            }
            newItems.push(newItem)
            sql.insertIntoTable(store, {item: name, price: newPrice, date: "datetime('now')"})
        }
        // if item exits, check if price has changed
        if (tableItemDetails.length > 0) {
            let oldPrice = tableItemDetails[0].price
            if (newPrice === oldPrice) {}
                // console.log(`Nothing changed for this item ${tableItemDetails[0].item}`)
            else {
                priceChangeItems.push( {name, oldPrice, newPrice})
                sql.updateRow(store, {price:newPrice, date:"datetime('now')"}, {item:name})
                console.log(`price change: old: ${oldPrice}, new: ${newPrice}`)
            }

        }
    }
    // if item is no longer on sale, remove it from items table
    let existingItems = await sql.getValuesFromTable(store, ["item", "price"]) as ItemTablesItem[]
    for (const oldItem of existingItems) {
        let fieldExists = websiteItemList.some(obj => obj.name === oldItem.item);
        if(!fieldExists)     
            sql.removeRow(store, {item:oldItem.item})
    }
    
    // console.log(`new items:`)
    // console.log(newItems)
    // console.log(`items with price change:`)
    // console.log(priceChangeItems)


})