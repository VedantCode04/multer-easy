
# Multer Easy

A utility for handling file uploads with multer and custom options.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
- [Contributing](#contributing)
- [License](#license)

## Installation

To install this package, run:

```bash
npm install multer-easy
```

## Usage

Here's a quick example of how to use `multer-easy` in an Express application:

```javascript
const express = require("express");
const { uploadDisk } = require("multer-easy");

const app = express();
const upload = uploadDisk({ path: "public/uploads/image" });

app.post("/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).send("No file uploaded.");
    }
    res.send(`File uploaded successfully: ${req.file.path}`);
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
```

## API

## `uploadDisk(options)`

Configures a disk storage upload middleware using `multer`.

### Options

| Option            | Type               | Required | Description                                                                                           |
|-------------------|--------------------|----------|-------------------------------------------------------------------------------------------------------|
| `path`            | String or Function | Yes    | The destination path where files will be stored. Can be a static path or a function that returns a path based on the request and file. |
| `fileName`        | Function    | Optional |To give name of the uploaded file. If provided as a function, it receives the request and file objects and should return the desired filename. If not specified, a default filename will be generated using `cuid` and the original filename to maintain uniqueness. |
| `acceptedFileTypes` | Array            | Optional       | An array of MIME types that are accepted for upload. If the uploaded file's type does not match, an error will be returned. |
| `maxSize`        | String             | Optional       | The maximum file size allowed (e.g., "5mb"). Defaults to "5mb" if not specified.  Example Usage: "1b", "1kb", "1mb", "1gb"     |
| `maxFiles`       | Number             | Optional       | The maximum number of files that can be uploaded. Defaults to `1`.                     |

The `path` function can be defined in the following format:

```javascript
path: (req, file) => {
  // Your logic to determine the destination path
  return 'path/to/destination';
}
```
The `fileName` function can be defined in the following format, if not, then it will use `cuid`+`_file name` to maintain uniqueness of the filename in the database:
```javascript
fileName: (req, file) => {
  // Your logic to determine the filename
  return <filename>;
}
```

### Example

```javascript
const upload = uploadDisk({
  path: 'public/uploads/images',
  acceptedFileTypes: ['image/png', 'image/jpeg'],
  maxSize: '5mb',
  maxFiles: 1,
  fileName: (req, file) => {
    return `${cuid()}_${file.originalname}`; // Custom filename logic
  },
});

```

## `uploadMemory(options)`

Creates a multer middleware for memory storage.

### Options

| Option            | Type               | Required | Description                                                                                           |
|-------------------|--------------------|----------|-------------------------------------------------------------------------------------------------------|
| `acceptedFileTypes` | Array            | Optional       |An array of MIME types that are accepted for upload. If the uploaded file's type does not match, an error will be returned. |
| `maxSize`        | String             | Optional       |The maximum file size allowed (e.g., "5mb"). Defaults to "5mb" if not specified.  Example Usage: "1b", "1kb", "1mb", "1gb"     |
| `maxFiles`       | Number             | Optional       |The maximum number of files that can be uploaded. Defaults to `1`.                    |

### Example

```javascript
const upload = uploadMemory({
  acceptedFileTypes: ['image/png', 'image/jpeg'],
  maxSize: '5mb',
  maxFiles: 1,
});

```

## Note on Upload Functions

Both the `uploadDisk` and `uploadMemory` functions utilize Multer internally, enabling support for various upload methods such as `single`, `array`, `fields`, and more which are supported by the `multer` itself so use that as you were using `multer`. This allows you to seamlessly handle different types of file uploads, whether saving files to disk or storing them in memory.



## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
