import { Locator } from "@playwright/test"

export interface ItemTablesItem {
    id: string
    item: string
    price: number
    date: string
  }

export interface WebsiteItem {
  name: string
  price: number
}

export interface NewItem {
  name: string
  price: number
}

export interface ChangedItem {
  name: string
  oldPrice: number
  newPrice: number

}

// export interface CategoryItem {
//   name: string,
//   element: Locator
// }