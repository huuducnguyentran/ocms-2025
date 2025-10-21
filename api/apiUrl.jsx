// api/apiUrl.jsx
export const AUTH_URLS = {
  LOGIN: '/Authentication/login',
  FORGOT_PASSWORD: '/Authentication/forgot-password',
  RESET_PASSWORD: '/Authentication/reset-password',
  IMPORT_TRAINEE: "/User/import-trainees",
  GET_USER_BY_ROLE: "/User/get-all-by-role",
};

export const USER_URLS = {
  PROFILE: '/User/profile',
  UPDATE_PROFILE: '/User/profile',
  CHANGE_PASSWORD: '/User/change-password',
  UPLOAD_AVATAR: '/User/profile/avatar',
  GET_ALL_USERS: '/User/all',
};

export const SPECIALTY_URLS = {
  GET_ALL: '/Specialty/all',
  GET_BY_ID: '/Specialty',  
  CREATE: '/Specialty',
  UPDATE: '/Specialty',  
  DELETE: '/Specialty',  
};

export const INSTRUCTOR_ASSIGNATION_URLS = {
  GET_ALL: '/InstructorAssignation/all',
  GET_BY_COMPOSITE_KEY: '/InstructorAssignation',  
  GET_BY_SUBJECT: '/InstructorAssignation/subject',  
  GET_BY_INSTRUCTOR: '/InstructorAssignation/instructor', 
  CREATE: '/InstructorAssignation',
  DELETE: '/InstructorAssignation', 
};

export const SUBJECT_URLS = {
  GET_ALL: '/Subject/all',
  GET_BY_ID: '/Subject',  
  CREATE: '/Subject',
  UPDATE: '/Subject',  
  DELETE: '/Subject',  
  IMPORT: '/Subject/import',
  GET_BY_STATUS: '/Subject/status',  
  APPROVE: '/Subject',  
  REJECT: '/Subject',  
  REQUEST_NEW: '/Subject',  
  REQUEST_MODIFY: '/Subject',  
};

export const COURSE_URLS = {
  GET_ALL: '/Course/all',
  GET_BY_ID: '/Course',  
  CREATE: '/Course',
  UPDATE: '/Course',  
  DELETE: '/Course',  
  GET_BY_STATUS: '/Course/status',  
  GET_SUBJECTS: '/Course',  
  APPROVE: '/Course',  
  REJECT: '/Course',  
  REQUEST_NEW: '/Course',  
  REQUEST_MODIFY: '/Course',  
};

export const CLASS_URLS = {
  GET_ALL: '/Class/all',
  GET_BY_ID: '/Class',  // /{classId}
  CREATE: '/Class',
  UPDATE: '/Class',  // /{classId}
  DELETE: '/Class',  // /{classId}
};

export const CLASSGROUP_URLS = {
  GET_ALL: '/ClassGroup/all',
  GET_BY_ID: '/ClassGroup',  // /{classGroupId}
  CREATE: '/ClassGroup',
  UPDATE: '/ClassGroup',  // /{classGroupId}
  DELETE: '/ClassGroup',  // /{classGroupId}
  GET_CLASSES: '/ClassGroup',  // /{classGroupId}/classes
};

export const COURSE_SUBJECT_SPECIALTY_URLS = {
  GET_ALL: '/CourseSubjectSpecialty/all',
  GET_BY_COMPOSITE_KEY: '/CourseSubjectSpecialty',  // /{specialtyId}/{subjectId}/{courseId}
  GET_BY_COURSE: '/CourseSubjectSpecialty/course',  // /course/{courseId}
  GET_BY_SPECIALTY: '/CourseSubjectSpecialty/specialty',  // /specialty/{specialtyId}
  GET_BY_SUBJECT: '/CourseSubjectSpecialty/subject',  // /subject/{subjectId}
  CREATE: '/CourseSubjectSpecialty',
  DELETE_BY_COURSE: '/CourseSubjectSpecialty/course',  // /course/{courseId}
  DELETE_BY_SPECIALTY: '/CourseSubjectSpecialty/specialty',  // /specialty/{specialtyId}
  REQUEST_NEW: '/CourseSubjectSpecialty',  // /{specialtyId}/{subjectId}/{courseId}/request/new
  REQUEST_MODIFY: '/CourseSubjectSpecialty',  // /{specialtyId}/{subjectId}/{courseId}/request/modify
};