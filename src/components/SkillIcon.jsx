import * as PhosphorIcons from "@phosphor-icons/react";
import * as LucideIcons from "lucide-react";
import { Lightbulb } from "lucide-react";

const SKILL_ICON_MAP = {
  Java: "Coffee",
  Python: "Code2",
  JavaScript: "Braces",
  TypeScript: "Brackets",
  React: "Atom",
  "Spring Boot": "Leaf",
  "Node.js": "Package",
  Docker: "Package",
  Git: "GitBranch",
  AWS: "Cloud",
  Linux: "Code2",
  SQL: "Database",
  "Machine Learning": "BrainCircuit",
  "Data Analysis": "ChartBar",
  "Power BI": "TrendingUp",
  "Excel Nâng Cao": "ClipboardList",
  "Pandas / NumPy": "ChartBar",
  "UI/UX Design": "Palette",
  Figma: "PenTool",
  "Adobe Photoshop": "Image",
  "Motion Design": "Film",
  "Quản Lý Dự Án": "FolderOpen",
  "Business Analysis": "Search",
  "Khởi Nghiệp": "Rocket",
  "Digital Marketing": "Megaphone",
  SEO: "Search",
  "Content Marketing": "PenLine",
  "Tài Chính Cá Nhân": "DollarSign",
  "Kế Toán": "ReceiptText",
  "Tiếng Anh": "Flag",
  "Tiếng Nhật": "Flag",
  "Tiếng Hàn": "Flag",
  "Tiếng Trung": "Flag",
  "Giao Tiếp": "MessagesSquare",
  "Thuyết Trình": "Mic",
  "Tư Duy Phản Biện": "Lightbulb",
  "Quản Lý Thời Gian": "Clock3",
  "Viết Sáng Tạo": "PenLine",
  "Nhiếp Ảnh": "Camera",
  "Biên Tập Video": "Film",
};

const CATEGORY_ICON_MAP = {
  TECH: "Code2",
  DATA: "ChartBar",
  DESIGN: "Palette",
  BUSINESS: "FolderOpen",
  MARKETING: "Megaphone",
  FINANCE: "DollarSign",
  LANGUAGE: "Flag",
  SOFT_SKILL: "MessagesSquare",
  CREATIVE: "PenLine",
  OTHER: "Lightbulb",
};

export const SkillIcon = ({
  iconName,
  skillName,
  category,
  size = 24,
  weight = "duotone",
  className = "",
}) => {
  const normalizedSkillName =
    typeof skillName === "string" ? skillName.trim() : "";
  const normalizedCategory =
    typeof category === "string" ? category.trim().toUpperCase() : "";
  const mappedIconName =
    SKILL_ICON_MAP[normalizedSkillName] ||
    CATEGORY_ICON_MAP[normalizedCategory] ||
    iconName;
  const LucideIcon = mappedIconName ? LucideIcons[mappedIconName] : null;
  if (LucideIcon) {
    return <LucideIcon size={size} className={className} />;
  }

  const PhosphorIcon = mappedIconName ? PhosphorIcons[mappedIconName] : null;
  if (PhosphorIcon) {
    return <PhosphorIcon size={size} weight={weight} className={className} />;
  }

  return <Lightbulb size={size} className={className} />;
};

export default SkillIcon;
