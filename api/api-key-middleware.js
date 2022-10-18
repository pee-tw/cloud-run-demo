const FRONTEND_URL = 'https://frontend-5crg7qpwtq-as.a.run.app'

module.exports = (req, res, next) => {
  const secret = process.env.API_SECRET
  const apiKey = req.get('x-api-key')
  if (apiKey !== secret) return res.sendStatus(401)

  res.header('Access-Control-Allow-Origin', FRONTEND_URL)
  res.header('Access-Control-Allow-Headers', '*')

  next()
}
