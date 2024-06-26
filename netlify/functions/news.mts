import axios from "axios"
import express from "express"
import serverless from "serverless-http"

const newsApi = axios.create({
  baseURL: "https://newsapi.org/v2",
  headers: {
    "x-api-key": process.env.NEWS_API_KEY
  }
})

const toQueryString = (obj: Record<string, any | undefined>): string =>
  Object.entries(obj)
    .reduce<any>((acc, curr) => curr[1] ? [...acc, curr] : acc, [])
    .map(([key, value], i) => `${i === 0 ? "?" : ""}${key}=${value}`)
    .join("&")

const api = express()
const router = express.Router()

router.get('/', async (req, res) =>
  res.json((await newsApi.get(`/everything${toQueryString(req.query)}`)).data)
    .send())

api.use((req, res, next) => {
  res.set({
    'access-control-allow-origin': 'https://cheffhub.netlify.app',
    'access-control-allow-methods': 'GET',
    'access-control-allow-headers': '*'
  })
  next()
})
api.use('/news/', router)
export const handler = serverless(api)
