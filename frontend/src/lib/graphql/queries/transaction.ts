import { gql } from "@apollo/client"

export const LIST_TRANSACTIONS = gql`
  query ListTransactions($filters: ListTransactionsInput) {
    listTransactions(filters: $filters) {
      items {
        id
        title
        amount
        type
        date
        categoryId
        category {
          id
          name
          color
          icon
        }
      }
      total
      page
      limit
    }
  }
`
