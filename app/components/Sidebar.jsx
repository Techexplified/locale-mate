import {
  MdAnalytics,
  MdCampaign,
  MdDashboard,
  MdHelpOutline,
  MdOutlineTranslate,
  MdSettings,
} from "react-icons/md";
import { FaGlobe } from "react-icons/fa";
import { Sparkles } from "lucide-react";
import { BsThreeDots } from "react-icons/bs";

const mainItems = [
  { label: "Dashboard", icon: MdDashboard, active: true },
  { label: "Markets", icon: FaGlobe, badge: "4" },
  { label: "Localized Content", icon: MdOutlineTranslate },
  { label: "Campaigns", icon: MdCampaign },
  { label: "AI Suggestions", icon: Sparkles, badge: "New" },
  { label: "Analytics", icon: MdAnalytics },
];

const settingsItems = [
  { label: "Settings", icon: MdSettings },
  { label: "Help & Support", icon: MdHelpOutline },
];

function NavItem({ item }) {
  const Icon = item.icon;

  return (
    <li>
      <button
        className={`flex w-full items-center justify-between rounded-md px-3 py-3 text-sm font-semibold transition ${
          item.active
            ? "bg-blue-50 text-blue-700"
            : "text-slate-700 hover:bg-slate-100 hover:text-slate-950"
        }`}
      >
        <span className="flex min-w-0 items-center gap-3">
          <Icon size={18} />
          <span className="truncate">{item.label}</span>
        </span>
        {item.badge && (
          <span
            className={`ml-2 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
              item.active
                ? "bg-blue-600 text-white"
                : item.badge === "New"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-emerald-100 text-emerald-700"
            }`}
          >
            {item.badge}
          </span>
        )}
      </button>
    </li>
  );
}

export default function Sidebar() {
  return (
    <aside className="hidden h-screen w-64 shrink-0 border-r border-slate-200 bg-white px-3 py-5 lg:sticky lg:top-0 lg:flex lg:flex-col lg:justify-between">
      <div>
        <div className="mb-7 flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-lg font-bold text-white">
            L
          </div>
          <div>
            <h2 className="text-lg font-bold leading-5 text-slate-950">LocaleMate</h2>
            <p className="text-sm text-slate-400">Global Commerce</p>
          </div>
        </div>

        <p className="mb-3 px-3 text-xs font-semibold uppercase text-slate-400">
          Main menu
        </p>
        <ul className="space-y-1">
          {mainItems.map((item) => (
            <NavItem item={item} key={item.label} />
          ))}
        </ul>

        <div className="mt-8 border-t border-slate-200 pt-5">
          <p className="mb-3 px-3 text-xs font-semibold uppercase text-slate-400">
            Support
          </p>
          <ul className="space-y-1">
            {settingsItems.map((item) => (
              <NavItem item={item} key={item.label} />
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-200 pt-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700">
              AK
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">
                Aryan Kumar
              </p>
              <p className="text-xs text-slate-500">Store admin</p>
            </div>
          </div>
          <button className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700">
            <BsThreeDots />
            <span className="sr-only">Account menu</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
