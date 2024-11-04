import multer from "multer";
import cuid from "cuid";

// Utility to parse file size strings into bytes
export const parseFileSize = (sizeStr) => {
  const sizeRegex = /^(\d+)(b|kb|mb|gb)$/i;
  const match = sizeStr.match(sizeRegex);

  if (!match) {
    throw new Error("Invalid size format. Use 'b', 'kb', 'mb', or 'gb'.");
  }

  const sizeValue = parseInt(match[1], 10);
  const unit = match[2].toLowerCase();

  switch (unit) {
    case "b":
      return sizeValue;
    case "kb":
      return sizeValue * 1024;
    case "mb":
      return sizeValue * 1024 * 1024;
    case "gb":
      return sizeValue * 1024 * 1024 * 1024;
    default:
      throw new Error("Invalid size unit.");
  }
};

// Creates a file filter based on accepted MIME types
export const createFileFilter = (acceptedFileTypes = []) => {
  return (req, file, cb) => {
    const mimeType = file.mimetype;
    if (acceptedFileTypes.length > 0 && !acceptedFileTypes.includes(mimeType)) {
      return cb(
        new Error(
          `File type not accepted. Allowed types: ${acceptedFileTypes.join(
            ", "
          )}`
        ),
        false
      );
    }
    cb(null, true); // Accept the file
  };
};

// Configures disk storage options for multer
export const createDiskStorage = ({ path, fileName }) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      try {
        const destinationPath =
          typeof path === "function" ? path(req, file) : path;
        cb(null, destinationPath);
      } catch (error) {
        cb(error);
      }
    },
    filename: (req, file, cb) => {
      try {
        const filename =
          typeof fileName === "function"
            ? fileName(req, file)
            : `${cuid()}_${file.originalname}`;
        cb(null, filename);
      } catch (error) {
        cb(error);
      }
    },
  });
};

// Disk upload configuration
export const uploadDisk = (options = {}) => {
  const {
    path,
    fileName = null,
    acceptedFileTypes = [],
    maxSize = "5mb",
    maxFiles = 1,
  } = options;

  if (!path) {
    throw new Error("The 'path' option is required.");
  }

  const maxFileSize = parseFileSize(maxSize);

  return multer({
    storage: createDiskStorage({ path, fileName }),
    fileFilter: createFileFilter(acceptedFileTypes),
    limits: {
      fileSize: maxFileSize,
      files: maxFiles,
    },
  });
};

// Memory upload configuration
export const uploadMemory = (options = {}) => {
  const { acceptedFileTypes = [], maxSize = "5mb", maxFiles = 1 } = options;

  const maxFileSize = parseFileSize(maxSize);

  return multer({
    storage: multer.memoryStorage(),
    fileFilter: createFileFilter(acceptedFileTypes),
    limits: {
      fileSize: maxFileSize,
      files: maxFiles,
    },
  });
};
