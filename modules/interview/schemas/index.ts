import { z } from "zod";

export const interviewSetupSchema = z.object({
  jobRole: z.string().min(1, "Job role is required"),
  experienceLevel: z.string().min(1, "Experience level is required"),
  focusAreas: z.array(z.string()).min(1, "At least one focus area is required"),
  language: z.string().min(1, "Language is required"),
});

export type InterviewSetupFormData = z.infer<typeof interviewSetupSchema>;

export const JOB_ROLES = [
  "Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "DevOps Engineer",
  "Data Scientist",
  "Product Manager",
  "UI/UX Designer",
] as const;

export const EXPERIENCE_LEVELS = [
  "Intern",
  "Junior",
  "Mid-level",
  "Senior",
  "Lead",
] as const;

export const FOCUS_AREAS = [
  "Algorithms",
  "Data Structures",
  "System Design",
  "Frontend",
  "Backend",
  "Database",
  "Testing",
  "Security",
  "Performance",
  "Architecture",
] as const;

export const LANGUAGES = [
  { value: "en", label: "English", modelPath: "en" },
  { value: "vi", label: "Vietnamese", modelPath: "vi" },
] as const;

export interface InterviewSetup {
  _id: string;
  name?: string;
  jobRole: string;
  experienceLevel: string;
  focusAreas: string[];
  language: string;
  maxQuestions?: number;
  isDefault?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface InterviewSetupResponse {
  setups: InterviewSetup[];
  total: number;
}

export interface CreateSetupRequest {
  name?: string;
  jobRole: string;
  experienceLevel: string;
  focusAreas: string[];
  language: string;
  maxQuestions?: number;
  isDefault?: boolean;
  saveAsTemplate?: boolean;
}

export interface UpdateSetupRequest {
  name?: string;
  jobRole?: string;
  experienceLevel?: string;
  focusAreas?: string[];
  language?: string;
  maxQuestions?: number;
  isDefault?: boolean;
}
