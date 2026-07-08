import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql'
import { DashboardSummary } from '../dtos/output/dashboard.output'
import { DashboardService } from '../services/dashboard.service'
import { IsAuth } from '../middlewares/auth.middleware'
import { GqlUser } from '../graphql/decorators/user.decorator'
import { UserModel } from '../models/user.model'

@Resolver()
@UseMiddleware(IsAuth)
export class DashboardResolver {
  private dashboardService = new DashboardService()

  @Query(() => DashboardSummary)
  async getDashboardSummary(
    @GqlUser() user: UserModel,
    @Arg('month', () => Number, { nullable: true }) month?: number,
    @Arg('year', () => Number, { nullable: true }) year?: number
  ): Promise<DashboardSummary> {
    return this.dashboardService.getSummary(user.id, month, year)
  }
}
