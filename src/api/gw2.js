import axios from 'axios'

const BASE_URL = 'https://api.guildwars2.com/v2'

const gw2Api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  params: {
    lang: 'en',
  },
})

// 自動帶入 API Key（若有設定）
gw2Api.interceptors.request.use((config) => {
  const apiKey = localStorage.getItem('gw2_api_key')
  if (apiKey) {
    config.params = { ...config.params, access_token: apiKey }
  }
  return config
})

gw2Api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.text || error.message || '未知錯誤'
    return Promise.reject(new Error(message))
  }
)

export default gw2Api
