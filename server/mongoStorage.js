import session from "express-session";
import connectPg from "connect-pg-simple";
import { connectToDb, getDb } from './db.js';
import { ObjectId } from 'mongodb';

// MongoDB Wrapper for session store
class MongoDBStore extends session.Store {
  constructor(options) {
    super(options);
    this.db = options.db;
    this.collection = options.collection || 'sessions';
  }

  async get(sid, callback) {
    try {
      const session = await this.db.collection(this.collection).findOne({ _id: sid });
      callback(null, session ? session.session : null);
    } catch (err) {
      callback(err);
    }
  }

  async set(sid, session, callback) {
    try {
      const data = { 
        _id: sid, 
        session, 
        expires: new Date(Date.now() + (session.cookie.maxAge || 86400000))
      };
      await this.db.collection(this.collection).replaceOne(
        { _id: sid },
        data,
        { upsert: true }
      );
      callback(null);
    } catch (err) {
      callback(err);
    }
  }

  async destroy(sid, callback) {
    try {
      await this.db.collection(this.collection).deleteOne({ _id: sid });
      callback(null);
    } catch (err) {
      callback(err);
    }
  }
}

export class MongoStorage {
  constructor() {
    this.sessionStore = null;
    this.db = null;
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return true;
    
    this.db = await connectToDb();
    if (!this.db) {
      console.error('Failed to initialize MongoDB storage');
      return false;
    }
    
    // Initialize session store
    this.sessionStore = new MongoDBStore({
      db: this.db,
      collection: 'sessions'
    });
    
    this.initialized = true;
    return true;
  }

  // User methods
  async getUser(id) {
    if (!this.db) return undefined;
    
    const user = await this.db.collection('users').findOne({ id: Number(id) });
    return user;
  }

  async getUserByUsername(username) {
    if (!this.db) return undefined;
    
    const user = await this.db.collection('users').findOne({ username });
    return user;
  }

  async createUser(insertUser) {
    if (!this.db) return undefined;
    
    // Get the next ID
    const users = await this.db.collection('users').find().sort({ id: -1 }).limit(1).toArray();
    const id = users.length > 0 ? users[0].id + 1 : 1;
    
    const user = { 
      ...insertUser, 
      id, 
      role: insertUser.role || "user",
      createdAt: new Date()
    };
    
    await this.db.collection('users').insertOne(user);
    
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
    
    await this.db.collection('profiles').insertOne(profile);
    
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
    
    await this.db.collection('officers').insertOne(officer);
    
    // Initialize entitlements if they don't exist
    await this.initializeEntitlements();
    
    return user;
  }
  
  async updateUser(id, userData) {
    if (!this.db) return undefined;
    
    const updatedUser = await this.db.collection('users').findOneAndUpdate(
      { id: Number(id) },
      { $set: userData },
      { returnDocument: 'after' }
    );
    
    return updatedUser.value;
  }
  
  async getUserProfile(id) {
    if (!this.db) return undefined;
    
    const profile = await this.db.collection('profiles').findOne({ userId: Number(id) });
    return profile;
  }
  
  async updateUserProfile(id, profileData) {
    if (!this.db) return undefined;
    
    const updatedProfile = await this.db.collection('profiles').findOneAndUpdate(
      { userId: Number(id) },
      { $set: profileData },
      { returnDocument: 'after' }
    );
    
    return updatedProfile.value;
  }
  
  // Officer methods
  async getAllOfficers() {
    if (!this.db) return [];
    
    const officers = await this.db.collection('officers').find().toArray();
    return officers;
  }
  
  async getOfficerById(id) {
    if (!this.db) return undefined;
    
    const officer = await this.db.collection('officers').findOne({ id: Number(id) });
    return officer;
  }
  
  async createOfficer(officer) {
    if (!this.db) return undefined;
    
    // Get the next ID
    const officers = await this.db.collection('officers').find().sort({ id: -1 }).limit(1).toArray();
    const id = officers.length > 0 ? officers[0].id + 1 : 1;
    
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
    
    await this.db.collection('officers').insertOne(newOfficer);
    return newOfficer;
  }
  
  async updateOfficer(id, officerData) {
    if (!this.db) return undefined;
    
    const updatedOfficer = await this.db.collection('officers').findOneAndUpdate(
      { id: Number(id) },
      { $set: officerData },
      { returnDocument: 'after' }
    );
    
    return updatedOfficer.value;
  }
  
  async deleteOfficer(id) {
    if (!this.db) return false;
    
    const result = await this.db.collection('officers').deleteOne({ id: Number(id) });
    return result.deletedCount > 0;
  }
  
  // Claim methods
  async getAllClaims() {
    if (!this.db) return [];
    
    const claims = await this.db.collection('claims').find().toArray();
    return claims;
  }
  
  async getClaimsByUserId(userId) {
    if (!this.db) return [];
    
    const claims = await this.db.collection('claims').find({ userId: Number(userId) }).toArray();
    return claims;
  }
  
  async getClaimById(id) {
    if (!this.db) return undefined;
    
    const claim = await this.db.collection('claims').findOne({ id: Number(id) });
    return claim;
  }
  
  async createClaim(claim) {
    if (!this.db) return undefined;
    
    // Get the next ID
    const claims = await this.db.collection('claims').find().sort({ id: -1 }).limit(1).toArray();
    const id = claims.length > 0 ? claims[0].id + 1 : 1;
    
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
    
    await this.db.collection('claims').insertOne(newClaim);
    
    // Update the used amount for the appropriate entitlement
    const entitlement = await this.db.collection('entitlements').findOne({ category: claim.category });
    
    if (entitlement) {
      // Convert string amounts to numbers for calculation
      const updatedUsedAmount = String(Number(entitlement.usedAmount) + Number(claim.amount));
      
      await this.db.collection('entitlements').updateOne(
        { id: entitlement.id },
        { $set: { usedAmount: updatedUsedAmount } }
      );
    }
    
    return newClaim;
  }
  
  async updateClaim(id, claimData) {
    if (!this.db) return undefined;
    
    const updatedClaim = await this.db.collection('claims').findOneAndUpdate(
      { id: Number(id) },
      { $set: claimData },
      { returnDocument: 'after' }
    );
    
    return updatedClaim.value;
  }
  
  async deleteClaim(id) {
    if (!this.db) return false;
    
    const result = await this.db.collection('claims').deleteOne({ id: Number(id) });
    return result.deletedCount > 0;
  }
  
  // Entitlement methods
  async initializeEntitlements() {
    if (!this.db) return;
    
    // Check if entitlements already exist
    const count = await this.db.collection('entitlements').countDocuments();
    if (count > 0) return;
    
    // Create default entitlements
    const entitlements = [
      {
        id: 1,
        name: "Domiciliary",
        description: "Regular outpatient expenses and medications",
        totalAmount: "25000",
        usedAmount: "12500",
        fiscalYear: "2023-24",
        category: "domiciliary"
      },
      {
        id: 2,
        name: "Chronic",
        description: "Long-term medication for chronic conditions",
        totalAmount: "15000",
        usedAmount: "3250",
        fiscalYear: "2023-24",
        category: "chronic"
      },
      {
        id: 3,
        name: "Hospitalization",
        description: "Emergency and in-patient treatment",
        totalAmount: "10000",
        usedAmount: "1800",
        fiscalYear: "2023-24",
        category: "hospitalization"
      }
    ];
    
    await this.db.collection('entitlements').insertMany(entitlements);
    
    // Create demo appointment
    const appointment = {
      id: 1,
      doctorName: "Dr. Mehra",
      specialization: "Cardiologist",
      location: "CISF Referral Hospital, Delhi",
      date: "2023-06-15",
      time: "10:30 AM",
      userId: 1
    };
    
    await this.db.collection('appointments').insertOne(appointment);
  }
  
  async getAllEntitlements() {
    if (!this.db) return [];
    
    const entitlements = await this.db.collection('entitlements').find().toArray();
    return entitlements;
  }
  
  async getEntitlementById(id) {
    if (!this.db) return undefined;
    
    const entitlement = await this.db.collection('entitlements').findOne({ id: Number(id) });
    return entitlement;
  }
  
  async updateEntitlement(id, entitlementData) {
    if (!this.db) return undefined;
    
    const updatedEntitlement = await this.db.collection('entitlements').findOneAndUpdate(
      { id: Number(id) },
      { $set: entitlementData },
      { returnDocument: 'after' }
    );
    
    return updatedEntitlement.value;
  }
  
  // Dashboard data
  async getDashboardData(userId) {
    if (!this.db) return undefined;
    
    const userClaims = await this.getClaimsByUserId(userId);
    const pendingClaims = userClaims.filter(claim => claim.status === "pending");
    const allEntitlements = await this.getAllEntitlements();
    
    // Get next appointment
    const appointments = await this.db.collection('appointments')
      .find({ userId: Number(userId) })
      .sort({ date: 1 })
      .limit(1)
      .toArray();
    
    const nextAppointment = appointments.length > 0 ? appointments[0] : null;
    
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
    
    // Trend analysis data for claims over time (last 6 months)
    const claimTrendData = [
      { period: "Jan", claims: 5700, approvals: 5200 },
      { period: "Feb", claims: 4400, approvals: 4100 },
      { period: "Mar", claims: 8500, approvals: 7500 },
      { period: "Apr", claims: 3800, approvals: 3500 },
      { period: "May", claims: 5400, approvals: 4800 },
      { period: "Jun", claims: 1800, approvals: 1200 }
    ];
    
    // Health metrics data (for radar chart)
    const healthMetricsData = [
      { category: "Regular Check-ups", value: 8, description: "Frequency of preventive health consultations" },
      { category: "Medication Adherence", value: 9, description: "Consistency in taking prescribed medications" },
      { category: "Chronic Management", value: 7, description: "How well chronic conditions are controlled" },
      { category: "Preventive Care", value: 6, description: "Participation in preventive health measures" },
      { category: "Wellness Activities", value: 5, description: "Engagement in fitness and wellness programs" },
      { category: "Mental Health", value: 8, description: "Status of emotional and mental wellbeing" }
    ];
    
    // Calculate health trend percentage (change from last quarter)
    const healthTrendPercentage = 5.2; // Positive trend in health metrics
    
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
    
    // Get real claim data for recent activity if exists
    if (userClaims.length > 0) {
      const sortedClaims = userClaims
        .sort((a, b) => new Date(b.submissionDate) - new Date(a.submissionDate))
        .slice(0, 5)
        .map((claim, idx) => ({
          id: claim.id,
          date: new Date(claim.submissionDate).toISOString().split('T')[0],
          description: claim.description,
          category: claim.category,
          amount: Number(claim.amount),
          status: claim.status
        }));
      
      if (sortedClaims.length > 0) {
        recentActivity.length = 0; // Clear default activity
        recentActivity.push(...sortedClaims);
      }
    }
    
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
      claimTrendData,
      healthMetricsData,
      healthTrendPercentage,
      recentActivity,
      // Target values for benchmarks
      claimTarget: 6000, // Monthly target/budget for claims
      overallHealthScore: 7.2 // Overall health score out of 10
    };
  }
}

// Export singleton instance
export const mongoStorage = new MongoStorage();