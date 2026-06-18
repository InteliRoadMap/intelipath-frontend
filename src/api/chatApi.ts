import { mainClient } from "./apiClients"
import { ENDPOINTS } from "./endpoints"
import { getStoredToken } from "@/lib/axios"
import { API_BASE_URL } from "@/config/appConfig"

export interface ChatSession {
  sessionId: string
  userId: string
  sessionName: string
  createAt: string
}

export interface ChatMessage {
  messageId: string
  sessionId: string
  role: 'USER' | 'AI' | 'SYSTEM'
  content: string
  createAt: string
}

export interface CreateSessionPayload {
  sessionName: string
}

const chatApi = {
  getSessions: () => mainClient.get<ChatSession[]>(ENDPOINTS.CHAT.SESSIONS),
  createSession: (data: CreateSessionPayload) => mainClient.post<ChatSession>(ENDPOINTS.CHAT.SESSIONS, data),
  updateSession: (sessionId: string, data: { sessionName: string }) => mainClient.put<ChatSession>(ENDPOINTS.CHAT.SESSION(sessionId), data),
  deleteSession: (sessionId: string) => mainClient.delete(ENDPOINTS.CHAT.SESSION(sessionId)),
  getMessages: (sessionId: string) => mainClient.get<ChatMessage[]>(ENDPOINTS.CHAT.MESSAGES(sessionId)),
  
  // Custom fetch function for SSE streaming
  streamMessage: async (sessionId: string, message: string, onMessage: (chunk: string) => void, signal?: AbortSignal) => {
    const token = getStoredToken()
    const url = `${API_BASE_URL}${ENDPOINTS.CHAT.STREAM(sessionId)}`
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ message }),
      signal
    })

    if (!response.ok) {
      throw new Error(`Failed to stream message: ${response.statusText}`)
    }

    if (!response.body) {
      throw new Error('Response body is empty')
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder('utf-8')
    let done = false
    let buffer = ""

    while (!done) {
      const { value, done: readerDone } = await reader.read()
      done = readerDone
      if (value) {
        buffer += decoder.decode(value, { stream: true }).replace(/\r/g, '')
        
        if (response.headers.get('content-type')?.includes('text/event-stream')) {
          let eventEndIndex;
          while ((eventEndIndex = buffer.indexOf('\n\n')) >= 0) {
            const eventStr = buffer.substring(0, eventEndIndex)
            buffer = buffer.substring(eventEndIndex + 2)
            
            const lines = eventStr.split('\n')
            let eventData = ""
            
            for (const line of lines) {
              if (line.startsWith('data:')) {
                const content = line.substring(5)
                // We DO NOT strip the leading space here because Spring WebFlux Flux<String> 
                // does not append the mandatory space. Stripping it will swallow actual spaces.
                eventData += eventData === "" ? content : '\n' + content
              } else if (line.startsWith('event:') || line.startsWith('id:') || line.startsWith('retry:')) {
                // Ignore standard SSE metadata fields
                continue
              } else if (line.trim() === '' && eventData === '') {
                // Ignore leading empty lines in the event block
                continue
              } else {
                // Spring WebFlux bug: string chunk contains newlines but subsequent lines lack 'data:' prefix.
                // We treat these lines as part of the data payload.
                eventData += eventData === "" ? line : '\n' + line
              }
            }
            
            if (eventData !== "" || eventStr.includes('data:')) {
              onMessage(eventData)
            }
          }
        } else {
          onMessage(buffer)
          buffer = ""
        }
      }
    }
  },

  // Upload file to Backend (returns the file URL)
  uploadFile: async (file: File) => {
    const formData = new FormData()
    formData.append("file", file)
    // Remove Content-Type so Axios/Browser can automatically generate it with the required boundary string
    return mainClient.post<{ url: string }>(ENDPOINTS.CHAT.UPLOAD_FILE, formData, {
      transformRequest: [(data, headers) => {
        delete headers['Content-Type'];
        return data;
      }],
    })
  }
}

export default chatApi
