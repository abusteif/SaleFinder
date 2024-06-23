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