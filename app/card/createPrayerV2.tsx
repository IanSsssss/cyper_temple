"use client"

import React, {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react"
import { ArrowLeftIcon } from "lucide-react"
import { AnimatePresence, MotionConfig, motion } from "motion/react"
import { cn, TalkToGeminiGod } from "@/lib/utils"
import { submitMessage } from "../contract"
import { MiracleModal } from "./term"

const TRANSITION = {
  type: "spring",
  bounce: 0.1,
  duration: 0.4,
}

interface FloatingPanelContextType {
  isOpen: boolean
  openFloatingPanel: (rect: DOMRect) => void
  closeFloatingPanel: () => void
  uniqueId: string
  note: string
  setNote: (note: string) => void
  author: string
  setAuthor: (author: string) => void
  triggerRect: DOMRect | null
  title: string
  setTitle: (title: string) => void
}

const FloatingPanelContext = createContext<FloatingPanelContextType | undefined>(undefined)

function useFloatingPanel() {
  const context = useContext(FloatingPanelContext)
  if (!context) {
    throw new Error("useFloatingPanel must be used within a FloatingPanelProvider")
  }
  return context
}

interface FloatingPanelRootProps {
  children: React.ReactNode
  className?: string
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  note: string
  setNote: (note: string) => void
  author: string
  setAuthor: (author: string) => void
  triggerRect: DOMRect | null
  setTriggerRect: (rect: DOMRect | null) => void
  title: string
  setTitle: (title: string) => void
}

function FloatingPanelRoot({ 
  children, 
  className,
  isOpen,
  setIsOpen,
  note,
  setNote,
  author,
  setAuthor,
  triggerRect,
  setTriggerRect,
  title,
  setTitle
}: FloatingPanelRootProps) {
  const uniqueId = useId()
  const openFloatingPanel = (rect: DOMRect) => {
    setTriggerRect(rect)
    setIsOpen(true)
  }

  const closeFloatingPanel = () => {
    setIsOpen(false)
    setNote("")
    setAuthor("")
  }

  const value = {
    isOpen,
    openFloatingPanel,
    closeFloatingPanel,
    note,
    setNote,
    author,
    setAuthor,
    triggerRect,
    title,
    setTitle,
    uniqueId
  }

  return (
    <FloatingPanelContext.Provider value={value}>
      <MotionConfig transition={TRANSITION}>
        <div className={cn("relative", className)}>{children}</div>
      </MotionConfig>
    </FloatingPanelContext.Provider>
  )
}

interface FloatingPanelTriggerProps {
  children: React.ReactNode
  className?: string
  title: string
  onClick?: () => void
}

function FloatingPanelTrigger({ children, className, title, onClick }: FloatingPanelTriggerProps) {
  const { openFloatingPanel, uniqueId, setTitle } = useFloatingPanel()
  const triggerRef = useRef<HTMLButtonElement>(null)

  const handleClick = () => {
    if (triggerRef.current) {
      openFloatingPanel(triggerRef.current.getBoundingClientRect())
      setTitle(title)
    }
    onClick?.()
  }

  return (
    <motion.button
      ref={triggerRef}
      layoutId={`floating-panel-trigger-${uniqueId}`}
      className={cn(
        "flex h-9 items-center border border-zinc-950/10 bg-white px-3 text-zinc-950 dark:border-zinc-50/10 dark:bg-zinc-700 dark:text-zinc-50",
        className
      )}
      style={{ borderRadius: 8 }}
      onClick={handleClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.span layoutId={`floating-panel-label-${uniqueId}`} className="text-sm">
        {children}
      </motion.span>
    </motion.button>
  )
}

interface FloatingPanelContentProps {
  children: React.ReactNode
  className?: string
}

function FloatingPanelContent({ children, className }: FloatingPanelContentProps) {
  const { isOpen, closeFloatingPanel, uniqueId, triggerRect, title } = useFloatingPanel()
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
        closeFloatingPanel()
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [closeFloatingPanel])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeFloatingPanel()
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [closeFloatingPanel])

  const variants = {
    hidden: { opacity: 0, scale: 0.9, y: 10 },
    visible: { opacity: 1, scale: 1, y: 0 },
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ backdropFilter: "blur(0px)" }}
            animate={{ backdropFilter: "blur(4px)" }}
            exit={{ backdropFilter: "blur(0px)" }}
            className="fixed inset-0 z-40"
          />
          <motion.div
            ref={contentRef}
            layoutId={`floating-panel-${uniqueId}`}
            className={cn(
              "fixed z-50 overflow-hidden border border-zinc-950/10 bg-white shadow-lg outline-none dark:border-zinc-50/10 dark:bg-zinc-800",
              className
            )}
            style={{
              borderRadius: 12,
              left: triggerRect ? triggerRect.left - 380 : "50%",
              top: triggerRect ? triggerRect.bottom + 8 : "50%",
              transformOrigin: "top left",
            }}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={variants}
          >
            <motion.div className="px-4 py-2 font-semibold text-zinc-900 dark:text-zinc-100">
              {title}
            </motion.div>
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

interface FloatingPanelFormProps {
  children: React.ReactNode
  onSubmit?: (e: React.FormEvent) => void
  className?: string
}

function FloatingPanelForm({ children, onSubmit, className }: FloatingPanelFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.(e)
  }

  return (
    <form className={cn("flex h-full flex-col", className)} onSubmit={handleSubmit}>
      {children}
    </form>
  )
}

interface FloatingPanelLabelProps {
  children: React.ReactNode
  htmlFor: string
  className?: string
}

function FloatingPanelLabel({ children, htmlFor, className }: FloatingPanelLabelProps) {
  const { note } = useFloatingPanel()

  return (
    <motion.label
      htmlFor={htmlFor}
      style={{ opacity: note ? 0 : 1 }}
      className={cn("block mb-2 text-sm font-medium text-zinc-900 dark:text-zinc-100", className)}
    >
      {children}
    </motion.label>
  )
}

interface FloatingPanelBodyProps {
  children: React.ReactNode
  className?: string
}

function FloatingPanelBody({ children, className }: FloatingPanelBodyProps) {
  return (
    <motion.div
      className={cn("p-4", className)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {children}
    </motion.div>
  )
}

interface FloatingPanelFooterProps {
  children: React.ReactNode
  className?: string
}

function FloatingPanelFooter({ children, className }: FloatingPanelFooterProps) {
  return (
    <motion.div
      className={cn("flex justify-between px-4 py-3", className)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      {children}
    </motion.div>
  )
}

interface FloatingPanelCloseButtonProps {
  className?: string
}

function FloatingPanelCloseButton({ className }: FloatingPanelCloseButtonProps) {
  const { closeFloatingPanel } = useFloatingPanel()

  return (
    <motion.button
      type="button"
      className={cn("flex items-center", className)}
      onClick={closeFloatingPanel}
      aria-label="Close floating panel"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <ArrowLeftIcon size={16} className="text-zinc-900 dark:text-zinc-100" />
    </motion.button>
  )
}

interface FloatingPanelSubmitButtonProps {
  className?: string
}

function FloatingPanelSubmitButton({ className }: FloatingPanelSubmitButtonProps) {
  return (
    <motion.button
      className={cn(
        "relative ml-1 flex h-8 shrink-0 scale-100 select-none appearance-none items-center justify-center rounded-lg border border-zinc-950/10 bg-transparent px-2 text-sm text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 focus-visible:ring-2 active:scale-[0.98] dark:border-zinc-50/10 dark:text-zinc-50 dark:hover:bg-zinc-800",
        className
      )}
      type="submit"
      aria-label="Submit note"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      Submit
    </motion.button>
  )
}

export function SubmitPrayer({ godId , godName}: { godId: string, godName: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [note, setNote] = useState("")
  const [author, setAuthor] = useState("")
  const [triggerRect, setTriggerRect] = useState<DOMRect | null>(null)
  const [title, setTitle] = useState("")
  const [showMiracleModal, setShowMiracleModal] = useState(false)
  const [prayerText, setPrayerText] = useState("")
  const [godResponse, setGodResponse] = useState("")

  const handleClick = () => {
    const walletAddress = sessionStorage.getItem('walletAddress')
    if (!walletAddress) {
      alert('请先登录钱包！')
      return
    }
    setIsOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const author = form.author?.value
    const prayer = form.prayer?.value

    if (!author || !prayer) {
      alert("作者和祈祷内容不能为空！")
      return
    }

    try {
      await submitMessage(prayer, author, godId)
      setPrayerText(prayer)
      setGodResponse(await TalkToGeminiGod(author, prayer, godName)) 
      setIsOpen(false)
      setShowMiracleModal(true)
    } catch (error) {
      console.error("Submit failed:", error)
      alert("Submit failed")
    }
  }

  return (
    <>
      <FloatingPanelRoot
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        note={note}
        setNote={setNote}
        author={author}
        setAuthor={setAuthor}
        triggerRect={triggerRect}
        setTriggerRect={setTriggerRect}
        title={title}
        setTitle={setTitle}
      >
        <FloatingPanelTrigger
          title="Add Prayer"
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          onClick={handleClick}
        >
          <span>Add Prayer</span>
        </FloatingPanelTrigger>
        <FloatingPanelContent className="w-[480px]">
          <FloatingPanelForm onSubmit={handleSubmit}>
            <FloatingPanelBody>
              <div className="space-y-2">
                <div>
                  <FloatingPanelLabel htmlFor="author-input">Author</FloatingPanelLabel>
                  <input
                    id="author-input"
                    name="author"
                    className="w-full px-3 py-1.5 rounded-md bg-transparent border border-zinc-950/10 text-sm outline-none dark:border-zinc-50/10"
                    placeholder="Enter author name"
                  />
                </div>
                <div>
                  <FloatingPanelLabel htmlFor="note-input">Prayer</FloatingPanelLabel>
                  <textarea
                    id="note-input"
                    name="prayer"
                    className="w-full min-h-[35px] px-3 py-1.5 rounded-md bg-transparent border border-zinc-950/10 text-sm outline-none dark:border-zinc-50/10 resize-none"
                  />
                </div>
              </div>
            </FloatingPanelBody>
            <FloatingPanelFooter>
              <FloatingPanelCloseButton />
              <FloatingPanelSubmitButton />
            </FloatingPanelFooter>
          </FloatingPanelForm>
        </FloatingPanelContent>
      </FloatingPanelRoot>
      {showMiracleModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowMiracleModal(false)} />
          <div className="relative bg-transparent p-6 rounded-lg w-[70%]">
            <MiracleModal text={prayerText} godResponse={godResponse} />
            <button
              className="mt-4 bg-black-500 text-white px-4 py-2 rounded"
              onClick={() => setShowMiracleModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  )
}
