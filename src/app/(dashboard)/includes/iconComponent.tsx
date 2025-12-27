type IconName =
  | "menu"
  | "clock"
  | "mail"
  | "chev-down"
  | "chev-up"
  | "close"
  | "calendar"
  | "user"
  | "users"
  | "id"
  | "dot"
  | "panel-left-close"
  | "panel-right-open"
  | "edit"
  | "delete"
  | "sun"
  | "moon";

type IconProps = {
  name: IconName;
  className?: string;
};

export default function IconComponent({ name, className }: IconProps) {
  const props = { className: `${className ?? "h-4 w-4"}` };
  switch (name) {
    case "menu":
      return (
        <svg {...props} viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 6h18v2H3zM3 11h18v2H3zM3 16h18v2H3z" />
        </svg>
      );
    case "clock":
      return (
        <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );
    case "mail":
      return (
        <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path d="M4 6h16v12H4z" />
          <path d="m4 7 8 6 8-6" />
        </svg>
      );
    case "chev-down":
      return (
        <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path d="m6 9 6 6 6-6" />
        </svg>
      );
    case "chev-up":
      return (
        <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path d="m6 15 6-6 6 6" />
        </svg>
      );
    case "close":
      return (
        <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path d="M6 6l12 12M6 18L18 6" />
        </svg>
      );
    case "calendar":
      return (
        <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <rect x="3" y="4" width="18" height="17" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      );
    case "user":
      return (
        <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <circle cx="12" cy="7.5" r="3.5" />
          <path d="M4 20a8 8 0 0 1 16 0" />
        </svg>
      );
    case "users":
      return (
        <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <circle cx="9" cy="7" r="3" />
          <circle cx="17" cy="9" r="3" />
          <path d="M2 21a7 7 0 0 1 14 0" />
          <path d="M10 21a7 7 0 0 1 12-3" />
        </svg>
      );
    case "id":
      return (
        <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <circle cx="9" cy="12" r="3" />
          <path d="M15 10h4M15 14h4" />
        </svg>
      );
    case "dot":
      return (
        <svg {...props} viewBox="0 0 8 8" fill="currentColor">
          <circle cx="4" cy="4" r="3" />
        </svg>
      );
    case "panel-left-close":
      return (
        <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M9 4v16" />
          <path d="M12 12l-3 3m3-3-3-3" />
        </svg>
      );
    case "panel-right-open":
      return (
        <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M9 4v16" />
          <path d="M12 12l3-3m-3 3 3 3" />
        </svg>
      );
    case "edit":
      return (
        <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      );
    case "delete":
      return (
        <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path d="M3 6h18" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          <path d="M10 11v6" />
          <path d="M14 11v6" />
        </svg>
      );
    case "sun":
      return (
        <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      );
    case "moon":
      return (
        <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path d="M21 14.5A8.5 8.5 0 1 1 9.5 3a7 7 0 0 0 11.5 11.5z" />
        </svg>
      );
    default:
      return null;
  }
}
