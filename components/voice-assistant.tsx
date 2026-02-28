"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react"

interface VoiceAssistantProps {
  onTranscript: (text: string) => void
  onAutoSubmit?: (text: string) => void
  isEnabled: boolean
  assistantResponse?: string
}

const AUTOCORRECT_DICT: Record<string, string> = {
  // Common speech recognition errors
  "a lot": "a lot",
  alot: "a lot",
  your: "your",
  youre: "you're",
  thats: "that's",
  whats: "what's",
  hows: "how's",
  its: "it's",
  theyre: "they're",
  were: "we're",
  ive: "I've",
  weve: "we've",
  youve: "you've",
  havent: "haven't",
  hasnt: "hasn't",
  dont: "don't",
  doesnt: "doesn't",
  didnt: "didn't",
  cant: "can't",
  wont: "won't",
  shouldnt: "shouldn't",
  couldnt: "couldn't",
  wouldnt: "wouldn't",

  // Financial terms
  stoke: "stock",
  dive: "dive",
  bond: "bond",
  stocks: "stocks",
  etf: "ETF",
  "401k": "401k",
  ira: "IRA",
  bitcoin: "Bitcoin",
  ethereum: "Ethereum",
  crypto: "crypto",
  portfolio: "portfolio",
  diversify: "diversify",
  rebalance: "rebalance",
  dividend: "dividend",
  "mutual fund": "mutual fund",
  "index fund": "index fund",
  "robo advisor": "robo-advisor",
  algorithmic: "algorithmic",
  volatility: "volatility",
  leverage: "leverage",
  hedging: "hedging",
  "short selling": "short selling",
  margin: "margin",
  "bull market": "bull market",
  "bear market": "bear market",

  // Common misspellings
  recieve: "receive",
  bussiness: "business",
  occured: "occurred",
  seperate: "separate",
  writting: "writing",
  occassion: "occasion",
  hieght: "height",
  definately: "definitely",
  aquire: "acquire",
  adress: "address",
}

function autocorrectText(text: string): string {
  let corrected = text.toLowerCase()

  Object.entries(AUTOCORRECT_DICT).forEach(([error, correct]) => {
    const regex = new RegExp(`\\b${error}\\b`, "gi")
    corrected = corrected.replace(regex, correct)
  })

  return corrected.charAt(0).toUpperCase() + corrected.slice(1)
}

export function VoiceAssistant({ onTranscript, onAutoSubmit, isEnabled, assistantResponse }: VoiceAssistantProps) {
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const recognitionRef = useRef<any>(null)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = false
        recognitionRef.current.lang = "en-US"

        recognitionRef.current.onstart = () => {
          setIsListening(true)
        }

        recognitionRef.current.onend = () => {
          setIsListening(false)
        }

        recognitionRef.current.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0].transcript)
            .join("")

          const correctedTranscript = autocorrectText(transcript)
          onTranscript(correctedTranscript)

          if (onAutoSubmit) {
            onAutoSubmit(correctedTranscript)
          }
        }

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error", event.error)
        }
      }
    }
  }, [onTranscript, onAutoSubmit])

  const toggleListening = () => {
    if (!recognitionRef.current) return

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      recognitionRef.current.start()
    }
  }

  const speakResponse = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel()
      utteranceRef.current = new SpeechSynthesisUtterance(text)
      utteranceRef.current.rate = 0.9
      utteranceRef.current.pitch = 1
      utteranceRef.current.onstart = () => setIsSpeaking(true)
      utteranceRef.current.onend = () => setIsSpeaking(false)
      window.speechSynthesis.speak(utteranceRef.current)
    }
  }

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }

  if (!isEnabled) return null

  return (
    <div className="flex gap-2">
      <Button
        onClick={toggleListening}
        disabled={isSpeaking}
        title={isListening ? "Stop listening" : "Start listening"}
        className={`px-3 py-2 rounded-lg transition-all ${
          isListening
            ? "bg-destructive text-destructive-foreground"
            : "bg-secondary text-secondary-foreground hover:bg-muted"
        }`}
      >
        {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
      </Button>

      {assistantResponse && (
        <Button
          onClick={() => (isSpeaking ? stopSpeaking() : speakResponse(assistantResponse))}
          title={isSpeaking ? "Stop speaking" : "Speak response"}
          className={`px-3 py-2 rounded-lg transition-all ${
            isSpeaking
              ? "bg-destructive text-destructive-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-muted"
          }`}
        >
          {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </Button>
      )}
    </div>
  )
}
