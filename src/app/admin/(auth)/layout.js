import Image from "next/image";
import Link from "next/link";
import { Building2, ShieldCheck, TrendingUp, Users } from "lucide-react";

const STATS = [
  { icon: Building2, label: "Properties managed", value: "12,800+" },
  { icon: Users, label: "Active agents & developers", value: "2,400+" },
  { icon: TrendingUp, label: "Monthly platform revenue", value: "₹48.6L" },
];

export default function AuthLayout({ children }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-navy-950 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <Image
          src="https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=1600&auto=format&fit=crop"
          alt=""
          fill
          priority
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/70 to-navy-950/30" />

        <Link href="/admin/dashboard" className="relative z-10 flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-navy-900 text-white shadow-sm">
            <Building2 className="h-5 w-5" />
          </span>
          <span className="font-display text-xl font-bold text-white">Estately</span>
        </Link>

        <div className="relative z-10 space-y-6">
          <h2 className="font-display text-3xl font-bold leading-tight text-white">
            The command center for your entire real estate business.
          </h2>
          <p className="max-w-md text-sm text-navy-200">
            Manage listings, projects, leads and revenue from one premium admin
            console built for serious real estate teams.
          </p>
          <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <stat.icon className="mb-2 h-5 w-5 text-primary-400" />
                <p className="font-display text-lg font-bold text-white">{stat.value}</p>
                <p className="text-xs text-navy-300">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 flex items-center gap-2 text-xs text-navy-300">
          <ShieldCheck className="h-4 w-4 text-success-500" />
          Enterprise-grade security & role-based access control
        </p>
      </div>

      <div className="flex items-center justify-center bg-background p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <Link href="/admin/dashboard" className="mb-8 flex items-center gap-2.5 lg:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-navy-900 text-white">
              <Building2 className="h-5 w-5" />
            </span>
            <span className="font-display text-lg font-bold text-foreground">Estately</span>
          </Link>
          {children}
        </div>
      </div>
    </div>
  );
}
