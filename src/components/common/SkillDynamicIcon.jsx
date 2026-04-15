import { 
    Coffee, Code, BracketsCurly, BracketsSquare, Atom, Database, GitBranch, 
    Brain, ChartBar, TrendUp, Palette, PenNib, Folder, MagnifyingGlass, 
    Megaphone, CurrencyDollar, Flag, Chats, Microphone, MonitorPlay, 
    Wrench, Laptop, Headset, ShieldCheck, GameController, PaintBrush, Browser
} from '@phosphor-icons/react';

const ICON_MAP = {
    'java': Coffee,
    'python': Code,
    'javascript': BracketsCurly,
    'typescript': BracketsSquare,
    'react': Atom,
    'sql': Database,
    'git': GitBranch,
    'machine learning': Brain,
    'data analysis': ChartBar,
    'power bi': TrendUp,
    'ui/ux design': Palette,
    'figma': PenNib,
    'quản lý dự án': Folder,
    'project management': Folder,
    'business analysis': MagnifyingGlass,
    'digital marketing': Megaphone,
    'seo': MagnifyingGlass,
    'tài chính cá nhân': CurrencyDollar,
    'personal finance': CurrencyDollar,
    'tiếng anh': Flag,
    'english': Flag,
    'giao tiếp': Chats,
    'communication': Chats,
    'thuyết trình': Microphone,
    'presentation': Microphone,
    'c++': Code,
    'c#': Code,
    'html/css': Browser,
};

// Cung cấp render Icon linh động dựa trên tên skill
export const SkillDynamicIcon = ({ skillName, defaultIcon, className, size = 24, weight = "duotone" }) => {
    if (!skillName) return <span className={className} style={{ fontSize: size * 0.8 }}>{defaultIcon}</span>;

    const normalizedMatch = Object.keys(ICON_MAP).find(k => skillName.toLowerCase().includes(k));
    
    if (normalizedMatch) {
        const PhosphorIcon = ICON_MAP[normalizedMatch];
        return <PhosphorIcon size={size} weight={weight} className={className} />;
    }

    // Fallback: nếu không tìm thấy trong map, render emoji default
    return <span className={className} style={{ fontSize: size * 0.8 }}>{defaultIcon || "🔖"}</span>;
};
