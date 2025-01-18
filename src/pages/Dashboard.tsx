import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useReport } from '../hooks/useReport';
import { usePupils } from '../hooks/usePupils';
import { ChatBox } from '../components/Chat/ChatBox';
import { Tabs } from '../components/Tabs/Tabs';
import { PupilForm } from '../components/PupilForm';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';

const DEFAULT_REPORT_ID = '013eee03-6226-470d-ae9b-f9fe0a8948cd';

const TABS = [
  { id: 'chat', label: 'Chat Assistant' },
  { id: 'reports', label: 'Reports' },
];

interface ReportData {
  performance_summary: string;
  incorrect_questions: string;
  misunderstood_concepts: string;
  learning_material: string;
  practice_exercises: string;
}

export function Dashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('chat');
  const [selectedPupilId, setSelectedPupilId] = useState('');
  const [currentReportId, setCurrentReportId] = useState<string | null>(null);
  const [showAddPupil, setShowAddPupil] = useState(false);
  const [availableReports, setAvailableReports] = useState<Array<{ id: string, requested_at: string, report_title: string }>>([]);
  const { report, loading, error } = useReport(currentReportId || DEFAULT_REPORT_ID);
  const { pupils, loading: loadingPupils, refetch: refetchPupils } = usePupils();

  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('reports')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'reports',
          filter: `teacher_id=eq.${user.id}`,
        },
        (payload) => {
          toast.success('New report is ready!', {
            duration: 5000,
            icon: '📋',
          });
          fetchReports(selectedPupilId);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, selectedPupilId]);

  const fetchReports = async (pupilId: string) => {
    if (!pupilId) return;
    
    const { data, error } = await supabase
      .from('reports')
      .select('id, requested_at, report_title')
      .eq('pupil_id', pupilId)
      .order('requested_at', { ascending: false });

    if (error) {
      console.error('Error fetching reports:', error);
      return;
    }

    setAvailableReports(data);
    if (data.length > 0) {
      setCurrentReportId(data[0].id);
    } else {
      setCurrentReportId(null);
    }
  };

  useEffect(() => {
    fetchReports(selectedPupilId);
  }, [selectedPupilId]);

  const handlePupilChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPupilId(e.target.value);
  };

  const renderReportContent = () => {
    if (!selectedPupilId) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500">Please select a student to view their reports.</p>
        </div>
      );
    }

    if (!currentReportId) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500">No reports available for this student yet.</p>
        </div>
      );
    }

    if (!report?.report) return null;

    return (
      <div className="space-y-8">
        {/* Performance Summary */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4"></h3>
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown>{report.report.performance_summary}</ReactMarkdown>
          </div>
        </div>

        {/* Incorrect Questions */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4"></h3>
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown>{report.report.incorrect_questions}</ReactMarkdown>
          </div>
        </div>

        {/* Misunderstood Concepts */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4"></h3>
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown>{report.report.misunderstood_concepts}</ReactMarkdown>
          </div>
        </div>

        {/* Learning Materials */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4"></h3>
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown>{report.report.learning_material}</ReactMarkdown>
          </div>
        </div>

        {/* Practice Exercises */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4"></h3>
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown>{report.report.practice_exercises}</ReactMarkdown>
          </div>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-red-600 p-4">
          Failed to load report data. Please try again later.
        </div>
      );
    }

    switch (activeTab) {
      case 'chat':
        return (
          <ChatBox 
            selectedPupilId={selectedPupilId} 
            onReportGenerated={(reportId) => {
              setCurrentReportId(reportId);
              fetchReports(selectedPupilId);
            }} 
          />
        );
      case 'reports':
        return (
          <>
            {availableReports.length > 0 && (
              <div className="mb-6">
                <label htmlFor="report" className="block text-sm font-medium text-gray-700 mb-2">
                  Select Report
                </label>
                <select
                  id="report"
                  value={currentReportId || ''}
                  onChange={(e) => setCurrentReportId(e.target.value)}
                  className="block w-full rounded-lg border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                >
                  {availableReports.map((report) => (
                    <option key={report.id} value={report.id}>
                      {report.report_title || `Report from ${new Date(report.requested_at).toLocaleString()}`}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {renderReportContent()}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6">
            <div className="flex justify-between items-end mb-4">
              {!showAddPupil && <div className="flex-1 mr-4">
                <label htmlFor="pupil" className="block text-sm font-medium text-gray-700 mb-2">
                  Select Student
                </label>
                <select
                  id="pupil"
                  value={selectedPupilId}
                  onChange={handlePupilChange}
                  className="block w-full rounded-lg border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors disabled:opacity-50"
                  disabled={loadingPupils}
                >
                  <option value="">Choose a student...</option>
                  {pupils.map((pupil) => (
                    <option key={pupil.id} value={pupil.id}>
                      {pupil.name}
                    </option>
                  ))}
                </select>
                <button
                onClick={() => setShowAddPupil(!showAddPupil)}
                className="px-4 py-3 text-sm font-medium text-indigo-600 hover:text-indigo-700"
              >
                {showAddPupil ? '' : 'Or add New Student'}
              </button>
              </div>}
        
            </div>

            {showAddPupil && (
              <div className="mt-6 border-t pt-6">
                   <div className="flex items-center justify-left">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Add New Student</h2>
                    <button
                      onClick={() => setShowAddPupil(!showAddPupil)}
                      className="px-4 mb-3 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                    >
                      Cancel
                    </button>
                  </div>
                <PupilForm
                  onSuccess={() => {
                    setShowAddPupil(false);
                    refetchPupils();
                  }}
                />
              </div>
            )}
          </div>
          
          <div className="px-6">
            <Tabs
              tabs={TABS}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>

          <div className="p-6">
            {renderTabContent()}
          </div>
        </div>
      </main>
    </div>
  );
}