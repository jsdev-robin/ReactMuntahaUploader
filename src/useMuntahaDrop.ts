'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Type representing all possible MIME types that can be accepted by the file drop component.
 * Includes images, videos, audio, documents, archives, fonts, code files, and more.
 */
type Accept =
  // Images
  | 'image/*'
  | 'image/apng'
  | 'image/avif'
  | 'image/bmp'
  | 'image/cgm'
  | 'image/dicom-rle'
  | 'image/emf'
  | 'image/fits'
  | 'image/g3fax'
  | 'image/gif'
  | 'image/heic'
  | 'image/heif'
  | 'image/ief'
  | 'image/jls'
  | 'image/jp2'
  | 'image/jpeg'
  | 'image/jpg'
  | 'image/jph'
  | 'image/jpm'
  | 'image/jpx'
  | 'image/ktx'
  | 'image/png'
  | 'image/prs.btif'
  | 'image/prs.pti'
  | 'image/svg+xml'
  | 'image/t38'
  | 'image/tiff'
  | 'image/vnd.adobe.photoshop'
  | 'image/vnd.airzip.accelerator.azv'
  | 'image/vnd.cns.inf2'
  | 'image/vnd.djvu'
  | 'image/vnd.dwg'
  | 'image/vnd.dxf'
  | 'image/vnd.fastbidsheet'
  | 'image/vnd.fpx'
  | 'image/vnd.fst'
  | 'image/vnd.fujixerox.edmics-mmr'
  | 'image/vnd.fujixerox.edmics-rlc'
  | 'image/vnd.ms-modi'
  | 'image/vnd.net-fpx'
  | 'image/vnd.pco.b16'
  | 'image/vnd.tencent.tap'
  | 'image/vnd.valve.source.texture'
  | 'image/vnd.wap.wbmp'
  | 'image/vnd.xiff'
  | 'image/webp'
  | 'image/wmf'
  | 'image/x-cmu-raster'
  | 'image/x-cmx'
  | 'image/x-freehand'
  | 'image/x-icon'
  | 'image/x-jng'
  | 'image/x-mrsid-image'
  | 'image/x-pcx'
  | 'image/x-pict'
  | 'image/x-portable-anymap'
  | 'image/x-portable-bitmap'
  | 'image/x-portable-graymap'
  | 'image/x-portable-pixmap'
  | 'image/x-rgb'
  | 'image/x-xbitmap'
  | 'image/x-xpixmap'
  | 'image/x-xwindowdump'

  // Videos
  | 'video/*'
  | 'video/3gpp'
  | 'video/3gpp2'
  | 'video/h261'
  | 'video/h263'
  | 'video/h264'
  | 'video/jpeg'
  | 'video/jpm'
  | 'video/mj2'
  | 'video/mp4'
  | 'video/mpeg'
  | 'video/ogg'
  | 'video/quicktime'
  | 'video/vnd.dece.hd'
  | 'video/vnd.dece.mobile'
  | 'video/vnd.dece.pd'
  | 'video/vnd.dece.sd'
  | 'video/vnd.dece.video'
  | 'video/vnd.dvb.file'
  | 'video/vnd.fvt'
  | 'video/vnd.mpegurl'
  | 'video/vnd.ms-playready.media.pyv'
  | 'video/vnd.uvvu.mp4'
  | 'video/vnd.vivo'
  | 'video/webm'
  | 'video/x-f4v'
  | 'video/x-flv'
  | 'video/x-m4v'
  | 'video/x-ms-asf'
  | 'video/x-ms-wm'
  | 'video/x-ms-wmv'
  | 'video/x-ms-wmx'
  | 'video/x-ms-wvx'
  | 'video/x-msvideo'
  | 'video/x-sgi-movie'

  // Audio
  | 'audio/*'
  | 'audio/aac'
  | 'audio/ac3'
  | 'audio/adpcm'
  | 'audio/basic'
  | 'audio/midi'
  | 'audio/mp3'
  | 'audio/mp4'
  | 'audio/mpeg'
  | 'audio/ogg'
  | 'audio/opus'
  | 'audio/vorbis'
  | 'audio/wav'
  | 'audio/webm'
  | 'audio/x-aiff'
  | 'audio/x-mpegurl'
  | 'audio/x-ms-wax'
  | 'audio/x-ms-wma'
  | 'audio/x-pn-realaudio'
  | 'audio/x-wav'

  // Documents
  | 'application/*'
  | 'application/pdf'
  | 'application/msword'
  | 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  | 'application/vnd.ms-excel'
  | 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  | 'application/vnd.ms-powerpoint'
  | 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  | 'application/rtf'
  | 'text/plain'
  | 'text/csv'
  | 'text/html'
  | 'text/css'
  | 'text/javascript'
  | 'application/json'
  | 'application/xml'

  // Archives & Compressed Files
  | 'application/zip'
  | 'application/x-7z-compressed'
  | 'application/x-rar-compressed'
  | 'application/x-tar'
  | 'application/x-bzip'
  | 'application/x-bzip2'
  | 'application/gzip'

  // Fonts
  | 'font/*'
  | 'font/otf'
  | 'font/ttf'
  | 'font/woff'
  | 'font/woff2'

  // Programming & Code Files
  | 'application/x-httpd-php'
  | 'application/x-java-archive'
  | 'application/x-python-code'
  | 'application/x-ruby'
  | 'application/x-perl'
  | 'application/x-sh'
  | 'application/typescript'
  | 'application/javascript'

  // Miscellaneous
  | 'application/vnd.oasis.opendocument.text'
  | 'application/vnd.oasis.opendocument.spreadsheet'
  | 'application/vnd.oasis.opendocument.presentation'
  | 'application/vnd.oasis.opendocument.graphics'
  | 'application/vnd.oasis.opendocument.chart'
  | 'application/vnd.oasis.opendocument.formula'
  | 'application/vnd.oasis.opendocument.database'
  | '*' // Wildcard for any type

/**
 * Interface representing enriched file data containing both ArrayBuffer and File objects
 */
interface EnrichedArrayBuffer {
  buffer?: ArrayBuffer | null
  file?: File | null
}

/**
 * Props for the root drop zone element
 */
interface RootProps {
  ref: React.RefObject<HTMLDivElement | null>
  onClick: () => void
  onDragEnter: (e: React.DragEvent<HTMLDivElement>) => void
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void
  'data-dragging': boolean
}

/**
 * Props for the hidden file input element
 */
interface InputProps {
  ref: React.RefObject<HTMLInputElement | null>
  onClick: () => void
  type: string
  style: { display: string }
  accept?: string
  multiple?: boolean
  disabled?: boolean
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

/**
 * State returned by the useDrop hook
 */
interface DropState {
  isDragActive: boolean
  onClick: () => void
  onRemove: (index?: number) => void
  error: string | null
  inputProps: InputProps
  rootProps: RootProps
  getFile: (index?: number) => File[] | null
  getData: (index?: number) => EnrichedArrayBuffer[] | null
  getProgress: (index?: number) => number | Record<number, number>
}

/**
 * Configuration options for the useDrop hook
 */
interface PropTypes {
  /** Accepted file types */
  accept?: Accept[]
  /** Minimum file size in bytes */
  minSize?: number
  /** Maximum file size in bytes */
  maxSize?: number
  /** Maximum number of files allowed */
  maxFiles?: number
  /** Whether multiple files are allowed */
  multiple?: boolean
  /** Whether the drop zone is disabled */
  disabled?: boolean
  /** Callback when files are dropped/selected */
  onDrop?: (files: File[]) => void
  /** Callback when an error occurs */
  onError?: (err: string | null) => void
}

/**
 * Custom React hook for handling file drops and selections
 * @param {PropTypes} options - Configuration options for the drop zone
 * @returns {DropState} The state and handlers for the drop zone
 */
const useMuntahaDrop = (options: PropTypes = {}): DropState => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const rootRef = useRef<HTMLDivElement | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState<Record<number, number>>({})
  const [isDragActive, setIsDragActive] = useState<boolean>(false)
  const [data, setData] = useState<EnrichedArrayBuffer[]>([])
  const [files, setFiles] = useState<File[]>([])

  const {
    accept = ['*'],
    minSize,
    maxSize,
    maxFiles,
    multiple = true,
    disabled = false,
    onDrop,
    onError,
  } = options

  /**
   * Handles clicking on the drop zone to trigger file selection
   */
  const onClick = useCallback(() => {
    if (inputRef.current && !disabled) {
      inputRef.current?.click()
    }
  }, [disabled])

  /**
   * Validates a file against the specified constraints
   * @param {File} file - The file to validate
   * @returns {boolean} True if the file is valid, false otherwise
   */
  const validFile = useCallback(
    (file: File): boolean => {
      const fileSize = file.size
      const fileType = file.type || 'application/octet-stream'

      if (minSize && fileSize < minSize) {
        setError(
          `File size is below the minimum limit of ${(
            minSize /
            1024 /
            1024
          ).toFixed(2)} MB.`
        )

        return false
      }

      if (maxSize && fileSize > maxSize) {
        setError(
          `File size exceeds the maximum limit of ${(
            maxSize /
            1024 /
            1024
          ).toFixed(2)} MB.`
        )
        return false
      }

      if (
        !accept.includes('*') &&
        !accept.some((acpt) => {
          if (acpt.endsWith('/*')) {
            return fileType.startsWith(acpt.split('/*')[0])
          }
          return acpt === fileType
        })
      ) {
        setError(
          `File type "${fileType}" is not allowed. Accepted types: ${accept.join(
            ', '
          )}`
        )
        return false
      }

      setError(null)

      return true
    },
    [accept, maxSize, minSize]
  )

  /**
   * Reads files as ArrayBuffers and tracks progress
   * @param {File[]} files - The files to read
   * @returns {Promise<EnrichedArrayBuffer[]>} Promise resolving to enriched file data
   */
  const readFiles = useCallback(
    (files: File[]): Promise<EnrichedArrayBuffer[]> => {
      // Reset progress if not in multiple mode
      const fileProgress = multiple ? { ...progress } : {}

      const currentLength = multiple ? data.length : 0 // Start from 0 if not multiple
      files.forEach((_, index) => {
        fileProgress[currentLength + index] = 0
      })

      return Promise.all(
        files.map((file, relativeIndex) => {
          const absoluteIndex = multiple ? currentLength + relativeIndex : 0
          return new Promise<EnrichedArrayBuffer>((resolve, reject) => {
            const reader = new FileReader()

            reader.onabort = () => {
              setError('File reading aborted')
              reject(new Error('File reading aborted'))
            }

            reader.onerror = () => {
              setError('Error reading file')
              reject(new Error('Error reading file'))
            }

            reader.onprogress = (event) => {
              if (event.lengthComputable) {
                const percent = Math.round((event.loaded / event.total) * 100)
                fileProgress[absoluteIndex] = percent
                setProgress({ ...fileProgress })
              }
            }

            reader.onload = () => {
              if (reader.result instanceof ArrayBuffer) {
                fileProgress[absoluteIndex] = 100
                setProgress({ ...fileProgress })
                resolve({
                  buffer: reader.result,
                  file: file,
                })
              } else {
                reject(new Error('Invalid file data'))
              }
            }

            reader.readAsArrayBuffer(file)
          })
        })
      )
    },
    [data, progress, multiple]
  )
  /**
   * Handles file selection via the input element
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event
   */
  const onChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        try {
          const fileList = Array.from(e.target.files)
          const validFileList = fileList.filter(validFile)

          if (maxFiles !== undefined) {
            if (files.length + validFileList.length > maxFiles) {
              setError(
                `You can only upload up to ${maxFiles} file(s). You tried to add ${validFileList.length} file(s) to existing ${files.length} file(s).`
              )
              return false
            }
          }

          if (validFileList.length > 0) {
            setFiles((prevFileList) => [...prevFileList, ...validFileList])

            const result = await readFiles(validFileList)

            setData((prevData) =>
              multiple ? [...prevData, ...result] : [result[0]]
            )
          }
        } catch (error) {
          setError(
            error instanceof Error ? error.message : 'Failed to read files'
          )
        }
      }
    },
    [files, maxFiles, multiple, readFiles, validFile]
  )

  /**
   * Removes a file or all files from the state
   * @param {number} [index] - The index of the file to remove, or undefined to remove all
   */
  const onRemove = useCallback(
    (index?: number) => {
      if (inputRef.current) {
        inputRef.current.value = ''
      }

      if (multiple) {
        if (typeof index === 'number') {
          setFiles((prev) => {
            const newFiles = prev.filter((_, i) => i !== index)
            // Call onDrop after state update
            setTimeout(() => onDrop?.(newFiles), 0)
            return newFiles
          })
          setData((prev) => prev.filter((_, i) => i !== index))

          setProgress((prev) => {
            return Object.entries(prev).reduce(
              (acc, [key, value]) => {
                const idx = Number(key)
                if (idx < index) acc[idx] = value
                if (idx > index) acc[idx - 1] = value
                return acc
              },
              {} as Record<number, number>
            )
          })
        } else {
          setFiles([])
          setData([])
          setProgress({})
          // Call onDrop with empty array when clearing all
          setTimeout(() => onDrop?.([]), 0)
        }
      } else {
        setFiles([])
        setData([])
        setProgress({})
        // Call onDrop with empty array in single file mode
        setTimeout(() => onDrop?.([]), 0)
      }

      setError(null)
    },
    [multiple, onDrop]
  )

  /**
   * Handles drag enter events
   * @param {React.DragEvent<HTMLDivElement>} e - The drag event
   */
  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(true)
  }, [])

  /**
   * Handles drag over events
   * @param {React.DragEvent<HTMLDivElement>} e - The drag event
   */
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(true)
  }, [])

  /**
   * Handles drag leave events
   * @param {React.DragEvent<HTMLDivElement>} e - The drag event
   */
  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
  }, [])

  /**
   * Handles drop events
   * @param {React.DragEvent<HTMLDivElement>} event - The drop event
   */
  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      setIsDragActive(false)

      if (event.dataTransfer.files) {
        const fileList = Array.from(event.dataTransfer.files)
        onChange({
          target: { files: fileList as unknown },
        } as React.ChangeEvent<HTMLInputElement>)
      }
    },
    [onChange]
  )

  // Call onDrop callback when files change
  const onDropRef = useRef(onDrop)
  useEffect(() => {
    onDropRef.current = onDrop
  }, [onDrop])

  useEffect(() => {
    if (files.length > 0) {
      onDropRef.current?.(files)
    }
  }, [files])

  // Call onError callback when error changes
  useEffect(() => {
    if (onError) {
      onError(error)
    }
  }, [error, onError])

  /**
   * Gets the props for the input element
   * @returns {InputProps} The input props
   */
  const getInputProps = useCallback(
    (): InputProps => ({
      ref: inputRef,
      onClick,
      type: 'file',
      style: { display: 'none' },
      accept: accept.join(','),
      multiple,
      disabled,
      onChange,
    }),
    [accept, disabled, multiple, onChange, onClick]
  )

  /**
   * Gets the props for the root drop zone element
   * @returns {RootProps} The root props
   */
  const getRootProps = useCallback(
    (): RootProps => ({
      ref: rootRef,
      onClick: () => inputRef.current?.click(),
      onDragEnter: handleDragEnter,
      onDragOver: handleDragOver,
      onDragLeave: handleDragLeave,
      onDrop: handleDrop,
      'data-dragging': isDragActive,
    }),
    [handleDragEnter, handleDragLeave, handleDragOver, handleDrop, isDragActive]
  )

  /**
   * Retrieves a single file by index or the first file if no index is provided
   * @param {number} [index] - Optional index of the file to retrieve. If not provided, returns the first file.
   * @returns {File | null} The requested File object if found, otherwise null
   */
  const getFile = useCallback(
    (index?: number): File[] | null => {
      if (index !== undefined) {
        return files[index] ? [files[index]] : []
      }
      return [...files]
    },
    [files]
  )

  /**
   * Retrieves file data as ArrayBuffer with metadata
   * @param {number} [index] - Optional index of the file data to retrieve
   * @returns {EnrichedArrayBuffer[]}
   *   - If index is provided: Array with single EnrichedArrayBuffer if exists, otherwise empty array
   *   - If no index: Array of all EnrichedArrayBuffer objects
   */
  const getData = useCallback(
    (index?: number): EnrichedArrayBuffer[] => {
      if (index !== undefined) {
        return data[index] ? [data[index]] : []
      }
      return [...data]
    },
    [data]
  )

  /**
   * Gets upload progress for files
   * @param {number} [index] - Optional index of the file to get progress for
   * @returns {number | Record<number, number>}
   *   - If index is provided: Progress percentage (0-100) for the specified file
   *   - If no index: Object mapping all file indices to their progress percentages
   */
  const getProgress = useCallback(
    (index?: number): number | Record<number, number> => {
      if (index !== undefined) {
        return progress[index] || 0
      }
      return { ...progress }
    },
    [progress]
  )

  return {
    getData,
    getProgress,
    isDragActive,
    onClick,
    onRemove,
    error,
    inputProps: getInputProps(),
    rootProps: getRootProps(),
    getFile,
  }
}

export { useMuntahaDrop }
