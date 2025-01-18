import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { database } from '../lib/database';
import toast from 'react-hot-toast';

interface PupilFormProps {
  onSuccess: () => void;
}

export function PupilForm({ onSuccess }: PupilFormProps) {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [pupilLevel, setPupilLevel] = useState('');
  const [teacherNotes, setTeacherNotes] = useState('');
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
      
      toast.success('Student added successfully!');
      onSuccess();
      
      // Reset form
      setName('');
      setPupilLevel('');
      setTeacherNotes('');
    } catch (error) {
      toast.error('Failed to add student');
      console.error('Error adding student:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="pupilLevel" className="block text-sm font-medium text-gray-700">
          Student Level
        </label>
        <input
          type="text"
          id="pupilLevel"
          value={pupilLevel}
          onChange={(e) => setPupilLevel(e.target.value)}
          required
          className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="teacherNotes" className="block text-sm font-medium text-gray-700">
          Teacher Notes
        </label>
        <textarea
          id="teacherNotes"
          value={teacherNotes}
          onChange={(e) => setTeacherNotes(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-50"
      >
        {isSubmitting ? 'Adding Student...' : 'Add Student'}
      </button>
    </form>
  );
}