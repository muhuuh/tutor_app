interface ProfilDashboardProps {
  pupilId: string;
}

export function ProfilDashboard({ pupilId }: ProfilDashboardProps) {
  if (!pupilId) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">
          Please select a student to view their profile
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">Student Profile</h2>
      {/* Add your profile content here */}
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">Profile content coming soon...</p>
      </div>
    </div>
  );
}
