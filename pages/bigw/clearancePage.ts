import { expect, type Locator, type Page } from '@playwright/test';
import { WebsiteItem } from '../../models/common';
import { MAX_RETRY_ATTEMPTS } from '../../configs/generic';
const playwright = require('playwright');

// BabyNursery = 'field-8404-baby-nursery-clearance__Baby & Nursery Clearance',


export default class ClearancePage {
    readonly page: Page;
    readonly categoryFilter: Locator;

    constructor(page: Page) {
        this.page = page;
        this.categoryFilter = this.page.getByTestId("filter-btn-type-category")
      }

    scrollToCategoryFilter = async () => {
        while (!(await this.categoryFilter.isVisible())) {
            await this.page.mouse.wheel(0, 600);
        }        
    }

    clickFilter = async () => {
        let retryNum = 0
        while (true && retryNum < MAX_RETRY_ATTEMPTS) {
            try {
                await this.categoryFilter.click()
                await this.page.getByTestId("facet-value-section-category")
                break
            } catch (error) {
                console.log("filter dropdown didn't appear")
                retryNum++
            }
        }
    }

    getCategoryElement = async (category: string): Promise<Locator> => {
        return this.page.getByRole("checkbox", {name: category, exact: true})

    }

    getCategories = async (): Promise<string[]> => {
        await this.clickFilter()
        let categories: string[] = []
        let filterElements = await this.page.locator("li.FacetInputWrapper_FacetInputWrapper__kkptH").all()
        for (const element of filterElements) {
            let name = await element.locator(".checkbox-label").textContent() ?? ""
            categories = [...categories, name]
        }
        await this.categoryFilter.click()
        return categories
    }

    selectFilterOption = async (cat: string) => {
        let catElement = await this.getCategoryElement(cat)
        try {
            await catElement.check()

        } catch (error) {
            if (error.message.includes("Clicking the checkbox did not change its state")) {}
            else {
                console.log(error)
                throw error
            }
        } 
    }

    unselectFilterOption = async (cat: string) => {
        let catElement = await this.getCategoryElement(cat)
        try {
            await catElement.uncheck()
        } catch (error) {
            if (error.message.includes("Clicking the checkbox did not change its state")) { } 
            else {
                console.log(error)
                throw error
            }
        }
}

    getItems = async (): Promise<WebsiteItem[]> => {
        var results: WebsiteItem[] = []
        let retryNum = 0
        while (true && retryNum < MAX_RETRY_ATTEMPTS) {
            try {
                const moreButton = this.page.getByRole("link", {"name": "Load more"}) 
                await moreButton.click({timeout: 10000})
                retryNum++
                await this.page.waitForTimeout(1000); 
    
              } catch (error) {
                if (error instanceof playwright.errors.TimeoutError) {
                    break
                }
              }

        }
        console.log(retryNum)
        const items = await this.page.getByTestId("search-results").getByTestId("product-tile").all()
        for (const item of items) {
           
            const priceElements = await item.getByTestId("price-section").locator(".PriceRange.ProductPrice.variant-large-thin").getByTestId("price").getByTestId("price-value").all()
            const itemName = await item.getAttribute("aria-label")
            // console.log(itemName)
            if (itemName) {
                let itemDetails: WebsiteItem = {
                    name: itemName.replace('"', ''),
                    price: 0
                }
                // results[itemName] = 0
                for (const pe of priceElements) {
                    const hasAttribute = await pe.evaluate(el => el.hasAttribute('content'))
                    if (hasAttribute) {
                        const price1 = await pe.getAttribute("content")
                        // console.log(price1)
                        // results[itemName] = price1
                        if (price1) itemDetails.price = parseFloat(price1)
                    } 
                    // else {
                    //     const price2 = await pe.textContent()
                    //     // console.log(price2)
                    //     if(price2) results[itemName] += ` - ${price2}`
                    // }
                }
                // console.log(itemName + ": " + results[itemName])
                const itemExists = results.some(item => item.name === itemDetails.name)
                if (!itemExists) results.push(itemDetails)
            }
    
        }
        return results
    }
}