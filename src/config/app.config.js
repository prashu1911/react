import { FILE_PATH } from "./api.config";

export const BASE_NAME = FILE_PATH;
export const NAME_KEY = "metolius";
export const ENVIRONMENT = process.env.REACT_APP_ENV || "development";
export const APP_NAME = process.env.REACT_APP_NAME || "Metolius";
export const ADMIN_IMAGE_URL = `/assets/admin-images`;
export const PARTICIPANT_IMAGE_URL = `/assets/participant-images`;
export const IR_LOGO = `${BASE_NAME}/v1/storage/uploads/images/IRLogos`;
export const COMPANY_LOGO = `${BASE_NAME}/v1/storage/images/logo`;
export const USER_LOGO = `${BASE_NAME}/v1/storage/uploads/images/profile`;

