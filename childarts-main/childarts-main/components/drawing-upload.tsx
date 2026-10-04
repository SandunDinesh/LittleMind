"use client"

import { useCallback, useRef, useState } from "react"
import { Upload, ImageIcon, X, AlertTriangle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAnalysis } from "@/lib/analysis-context"
import { cn } from "@/lib/utils"

const ACCEPTED_TYPES = ["image/jpeg", "image/png"]
const MAX_SIZE = 10 * 1024 * 1024 // 10MB

export function DrawingUpload() {
  const { file, preview, status, error, age, setAge, uploadFile, startAnalysis, reset } = useAnalysis()
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(
    (newFile: File) => {
      if (!ACCEPTED_TYPES.includes(newFile.type)) {
        return
      }
      if (newFile.size > MAX_SIZE) {
        return
      }
      uploadFile(newFile)
    },
    [uploadFile]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragActive(false)
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile) handleFile(droppedFile)
    },
    [handleFile]
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0]
      if (selectedFile) handleFile(selectedFile)
    },
    [handleFile]
  )

  const isProcessing = status === "uploading" || status === "analyzing"

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Upload className="h-5 w-5 text-primary" />
          Upload Drawing
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!file ? (
          <div
            role="button"
            tabIndex={0}
            aria-label="Upload drawing area. Click or drag and drop a file."
            className={cn(
              "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 transition-colors",
              dragActive
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50 hover:bg-muted/50"
            )}
            onDragOver={(e) => {
              e.preventDefault()
              setDragActive(true)
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                inputRef.current?.click()
              }
            }}
          >
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <ImageIcon className="h-8 w-8 text-primary" />
            </div>
            <p className="mb-1 text-base font-medium text-foreground">
              Drop your child's drawing here
            </p>
            <p className="mb-4 text-sm text-muted-foreground">
              or click to browse files
            </p>
            <p className="text-xs text-muted-foreground">
              Supports JPG and PNG up to 10MB
            </p>
            <input
              ref={inputRef}
              type="file"
              accept=".jpg,.jpeg,.png"
              className="hidden"
              onChange={handleChange}
              aria-hidden="true"
            />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Preview */}
            <div className="relative overflow-hidden rounded-xl border border-border bg-muted">
              {preview && file.type !== "application/pdf" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={preview}
                  alt="Preview of uploaded drawing"
                  className="mx-auto max-h-80 object-contain p-4"
                />
              ) : (
                <div className="flex h-48 items-center justify-center">
                  <div className="text-center">
                    <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      PDF Preview
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* File info */}
            <div className="flex items-center justify-between rounded-lg bg-muted p-3">
              <div className="flex items-center gap-3">
                <ImageIcon className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              {!isProcessing && status !== "complete" && (
                <Button variant="ghost" size="sm" onClick={reset} aria-label="Remove file">
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            <label className="block text-sm font-medium" htmlFor="child-age">Child age (3–6 years)</label>
            <select id="child-age" value={age} onChange={e => setAge(Number(e.target.value))} disabled={isProcessing} className="w-full rounded-md border bg-background p-2">
              {[3, 4, 5, 6].map(value => <option key={value} value={value}>{value} years</option>)}
            </select>
            {/* Actions */}
            {status === "idle" && (
              <Button
                onClick={startAnalysis}
                className="w-full gap-2"
                size="lg"
              >
                Analyze Drawing
              </Button>
            )}

            {isProcessing && (
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-3 rounded-lg bg-primary/5 p-4">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  <span className="text-sm font-medium text-foreground">
                    {status === "uploading"
                      ? "Uploading drawing..."
                      : "Analyzing drawing features..."}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn(
                      "h-full rounded-full bg-primary transition-all duration-1000",
                      status === "uploading" ? "w-1/3" : "w-2/3"
                    )}
                  />
                </div>
              </div>
            )}

            {status === "error" && (
              <div className="flex items-center gap-3 rounded-lg bg-destructive/10 p-4">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <span className="text-sm text-destructive">
                  {error || "An error occurred. Please try again."}
                </span>
              </div>
            )}

            {status === "complete" && (
              <Button variant="outline" onClick={reset} className="w-full">
                Analyze Another Drawing
              </Button>
            )}
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-4 rounded-lg border border-border bg-muted/50 p-3">
          <p className="text-center text-xs leading-relaxed text-muted-foreground">
            <AlertTriangle className="mr-1 inline h-3 w-3" />
            This tool is for screening purposes only and not a medical diagnosis.
            Always consult with qualified professionals for clinical evaluation.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
