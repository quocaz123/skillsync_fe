import { 
    Coffee, Code, BracketsCurly, BracketsSquare, Atom, Database, GitBranch, 
    Brain, ChartBar, TrendUp, Palette, PenNib, Folder, MagnifyingGlass, 
    Megaphone, CurrencyDollar, Flag, Chats, Microphone, MonitorPlay, 
    Wrench, Laptop, Headset, ShieldCheck, GameController, PaintBrush, Browser,
    Leaf, HardDrives, Cube, DeviceMobile, AndroidLogo, Robot, Table,
    Image, Article, Rocket, Globe, Users, MusicNote, Camera, VideoCamera,
    SunHorizon, ChartLine
} from '@phosphor-icons/react';

const ICON_MAP = {
    // ── Tech ──────────────────────────────────────────────────────────────
    'java':           Coffee,
    'python':         Code,
    'javascript':     BracketsCurly,
    'typescript':     BracketsSquare,
    'react':          Atom,
    'vue.js':         Leaf,
    'vue':            Leaf,
    'node.js':        HardDrives,
    'nodejs':         HardDrives,
    'spring boot':    Leaf,
    'spring':         Leaf,
    'sql':            Database,
    'git':            GitBranch,
    'docker':         Cube,
    'flutter':        DeviceMobile,
    'kotlin':         AndroidLogo,
    'c++':            Code,
    'c#':             Code,
    'html/css':       Browser,

    // ── Data & AI ─────────────────────────────────────────────────────────
    'machine learning': Robot,
    'data analysis':    ChartBar,
    'power bi':         ChartLine,
    'excel':            Table,

    // ── Design ────────────────────────────────────────────────────────────
    'ui/ux design':   Palette,
    'figma':          PenNib,
    'photoshop':      Image,
    'illustrator':    PenNib,

    // ── Business ──────────────────────────────────────────────────────────
    'quản lý dự án':  Folder,
    'project management': Folder,
    'business analysis':  MagnifyingGlass,
    'khởi nghiệp':    Rocket,
    'startup':        Rocket,

    // ── Marketing ─────────────────────────────────────────────────────────
    'digital marketing':  Megaphone,
    'seo':                MagnifyingGlass,
    'content marketing':  Article,

    // ── Finance ───────────────────────────────────────────────────────────
    'tài chính cá nhân':   CurrencyDollar,
    'personal finance':    CurrencyDollar,
    'đầu tư chứng khoán':  TrendUp,
    'chứng khoán':         TrendUp,

    // ── Language ──────────────────────────────────────────────────────────
    'tiếng anh':   Flag,
    'english':     Flag,
    'tiếng nhật':  SunHorizon,
    'tiếng trung': Globe,
    'tiếng hàn':   Globe,

    // ── Soft Skills ───────────────────────────────────────────────────────
    'giao tiếp':         Chats,
    'communication':     Chats,
    'thuyết trình':      Microphone,
    'presentation':      Microphone,
    'lãnh đạo':          Users,
    'leadership':        Users,
    'tư duy phản biện':  Brain,
    'critical thinking': Brain,

    // ── Creative ──────────────────────────────────────────────────────────
    'piano':      MusicNote,
    'guitar':     MusicNote,
    'vẽ tranh':   PaintBrush,
    'chụp ảnh':   Camera,
    'làm video':  VideoCamera,
};

// Cung cấp render Icon linh động dựa trên tên skill
export const SkillDynamicIcon = ({ skillName, defaultIcon, className, size = 24, weight = "duotone" }) => {
    if (!skillName) return <span className={className} style={{ fontSize: size * 0.8 }}>{defaultIcon}</span>;

    const lowerName = skillName.toLowerCase();
    const normalizedMatch = Object.keys(ICON_MAP).find(k => lowerName.includes(k));
    
    if (normalizedMatch) {
        const PhosphorIcon = ICON_MAP[normalizedMatch];
        return <PhosphorIcon size={size} weight={weight} className={className} />;
    }

    // Fallback: nếu không tìm thấy trong map, render emoji default
    return <span className={className} style={{ fontSize: size * 0.8 }}>{defaultIcon || "🔖"}</span>;
};
