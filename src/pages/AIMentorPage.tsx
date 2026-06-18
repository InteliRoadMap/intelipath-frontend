import { useState, useEffect, useRef } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "@/context"
import { ROUTES } from "@/shared"
import { SharedAppBackground } from "@/components"
import StudentHeader from "@/features/student-dashboard/components/StudentHeader"
import chatApi, { ChatSession, ChatMessage } from "@/api/chatApi"
import { 
  Bot, 
  MessageSquare, 
  Plus, 
  MoreHorizontal, 
  Send, 
  Paperclip, 
  PanelLeftClose, 
  PanelLeftOpen, 
  X,
  FileText,
  Square,
  Edit2,
  Trash2,
  Check,
  Loader2,
  ArrowUp
} from "lucide-react"
import robotImg from "@/assets/robot/head.png"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { motion, AnimatePresence } from 'framer-motion'

export default function AIMentorPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [inputValue, setInputValue] = useState("")
  const [isSending, setIsSending] = useState(false)
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null)
  const [editingSessionName, setEditingSessionName] = useState("")
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  
  const containerRef = useRef<HTMLDivElement>(null)
  const emptyStateRef = useRef<HTMLDivElement>(null)

  // GSAP Elite Animations
  useGSAP(() => {
    // Elegant reveal for empty state if no messages
    if (messages.length === 0 && emptyStateRef.current) {
      gsap.fromTo(".empty-title-word", 
        { y: 40, opacity: 0, rotateX: -45 }, 
        { y: 0, opacity: 1, rotateX: 0, duration: 1.2, stagger: 0.1, ease: "power4.out", delay: 0.2 }
      )
      gsap.fromTo(".empty-subtitle",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.8 }
      )
      gsap.fromTo(".empty-robot",
        { scale: 0.8, opacity: 0, y: 30 },
        { scale: 1, opacity: 1, y: 0, duration: 1.5, ease: "elastic.out(1, 0.5)" }
      )
    }
  }, { dependencies: [messages.length], scope: containerRef })

  useGSAP(() => {
    // Subtle float animation for the robot avatar
    gsap.to(".robot-avatar-float", {
      y: -6,
      duration: 2.5,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut"
    })
  }, { scope: containerRef })

  // Fetch sessions on mount
  useEffect(() => {
    loadSessions()
  }, [])

  // Fetch messages when active session changes
  useEffect(() => {
    if (activeSessionId) {
      loadMessages(activeSessionId)
    } else {
      setMessages([])
    }
  }, [activeSessionId])

  // Auto scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      const scrollContainer = messagesEndRef.current.closest('.overflow-y-auto');
      if (scrollContainer) {
        scrollContainer.scrollTo({
          top: scrollContainer.scrollHeight,
          behavior: 'smooth'
        });
      }
    }
  }, [messages])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`
    }
  }, [inputValue])

  const loadSessions = async () => {
    try {
      const res = await chatApi.getSessions()
      const data = res.data || []
      setSessions(data)
      if (data.length > 0 && !activeSessionId) {
        setActiveSessionId(data[0].sessionId)
      }
    } catch (error) {
      console.error("Failed to load chat sessions:", error)
    }
  }

  const loadMessages = async (sessionId: string) => {
    try {
      const res = await chatApi.getMessages(sessionId)
      setMessages(res.data || [])
    } catch (error) {
      console.error("Failed to load messages:", error)
    }
  }

  const handleCreateSession = async () => {
    try {
      const res = await chatApi.createSession({ sessionName: "New Chat" })
      const newSession = res.data
      setSessions([newSession, ...sessions])
      setActiveSessionId(newSession.sessionId)
    } catch (error) {
      console.error("Failed to create session:", error)
    }
  }

  const handleUpdateSession = async (sessionId: string) => {
    if (!editingSessionName.trim()) {
      setEditingSessionId(null)
      return
    }
    try {
      await chatApi.updateSession(sessionId, { sessionName: editingSessionName })
      setSessions(prev => prev.map(s => s.sessionId === sessionId ? { ...s, sessionName: editingSessionName } : s))
      setEditingSessionId(null)
    } catch (error) {
      console.error("Failed to update session:", error)
    }
  }

  const handleDeleteSession = async (sessionId: string) => {
    try {
      await chatApi.deleteSession(sessionId)
      const newSessions = sessions.filter(s => s.sessionId !== sessionId)
      setSessions(newSessions)
      if (activeSessionId === sessionId) {
        setActiveSessionId(newSessions.length > 0 ? newSessions[0].sessionId : null)
      }
      setSessionToDelete(null)
    } catch (error) {
      console.error("Failed to delete session:", error)
      setSessionToDelete(null)
    }
  }

  const handleSendMessage = async () => {
    if ((!inputValue.trim() && !selectedFile) || isSending || isUploading) return

    let currentSessionId = activeSessionId
    
    // Create session if none exists
    if (!currentSessionId) {
      try {
        const title = inputValue ? (inputValue.length > 20 ? inputValue.substring(0, 20) + "..." : inputValue) : "Document Analysis"
        const res = await chatApi.createSession({ sessionName: title })
        currentSessionId = res.data.sessionId
        setSessions([res.data, ...sessions])
        setActiveSessionId(currentSessionId)
      } catch (error) {
        console.error("Failed to create session:", error)
        return
      }
    }

    let userMsgContent = inputValue
    let fileUrl = ""
    setUploadError(null)

    // Handle file upload first if a file is selected
    if (selectedFile) {
      setIsUploading(true)
      try {
        const uploadRes = await chatApi.uploadFile(selectedFile)
        fileUrl = uploadRes.data.url
        const fileLink = `[Attached File: ${selectedFile.name}](${fileUrl})`
        userMsgContent = userMsgContent ? `${fileLink}\n\n${userMsgContent}` : fileLink
      } catch (error) {
        console.error("Failed to upload file:", error)
        setIsUploading(false)
        setUploadError("Failed to upload file. Please try again.")
        return
      }
      setIsUploading(false)
      setSelectedFile(null)
    }

    setInputValue("")
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }
    setIsSending(true)

    const tempUserMsg: ChatMessage = {
      messageId: Date.now().toString(),
      sessionId: currentSessionId,
      role: 'USER',
      content: userMsgContent,
      createAt: new Date().toISOString()
    }

    const tempAiMsgId = (Date.now() + 1).toString()
    const tempAiMsg: ChatMessage = {
      messageId: tempAiMsgId,
      sessionId: currentSessionId,
      role: 'AI',
      content: '', 
      createAt: new Date().toISOString()
    }

    setMessages(prev => [...prev, tempUserMsg, tempAiMsg])
    abortControllerRef.current = new AbortController()

    try {
      await chatApi.streamMessage(currentSessionId, userMsgContent, (chunk) => {
        setMessages(prev => prev.map(msg => {
          if (msg.messageId === tempAiMsgId) {
            return { ...msg, content: msg.content + chunk }
          }
          return msg
        }))
      }, abortControllerRef.current.signal)
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Stream aborted by user')
      } else {
        console.error("Failed to stream message:", error)
        setMessages(prev => prev.map(msg => {
          if (msg.messageId === tempAiMsgId) {
            return { ...msg, content: msg.content + "\n\n*(Connection interrupted)*" }
          }
          return msg
        }))
      }
    } finally {
      setIsSending(false)
      abortControllerRef.current = null
    }
  }

  const handleStopGenerating = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
      setIsSending(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate(ROUTES.LOGIN)
  }

  const emptyStateTitle = "How can I help you today?".split(" ")

  return (
    <div ref={containerRef} className="flex flex-col h-screen overflow-hidden bg-transparent text-slate-900 font-sans relative selection:bg-[#0a0a0a] selection:text-white">
      <SharedAppBackground />

      <StudentHeader user={user} onLogout={handleLogout} onOpenAiMentor={() => {}} />

      <main className="flex-1 flex overflow-hidden relative z-10 h-screen w-full pt-[80px]">
        <div className="flex w-full h-full bg-transparent overflow-hidden">
          {/* LEFT SIDEBAR - Vercel Style */}
          <aside 
          className={`flex-shrink-0 flex flex-col bg-transparent transition-all duration-300 h-full ${
            isSidebarOpen ? "w-[260px] border-r border-slate-200/40" : "w-0 overflow-hidden border-r-0"
          }`}
        >
          {isSidebarOpen && (
            <div className="flex flex-col h-full w-[260px] p-3">
              
              {/* Vercel Style New Chat Button */}
              <button 
                onClick={handleCreateSession}
                className="group flex items-center justify-between w-full bg-white/50 border border-white/60 hover:bg-white/80 shadow-sm px-3 py-2.5 rounded-xl text-slate-800 font-bold text-[14px] transition-all mb-6"
              >
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center p-1 rounded-md border border-zinc-200 bg-white shadow-sm">
                    <Plus size={14} className="text-zinc-600" />
                  </div>
                  <span>New chat</span>
                </div>
              </button>

              <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar px-1">
                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-2">History</h3>
                <div className="space-y-1">
                  {sessions.length === 0 ? (
                    <div className="px-3 py-2 text-sm text-slate-400 font-medium">It's quiet here.</div>
                  ) : (
                    sessions.map((session) => (
                      <div 
                        key={session.sessionId}
                        onClick={() => setActiveSessionId(session.sessionId)}
                        className={`w-full flex items-center justify-between text-left px-3 py-2.5 rounded-xl text-[14px] group transition-all duration-300 cursor-pointer mb-1 ${
                          activeSessionId === session.sessionId 
                            ? "bg-white shadow-[0_2px_10px_rgb(0,0,0,0.04)] border border-white/80 text-slate-900 font-bold" 
                            : "hover:bg-white/50 text-slate-600 font-medium"
                        }`}
                      >
                        {editingSessionId === session.sessionId ? (
                          <div className="flex-1 flex items-center min-w-0 pr-2" onClick={e => e.stopPropagation()}>
                              <input
                                autoFocus
                                type="text"
                                value={editingSessionName}
                                onChange={e => setEditingSessionName(e.target.value)}
                                onBlur={() => handleUpdateSession(session.sessionId)}
                                onKeyDown={e => {
                                  if (e.key === 'Enter') handleUpdateSession(session.sessionId)
                                  if (e.key === 'Escape') setEditingSessionId(null)
                                }}
                                className="w-full bg-white border border-zinc-300 outline-none rounded-md px-2 py-1 text-[13px] font-medium text-zinc-900 shadow-sm"
                              />
                          </div>
                        ) : (
                          <>
                            <span className="truncate pr-2 flex-1">{session.sessionName || "New Chat"}</span>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                              {sessionToDelete === session.sessionId ? (
                                <>
                                  <span className="text-[11px] font-bold text-red-500 mr-1 animate-pulse">Delete?</span>
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleDeleteSession(session.sessionId)
                                    }}
                                    className="p-1.5 text-white bg-red-500 hover:bg-red-600 rounded-md transition-colors"
                                    title="Confirm Delete"
                                  >
                                    <Check size={13} strokeWidth={3} />
                                  </button>
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setSessionToDelete(null)
                                    }}
                                    className="p-1.5 text-slate-500 hover:bg-slate-200 rounded-md transition-colors"
                                    title="Cancel"
                                  >
                                    <X size={13} strokeWidth={3} />
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setEditingSessionName(session.sessionName || "New Chat")
                                      setEditingSessionId(session.sessionId)
                                    }}
                                    className="p-1.5 text-slate-400 hover:text-[#00838f] hover:bg-[#00838f]/10 rounded-md transition-colors"
                                    title="Rename"
                                  >
                                    <Edit2 size={13} />
                                  </button>
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setSessionToDelete(session.sessionId)
                                    }}
                                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                    title="Delete"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </aside>

        {/* MAIN CHAT AREA */}
        <section className="flex-1 flex flex-col min-w-0 relative h-full bg-transparent">
          {/* Floating Sidebar Toggle */}
          <div className="absolute top-4 left-4 z-20">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-zinc-500 hover:text-zinc-900 transition-colors p-2 bg-white/60 hover:bg-white/80 backdrop-blur-md rounded-lg shadow-[0_2px_10px_rgb(0,0,0,0.04)] border border-white/60"
              title={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
              {isSidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto px-4 md:px-0 scroll-smooth w-full relative z-0">
            <div className="max-w-3xl mx-auto w-full min-h-full flex flex-col pt-12 pb-48">
              
              {messages.length === 0 ? (
                <div ref={emptyStateRef} className="flex-1 flex flex-col items-center justify-center text-center pb-20 mt-10">
                  <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 mb-3 flex gap-2 justify-center flex-wrap">
                    {emptyStateTitle.map((word, i) => (
                      <span key={i} className="empty-title-word inline-block">{word}</span>
                    ))}
                  </h1>
                  <p className="empty-subtitle text-zinc-500 max-w-md text-[15px]">
                    I can assist you with coding, learning, or planning your technical roadmap.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-8 flex-1">
                  <AnimatePresence>
                    {messages.filter(msg => msg.content.trim() !== '' || (msg.role === 'AI' && msg.content === '' && isSending)).map((msg) => {
                      const isUser = msg.role === 'USER'
                      
                      if (isUser) {
                        const fileMatch = msg.content.match(/^\[Attached File: (.*?)\]\((.*?)\)(?:\n\n)?([\s\S]*)$/)
                        
                        return (
                          <motion.div 
                            key={msg.messageId}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="flex justify-end w-full mb-6"
                          >
                            <div className="bg-zinc-100 text-zinc-900 px-4 py-2.5 rounded-2xl max-w-[80%] text-[15px] leading-relaxed text-left flex flex-col gap-2">
                                {fileMatch ? (
                                  <>
                                    <a 
                                      href={fileMatch[2]} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-2 bg-white border border-zinc-200 px-3 py-2 rounded-xl transition-colors hover:bg-zinc-50 w-fit cursor-pointer"
                                    >
                                      <FileText size={16} className="text-zinc-500" />
                                      <span className="font-medium text-zinc-800 text-[14px]">{fileMatch[1]}</span>
                                    </a>
                                    {fileMatch[3] && <div className="whitespace-pre-wrap">{fileMatch[3]}</div>}
                                  </>
                                ) : (
                                  <div className="whitespace-pre-wrap">{msg.content}</div>
                                )}
                            </div>
                          </motion.div>
                        )
                      }

                      // AI Message
                      return (
                        <motion.div 
                          key={msg.messageId}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="flex w-full text-left justify-start mb-6 gap-4"
                        >
                          <div className="w-8 h-8 rounded-full border border-zinc-200 bg-white shadow-sm flex items-center justify-center shrink-0">
                            <span className="text-[14px] font-bold text-slate-800">AI</span>
                          </div>
                          <div className="w-full text-[15px] leading-[1.7] text-zinc-900 mt-1">
                            {msg.content === '' && isSending ? (
                              <div className="flex items-center gap-1.5 h-5">
                                <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce"></div>
                                <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce delay-150"></div>
                                <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce delay-300"></div>
                              </div>
                            ) : (
                              <div className="prose prose-zinc max-w-none prose-p:leading-[1.7] prose-headings:font-semibold prose-headings:mt-6 prose-headings:mb-3 prose-pre:bg-zinc-950 prose-pre:text-zinc-50 prose-pre:border prose-pre:border-zinc-800 prose-pre:rounded-lg prose-pre:p-4 prose-code:text-zinc-800 prose-code:bg-zinc-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:font-mono prose-code:text-[13.5px] prose-a:text-blue-600 prose-a:font-medium">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                  {msg.content}
                                </ReactMarkdown>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>
                  <div ref={messagesEndRef} className="h-4" />
                </div>
              )}
            </div>
          </div>

          {/* Input Area (Vercel Template Style) */}
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#f8fafc] via-[#f8fafc]/90 to-transparent pt-10 pb-6 px-4 md:px-0 z-20">
            <div className="max-w-3xl w-full mx-auto relative">
              
              {/* Stop Generating Button */}
              <AnimatePresence>
                {isSending && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute -top-12 left-1/2 -translate-x-1/2 flex justify-center w-full z-10"
                  >
                    <button 
                      onClick={handleStopGenerating}
                      className="flex items-center gap-2 px-3 py-1.5 bg-white border border-zinc-200 shadow-sm rounded-full text-[13px] font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
                    >
                      <Square size={12} className="fill-zinc-700" /> Stop generating
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="relative flex flex-col bg-white border border-zinc-200 shadow-sm rounded-xl focus-within:ring-2 focus-within:ring-zinc-900 focus-within:ring-offset-2 transition-all">
                
                {/* File Attachment Preview */}
                {selectedFile && (
                  <div className="mx-3 mt-3 flex items-center gap-2 p-1.5 bg-zinc-50 border border-zinc-200 rounded-lg w-fit">
                    <div className="p-1.5 bg-white rounded-md border border-zinc-200 shrink-0">
                      <FileText size={14} className="text-zinc-600" />
                    </div>
                    <div className="flex-1 min-w-0 pr-2">
                      <p className="text-[13px] font-medium text-zinc-700 truncate max-w-[150px]">{selectedFile.name}</p>
                    </div>
                    <button 
                      onClick={() => setSelectedFile(null)}
                      disabled={isUploading || isSending}
                      className="w-6 h-6 rounded-md flex items-center justify-center text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-colors mr-0.5"
                      title="Remove file"
                    >
                      <X size={14} strokeWidth={2} />
                    </button>
                  </div>
                )}

                <div className="flex items-end w-full p-2 gap-2">
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading || isSending}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-500 hover:bg-zinc-100 transition-colors outline-none shrink-0 disabled:opacity-50 mb-1" 
                    title="Attach file"
                  >
                    <Plus size={20} strokeWidth={2} />
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileSelect} 
                    className="hidden" 
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                  />
                  <textarea 
                    ref={textareaRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isSending || isUploading}
                    placeholder={isUploading ? "Uploading..." : "Send a message..."}
                    className="flex-1 w-full bg-transparent border-0 outline-none resize-none py-2.5 px-1 text-zinc-900 placeholder:text-zinc-500 text-[15px] disabled:opacity-50 min-h-[44px] overflow-y-auto"
                    rows={1}
                    style={{ maxHeight: '200px' }}
                  />
                  <div className="shrink-0 mb-1">
                    <button 
                      onClick={handleSendMessage}
                      disabled={(!inputValue.trim() && !selectedFile) || isSending || isUploading}
                      className="flex items-center justify-center w-8 h-8 bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-200 disabled:text-zinc-400 text-white rounded-lg transition-colors outline-none"
                      title="Send message"
                    >
                      {isUploading ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <ArrowUp size={18} strokeWidth={2.5} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="text-center mt-3 h-4">
                {uploadError ? (
                  <p className="text-[12px] font-medium text-red-500">{uploadError}</p>
                ) : (
                  <p className="text-[12px] text-zinc-400">AI can make mistakes. Consider verifying important information.</p>
                )}
              </div>
            </div>
          </div>
        </section>
        </div>
      </main>
    </div>
  )
}
