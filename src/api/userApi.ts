import { mainClient } from './apiClients'
import { ENDPOINTS } from './endpoints'

const userApi = {
  getMe: async () => {
    return await mainClient.get(ENDPOINTS.USERS.ME)
  }
}

export default userApi
