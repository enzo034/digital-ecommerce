import 'dotenv/config';
import { get } from 'env-var';


export const envs = {

  PORT: get('PORT').required().asPortNumber(),

  JWT_SEED: get('JWT_SEED').required().asString(),

  WEB_URL: get('WEB_URL').required().asUrlString(),

  SEND_EMAIL: get('SEND_EMAIL').required().asBool(),
  MAILER_SERVICE: get('MAILER_SERVICE').required().asString(),
  MAILER_EMAIL: get('MAILER_EMAIL').required().asEmailString(),
  MAILER_SERCRET_KEY: get('MAILER_SERCRET_KEY').required().asString(),

  CLOUDINARY_CLOUD_NAME: get("CLOUDINARY_CLOUD_NAME").required().asString(),
  CLOUDINARY_API_KEY: get("CLOUDINARY_API_KEY").required().asString(),
  CLOUDINARY_API_SECRET: get("CLOUDINARY_API_SECRET").required().asString(),

  MONGO_DB_NAME: get('MONGO_DB_NAME').required().asString(),
  MONGO_URL: get('MONGO_URL').required().asUrlString()

}



