import {ENVIRONMENT} from "../config/app.config";

const logger = (arg) => {
  if (ENVIRONMENT !== "production") {
    // eslint-disable-next-line
    console.log(arg);
  }
  return false;
};

export default logger;
