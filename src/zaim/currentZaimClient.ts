import { Money } from './type'
import { ZaimClient } from './zaimClient'

export class CurrentZaimClient extends ZaimClient {
  constructor() {
    super(
      process.env.CURRENT_ZAIM_KEY as string,
      process.env.CURRENT_ZAIM_SECRET as string,
      process.env.CURRENT_ZAIM_TOKEN as string,
      process.env.CURRENT_ZAIM_TOKEN_SECRET as string
    )
  }

  /**
   * 全ての私費の支出を取得する
   * ただし「キャリーオーバー」レコードは除外する
   */
  async getAllPrivatePayments(): Promise<Money[]> {
    return (await this.getMoney('payment')).filter(m => {
      return m.comment.match('私費') && !m.comment.match('キャリーオーバー') && !m.comment.match('小遣い積立')
    })
  }

  /**
   * 全ての公費を取得する
   */
  async getAllPublicPayments(): Promise<Money[]> {
    return (await this.getMoney('payment')).filter(m => {
      return !m.comment.match('私費')
    })
  }

  /**
   * 全ての収入を取得する
   */
  async getAllIncomes(): Promise<Money[]> {
    return await this.getMoney('income')
  }

  /**
   * バックアップ用の全期間の収入、支出レコードを出力する
   * NOTE: zaimClient 側で期間を調整してから実行すること
   */
  async getAllMoneyData(): Promise<Money[]> {
    const allPaymentsResponse = await this.getMoney('payment')
    const allIncomesResponse = await this.getMoney('income')
    return allPaymentsResponse.concat(allIncomesResponse)
  }
}
