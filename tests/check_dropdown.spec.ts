// import { test, expect } from '@playwright/test';
// import BigWHomePage from '../pages/bigw/homePage'
// import ClearancePage from '../pages/bigw/clearancePage'
// import SQLBase from '../db/sqlite_base';
// import { bigw, common } from "../configs/db";
// import { ChangedItem, ItemTablesItem, NewItem } from '../models/common';
// import Email from '../helpers/email';


// test('bigw', async ({ page }) => {

//     let store = "bigw"
//     let storeDBObject = bigw
//     let homeScreen = new BigWHomePage(page)
//     const sql = new SQLBase()
//     let email = new Email()

//     await homeScreen.goto()
//     await homeScreen.searchForText("clearance")
//     let clearancePage = new ClearancePage(page)
//     await page.waitForTimeout(3000); 

    
//     let categories = await clearancePage.getCategories()
//     await page.waitForTimeout(5000); 

//     let cat = categories[0]
//     await clearancePage.selectFilterOption(cat)
//     // await page.waitForTimeout(5000); 


// // })

// })
