import IconComponent from "./iconComponent";

type OpenState = {
  userMgmt: boolean;
  institutions: boolean;
  academics: boolean;
  documents: boolean;
};

type SidebarProps = {
  open: OpenState;
  setOpen: React.Dispatch<React.SetStateAction<OpenState>>;
  onNavigate?: () => void;
  isCollapsed: boolean;
};

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
  | "panel-right-open";

export default function Sidebar({ open, setOpen, onNavigate, isCollapsed }: SidebarProps) {
  const LinkItem: React.FC<{
    icon: IconName;
    label: string;
    href: string;
    active?: boolean;
  }> = ({ icon, label, href, active }) => (
    <a
      href={href}
      onClick={onNavigate}
      className={`group relative flex items-center gap-3 px-3 py-2 text-[14px]
      ${active ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"}`}
      title={isCollapsed ? label : undefined}
    >
      {/* left active bar */}
      <span
        className={`absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-full
          ${active ? "bg-indigo-500" : "bg-transparent group-hover:bg-slate-300"}`}
      />
      <span
        className={`inline-flex h-8 w-8 items-center justify-center border
          ${active ? "border-indigo-200 bg-white text-indigo-600 dark:border-indigo-700 dark:bg-slate-800 dark:text-indigo-400" : "border-slate-200 bg-white text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"}
          shadow-sm group-hover:shadow`}
      >
        <IconComponent name={icon} className="h-4 w-4" />
      </span>
      {!isCollapsed && <span className="truncate">{label}</span>}
    </a>
  );

  const Group: React.FC<{
    title: string;
    icon: IconName;
    isOpenKey: keyof OpenState;
    children: React.ReactNode;
  }> = ({ title, icon, isOpenKey, children }) => (
    <div className="space-y-1">
      <button
        onClick={() => setOpen((s) => ({ ...s, [isOpenKey]: !s[isOpenKey] }))}
        className="flex w-full items-center justify-between px-3 py-2 text-left text-[13px] font-semibold text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"
      >
        <span className="inline-flex items-center gap-2">
          <IconComponent name={icon} className="h-4 w-4 text-slate-400" />
          {!isCollapsed && title}
        </span>
        {!isCollapsed && (
          <IconComponent name={open[isOpenKey] ? "chev-up" : "chev-down"} className="h-4 w-4 text-slate-400" />
        )}
      </button>
      <div className={`${open[isOpenKey] && !isCollapsed ? "block" : "hidden"} space-y-1 pl-1.5`}>{children}</div>
    </div>
  );

  return (
    <nav className="h-full overflow-y-auto border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">Main</div>
      <div className="flex flex-col gap-1">
        <LinkItem icon="calendar" label="Calendar" href="#" />
        <LinkItem icon="user" label="User Profile" href="#" />

        <div className="mt-3 mb-2 px-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
          Administration
        </div>

        <Group title="User Management" icon="users" isOpenKey="userMgmt">
          <LinkItem icon="dot" label="Users" href="/user" />
          <LinkItem icon="dot" label="Permissions" href="/permission" />
          <LinkItem icon="dot" label="Roles" href="/role" />
        </Group>

        <LinkItem icon="id" label="Certificate Applications" href="#" />
      </div>
    </nav>
  );
}

