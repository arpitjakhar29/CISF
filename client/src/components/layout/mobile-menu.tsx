import { useState } from "react";
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
  Menu, 
  X,
  Hospital
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface MobileMenuProps {
  onOpenSettings: () => void;
}

export default function MobileMenu({ onOpenSettings }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const { logoutMutation } = useAuth();
  
  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);
  
  const handleLogout = () => {
    logoutMutation.mutate();
    closeMenu();
  };
  
  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { path: "/claims", label: "My Claims", icon: <FileText className="h-5 w-5" /> },
    { path: "/entitlements", label: "Entitlements", icon: <CreditCard className="h-5 w-5" /> },
    { path: "/submit-claim", label: "Submit Claim", icon: <FilePlus className="h-5 w-5" /> },
    { path: "/help-support", label: "Help & Support", icon: <HelpCircle className="h-5 w-5" /> },
  ];
  
  const adminItems = [
    { 
      label: "Settings", 
      icon: <Settings className="h-5 w-5" />, 
      onClick: () => {
        onOpenSettings();
        closeMenu();
      },
    },
    { 
      label: "Logout", 
      icon: <LogOut className="h-5 w-5" />, 
      onClick: handleLogout,
    },
  ];

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <div className="lg:hidden fixed bottom-4 right-4 z-20">
        <Button
          variant="default"
          size="icon"
          className="h-12 w-12 rounded-full shadow-lg"
          onClick={toggleMenu}
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={closeMenu}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            
            <motion.div
              className="absolute inset-y-0 left-0 w-64 bg-background overflow-y-auto"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="p-4 flex items-center justify-between border-b border-border">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-lg">
                    <Hospital className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h1 className="font-bold text-lg">CISF Medical</h1>
                    <p className="text-xs text-muted-foreground">Management System</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={closeMenu} className="h-8 w-8">
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="p-4">
                <nav className="space-y-2">
                  {navItems.map((item) => (
                    <Link 
                      key={item.path} 
                      href={item.path} 
                      onClick={closeMenu}
                      className={cn(
                        "flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-md",
                        location === item.path
                          ? "bg-secondary text-secondary-foreground"
                          : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
                      )}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </nav>
                
                <div className="mt-6 pt-6 border-t border-border">
                  {adminItems.map((item) => (
                    <Button
                      key={item.label}
                      variant="ghost"
                      className="w-full justify-start text-sm font-medium mb-2"
                      onClick={item.onClick}
                    >
                      {item.icon}
                      <span className="ml-3">{item.label}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
