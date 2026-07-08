import { gql } from "@apollo/client"

export const LIST_CATEGORIES = gql`
  query ListCategories {
    listCategories {
      id
      name
      description
      color
      icon
      transactionCount
    }
  }
`

export const GET_CATEGORY_STATS = gql`
  query GetCategoryStats {
    getCategoryStats {
      totalCategories
      totalTransactions
      mostUsedCategory {
        id
        name
        color
        icon
      }
    }
  }
`
