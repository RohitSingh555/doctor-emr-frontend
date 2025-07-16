"use client";

import React, { useState } from 'react';
import { 
  HomeIcon, 
  PersonIcon, 
  CalendarIcon, 
  BarChartIcon, 
  ActivityLogIcon,
  FileTextIcon,
  GearIcon,
  ExitIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  HamburgerMenuIcon
} from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import TopNavigation from './TopNavigation';

const navItems = [
  { 
    href: "/", 
    icon: <HomeIcon className="w-4 h-4" />, 
    label: "Dashboard",
    description: "Overview and analytics"
  },
  { 
    href: "/patients", 
    icon: <PersonIcon className="w-4 h-4" />, 
    label: "Patients",
    description: "Manage patient records",
    subItems: [
      { href: "/patients", label: "All Patients", description: "View all patients" },
      { href: "/patients/add", label: "Add New Patient", description: "Register new patient" },
      { href: "/patients/active", label: "Active Patients", description: "Currently active patients" },
      { href: "/patients/inactive", label: "Inactive Patients", description: "Inactive patient records" }
    ]
  },
  { 
    href: "/appointments", 
    icon: <CalendarIcon className="w-4 h-4" />, 
    label: "Appointments",
    description: "Schedule and manage appointments",
    subItems: [
      { href: "/appointments", label: "All Appointments", description: "View all appointments" },
      { href: "/appointments/schedule", label: "Schedule Appointment", description: "Book new appointment" },
      { href: "/appointments/calendar", label: "Calendar View", description: "Calendar overview" },
      { href: "/appointments/pending", label: "Pending", description: "Pending appointments" }
    ]
  },
  { 
    href: "/medical-records", 
    icon: <FileTextIcon className="w-4 h-4" />, 
    label: "Medical Records",
    description: "Patient medical history",
    subItems: [
      { href: "/medical-records", label: "All Records", description: "View all medical records" },
      { href: "/medical-records/create", label: "Create Record", description: "Add new medical record" },
      { href: "/medical-records/templates", label: "Templates", description: "Record templates" }
    ]
  },
  { 
    href: "/billing", 
    icon: <BarChartIcon className="w-4 h-4" />, 
    label: "Billing",
    description: "Invoices and payments",
    subItems: [
      { href: "/billing", label: "All Bills", description: "View all invoices" },
      { href: "/billing/create", label: "Create Invoice", description: "Generate new invoice" },
      { href: "/billing/payments", label: "Payments", description: "Payment tracking" },
      { href: "/billing/reports", label: "Billing Reports", description: "Financial reports" }
    ]
  },
  { 
    href: "/reports", 
    icon: <ActivityLogIcon className="w-4 h-4" />, 
    label: "Reports",
    description: "Analytics and insights",
    subItems: [
      { href: "/reports", label: "Overview", description: "General reports" },
      { href: "/reports/patients", label: "Patient Reports", description: "Patient analytics" },
      { href: "/reports/appointments", label: "Appointment Reports", description: "Appointment analytics" },
      { href: "/reports/financial", label: "Financial Reports", description: "Financial analytics" }
    ]
  },
  { 
    href: "/analytics", 
    icon: <BarChartIcon className="w-4 h-4" />, 
    label: "Analytics",
    description: "Performance metrics",
    subItems: [
      { href: "/analytics", label: "Dashboard", description: "Analytics overview" },
      { href: "/analytics/trends", label: "Trends", description: "Performance trends" },
      { href: "/analytics/comparison", label: "Comparison", description: "Period comparison" }
    ]
  },
];

const bottomNavItems = [
  { 
    href: "/settings", 
    icon: <GearIcon className="w-4 h-4" />, 
    label: "Settings",
    description: "System configuration"
  },
  { 
    href: "/logout", 
    icon: <ExitIcon className="w-4 h-4" />, 
    label: "Logout",
    description: "Sign out of your account"
  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const toggleExpanded = (href: string) => {
    setExpandedItems(prev => 
      prev.includes(href) 
        ? prev.filter(item => item !== href)
        : [...prev, href]
    );
  };

  const isExpanded = (href: string) => expandedItems.includes(href);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 z-50 h-screen border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300",
        isSidebarCollapsed ? "w-16" : "w-64"
      )}>
        <div className="flex h-full flex-col">
          {/* Logo and Toggle */}
          <div className="flex h-14 items-center border-b px-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">EMR</span>
              </div>
              {!isSidebarCollapsed && (
                <span className="font-semibold">EMR System</span>
              )}
            </div>
            <button
              onClick={toggleSidebar}
              className={cn(
                "ml-auto p-1 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors",
                isSidebarCollapsed && "ml-0"
              )}
            >
              <HamburgerMenuIcon className="w-4 h-4" />
            </button>
          </div>
          
          {/* Navigation */}
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-2 text-sm font-medium">
              {navItems.map((item) => (
                <div key={item.href}>
                  <a
                    href={item.href}
                    className={cn(
                      "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                      item.href === "/" && "bg-accent text-accent-foreground"
                    )}
                  >
                    <div className="flex items-center space-x-3 w-full">
                      {item.icon}
                      {!isSidebarCollapsed && (
                        <>
                          <div className="flex flex-col flex-1">
                            <span>{item.label}</span>
                            <span className="text-xs text-muted-foreground font-normal">
                              {item.description}
                            </span>
                          </div>
                          {item.subItems && (
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                toggleExpanded(item.href);
                              }}
                              className="p-1 hover:bg-accent rounded"
                            >
                              {isExpanded(item.href) ? (
                                <ChevronDownIcon className="w-3 h-3" />
                              ) : (
                                <ChevronRightIcon className="w-3 h-3" />
                              )}
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </a>
                  
                  {/* Sub Items */}
                  {item.subItems && !isSidebarCollapsed && isExpanded(item.href) && (
                    <div className="ml-6 mt-1 space-y-1">
                      {item.subItems.map((subItem) => (
                        <a
                          key={subItem.href}
                          href={subItem.href}
                          className="group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground text-muted-foreground"
                        >
                          <div className="flex flex-col">
                            <span>{subItem.label}</span>
                            <span className="text-xs text-muted-foreground font-normal">
                              {subItem.description}
                            </span>
                          </div>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
          
          {/* Bottom Navigation */}
          <div className="border-t p-2">
            <nav className="grid items-start px-2 text-sm font-medium">
              {bottomNavItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                    item.href === "/logout" && "text-destructive hover:text-destructive"
                  )}
                >
                  <div className="flex items-center space-x-3">
                    {item.icon}
                    {!isSidebarCollapsed && (
                      <div className="flex flex-col">
                        <span>{item.label}</span>
                        <span className="text-xs text-muted-foreground font-normal">
                          {item.description}
                        </span>
                      </div>
                    )}
                  </div>
                </a>
              ))}
            </nav>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={cn(
        "flex-1 flex flex-col transition-all duration-300",
        isSidebarCollapsed ? "ml-16" : "ml-64"
      )}>
        <TopNavigation />
        <main className="flex-1 overflow-auto">
          <div className="w-full p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 