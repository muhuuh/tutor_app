export interface Pupil {
  id: string;
  name: string;
  pupil_level: string;
  teacher_notes: string | null;
  created_at: string;
  teacher_id: string;
}

export interface Report {
  id: string;
  report: {
    performance_summary: string;
    incorrect_questions: string;
    misunderstood_concepts: string;
    learning_material: string;
    practice_exercises: string;
  };
  report_title: string;
  teacher_id: string;
  requested_at: string;
  pupil_id: string;
}

export interface Exam {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  teacher_id: string;
}

export interface Correction {
  id: string;
  content: string;
  exam_id: string;
  teacher_id: string;
  created_at: string;
  updated_at: string;
}