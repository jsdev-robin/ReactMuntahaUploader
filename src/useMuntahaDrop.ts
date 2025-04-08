import React, { useCallback, useEffect, useRef, useState } from 'react'

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

interface RootProps {
  ref: React.RefObject<HTMLDivElement | null>
  onClick: () => void
  onDragEnter: (e: React.DragEvent<HTMLDivElement>) => void
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void
  'data-dragging': boolean
}

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

interface DropState {
  data: ArrayBuffer[]
  progress: Record<number, number>
  isDragActive: boolean
  onClick: () => void
  onRemove: (index?: number) => void
  error: string | null
  inputProps: InputProps
  rootProps: RootProps
}

interface PropTypes {
  accept?: Accept[]
  minSize?: number
  maxSize?: number
  maxFiles?: number
  multiple?: boolean
  disabled?: boolean
  onDrop?: (files: File[]) => void
  onError?: (err: string | null) => void
}

const useMuntahaDrop = (options: PropTypes = {}): DropState => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const rootRef = useRef<HTMLDivElement | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState<Record<number, number>>({})
  const [isDragActive, setIsDragActive] = useState<boolean>(false)
  const [data, setData] = useState<ArrayBuffer[]>([])
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

  const onClick = useCallback(() => {
    if (inputRef.current && !disabled) {
      inputRef.current?.click()
    }
  }, [disabled])

  const validFile = useCallback(
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

  const readFiles = (files: File[]): Promise<ArrayBuffer[]> => {
    const fileProgress = files.reduce(
      (acc, _, index) => {
        acc[index] = 0
        return acc
      },
      {} as Record<number, number>
    )

    return Promise.all(
      files.map(
        (file, index) =>
          new Promise<ArrayBuffer>((resolve, reject) => {
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
                fileProgress[index] = percent
                setProgress({ ...fileProgress })
              }
            }

            reader.onload = () => {
              if (reader.result instanceof ArrayBuffer) {
                fileProgress[index] = 100
                setProgress({ ...fileProgress })
                resolve(reader.result)
              } else {
                reject(new Error('Invalid file data'))
              }
            }

            reader.readAsArrayBuffer(file)
          })
      )
    )
  }

  const onChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
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

        try {
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
    [files.length, maxFiles, multiple, validFile]
  )

  const onRemove = useCallback(
    (index?: number) => {
      if (multiple) {
        if (typeof index === 'number') {
          setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))
          setData((prevData) => prevData.filter((_, i) => i !== index))
          setProgress((prev) => {
            const newProgress = { ...prev }
            delete newProgress[index]
            return newProgress
          })
        } else {
          setFiles([])
          setData([])
          setProgress({})
        }
      } else {
        setFiles([])
        setData([])
        setProgress({})
      }
      setError(null)
    },
    [multiple]
  )

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(true)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
  }, [])

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

  useEffect(() => {
    if (onDrop) {
      onDrop(files)
    }
  }, [files, onDrop])

  useEffect(() => {
    if (onError) {
      onError(error)
    }
  }, [error, onError])

  const getInputProps = (): InputProps => {
    return {
      ref: inputRef,
      onClick,
      type: 'file',
      style: { display: 'none' },
      accept: accept.join(','),
      multiple,
      disabled,
      onChange,
    }
  }

  const getRootProps = (): RootProps => {
    return {
      ref: rootRef,
      onClick: () => inputRef.current?.click(),
      onDragEnter: handleDragEnter,
      onDragOver: handleDragOver,
      onDragLeave: handleDragLeave,
      onDrop: handleDrop,
      'data-dragging': isDragActive,
    }
  }

  return {
    data,
    progress,
    isDragActive,
    onClick,
    onRemove,
    error,
    inputProps: getInputProps(),
    rootProps: getRootProps(),
  }
}

export { useMuntahaDrop }
