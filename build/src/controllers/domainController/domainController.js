"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDomain = exports.updateDomain = exports.getDomainById = exports.getDomains = exports.createDomain = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const zod_1 = require("zod");
const uuid_1 = require("uuid");
const http_errors_1 = __importDefault(require("http-errors"));
const domain_model_1 = __importDefault(require("../../models/domain.model"));
// Zod validation schemas
const SubdomainSchema = zod_1.z.object({
    sub_domain_name: zod_1.z.string().min(1, "Subdomain name is required"),
});
const DomainInputSchema = zod_1.z.object({
    domain_name: zod_1.z.string().min(1, "Domain name is required"),
    subdomains: zod_1.z.array(SubdomainSchema).optional(),
});
// Create one or many domains with subdomains
exports.createDomain = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const input = Array.isArray(req.body) ? req.body : [req.body];
    const validated = input.map((domainData) => DomainInputSchema.parse(domainData));
    // Check for duplicate domain names
    for (const domain of validated) {
        const exists = yield domain_model_1.default.findOne({
            domain_name: domain.domain_name,
        });
        if (exists)
            throw (0, http_errors_1.default)(409, `Domain '${domain.domain_name}' already exists`);
    }
    const formatted = validated.map((domain) => ({
        _id: (0, uuid_1.v4)(),
        domain_name: domain.domain_name,
        subdomains: (domain.subdomains || []).map((sd) => ({
            _id: (0, uuid_1.v4)(),
            sub_domain_name: sd.sub_domain_name,
        })),
    }));
    const created = yield domain_model_1.default.insertMany(formatted);
    res.status(201).json(created);
}));
// Get all domains with subdomains
exports.getDomains = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const domains = yield domain_model_1.default.find();
    res.status(200).json(domains);
}));
// Get a single domain by ID
exports.getDomainById = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const domainId = req.params.id;
    const domain = yield domain_model_1.default.findOne({ _id: domainId });
    if (!domain)
        throw (0, http_errors_1.default)(404, "Domain not found");
    res.status(200).json(domain);
}));
// Update domain name or subdomains
exports.updateDomain = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const domainId = req.params.id;
    const { domain_name, subdomains } = req.body;
    const domain = yield domain_model_1.default.findOne({ _id: domainId });
    if (!domain)
        throw (0, http_errors_1.default)(404, "Domain not found");
    if (domain_name)
        domain.domain_name = domain_name;
    if (subdomains) {
        domain.subdomains = subdomains.map((sd) => ({
            _id: sd.id || (0, uuid_1.v4)(),
            sub_domain_name: sd.sub_domain_name,
        }));
    }
    domain.updated_at = new Date();
    yield domain.save();
    res.status(200).json(domain);
}));
// Delete a domain
exports.deleteDomain = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const domainId = req.params.id;
    const result = yield domain_model_1.default.findOneAndDelete({ _id: domainId });
    if (!result)
        throw (0, http_errors_1.default)(404, "Domain not found");
    res.status(200).json({ message: "Domain deleted successfully" });
}));
