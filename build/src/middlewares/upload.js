"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoUpload = exports.mediaUpload = exports.profileUpload = void 0;
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const aws_1 = __importDefault(require("../config/aws"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const profileUpload = (0, multer_1.default)({
    storage: (0, multer_s3_1.default)({
        s3: aws_1.default,
        bucket: process.env.AWS_BUCKET_NAME,
        contentType: multer_s3_1.default.AUTO_CONTENT_TYPE,
        key: function (req, file, cb) {
            cb(null, `volunteer-profile-pictures/${Date.now()}_${file.originalname}`);
        },
    }),
    fileFilter: function (req, file, cb) {
        const allowedTypes = ["image/jpeg", "image/png"];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error("Only JPG and PNG images are allowed for profiles"), false);
        }
    },
    limits: { fileSize: 5 * 1024 * 1024 },
});
exports.profileUpload = profileUpload;
const logoUpload = (0, multer_1.default)({
    storage: (0, multer_s3_1.default)({
        s3: aws_1.default,
        bucket: process.env.AWS_BUCKET_NAME,
        contentType: multer_s3_1.default.AUTO_CONTENT_TYPE,
        key: function (req, file, cb) {
            cb(null, `organizer-logos/${Date.now()}_${file.originalname}`);
        },
    }),
    fileFilter: function (req, file, cb) {
        const allowedTypes = ["image/jpeg", "image/png"];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error("Only JPG and PNG images are allowed for profiles"), false);
        }
    },
    limits: { fileSize: 5 * 1024 * 1024 },
});
exports.logoUpload = logoUpload;
const mediaUpload = (0, multer_1.default)({
    storage: (0, multer_s3_1.default)({
        s3: aws_1.default,
        bucket: process.env.AWS_BUCKET_NAME,
        acl: "public-read",
        contentType: multer_s3_1.default.AUTO_CONTENT_TYPE,
        key: function (req, file, cb) {
            cb(null, `uploads/${Date.now()}_${file.originalname}`);
        },
    }),
    fileFilter: function (req, file, cb) {
        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/gif",
            "video/mp4",
        ];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error("Invalid file type. Only images, GIFs, and MP4 videos are allowed"), false);
        }
    },
    limits: { fileSize: 50 * 1024 * 1024 },
});
exports.mediaUpload = mediaUpload;
