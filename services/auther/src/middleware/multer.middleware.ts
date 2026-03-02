import multer from "multer";

const storage = multer.memoryStorage();
const uploader = multer({ storage });

const uploadFile = uploader.single("file");
const uploadContentImages = uploader.array("files", 10);

export default uploadFile;
export { uploadContentImages };