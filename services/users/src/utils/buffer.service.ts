import path from "path"
import DataUriParser from "datauri/parser.js";

const parser = new DataUriParser();

const getBuffer = (file: Express.Multer.File) => {
  const extName = path.extname(file.originalname);
  return parser.format(extName, file.buffer).content;
};

export default getBuffer;
