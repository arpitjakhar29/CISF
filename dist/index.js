// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
import session from "express-session";
import createMemoryStore from "memorystore";
var MemoryStore = createMemoryStore(session);
var MemStorage = class {
  users;
  officers;
  claims;
  entitlements;
  userProfiles;
  appointments;
  sessionStore;
  currentUserId;
  currentOfficerId;
  currentClaimId;
  currentEntitlementId;
  currentAppointmentId;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.officers = /* @__PURE__ */ new Map();
    this.claims = /* @__PURE__ */ new Map();
    this.entitlements = /* @__PURE__ */ new Map();
    this.userProfiles = /* @__PURE__ */ new Map();
    this.appointments = /* @__PURE__ */ new Map();
    this.currentUserId = 1;
    this.currentOfficerId = 1;
    this.currentClaimId = 1;
    this.currentEntitlementId = 1;
    this.currentAppointmentId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 864e5
      // 24 hours
    });
    this.initializeDemoData();
  }
  initializeDemoData() {
    const domiciliaryEntitlement = {
      id: this.currentEntitlementId++,
      name: "Domiciliary",
      description: "Regular outpatient expenses and medications",
      totalAmount: 25e3,
      usedAmount: 12500,
      fiscalYear: "2023-24",
      category: "domiciliary"
    };
    const chronicEntitlement = {
      id: this.currentEntitlementId++,
      name: "Chronic",
      description: "Long-term medication for chronic conditions",
      totalAmount: 15e3,
      usedAmount: 3250,
      fiscalYear: "2023-24",
      category: "chronic"
    };
    const hospitalizationEntitlement = {
      id: this.currentEntitlementId++,
      name: "Hospitalization",
      description: "Emergency and in-patient treatment",
      totalAmount: 1e4,
      usedAmount: 1800,
      fiscalYear: "2023-24",
      category: "hospitalization"
    };
    this.entitlements.set(domiciliaryEntitlement.id, domiciliaryEntitlement);
    this.entitlements.set(chronicEntitlement.id, chronicEntitlement);
    this.entitlements.set(hospitalizationEntitlement.id, hospitalizationEntitlement);
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
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async createUser(insertUser) {
    const id = this.currentUserId++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    const profile = {
      userId: id,
      name: "CISF Officer",
      contactNumber: "9876543210",
      email: insertUser.username + "@example.com",
      officerId: `CISF-${1e3 + id}`,
      address: "CISF Quarters, Sector 21, New Delhi",
      dateOfBirth: "1985-05-15",
      bloodGroup: "O+",
      rank: "Inspector",
      joiningDate: "2010-01-15"
    };
    this.userProfiles.set(id, profile);
    const officer = {
      id,
      userId: id,
      name: "CISF Officer",
      rank: "Inspector",
      officerId: `CISF-${1e3 + id}`,
      station: "Delhi",
      joiningDate: "2010-01-15",
      contactNumber: "9876543210",
      email: insertUser.username + "@example.com"
    };
    this.officers.set(id, officer);
    return user;
  }
  async updateUser(id, userData) {
    const user = this.users.get(id);
    if (!user) return void 0;
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  async getUserProfile(id) {
    return this.userProfiles.get(id);
  }
  async updateUserProfile(id, profileData) {
    const profile = this.userProfiles.get(id);
    if (!profile) return void 0;
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
    const newOfficer = { ...officer, id };
    this.officers.set(id, newOfficer);
    return newOfficer;
  }
  async updateOfficer(id, officerData) {
    const officer = this.officers.get(id);
    if (!officer) return void 0;
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
    return Array.from(this.claims.values()).filter((claim) => claim.userId === userId);
  }
  async getClaimById(id) {
    return this.claims.get(id);
  }
  async createClaim(claim) {
    const id = this.currentClaimId++;
    const newClaim = { ...claim, id };
    this.claims.set(id, newClaim);
    const entitlement = Array.from(this.entitlements.values()).find((ent) => ent.category === claim.category);
    if (entitlement) {
      entitlement.usedAmount += claim.amount;
      this.entitlements.set(entitlement.id, entitlement);
    }
    return newClaim;
  }
  async updateClaim(id, claimData) {
    const claim = this.claims.get(id);
    if (!claim) return void 0;
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
    if (!entitlement) return void 0;
    const updatedEntitlement = { ...entitlement, ...entitlementData };
    this.entitlements.set(id, updatedEntitlement);
    return updatedEntitlement;
  }
  async getDashboardData(userId) {
    const userClaims = await this.getClaimsByUserId(userId);
    const pendingClaims = userClaims.filter((claim) => claim.status === "pending");
    const allEntitlements = await this.getAllEntitlements();
    const nextAppointment = Array.from(this.appointments.values()).filter((app2) => app2.userId === userId).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
    const totalEntitlement = allEntitlements.reduce((sum, ent) => sum + ent.totalAmount, 0);
    const usedEntitlement = allEntitlements.reduce((sum, ent) => sum + ent.usedAmount, 0);
    const availableBalance = totalEntitlement - usedEntitlement;
    const monthlyClaimsData = [
      { month: "Jan", domiciliary: 4500, chronic: 1200, hospitalization: 0 },
      { month: "Feb", domiciliary: 3200, chronic: 1200, hospitalization: 0 },
      { month: "Mar", domiciliary: 6500, chronic: 1200, hospitalization: 800 },
      { month: "Apr", domiciliary: 2800, chronic: 0, hospitalization: 1e3 },
      { month: "May", domiciliary: 4200, chronic: 1200, hospitalization: 0 },
      { month: "Jun", domiciliary: 0, chronic: 0, hospitalization: 1800 }
    ];
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
};
var storage = new MemStorage();

// server/auth.ts
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session2 from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
var scryptAsync = promisify(scrypt);
async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString("hex")}.${salt}`;
}
async function comparePasswords(supplied, stored) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = await scryptAsync(supplied, salt, 64);
  return timingSafeEqual(hashedBuf, suppliedBuf);
}
function setupAuth(app2) {
  const sessionSettings = {
    secret: process.env.SESSION_SECRET || "cisf-medical-system-secret",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1e3,
      // 30 days
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax"
    }
  };
  app2.set("trust proxy", 1);
  app2.use(session2(sessionSettings));
  app2.use(passport.initialize());
  app2.use(passport.session());
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user || !await comparePasswords(password, user.password)) {
          return done(null, false);
        } else {
          return done(null, user);
        }
      } catch (error) {
        return done(error);
      }
    })
  );
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
  app2.post("/api/register", async (req, res, next) => {
    try {
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).send("Username already exists");
      }
      const user = await storage.createUser({
        ...req.body,
        password: await hashPassword(req.body.password)
      });
      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json(user);
      });
    } catch (error) {
      next(error);
    }
  });
  app2.post("/api/login", passport.authenticate("local"), (req, res) => {
    res.status(200).json(req.user);
  });
  app2.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });
  app2.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json(req.user);
  });
}

// server/routes.ts
async function registerRoutes(app2) {
  setupAuth(app2);
  app2.get("/api/officers", async (req, res) => {
    try {
      const officers = await storage.getAllOfficers();
      res.status(200).json(officers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch officers" });
    }
  });
  app2.get("/api/officers/:id", async (req, res) => {
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
  app2.post("/api/officers", async (req, res) => {
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
  app2.put("/api/officers/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated() || req.user.role !== "admin" && req.user.id !== parseInt(req.params.id)) {
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
  app2.delete("/api/officers/:id", async (req, res) => {
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
  app2.get("/api/claims", async (req, res) => {
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
  app2.get("/api/claims/:id", async (req, res) => {
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
  app2.post("/api/claims", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const claimData = {
        ...req.body,
        userId: req.user.id,
        status: "pending",
        submissionDate: (/* @__PURE__ */ new Date()).toISOString()
      };
      const newClaim = await storage.createClaim(claimData);
      res.status(201).json(newClaim);
    } catch (error) {
      res.status(500).json({ message: "Failed to create claim" });
    }
  });
  app2.put("/api/claims/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const claim = await storage.getClaimById(parseInt(req.params.id));
      if (!claim) {
        return res.status(404).json({ message: "Claim not found" });
      }
      if (req.body.status && req.user.role !== "admin" && req.user.role !== "medical-officer") {
        return res.status(403).json({ message: "Forbidden" });
      }
      if (claim.userId !== req.user.id && req.user.role !== "admin" && req.user.role !== "medical-officer") {
        return res.status(403).json({ message: "Forbidden" });
      }
      const updatedClaim = await storage.updateClaim(parseInt(req.params.id), req.body);
      res.status(200).json(updatedClaim);
    } catch (error) {
      res.status(500).json({ message: "Failed to update claim" });
    }
  });
  app2.delete("/api/claims/:id", async (req, res) => {
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
  app2.get("/api/entitlements", async (req, res) => {
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
  app2.get("/api/entitlements/:id", async (req, res) => {
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
  app2.put("/api/entitlements/:id", async (req, res) => {
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
  app2.get("/api/users/profile", async (req, res) => {
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
  app2.put("/api/users/profile", async (req, res) => {
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
  app2.get("/api/dashboard", async (req, res) => {
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
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2, { dirname as dirname2 } from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path, { dirname } from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets")
    }
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = dirname2(__filename2);
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        __dirname2,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(__dirname2, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
