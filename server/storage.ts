import { 
  users, type User, type InsertUser,
  officers, type Officer, type InsertOfficer,
  claims, type Claim, type InsertClaim,
  entitlements, type Entitlement, type InsertEntitlement
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<User | undefined>;
  getUserProfile(id: number): Promise<any>;
  updateUserProfile(id: number, profileData: any): Promise<any>;
  
  // Officer methods
  getAllOfficers(): Promise<Officer[]>;
  getOfficerById(id: number): Promise<Officer | undefined>;
  createOfficer(officer: InsertOfficer): Promise<Officer>;
  updateOfficer(id: number, officerData: Partial<Officer>): Promise<Officer | undefined>;
  deleteOfficer(id: number): Promise<boolean>;
  
  // Claim methods
  getAllClaims(): Promise<Claim[]>;
  getClaimsByUserId(userId: number): Promise<Claim[]>;
  getClaimById(id: number): Promise<Claim | undefined>;
  createClaim(claim: InsertClaim): Promise<Claim>;
  updateClaim(id: number, claimData: Partial<Claim>): Promise<Claim | undefined>;
  deleteClaim(id: number): Promise<boolean>;
  
  // Entitlement methods
  getAllEntitlements(): Promise<Entitlement[]>;
  getEntitlementById(id: number): Promise<Entitlement | undefined>;
  updateEntitlement(id: number, entitlementData: Partial<Entitlement>): Promise<Entitlement | undefined>;
  
  // Dashboard data
  getDashboardData(userId: number): Promise<any>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private officers: Map<number, Officer>;
  private claims: Map<number, Claim>;
  private entitlements: Map<number, Entitlement>;
  private userProfiles: Map<number, any>;
  private appointments: Map<number, any>;
  sessionStore: session.SessionStore;
  
  currentUserId: number;
  currentOfficerId: number;
  currentClaimId: number;
  currentEntitlementId: number;
  currentAppointmentId: number;

  constructor() {
    this.users = new Map();
    this.officers = new Map();
    this.claims = new Map();
    this.entitlements = new Map();
    this.userProfiles = new Map();
    this.appointments = new Map();
    
    this.currentUserId = 1;
    this.currentOfficerId = 1;
    this.currentClaimId = 1;
    this.currentEntitlementId = 1;
    this.currentAppointmentId = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // 24 hours
    });
    
    // Initialize with demo data
    this.initializeDemoData();
  }
  
  private initializeDemoData() {
    // Create demo entitlements
    const domiciliaryEntitlement = {
      id: this.currentEntitlementId++,
      name: "Domiciliary",
      description: "Regular outpatient expenses and medications",
      totalAmount: 25000,
      usedAmount: 12500,
      fiscalYear: "2023-24",
      category: "domiciliary"
    };
    
    const chronicEntitlement = {
      id: this.currentEntitlementId++,
      name: "Chronic",
      description: "Long-term medication for chronic conditions",
      totalAmount: 15000,
      usedAmount: 3250,
      fiscalYear: "2023-24",
      category: "chronic"
    };
    
    const hospitalizationEntitlement = {
      id: this.currentEntitlementId++,
      name: "Hospitalization",
      description: "Emergency and in-patient treatment",
      totalAmount: 10000,
      usedAmount: 1800,
      fiscalYear: "2023-24",
      category: "hospitalization"
    };
    
    this.entitlements.set(domiciliaryEntitlement.id, domiciliaryEntitlement);
    this.entitlements.set(chronicEntitlement.id, chronicEntitlement);
    this.entitlements.set(hospitalizationEntitlement.id, hospitalizationEntitlement);
    
    // Create demo appointments
    const appointment = {
      id: this.currentAppointmentId++,
      doctorName: "Dr. Mehra",
      specialization: "Cardiologist",
      location: "CISF Referral Hospital, Delhi",
      date: "2023-06-15",
      time: "10:30 AM",
      userId: 1
    };
    
    this.appointments.set(appointment.id, appointment);
    
    // Create demo claims data that will be used if a user is created
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    
    // Create a profile for the user
    const profile = {
      userId: id,
      name: "CISF Officer",
      contactNumber: "9876543210",
      email: insertUser.username + "@example.com",
      officerId: `CISF-${1000 + id}`,
      address: "CISF Quarters, Sector 21, New Delhi",
      dateOfBirth: "1985-05-15",
      bloodGroup: "O+",
      rank: "Inspector",
      joiningDate: "2010-01-15"
    };
    
    this.userProfiles.set(id, profile);
    
    // Create an officer record
    const officer: Officer = {
      id,
      userId: id,
      name: "CISF Officer",
      rank: "Inspector",
      officerId: `CISF-${1000 + id}`,
      station: "Delhi",
      joiningDate: "2010-01-15",
      contactNumber: "9876543210",
      email: insertUser.username + "@example.com"
    };
    
    this.officers.set(id, officer);
    
    return user;
  }
  
  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  async getUserProfile(id: number): Promise<any> {
    return this.userProfiles.get(id);
  }
  
  async updateUserProfile(id: number, profileData: any): Promise<any> {
    const profile = this.userProfiles.get(id);
    if (!profile) return undefined;
    
    const updatedProfile = { ...profile, ...profileData };
    this.userProfiles.set(id, updatedProfile);
    return updatedProfile;
  }
  
  async getAllOfficers(): Promise<Officer[]> {
    return Array.from(this.officers.values());
  }
  
  async getOfficerById(id: number): Promise<Officer | undefined> {
    return this.officers.get(id);
  }
  
  async createOfficer(officer: InsertOfficer): Promise<Officer> {
    const id = this.currentOfficerId++;
    const newOfficer: Officer = { ...officer, id };
    this.officers.set(id, newOfficer);
    return newOfficer;
  }
  
  async updateOfficer(id: number, officerData: Partial<Officer>): Promise<Officer | undefined> {
    const officer = this.officers.get(id);
    if (!officer) return undefined;
    
    const updatedOfficer = { ...officer, ...officerData };
    this.officers.set(id, updatedOfficer);
    return updatedOfficer;
  }
  
  async deleteOfficer(id: number): Promise<boolean> {
    return this.officers.delete(id);
  }
  
  async getAllClaims(): Promise<Claim[]> {
    return Array.from(this.claims.values());
  }
  
  async getClaimsByUserId(userId: number): Promise<Claim[]> {
    return Array.from(this.claims.values()).filter(claim => claim.userId === userId);
  }
  
  async getClaimById(id: number): Promise<Claim | undefined> {
    return this.claims.get(id);
  }
  
  async createClaim(claim: InsertClaim): Promise<Claim> {
    const id = this.currentClaimId++;
    const newClaim: Claim = { ...claim, id };
    this.claims.set(id, newClaim);
    
    // Update the used amount for the appropriate entitlement
    const entitlement = Array.from(this.entitlements.values())
      .find(ent => ent.category === claim.category);
    
    if (entitlement) {
      entitlement.usedAmount += claim.amount;
      this.entitlements.set(entitlement.id, entitlement);
    }
    
    return newClaim;
  }
  
  async updateClaim(id: number, claimData: Partial<Claim>): Promise<Claim | undefined> {
    const claim = this.claims.get(id);
    if (!claim) return undefined;
    
    const updatedClaim = { ...claim, ...claimData };
    this.claims.set(id, updatedClaim);
    return updatedClaim;
  }
  
  async deleteClaim(id: number): Promise<boolean> {
    return this.claims.delete(id);
  }
  
  async getAllEntitlements(): Promise<Entitlement[]> {
    return Array.from(this.entitlements.values());
  }
  
  async getEntitlementById(id: number): Promise<Entitlement | undefined> {
    return this.entitlements.get(id);
  }
  
  async updateEntitlement(id: number, entitlementData: Partial<Entitlement>): Promise<Entitlement | undefined> {
    const entitlement = this.entitlements.get(id);
    if (!entitlement) return undefined;
    
    const updatedEntitlement = { ...entitlement, ...entitlementData };
    this.entitlements.set(id, updatedEntitlement);
    return updatedEntitlement;
  }
  
  async getDashboardData(userId: number): Promise<any> {
    const userClaims = await this.getClaimsByUserId(userId);
    const pendingClaims = userClaims.filter(claim => claim.status === "pending");
    const allEntitlements = await this.getAllEntitlements();
    const nextAppointment = Array.from(this.appointments.values())
      .filter(app => app.userId === userId)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
    
    // Calculate total available balance
    const totalEntitlement = allEntitlements.reduce((sum, ent) => sum + ent.totalAmount, 0);
    const usedEntitlement = allEntitlements.reduce((sum, ent) => sum + ent.usedAmount, 0);
    const availableBalance = totalEntitlement - usedEntitlement;
    
    // Create monthly claims data for chart
    const monthlyClaimsData = [
      { month: "Jan", domiciliary: 4500, chronic: 1200, hospitalization: 0 },
      { month: "Feb", domiciliary: 3200, chronic: 1200, hospitalization: 0 },
      { month: "Mar", domiciliary: 6500, chronic: 1200, hospitalization: 800 },
      { month: "Apr", domiciliary: 2800, chronic: 0, hospitalization: 1000 },
      { month: "May", domiciliary: 4200, chronic: 1200, hospitalization: 0 },
      { month: "Jun", domiciliary: 0, chronic: 0, hospitalization: 1800 }
    ];
    
    // Recent activity/transactions
    const recentActivity = [
      {
        id: 1,
        date: "2023-06-10",
        description: "Consultation - Dr. Mehra",
        category: "domiciliary",
        amount: 1200,
        status: "pending"
      },
      {
        id: 2,
        date: "2023-06-05",
        description: "Monthly Medication",
        category: "chronic",
        amount: 3250,
        status: "approved"
      },
      {
        id: 3,
        date: "2023-05-28",
        description: "Lab Tests - Blood Work",
        category: "domiciliary",
        amount: 4500,
        status: "pending"
      },
      {
        id: 4,
        date: "2023-05-15",
        description: "Emergency Room Visit",
        category: "hospitalization",
        amount: 8750,
        status: "approved"
      },
      {
        id: 5,
        date: "2023-05-02",
        description: "Prescription Medicines",
        category: "domiciliary",
        amount: 2340,
        status: "pending"
      }
    ];
    
    return {
      availableBalance,
      totalEntitlement,
      usedEntitlement,
      pendingClaimsCount: pendingClaims.length,
      pendingClaimsAmount: pendingClaims.reduce((sum, claim) => sum + claim.amount, 0),
      entitlements: allEntitlements,
      nextAppointment,
      monthlyClaimsData,
      recentActivity
    };
  }
}

export const storage = new MemStorage();
