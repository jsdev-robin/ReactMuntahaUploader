import { useState, useCallback, useEffect } from 'react'

/**
 * Allowed file types for upload.
 */
type AllowedFileType =
  | 'image/jpeg'
  | 'image/png'
  | 'image/gif'
  | 'text/plain'
  | 'application/pdf'
  | 'text/csv'
  | 'video/mp4'
  | 'video/webm'
  | 'video/ogg'

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
  base64Data: T extends true ? string[] : string | null

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
}

/**
 * Custom hook for managing file uploads with validation and preview generation.
 *
 * @param options Configuration options for file upload:
 * - `allowedTypes` (Array of AllowedFileType): An array of MIME types that are allowed for upload.
 * - `maxFileSize` (number): Maximum file size in bytes (default is 10MB).
 * - `multiple` (boolean): Whether multiple files can be uploaded or not (default is false).
 *
 * @returns A result object containing:
 * - `files`: The uploaded files.
 * - `previewUrls`: The preview URLs of the uploaded files.
 * - `base64Data`: Base64-encoded data of the files.
 * - `error`: Validation error message.
 * - `handleFileChange`: File change handler.
 * - `removeFile`: File removal handler.
 */
const useFileDrop = <T extends boolean>(
  options: {
    allowedTypes?: AllowedFileType[]
    maxFileSize?: number
    multiple?: T
  } = {}
): UseFileUploadResult<T> => {
  const {
    allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
      'text/plain',
      'text/csv',
      'video/mp4',
      'video/webm',
      'video/ogg',
    ],
    maxFileSize = 10 * 1024 * 1024,
    multiple = false as T,
  } = options

  const [files, setFiles] = useState<T extends true ? File[] : File | null>(
    (multiple ? [] : null) as T extends true ? File[] : File | null
  )
  const [previewUrls, setPreviewUrls] = useState<
    T extends true ? string[] : string | null
  >((multiple ? [] : null) as T extends true ? string[] : string | null)
  const [base64Data, setBase64Data] = useState<
    T extends true ? string[] : string | null
  >((multiple ? [] : null) as T extends true ? string[] : string | null)
  const [error, setError] = useState<string | null>(null)

  /**
   * Validates file type and size before upload.
   */
  const validateFile = useCallback(
    (file: File): boolean => {
      const isValidType = allowedTypes.includes(file.type as AllowedFileType)
      const isValidSize = file.size <= maxFileSize
      if (!isValidType) {
        setError(
          `Invalid file type: ${
            file.type
          }. Allowed types are: ${allowedTypes.join(', ')}`
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
   * Handles the file change event, reads the files, validates, and generates preview URLs and base64 data.
   */
  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(event.target.files || [])
      const validFiles = selectedFiles.filter(validateFile)

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
                base64: result.split(',')[1],
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
          setBase64Data(
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
          setBase64Data(
            result.split(',')[1] as T extends true ? string[] : string | null
          )
        }
        reader.onerror = () => setError('Error reading file')
        reader.readAsDataURL(selectedFile)
      }
    },
    [validateFile, multiple]
  )

  /**
   * Removes a file from the uploaded list.
   * - If `multiple` is true, remove by index.
   * - If `multiple` is false, clears the single file.
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
          setBase64Data(
            (prev) =>
              (prev as string[]).filter((_, i) => i !== index) as T extends true
                ? string[]
                : string | null
          )
        }
      } else {
        setFiles(null as T extends true ? File[] : File | null)
        setPreviewUrls(null as T extends true ? string[] : string | null)
        setBase64Data(null as T extends true ? string[] : string | null)
      }
    },
    [multiple]
  )

  /**
   * Cleanup function to revoke object URLs when the component is unmounted or files are removed.
   */
  useEffect(() => {
    return () => {
      if (multiple && Array.isArray(previewUrls)) {
        previewUrls.forEach((url) => URL.revokeObjectURL(url))
      } else if (previewUrls && typeof previewUrls === 'string') {
        URL.revokeObjectURL(previewUrls)
      }
    }
  }, [previewUrls, multiple])

  return {
    files,
    previewUrls,
    base64Data,
    error,
    handleFileChange,
    removeFile,
  } as UseFileUploadResult<T>
}

export default useFileDrop
