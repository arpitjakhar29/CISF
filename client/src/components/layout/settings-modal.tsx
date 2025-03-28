import { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  LayoutDashboard, 
  CreditCard, 
  HelpCircle, 
  Settings, 
  LogOut, 
  Globe, 
  Sun, 
  Moon
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const { logoutMutation } = useAuth();
  
  const handleLogout = () => {
    logoutMutation.mutate();
    onClose();
  };
  
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // In a real app, this would change the theme
  };
  
  const menuItems = [
    { 
      icon: <LayoutDashboard className="h-5 w-5 text-muted-foreground" />, 
      label: "Dashboard", 
      path: "/dashboard" 
    },
    { 
      icon: <CreditCard className="h-5 w-5 text-muted-foreground" />, 
      label: "Entitlements", 
      path: "/entitlements" 
    },
    { 
      icon: <HelpCircle className="h-5 w-5 text-muted-foreground" />, 
      label: "Help and Support", 
      path: "/help-support" 
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogClose />
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          {menuItems.map((item) => (
            <div key={item.label} className="flex items-center justify-between py-3 border-b border-border">
              <Link href={item.path} onClick={onClose}>
                <a className="flex items-center space-x-3">
                  {item.icon}
                  <span className="text-foreground">{item.label}</span>
                </a>
              </Link>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
          ))}
          
          {/* Theme Toggle */}
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div className="flex items-center space-x-3">
              {isDarkMode ? (
                <Moon className="h-5 w-5 text-muted-foreground" />
              ) : (
                <Sun className="h-5 w-5 text-muted-foreground" />
              )}
              <span className="text-foreground">Dark Mode</span>
            </div>
            <Switch checked={isDarkMode} onCheckedChange={toggleDarkMode} />
          </div>
          
          {/* Language Selection */}
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div className="flex items-center space-x-3">
              <Globe className="h-5 w-5 text-muted-foreground" />
              <span className="text-foreground">Language</span>
            </div>
            <Select defaultValue="en">
              <SelectTrigger className="w-24">
                <SelectValue placeholder="English" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">Hindi</SelectItem>
                <SelectItem value="ta">Tamil</SelectItem>
                <SelectItem value="te">Telugu</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Log Out Button */}
          <Button 
            variant="destructive" 
            className="w-full mt-4 flex items-center justify-center space-x-2"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            <span>Log Out</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
