import dotenv from 'dotenv'

dotenv.config()

export default {
  PORT: process.env.PORT || '3000',
  JWT_SECRET_KEY:process.env.JWT_SECRET_KEY,
  MONGO_URI:process.env.MONGO_URI


}