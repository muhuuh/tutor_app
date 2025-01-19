import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { database } from "../lib/database";
import toast from "react-hot-toast";
import { XMarkIcon } from "@heroicons/react/24/outline";

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
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

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
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 relative"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-medium text-gray-900">Add New Student</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Enter student's full name"
            />
          </div>

          <div>
            <label
              htmlFor="pupilLevel"
              className="block text-sm font-medium text-gray-700"
            >
              Student Level
            </label>
            <input
              type="text"
              id="pupilLevel"
              value={pupilLevel}
              onChange={(e) => setPupilLevel(e.target.value)}
              required
              className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="e.g., Grade 10, Advanced"
            />
          </div>

          <div>
            <label
              htmlFor="teacherNotes"
              className="block text-sm font-medium text-gray-700"
            >
              Teacher Notes
            </label>
            <textarea
              id="teacherNotes"
              value={teacherNotes}
              onChange={(e) => setTeacherNotes(e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Add any relevant notes about the student"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isSubmitting ? "Adding..." : "Add Student"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
