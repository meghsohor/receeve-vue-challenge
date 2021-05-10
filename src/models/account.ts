export interface Account {
  id: string,
  debtor: {
    title: string,
    firstName: string,
    lastName: string,
    address: {
      address: string,
      city: string,
      state: string,
      zip: number,
      country: string
    },
    mobilePhone: string,
    email: string
  }
}