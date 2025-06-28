# react-muntaha-uploader

A flexible, feature-rich React hook for robust file uploads with drag-and-drop, folder support, validation, progress tracking, abort, and more.

## Features

- **Drag-and-drop** file uploads
- **Folder upload** (with browser support)
- **Single or multiple file selection**
- **MIME type** and **file size validation**
- **Progress tracking** for reads
- **Abort**able reads
- **ArrayBuffer** support for binary reads
- **Keyboard accessibility**
- **Error handling** and callbacks
- **Accessible** attributes for screen readers

## Installation

```bash
npm install react-muntaha-uploader
# or
yarn add react-muntaha-uploader
```

## Quick Start

```jsx
'use client'

import React from 'react'
import { useMuntahaDrop } from 'react-muntaha-uploader'

export default function MyUploader() {
  const {
    files,
    progress,
    error,
    isDragActive,
    onDelete,
    abortUpload,
    getRootProps,
    getInputProps,
    status,
    utils,
  } = useMuntahaDrop({
    accept: ['image/*', 'application/pdf'],
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: true,
    isArrayBuffer: false,
    onDrop: (files) => {
      console.log('Files dropped:', files)
    },
    onError: (err) => {
      if (err) alert(err)
    },
    enableFolderUpload: true,
  })

  return (
    <div
      {...getRootProps()}
      style={{
        border: '2px dashed #aaa',
        padding: 32,
        background: isDragActive ? '#eef' : '#fff',
      }}
    >
      <input {...getInputProps()} />
      <p>
        {isDragActive ? 'Drop files here...' : 'Drag files, or click to select'}
      </p>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {status === 'reading' && <div>Uploading...</div>}
      {Array.isArray(files) && files.length > 0 && (
        <ul>
          {files.map((file, idx) => (
            <li key={idx}>
              {file.name} ({(file.size / 1024).toFixed(1)} KB)
              <button onClick={() => onDelete(idx)}>Delete</button>
              <span> Progress: {progress[idx] || 0}%</span>
            </li>
          ))}
        </ul>
      )}
      <button onClick={abortUpload}>Abort Upload</button>
      <button onClick={utils.reset}>Reset</button>
    </div>
  )
}
```

---

## API

### `useMuntahaDrop<T extends boolean = true>(options?: DropZoneOptions<T>): EnhancedDropZoneState<T>`

A React hook for handling file drops with advanced features.

#### Options (`DropZoneOptions<T>`)

| Name                 | Type                   | Default | Description                                               |
| -------------------- | ---------------------- | ------- | --------------------------------------------------------- |
| `accept`             | `MimeType[]`           | `['*']` | Allowed mime types (see below for all values)             |
| `minSize`            | `number`               | —       | Minimum file size in bytes                                |
| `maxSize`            | `number`               | —       | Maximum file size in bytes                                |
| `maxFiles`           | `number`               | —       | Max files allowed (only for `multiple: true`)             |
| `multiple`           | `boolean`              | `true`  | Allow multiple file selection                             |
| `disabled`           | `boolean`              | `false` | Disable the dropzone                                      |
| `isArrayBuffer`      | `boolean`              | `false` | If true, reads files as ArrayBuffer instead of File       |
| `onDrop`             | `(files) => void`      | —       | Called when files are dropped or selected                 |
| `onError`            | `(err: string\| null)` | —       | Called on error events                                    |
| `enableFolderUpload` | `boolean`              | `false` | Allow selecting entire folders (browser support required) |
| `enableKeyboard`     | `boolean`              | `true`  | Enable keyboard navigation for dropzone                   |

#### Return Value (`EnhancedDropZoneState<T>`)

| Name            | Type                                          | Description                                               |
| --------------- | --------------------------------------------- | --------------------------------------------------------- |
| `files`         | `File[]` or `File\| null`                     | Current file(s)                                           |
| `arrayBuffer`   | `ArrayBuffer[]` or `ArrayBuffer\| null`       | Read file data (when `isArrayBuffer: true`)               |
| `progress`      | `number` or `Record<number,number>`           | Upload progress per file or overall                       |
| `error`         | `string \| null`                              | Error message, if any                                     |
| `isDragActive`  | `boolean`                                     | If a file is currently being dragged over the dropzone    |
| `onDelete`      | `(index?: number) => void`                    | Remove a file by index or all                             |
| `abortUpload`   | `() => void`                                  | Abort all current uploads                                 |
| `status`        | `'idle' \| 'reading' \| 'aborted' \| 'error'` | Current upload status                                     |
| `getRootProps`  | `() => DropZoneRootProps`                     | Props for root dropzone element (spread onto `<div>`)     |
| `getInputProps` | `() => DropZoneInputProps`                    | Props for `<input type="file" />` (spread onto `<input>`) |
| `utils`         | `{ getFile, getData, getProgress, reset }`    | Utility functions                                         |

---

### Utility Functions (from `utils`)

- `getFile(index?: number)`: Get file(s) by index or all.
- `getData(index?: number)`: Get ArrayBuffer(s) by index or all.
- `getProgress(index?: number)`: Get progress by index or all.
- `reset()`: Reset input and state.

---

## MIME Type List

`accept` can be any of:

- `image/*`, `video/*`, `audio/*`, `application/pdf`, `application/zip`, etc.
- [Full list of supported MIME types here...](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types)

---

## Accessibility

- The root dropzone is keyboard accessible (role="button", tabIndex=0).
- ARIA attributes for drag state and errors.
- Input is hidden but accessible to assistive technologies.

---

## License

MIT

---

## Credits

Created and maintained by [@jsdev-robin](https://github.com/jsdev-robin)
