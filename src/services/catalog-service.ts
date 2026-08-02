import {
  categories,
  courses,
  faqs,
  instructors,
  reviews,
  testimonials,
} from "@/data/catalog";
import type {
  Category,
  Course,
  Faq,
  Instructor,
  Level,
  Review,
  Testimonial,
} from "@/types/catalog";

/**
 * Single data-access layer. Swapping dummy data for the REST API
 * (GET /courses, /courses/:slug, /categories, ...) only changes this file.
 */

export interface CourseQuery {
  search?: string;
  categoryId?: string | "all";
  level?: Level | "all";
  price?: "all" | "free" | "paid";
  sort?: "popular" | "rating" | "newest" | "price-asc" | "price-desc";
  page?: number;
  perPage?: number;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

const delay = <T,>(value: T, ms = 250): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

export const getCategories = (): Promise<Category[]> => delay(categories);

export const getInstructors = (): Promise<Instructor[]> => delay(instructors);

export const getInstructor = (id: string): Instructor | undefined =>
  instructors.find((i) => i.id === id);

export const getCategory = (id: string): Category | undefined =>
  categories.find((c) => c.id === id);

export const getTestimonials = (): Promise<Testimonial[]> => delay(testimonials);

export const getFaqs = (): Promise<Faq[]> => delay(faqs);

export function getCourses(query: CourseQuery = {}): Promise<Paginated<Course>> {
  const {
    search = "",
    categoryId = "all",
    level = "all",
    price = "all",
    sort = "popular",
    page = 1,
    perPage = 9,
  } = query;

  const term = search.trim().toLowerCase();
  let items = courses.filter((course) => {
    const matchesTerm =
      !term ||
      course.title.toLowerCase().includes(term) ||
      course.subtitle.toLowerCase().includes(term) ||
      course.tags.some((t) => t.includes(term));
    const matchesCategory = categoryId === "all" || course.categoryId === categoryId;
    const matchesLevel = level === "all" || course.level === level;
    const matchesPrice =
      price === "all" ||
      (price === "free" ? course.price === 0 : course.price > 0);
    return matchesTerm && matchesCategory && matchesLevel && matchesPrice;
  });

  items = [...items].sort((a, b) => {
    switch (sort) {
      case "rating":
        return b.rating - a.rating;
      case "newest":
        return b.id.localeCompare(a.id, undefined, { numeric: true });
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      default:
        return b.students - a.students;
    }
  });

  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(Math.max(1, page), totalPages);

  return delay({
    items: items.slice((safePage - 1) * perPage, safePage * perPage),
    total,
    page: safePage,
    perPage,
    totalPages,
  });
}

export const getCourseBySlug = (slug: string): Promise<Course | null> =>
  delay(courses.find((c) => c.slug === slug) ?? null);

export const getCourseReviews = (courseId: string): Promise<Review[]> =>
  delay(reviews.filter((r) => r.courseId === courseId));

export const getRelatedCourses = (course: Course, limit = 3): Promise<Course[]> =>
  delay(
    courses
      .filter((c) => c.categoryId === course.categoryId && c.id !== course.id)
      .slice(0, limit),
  );

export const getFeaturedCourses = (limit = 6): Promise<Course[]> =>
  delay([...courses].sort((a, b) => b.students - a.students).slice(0, limit));

export const getTopRatedCourses = (limit = 4): Promise<Course[]> =>
  delay([...courses].sort((a, b) => b.rating - a.rating).slice(0, limit));
