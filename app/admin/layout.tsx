'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Truck,
  Megaphone,
  Users,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const ADMIN_NAV = [
  { label: 'Overview & Analytics', href: '/admin', icon: LayoutDashboard },
  { label: 'Catalog Architecture', href: '/admin/catalog', icon: Package },
  { label: 'Orders & Fulfillment', href: '/admin/orders', icon: ShoppingCart },
  { label: 'Logistics & Couriers', href: '/admin/logistics', icon: Truck },
  { label: 'Marketing & Broadcasts', href: '/admin/marketing', icon: Megaphone },
  { label: 'Customers & Reviews', href: '/admin/customers', icon: Users },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const { user, isAdmin, isStaff } = useAuth();

  return (
    <div className="min-h-screen bg-[#F5F4F0] flex flex-col md:flex-row text-[#111111]">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#111111] text-white flex flex-col justify-between shrink-0 p-6 space-y-8">
        <div className="space-y-6">
          {/* Logo & Portal Brand */}
          <div className="space-y-2">
            <Link
              href="/"
              className="text-[11px] font-mono uppercase tracking-widest text-[#9E9E9E] hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3 h-3" /> Return to Storefront
            </Link>
            <div className="flex items-center gap-2 pt-2">
              <span className="font-bold text-lg tracking-wider">WOCHA</span>
              <span className="text-[10px] font-mono uppercase bg-white/10 px-2 py-0.5 rounded text-neutral-300">
                Ops Engine
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {ADMIN_NAV.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-mono transition-colors ${
                    isActive
                      ? 'bg-white text-[#111111] font-semibold'
                      : 'text-neutral-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Role Card */}
        <div className="p-3 rounded-lg bg-white/5 hairline-top space-y-1 text-xs font-mono">
          <div className="flex items-center justify-between">
            <span className="text-neutral-400 text-[10px] uppercase tracking-wider">Operator</span>
            <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-white text-black font-bold">
              {isAdmin ? 'Superadmin' : 'Staff'}
            </span>
          </div>
          <div className="font-semibold text-white truncate">{user?.name || 'Administrator'}</div>
          <div className="text-[10px] text-neutral-400 truncate">{user?.email || 'admin@wocha.com'}</div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
