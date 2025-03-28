import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Search, Bell, Calendar, DollarSign, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Sidebar from "@/components/layout/sidebar";
import MobileMenu from "@/components/layout/mobile-menu";
import SettingsModal from "@/components/layout/settings-modal";
import StatsCard from "@/components/dashboard/stats-card";
import ChartCard from "@/components/dashboard/chart-card";
import ClaimSummary from "@/components/dashboard/claim-summary";
import RecentActivity from "@/components/dashboard/recent-activity";

export default function DashboardPage() {
  const { user } = useAuth();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["/api/dashboard"],
  });

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <Sidebar onOpenSettings={() => setIsSettingsOpen(true)} />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      
      <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
        <div className="py-6">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
              <div>
                <h1 className="text-2xl font-semibold">Dashboard</h1>
                <p className="mt-1 text-sm text-muted-foreground">Overview of your medical benefits and claims</p>
              </div>
              
              <div className="mt-4 lg:mt-0 flex items-center space-x-3">
                <div className="relative">
                  <Input 
                    type="text" 
                    placeholder="Search..." 
                    className="w-full sm:w-64 pl-10" 
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                
                <Button variant="outline" size="icon" className="text-muted-foreground">
                  <Bell className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-card animate-pulse h-[172px] rounded-xl"></div>
                ))}
              </div>
            ) : (
              <>
                {/* Stats Cards */}
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <StatsCard
                    title="Available Balance"
                    value={dashboardData?.availableBalance}
                    subtitle="Remaining entitlement for this financial year"
                    icon={<DollarSign />}
                    iconBgClass="bg-green-900/30"
                    iconTextClass="text-green-400"
                    percentageChange={5.2}
                    progress={{
                      current: dashboardData?.usedEntitlement || 0,
                      total: dashboardData?.totalEntitlement || 0
                    }}
                  />
                  
                  <StatsCard
                    title="Pending Claims"
                    value={dashboardData?.pendingClaimsCount || 0}
                    subtitle="Awaiting approval from medical authorities"
                    icon={<Clock />}
                    iconBgClass="bg-amber-900/30"
                    iconTextClass="text-amber-400"
                  >
                    <div className="mt-4 space-y-2">
                      {dashboardData?.recentActivity
                        .filter((activity: any) => activity.status === "pending")
                        .slice(0, 3)
                        .map((claim: any, index: number) => (
                          <div key={index} className="flex items-center text-sm">
                            <div className="w-2 h-2 rounded-full bg-amber-400 mr-2"></div>
                            <span className="text-foreground">{claim.description}</span>
                            <span className="ml-auto text-muted-foreground">₹{claim.amount}</span>
                          </div>
                        ))}
                    </div>
                  </StatsCard>
                  
                  <StatsCard
                    title="Next Appointment"
                    value={dashboardData?.nextAppointment?.doctorName ? `₹${dashboardData.nextAppointment.doctorName}` : "No Appointments"}
                    subtitle={dashboardData?.nextAppointment?.specialization || ""}
                    icon={<Calendar />}
                    iconBgClass="bg-blue-900/30"
                    iconTextClass="text-blue-400"
                  >
                    {dashboardData?.nextAppointment && (
                      <div className="mt-4 flex items-center justify-between bg-secondary/50 rounded-lg p-3">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-blue-400 mr-2" />
                          <span className="text-sm">{dashboardData?.nextAppointment?.date}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-blue-400 mr-2" />
                          <span className="text-sm">{dashboardData?.nextAppointment?.time}</span>
                        </div>
                      </div>
                    )}
                  </StatsCard>
                </div>
                
                {/* Charts Section */}
                <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <ChartCard 
                      title="Claims by Category" 
                      subtitle="Financial year 2023-24" 
                      data={dashboardData?.monthlyClaimsData || []} 
                    />
                  </div>
                  
                  <div>
                    <ClaimSummary entitlements={dashboardData?.entitlements || []} />
                  </div>
                </div>
                
                {/* Recent Activity */}
                <div className="mt-6">
                  <RecentActivity activities={dashboardData?.recentActivity || []} />
                </div>
                
                {/* Footer */}
                <footer className="mt-8 py-4 border-t border-border">
                  <div className="flex flex-col md:flex-row justify-between items-center">
                    <p className="text-sm text-muted-foreground">© 2023 CISF Medical Management System</p>
                    <div className="mt-4 md:mt-0 flex space-x-4">
                      <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Privacy Policy</a>
                      <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Terms of Service</a>
                      <a href="/help-support" className="text-sm text-muted-foreground hover:text-foreground">Contact Support</a>
                    </div>
                  </div>
                </footer>
              </>
            )}
          </div>
        </div>
      </main>
      
      <MobileMenu onOpenSettings={() => setIsSettingsOpen(true)} />
    </div>
  );
}
