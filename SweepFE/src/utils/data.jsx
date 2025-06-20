import { Briefcase, Award, Users, Target, Zap, TrendingUp } from "lucide-react";

export const statsData = [
  { number: "1000+", label: "Students Registered" },
  { number: "250+", label: "Partner Companies" },
  { number: "5000+", label: "Tasks Completed" },
  { number: "95%", label: "Success Rate" },
];

export const featuresData = [
  {
    icon: <Briefcase className="w-8 h-8 text-blue-500" />,
    title: "Real Work Experience",
    description:
      "Connect with companies offering genuine work opportunities and meaningful projects.",
  },
  {
    icon: <Award className="w-8 h-8 text-purple-500" />,
    title: "SWEEP Tokens",
    description:
      "Earn tokens for completed tasks that showcase your skills and dedication to employers.",
  },
  {
    icon: <Users className="w-8 h-8 text-green-500" />,
    title: "Network Building",
    description:
      "Build professional relationships with industry leaders and like-minded students.",
  },
];

export const howItWorksData = [
  {
    icon: <Target className="w-8 h-8 text-blue-600" />,
    title: "1. Find Opportunities",
    description:
      "Browse through hundreds of real work opportunities from verified companies.",
    bgColor: "bg-blue-100",
    hoverColor: "group-hover:bg-blue-200",
  },
  {
    icon: <Zap className="w-8 h-8 text-purple-600" />,
    title: "2. Complete Tasks",
    description:
      "Work on meaningful projects that add real value to companies and your portfolio.",
    bgColor: "bg-purple-100",
    hoverColor: "group-hover:bg-purple-200",
  },
  {
    icon: <TrendingUp className="w-8 h-8 text-green-600" />,
    title: "3. Earn & Grow",
    description:
      "Collect SWEEP tokens as proof of your achievements and build your professional reputation.",
    bgColor: "bg-green-100",
    hoverColor: "group-hover:bg-green-200",
  },
];

export const testimonialsData = [
  {
    name: "Sarah Chen",
    role: "Computer Science Student",
    content:
      "SWEEP helped me land my dream internship! The tokens I earned showed employers my commitment.",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "Business Student",
    content:
      "The real-world experience I gained through SWEEP was invaluable. Much better than traditional internships.",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "Design Student",
    content:
      "I built an amazing portfolio through SWEEP projects. The platform is a game-changer for students.",
    rating: 5,
  },
];

export const footerData = [
  {
    title: "Platform",
    links: ["For Students", "For Employers", "How it Works", "Pricing"],
  },
  {
    title: "Support",
    links: ["Help Center", "Contact Us", "FAQ", "Community"],
  },
  {
    title: "Company",
    links: ["About", "Blog", "Careers", "Press"],
  },
];
