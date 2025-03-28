import { createServer } from "http";
import { storage } from "./storage.js";
import { setupAuth } from "./auth.js";

export async function registerRoutes(app) {
  // Setup authentication routes
  setupAuth(app);

  // Officers API
  app.get("/api/officers", async (req, res) => {
    try {
      const officers = await storage.getAllOfficers();
      res.status(200).json(officers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch officers" });
    }
  });

  app.get("/api/officers/:id", async (req, res) => {
    try {
      const officer = await storage.getOfficerById(parseInt(req.params.id));
      if (!officer) {
        return res.status(404).json({ message: "Officer not found" });
      }
      res.status(200).json(officer);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch officer" });
    }
  });

  app.post("/api/officers", async (req, res) => {
    try {
      if (!req.isAuthenticated() || req.user.role !== "admin") {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const newOfficer = await storage.createOfficer(req.body);
      res.status(201).json(newOfficer);
    } catch (error) {
      res.status(500).json({ message: "Failed to create officer" });
    }
  });

  app.put("/api/officers/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated() || (req.user.role !== "admin" && req.user.id !== parseInt(req.params.id))) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const updatedOfficer = await storage.updateOfficer(parseInt(req.params.id), req.body);
      if (!updatedOfficer) {
        return res.status(404).json({ message: "Officer not found" });
      }
      res.status(200).json(updatedOfficer);
    } catch (error) {
      res.status(500).json({ message: "Failed to update officer" });
    }
  });

  app.delete("/api/officers/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated() || req.user.role !== "admin") {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const result = await storage.deleteOfficer(parseInt(req.params.id));
      if (!result) {
        return res.status(404).json({ message: "Officer not found" });
      }
      res.status(200).json({ message: "Officer deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete officer" });
    }
  });

  // Claims API
  app.get("/api/claims", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      let claims;
      if (req.user.role === "admin" || req.user.role === "medical-officer") {
        claims = await storage.getAllClaims();
      } else {
        claims = await storage.getClaimsByUserId(req.user.id);
      }
      res.status(200).json(claims);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch claims" });
    }
  });

  app.get("/api/claims/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const claim = await storage.getClaimById(parseInt(req.params.id));
      if (!claim) {
        return res.status(404).json({ message: "Claim not found" });
      }
      
      if (req.user.role !== "admin" && req.user.role !== "medical-officer" && claim.userId !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      res.status(200).json(claim);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch claim" });
    }
  });

  app.post("/api/claims", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      // Add Rupee symbol to doctor's name if it doesn't already have one
      let doctorName = req.body.doctorName;
      if (doctorName && !doctorName.startsWith('₹')) {
        doctorName = `₹${doctorName}`;
      }
      
      const claimData = {
        ...req.body,
        doctorName,
        userId: req.user.id,
        status: "pending",
        submissionDate: new Date()
      };
      
      const newClaim = await storage.createClaim(claimData);
      res.status(201).json(newClaim);
    } catch (error) {
      res.status(500).json({ message: "Failed to create claim" });
    }
  });

  app.put("/api/claims/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const claim = await storage.getClaimById(parseInt(req.params.id));
      if (!claim) {
        return res.status(404).json({ message: "Claim not found" });
      }
      
      // Only admins and medical officers can update the status
      if (req.body.status && req.user.role !== "admin" && req.user.role !== "medical-officer") {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      // Officers can only update their own claims and not the status
      if (claim.userId !== req.user.id && req.user.role !== "admin" && req.user.role !== "medical-officer") {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const updatedClaim = await storage.updateClaim(parseInt(req.params.id), req.body);
      res.status(200).json(updatedClaim);
    } catch (error) {
      res.status(500).json({ message: "Failed to update claim" });
    }
  });

  app.delete("/api/claims/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated() || req.user.role !== "admin") {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const result = await storage.deleteClaim(parseInt(req.params.id));
      if (!result) {
        return res.status(404).json({ message: "Claim not found" });
      }
      
      res.status(200).json({ message: "Claim deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete claim" });
    }
  });

  // Entitlements API
  app.get("/api/entitlements", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const entitlements = await storage.getAllEntitlements();
      res.status(200).json(entitlements);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch entitlements" });
    }
  });

  app.get("/api/entitlements/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const entitlement = await storage.getEntitlementById(parseInt(req.params.id));
      if (!entitlement) {
        return res.status(404).json({ message: "Entitlement not found" });
      }
      
      res.status(200).json(entitlement);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch entitlement" });
    }
  });

  app.put("/api/entitlements/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated() || req.user.role !== "admin") {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const updatedEntitlement = await storage.updateEntitlement(parseInt(req.params.id), req.body);
      if (!updatedEntitlement) {
        return res.status(404).json({ message: "Entitlement not found" });
      }
      
      res.status(200).json(updatedEntitlement);
    } catch (error) {
      res.status(500).json({ message: "Failed to update entitlement" });
    }
  });

  // User profile API
  app.get("/api/users/profile", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const userProfile = await storage.getUserProfile(req.user.id);
      res.status(200).json(userProfile);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user profile" });
    }
  });

  app.put("/api/users/profile", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const updatedProfile = await storage.updateUserProfile(req.user.id, req.body);
      res.status(200).json(updatedProfile);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user profile" });
    }
  });

  // Dashboard statistics API
  app.get("/api/dashboard", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const dashboardData = await storage.getDashboardData(req.user.id);
      res.status(200).json(dashboardData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}