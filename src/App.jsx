import { Routes, Route, Navigate } from "react-router";

import Layout from "./components/Layout";
import HomePage from "./page/Home/HomePage";
import ProfilePage from "./page/Home/ProfilePage";
import EditProfilePage from "./page/Home/EditProfilePage";
import ChangePasswordPage from "./page/Home/ChangePasswordPage";
import ImportTraineePage from "./page/Trainee/ImportTraineePage";
import VerifyCertificatePage from "./page/Certificate/PublicCertificatePage";
import LoginPage from "./page/Login/LoginPage";
import ForgotPasswordPage from "./page/Login/ForgotPasswordPage";
import ResetPasswordPage from "./page/Login/ResetPasswordPage";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";
import ViewTraineePage from "./page/Trainee/ViewTraineePage";
import AccountPage from './page/Account/AccountPage';
import SpecialtyPage from './page/Specialty/SpecialtyPage';
import InstructorAssPage from './page/InstructorAss/InstructorAssPage';
import SubjectPage from './page/Subject/SubjectPage';
import SubjectDetailsPage from './page/Subject/SubjectDetailsPage';
import CoursePage from './page/Course/CoursePage';
import CourseDetailsPage from './page/Course/CourseDetailsPage';
import ClassPage from './page/Class/ClassPage';
import CourseSubjectSpecialtyPage from './page/CourseSubjectSpecialty/CourseSubjectSpecialtyPage';
import TraineeDetailPage from "./page/Trainee/TraineeDetail";
import ExternalCertificateDetailPage from "./page/Trainee/ExternalCertificatePage";
import TrainingPlanPage from "./page/TrainingPlan/PlanPage";

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/verify" element={<VerifyCertificatePage />} />
      <Route path="/accounts" element={<AccountPage />} />
      
      {/* Protected routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<HomePage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="edit-profile" element={<EditProfilePage />} />
        <Route path="change-password" element={<ChangePasswordPage />} />
        <Route path="trainees-import" element={<ImportTraineePage />} />
        <Route path="trainees-view" element={<ViewTraineePage />} />
        <Route path="specialty" element={<SpecialtyPage />} />
        <Route path="instructor-assignment" element={<InstructorAssPage />} />
        <Route path="subject" element={<SubjectPage />} />
        <Route path="subject/:subjectId" element={<SubjectDetailsPage />} />
        <Route path="all-courses" element={<CoursePage />} />
        <Route path="course/:courseId" element={<CourseDetailsPage />} />
        <Route path="class" element={<ClassPage />} />
        <Route path="course-subject-specialty" element={<CourseSubjectSpecialtyPage />} />
        <Route path="/trainee/:id" element={<TraineeDetailPage />} />
        <Route path="/plan" element={<TrainingPlanPage />} />
        <Route
          path="/external-certificate/:id"
          element={<ExternalCertificateDetailPage />}
        />
      </Route>
      {/* Redirect any unknown routes to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;