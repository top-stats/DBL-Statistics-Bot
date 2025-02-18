import { Client } from '@topstats/sdk/dist'

const topStatsAPI = new Client({
  token: process.env.TOPSTATS_API_TOKEN || ""
})

export default topStatsAPI;