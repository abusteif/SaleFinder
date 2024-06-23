import { expect, type Locator, type Page } from '@playwright/test';
import { WebsiteItem } from '../../models/common';
const playwright = require('playwright');


export enum categoryFilterOptions {
    BabyNursery = 'field-8404-baby-nursery-clearance__Baby & Nursery Clearance',
    Reset = 'reset',
    Button = 'button'
  }


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

    clickFilter = async (filter:string) => {
        await this.categoryFilter.click()
    }

    getCategories = async (): Promise<(string | null)[]> => {
        let categories: (string | null)[] = []
        let filterElements = await this.page.locator("li.FacetInputWrapper_FacetInputWrapper__kkptH").all()
        for (const element of filterElements) {
            let filterItem = await element.locator(".checkbox-label").textContent()
            categories.push(filterItem)

        }
        return categories
    }

    selectFilterOption = async (option:categoryFilterOptions) => {
        try {
            await this.categoryFilter.click()
            await this.page.getByRole("checkbox", {name: "Baby & Nursery Clearance"}).check()
            await this.categoryFilter.click()

        } catch (error) {
            if (error.message.includes("Clicking the checkbox did not change its state")) {}
            else {
                console.log(error)
                throw error
            }
        } 
        // this.clickFilter("category")
    }

    getItems = async (): Promise<WebsiteItem[]> => {
        var results: WebsiteItem[] = []
        while(true) {
            try {
                const moreButton = this.page.getByRole("link", {"name": "Load more"}) 
                await moreButton.click({timeout: 10000})
    
              } catch (error) {
                if (error instanceof playwright.errors.TimeoutError) {
                    break
                }
              }

        }
        const items = await this.page.getByTestId("search-results").getByTestId("product-tile").all()
        for (const item of items) {
           
            const priceElements = await item.getByTestId("price-section").locator(".PriceRange.ProductPrice.variant-large-thin").getByTestId("price").getByTestId("price-value").all()
            const itemName = await item.getAttribute("aria-label")
            // console.log(itemName)
            if (itemName) {
                let itemDetails: WebsiteItem = {
                    name: itemName,
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
                results.push(itemDetails)
            }
    
        }
        return results
    }
}