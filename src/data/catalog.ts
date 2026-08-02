import type {
  Category,
  Course,
  Faq,
  Instructor,
  Lesson,
  Level,
  Review,
  Section,
  Testimonial,
} from "@/types/catalog";

/** Deterministic pseudo-random generator so dummy data is stable across renders. */
function rng(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const pick = <T,>(rand: () => number, list: readonly T[]): T =>
  list[Math.floor(rand() * list.length)]!;

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const CATEGORY_SEED: ReadonlyArray<[string, string, string]> = [
  ["Web Development", "Code", "Modern frontend and full-stack engineering."],
  ["Data Science", "ChartNoAxesCombined", "Analysis, statistics and storytelling with data."],
  ["Artificial Intelligence", "Sparkles", "Applied machine learning and generative AI."],
  ["Product Design", "PenTool", "Interface craft, systems and prototyping."],
  ["Cloud & DevOps", "Cloud", "Ship, scale and operate reliable systems."],
  ["Cybersecurity", "ShieldCheck", "Defensive and offensive security practice."],
  ["Mobile Development", "Smartphone", "Native and cross-platform mobile apps."],
  ["Business Strategy", "Briefcase", "Frameworks for growth and decision making."],
  ["Digital Marketing", "Megaphone", "Acquisition, content and performance."],
  ["Finance", "Landmark", "Modelling, investing and corporate finance."],
  ["Leadership", "Users", "Managing teams that do their best work."],
  ["Photography", "Camera", "Light, composition and post-production."],
  ["Music Production", "Music", "Recording, mixing and sound design."],
  ["Personal Growth", "Sprout", "Focus, habits and communication."],
  ["Game Development", "Gamepad2", "Engines, gameplay systems and shipping."],
];

const THUMB_GRADIENTS = [
  "from-blue-500 to-violet-500",
  "from-violet-500 to-fuchsia-500",
  "from-sky-500 to-blue-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-pink-600",
  "from-indigo-500 to-blue-500",
  "from-cyan-500 to-emerald-500",
];

const FIRST_NAMES = ["Amara","Liam","Sofia","Noah","Priya","Mateo","Hana","Elias","Zara","Jonas","Mila","Omar","Ingrid","Kenji","Lucia","Tomas","Nadia","Felix","Anaya","Victor"];
const LAST_NAMES = ["Okafor","Bennett","Marino","Fischer","Raman","Silva","Takeda","Novak","Haddad","Lindqvist","Petrov","Farah","Sorensen","Watanabe","Alvarez","Krause","Rahman","Moreau","Kapoor","Duarte"];
const TITLES = ["Principal Engineer","Design Director","Staff Data Scientist","Founder & CTO","Security Architect","Head of Growth","Cloud Consultant","Creative Director"];

const LEVELS: Level[] = ["Beginner", "Intermediate", "Advanced"];
const LANGUAGES = ["English", "Spanish", "German", "French"];

const TOPIC_WORDS = ["Foundations","Masterclass","Bootcamp","In Practice","From Scratch","Deep Dive","Complete Guide","Playbook","Essentials","Advanced Patterns"];
const TAG_POOL = ["hands-on","project-based","certificate","career","interview prep","2026 update","case studies","templates","live coding","fundamentals"];

const SECTION_TITLES = [
  "Getting Started",
  "Core Concepts",
  "Building the Real Thing",
  "Scaling & Quality",
  "Shipping and Next Steps",
];

const LESSON_SUBJECTS = ["the project workspace","core building blocks","the data model","the main interface","reusable patterns","edge cases","performance","the final build","team workflows","real-world examples"];

const LESSON_VERBS = ["Introduction to","Setting up","Understanding","Designing","Implementing","Testing","Refactoring","Shipping"];

const VIDEO_URL =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

function buildInstructors(): Instructor[] {
  const rand = rng(11);
  return Array.from({ length: 20 }, (_, i) => {
    const name = `${FIRST_NAMES[i]} ${LAST_NAMES[i]}`;
    return {
      id: `ins-${i + 1}`,
      slug: slugify(name),
      name,
      title: pick(rand, TITLES),
      bio: `${name} has spent over ${8 + Math.floor(rand() * 12)} years building products at scale and teaches with a hands-on, project-first approach.`,
      initials: `${FIRST_NAMES[i]![0]}${LAST_NAMES[i]![0]}`,
      rating: Number((4.4 + rand() * 0.55).toFixed(2)),
      students: 4000 + Math.floor(rand() * 90000),
      courses: 2 + Math.floor(rand() * 9),
    };
  });
}

function buildSections(courseId: string, topic: string, seed: number): Section[] {
  const rand = rng(seed);
  return SECTION_TITLES.map((sectionTitle, s) => {
    const lessons: Lesson[] = Array.from({ length: 8 }, (_, l) => {
      const minutes = 6 + Math.floor(rand() * 18);
      return {
        id: `${courseId}-s${s + 1}-l${l + 1}`,
        title: `${LESSON_VERBS[l]} ${LESSON_SUBJECTS[(s + l) % LESSON_SUBJECTS.length]}`,
        duration: `${minutes}:${String(Math.floor(rand() * 60)).padStart(2, "0")}`,
        description: `A focused lesson covering ${topic.toLowerCase()} with a practical walkthrough you can follow along with in your own editor.`,
        videoUrl: VIDEO_URL,
        resources: [
          { id: `${courseId}-s${s + 1}-l${l + 1}-r1`, label: "Lesson slides.pdf", type: "pdf", url: "#" },
          { id: `${courseId}-s${s + 1}-l${l + 1}-r2`, label: "Starter files.zip", type: "zip", url: "#" },
        ],
        isPreview: s === 0 && l < 2,
      };
    });
    return { id: `${courseId}-s${s + 1}`, title: `${s + 1}. ${sectionTitle}`, lessons };
  });
}

function buildCourses(categories: Category[]): Course[] {
  const rand = rng(97);
  return Array.from({ length: 50 }, (_, i) => {
    const category = categories[i % categories.length]!;
    const topic = category.name;
    const suffix = TOPIC_WORDS[Math.floor(i / categories.length) % TOPIC_WORDS.length]!;
    const title = `${topic} ${suffix}`;
    const id = `crs-${i + 1}`;
    const rating = Number((3.9 + rand() * 1.1).toFixed(1));
    const tags = [pick(rand, TAG_POOL), pick(rand, TAG_POOL), slugify(topic)].filter(
      (t, idx, arr) => arr.indexOf(t) === idx,
    );
    return {
      id,
      slug: `${slugify(title)}-${i + 1}`,
      title,
      subtitle: `Go from fundamentals to production-ready ${topic.toLowerCase()} skills in one structured track.`,
      description: `This course is a complete, project-driven path through ${topic.toLowerCase()}. You will build real deliverables lesson by lesson, learn the mental models professionals rely on, and finish with a portfolio piece you can show to employers or clients. Every module ends with an applied exercise and a short recap.`,
      thumbnail: THUMB_GRADIENTS[i % THUMB_GRADIENTS.length]!,
      instructorId: `ins-${(i % 20) + 1}`,
      categoryId: category.id,
      rating,
      reviewCount: 120 + Math.floor(rand() * 4200),
      students: 1500 + Math.floor(rand() * 120000),
      lessons: 40,
      duration: `${12 + Math.floor(rand() * 22)}h ${Math.floor(rand() * 59)}m`,
      language: pick(rand, LANGUAGES),
      level: LEVELS[i % 3]!,
      price: [0, 39, 49, 69, 89, 119][i % 6]!,
      tags,
      sections: buildSections(id, topic, 300 + i),
      updatedAt: `${["January","March","May","July","September","November"][i % 6]} 2026`,
    };
  });
}

function buildReviews(courses: Course[]): Review[] {
  const rand = rng(41);
  const comments = [
    "Best structured course I have taken this year. The projects alone were worth it.",
    "Clear, concise and never padded. I applied the first module at work the same week.",
    "The instructor explains the why, not just the how. Highly recommended.",
    "Great pacing and the downloadable resources are genuinely useful.",
    "I went in nervous about the topic and came out shipping my own project.",
    "Excellent production quality and the captions are accurate.",
  ];
  return Array.from({ length: 100 }, (_, i) => {
    const course = courses[i % courses.length]!;
    const first = FIRST_NAMES[i % FIRST_NAMES.length]!;
    const last = LAST_NAMES[(i * 3) % LAST_NAMES.length]!;
    return {
      id: `rev-${i + 1}`,
      courseId: course.id,
      author: `${first} ${last}`,
      initials: `${first[0]}${last[0]}`,
      rating: 4 + Math.round(rand()),
      date: `${["2 days","1 week","3 weeks","2 months","5 months"][i % 5]} ago`,
      comment: comments[i % comments.length]!,
    };
  });
}

function buildTestimonials(): Testimonial[] {
  const roles = ["Frontend Engineer","Product Manager","Data Analyst","UX Designer","Founder","Marketing Lead"];
  const quotes = [
    "I switched careers in seven months using nothing but these tracks.",
    "The curriculum is the closest thing to real on-the-job work I have found online.",
    "Our whole team onboarded through this platform. Zero friction.",
    "Short lessons, real projects, no fluff. Exactly what I needed.",
    "It finally made the advanced material feel approachable.",
  ];
  return Array.from({ length: 20 }, (_, i) => {
    const first = FIRST_NAMES[(i * 7) % FIRST_NAMES.length]!;
    const last = LAST_NAMES[(i * 5) % LAST_NAMES.length]!;
    return {
      id: `tst-${i + 1}`,
      name: `${first} ${last}`,
      role: roles[i % roles.length]!,
      initials: `${first[0]}${last[0]}`,
      quote: quotes[i % quotes.length]!,
      rating: 5,
    };
  });
}

const FAQ_SEED: ReadonlyArray<[string, string]> = [
  ["Do I get lifetime access to a course?", "Yes. Once a course is in your library it stays there, including every future update to the curriculum."],
  ["Are there certificates?", "Every track issues a shareable certificate of completion once you finish all lessons."],
  ["Can I learn on mobile?", "The player, notes and resources are fully responsive and work offline-friendly on modern mobile browsers."],
  ["Is there a free trial?", "A selection of lessons in every course is marked as preview and can be watched without an account."],
  ["What if a course is not right for me?", "You can request a full refund within 30 days, no questions asked."],
  ["Do courses include projects?", "Each course is project-driven, with an applied exercise at the end of every section."],
  ["Are subtitles available?", "All lessons include human-reviewed English subtitles, and popular tracks add four more languages."],
  ["Can my company buy team seats?", "Yes, team plans include seat management, shared learning paths and progress reporting."],
  ["How often is content updated?", "Instructors revisit each track at least twice a year to keep tooling and examples current."],
  ["Do I need prior experience?", "Every course lists its level and prerequisites, and beginner tracks assume no prior knowledge."],
  ["Can I download resources?", "Slides, starter files and cheat sheets are attached to each lesson."],
  ["Is there community support?", "Each course has a discussion space where instructors answer questions weekly."],
  ["Which payment methods do you accept?", "All major cards, PayPal and invoicing for teams of five or more."],
  ["Can I switch tracks later?", "Your progress is saved per course, so you can move between tracks freely."],
  ["Do you support screen readers?", "The platform is built to WCAG 2.1 AA, with full keyboard navigation and semantic landmarks."],
];

export const categories: Category[] = CATEGORY_SEED.map(([name, icon, description], i) => ({
  id: `cat-${i + 1}`,
  slug: slugify(name),
  name,
  description,
  icon,
  courseCount: 0,
}));

export const instructors: Instructor[] = buildInstructors();
export const courses: Course[] = buildCourses(categories);
export const reviews: Review[] = buildReviews(courses);
export const testimonials: Testimonial[] = buildTestimonials();
export const faqs: Faq[] = FAQ_SEED.map(([question, answer], i) => ({
  id: `faq-${i + 1}`,
  question,
  answer,
}));

for (const category of categories) {
  category.courseCount = courses.filter((c) => c.categoryId === category.id).length;
}
