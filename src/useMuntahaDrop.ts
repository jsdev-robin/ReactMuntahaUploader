'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Union type representing all supported MIME types for file uploads.
 * Includes categories for images, videos, audio, documents, archives, fonts, and more.
 */
type MimeType =
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
  | '*'

/**
 * Represents the state of files based on whether multiple files are allowed.
 * @template T - Boolean indicating if multiple files are allowed
 */
type FileState<T extends boolean> = T extends true ? File[] : File | null

/**
 * Represents the state of ArrayBuffer data based on whether multiple files are allowed.
 * @template T - Boolean indicating if multiple files are allowed
 */
type ArrayBufferState<T extends boolean> = T extends true
  ? ArrayBuffer[]
  : ArrayBuffer | null

/**
 * Configuration options for the drop zone hook
 * @template T - Boolean indicating if multiple files are allowed
 */
interface DropZoneOptions<T extends boolean> {
  /** Accepted MIME types for the files */
  accept?: MimeType[]
  /** Minimum file size in bytes */
  minSize?: number
  /** Maximum file size in bytes */
  maxSize?: number
  /** Maximum number of files allowed (only applicable when multiple is true) */
  maxFiles?: number
  /** Whether multiple files are allowed */
  multiple?: T
  /** Whether the drop zone is disabled */
  disabled?: boolean
  /** Whether to read files as ArrayBuffer */
  isArrayBuffer?: boolean
  /** Callback when files are dropped/selected */
  onDrop?: (files: FileState<T>) => void
  /** Callback when an error occurs */
  onError?: (err: string | null) => void
  /** Enable folder upload (requires browser support) */
  enableFolderUpload?: boolean
  /** Enable keyboard navigation */
  enableKeyboard?: boolean
}

/**
 * The enhanced state and methods returned by the useDrop hook with abort support
 * @template T - Boolean indicating if multiple files are allowed
 */
interface EnhancedDropZoneState<T extends boolean> {
  /** Current error message, if any */
  error: string | null
  /** Upload progress (single number or record of indices to progress) */
  progress: number | Record<number, number>
  /** The current files */
  files: FileState<T>
  /** ArrayBuffer representations of files (if isArrayBuffer is true) */
  arrayBuffer: ArrayBufferState<T>
  /** Whether files are currently being dragged over the drop zone */
  isDragActive: boolean
  /** Function to remove files (optionally by index) */
  onDelete: (index?: number) => void
  /** Aborts all current upload operations */
  abortUpload: () => void
  /** Current upload status */
  status: 'idle' | 'reading' | 'aborted' | 'error'
  /** Utility functions */
  utils: {
    /** Get file(s) by index or all files */
    getFile: (index?: number) => FileState<T>
    /** Get ArrayBuffer(s) by index or all ArrayBuffers */
    getData: (index?: number) => ArrayBufferState<T>
    /** Get progress by index or all progress */
    getProgress: (index?: number) => number | Record<number, number>
  }
  /** Props to spread on the root drop zone element */
  getRootProps: () => {
    /** Ref for the root element */
    ref: React.RefObject<HTMLDivElement>
    /** Click handler */
    onClick: () => void
    /** Drag enter handler */
    onDragEnter: (e: React.DragEvent<HTMLDivElement>) => void
    /** Drag over handler */
    onDragOver: (e: React.DragEvent<HTMLDivElement>) => void
    /** Drag leave handler */
    onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void
    /** Drop handler */
    onDrop: (e: React.DragEvent<HTMLDivElement>) => void
    /** Data attribute indicating drag active state */
    /** Data attribute indicating drag state */
    'data-dragging': boolean
    /** Data attribute indicating disabled state */
    'data-disabled': boolean
    /** Data attribute indicating error state */
    'data-has-error': boolean
    /** Accessible label for screen readers */
    'aria-label': string
    /** Indicates whether the element is disabled for assistive technologies */
    'aria-disabled': boolean
    /** Identifies the element that describes the object for assistive technologies */
  }
  /** Props to spread on the hidden file input element */
  getInputProps: () => {
    /** Ref for the input element */
    ref: React.RefObject<HTMLInputElement>
    /** Input type */
    type: 'file'
    /** Input style */
    style: { display: 'none' }
    /** Accepted MIME types */
    accept?: string
    /** Whether multiple files are allowed */
    multiple?: boolean
    /** Whether input is disabled */
    disabled?: boolean
    /** Change handler */
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    /** Allows users to select an entire directory (WebKit-specific) */
    webkitdirectory?: string
    /** Allows users to select an entire directory (non-standard, used in some browsers) */
    directory?: string
  }
}

/**
 * A custom React hook for handling file drops and uploads with validation, progress tracking, and abort support.
 * @template T - A boolean type indicating whether multiple files are allowed (defaults to true)
 * @param {DropZoneOptions<T>} options - Configuration options for the drop zone
 * @returns {EnhancedDropZoneState<T>} An object containing state and utility functions for the drop zone
 */
const useMuntahaDrop = <T extends boolean = true>(
  options: DropZoneOptions<T> = {}
): EnhancedDropZoneState<T> => {
  const inputRef = useRef<HTMLInputElement>(null!)
  const rootRef = useRef<HTMLDivElement>(null!)
  const [error, setError] = useState<string | null>(null)
  const [isDragActive, setIsDragActive] = useState(false)
  const [files, setFiles] = useState<FileState<T>>(null as FileState<T>)
  const [arrayBuffer, setArrayBuffer] = useState<ArrayBufferState<T>>(
    null as ArrayBufferState<T>
  )
  const [progress, setProgress] = useState<Record<number, number>>({})
  const [status, setStatus] = useState<
    'idle' | 'reading' | 'aborted' | 'error'
  >('idle')
  const abortController = useRef(new AbortController())
  const activeReaders = useRef(new Set<FileReader>())

  const {
    accept = ['*'],
    minSize,
    maxSize,
    maxFiles,
    multiple = true as T,
    disabled = false,
    isArrayBuffer = false,
    enableFolderUpload = false,
    enableKeyboard = true,
    onDrop,
    onError,
  } = options

  // Set up folder upload attributes
  useEffect(() => {
    if (inputRef.current && enableFolderUpload) {
      inputRef.current.setAttribute('webkitdirectory', '')
      inputRef.current.setAttribute('directory', '')
    } else if (inputRef.current) {
      inputRef.current.removeAttribute('webkitdirectory')
      inputRef.current.removeAttribute('directory')
    }
  }, [enableFolderUpload])

  // const getImageDimensions = (
  //   file: File
  // ): Promise<{ width: number; height: number }> =>
  //   new Promise((resolve) => {
  //     const img = new Image();
  //     img.onload = () => {
  //       resolve({ width: img.width, height: img.height });
  //     };
  //     img.src = URL.createObjectURL(file);
  //   });

  /**
   * Validates a file against the configured constraints
   * @param {File} file - The file to validate
   * @returns {boolean} True if the file is valid, false otherwise
   */
  const validateFile = useCallback(
    (file: File): boolean => {
      const fileSize = file.size
      const fileType = file.type

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
   * Reads files as ArrayBuffers with progress tracking and abort support
   * @param {File[]} files - The files to read
   * @returns {Promise<ArrayBuffer[]>} Promise resolving with ArrayBuffers of the files
   */
  const readFiles = useCallback((files: File[]): Promise<ArrayBuffer[]> => {
    setStatus('reading')
    abortController.current = new AbortController()
    const signal = abortController.current.signal

    return Promise.all(
      files.map((file, index) => {
        return new Promise<ArrayBuffer>((resolve, reject) => {
          if (signal.aborted) {
            reject(new Error('Upload aborted'))
            return
          }

          const reader = new FileReader()
          activeReaders.current.add(reader)

          const cleanup = () => {
            activeReaders.current.delete(reader)
            if (activeReaders.current.size === 0) {
              setStatus((prev) => (prev === 'reading' ? 'idle' : prev))
            }
          }

          signal.addEventListener('abort', () => {
            reader.abort()
            cleanup()
            reject(new Error('Upload aborted'))
          })

          reader.onabort = () => {
            cleanup()
            reject(new Error('Upload aborted'))
          }

          reader.onerror = () => {
            cleanup()
            setStatus('error')
            reject(new Error(`Failed to read ${file.name}`))
          }

          reader.onprogress = (event) => {
            if (event.lengthComputable) {
              const percent = Math.round((event.loaded / event.total) * 100)
              setProgress((prev) => ({ ...prev, [index]: percent }))
            }
          }

          reader.onload = () => {
            cleanup()
            if (reader.result instanceof ArrayBuffer) {
              setProgress((prev) => ({ ...prev, [index]: 100 }))
              resolve(reader.result)
            } else {
              setStatus('error')
              reject(new Error('Invalid file format'))
            }
          }

          try {
            reader.readAsArrayBuffer(file)
          } catch (err) {
            cleanup()
            setStatus('error')
            reject(
              err instanceof Error ? err : new Error('Failed to read file')
            )
          }
        })
      })
    )
  }, [])

  /**
   * Aborts all current upload operations
   */
  const abortUpload = useCallback(() => {
    if (status === 'reading') {
      abortController.current.abort()
      activeReaders.current.forEach((reader) => reader.abort())
      activeReaders.current.clear()
      setStatus('aborted')
      setProgress({})

      if (inputRef.current) {
        inputRef.current.value = ''
      }
    }
  }, [status])

  // Clean up on unmount
  useEffect(() => {
    return () => {
      abortUpload()
    }
  }, [abortUpload])

  /**
   * Handles file input change events
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event
   */
  const handleInputChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const fileList = Array.from(e.target.files)
        const validateFileList = fileList.filter(validateFile)

        if (maxFiles !== undefined) {
          const currentFilesCount = Array.isArray(files)
            ? files.length
            : files
              ? 1
              : 0
          if (currentFilesCount + validateFileList.length > maxFiles) {
            setError(
              `You can only upload up to ${maxFiles} file(s). You tried to add ${validateFileList.length} file(s) to existing ${currentFilesCount} file(s).`
            )
            return
          }
        }

        try {
          if (validateFileList.length > 0) {
            if (multiple) {
              setFiles(
                (prevFileList: FileState<T>) =>
                  [
                    ...(Array.isArray(prevFileList) ? prevFileList : []),
                    ...validateFileList,
                  ] as FileState<T>
              )

              if (isArrayBuffer) {
                const result = await readFiles(validateFileList)
                setArrayBuffer(
                  (prevBufferList: ArrayBufferState<T>) =>
                    [
                      ...(Array.isArray(prevBufferList) ? prevBufferList : []),
                      ...result,
                    ] as ArrayBufferState<T>
                )
              }
            } else {
              setFiles(validateFileList[0] as FileState<T>)
              if (isArrayBuffer) {
                const result = await readFiles(validateFileList)
                setArrayBuffer(result[0] as ArrayBufferState<T>)
              }
            }
          }
        } catch (error) {
          setError(
            error instanceof Error ? error.message : 'Failed to read files'
          )
        }
      }
    },
    [files, isArrayBuffer, maxFiles, multiple, readFiles, validateFile]
  )

  /**
   * Removes files from state
   * @param {number} [index] - Optional index of file to remove
   */
  const onDelete = useCallback(
    (index?: number) => {
      if (inputRef.current) {
        inputRef.current.value = ''
      }

      if (multiple) {
        if (typeof index === 'number') {
          setFiles((prev: FileState<T>) => {
            const prevFiles = Array.isArray(prev) ? prev : []
            const newFiles = prevFiles.filter((_, i) => i !== index)
            options.onDrop?.(newFiles as FileState<T>)
            return newFiles as FileState<T>
          })

          setArrayBuffer((prev: ArrayBufferState<T>) => {
            const prevBuffers = Array.isArray(prev) ? prev : []
            return prevBuffers.filter(
              (_, i) => i !== index
            ) as ArrayBufferState<T>
          })

          setProgress((prev) => {
            const newProgress = { ...prev }
            delete newProgress[index]
            return Object.entries(newProgress).reduce(
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
          setFiles(null as FileState<T>)
          setArrayBuffer(null as ArrayBufferState<T>)
          setProgress({})
          options.onDrop?.(null as FileState<T>)
        }
      } else {
        setFiles(null as FileState<T>)
        setArrayBuffer(null as ArrayBufferState<T>)
        setProgress({})
        options.onDrop?.(null as FileState<T>)
      }

      setError(null)
    },
    [multiple, options]
  )

  /**
   * Opens the file selection dialog
   */
  const openDialog = useCallback(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.click()
    }
  }, [disabled])

  const onDropRef = useRef(onDrop)

  useEffect(() => {
    onDropRef.current = onDrop
  }, [onDrop])

  useEffect(() => {
    if (files !== null && (multiple ? (files as File[]).length > 0 : true)) {
      onDropRef.current?.(files)
    }
  }, [files, multiple])

  useEffect(() => {
    if (onError) {
      onError(error)
    }
  }, [error, onError])

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
   * @param {React.DragEvent<HTMLDivElement>} e - The drop event
   */
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDragActive(false)

      if (e.dataTransfer.files) {
        const fileList = Array.from(e.dataTransfer.files)
        handleInputChange({
          target: { files: fileList as unknown },
        } as React.ChangeEvent<HTMLInputElement>)
      }
    },
    [handleInputChange]
  )

  /**
   * Returns props to spread on the root drop zone element
   * @returns {Object} Root element props
   */
  const getRootProps = useCallback(
    () => ({
      ref: rootRef,
      onClick: openDialog,
      onDragEnter: handleDragEnter,
      onDragOver: handleDragOver,
      onDragLeave: handleDragLeave,
      onDrop: handleDrop,
      tabIndex: enableKeyboard ? 0 : undefined,
      role: enableKeyboard ? 'button' : undefined,
      'aria-label': 'File upload',
      'aria-disabled': disabled,
      'data-dragging': isDragActive,
      'data-disabled': disabled,
      'data-has-error': error !== null,
    }),
    [
      disabled,
      enableKeyboard,
      error,
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      isDragActive,
      openDialog,
    ]
  )

  /**
   * Returns props to spread on the hidden file input element
   * @returns {Object} Input element props
   */
  const getInputProps = useCallback(
    () => ({
      ref: inputRef,
      type: 'file' as const,
      style: { display: 'none' } as const,
      accept: accept.join(','),
      multiple: multiple,
      disabled: disabled,
      onChange: handleInputChange,

      ...(enableFolderUpload ? { webkitdirectory: '', directory: '' } : {}),
    }),
    [accept, disabled, enableFolderUpload, handleInputChange, multiple]
  )

  /**
   * Gets file(s) by index or all files
   * @param {number} [index] - Optional index of file to get
   * @returns {FileState<T>} The requested file(s)
   */
  const getFile = useCallback(
    (index?: number): FileState<T> => {
      if (files === null) return null as FileState<T>

      if (index !== undefined) {
        if (multiple) {
          const fileArray = files as File[]
          return (fileArray[index] ? [fileArray[index]] : []) as FileState<T>
        }
        return files as FileState<T>
      }

      return multiple
        ? ([...(files as File[])] as FileState<T>)
        : (files as FileState<T>)
    },
    [files, multiple]
  )

  /**
   * Gets ArrayBuffer(s) by index or all ArrayBuffers
   * @param {number} [index] - Optional index of ArrayBuffer to get
   * @returns {ArrayBufferState<T>} The requested ArrayBuffer(s)
   */
  const getData = useCallback(
    (index?: number): ArrayBufferState<T> => {
      if (arrayBuffer === null) return null as ArrayBufferState<T>

      if (index !== undefined) {
        if (multiple) {
          const bufferArray = arrayBuffer as ArrayBuffer[]
          return (
            bufferArray[index] ? [bufferArray[index]] : []
          ) as ArrayBufferState<T>
        }
        return arrayBuffer as ArrayBufferState<T>
      }

      return multiple
        ? ([...(arrayBuffer as ArrayBuffer[])] as ArrayBufferState<T>)
        : (arrayBuffer as ArrayBufferState<T>)
    },
    [arrayBuffer, multiple]
  )

  /**
   * Gets progress by index or all progress
   * @param {number} [index] - Optional index of progress to get
   * @returns {number | Record<number, number>} The requested progress
   */
  const getProgress = useCallback(
    (index?: number): number | Record<number, number> => {
      if (!multiple) {
        return progress[0] || 0
      }

      if (index !== undefined) {
        return progress[index] || 0
      }

      return { ...progress }
    },
    [progress, multiple]
  )

  return {
    files: files,
    arrayBuffer,
    error,
    progress,
    isDragActive,
    onDelete,
    abortUpload,
    status,
    getRootProps,
    getInputProps,
    utils: {
      getFile,
      getData,
      getProgress,
    },
  }
}

export { useMuntahaDrop }
