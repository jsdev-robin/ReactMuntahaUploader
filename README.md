# useMuntahaDrop Hook

![File Upload](https://img.icons8.com/fluency/48/000000/upload--v1.png)  
_A React hook for professional-grade file uploads with drag-and-drop, validation, and progress tracking_

---

## 🚀 Features

| Feature                | Description                                                       |
| ---------------------- | ----------------------------------------------------------------- |
| **Large File Support** | Handles multi-GB files with chunked reading and progress tracking |
| **Smart Validation**   | 150+ MIME types, size limits, and max files enforcement           |
| **Dual Upload Modes**  | Drag-and-drop + traditional file selector                         |
| **Real-time Feedback** | Progress percentages for each file                                |
| **Error Resilient**    | Clear error messages for invalid files                            |

## 💡 Perfect For

- Cloud storage applications
- Media uploads (4K videos, RAW images)
- Bulk document processing
- Enterprise file transfer systems

---

## Features

- Drag and drop file uploads
- File selection via input
- File type validation
- File size validation (min/max)
- Multiple file support
- Upload progress tracking
- Error handling

## Type Definitions

### `Accept`

A union type representing all acceptable file MIME types, including:

- Images (`image/*`, `image/png`, `image/jpeg`, etc.)
- Videos (`video/*`, `video/mp4`, `video/quicktime`, etc.)
- Audio (`audio/*`, `audio/mp3`, `audio/wav`, etc.)
- Documents (`application/pdf`, `text/plain`, `application/json`, etc.)
- Archives (`application/zip`, `application/x-rar-compressed`, etc.)
- Fonts (`font/ttf`, `font/woff2`, etc.)
- Programming files (`application/javascript`, `application/typescript`, etc.)

### `PropTypes`

Configuration options for the hook:

| Property   | Type       | Default | Description                              |
| ---------- | ---------- | ------- | ---------------------------------------- |
| `accept`   | `Accept[]` | `["*"]` | Allowed file types                       |
| `minSize`  | `number`   | -       | Minimum file size in bytes               |
| `maxSize`  | `number`   | -       | Maximum file size in bytes               |
| `maxFiles` | `number`   | -       | Maximum number of files                  |
| `multiple` | `boolean`  | `true`  | Allow multiple files                     |
| `disabled` | `boolean`  | `false` | Disable the drop zone                    |
| `onDrop`   | `function` | -       | Callback when files are dropped/selected |
| `onError`  | `function` | -       | Error callback                           |

### `Data`

```typescript
interface EnrichedArrayBuffer {
  buffer: ArrayBuffer
  file: File
}
```

### `DropState`

Return object from the hook:

| Property       | Type                            | Description                                        |
| -------------- | ------------------------------- | -------------------------------------------------- |
| `getFile`      | `File[] \| null`                | Array of file data as File List                    |
| `getData`      | `EnrichedArrayBuffer[] \| null` | Array of file data as ArrayBuffers                 |
| `getProgress`  | `Record<number, number>`        | Upload progress by file index                      |
| `isDragActive` | `boolean`                       | Whether files are being dragged over the drop zone |
| `onClick`      | `() => void`                    | Function to trigger file selection                 |
| `onRemove`     | `(index?: number) => void`      | Function to remove file(s)                         |
| `error`        | `string \| null`                | Current error message                              |
| `inputProps`   | `InputProps`                    | Props for the hidden file input                    |
| `rootProps`    | `RootProps`                     | Props for the root drop zone element               |

## Simple Example

```typescript
import { useMuntahaDrop } from 'react-muntaha-uploader'

function FileUpload() {
  const {
    inputProps,
    rootProps,
  } = useMuntahaDrop({
    accept: ['image/*', 'application/pdf'],
    maxSize: 5 * 1024 * 1024, // 5MB
    maxFiles: 3,
    onDrop: (files) => console.log('Files dropped:', files),
    onError: (err) => console.error('Error:', err),
  });

  return (
    <div {...rootProps}>
      <input {...inputProps} />
      <p>Drag and drop files here or click to select</p>
    </div>
  );
}


```

## Usage Example

```typescript
import { useMuntahaDrop } from 'react-muntaha-uploader'

function FileUpload() {
  const {
    isDragActive,
    error,
    onClick,
    onRemove,
    getFile,
    getData,
    getProgress,
    inputProps,
    rootProps,
  } = useMuntahaDrop({
    accept: ['image/*', 'application/pdf'],
    maxSize: 5 * 1024 * 1024, // 5MB
    maxFiles: 3,
    onDrop: (files) => console.log('Files dropped:', files),
    onError: (err) => console.error('Error:', err),
  });

  const files = getFile() ?? [];
  const progress = getProgress() ?? {};

  return (
    <div
      {...rootProps}
      className={cn(
        "border-2 p-4 rounded-md transition-colors",
        isDragActive ? "border-blue-500" : "border-gray-300"
      )}
      onClick={onClick}
    >
      <input {...inputProps} />
      <p className="mb-2 text-sm text-gray-500">Drag and drop files here or click to select</p>

      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}

      <div className="space-y-2">
        {files.map((file, index) => (
          <div key={index} className="flex items-center justify-between gap-2">
            <span className="text-sm">{file.name}</span>
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="text-xs text-red-500 hover:underline"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {getProgress() &&
        Object.entries(getProgress()).map(([key, value]) => (
          <Progress
            key={key}
            value={value}
            className={cn("mt-2", {
              "bg-green-500": value === 100,
            })}
          />
        ))}
    </div>
  );
}


```
