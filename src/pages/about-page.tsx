import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { 
  Shield, 
  Heart, 
  Users, 
  Clock, 
  CheckCircle, 
  PhoneCall, 
  ArrowRight,
  ArrowLeft
} from "lucide-react";

export default function AboutPage() {
  const { user } = useAuth();
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  const benefits = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Comprehensive Coverage",
      description: "Complete medical support for CISF officers and their families"
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Healthcare Management",
      description: "Streamlined access to quality healthcare services"
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Quick Processing",
      description: "Fast and efficient claim approval and reimbursement"
    },
    {
      icon: <CheckCircle className="h-6 w-6" />,
      title: "Transparent System",
      description: "Clear visibility of entitlements and claim status"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Family Coverage",
      description: "Extended benefits for immediate family members"
    },
    {
      icon: <PhoneCall className="h-6 w-6" />,
      title: "24/7 Support",
      description: "Round-the-clock assistance for medical emergencies"
    }
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/90">
      {/* Header with Navigation */}
      <header className="px-4 py-6 flex justify-between items-center max-w-7xl mx-auto">
        <Link href="/">
          <a className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 20h8"></path>
                <path d="M12 4v16"></path>
                <path d="M20 8h-2a2 2 0 0 0-2 2v2c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2v-2c0-1.1-.9-2-2-2Z"></path>
                <path d="M6 12h2c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2Z"></path>
                <path d="M6 16h2c1.1 0 2-.9 2-2v-2c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2Z"></path>
              </svg>
            </div>
            <div>
              <div className="font-bold text-lg">CISF Medical</div>
              <div className="text-xs text-muted-foreground">Management System</div>
            </div>
          </a>
        </Link>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          {user ? (
            <Button asChild>
              <Link href="/dashboard">
                Go to Dashboard
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          ) : (
            <Button asChild>
              <Link href="/auth">
                Sign In
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          )}
        </div>
      </header>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="px-4 py-12 max-w-7xl mx-auto"
      >
        {/* Hero Section */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            About CISF Medical System
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-muted-foreground max-w-3xl mx-auto"
          >
            A comprehensive digital platform designed to streamline medical claims and benefits for Central Industrial Security Force officers
          </motion.p>
        </div>
        
        {/* Overview Section */}
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16"
        >
          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <motion.div variants={item}>
                <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
                <p className="text-muted-foreground mb-4">
                  The CISF Medical System is dedicated to providing a seamless experience for CISF officers to access and manage their medical entitlements. Our mission is to ensure that all officers and their families receive timely and efficient medical care without the burden of complex paperwork and lengthy approval processes.
                </p>
                <p className="text-muted-foreground">
                  We strive to bring transparency, efficiency, and reliability to the medical benefits administration, allowing officers to focus on their health and well-being rather than administrative procedures.
                </p>
              </motion.div>
            </CardContent>
          </Card>
          
          <Card className="border-border bg-card overflow-hidden">
            <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMjIiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzR2Nmg2di02aC02em0wIDB2NmgtNnYtNmg2eiIvPjwvZz48L2c+PC9zdmc+')] bg-center">
              <div className="w-full h-full bg-gradient-to-r from-primary/20 to-primary/5 p-6 flex flex-col justify-center">
                <motion.div variants={item}>
                  <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 mr-2" />
                      <span>Digital claim submission and tracking</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 mr-2" />
                      <span>Real-time entitlement monitoring</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 mr-2" />
                      <span>Streamlined approval workflows</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 mr-2" />
                      <span>Comprehensive reporting and analytics</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 mr-2" />
                      <span>Secure data management</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 mr-2" />
                      <span>Mobile-friendly interface</span>
                    </li>
                  </ul>
                </motion.div>
              </div>
            </div>
          </Card>
        </motion.div>
        
        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-semibold text-center mb-12">Benefits of CISF Medical System</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
              >
                <Card className="border-border bg-card h-full">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
                      {benefit.icon}
                    </div>
                    <h3 className="text-xl font-medium mb-2">{benefit.title}</h3>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="max-w-4xl mx-auto text-center mb-16"
        >
          <Card className="border-primary/20 bg-gradient-to-r from-primary/10 to-primary/5">
            <CardContent className="p-8">
              <h2 className="text-3xl font-semibold mb-4">Ready to Get Started?</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of CISF officers who are already benefiting from our digital medical management system.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                {user ? (
                  <Button size="lg" asChild>
                    <Link href="/dashboard">
                      Go to Dashboard
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button size="lg" asChild>
                      <Link href="/auth">
                        Sign In
                      </Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                      <Link href="/auth?tab=register">
                        Create an Account
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center"
        >
          <p className="text-muted-foreground">&copy; 2023 CISF Medical Management System. All rights reserved.</p>
          <div className="flex justify-center space-x-4 mt-2">
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/help-support">Support</Link>
          </div>
        </motion.footer>
      </motion.div>
    </div>
  );
}
