import {
  CanvasNode,
  CodeFile,
  FrameNode,
  framer,
  isCodeFileComponentExport,
} from "framer-plugin"

const APPEAR_COMPONENT_FILE = "MotionKitAppear.tsx"
const APPEAR_COMPONENT_EXPORT = "MotionKitAppear"
const APPEAR_GENERATED_URL = "generated://appear-frame"

const APPEAR_COMPONENT_CODE = `/**
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 */
import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

type Props = {
  label: string
  color: string
  radius: number
  startOpacity: number
  distance: number
  duration: number
  delay: number
  shadow: boolean
}

export default function MotionKitAppear(props: Props) {
  const {
    label,
    color,
    radius,
    startOpacity,
    distance,
    duration,
    delay,
    shadow,
  } = props

  const [isReady, setIsReady] = React.useState(false)

  React.useEffect(() => {
    const frame = requestAnimationFrame(() => setIsReady(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: radius,
        background:
          "linear-gradient(145deg, rgba(255,255,255,0.18), rgba(255,255,255,0.02)), " + color,
        color: "white",
        fontSize: 24,
        fontWeight: 600,
        letterSpacing: "-0.04em",
        opacity: isReady ? 1 : startOpacity,
        transform: isReady ? "translateY(0px)" : \`translateY(\${distance}px)\`,
        transition:
          \`opacity \${duration}s cubic-bezier(0.22, 1, 0.36, 1) \${delay}s, transform \${duration}s cubic-bezier(0.22, 1, 0.36, 1) \${delay}s\`,
        boxShadow: shadow
          ? "0 28px 80px rgba(4, 17, 29, 0.28)"
          : "none",
        overflow: "hidden",
      }}
    >
      {label}
    </div>
  )
}

MotionKitAppear.defaultProps = {
  label: "Appear",
  color: "#0ea5e9",
  radius: 24,
  startOpacity: 0,
  distance: 26,
  duration: 0.45,
  delay: 0,
  shadow: true,
}

addPropertyControls(MotionKitAppear, {
  label: { type: ControlType.String, title: "Label" },
  color: { type: ControlType.Color, title: "Color" },
  radius: {
    type: ControlType.Number,
    title: "Radius",
    min: 0,
    max: 80,
    step: 1,
  },
  startOpacity: {
    type: ControlType.Number,
    title: "Start",
    min: 0,
    max: 1,
    step: 0.05,
  },
  distance: {
    type: ControlType.Number,
    title: "Distance",
    min: 0,
    max: 120,
    step: 1,
  },
  duration: {
    type: ControlType.Number,
    title: "Duration",
    min: 0.1,
    max: 2,
    step: 0.05,
  },
  delay: {
    type: ControlType.Number,
    title: "Delay",
    min: 0,
    max: 1,
    step: 0.05,
  },
  shadow: { type: ControlType.Boolean, title: "Shadow" },
})
`

function isAppearCodeFile(file: CodeFile) {
  return file.name === APPEAR_COMPONENT_FILE || file.path.endsWith(`/${APPEAR_COMPONENT_FILE}`)
}

async function getOrCreateAppearCodeFile() {
  const files = await framer.getCodeFiles()
  const existing = files.find(isAppearCodeFile)

  if (existing) {
    if (existing.content !== APPEAR_COMPONENT_CODE) {
      return existing.setFileContent(APPEAR_COMPONENT_CODE)
    }

    return existing
  }

  return framer.createCodeFile(APPEAR_COMPONENT_FILE, APPEAR_COMPONENT_CODE, {
    editViaPlugin: true,
  })
}

function getAppearInsertUrl(codeFile: CodeFile) {
  const componentExport = codeFile.exports.find(
    (exportItem) =>
      isCodeFileComponentExport(exportItem)
      && exportItem.name === APPEAR_COMPONENT_EXPORT,
  )

  if (!componentExport) {
    throw new Error("MotionKitAppear export was not found in the generated code file.")
  }

  return componentExport.insertURL
}

function px(value: number) {
  return `${Math.max(1, Math.round(value))}px`
}

async function buildAppearAttributes(selection: CanvasNode[]) {
  const target = selection[0]
  const rect = await target?.getRect()

  const width = rect?.width ?? 320
  const height = rect?.height ?? 220
  const left = rect?.x ?? 120
  const top = rect?.y ?? 120

  const color =
    target instanceof FrameNode && typeof target.backgroundColor === "string"
      ? target.backgroundColor
      : "#0ea5e9"

  return {
    left: px(left),
    top: px(top),
    width: px(width),
    height: px(height),
    controls: {
      label:
        target instanceof FrameNode
          ? target.name || "Appear Frame"
          : "Appear Frame",
      color,
      radius: 24,
      startOpacity: 0,
      distance: 26,
      duration: 0.45,
      delay: 0,
      shadow: true,
    },
  }
}

export function isGeneratedAppearSource(sourceUrl: string) {
  return sourceUrl === APPEAR_GENERATED_URL
}

export async function insertGeneratedAppear(selection: CanvasNode[]) {
  const codeFile = await getOrCreateAppearCodeFile()
  const insertURL = getAppearInsertUrl(codeFile)
  const attributes = await buildAppearAttributes(selection)

  await framer.addComponentInstance({
    url: insertURL,
    attributes,
  })

  await framer.notify("Inserted MotionKitAppear into the current project.", {
    variant: "success",
    durationMs: 2000,
  })
}
