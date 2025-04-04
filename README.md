# `useMuntahaDrop` Hook

A React hook for handling file uploads with drag-and-drop support, file validation, and upload progress tracking.

## Installation

```bash
npm i react-muntaha-uploader
```

## Import

```typescript
import { useMuntahaDrop } from 'react-muntaha-uploader'
```

## Basic Usage

```typescript
const { data, error, progress, onRemove, inputProps, rootProps } =
  useMuntahaDrop({
    accepts: ['image/*', 'application/pdf'],
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: true,
  })
```

## Return Values

| Property     | Type                       | Description                                         |
| ------------ | -------------------------- | --------------------------------------------------- |
| `data`       | `EnrichedArrayBuffer[]`    | Array of uploaded files with their ArrayBuffer data |
| `error`      | `string \| null`           | Current error message (if any)                      |
| `progress`   | `number \| null`           | Upload progress percentage (0-100)                  |
| `onRemove`   | `(index?: number) => void` | Function to remove file(s)                          |
| `inputProps` | `Object`                   | Props for the hidden file input element             |
| `rootProps`  | `Object`                   | Props for the drop zone container                   |

## Options

| Option     | Type                              | Default                   | Description                                     |
| ---------- | --------------------------------- | ------------------------- | ----------------------------------------------- |
| `accepts`  | `AcceptFileTypes[]`               | `["*"]`                   | Allowed file types (MIME types)                 |
| `minSize`  | `number`                          | -                         | Minimum file size in bytes                      |
| `maxSize`  | `number`                          | `10 * 1024 * 1024` (10MB) | Maximum file size in bytes                      |
| `maxFiles` | `number`                          | -                         | Maximum number of files (when `multiple: true`) |
| `multiple` | `boolean`                         | `false`                   | Allow multiple file selection                   |
| `disabled` | `boolean`                         | `false`                   | Disable the file upload                         |
| `onDrop`   | `(files: File[] \| File) => void` | -                         | Callback when files are dropped/selected        |

## Example Implementation

```tsx
import { useMuntahaDrop } from 'react-muntaha-uploader'

function FileUpload() {
  const { data, error, progress, onRemove, rootProps, inputProps } =
    useMuntahaDrop({
      accepts: ['image/*', 'application/pdf'],
      maxSize: 5 * 1024 * 1024,
      multiple: true,
    })

  return (
    <div {...rootProps} className="dropzone">
      <input {...inputProps} />

      {error && <div className="error">{error}</div>}

      {progress !== null && <progress value={progress} max="100" />}

      <div className="preview">
        {data.map((file, index) => (
          <div key={index} className="file-item">
            <span>{file.file.name}</span>
            <button onClick={() => onRemove(index)}>Remove</button>
          </div>
        ))}
      </div>

      <p>Drag files here or click to browse</p>
    </div>
  )
}
```

## Supported File Types

The hook supports all major file types through the `accepts` option:

- **Images**: `image/*`, `image/jpeg`, `image/png`, etc.
- **Videos**: `video/*`, `video/mp4`, `video/quicktime`, etc.
- **Audio**: `audio/*`, `audio/mpeg`, `audio/wav`, etc.
- **Documents**: `application/pdf`, `.docx`, `.xlsx`, etc.
- **Archives**: `.zip`, `.rar`, `.tar`, etc.
- **Code**: `.js`, `.ts`, `.py`, etc.

Use `"*"` to accept all file types.

## Validation

Files are validated against:

- File type (MIME type)
- Minimum size (if specified)
- Maximum size (default: 10MB)
- Maximum file count (when `multiple: true`)

## License

MIT
