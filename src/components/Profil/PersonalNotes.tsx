import React, { useState, useEffect } from "react";
import { LoadingSpinner } from "../UI/LoadingSpinner";
import { supabase } from "../../lib/supabase";
import ReactMarkdown from "react-markdown";

// Define options that will be passed to the edge function
interface NoteSummarizationOptions {
  filteredNotes?: string[];
}

interface PersonalNotesProps {
  data?:
    | {
        ai_summary: string;
      }
    | string
    | null;
  studentId: string;
  isRefreshing?: boolean;
  onRefresh: (options?: NoteSummarizationOptions) => Promise<void>;
}

export const PersonalNotes: React.FC<PersonalNotesProps> = ({
  data,
  studentId,
  isRefreshing = false,
  onRefresh,
}) => {
  const [showSummary, setShowSummary] = useState(true);
  const [teacherNotes, setTeacherNotes] = useState<string[]>([]);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [addingNote, setAddingNote] = useState(false);
  const [showAddNoteForm, setShowAddNoteForm] = useState(false);
  const [showFilterOptions, setShowFilterOptions] = useState(false);

  // Filtering options
  const [filterOption, setFilterOption] = useState<"all" | "count">("all");
  const [noteCount, setNoteCount] = useState<number>(5);

  useEffect(() => {
    if (studentId) {
      fetchTeacherNotes();
    }
  }, [studentId]);

  // Ensure noteCount doesn't exceed available notes
  useEffect(() => {
    if (teacherNotes.length > 0 && noteCount > teacherNotes.length) {
      setNoteCount(teacherNotes.length);
    }
  }, [teacherNotes]);

  const fetchTeacherNotes = async () => {
    if (!studentId) return;

    try {
      setLoadingNotes(true);
      const { data: pupilData, error } = await supabase
        .from("pupils")
        .select("teacher_notes")
        .eq("id", studentId)
        .single();

      if (error) {
        console.error("Error fetching teacher notes:", error);
      } else {
        setTeacherNotes(pupilData?.teacher_notes || []);
      }
    } catch (err) {
      console.error("Failed to fetch teacher notes:", err);
    } finally {
      setLoadingNotes(false);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim() || !studentId) return;

    try {
      setAddingNote(true);

      // Get current notes first to append to them
      const { data: currentData, error: fetchError } = await supabase
        .from("pupils")
        .select("teacher_notes")
        .eq("id", studentId)
        .single();

      if (fetchError) {
        console.error("Error fetching current notes:", fetchError);
        return;
      }

      // Create updated notes array with the new note
      const updatedNotes = [
        ...(currentData?.teacher_notes || []),
        newNote.trim(),
      ];

      // Update the notes in the database
      const { error: updateError } = await supabase
        .from("pupils")
        .update({ teacher_notes: updatedNotes })
        .eq("id", studentId);

      if (updateError) {
        console.error("Error adding note:", updateError);
      } else {
        // Success - update local state
        setTeacherNotes(updatedNotes);
        setNewNote(""); // Clear input
        setShowAddNoteForm(false); // Hide form
      }
    } catch (err) {
      console.error("Failed to add note:", err);
    } finally {
      setAddingNote(false);
    }
  };

  // Get filtered notes based on the current filtering option
  const getFilteredNotes = () => {
    if (filterOption === "count" && teacherNotes.length > 0) {
      return teacherNotes.slice(-noteCount);
    }
    return teacherNotes;
  };

  const handleRefresh = async () => {
    // Determine which notes to include in the summary based on filter options
    let options: NoteSummarizationOptions = {};

    if (filterOption === "count") {
      // Only send the filtered notes when using the count filter
      options.filteredNotes = getFilteredNotes();
    }

    await onRefresh(options);
    // Refresh notes after refreshing the summary
    fetchTeacherNotes();
    // Hide filter options after applying
    setShowFilterOptions(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-5 border-b border-gray-100">
        <h3 className="text-lg font-medium text-gray-900">Personal Notes</h3>
        <div className="flex items-center space-x-1">
          {/* View toggle */}
          <div className="bg-gray-100 rounded-lg p-1 mr-2">
            <button
              onClick={() => setShowSummary(true)}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                showSummary
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Summary
            </button>
            <button
              onClick={() => setShowSummary(false)}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                !showSummary
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              All Notes
            </button>
          </div>

          {/* Filter Button */}
          <button
            onClick={() => setShowFilterOptions(!showFilterOptions)}
            className={`p-2 rounded-full transition-colors ${
              showFilterOptions
                ? "bg-blue-100 text-blue-600"
                : "text-gray-500 hover:bg-gray-100"
            }`}
            title="Filter notes"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
          </button>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={`p-2 rounded-full transition-colors ${
              isRefreshing ? "text-blue-400" : "text-blue-600 hover:bg-blue-100"
            }`}
            title="Refresh summary"
          >
            {isRefreshing ? (
              <LoadingSpinner size="small" />
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Filter Options Panel */}
      {showFilterOptions && (
        <div className="px-5 py-4 bg-gradient-to-r from-blue-50 to-white border-b border-blue-100">
          <div className="text-sm font-medium text-gray-700 mb-3">
            Filter notes for summary
          </div>
          <div className="space-y-3">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                checked={filterOption === "all"}
                onChange={() => setFilterOption("all")}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm">Use all notes</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                checked={filterOption === "count"}
                onChange={() => setFilterOption("count")}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm">Use only latest notes</span>
            </label>

            {filterOption === "count" && (
              <div className="ml-6">
                <div className="flex items-center">
                  <input
                    type="range"
                    min="1"
                    max={Math.max(1, teacherNotes.length)}
                    value={noteCount}
                    onChange={(e) => setNoteCount(parseInt(e.target.value))}
                    className="w-40 accent-blue-600 mr-3"
                  />
                  <span className="text-sm text-gray-700 min-w-[70px]">
                    {noteCount} {noteCount === 1 ? "note" : "notes"}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Content area */}
      <div className="p-5">
        {showSummary ? (
          <div className="bg-gradient-to-r from-blue-50 to-white rounded-lg p-5 border border-blue-100">
            <h4 className="text-sm font-medium text-blue-800 mb-3 flex items-center">
              <svg
                className="w-4 h-4 mr-1.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              AI-Generated Summary
            </h4>
            {data ? (
              <div className="prose prose-sm max-w-none text-gray-800">
                <ReactMarkdown>
                  {typeof data === "string" ? data : data.ai_summary}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="bg-white bg-opacity-70 rounded-lg p-4 text-gray-600 text-sm">
                <p>No summary available. Click refresh to generate.</p>
              </div>
            )}

            {teacherNotes.length > 0 && (
              <button
                onClick={() => setShowSummary(false)}
                className="mt-4 text-xs text-blue-600 hover:text-blue-800 flex items-center"
              >
                <svg
                  className="w-3.5 h-3.5 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
                View all {teacherNotes.length} notes
              </button>
            )}
          </div>
        ) : (
          <div>
            {loadingNotes ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : (
              <>
                {/* Add Note Button/Form */}
                {!showAddNoteForm ? (
                  <button
                    onClick={() => setShowAddNoteForm(true)}
                    className="mb-5 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-sm flex items-center shadow-sm"
                  >
                    <svg
                      className="w-4 h-4 mr-1.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Add Note
                  </button>
                ) : (
                  <div className="mb-5 overflow-hidden">
                    <div className="border border-blue-200 rounded-lg overflow-hidden bg-white">
                      <textarea
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Enter your note here..."
                        className="w-full p-4 border-0 focus:outline-none focus:ring-0 text-sm min-h-[120px] resize-none"
                        disabled={addingNote}
                      />
                      <div className="flex justify-end p-3 bg-gradient-to-r from-blue-50 to-white border-t border-blue-100">
                        <div className="space-x-2">
                          <button
                            onClick={() => {
                              setShowAddNoteForm(false);
                              setNewNote("");
                            }}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm"
                            disabled={addingNote}
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleAddNote}
                            disabled={!newNote.trim() || addingNote}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-sm shadow-sm transition-colors disabled:bg-blue-300"
                          >
                            {addingNote ? (
                              <span className="flex items-center">
                                <LoadingSpinner size="small" />
                                <span className="ml-2">Saving...</span>
                              </span>
                            ) : (
                              "Save Note"
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notes List */}
                {teacherNotes.length > 0 ? (
                  <ul className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                    {teacherNotes.map((note, index) => (
                      <li
                        key={index}
                        className="p-4 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                      >
                        <p className="text-sm text-gray-700">{note}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-10 bg-gray-50 rounded-lg">
                    <svg
                      className="w-12 h-12 mx-auto text-gray-300 mb-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    <p className="text-gray-500">
                      No notes found. Add your first note above.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
        <p>
          {teacherNotes.length > 0
            ? `${teacherNotes.length} note${teacherNotes.length > 1 ? "s" : ""}`
            : "No notes"}
        </p>

        <p>Last updated: {new Date().toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default PersonalNotes;
