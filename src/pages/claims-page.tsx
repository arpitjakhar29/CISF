import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/chart";
import { 
  FilePlus, 
  Search, 
  ArrowDownUp, 
  Check, 
  Clock, 
  X, 
  Filter 
} from "lucide-react";
import { cn } from "@/lib/utils";
import Sidebar from "@/components/layout/sidebar";
import MobileMenu from "@/components/layout/mobile-menu";
import SettingsModal from "@/components/layout/settings-modal";
import { motion } from "framer-motion";

export default function ClaimsPage() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: claims, isLoading } = useQuery({
    queryKey: ["/api/claims"],
  });
  
  const filteredClaims = claims?.filter((claim: any) => {
    if (activeTab !== "all" && claim.status !== activeTab) return false;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        claim.description.toLowerCase().includes(query) ||
        claim.category.toLowerCase().includes(query) ||
        claim.status.toLowerCase().includes(query)
      );
    }
    
    return true;
  });
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-amber-900/20 text-amber-400 hover:bg-amber-900/30">
            <Clock className="h-3 w-3 mr-1" />
            <span>Pending</span>
          </Badge>
        );
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-900/20 text-green-400 hover:bg-green-900/30">
            <Check className="h-3 w-3 mr-1" />
            <span>Approved</span>
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-900/20 text-red-400 hover:bg-red-900/30">
            <X className="h-3 w-3 mr-1" />
            <span>Rejected</span>
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <Sidebar onOpenSettings={() => setIsSettingsOpen(true)} />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      
      <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
        <div className="py-6">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
              <div>
                <h1 className="text-2xl font-semibold">My Claims</h1>
                <p className="mt-1 text-sm text-muted-foreground">View and manage all your medical claims</p>
              </div>
              
              <div className="mt-4 lg:mt-0 flex items-center space-x-3">
                <Button asChild>
                  <Link href="/submit-claim">
                    <FilePlus className="h-4 w-4 mr-2" />
                    <span>New Claim</span>
                  </Link>
                </Button>
              </div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardContent className="p-0">
                  <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <div className="flex justify-between items-center p-4 border-b border-border">
                      <TabsList>
                        <TabsTrigger value="all">All Claims</TabsTrigger>
                        <TabsTrigger value="pending">Pending</TabsTrigger>
                        <TabsTrigger value="approved">Approved</TabsTrigger>
                        <TabsTrigger value="rejected">Rejected</TabsTrigger>
                      </TabsList>
                      
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <Input
                            type="text"
                            placeholder="Search claims..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full sm:w-64 pl-10"
                          />
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </div>
                        
                        <Button variant="outline" size="icon">
                          <Filter className="h-4 w-4" />
                        </Button>
                        
                        <Button variant="outline" size="icon">
                          <ArrowDownUp className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <TabsContent value="all" className="m-0">
                      {renderClaimsTable(filteredClaims, isLoading, getStatusBadge)}
                    </TabsContent>
                    
                    <TabsContent value="pending" className="m-0">
                      {renderClaimsTable(filteredClaims, isLoading, getStatusBadge)}
                    </TabsContent>
                    
                    <TabsContent value="approved" className="m-0">
                      {renderClaimsTable(filteredClaims, isLoading, getStatusBadge)}
                    </TabsContent>
                    
                    <TabsContent value="rejected" className="m-0">
                      {renderClaimsTable(filteredClaims, isLoading, getStatusBadge)}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
      
      <MobileMenu onOpenSettings={() => setIsSettingsOpen(true)} />
    </div>
  );
}

function renderClaimsTable(claims: any[], isLoading: boolean, getStatusBadge: (status: string) => JSX.Element) {
  if (isLoading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-card h-12 rounded"></div>
          ))}
        </div>
      </div>
    );
  }
  
  if (!claims || claims.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="rounded-full bg-secondary/50 p-3 mb-3">
          <FilePlus className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-1">No claims found</h3>
        <p className="text-sm text-muted-foreground mb-4">
          You haven't submitted any claims yet or no claims match your filter.
        </p>
        <Button asChild>
          <Link href="/submit-claim">
            <FilePlus className="h-4 w-4 mr-2" />
            <span>Submit New Claim</span>
          </Link>
        </Button>
      </div>
    );
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };
  

  
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-border">
        <thead>
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Date
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Description
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Category
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Hospital/Pharmacy
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Doctor
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Amount
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {claims.map((claim: any, index: number) => (
            <motion.tr 
              key={claim.id || index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <td className="px-4 py-3 whitespace-nowrap text-sm">
                {formatDate(claim.submissionDate || claim.date)}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm">
                {claim.description}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm capitalize">
                {claim.category}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm">
                {claim.hospitalName || "N/A"}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm">
                {claim.doctorName || "N/A"}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm">
                ₹{claim.amount.toLocaleString()}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                {getStatusBadge(claim.status)}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm">
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="h-8">View</Button>
                  {claim.status === "pending" && (
                    <Button variant="outline" size="sm" className="h-8">Edit</Button>
                  )}
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
