import multer from "multer";
import multerS3 from "multer-s3";
import s3 from "../config/aws";
import { S3 } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();

const profileUpload = multer({
	storage: multerS3({
		s3: s3 as unknown as S3,
		bucket: process.env.AWS_BUCKET_NAME!,
		contentType: multerS3.AUTO_CONTENT_TYPE,
		key: function (req, file, cb) {
			cb(
				null,
				`volunteer-profile-pictures/${Date.now()}_${file.originalname}`
			);
		},
	}),
	fileFilter: function (req, file, cb) {
		const allowedTypes = ["image/jpeg", "image/png"];
		if (allowedTypes.includes(file.mimetype)) {
			cb(null, true);
		} else {
			cb(
				new Error(
					"Only JPG and PNG images are allowed for profiles"
				) as unknown as null,
				false
			);
		}
	},
	limits: { fileSize: 5 * 1024 * 1024 },
});

const logoUpload = multer({
	storage: multerS3({
		s3: s3 as unknown as S3,
		bucket: process.env.AWS_BUCKET_NAME!,
		contentType: multerS3.AUTO_CONTENT_TYPE,
		key: function (req, file, cb) {
			cb(null, `organizer-logos/${Date.now()}_${file.originalname}`);
		},
	}),
	fileFilter: function (req, file, cb) {
		const allowedTypes = ["image/jpeg", "image/png"];
		if (allowedTypes.includes(file.mimetype)) {
			cb(null, true);
		} else {
			cb(
				new Error(
					"Only JPG and PNG images are allowed for profiles"
				) as unknown as null,
				false
			);
		}
	},
	limits: { fileSize: 5 * 1024 * 1024 },
});

const mediaUpload = multer({
	storage: multerS3({
		s3: s3 as unknown as S3,
		bucket: process.env.AWS_BUCKET_NAME!,
		acl: "public-read",
		contentType: multerS3.AUTO_CONTENT_TYPE,
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
		} else {
			cb(
				new Error(
					"Invalid file type. Only images, GIFs, and MP4 videos are allowed"
				) as unknown as null,
				false
			);
		}
	},
	limits: { fileSize: 50 * 1024 * 1024 },
});

export { profileUpload, mediaUpload, logoUpload };
