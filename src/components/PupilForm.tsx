import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { database } from "../lib/database";
import toast from "react-hot-toast";

interface PupilFormProps {
  onSuccess: () => void;
  onClose: () => void;
}

export function PupilForm({ onSuccess, onClose }: PupilFormProps) {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [pupilLevel, setPupilLevel] = useState("");
  const [teacherNotes, setTeacherNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      await database.pupils.create({
        name,
        pupil_level: pupilLevel,
        teacher_notes: teacherNotes,
      });

      toast.success("Student added successfully!");
      onSuccess();

      // Reset form
      setName("");
      setPupilLevel("");
      setTeacherNotes("");
    } catch (error) {
      toast.error("Failed to add student");
      console.error("Error adding student:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="group">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Full Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="block w-full rounded-xl text-xs border-gray-200 bg-gray-50 
                   focus:border-blue-500 focus:ring-blue-500 transition-all duration-200
                   hover:bg-gray-100"
          placeholder="Enter student's full name"
        />
      </div>

      <div className="group">
        <label
          htmlFor="pupilLevel"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Student Level
        </label>
        <input
          type="text"
          id="pupilLevel"
          value={pupilLevel}
          onChange={(e) => setPupilLevel(e.target.value)}
          required
          className="block w-full rounded-xl text-xs border-gray-200 bg-gray-50 
                   focus:border-blue-500 focus:ring-blue-500 transition-all duration-200
                   hover:bg-gray-100"
          placeholder="e.g., Grade 10, Advanced"
        />
      </div>

      <div className="group">
        <label
          htmlFor="teacherNotes"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Teacher Notes
        </label>
        <textarea
          id="teacherNotes"
          value={teacherNotes}
          onChange={(e) => setTeacherNotes(e.target.value)}
          rows={3}
          className="block w-full rounded-xl text-xs border-gray-200 bg-gray-50 
                   focus:border-blue-500 focus:ring-blue-500 transition-all duration-200
                   hover:bg-gray-100"
          placeholder="Add any relevant notes about the student"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-50 
                   border border-gray-200 rounded-xl hover:bg-gray-100 
                   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                   transition-all duration-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-4 py-2.5 text-sm font-medium text-white 
                   bg-gradient-to-r from-blue-600 to-violet-600 rounded-xl 
                   hover:from-blue-700 hover:to-violet-700
                   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                   disabled:opacity-50 transition-all duration-200"
        >
          {isSubmitting ? "Adding..." : "Add Student"}
        </button>
      </div>
    </form>
  );
}
