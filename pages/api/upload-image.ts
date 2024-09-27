/* eslint-disable @typescript-eslint/no-explicit-any */
import multer from "multer";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import dotenv from "dotenv";
import streamifier from "streamifier";
import { RequestHandler } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
dotenv.config();
const storage = multer.memoryStorage();
const upload = multer({ storage });
const uploadMiddleware = upload.single("file");
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    secure: true,
});
function runMiddleware(req: any, res: any, fn: RequestHandler<ParamsDictionary, any, any, ParsedQs, Record<string, any>>) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result: unknown) => {
            if (result instanceof Error) {
                return reject(result);
            }
            return resolve(result);
        });
    });
}
export default async function handler(req: { file: { buffer: string | Buffer | Uint8Array; }; }, res: { status: (arg0: number) => {
     (): any; new(): any; json: { (arg0: UploadApiResponse | undefined): void; new(): any; }; }; }) {
    await runMiddleware(req, res, uploadMiddleware);
    console.log(req.file.buffer);
    const stream = await cloudinary.uploader.upload_stream(
        {
            folder: "plant-identifier",
        },
        (error, result) => {
            if (error) return console.error(error);
            res.status(200).json(result);
        }
    );
    streamifier.createReadStream(req.file.buffer).pipe(stream);
}
export const config = {
    api: {
        bodyParser: false,
    },
};
