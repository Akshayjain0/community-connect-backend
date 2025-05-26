"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const mongoose_1 = __importStar(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const uuid_1 = require("uuid");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const InterestedDomainSchema = new mongoose_1.Schema({
    domain_id: { type: mongoose_1.Schema.Types.String, ref: "Domain", required: true },
    subdomain_ids: [{ type: mongoose_1.Schema.Types.String }], // Array of references to Subdomains
});
const VolunteerSchema = new mongoose_1.Schema({
    _id: { type: String, required: true, default: uuid_1.v4 }, // UUID
    fullName: { type: String, required: true },
    userName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    locality: { type: String, required: true },
    // location: { type: String, required: true },
    interested_domains: { type: [InterestedDomainSchema], default: [] },
    volunteer_status: { type: String, required: true },
    willing_to_work_in_other_domains: { type: Boolean, default: false },
    availability: { type: String, required: true },
    joined_projects: [{ type: mongoose_1.Schema.Types.String, ref: "Project" }],
    interested_projects: [{ type: mongoose_1.Schema.Types.String, ref: "Project" }], // UUIDs of projects
    profile_picture: {
        type: String,
        default: null,
        required: false,
    },
    refreshToken: { type: String },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});
VolunteerSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified("password"))
            return next();
        this.password = yield bcrypt_1.default.hash(this.password, 10);
        next();
    });
});
VolunteerSchema.methods.isPasswordCorrect = function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(password, this.password);
    });
};
VolunteerSchema.methods.generateAccessToken = function (role) {
    return jsonwebtoken_1.default.sign({
        _id: this._id,
        role: role,
        email: this.email,
        fullName: this.fullName,
    }, process.env.TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    });
};
VolunteerSchema.methods.generateRefreshToken = function (role) {
    return jsonwebtoken_1.default.sign({
        _id: this._id,
        role: role,
    }, process.env.TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    });
};
// Automatically remove sensitive fields from responses
VolunteerSchema.set("toJSON", {
    transform: function (_, ret) {
        delete ret.password;
        delete ret.refreshToken;
        return ret;
    },
});
const Volunteer = mongoose_1.default.model("Volunteer", VolunteerSchema);
exports.default = Volunteer;
