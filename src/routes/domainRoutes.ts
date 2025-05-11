// routes/domain.routes.ts
import { Router } from "express";
import { auth } from "../middlewares/auth.middleware";
import {
	createDomain,
	deleteDomain,
	getDomainById,
	getDomains,
	updateDomain,
} from "../controllers/domainController";

const domainRouter = Router();

// 🔐 Admin-only middleware can replace `auth` here if needed

// Create one or many domains
domainRouter.post("/", auth, createDomain);

// Get all domains
domainRouter.get("/", getDomains);

// Get a single domain by ID
domainRouter.get("/:id", auth, getDomainById);

// Update domain by ID
domainRouter.put("/:id", auth, updateDomain);

// Delete domain by ID
domainRouter.delete("/:id", auth, deleteDomain);

export default domainRouter;
