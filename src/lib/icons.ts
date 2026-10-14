import {
  Brain,
  Code2,
  Compass,
  Database,
  Github,
  Layers,
  Lightbulb,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Rocket,
  Server,
  Users,
  type LucideIcon,
  Wrench,
} from "lucide-react";

import type { AboutHighlight, ContactInfo, SkillCategory, SocialLink } from "@/data/portfolio";

/**
 * Data files reference icons by a short string key so `portfolio.ts` stays a
 * pure content file with no framework imports.
 */

export const socialIcons: Record<SocialLink["icon"], LucideIcon> = {
  github: Github,
  linkedin: Linkedin,
};

export const contactIcons: Record<ContactInfo["icon"], LucideIcon> = {
  mail: Mail,
  phone: Phone,
  "map-pin": MapPin,
};

export const skillIcons: Record<SkillCategory["icon"], LucideIcon> = {
  code: Code2,
  layers: Layers,
  server: Server,
  database: Database,
  wrench: Wrench,
  compass: Compass,
  brain: Brain,
};

export const highlightIcons: Record<AboutHighlight["icon"], LucideIcon> = {
  code: Code2,
  rocket: Rocket,
  users: Users,
  lightbulb: Lightbulb,
};
