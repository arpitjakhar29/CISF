import session from "express-session";
import memorystore from "memorystore";
import { getDb } from "./db.js";

const createMemoryStore = memorystore(session);

const MemoryStore = createMemoryStore(session);

// MongoDB Storage implementation
class MongoStorage {
  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // 24 hours
    });
  }

  // User methods
  async getUser(id) {
    const db = getDb();
    if (!db) return this.fallbackStorage.getUser(id);
    
    return db.collection("users").findOne({ id: Number(id) });
  }

  async getUserByUsername(username) {
    const db = getDb();
    if (!db) return this.fallbackStorage.getUserByUsername(username);
    
    return db.collection("users").findOne({ username });
  }

  async createUser(userData) {
    const db = getDb();
    if (!db) return this.fallbackStorage.createUser(userData);
    
    // Find max ID and increment
    const maxUserDoc = await db.collection("users").find().sort({ id: -1 }).limit(1).toArray();
    const id = maxUserDoc.length > 0 ? maxUserDoc[0].id + 1 : 1;
    
    const user = { ...userData, id };
    await db.collection("users").insertOne(user);
    
    // Create default profile
    const profile = {
      userId: id,
      name: "CISF Officer",
      contactNumber: "9876543210",
      email: userData.username + "@example.com",
      officerId: `CISF-${1000 + id}`,
      address: "CISF Quarters, Sector 21, New Delhi",
      dateOfBirth: "1985-05-15",
      bloodGroup: "O+",
      rank: "Inspector",
      joiningDate: "2010-01-15"
    };
    
    await db.collection("profiles").insertOne(profile);
    
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
      email: userData.username + "@example.com"
    };
    
    await db.collection("officers").insertOne(officer);
    
    // Initialize entitlements if not already present
    const entitlements = await db.collection("entitlements").find().toArray();
    
    if (entitlements.length === 0) {
      // Create default entitlements
      const defaultEntitlements = [
        {
          id: 1,
          name: "Domiciliary",
          description: "Regular outpatient expenses and medications",
          totalAmount: 25000,
          usedAmount: 12500,
          fiscalYear: "2023-24",
          category: "domiciliary"
        },
        {
          id: 2,
          name: "Chronic",
          description: "Long-term medication for chronic conditions",
          totalAmount: 15000,
          usedAmount: 3250,
          fiscalYear: "2023-24",
          category: "chronic"
        },
        {
          id: 3,
          name: "Hospitalization",
          description: "Emergency and in-patient treatment",
          totalAmount: 10000,
          usedAmount: 1800,
          fiscalYear: "2023-24",
          category: "hospitalization"
        }
      ];
      
      await db.collection("entitlements").insertMany(defaultEntitlements);
    }
    
    return user;
  }

  async updateUser(id, userData) {
    const db = getDb();
    if (!db) return this.fallbackStorage.updateUser(id, userData);
    
    const result = await db.collection("users").findOneAndUpdate(
      { id: Number(id) },
      { $set: userData },
      { returnDocument: 'after' }
    );
    
    return result;
  }

  async getUserProfile(id) {
    const db = getDb();
    if (!db) return this.fallbackStorage.getUserProfile(id);
    
    return db.collection("profiles").findOne({ userId: Number(id) });
  }

  async updateUserProfile(id, profileData) {
    const db = getDb();
    if (!db) return this.fallbackStorage.updateUserProfile(id, profileData);
    
    const result = await db.collection("profiles").findOneAndUpdate(
      { userId: Number(id) },
      { $set: profileData },
      { returnDocument: 'after' }
    );
    
    return result;
  }

  // Officer methods
  async getAllOfficers() {
    const db = getDb();
    if (!db) return this.fallbackStorage.getAllOfficers();
    
    return db.collection("officers").find().toArray();
  }

  async getOfficerById(id) {
    const db = getDb();
    if (!db) return this.fallbackStorage.getOfficerById(id);
    
    return db.collection("officers").findOne({ id: Number(id) });
  }

  async createOfficer(officerData) {
    const db = getDb();
    if (!db) return this.fallbackStorage.createOfficer(officerData);
    
    // Find max ID and increment
    const maxOfficerDoc = await db.collection("officers").find().sort({ id: -1 }).limit(1).toArray();
    const id = maxOfficerDoc.length > 0 ? maxOfficerDoc[0].id + 1 : 1;
    
    const officer = { ...officerData, id };
    await db.collection("officers").insertOne(officer);
    
    return officer;
  }

  async updateOfficer(id, officerData) {
    const db = getDb();
    if (!db) return this.fallbackStorage.updateOfficer(id, officerData);
    
    const result = await db.collection("officers").findOneAndUpdate(
      { id: Number(id) },
      { $set: officerData },
      { returnDocument: 'after' }
    );
    
    return result;
  }

  async deleteOfficer(id) {
    const db = getDb();
    if (!db) return this.fallbackStorage.deleteOfficer(id);
    
    const result = await db.collection("officers").deleteOne({ id: Number(id) });
    
    return result.deletedCount > 0;
  }

  // Claim methods
  async getAllClaims() {
    const db = getDb();
    if (!db) return this.fallbackStorage.getAllClaims();
    
    return db.collection("claims").find().toArray();
  }

  async getClaimsByUserId(userId) {
    const db = getDb();
    if (!db) return this.fallbackStorage.getClaimsByUserId(userId);
    
    return db.collection("claims").find({ userId: Number(userId) }).toArray();
  }

  async getClaimById(id) {
    const db = getDb();
    if (!db) return this.fallbackStorage.getClaimById(id);
    
    return db.collection("claims").findOne({ id: Number(id) });
  }

  async createClaim(claimData) {
    const db = getDb();
    if (!db) return this.fallbackStorage.createClaim(claimData);
    
    // Find max ID and increment
    const maxClaimDoc = await db.collection("claims").find().sort({ id: -1 }).limit(1).toArray();
    const id = maxClaimDoc.length > 0 ? maxClaimDoc[0].id + 1 : 1;
    
    const claim = { ...claimData, id, status: "pending" };
    await db.collection("claims").insertOne(claim);
    
    // Update the used amount for the appropriate entitlement
    await db.collection("entitlements").updateOne(
      { category: claimData.category },
      { $inc: { usedAmount: claimData.amount } }
    );
    
    return claim;
  }

  async updateClaim(id, claimData) {
    const db = getDb();
    if (!db) return this.fallbackStorage.updateClaim(id, claimData);
    
    const result = await db.collection("claims").findOneAndUpdate(
      { id: Number(id) },
      { $set: claimData },
      { returnDocument: 'after' }
    );
    
    return result;
  }

  async deleteClaim(id) {
    const db = getDb();
    if (!db) return this.fallbackStorage.deleteClaim(id);
    
    const result = await db.collection("claims").deleteOne({ id: Number(id) });
    
    return result.deletedCount > 0;
  }

  // Entitlement methods
  async getAllEntitlements() {
    const db = getDb();
    if (!db) return this.fallbackStorage.getAllEntitlements();
    
    return db.collection("entitlements").find().toArray();
  }

  async getEntitlementById(id) {
    const db = getDb();
    if (!db) return this.fallbackStorage.getEntitlementById(id);
    
    return db.collection("entitlements").findOne({ id: Number(id) });
  }

  async updateEntitlement(id, entitlementData) {
    const db = getDb();
    if (!db) return this.fallbackStorage.updateEntitlement(id, entitlementData);
    
    const result = await db.collection("entitlements").findOneAndUpdate(
      { id: Number(id) },
      { $set: entitlementData },
      { returnDocument: 'after' }
    );
    
    return result;
  }

  // Dashboard data
  async getDashboardData(userId) {
    const db = getDb();
    if (!db) return this.fallbackStorage.getDashboardData(userId);
    
    const userClaims = await this.getClaimsByUserId(userId);
    const pendingClaims = userClaims.filter(claim => claim.status === "pending");
    const allEntitlements = await this.getAllEntitlements();
    
    // Get next appointment (if we had appointments collection)
    const nextAppointment = {
      id: 1,
      doctorName: "Dr. Mehra",
      specialization: "Cardiologist",
      location: "CISF Referral Hospital, Delhi",
      date: "2023-06-15",
      time: "10:30 AM"
    };
    
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

// In-Memory fallback storage
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
  }

  async getUser(id) {
    return this.users.get(Number(id));
  }

  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser) {
    const id = this.currentUserId++;
    const user = { ...insertUser, id };
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
      email: insertUser.username + "@example.com"
    };
    
    this.officers.set(id, officer);
    
    return user;
  }
  
  async updateUser(id, userData) {
    const user = this.users.get(Number(id));
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(Number(id), updatedUser);
    return updatedUser;
  }
  
  async getUserProfile(id) {
    return this.userProfiles.get(Number(id));
  }
  
  async updateUserProfile(id, profileData) {
    const profile = this.userProfiles.get(Number(id));
    if (!profile) return undefined;
    
    const updatedProfile = { ...profile, ...profileData };
    this.userProfiles.set(Number(id), updatedProfile);
    return updatedProfile;
  }
  
  async getAllOfficers() {
    return Array.from(this.officers.values());
  }
  
  async getOfficerById(id) {
    return this.officers.get(Number(id));
  }
  
  async createOfficer(officer) {
    const id = this.currentOfficerId++;
    const newOfficer = { ...officer, id };
    this.officers.set(id, newOfficer);
    return newOfficer;
  }
  
  async updateOfficer(id, officerData) {
    const officer = this.officers.get(Number(id));
    if (!officer) return undefined;
    
    const updatedOfficer = { ...officer, ...officerData };
    this.officers.set(Number(id), updatedOfficer);
    return updatedOfficer;
  }
  
  async deleteOfficer(id) {
    return this.officers.delete(Number(id));
  }
  
  async getAllClaims() {
    return Array.from(this.claims.values());
  }
  
  async getClaimsByUserId(userId) {
    return Array.from(this.claims.values()).filter(claim => claim.userId === Number(userId));
  }
  
  async getClaimById(id) {
    return this.claims.get(Number(id));
  }
  
  async createClaim(claim) {
    const id = this.currentClaimId++;
    const newClaim = { ...claim, id, status: "pending" };
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
  
  async updateClaim(id, claimData) {
    const claim = this.claims.get(Number(id));
    if (!claim) return undefined;
    
    const updatedClaim = { ...claim, ...claimData };
    this.claims.set(Number(id), updatedClaim);
    return updatedClaim;
  }
  
  async deleteClaim(id) {
    return this.claims.delete(Number(id));
  }
  
  async getAllEntitlements() {
    return Array.from(this.entitlements.values());
  }
  
  async getEntitlementById(id) {
    return this.entitlements.get(Number(id));
  }
  
  async updateEntitlement(id, entitlementData) {
    const entitlement = this.entitlements.get(Number(id));
    if (!entitlement) return undefined;
    
    const updatedEntitlement = { ...entitlement, ...entitlementData };
    this.entitlements.set(Number(id), updatedEntitlement);
    return updatedEntitlement;
  }
  
  async getDashboardData(userId) {
    const userClaims = await this.getClaimsByUserId(userId);
    const pendingClaims = userClaims.filter(claim => claim.status === "pending");
    const allEntitlements = await this.getAllEntitlements();
    const nextAppointment = Array.from(this.appointments.values())
      .filter(app => app.userId === Number(userId))
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

// Create a MongoDB storage instance with fallback to MemStorage
const createStorage = () => {
  const mongoStorage = new MongoStorage();
  mongoStorage.fallbackStorage = new MemStorage();
  return mongoStorage;
};

// Create and export storage instance
const storage = createStorage();

export {
  storage
};