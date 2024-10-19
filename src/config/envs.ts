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

}



