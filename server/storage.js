import session from "express-session";
import createMemoryStore from "memorystore";
import { MongoStorage, mongoStorage } from './mongoStorage.js';

const MemoryStore = createMemoryStore(session);

class MemStorage {
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
  
  initializeDemoData() {
    // Create demo entitlements
    const domiciliaryEntitlement = {
      id: this.currentEntitlementId++,
      name: "Domiciliary",
      description: "Regular outpatient expenses and medications",
      totalAmount: "25000",
      usedAmount: "12500",
      fiscalYear: "2023-24",
      category: "domiciliary"
    };
    
    const chronicEntitlement = {
      id: this.currentEntitlementId++,
      name: "Chronic",
      description: "Long-term medication for chronic conditions",
      totalAmount: "15000",
      usedAmount: "3250",
      fiscalYear: "2023-24",
      category: "chronic"
    };
    
    const hospitalizationEntitlement = {
      id: this.currentEntitlementId++,
      name: "Hospitalization",
      description: "Emergency and in-patient treatment",
      totalAmount: "10000",
      usedAmount: "1800",
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

  async getUser(id) {
    return this.users.get(id);
  }

  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser) {
    const id = this.currentUserId++;
    const user = { 
      ...insertUser, 
      id, 
      role: insertUser.role || "user",
      createdAt: new Date()
    };
    
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
    const officer = {
      id,
      userId: id,
      name: "CISF Officer",
      rank: "Inspector",
      officerId: `CISF-${1000 + id}`,
      station: "Delhi",
      joiningDate: "2010-01-15",
      contactNumber: "9876543210",
      email: insertUser.username + "@example.com",
      address: null,
      dateOfBirth: null,
      bloodGroup: null,
      isActive: true,
      createdAt: new Date()
    };
    
    this.officers.set(id, officer);
    
    return user;
  }
  
  async updateUser(id, userData) {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  async getUserProfile(id) {
    return this.userProfiles.get(id);
  }
  
  async updateUserProfile(id, profileData) {
    const profile = this.userProfiles.get(id);
    if (!profile) return undefined;
    
    const updatedProfile = { ...profile, ...profileData };
    this.userProfiles.set(id, updatedProfile);
    return updatedProfile;
  }
  
  async getAllOfficers() {
    return Array.from(this.officers.values());
  }
  
  async getOfficerById(id) {
    return this.officers.get(id);
  }
  
  async createOfficer(officer) {
    const id = this.currentOfficerId++;
    const newOfficer = { 
      ...officer, 
      id,
      address: officer.address || null,
      contactNumber: officer.contactNumber || null,
      email: officer.email || null,
      dateOfBirth: officer.dateOfBirth || null,
      bloodGroup: officer.bloodGroup || null,
      isActive: officer.isActive !== undefined ? officer.isActive : true,
      createdAt: new Date()
    };
    this.officers.set(id, newOfficer);
    return newOfficer;
  }
  
  async updateOfficer(id, officerData) {
    const officer = this.officers.get(id);
    if (!officer) return undefined;
    
    const updatedOfficer = { ...officer, ...officerData };
    this.officers.set(id, updatedOfficer);
    return updatedOfficer;
  }
  
  async deleteOfficer(id) {
    return this.officers.delete(id);
  }
  
  async getAllClaims() {
    return Array.from(this.claims.values());
  }
  
  async getClaimsByUserId(userId) {
    return Array.from(this.claims.values()).filter(claim => claim.userId === userId);
  }
  
  async getClaimById(id) {
    return this.claims.get(id);
  }
  
  async createClaim(claim) {
    const id = this.currentClaimId++;
    const newClaim = { 
      ...claim, 
      id,
      comments: claim.comments || null,
      billNumber: claim.billNumber || null,
      billDate: claim.billDate || null,
      hospitalName: claim.hospitalName || null,
      doctorName: claim.doctorName || null,
      diagnosis: claim.diagnosis || null,
      approvedAmount: null,
      approvedBy: null,
      approvedAt: null,
      rejectionReason: null,
      status: claim.status || "pending"
    };
    
    this.claims.set(id, newClaim);
    
    // Update the used amount for the appropriate entitlement
    const entitlement = Array.from(this.entitlements.values())
      .find(ent => ent.category === claim.category);
    
    if (entitlement) {
      // Convert string amounts to numbers for calculation
      entitlement.usedAmount = String(Number(entitlement.usedAmount) + Number(claim.amount));
      this.entitlements.set(entitlement.id, entitlement);
    }
    
    return newClaim;
  }
  
  async updateClaim(id, claimData) {
    const claim = this.claims.get(id);
    if (!claim) return undefined;
    
    const updatedClaim = { ...claim, ...claimData };
    this.claims.set(id, updatedClaim);
    return updatedClaim;
  }
  
  async deleteClaim(id) {
    return this.claims.delete(id);
  }
  
  async getAllEntitlements() {
    return Array.from(this.entitlements.values());
  }
  
  async getEntitlementById(id) {
    return this.entitlements.get(id);
  }
  
  async updateEntitlement(id, entitlementData) {
    const entitlement = this.entitlements.get(id);
    if (!entitlement) return undefined;
    
    const updatedEntitlement = { ...entitlement, ...entitlementData };
    this.entitlements.set(id, updatedEntitlement);
    return updatedEntitlement;
  }
  
  async getDashboardData(userId) {
    const userClaims = await this.getClaimsByUserId(userId);
    const pendingClaims = userClaims.filter(claim => claim.status === "pending");
    const allEntitlements = await this.getAllEntitlements();
    const nextAppointment = Array.from(this.appointments.values())
      .filter(app => app.userId === userId)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
    
    // Calculate total available balance - convert string amounts to numbers for calculations
    const totalEntitlement = allEntitlements.reduce((sum, ent) => sum + Number(ent.totalAmount), 0);
    const usedEntitlement = allEntitlements.reduce((sum, ent) => sum + Number(ent.usedAmount), 0);
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
    
    // Convert string amounts to numbers for calculations
    const pendingClaimsAmount = pendingClaims.reduce((sum, claim) => sum + Number(claim.amount), 0);
    
    return {
      availableBalance,
      totalEntitlement,
      usedEntitlement,
      pendingClaimsCount: pendingClaims.length,
      pendingClaimsAmount,
      entitlements: allEntitlements,
      nextAppointment,
      monthlyClaimsData,
      recentActivity
    };
  }
}

// Initialize MongoDB storage
async function initStorage() {
  try {
    // Try to initialize MongoDB storage
    const initialized = await mongoStorage.initialize();
    if (initialized) {
      console.log('Using MongoDB storage');
      return mongoStorage;
    }
  } catch (err) {
    console.error('Error initializing MongoDB storage:', err);
  }
  
  // Fallback to in-memory storage
  console.log('Using in-memory storage');
  return new MemStorage();
}

// Default to in-memory storage until MongoDB is initialized
let storage = new MemStorage();

// Immediately try to initialize MongoDB
initStorage().then(result => {
  storage = result;
}).catch(err => {
  console.error('Failed to initialize storage:', err);
});

export { storage, MemStorage };