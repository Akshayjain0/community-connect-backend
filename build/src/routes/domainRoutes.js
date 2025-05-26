"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// routes/domain.routes.ts
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const domainController_1 = require("../controllers/domainController");
const domainRouter = (0, express_1.Router)();
// 🔐 Admin-only middleware can replace `auth` here if needed
// Create one or many domains
domainRouter.post("/", auth_middleware_1.auth, domainController_1.createDomain);
// Get all domains
domainRouter.get("/", domainController_1.getDomains);
// Get a single domain by ID
domainRouter.get("/:id", auth_middleware_1.auth, domainController_1.getDomainById);
// Update domain by ID
domainRouter.put("/:id", auth_middleware_1.auth, domainController_1.updateDomain);
// Delete domain by ID
domainRouter.delete("/:id", auth_middleware_1.auth, domainController_1.deleteDomain);
exports.default = domainRouter;
