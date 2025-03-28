import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";

export default function HomePage() {
  const { user } = useAuth();
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-background/70">
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMjIiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptMCAwdjZoLTZ2LTZoNnoiLz48L2c+PC9nPjwvc3ZnPg==')] bg-center opacity-20"></div>
      </div>
      
      <div className="relative z-10 max-w-3xl text-center px-4">
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-8"
        >
          <motion.div variants={item} className="mb-6 inline-flex p-2 rounded-full bg-primary/10">
            <div className="w-12 h-12 bg-primary flex items-center justify-center rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 20h8"></path>
                <path d="M12 4v16"></path>
                <path d="M20 8h-2a2 2 0 0 0-2 2v2c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2v-2c0-1.1-.9-2-2-2Z"></path>
                <path d="M6 12h2c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2Z"></path>
                <path d="M6 16h2c1.1 0 2-.9 2-2v-2c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2Z"></path>
              </svg>
            </div>
          </motion.div>
          
          <motion.h1 variants={item} className="text-4xl md:text-5xl font-bold mb-4">
            Medical Management System for CISF Officers
          </motion.h1>
          
          <motion.p variants={item} className="text-xl text-muted-foreground mb-8">
            Claim your Medical Privileges and Entitlements here
          </motion.p>
          
          <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              asChild
              className="gap-2"
            >
              <Link href={user ? "/dashboard" : "/auth"}>
                <span>Let's Get Started</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              asChild
            >
              <Link href="/about">
                Learn More
              </Link>
            </Button>
          </motion.div>
          
          <motion.div variants={item} className="mt-12 flex justify-center space-x-6">
            <Link href="/">
              <a className={cn(
                "text-muted-foreground hover:text-foreground transition-colors",
                "underline-offset-4 hover:underline"
              )}>
                HOME
              </a>
            </Link>
            <Link href="/about">
              <a className={cn(
                "text-muted-foreground hover:text-foreground transition-colors",
                "underline-offset-4 hover:underline"
              )}>
                ABOUT
              </a>
            </Link>
            <Link href={user ? "/claims" : "/auth"}>
              <a className={cn(
                "text-muted-foreground hover:text-foreground transition-colors",
                "underline-offset-4 hover:underline"
              )}>
                MY CLAIMS
              </a>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
