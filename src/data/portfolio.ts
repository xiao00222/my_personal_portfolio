/**
 * ============================================================================
 *  PORTFOLIO CONTENT — SINGLE SOURCE OF TRUTH
 * ============================================================================
 *  Every string the UI renders comes from this file. Nothing is hardcoded in
 *  components.
 *
 *  Provenance of the data below:
 *    - `profile`, `hero`, `about`, `skills`, `experience`, `contact` are taken
 *      verbatim from the original site (src/sections/*.jsx).
 *    - `projects[].highlights` and the grouped `skills[].items` are taken
 *      verbatim from the CV PDF (public/Farhan_Ali_dotnet_dev1.pdf).
 *    - `ui` contains the interface *chrome* copy (section titles, button
 *      labels, boot-sequence lines). It is presentation copy, not biography,
 *      and is kept here so components stay copy-free.
 *
 *  Anything the original content did NOT contain is marked with `TODO:` and
 *  repeated in the README's "Content gaps" section. Nothing has been invented.
 * ============================================================================
 */

import formoptixExercise from "@/assets/projects/formoptix-exercise.webp";
import formoptixHome from "@/assets/projects/formoptix-home.webp";
import formoptixSplash from "@/assets/projects/formoptix-splash.webp";
import swiftshopImage from "@/assets/projects/swiftshop.webp";
import syncupImage from "@/assets/projects/syncup.webp";

/* -------------------------------------------------------------------------- */
/*  Interfaces                                                                */
/* -------------------------------------------------------------------------- */

export type SectionId =
  | "home"
  | "about"
  | "skills"
  | "projects"
  | "experience"
  | "contact";

export interface SocialLink {
  /** Human readable network name, also used as the accessible label. */
  label: string;
  url: string;
  /** Key consumed by the icon map in `lib/icons.ts`. */
  icon: "github" | "linkedin";
}

export interface Profile {
  name: string;
  firstName: string;
  /** Initials used by the monogram/avatar block (no photo exists). */
  initials: string;
  title: string;
  /** Short role list shown as a status pill. */
  roles: string[];
  location: string;
  email: string;
  phone: string;
  /** Public path to the CV that already shipped with the site. */
  resumeUrl: string;
  /** TODO: no profile photo was provided in the source folder. */
  photo: null;
  socials: SocialLink[];
  /** Short "available for work" note shown in the hero + contact sections. */
  availability: string;
}

export interface Hero {
  headlineLead: string;
  headlineAccent: string;
  headlineTail: string;
  tagline: string;
  primaryCta: { label: string; target: SectionId };
  secondaryCta: { label: string };
  /** Technologies listed in the hero's "Core Technologies" index. */
  techStack: string[];
}

export interface AboutHighlight {
  icon: "code" | "rocket" | "users" | "lightbulb";
  title: string;
  description: string;
}

export interface About {
  eyebrow: string;
  headline: string;
  headlineAccent: string;
  /** Bio paragraphs, verbatim from About.jsx. */
  paragraphs: string[];
  /** Pull-quote under the bio, verbatim from About.jsx. */
  highlights: AboutHighlight[];
  /** Header-metadata chrome for the profile card. */
  dossier: {
    /** Profile reference shown in the card header. */
    fileId: string;
    status: string;
    /** Where this engineer's work is concentrated. */
    focus: string;
    /** Decorative stamp motif. */
    stamp: string;
  };
}

export interface SkillItem {
  name: string;
  /** Optional one-line note. Only present where the CV itself described it. */
  note?: string;
}

export interface SkillCategory {
  id: string;
  /** Category label — taken from the CV's own section headings. */
  label: string;
  /** Short editorial line describing the group. */
  blurb: string;
  icon: "code" | "layers" | "server" | "database" | "wrench" | "compass" | "brain";
  items: SkillItem[];
}

export type ProjectCategory = "Web Platform" | "AI / ML";

export interface ProjectImage {
  src: string;
  alt: string;
}

export interface Project {
  id: string;
  /** Display index used on the card and in the detail dialog. */
  projectNumber: string;
  title: string;
  /** One-line role/kind of build, derived from the project's own subtitle. */
  subtitle: string;
  description: string;
  /** Verbatim CV bullet points for this project. */
  highlights: string[];
  category: ProjectCategory;
  images: ProjectImage[];
  tech: string[];
  /** null == the original site explicitly had no link here. */
  liveUrl: string | null;
  repoUrl: string | null;
  /** TODO: the original content never listed project dates. */
  year: null;
}

export interface TimelineEntry {
  id: string;
  period: string;
  role: string;
  organisation: string;
  description: string;
  tags: string[];
  current: boolean;
}

export interface Certification {
  title: string;
  issuer: string;
  year: string;
  url: string | null;
}

export interface ContactInfo {
  label: string;
  value: string;
  href: string | null;
  icon: "mail" | "phone" | "map-pin";
}

export interface UIStrings {
  nav: { id: SectionId; label: string }[];
  boot: {
    lines: string[];
    skip: string;
    continue: string;
    sessionKey: string;
  };
  sections: {
    id: SectionId;
    /** Small uppercase eyebrow, e.g. "Selected Work". */
    eyebrow: string;
    /** Big display heading. */
    title: string;
  }[];
  labels: {
    scroll: string;
    menu: string;
    closeMenu: string;
    backToTop: string;
    viewCase: string;
    closeProject: string;
    liveDemo: string;
    repository: string;
    repoPrivate: string;
    noLiveDemo: string;
    filterAll: string;
    /** Presentation chrome for the hero technology index (not biography). */
    techManifest: string;
    techManifestId: string;
    soundOn: string;
    soundOff: string;
  };
  contact: {
    heading: string;
    intro: string;
    /** Heading above the direct contact channels. */
    channels: string;
    /** Closing line under the contact channels. */
    note: string;
  };
}

export interface Seo {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  ogType: string;
  themeColor: string;
}

export interface Portfolio {
  seo: Seo;
  profile: Profile;
  hero: Hero;
  about: About;
  skills: SkillCategory[];
  projects: Project[];
  timeline: TimelineEntry[];
  /** TODO: no certifications exist in the original site or CV. */
  certifications: Certification[];
  contactInfo: ContactInfo[];
  ui: UIStrings;
}

/* -------------------------------------------------------------------------- */
/*  Content                                                                   */
/* -------------------------------------------------------------------------- */

export const portfolio: Portfolio = {
  seo: {
    title: "Farhan Ali — .NET / C# Software Engineer",
    description:
      "Farhan Ali — software engineer specializing in ASP.NET Core, EF Core, and Clean Architecture, with hands-on experience building scalable applications.",
    ogTitle: "Farhan Ali — .NET / C# Software Engineer",
    ogDescription:
      "Building reliable backends with clean architecture. ASP.NET Core, EF Core, CQRS, and applied AI.",
    ogType: "website",
    themeColor: "#0a0c11",
  },

  profile: {
    name: "Farhan Ali",
    firstName: "Farhan",
    initials: "FA",
    title: "Software Engineer • .NET / C# Developer",
    roles: ["Software Engineer", ".NET / C# Developer"],
    location: "Islamabad, Pakistan",
    email: "acfarhan123@gmail.com",
    phone: "+92 3350460061",
    resumeUrl: "/Farhan_Ali_dotnet_main.pdf",
    photo: null, // TODO: no profile photo exists in the source folder.
    availability: "Available for work",
    socials: [
      { label: "GitHub", url: "https://github.com/xiao00222", icon: "github" },
      {
        label: "LinkedIn",
        url: "https://www.linkedin.com/in/farhan-ali-474097329/",
        icon: "linkedin",
      },
    ],
  },

  hero: {
    headlineLead: "Building",
    headlineAccent: "reliable",
    headlineTail: "backends with clean architecture.",
    tagline:
      "Hi, I'm Farhan Ali — a software engineer specializing in ASP.NET Core, EF Core, and Clean Architecture, with hands-on experience building scalable applications.",
    primaryCta: { label: "Contact Me", target: "contact" },
    secondaryCta: { label: "CV" },
    techStack: [
      "C#",
      "ASP.NET Core",
      "Entity Framework Core",
      "Clean Architecture",
      "CQRS",
      "MediatR",
      "React",
      "TypeScript",
      "Python",
      "SQL Server",
      "Docker",
      "Git",
      "REST APIs",
      "Minimal APIS",
      "Numpy",
      "Pandas",
      "Matplotlib",
    ],
  },

  about: {
    eyebrow: "About Me",
    headline: "Building solid systems,",
    headlineAccent: "one clean layer at a time.",
    paragraphs: [
      "I'm a Software Engineering graduate  with a focus on building well-structured, maintainable backend systems. My journey started with a curiosity for how software is actually put together, and it's grown into hands-on experience with .NET, EF Core, and Clean Architecture.",
      "I specialize in ASP.NET Core, Entity Framework Core, and architectural patterns like CQRS and MediatR, building applications that are structured to scale and easy to maintain. I've also worked across the stack with React and TypeScript, and I'm actively growing my skills in Cloud and Deployment.",
    ],
   
    highlights: [
      {
        icon: "code",
        title: "Clean Code",
        description:
          "Writing maintainable, scalable code that stands the test of time.",
      },
      {
        icon: "rocket",
        title: "Performance",
        description:
          "Optimizing backend systems and queries for speed and reliability.",
      },
      {
        icon: "users",
        title: "Collaboration",
        description: "Working closely with teams to bring ideas to life.",
      },
      {
        icon: "lightbulb",
        title: "Always Learning",
        description:
          "Expanding into AI/ML and Python while sharpening core engineering skills.",
      },
    ],
    dossier: {
      fileId: "PROFILE-01",
      status: "Open to work",
      focus: "Backend · Cloud · Applied AI",
      stamp: "VERIFIED",
    },
  },

  /**
   * Skill groups and their members are taken from the CV's own headings
   * (Languages / Frameworks / Backend / Databases / Tools / Concepts / AI-ML).
   *
   * NOTE: the source content contains NO proficiency levels or percentages.
   * Per the brief, none are fabricated — the UI shows categories and names only.
   */
  skills: [
    {
      id: "languages",
      label: "Languages",
      blurb: "Primary languages I write in day to day.",
      icon: "code",
      items: [
        { name: "C#" },
        { name: "Python" },
        { name: "TypeScript" },
        { name: "HTML" },
        { name: "CSS" },
      ],
    },
    {
      id: "frameworks",
      label: "Frameworks",
      blurb: "Frameworks used to ship server and client applications.",
      icon: "layers",
      items: [
        { name: "ASP.NET Core" },
        { name: "React", note: "with TypeScript" },
        { name: "Bootstrap" },
      ],
    },
    {
      id: "backend",
      label: "Backend",
      blurb: "APIs, architecture patterns, and data access.",
      icon: "server",
      items: [
        { name: "REST APIs" },
        { name: "Minimal APIs" },
        { name: "MVC" },
        { name: "CQRS" },
        { name: "MediatR" },
        { name: "EF Core" },
        { name: "ASP.NET Identity" },
        { name: "N-Tier" },
        { name: "Repository Pattern" },
        { name: "AutoMapper" },
        { name: "SignalR" },
      ],
    },
    {
      id: "databases",
      label: "Databases",
      blurb: "Relational stores and migration workflows.",
      icon: "database",
      items: [
        { name: "MS SQL Server" },
        { name: "PostgreSQL" },
        { name: "Code-First Migrations" },
      ],
    },
    {
      id: "tools",
      label: "Tools",
      blurb: "Everyday tooling for build, debug, and deploy.",
      icon: "wrench",
      items: [
        { name: "Git / GitHub" },
        { name: "Postman" },
        { name: "Azure App Service" },
      ],
    },
    {
      id: "concepts",
      label: "Concepts",
      blurb: "Design principles I build against.",
      icon: "compass",
      items: [
        { name: "OOP" },
        { name: "SOLID" },
        { name: "Design Patterns" },
        { name: "Clean Architecture" },
      ],
    },
    {
      id: "ai-ml",
      label: "AI / ML",
      blurb: "Applied machine learning and data tooling.",
      icon: "brain",
      items: [
        { name: "scikit-learn" },
        { name: "NumPy" },
        { name: "Pandas" },
        { name: "Matplotlib" },
      ],
    },
  ],

  projects: [
    {
      id: "syncup",
      projectNumber: "01",
      title: "SyncUp",
      subtitle: "Social Activity & Event Platform",
      description:
        "A full-stack event platform where users create, host, and join real-time social activities. Backend architected with Clean Architecture, CQRS, and MediatR across a layered API, with cookie-based auth and centralized error-handling middleware across 15+ endpoints. Deployed on Azure App Service with a GitHub Actions CI/CD pipeline for zero-downtime releases.",
      highlights: [
        "Built a full-stack event platform where users can create, host, and join real-time social activities",
        "Architected backend with Clean Architecture, CQRS, and MediatR — separation of concerns across 3 layers",
        "Implemented cookie-based authentication with custom middleware for centralized error handling across 15+ API endpoints",
        "Integrated Cloudinary for photo uploads and React Query for efficient client-side server-state management",
        "Deployed via Azure App Service with GitHub Actions CI/CD pipeline for automated builds and zero-downtime releases",
      ],
      category: "Web Platform",
      images: [
        { src: syncupImage, alt: "SyncUp social activity and event platform" },
      ],
      tech: [
        ".NET API",
        "CQRS + MediatR",
        "React",
        "TypeScript",
        "Material UI",
        "React Query",
        "EF Core",
        "PostgreSQL",
        "Azure",
      ],
      liveUrl:
        "https://syncup-api-hqahc5bafjf3bwhz.southeastasia-01.azurewebsites.net/",
      repoUrl: "https://github.com/xiao00222/SyncUp",
      year: null, // TODO: no dates were provided in the source content.
    },
    {
      id: "swiftshop",
      projectNumber: "02",
      title: "SwiftShop",
      subtitle: "Bulk Bookstore Web App",
      description:
        "A multi-role platform for books with distinct flows for customers, companies, and admins. Integrated Stripe payments and Facebook OAuth login, with B2B company accounts supporting 30-day deferred payment for institutional buyers. Built on N-Tier architecture with the Repository Pattern and Unit of Work for clean, testable data access, deployed via Azure App Service with automated CI/CD.",
      highlights: [
        "Engineered a multi-role platform for books with distinct flows for customers, companies, and admins",
        "Integrated Stripe payment gateway and Facebook OAuth login, reducing friction in checkout and registration",
        "Designed B2B company accounts with 30-day deferred payment logic for institutional buyers",
        "Applied N-Tier architecture with Repository Pattern and Unit of Work for clean, testable data access",
        "Deployed via Azure App Service + GitHub Actions with automated CI/CD pipeline",
        "Used Ajax and jQuery for seamless front-end changes",
      ],
      category: "Web Platform",
      images: [
        { src: swiftshopImage, alt: "SwiftShop bulk bookstore web application" },
      ],
      tech: [
        "ASP.NET Core MVC",
        "EF Core",
        "MSSQL",
        "Bootstrap",
        "Stripe API",
        "Facebook OAuth",
        "Azure",
      ],
      liveUrl:
        "https://swiftshop-ehc9cbb7acb2dnf7.southeastasia-01.azurewebsites.net/",
      repoUrl: "https://github.com/xiao00222/SwiftShop",
      year: null, // TODO: no dates were provided in the source content.
    },
    {
      id: "formoptix",
      projectNumber: "03",
      title: "Formoptix",
      subtitle: "AI-Based Exercise Form Correction",
      description:
        "Final year project: an AI system that corrects exercise form in real time. Built a custom dataset of 600+ pose-landmark samples across push-up and bicep curl exercises, combining joint-angle calculations with a finite state machine for rep-phase segmentation. Layered angle-based heuristics on the FSM to count reps and flag incorrect form, training logistic regression classifiers in scikit-learn with up to 90% accuracy, deployed for real-time on-device inference in a mobile app.",
      highlights: [
        "Collected and labeled a custom dataset of 600+ pose-landmark samples across push-up and bicep curl exercises for supervised model training",
        "Studied published research on pose-based exercise classification to design a feature pipeline combining joint-angle calculations with a finite state machine (FSM) for rep-phase segmentation",
        "Engineered angle-based heuristics layered on the FSM to count reps and flag incorrect form in real time",
        "Trained and evaluated logistic regression classifiers in scikit-learn, achieving up to 90% accuracy",
        "Deployed the trained model for real-time, on-device inference in a mobile application",
      ],
      category: "AI / ML",
      images: [
        { src: formoptixSplash, alt: "Formoptix app splash screen" },
        { src: formoptixHome, alt: "Formoptix app home screen" },
        { src: formoptixExercise, alt: "Formoptix exercise tracking screen" },
      ],
      tech: [
        "Flutter",
        "Machine Learning",
        "scikit-learn",
        "Pose Estimation",
        "Logistic Regression",
        "Finite State Machines",
        "On-Device Inference",
      ],
      liveUrl: null, // TODO: the original source had no live demo link.
      repoUrl: null, // Repository is private for now (per the original site).
      year: null, // TODO: no dates were provided in the source content.
    },
  ],

  timeline: [
    {
      id: "bs-software-engineering",
      period: "2022 — 2026",
      role: "BS Software Engineering",
      organisation: "International Islamic University Islamabad (IIUI)",
      description:
        "Graduated with a focus on backend development, software architecture, and applied AI",
      tags: ["C#", ".NET", "OOP", "SQL", "Python"],
      current: false,
    },
    {
      id: "self-directed",
      period: "Post-Graduation — Present",
      role: "Self-Directed AI and Cloud Engineering",
      organisation: "Independent Study",
      description:
        "Building practical AI engineering and Cloud skills outside formal coursework",
      tags: ["Python", "C#", "RAG", "LLM APIs", "Docker"],
      current: false,
    },
    {
      id: "job-hunting",
      period: "Currently",
      role: "Actively Job Hunting",
      organisation: "Open to Opportunities",
      description:
        "Preparing for backend/software engineering roles through structured DSA practice, SQL drilling, and system design study, while applying and interviewing with software houses.",
      tags: ["DSA", "System Design", "SQL", "C#"],
      current: true,
    },
  ],

  /**
   * TODO: The original portfolio and the CV both list NO certifications.
   * This array is intentionally empty — add entries here to render the
   * "Credentials" strip (the UI hides itself while it is empty).
   */
  certifications: [],

  contactInfo: [
    {
      label: "Email",
      value: "acfarhan123@gmail.com",
      href: "mailto:acfarhan123@gmail.com",
      icon: "mail",
    },
    {
      label: "Phone",
      value: "+92 3350460061",
      href: "tel:+923350460061",
      icon: "phone",
    },
    {
      label: "Location",
      value: "Islamabad, Pakistan",
      href: null,
      icon: "map-pin",
    },
  ],

  /* --------------------------- Presentation copy --------------------------- */

  ui: {
    nav: [
      { id: "about", label: "About" },
      { id: "skills", label: "Skills" },
      { id: "projects", label: "Projects" },
      { id: "experience", label: "Experience" },
    ],
    boot: {
      lines: [
        "> initialising portfolio v2.0 ......... READY",
        "> loading profile ..................... OK",
        "> indexing skills [33] ................ OK",
        "> loading projects [03] ............... OK",
        "> rendering interface ................. OK",
        "> WELCOME.",
      ],
      skip: "Skip intro",
      continue: "View portfolio",
      sessionKey: "gc-boot-seen",
    },
    sections: [
      { id: "home", eyebrow: "Portfolio", title: "Overview" },
      { id: "about", eyebrow: "About Me", title: "About" },
      { id: "skills", eyebrow: "Technical Skills", title: "Skills" },
      { id: "projects", eyebrow: "Selected Work", title: "Projects" },
      { id: "experience", eyebrow: "Experience & Education", title: "Experience" },
      { id: "contact", eyebrow: "Get in Touch", title: "Contact Me" },
    ],
    labels: {
      scroll: "Scroll",
      menu: "Open navigation menu",
      closeMenu: "Close navigation menu",
      backToTop: "Back to top",
      viewCase: "View project details",
      closeProject: "Close project details",
      liveDemo: "Live demo",
      repository: "Source code",
      repoPrivate: "Source code private for now",
      noLiveDemo: "No live demo available",
      filterAll: "All",
      /** Presentation chrome for the hero technology index (not biography). */
      techManifest: "Core technologies",
      techManifestId: "TECH-INDEX",
      soundOn: "Sound on",
      soundOff: "Sound off",
    },
    contact: {
      heading: "Contact Me",
      intro:
        "Have an opportunity or project in mind? Reach out directly — I'm happy to talk.",
      channels: "Direct contact",
      note: "Open to full-time roles, contract work, and freelance projects.",
    },
  },
};

/* ------------------------------- Derived data ------------------------------ */

/** Safe lookup used by the nav + section headers. */
export const sectionById = Object.fromEntries(
  portfolio.ui.sections.map((section) => [section.id, section]),
) as Record<SectionId, Portfolio["ui"]["sections"][number]>;

export const projectCategories: ProjectCategory[] = Array.from(
  new Set(portfolio.projects.map((project) => project.category)),
);

export default portfolio;
