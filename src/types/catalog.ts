export type Level = "Beginner" | "Intermediate" | "Advanced";

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  courseCount: number;
}

export interface Instructor {
  id: string;
  slug: string;
  name: string;
  title: string;
  bio: string;
  initials: string;
  rating: number;
  students: number;
  courses: number;
}

export interface Resource {
  id: string;
  label: string;
  type: "pdf" | "zip" | "link";
  url: string;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  description: string;
  videoUrl: string;
  resources: Resource[];
  isPreview: boolean;
}

export interface Section {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Review {
  id: string;
  courseId: string;
  author: string;
  initials: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  thumbnail: string;
  instructorId: string;
  categoryId: string;
  rating: number;
  reviewCount: number;
  students: number;
  lessons: number;
  duration: string;
  language: string;
  level: Level;
  price: number;
  tags: string[];
  sections: Section[];
  updatedAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  initials: string;
  quote: string;
  rating: number;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
}
