// api/apiUrl.jsx
export const AUTH_URLS = {
  LOGIN: "/Authentication/login",
  FORGOT_PASSWORD: "/Authentication/forgot-password",
  RESET_PASSWORD: "/Authentication/reset-password",
  IMPORT_TRAINEE: "/User/import-trainees",
  GET_USER_BY_ROLE: "/User/get-all-by-role",
  GET_EXTERNAL_CERTIFICATE_BY_USER_ID: "ExternalCertificate/user",
  GET_EXTERNAL_CERTIFICATE_BY_ID: "ExternalCertificate",
  UPDATE_EXTERNAL_CERTIFICATE_FILE: "ExternalCertificate",
  UPDATE_EXTERNAL_CERTIFICATE: "ExternalCertificate",
  CREATE_EXTERNAL_CERTIFICATE: "ExternalCertificate",
};

export const USER_URLS = {
  PROFILE: "/User/profile",
  UPDATE_PROFILE: "/User/profile",
  CHANGE_PASSWORD: "/User/change-password",
  UPLOAD_AVATAR: "/User/profile/avatar",
};

export const PLAN_URLS = {
  GET_ALL_PLANS: "/api/Plan/all",
  GET_PLAN_BY_ID: "/api/Plan",
  GET_PLAN_WITH_COURSE_BY_ID: "/api/Plan",
};

export const COURSE_URLS = {
  GET_ALL_COURSE: "/Course/all",
  GET_COURSE_BY_ID: "/Course",
};
