import { useState, useCallback, useRef, MutableRefObject } from 'react'

/**
 * Allowed file types for upload.
 */
type AllowedFileType =
  | 'image/jpeg'
  | 'image/png'
  | 'image/gif'
  | 'image/webp'
  | 'image/jpg'
  | 'image/bmp'
  | 'image/tiff'
  | 'image/svg+xml'
  | 'application/pdf'
  | 'text/plain'
  | 'text/csv'
  | 'video/mp4'
  | 'video/webm'
  | 'video/ogg'
  | 'audio/mpeg'
  | 'audio/wav'
  | 'audio/ogg'
  | 'audio/aac'

/**
 * Hook return type that determines the structure based on whether multiple files are allowed.
 */
interface UseFileUploadResult<T extends boolean> {
  /**
   * The files uploaded by the user.
   * - If `multiple` is true: Array of files.
   * - If `multiple` is false: A single file or null.
   */
  files: T extends true ? File[] : File | null

  /**
   * The preview URLs generated for the uploaded files.
   * - If `multiple` is true: Array of preview URLs.
   * - If `multiple` is false: A single preview URL or null.
   */
  previewUrls: T extends true ? string[] : string | null

  /**
   * The base64 encoded data for the uploaded files.
   * - If `multiple` is true: Array of base64 strings.
   * - If `multiple` is false: A single base64 string or null.
   */
  binaryData: T extends true ? string[] : string | null

  /**
   * Error message, if any file validation fails.
   */
  error: string | null

  /**
   * Handler for file selection changes.
   */
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void

  /**
   * Removes a file from the list of uploaded files.
   * - If `multiple` is true: Remove a file by index.
   * - If `multiple` is false: Removes the single file.
   */
  removeFile: (index?: number) => void

  /**
   * Ref for the file input element.
   */
  inputRef: MutableRefObject<HTMLInputElement | null>

  /**
   * Triggers the file input for manual upload.
   */
  onUploadTrigger: () => void

  /**
   * Handler for the drop event to handle file drop directly.
   */
  onDropTrigger: (event: React.DragEvent<HTMLDivElement>) => void
}

/**
 * Custom hook for managing file uploads with validation, preview generation,
 * and a maximum file count limit (e.g., if you pass 4 then only 4 files are allowed).
 *
 * @param options Configuration options for file upload:
 * - `allowedTypes` (Array of AllowedFileType): Allowed MIME types.
 * - `maxFileSize` (number): Maximum file size in bytes (default is 10MB).
 * - `multiple` (boolean): Whether multiple files can be uploaded (default is false).
 * - `maxFiles` (number): Maximum number of files allowed (only when multiple is true).
 *
 * @returns A result object containing files, preview URLs, base64 data, error state,
 *          and various handlers for managing file uploads.
 */
const useMuntahaDrop = <T extends boolean>(
  options: {
    allowedTypes?: AllowedFileType[]
    maxFileSize?: number
    multiple?: T
    maxFiles?: number
  } = {}
): UseFileUploadResult<T> => {
  const {
    allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/jpg',
      'image/bmp',
      'image/tiff',
      'image/svg+xml',
      'application/pdf',
      'text/plain',
      'text/csv',
      'video/mp4',
      'video/webm',
      'video/ogg',
      'audio/mpeg',
      'audio/wav',
      'audio/ogg',
      'audio/aac',
    ],
    maxFileSize = 10 * 1024 * 1024,
    multiple = false as T,
    maxFiles, // Maximum number of files allowed (only for multiple files)
  } = options

  const [files, setFiles] = useState<T extends true ? File[] : File | null>(
    (multiple ? [] : null) as T extends true ? File[] : File | null
  )
  const [previewUrls, setPreviewUrls] = useState<
    T extends true ? string[] : string | null
  >((multiple ? [] : null) as T extends true ? string[] : string | null)
  const [binaryData, setBinaryData] = useState<
    T extends true ? string[] : string | null
  >((multiple ? [] : null) as T extends true ? string[] : string | null)
  const [error, setError] = useState<string | null>(null)

  // Ref for the file input element
  const inputRef = useRef<HTMLInputElement | null>(null)

  /**
   * Validates the file type and size.
   */
  const validateFile = useCallback(
    (file: File): boolean => {
      const isValidType = allowedTypes.includes(file.type as AllowedFileType)
      const isValidSize = file.size <= maxFileSize
      if (!isValidType) {
        setError(
          `Invalid file type: ${file.type}. Allowed types are: ${allowedTypes.join(
            ', '
          )}`
        )
        return false
      }
      if (!isValidSize) {
        setError(
          `File size must be smaller than ${maxFileSize / (1024 * 1024)} MB`
        )
        return false
      }
      setError(null)
      return true
    },
    [allowedTypes, maxFileSize]
  )

  /**
   * Handles file selection changes, validates files,
   * and generates preview URLs and base64 data.
   */
  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      let selectedFiles = Array.from(event.target.files || [])
      let validFiles = selectedFiles.filter(validateFile)

      if (multiple && maxFiles) {
        // Determine how many files are already stored
        const currentCount = Array.isArray(files) ? files.length : 0
        if (currentCount >= maxFiles) {
          setError(`Maximum of ${maxFiles} files already uploaded.`)
          return
        }
        // Limit the number of new files if necessary
        if (currentCount + validFiles.length > maxFiles) {
          setError(
            `You can only upload ${
              maxFiles - currentCount
            } more file${maxFiles - currentCount > 1 ? 's' : ''}.`
          )
          validFiles = validFiles.slice(0, maxFiles - currentCount)
        }
      }

      if (multiple) {
        const fileReadPromises = validFiles.map((file) => {
          return new Promise<{
            file: File
            previewUrl: string
            base64: string
          }>((resolve, reject) => {
            const reader = new FileReader()
            reader.onloadend = () => {
              const result = reader.result as string
              resolve({
                file,
                previewUrl: URL.createObjectURL(file),
                base64: result,
              })
            }
            reader.onerror = () => reject(new Error('Error reading file'))
            reader.readAsDataURL(file)
          })
        })

        try {
          const results = await Promise.all(fileReadPromises)
          setFiles(
            (prev) =>
              [
                ...(prev as File[]),
                ...results.map((r) => r.file),
              ] as T extends true ? File[] : File | null
          )
          setPreviewUrls(
            (prev) =>
              [
                ...(prev as string[]),
                ...results.map((r) => r.previewUrl),
              ] as T extends true ? string[] : string | null
          )
          setBinaryData(
            (prev) =>
              [
                ...(prev as string[]),
                ...results.map((r) => r.base64),
              ] as T extends true ? string[] : string | null
          )
        } catch {
          setError('Error reading one or more files')
        }
      } else if (validFiles.length > 0) {
        const selectedFile = validFiles[0]
        const reader = new FileReader()
        reader.onloadend = () => {
          const result = reader.result as string
          setFiles(selectedFile as T extends true ? File[] : File | null)
          setPreviewUrls(
            URL.createObjectURL(selectedFile) as T extends true
              ? string[]
              : string | null
          )
          setBinaryData(result as T extends true ? string[] : string | null)
        }
        reader.onerror = () => setError('Error reading file')
        reader.readAsDataURL(selectedFile)
      }
    },
    [validateFile, multiple, maxFiles, files]
  )

  /**
   * Removes a file from the upload list.
   * - For multiple files, removes by index.
   * - For single file upload, clears the file.
   */
  const removeFile = useCallback(
    (index?: number) => {
      if (multiple) {
        if (typeof index === 'number') {
          setFiles(
            (prev) =>
              (prev as File[]).filter((_, i) => i !== index) as T extends true
                ? File[]
                : File | null
          )
          setPreviewUrls(
            (prev) =>
              (prev as string[]).filter((_, i) => i !== index) as T extends true
                ? string[]
                : string | null
          )
          setBinaryData(
            (prev) =>
              (prev as string[]).filter((_, i) => i !== index) as T extends true
                ? string[]
                : string | null
          )
        }
      } else {
        setFiles(null as T extends true ? File[] : File | null)
        setPreviewUrls(null as T extends true ? string[] : string | null)
        setBinaryData(null as T extends true ? string[] : string | null)
      }

      // Reset the input field value
      if (inputRef.current) {
        inputRef.current.value = ''
      }
    },
    [multiple]
  )

  /**
   * Triggers the file input manually.
   */
  const onUploadTrigger = useCallback(() => {
    inputRef.current?.click()
  }, [])

  /**
   * Handles file drop events.
   */
  const onDropTrigger = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      event.stopPropagation()
      const droppedFiles = Array.from(event.dataTransfer.files)
      let validFiles = droppedFiles.filter(validateFile)
      if (multiple && maxFiles) {
        const currentCount = Array.isArray(files) ? files.length : 0
        if (currentCount >= maxFiles) {
          setError(`Maximum of ${maxFiles} files already uploaded.`)
          return
        }
        if (currentCount + validFiles.length > maxFiles) {
          setError(
            `You can only upload ${
              maxFiles - currentCount
            } more file${maxFiles - currentCount > 1 ? 's' : ''}.`
          )
          validFiles = validFiles.slice(0, maxFiles - currentCount)
        }
      }
      if (validFiles.length > 0) {
        handleFileChange({
          target: { files: validFiles as unknown },
        } as React.ChangeEvent<HTMLInputElement>)
      }
    },
    [validateFile, handleFileChange, multiple, maxFiles, files]
  )

  return {
    files,
    previewUrls,
    binaryData,
    error,
    handleFileChange,
    removeFile,
    inputRef,
    onUploadTrigger,
    onDropTrigger,
  }
}

export { useMuntahaDrop }
