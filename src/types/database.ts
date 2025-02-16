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
  sections: ReportSection[];
}

export interface ReportSection {
  content: string;
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

export interface UserSubscription {
  id: string;
  user_id: string;
  max_credits: number;
  used_credits: number;
  subscription_type: string;
  valid_until: string;
  created_at: string;
  updated_at: string;
}
