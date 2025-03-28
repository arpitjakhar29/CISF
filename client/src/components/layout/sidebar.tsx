import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  FileText, 
  CreditCard, 
  FilePlus, 
  HelpCircle, 
  Settings, 
  LogOut,
  Hospital
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface SidebarProps {
  onOpenSettings: () => void;
}

export default function Sidebar({ onOpenSettings }: SidebarProps) {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { path: "/claims", label: "My Claims", icon: <FileText className="h-5 w-5" /> },
    { path: "/entitlements", label: "Entitlements", icon: <CreditCard className="h-5 w-5" /> },
    { path: "/submit-claim", label: "Submit Claim", icon: <FilePlus className="h-5 w-5" /> },
    { path: "/help-support", label: "Help & Support", icon: <HelpCircle className="h-5 w-5" /> },
  ];
  
  const adminItems = [
    { path: "/settings", label: "Settings", icon: <Settings className="h-5 w-5" />, onClick: onOpenSettings },
  ];

  // Get initials from the user's username
  const getInitials = (username: string) => {
    if (!username) return "U";
    return username.substring(0, 2).toUpperCase();
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-background border-r border-border">
      <div className="p-4 flex items-center space-x-2 border-b border-border">
        <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-lg">
          <Hospital className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-bold text-lg">CISF Medical</h1>
          <p className="text-xs text-muted-foreground">Management System</p>
        </div>
      </div>
      
      <nav className="flex-1 pt-4 px-2">
        <div className="space-y-1">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              href={item.path}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                location === item.path
                  ? "bg-secondary text-secondary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
              )}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
        
        <div className="mt-10">
          <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Administrative
          </h3>
          <div className="mt-2 space-y-1">
            {adminItems.map((item) => (
              <Button
                key={item.label}
                variant="ghost"
                className={cn(
                  "w-full justify-start text-sm font-medium",
                  "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
                )}
                onClick={item.onClick}
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </nav>
      
      <div className="p-4 border-t border-border">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarFallback>{user ? getInitials(user.username) : "U"}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">{user?.username || "User"}</p>
            <p className="text-xs text-muted-foreground truncate">
              Officer ID: {user ? `CISF-${1000 + user.id}` : ""}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
            <LogOut className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      </div>
    </aside>
  );
}
