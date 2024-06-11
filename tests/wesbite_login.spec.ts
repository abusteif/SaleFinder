import { test, expect } from '@playwright/test';
import BigWLoginPage from '../pages/bigw/homePage'
import ClearancePage, {categoryFilterOptions} from '../pages/bigw/clearancePage'

test('can search', async ({ page }) => {
    let loginPage = new BigWLoginPage(page)
    await loginPage.goto()

    await loginPage.searchForText("clearance")
    let clearancePage = new ClearancePage(page)
    await page.waitForTimeout(3000); 
    await clearancePage.scrollToCategoryFilter()
    await clearancePage.clickFilter("category")
    await clearancePage.selectFilterOption(categoryFilterOptions.BabyNursery)
    console.log(await clearancePage.getItems())
});