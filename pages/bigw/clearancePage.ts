import { expect, type Locator, type Page } from '@playwright/test';

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

    selectFilterOption = async (option:categoryFilterOptions) => {
        try {
            await this.page.getByRole("checkbox", {name: "Baby & Nursery Clearance"}).check()
        } catch (error) {
            if (error.message.includes("Clicking the checkbox did not change its state")) {}
            else throw error
        }
        // this.clickFilter("category")
    }

    getItems = async () => {
        // await this.page.locator("ProductTile_tileLink__UPDgb").first().click()
        // await this.page.getByAltText("Gro-To Bad Dream Buster Calming Room Spray     70mL").click()
        const items = await this.page.getByTestId("product-tile").all()
        for (const item of items) {
            
            // console.log(await item.getAttribute("aria-label"))
            const priceElements = await item.getByTestId("price-section").locator(".PriceRange.ProductPrice.variant-large-thin").getByTestId("price").getByTestId("price-value").all()
            for (const pe of priceElements) {
                const hasAttribute = await pe.evaluate(el => el.hasAttribute('content'))
                if (hasAttribute)
                    console.log(await item.getAttribute("aria-label"))
                    console.log(await pe.getAttribute("content"))
            }
            


            

        }
        
        
        // let title = items.nth(0).locator("ProductTile_tileLink__UPDgb").locator("ProductTile_name__pqMxl")
        // console.log(await title.textContent())
    }
}