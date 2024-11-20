# useFileDrop Hook Documentation

## Overview

The `react-muntaha-uploader` hook provides an easy way to manage file uploads in React. It handles file selection, validation (based on file type and size), preview generation, base64 encoding, and allows for file removal. This hook supports both single and multiple file uploads, and provides useful metadata about the uploaded files.

---

## Parameters

The hook accepts a configuration object with the following properties:

### `allowedTypes` (Optional)

- **Type**: `AllowedFileType[]`
- **Description**: An array of allowed MIME types for the uploaded files.
- **Default**: `['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain', 'text/csv', 'video/mp4', 'video/webm', 'video/ogg']`

### `maxFileSize` (Optional)

- **Type**: `number`
- **Description**: Maximum allowed file size in bytes.
- **Default**: `10 * 1024 * 1024` (10MB)

### `multiple` (Optional)

- **Type**: `boolean`
- **Description**: Whether multiple files can be uploaded at once.
- **Default**: `false` (single file upload)

---

## Return Value

The hook returns an object with the following properties:

### `files`

- **Type**: `T extends true ? File[] : File | null`
- **Description**: The uploaded files.
- If `multiple` is `true`, it returns an array of `File` objects.
- If `multiple` is `false`, it returns a single `File` or `null`.

### `previewUrls`

- **Type**: `T extends true ? string[] : string | null`
- **Description**: The preview URLs for the uploaded files.
- If `multiple` is `true`, it returns an array of URLs.
- If `multiple` is `false`, it returns a single URL or `null`.

### `base64Data`

- **Type**: `T extends true ? string[] : string | null`
- **Description**: The base64-encoded data of the uploaded files.
- If `multiple` is `true`, it returns an array of base64 strings.
- If `multiple` is `false`, it returns a single base64 string or `null`.

### `error`

- **Type**: `string | null`
- **Description**: Any validation error message, or `null` if no errors.

### `handleFileChange`

- **Type**: `(event: React.ChangeEvent<HTMLInputElement>) => void`
- **Description**: Handler for file selection changes. It should be used to link to a file input element.

### `removeFile`

- **Type**: `(index?: number) => void`
- **Description**: Removes a file from the uploaded list.
- If `multiple` is `true`, the index of the file to be removed should be passed.
- If `multiple` is `false`, it clears the single file.

---

## Usage Example

### Single File Upload Example:

```tsx
import React from 'react'
import useFileDrop from 'react-muntaha-uploader'

const SingleFileUpload = () => {
  const { files, previewUrls, error, handleFileChange, removeFile } =
    useFileDrop({
      multiple: false,
    })

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      {error && <p>{error}</p>}
      {previewUrls && (
        <div>
          <img src={previewUrls} alt="Preview" width="100" />
          <button onClick={() => removeFile()}>Remove</button>
        </div>
      )}
    </div>
  )
}
```

### Multiple File Upload Example:

```tsx
import React from 'react'
import useFileDrop from 'react-muntaha-uploader'

const MultipleFileUpload = () => {
  const { files, previewUrls, error, handleFileChange, removeFile } =
    useFileDrop({
      multiple: true,
    })

  return (
    <div>
      <input type="file" multiple onChange={handleFileChange} />
      {error && <p>{error}</p>}
      <div>
        {previewUrls &&
          previewUrls.map((url, index) => (
            <div key={index}>
              <img src={url} alt={`Preview ${index}`} width="100" />
              <button onClick={() => removeFile(index)}>Remove</button>
            </div>
          ))}
      </div>
    </div>
  )
}
```
