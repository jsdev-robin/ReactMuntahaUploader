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

### `DropState`

Return object from the hook:

| Property       | Type                       | Description                                        |
| -------------- | -------------------------- | -------------------------------------------------- |
| `data`         | `ArrayBuffer[]`            | Array of file data as ArrayBuffers                 |
| `progress`     | `Record<number, number>`   | Upload progress by file index                      |
| `isDragActive` | `boolean`                  | Whether files are being dragged over the drop zone |
| `onClick`      | `() => void`               | Function to trigger file selection                 |
| `onRemove`     | `(index?: number) => void` | Function to remove file(s)                         |
| `error`        | `string \| null`           | Current error message                              |
| `inputProps`   | `InputProps`               | Props for the hidden file input                    |
| `rootProps`    | `RootProps`                | Props for the root drop zone element               |

## Usage Example

```typescript
import { useMuntahaDrop } from 'react-muntaha-uploader'

function FileUpload() {
  const {
    data,
    progress,
    isDragActive,
    error,
    inputProps,
    rootProps
  } = useMuntahaDrop ({
    accept: ['image/*', 'application/pdf'],
    maxSize: 5 * 1024 * 1024, // 5MB
    maxFiles: 3,
    onDrop: (files) => console.log('Files dropped:', files),
    onError: (err) => console.error('Error:', err)
  });

  return (
    <div {...rootProps} style={{ border: isDragActive ? '2px dashed blue' : '2px dashed gray' }}>
      <input {...inputProps} />
      <p>Drag and drop files here or click to select</p>
      {error && <div className="error">{error}</div>}
      <div>
        {Object.entries(progress).map(([index, percent]) => (
          <div key={index}>
            File {index}: {percent}%
          </div>
        ))}
      </div>
    </div>
  );
}
```
