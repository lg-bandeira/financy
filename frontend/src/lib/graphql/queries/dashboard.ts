import { gql } from "@apollo/client"

export const GET_DASHBOARD_SUMMARY = gql`
  query GetDashboardSummary($month: Float, $year: Float) {
    getDashboardSummary(month: $month, year: $year) {
      balance
      monthlyExpenses
      monthlyIncome
      recentTransactions {
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
      categoryBreakdown {
        itemCount
        totalAmount
        category {
          id
          name
          color
          icon
        }
      }
    }
  }
`
