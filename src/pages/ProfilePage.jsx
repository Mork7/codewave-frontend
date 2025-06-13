import { useProfile } from "../hooks/";
import PersonalInfo from "../components/PersonalInfo";
import StudentCourseManager from "../components/StudentCourseManager";
import InstructorCourseManager from "../components/InstructorCourseManager";
import AdminActionsManager from "../components/AdminActionsManager";

function ProfilePage() {
  const { courseData, isLoading, role, setCourseData } = useProfile();

  // If data is still loading, show a loading message
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <section className="flex justify-between items-center h-screen overflow-hidden mt-6">
      {/* Degree Progress Section */}
      {role === "student" && (
        <StudentCourseManager
          courseData={courseData}
          setCourseData={setCourseData}
        />
      )}
      {role === "instructor" && (
        <InstructorCourseManager courseData={courseData} />
      )}
      {role === "admin" && <AdminActionsManager />}
      {/* Personal Information Section */}
      <PersonalInfo />
    </section>
  );
}

export default ProfilePage;
