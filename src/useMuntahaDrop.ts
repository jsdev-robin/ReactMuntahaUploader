import React, { useCallback, useEffect, useRef, useState } from 'react'

type AcceptFileTypes =
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

interface EnrichedArrayBuffer {
  buffer: ArrayBuffer
  file: File
}
interface FileUploadState {
  error: string | null
  onRemove: (index?: number) => void
  progress: number | null
  data: EnrichedArrayBuffer[]
  isDragging: boolean
  inputProps: {
    ref: React.RefObject<HTMLInputElement | null>
    onClick: () => void
    type: 'file'
    style: { display: 'none' }
    accept?: string
    multiple?: boolean
    disabled?: boolean
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  }
  rootProps: {
    ref: React.RefObject<HTMLDivElement | null>
    onClick: () => void
    onDragEnter: (e: React.DragEvent<HTMLDivElement>) => void
    onDragOver: (e: React.DragEvent<HTMLDivElement>) => void
    onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void
    onDrop: (e: React.DragEvent<HTMLDivElement>) => void
    'data-dragging': boolean
  }
}

const useMuntahaDrop = (
  options: {
    accepts?: AcceptFileTypes[]
    minSize?: number
    maxSize?: number
    maxFiles?: number
    multiple?: boolean
    disabled?: boolean
    onDrop?: (files: File[] | File) => void
  } = {}
): FileUploadState => {
  const {
    accepts = ['*'],
    maxSize = 10 * 1024 * 1024,
    minSize,
    multiple = false,
    disabled = false,
    maxFiles,
    onDrop,
  } = options

  const inputRef = useRef<HTMLInputElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState<number | null>(null)
  const [data, setData] = useState<EnrichedArrayBuffer[]>([])
  const [isDragging, setIsDragging] = useState<boolean>(false)

  const [files, setFiles] = useState<File[]>([])

  const onClick = useCallback(() => {
    if (inputRef.current && !disabled) {
      inputRef.current?.click()
    }
  }, [disabled])

  const validateFile = useCallback(
    (file: File): boolean => {
      const fileSize = file.size
      const fileType = file.type

      if (fileSize > maxSize) {
        setError(
          `File size exceeds the maximum limit of ${(
            maxSize /
            1024 /
            1024
          ).toFixed(2)} MB.`
        )
        return false
      }

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

      if (
        !accepts.includes('*') &&
        !accepts.some((accept) => {
          if (accept.endsWith('/*')) {
            return fileType.startsWith(accept.split('/*')[0])
          }
          return accept === fileType
        })
      ) {
        setError(
          `File type "${fileType}" is not allowed. Accepted types: ${accepts.join(
            ', '
          )}`
        )
        return false
      }

      setError(null)
      return true
    },
    [accepts, maxSize, minSize]
  )

  const readFiles = (files: File[]): Promise<EnrichedArrayBuffer[]> => {
    const totalSize = files.reduce((sum, file) => sum + file.size, 0)
    let totalLoaded = 0
    const lastLoadedMap = new WeakMap<FileReader, number>()

    return Promise.all(
      files.map(
        (file) =>
          new Promise<EnrichedArrayBuffer>((resolve, reject) => {
            const reader = new FileReader()

            reader.onabort = () => {
              setError('File reading aborted')
              setProgress(null)
              reject(new Error('File reading aborted'))
            }

            reader.onerror = () => {
              setError('Error reading file')
              setProgress(null)
              reject(new Error('Error reading file'))
            }

            reader.onprogress = (event) => {
              if (event.lengthComputable) {
                const lastLoaded = lastLoadedMap.get(reader) || 0
                const loadedDelta = event.loaded - lastLoaded
                totalLoaded += loadedDelta
                lastLoadedMap.set(reader, event.loaded)

                const percent = Math.round((totalLoaded / totalSize) * 100)
                setProgress(percent)
              }
            }

            reader.onloadstart = () => {
              lastLoadedMap.set(reader, 0)
            }

            reader.onloadend = () => {
              if (!reader.result) {
                setError('File could not be read')
                setProgress(null)
                reject(new Error('File could not be read'))
                return
              }
              resolve({
                buffer: reader.result as ArrayBuffer,
                file: file,
              })
            }

            reader.readAsArrayBuffer(file)
          })
      )
    )
  }

  const onChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const filesArray = Array.from(e.target.files)
        let validFiles = filesArray.filter(validateFile)

        if (multiple && maxFiles) {
          const currentCount = files.length
          if (currentCount >= maxFiles) {
            setError(`Maximum of ${maxFiles} files already uploaded.`)
            return false
          }
          if (currentCount + validFiles.length > maxFiles) {
            setError(
              `You can only upload ${maxFiles - currentCount} more file${
                maxFiles - currentCount > 1 ? 's' : ''
              }.`
            )
            validFiles = validFiles.slice(0, maxFiles - currentCount)

            return false
          }
        }

        if (validFiles.length > 0) {
          try {
            const result = await readFiles(validFiles)

            setData((prevData) =>
              multiple ? [...prevData, ...result] : [result[0]]
            )
            setFiles((prevFiles) => {
              const updatedFiles = [...prevFiles, ...validFiles]

              return updatedFiles
            })
          } catch (err) {
            setError(
              err instanceof Error ? err.message : 'Failed to read files'
            )
          }
        }
      }
    },
    [files, maxFiles, multiple, validateFile]
  )

  useEffect(() => {
    if (onDrop) {
      onDrop(multiple ? files : [files[0]])
    }
  }, [files, multiple, onDrop])

  const onRemove = useCallback(
    (index?: number) => {
      if (multiple) {
        if (typeof index === 'number') {
          setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))
          setData((prevData) => prevData.filter((_, i) => i !== index))
        } else {
          setFiles([])
          setData([])
        }
      } else {
        setFiles([])
        setData([])
      }
      setError(null)
      setProgress(null)
    },
    [multiple]
  )

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      setIsDragging(false)

      if (event.dataTransfer.files) {
        const fileList = Array.from(event.dataTransfer.files)
        onChange({
          target: { files: fileList as unknown },
        } as React.ChangeEvent<HTMLInputElement>)
      }
    },
    [onChange]
  )

  return {
    data,
    error,
    onRemove,
    progress,
    isDragging,
    inputProps: {
      ref: inputRef,
      onClick,
      type: 'file',
      style: { display: 'none' },
      accept: accepts.join(','),
      multiple: multiple,
      onChange: onChange,
    },
    rootProps: {
      ref: rootRef,
      onClick,
      onDragEnter: handleDragEnter,
      onDragOver: handleDragOver,
      onDragLeave: handleDragLeave,
      onDrop: handleDrop,
      'data-dragging': isDragging,
    },
  }
}

export { useMuntahaDrop }
