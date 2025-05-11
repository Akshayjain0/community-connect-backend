// controllers/projectController.ts
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

import createError from "http-errors";
import Domain from "../../models/domain.model";

// Zod validation schemas
const SubdomainSchema = z.object({
	sub_domain_name: z.string().min(1, "Subdomain name is required"),
});

const DomainInputSchema = z.object({
	domain_name: z.string().min(1, "Domain name is required"),
	subdomains: z.array(SubdomainSchema).optional(),
});

// Create one or many domains with subdomains
export const createDomain = asyncHandler(
	async (req: Request, res: Response) => {
		const input = Array.isArray(req.body) ? req.body : [req.body];

		const validated = input.map((domainData) =>
			DomainInputSchema.parse(domainData)
		);

		// Check for duplicate domain names
		for (const domain of validated) {
			const exists = await Domain.findOne({
				domain_name: domain.domain_name,
			});
			if (exists)
				throw createError(
					409,
					`Domain '${domain.domain_name}' already exists`
				);
		}

		const formatted = validated.map((domain) => ({
			_id: uuidv4(),
			domain_name: domain.domain_name,
			subdomains: (domain.subdomains || []).map((sd) => ({
				_id: uuidv4(),
				sub_domain_name: sd.sub_domain_name,
			})),
		}));

		const created = await Domain.insertMany(formatted);
		res.status(201).json(created);
	}
);

// Get all domains with subdomains
export const getDomains = asyncHandler(async (req: Request, res: Response) => {
	const domains = await Domain.find();
	res.status(200).json(domains);
});

// Get a single domain by ID
export const getDomainById = asyncHandler(
	async (req: Request, res: Response) => {
		const domainId = req.params.id;
		const domain = await Domain.findOne({ _id: domainId });
		if (!domain) throw createError(404, "Domain not found");
		res.status(200).json(domain);
	}
);

// Update domain name or subdomains
export const updateDomain = asyncHandler(
	async (req: Request, res: Response) => {
		const domainId = req.params.id;
		const { domain_name, subdomains } = req.body;

		const domain = await Domain.findOne({ _id: domainId });
		if (!domain) throw createError(404, "Domain not found");

		if (domain_name) domain.domain_name = domain_name;
		if (subdomains) {
			domain.subdomains = subdomains.map((sd: any) => ({
				_id: sd.id || uuidv4(),
				sub_domain_name: sd.sub_domain_name,
			}));
		}

		domain.updated_at = new Date();
		await domain.save();
		res.status(200).json(domain);
	}
);

// Delete a domain
export const deleteDomain = asyncHandler(
	async (req: Request, res: Response) => {
		const domainId = req.params.id;
		const result = await Domain.findOneAndDelete({ _id: domainId });

		if (!result) throw createError(404, "Domain not found");
		res.status(200).json({ message: "Domain deleted successfully" });
	}
);
