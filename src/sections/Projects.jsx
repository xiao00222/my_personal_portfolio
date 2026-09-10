import { ArrowUpRight, Github, Lock } from "lucide-react";
import { AnimatedBorderButton } from "@/components/AnimatedBorderButton";

const projects = [
  {
    title: "SyncUp – Social Activity & Event Platform",
    description:
      "A full-stack event platform where users create, host, and join real-time social activities. Backend architected with Clean Architecture, CQRS, and MediatR across a layered API, with cookie-based auth and centralized error-handling middleware across 15+ endpoints. Deployed on Azure App Service with a GitHub Actions CI/CD pipeline for zero-downtime releases.",
    images: ["/projects/syncup.jpg"],
    tags: [
      ".NET API",
      "CQRS + MediatR",
      "React",
      "TypeScript",
      "EF Core",
      "PostgreSQL",
      "Azure",
    ],
    link: "https://syncup-api-hqahc5bafjf3bwhz.southeastasia-01.azurewebsites.net/",
    github: "https://github.com/xiao00222/SyncUp",
  },
  {
    title: "SwiftShop – Bulk Bookstore Web App",
    description:
      "A multi-role platform for books with distinct flows for customers, companies, and admins. Integrated Stripe payments and Facebook OAuth login, with B2B company accounts supporting 30-day deferred payment for institutional buyers. Built on N-Tier architecture with the Repository Pattern and Unit of Work for clean, testable data access, deployed via Azure App Service with automated CI/CD.",
    images: ["/projects/swiftshop.jpg"],
    tags: [
      "ASP.NET Core MVC",
      "EF Core",
      "MSSQL",
      "Stripe API",
      "Facebook OAuth",
      "Azure",
    ],
    link: "https://swiftshop-ehc9cbb7acb2dnf7.southeastasia-01.azurewebsites.net/",
    github: "https://github.com/xiao00222/SwiftShop",
  },
  {
    title: "Formoptix – AI-Based Exercise Form Correction",
    description:
      "Final year project: an AI system that corrects exercise form in real time. Built a custom dataset of 600+ pose-landmark samples across push-up and bicep curl exercises, combining joint-angle calculations with a finite state machine for rep-phase segmentation. Layered angle-based heuristics on the FSM to count reps and flag incorrect form, training logistic regression classifiers in scikit-learn with up to 90% accuracy, deployed for real-time on-device inference in a mobile app.",
    images: [
      "/projects/formoptix_splash.png",
      "/projects/formoptix_home.png",
      "/projects/formoptix_excercise.png",
    ],
    tags: [
      "Flutter",
      "Machine Learning",
      "scikit-learn",
      "Pose Estimation",
      "Finite State Machines",
      "On-Device Inference",
    ],
    link: null, // TODO: add live demo link
    github: null, // private for now
  },
];

export const Projects = () => {
  return (
    <section id="projects" className="py-32 relative overflow-hidden">
      {/* Bg glows */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-highlight/5 rounded-full blur-3xl" />
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mx-auto max-w-3xl mb-16">
          <span className="text-secondary-foreground text-sm font-medium tracking-wider uppercase animate-fade-in">
            Featured Work
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6 animate-fade-in animation-delay-100 text-secondary-foreground">
            <span className="font-serif italic font-normal text-white">
              {" "}
              Projects
            </span>
          </h2>
          <p className="text-muted-foreground animate-fade-in animation-delay-200">
            A selection of my recent work, from full-stack platforms to
            AI-driven tools solving real-world problems.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, idx) => (
            <div
              key={idx}
              className="group glass rounded-2xl overflow-hidden animate-fade-in md:row-span-1"
              style={{ animationDelay: `${(idx + 1) * 100}ms` }}
            >
              {/* Image(s) */}
              <div className="relative overflow-hidden aspect-video">
                {project.images.length > 1 ? (
                  // Multiple images: split the container into equal columns
                  <div
                    className="w-full h-full grid gap-0.5"
                    style={{
                      gridTemplateColumns: `repeat(${project.images.length}, minmax(0, 1fr))`,
                    }}
                  >
                    {project.images.map((img, imgIdx) => (
                      <img
                        key={imgIdx}
                        src={img}
                        alt={`${project.title} screenshot ${imgIdx + 1}`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ))}
                  </div>
                ) : (
                  // Single image: fill the container as before
                  <img
                    src={project.images[0]}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                )}

                <div
                  className="absolute inset-0 
                bg-gradient-to-t from-card via-card/50
                 to-transparent opacity-60"
                />
                {/* Overlay Links */}
                <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {project.link ? (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-full glass hover:bg-primary hover:text-primary-foreground transition-all"
                    >
                      <ArrowUpRight className="w-5 h-5" />
                    </a>
                  ) : (
                    <span
                      title="No live demo available"
                      className="p-3 rounded-full glass text-muted-foreground cursor-default"
                    >
                      <Lock className="w-5 h-5" />
                    </span>
                  )}
                  {project.github ? (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-full glass hover:bg-primary hover:text-primary-foreground transition-all"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                  ) : (
                    <span
                      title="Repository is private for now"
                      className="p-3 rounded-full glass text-muted-foreground cursor-default"
                    >
                      <Lock className="w-5 h-5" />
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <ArrowUpRight
                    className="w-5 h-5 
                  text-muted-foreground group-hover:text-primary
                   group-hover:translate-x-1 
                   group-hover:-translate-y-1 transition-all"
                  />
                </div>
                <p className="text-muted-foreground text-sm">
                  {project.description}
                </p>
                {!project.github && (
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground italic">
                    <Lock className="w-3 h-3" /> Repo private for now
                  </span>
                )}
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, tagIdx) => (
                    <span
                      key={tagIdx}
                      className="px-4 py-1.5 rounded-full bg-surface text-xs font-medium border border-border/50 text-muted-foreground hover:border-primary/50 hover:text-primary transition-all duration-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All CTA
        <div className="text-center mt-12 animate-fade-in animation-delay-500">
          <AnimatedBorderButton>
            View All Projects
            <ArrowUpRight className="w-5 h-5" />
          </AnimatedBorderButton>
        </div> */}
      </div>
    </section>
  );
};
