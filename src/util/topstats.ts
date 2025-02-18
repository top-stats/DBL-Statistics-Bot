import { Client } from '@topstats/sdk/dist'

const topStatsAPI = new Client({
  token: process.env.TOP_GG_TOKEN || ""
})

export default topStatsAPI;