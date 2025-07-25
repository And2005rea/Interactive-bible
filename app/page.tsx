"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Slider } from "@/components/ui/slider"
import {
  Search,
  Plus,
  Crown,
  Type,
  Copy,
  Share2,
  Heart,
  MessageCircle,
  Scroll,
  Volume2,
  Menu,
  ChevronLeft,
  ChevronRight,
  Send,
  Bookmark,
  StickyNote,
  Users,
  Home,
  Bold,
  Italic,
  Highlighter,
  FileText,
  X,
  Tag,
} from "lucide-react"

// Interfaces
interface Verse {
  id: string
  book: string
  chapter: number
  verse: number
  text: string
  reference: string
  comments: Comment[]
  proverbios: Proverbio[]
  isFavorite: boolean
  participations: number
  hebrewText?: string
  transliteration?: string
  gematria?: WordGematria[]
  userNotes?: string
  textFormat?: {
    fontSize: number
    isBold: boolean
    isItalic: boolean
  }
  highlightedText?: string
}

interface WordGematria {
  spanish: string
  hebrew: string
  transliteration: string
  value: number
  meaning: string
  letterValues: { letter: string; value: number }[]
}

interface Comment {
  id: string
  user: string
  content: string
  timestamp: string
  subComments: SubComment[]
  isExpanded: boolean
}

interface SubComment {
  id: string
  user: string
  content: string
  timestamp: string
  taggedVerse?: {
    reference: string
    comment: string
  }
}

interface Proverbio {
  id: string
  user: string
  content: string
  background: string
  textColor: string
  fontSize: number
  fontFamily: string
  timestamp: string
}

interface BiblicalBook {
  id: string
  name: string
  abbreviation: string
  testament: "AT" | "NT"
  chapters: number
}

interface CurrentUser {
  id: string
  name: string
  biblicalName: string
  emoji: string
  joinDate: string
  notesCount: number
  participationsCount: number
  bio: string
  apuntes: string[]
  ilustraciones: string[]
  traducciones: string[]
  savedNotes: SavedNote[]
}

interface SavedNote {
  id: string
  title: string
  content: string
  date: string
  verseReference?: string
}

interface SearchResult {
  verse: Verse
  highlighted: string
}

interface BiblicalCharacter {
  name: string
  emoji: string
  color: string
}

// Data
const biblicalCharacters: BiblicalCharacter[] = [
  { name: "David", emoji: "👑", color: "bg-purple-500" },
  { name: "Daniel", emoji: "🦁", color: "bg-purple-500" },
  { name: "Ester", emoji: "🌟", color: "bg-purple-500" },
  { name: "María", emoji: "🕊️", color: "bg-purple-500" },
  { name: "Pablo", emoji: "🎭", color: "bg-purple-500" },
  { name: "Pedro", emoji: "🎣", color: "bg-purple-500" },
  { name: "Juan", emoji: "📖", color: "bg-purple-500" },
  { name: "Moisés", emoji: "⚡", color: "bg-purple-500" },
  { name: "Abraham", emoji: "🌟", color: "bg-purple-500" },
  { name: "Sara", emoji: "👸", color: "bg-purple-500" },
]

const biblicalBooks: BiblicalBook[] = [
  { id: "gen", name: "Génesis", abbreviation: "Gen", testament: "AT", chapters: 50 },
  { id: "exo", name: "Éxodo", abbreviation: "Exo", testament: "AT", chapters: 40 },
  { id: "lev", name: "Levítico", abbreviation: "Lev", testament: "AT", chapters: 27 },
  { id: "num", name: "Números", abbreviation: "Núm", testament: "AT", chapters: 36 },
  { id: "deu", name: "Deuteronomio", abbreviation: "Deu", testament: "AT", chapters: 34 },
  { id: "jos", name: "Josué", abbreviation: "Jos", testament: "AT", chapters: 24 },
  { id: "jue", name: "Jueces", abbreviation: "Jue", testament: "AT", chapters: 21 },
  { id: "isa", name: "Isaías", abbreviation: "Isa", testament: "AT", chapters: 66 },
  { id: "dan", name: "Daniel", abbreviation: "Dan", testament: "AT", chapters: 12 },
  { id: "sal", name: "Salmos", abbreviation: "Sal", testament: "AT", chapters: 150 },
  { id: "ecl", name: "Eclesiastés", abbreviation: "Ecl", testament: "AT", chapters: 12 },
  { id: "pro", name: "Proverbios", abbreviation: "Pro", testament: "AT", chapters: 31 },
  { id: "ose", name: "Oseas", abbreviation: "Ose", testament: "AT", chapters: 14 },
  { id: "mat", name: "Mateo", abbreviation: "Mat", testament: "NT", chapters: 28 },
  { id: "mar", name: "Marcos", abbreviation: "Mar", testament: "NT", chapters: 16 },
  { id: "luc", name: "Lucas", abbreviation: "Luc", testament: "NT", chapters: 24 },
  { id: "jua", name: "Juan", abbreviation: "Jua", testament: "NT", chapters: 21 },
  { id: "apo", name: "Apocalipsis", abbreviation: "Apo", testament: "NT", chapters: 22 },
]

// Ejemplo de versículo con traducción completa (Génesis 1:1)
const translationVerse: Verse = {
  id: "translation-example",
  book: "Génesis",
  chapter: 1,
  verse: 1,
  text: "En el principio creó Dios los cielos y la tierra.",
  reference: "Génesis 1:1",
  hebrewText: "בְּרֵאשִׁית בָּרָא אֱלֹהִים אֵת הַשָּׁמַיִם וְאֵת הָאָרֶץ",
  transliteration: "Bereshit bara Elohim et hashamayim ve'et ha'aretz.",
  gematria: [
    {
      spanish: "principio",
      hebrew: "בְּרֵאשִׁית",
      transliteration: "Bereshit",
      value: 913,
      meaning:
        "En el comienzo absoluto, el punto de partida de toda la creación. Esta palabra implica no solo un inicio temporal, sino el fundamento mismo de la existencia.",
      letterValues: [
        { letter: "ב", value: 2 },
        { letter: "ר", value: 200 },
        { letter: "א", value: 1 },
        { letter: "ש", value: 300 },
        { letter: "י", value: 10 },
        { letter: "ת", value: 400 },
      ],
    },
    {
      spanish: "creó",
      hebrew: "בָּרָא",
      transliteration: "bara",
      value: 203,
      meaning: "Crear de la nada, acto divino de creación",
      letterValues: [
        { letter: "ב", value: 2 },
        { letter: "ר", value: 200 },
        { letter: "א", value: 1 },
      ],
    },
    {
      spanish: "Dios",
      hebrew: "אֱלֹהִים",
      transliteration: "Elohim",
      value: 86,
      meaning: "Nombre plural de Dios, indica majestad y poder",
      letterValues: [
        { letter: "א", value: 1 },
        { letter: "ל", value: 30 },
        { letter: "ה", value: 5 },
        { letter: "י", value: 10 },
        { letter: "ם", value: 40 },
      ],
    },
  ],
  comments: [],
  proverbios: [],
  isFavorite: false,
  participations: 2847,
  textFormat: {
    fontSize: 18,
    isBold: false,
    isItalic: true,
  },
}

// Versículos con comentarios y proverbios para la pantalla inicial
const featuredVerses: Verse[] = [
  {
    id: "featured-1",
    book: "Génesis",
    chapter: 6,
    verse: 4,
    text: "Había gigantes en la tierra en aquellos días, y también después que se llegaron los hijos de Dios a las hijas de los hombres, y les engendraron hijos; estos fueron los valientes que desde la antigüedad fueron varones de renombre.",
    reference: "Génesis 6:4",
    comments: [
      {
        id: "c1",
        user: "Daniel",
        content:
          "Este versículo ha sido interpretado como evidencia de una mezcla entre lo divino y lo humano, lo cual desafía la separación clásica entre ambos planos.",
        timestamp: "hace 3 horas",
        subComments: [
          {
            id: "sc1",
            user: "David",
            content:
              "La existencia de 'gigantes' y 'hijos de Dios' sugiere una mitología más compleja dentro del relato bíblico.",
            timestamp: "hace 2 horas",
          },
        ],
        isExpanded: false,
      },
      {
        id: "c2",
        user: "María",
        content: "Algunos creen que aquí se insinúa una intervención de seres celestiales en la historia humana.",
        timestamp: "hace 5 horas",
        subComments: [],
        isExpanded: false,
      },
    ],
    proverbios: [
      {
        id: "p1",
        user: "Moisés",
        content: "Lo que parece imposible para el hombre, es posible cuando lo divino interviene.",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        textColor: "#ffffff",
        fontSize: 18,
        fontFamily: "serif",
        timestamp: "hace 1 día",
      },
    ],
    isFavorite: false,
    participations: 847,
    textFormat: {
      fontSize: 16,
      isBold: false,
      isItalic: false,
    },
  },
  {
    id: "featured-2",
    book: "Éxodo",
    chapter: 3,
    verse: 14,
    text: "Y respondió Dios a Moisés: Yo soy el que soy. Y dijo: Así dirás a los hijos de Israel: Yo soy me envió a vosotros.",
    reference: "Éxodo 3:14",
    comments: [
      {
        id: "c3",
        user: "Moisés",
        content:
          "Esta es una de las formulaciones más abstractas de Dios en toda la Biblia; define a Dios por su existencia en sí misma, sin atributos.",
        timestamp: "hace 1 hora",
        subComments: [],
        isExpanded: false,
      },
      {
        id: "c4",
        user: "Pablo",
        content:
          "Puede interpretarse como una afirmación de que Dios no puede ser reducido a nombres, categorías o imágenes.",
        timestamp: "hace 4 horas",
        subComments: [
          {
            id: "sc4",
            user: "Juan",
            content: "Exactamente, Pablo. Dios trasciende toda definición humana.",
            timestamp: "hace 3 horas",
          },
        ],
        isExpanded: false,
      },
    ],
    proverbios: [
      {
        id: "p2",
        user: "Abraham",
        content: "Dios no necesita definirse, porque Él es la definición misma del ser.",
        background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
        textColor: "#ffffff",
        fontSize: 16,
        fontFamily: "sans-serif",
        timestamp: "hace 2 días",
      },
    ],
    isFavorite: false,
    participations: 1203,
    textFormat: {
      fontSize: 16,
      isBold: false,
      isItalic: false,
    },
  },
  {
    id: "featured-3",
    book: "Isaías",
    chapter: 45,
    verse: 7,
    text: "Yo formo la luz y creo las tinieblas, hago la paz y creo el mal. Yo Jehová soy el que hago todo esto.",
    reference: "Isaías 45:7",
    comments: [
      {
        id: "c5",
        user: "Juan",
        content: "Este versículo pone en jaque la idea de que el mal proviene exclusivamente de Satanás.",
        timestamp: "hace 2 horas",
        subComments: [
          {
            id: "sc2",
            user: "Pedro",
            content:
              "Reconocer que Dios 'crea el mal' implica una visión más amplia, incluso perturbadora, de su soberanía.",
            timestamp: "hace 1 hora",
          },
        ],
        isExpanded: false,
      },
    ],
    proverbios: [
      {
        id: "p3",
        user: "Sara",
        content: "En la dualidad de la existencia, Dios es el arquitecto de ambos extremos.",
        background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
        textColor: "#ffffff",
        fontSize: 17,
        fontFamily: "serif",
        timestamp: "hace 3 días",
      },
    ],
    isFavorite: false,
    participations: 692,
    textFormat: {
      fontSize: 16,
      isBold: false,
      isItalic: false,
    },
  },
  {
    id: "featured-4",
    book: "Mateo",
    chapter: 10,
    verse: 34,
    text: "No penséis que he venido para traer paz a la tierra; no he venido para traer paz, sino espada.",
    reference: "Mateo 10:34",
    comments: [
      {
        id: "c6",
        user: "Ester",
        content: "Contradice la imagen clásica de Jesús como pacificador universal.",
        timestamp: "hace 6 horas",
        subComments: [],
        isExpanded: false,
      },
      {
        id: "c7",
        user: "Abraham",
        content: "Subraya el conflicto que genera seguir a Cristo, incluso dentro de las familias.",
        timestamp: "hace 3 horas",
        subComments: [
          {
            id: "sc7",
            user: "María",
            content: "A veces la verdad divide antes de unir. Es parte del proceso de transformación.",
            timestamp: "hace 2 horas",
          },
        ],
        isExpanded: false,
      },
    ],
    proverbios: [
      {
        id: "p4",
        user: "Daniel",
        content: "La verdad no siempre trae paz; a veces trae la espada que corta las mentiras.",
        background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
        textColor: "#ffffff",
        fontSize: 16,
        fontFamily: "sans-serif",
        timestamp: "hace 4 días",
      },
    ],
    isFavorite: false,
    participations: 934,
    textFormat: {
      fontSize: 16,
      isBold: false,
      isItalic: false,
    },
  },
]

const principioResults: Verse[] = [
  {
    id: "1",
    book: "Génesis",
    chapter: 1,
    verse: 1,
    text: "En el principio creó Dios los cielos y la tierra.",
    reference: "Génesis 1:1",
    comments: [],
    proverbios: [],
    isFavorite: false,
    participations: 1024,
    textFormat: { fontSize: 16, isBold: false, isItalic: false },
  },
  {
    id: "2",
    book: "Génesis",
    chapter: 41,
    verse: 21,
    text: "y éstas entraban en sus entrañas, mas no se conocía que hubiesen entrado, porque la apariencia de las flacas era aún mala, como al principio. Y yo desperté.",
    reference: "Génesis 41:21",
    comments: [],
    proverbios: [],
    isFavorite: false,
    participations: 456,
    textFormat: { fontSize: 16, isBold: false, isItalic: false },
  },
  {
    id: "3",
    book: "Génesis",
    chapter: 43,
    verse: 20,
    text: "Y dijeron: Ay, señor nuestro, nosotros en realidad de verdad descendimos al principio a comprar alimentos.",
    reference: "Génesis 43:20",
    comments: [],
    proverbios: [],
    isFavorite: false,
    participations: 321,
    textFormat: { fontSize: 16, isBold: false, isItalic: false },
  },
  {
    id: "4",
    book: "Génesis",
    chapter: 49,
    verse: 3,
    text: "Rubén, tú eres mi primogénito, mi fortaleza, y el principio de mi vigor; Principal en dignidad, principal en poder.",
    reference: "Génesis 49:3",
    comments: [],
    proverbios: [],
    isFavorite: false,
    participations: 567,
    textFormat: { fontSize: 16, isBold: false, isItalic: false },
  },
  {
    id: "5",
    book: "Éxodo",
    chapter: 12,
    verse: 2,
    text: "Este mes os será principio de los meses; para vosotros será éste el primero en los meses del año.",
    reference: "Éxodo 12:2",
    comments: [],
    proverbios: [],
    isFavorite: false,
    participations: 789,
    textFormat: { fontSize: 16, isBold: false, isItalic: false },
  },
]

const sampleBookVerses: Verse[] = [
  {
    id: "sample-1",
    book: "Génesis",
    chapter: 1,
    verse: 1,
    text: "En el principio creó Dios los cielos y la tierra.",
    reference: "Génesis 1:1",
    comments: [],
    proverbios: [],
    isFavorite: false,
    participations: 1024,
    textFormat: { fontSize: 16, isBold: false, isItalic: false },
  },
  {
    id: "sample-2",
    book: "Génesis",
    chapter: 1,
    verse: 2,
    text: "Y la tierra estaba desordenada y vacía, y las tinieblas estaban sobre la faz del abismo, y el Espíritu de Dios se movía sobre la faz de las aguas.",
    reference: "Génesis 1:2",
    comments: [],
    proverbios: [],
    isFavorite: false,
    participations: 856,
    textFormat: { fontSize: 16, isBold: false, isItalic: false },
  },
  {
    id: "sample-3",
    book: "Génesis",
    chapter: 1,
    verse: 3,
    text: "Y dijo Dios: Sea la luz; y fue la luz.",
    reference: "Génesis 1:3",
    comments: [],
    proverbios: [],
    isFavorite: false,
    participations: 1205,
    textFormat: { fontSize: 16, isBold: false, isItalic: false },
  },
  {
    id: "sample-4",
    book: "Génesis",
    chapter: 1,
    verse: 4,
    text: "Y vio Dios que la luz era buena; y separó Dios la luz de las tinieblas.",
    reference: "Génesis 1:4",
    comments: [],
    proverbios: [],
    isFavorite: false,
    participations: 743,
    textFormat: { fontSize: 16, isBold: false, isItalic: false },
  },
  {
    id: "sample-5",
    book: "Génesis",
    chapter: 1,
    verse: 5,
    text: "Y llamó Dios a la luz Día, y a las tinieblas llamó Noche. Y fue la tarde y la mañana un día.",
    reference: "Génesis 1:5",
    comments: [],
    proverbios: [],
    isFavorite: false,
    participations: 692,
    textFormat: { fontSize: 16, isBold: false, isItalic: false },
  },
]

const currentUser: CurrentUser = {
  id: "1",
  name: "David Rodriguez",
  biblicalName: "David",
  emoji: "👑",
  joinDate: "Enero 2024",
  notesCount: 15,
  participationsCount: 127,
  bio: "Siervo de Dios, buscando Su voluntad cada día. Amante de Su Palabra y de compartir Su amor con otros.",
  apuntes: [
    "Génesis 1:1 - El principio (בְּרֵאשִׁית): Representa el momento donde todo comenzó, la primera palabra de la Torá que establece a Dios como creador absoluto.",
    "Éxodo 3:14 - Yo soy (אהיה): Esta expresión revela la naturaleza eterna e inmutable de Dios, su existencia no depende de nada externo.",
  ],
  ilustraciones: [
    "Génesis 6:4 - Los gigantes (נפילים): En el contexto hebreo, estos seres representan la corrupción que surge cuando se mezcla lo sagrado con lo profano.",
    "Mateo 10:34 - La espada (μάχαιρα): En griego, esta palabra implica una división necesaria, como la que hace un cirujano para sanar.",
  ],
  traducciones: [
    "Isaías 45:7 - Crear el mal (רע): La palabra hebrea 'ra' puede traducirse como calamidad, adversidad o juicio, no necesariamente maldad moral.",
    "Salmos 23:1 - Pastor (רעה): Implica no solo cuidado, sino liderazgo activo y protección constante del rebaño.",
  ],
  savedNotes: [
    {
      id: "note1",
      title: "Reflexión sobre Génesis 1:1",
      content:
        "El principio de todo lo creado nos recuerda que Dios es el origen de toda existencia. Cada día debemos recordar que somos parte de Su creación perfecta.",
      date: "2024-01-15",
      verseReference: "Génesis 1:1",
    },
    {
      id: "note2",
      title: "La importancia de la oración",
      content:
        "La oración no es solo pedir, sino también escuchar. En el silencio encontramos la voz de Dios que nos guía en cada decisión.",
      date: "2024-01-10",
    },
    {
      id: "note3",
      title: "Meditación sobre el amor de Dios",
      content:
        "El amor de Dios es incondicional y eterno. No importa cuántas veces fallemos, Él siempre está dispuesto a perdonarnos y restaurarnos.",
      date: "2024-01-08",
      verseReference: "1 Juan 4:8",
    },
  ],
}

const dynamicTexts = ["PAZ", "ESPERANZA", "AMOR", "FORTALEZA", "SABIDURÍA", "LUZ", "FE", "GOZO"]

export default function ApocalipsisApp() {
  // Estados principales
  const [currentSection, setCurrentSection] = useState("login")
  const [currentView, setCurrentView] = useState<
    | "home"
    | "search"
    | "results"
    | "verse"
    | "books"
    | "chapters"
    | "verses"
    | "profile"
    | "translation"
    | "bible-reading"
    | "saved"
  >("home")

  // Estados de autenticación
  const [user, setUser] = useState<CurrentUser | null>(null)
  const [selectedCharacter, setSelectedCharacter] = useState<BiblicalCharacter | null>(null)
  const [currentCharacterIndex, setCurrentCharacterIndex] = useState(0)
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  // Estados de búsqueda
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [selectedFilters, setSelectedFilters] = useState<string[]>(["TODO"])
  const [searchType, setSearchType] = useState<"partial" | "exact" | "consecutive">("exact")

  // Estados de versículos
  const [selectedVerse, setSelectedVerse] = useState<Verse | null>(null)
  const [verses, setVerses] = useState<Verse[]>(principioResults)
  const [selectedBook, setSelectedBook] = useState<BiblicalBook | null>(null)
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null)
  const [isReinaValera, setIsReinaValera] = useState(true)

  // Estados de UI
  const [showMenu, setShowMenu] = useState(false)
  const [showNotebook, setShowNotebook] = useState(false)
  const [showTranslation, setShowTranslation] = useState(false)
  const [showProverbioModal, setShowProverbioModal] = useState(false)
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [showTagModal, setShowTagModal] = useState(false)
  const [showNotesModal, setShowNotesModal] = useState(false)
  const [showTextFormatModal, setShowTextFormatModal] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [currentDynamicText, setCurrentDynamicText] = useState(0)
  const [notebookPulse, setNotebookPulse] = useState(false)
  const [showShareAppModal, setShowShareAppModal] = useState(false)
  const [showHowItWorksModal, setShowHowItWorksModal] = useState(false)
  const [showUserParticipationsModal, setShowUserParticipationsModal] = useState(false)
  const [showVerseNotesModal, setShowVerseNotesModal] = useState(false)

  // Estados de traducción
  const [wordSearch, setWordSearch] = useState("")
  const [gematriaSearch, setGematriaSearch] = useState("")
  const [selectedWordForComment, setSelectedWordForComment] = useState<WordGematria | null>(null)
  const [wordComment, setWordComment] = useState("")
  const [commentType, setCommentType] = useState<"apuntes" | "ilustra" | "traduce">("apuntes")

  // Estados de comentarios y proverbios
  const [newComment, setNewComment] = useState("")
  const [newProverbio, setNewProverbio] = useState("")
  const [proverbioBackground, setProverbioBackground] = useState("#667eea")
  const [proverbioTextColor, setProverbioTextColor] = useState("#ffffff")
  const [proverbioFontSize, setProverbioFontSize] = useState(16)
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set())

  // Estados de etiquetado
  const [tagStep, setTagStep] = useState<"book" | "chapter" | "verse" | "comment">("book")
  const [taggedBook, setTaggedBook] = useState<BiblicalBook | null>(null)
  const [taggedChapter, setTaggedChapter] = useState<number | null>(null)
  const [taggedVerse, setTaggedVerse] = useState<number | null>(null)
  const [tagComment, setTagComment] = useState("")

  // Estados de formato de texto
  const [selectedText, setSelectedText] = useState("")
  const [verseNotes, setVerseNotes] = useState("")

  // Estados del cuaderno
  const [newNoteTitle, setNewNoteTitle] = useState("")
  const [newNoteContent, setNewNoteContent] = useState("")
  const [editingNote, setEditingNote] = useState<SavedNote | null>(null)

  // Efectos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDynamicText((prev) => (prev + 1) % dynamicTexts.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setNotebookPulse(true)
      setTimeout(() => setNotebookPulse(false), 300)
    }, 1000)
    return () => clearInterval(pulseInterval)
  }, [])

  // Funciones de autenticación
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setUser(currentUser)
    setCurrentSection("home")
  }

  const handleRegister = () => {
    if (!selectedCharacter) {
      alert("Por favor selecciona un personaje bíblico")
      return
    }
    if (registerForm.password !== registerForm.confirmPassword) {
      alert("Las contraseñas no coinciden")
      return
    }
    setUser({
      ...currentUser,
      biblicalName: selectedCharacter.name,
      emoji: selectedCharacter.emoji,
    })
    setCurrentSection("home")
  }

  const nextCharacter = () => {
    setCurrentCharacterIndex((prev) => (prev + 1) % biblicalCharacters.length)
  }

  const prevCharacter = () => {
    setCurrentCharacterIndex((prev) => (prev - 1 + biblicalCharacters.length) % biblicalCharacters.length)
  }

  // Funciones de búsqueda
  const handleSearch = () => {
    if (!searchQuery.trim()) return

    const results = principioResults.map((verse) => ({
      verse,
      highlighted: verse.text.replace(/principio/gi, '<span style="color: red; font-weight: bold;">principio</span>'),
    }))
    setSearchResults(results)
    setCurrentView("results")
  }

  // Modificar la función toggleFilter para manejar la selección de libros
  const toggleFilter = (filter: string) => {
    if (filter === "LIBRO") {
      setCurrentView("books")
    } else if (filter === "AT" || filter === "NT") {
      // Show sample results for testament filters
      const results = sampleBookVerses.map((verse) => ({
        verse,
        highlighted: verse.text,
      }))
      setSearchResults(results)
      setCurrentView("results")
      const newFilters = selectedFilters.includes(filter)
        ? selectedFilters.filter((f) => f !== filter)
        : [...selectedFilters.filter((f) => f !== "TODO"), filter]
      setSelectedFilters(newFilters.length === 0 ? ["TODO"] : newFilters)
    } else {
      const newFilters = selectedFilters.includes(filter)
        ? selectedFilters.filter((f) => f !== filter)
        : [...selectedFilters.filter((f) => f !== "TODO"), filter]
      setSelectedFilters(newFilters.length === 0 ? ["TODO"] : newFilters)
    }
  }

  // Agregar nueva función para manejar la selección de libro desde filtros
  const handleBookSelection = (book: BiblicalBook) => {
    setSelectedBook(book)
    // Mostrar versículos de ejemplo del libro seleccionado
    const bookVerses = sampleBookVerses.map((verse) => ({
      ...verse,
      book: book.name,
      reference: `${book.name} ${verse.chapter}:${verse.verse}`,
    }))
    const results = bookVerses.map((verse) => ({
      verse,
      highlighted: verse.text,
    }))
    setSearchResults(results)
    setCurrentView("results")
    // Actualizar filtros para mostrar que se seleccionó un libro
    setSelectedFilters(["LIBRO"])
  }

  // Funciones de versículos
  const handleVerseClick = (verse: Verse) => {
    setSelectedVerse(verse)
    setCurrentView("verse")
  }

  const toggleFavorite = () => {
    if (selectedVerse) {
      setSelectedVerse({ ...selectedVerse, isFavorite: !selectedVerse.isFavorite })
    }
  }

  const toggleCommentExpansion = (commentId: string) => {
    setExpandedComments((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(commentId)) {
        newSet.delete(commentId)
      } else {
        newSet.add(commentId)
      }
      return newSet
    })
  }

  const addComment = () => {
    if (!newComment.trim() || !selectedVerse || !user) return

    const comment: Comment = {
      id: `c${Date.now()}`,
      user: user.biblicalName,
      content: newComment,
      timestamp: "ahora",
      subComments: [],
      isExpanded: false,
    }

    setSelectedVerse({
      ...selectedVerse,
      comments: [...selectedVerse.comments, comment],
    })
    setNewComment("")
  }

  const addWordComment = () => {
    if (!wordComment.trim() || !selectedWordForComment || !user) return

    const updatedUser = { ...user }
    const commentText = `${selectedWordForComment.spanish} (${selectedWordForComment.hebrew}): ${wordComment}`

    if (commentType === "apuntes") {
      updatedUser.apuntes = [...updatedUser.apuntes, commentText]
    } else if (commentType === "ilustra") {
      updatedUser.ilustraciones = [...updatedUser.ilustraciones, commentText]
    } else if (commentType === "traduce") {
      updatedUser.traducciones = [...updatedUser.traducciones, commentText]
    }

    setUser(updatedUser)
    setWordComment("")
    setSelectedWordForComment(null)
  }

  const handleTextSelection = () => {
    const selection = window.getSelection()
    if (selection && selection.toString().trim()) {
      setSelectedText(selection.toString())
    }
  }

  const highlightSelectedText = () => {
    if (selectedVerse && selectedText) {
      const highlightedText = selectedVerse.text.replace(
        new RegExp(selectedText, "gi"),
        `<mark style="background-color: yellow; padding: 2px 4px; border-radius: 3px;">${selectedText}</mark>`,
      )
      setSelectedVerse({
        ...selectedVerse,
        highlightedText,
      })
      setSelectedText("")
    }
  }

  const updateTextFormat = (fontSize: number, isBold: boolean, isItalic: boolean) => {
    if (selectedVerse) {
      setSelectedVerse({
        ...selectedVerse,
        textFormat: { fontSize, isBold, isItalic },
      })
    }
  }

  const saveVerseNotes = () => {
    if (selectedVerse && verseNotes.trim()) {
      setSelectedVerse({
        ...selectedVerse,
        userNotes: verseNotes,
      })
      setShowNotesModal(false)
      setVerseNotes("")
    }
  }

  const copyToClipboard = () => {
    if (selectedVerse) {
      const textToCopy = `"${selectedVerse.text}" - ${selectedVerse.reference}`
      navigator.clipboard.writeText(textToCopy)
      alert("Versículo copiado al portapapeles")
    }
  }

  const shareToSocialMedia = (platform: string) => {
    if (!selectedVerse) return

    const text = `"${selectedVerse.text}" - ${selectedVerse.reference}`
    const url = window.location.href

    switch (platform) {
      case "whatsapp":
        window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + url)}`)
        break
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`,
        )
        break
      case "twitter":
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`)
        break
      case "instagram":
        alert("Para Instagram, copia el texto y compártelo en tu historia")
        copyToClipboard()
        break
    }
    setShowShareModal(false)
  }

  // Funciones del cuaderno
  const saveNote = () => {
    if (!newNoteTitle.trim() || !newNoteContent.trim() || !user) return

    const newNote: SavedNote = {
      id: `note${Date.now()}`,
      title: newNoteTitle,
      content: newNoteContent,
      date: new Date().toISOString().split("T")[0],
      verseReference: selectedVerse?.reference,
    }

    const updatedUser = {
      ...user,
      savedNotes: [...user.savedNotes, newNote],
    }

    setUser(updatedUser)
    setNewNoteTitle("")
    setNewNoteContent("")
  }

  const editNote = (note: SavedNote) => {
    setEditingNote(note)
    setNewNoteTitle(note.title)
    setNewNoteContent(note.content)
  }

  const updateNote = () => {
    if (!editingNote || !newNoteTitle.trim() || !newNoteContent.trim() || !user) return

    const updatedNotes = user.savedNotes.map((note) =>
      note.id === editingNote.id ? { ...note, title: newNoteTitle, content: newNoteContent } : note,
    )

    const updatedUser = {
      ...user,
      savedNotes: updatedNotes,
    }

    setUser(updatedUser)
    setEditingNote(null)
    setNewNoteTitle("")
    setNewNoteContent("")
  }

  const deleteNote = (noteId: string) => {
    if (!user) return

    const updatedNotes = user.savedNotes.filter((note) => note.id !== noteId)
    const updatedUser = {
      ...user,
      savedNotes: updatedNotes,
    }

    setUser(updatedUser)
  }

  // Componente de Login
  if (currentSection === "login") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-600 via-purple-700 to-orange-600 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Rosarios animados en las esquinas */}
        <div className="absolute top-4 left-4 opacity-20">
          <div className="flex flex-col items-center animate-pulse">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-white rounded-full mb-1 animate-bounce"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
            <div className="w-4 h-6 bg-white rounded-full mt-2">✝</div>
          </div>
        </div>

        <div className="absolute top-4 right-4 opacity-20">
          <div className="flex flex-col items-center animate-pulse">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-white rounded-full mb-1 animate-bounce"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
            <div className="w-4 h-6 bg-white rounded-full mt-2">✝</div>
          </div>
        </div>

        <div className="absolute bottom-4 left-4 opacity-20">
          <div className="flex flex-col items-center animate-pulse">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-white rounded-full mb-1 animate-bounce"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
            <div className="w-4 h-6 bg-white rounded-full mt-2">✝</div>
          </div>
        </div>

        <div className="absolute bottom-4 right-4 opacity-20">
          <div className="flex flex-col items-center animate-pulse">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-white rounded-full mb-1 animate-bounce"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
            <div className="w-4 h-6 bg-white rounded-full mt-2">✝</div>
          </div>
        </div>

        {/* Onda animada */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full">
            <div
              className="w-full h-full bg-gradient-to-r from-white/10 to-transparent rounded-full animate-pulse transform rotate-12"
              style={{ animation: "wave 4s ease-in-out infinite" }}
            />
          </div>
        </div>
        <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-2xl border-0 rounded-2xl">
          <CardContent className="p-6 sm:p-8">
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-teal-600 via-purple-600 to-orange-600 bg-clip-text text-transparent mb-4">
                Apocalipsis ✝
              </h1>
              <div className="text-center mb-4">
                <p className="text-sm text-gray-600">(The Revelation)</p>
              </div>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Es ver por fin lo que siempre estuvo ahí. Cuando Dios llega a nuestra vida, todo cobra sentido: el miedo
                se convierte en{" "}
                <span className="font-bold bg-gradient-to-r from-teal-500 to-purple-500 bg-clip-text text-transparent inline-block min-w-[120px] transition-all duration-500">
                  {dynamicTexts[currentDynamicText]}
                </span>
                .
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-purple-700">Correo</label>
                <Input
                  type="email"
                  placeholder="tu.correo@ejemplo.com"
                  required
                  className="border-2 border-teal-300 focus:border-purple-500 transition-all duration-300 bg-white/80 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-purple-700">Contraseña</label>
                <Input
                  type="password"
                  placeholder="Tu contraseña"
                  required
                  className="border-2 border-teal-300 focus:border-purple-500 transition-all duration-300 bg-white/80 rounded-xl"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-teal-500 via-purple-500 to-orange-500 hover:from-teal-600 hover:via-purple-600 hover:to-orange-600 text-white hover:scale-105 transition-all duration-300 rounded-xl py-3"
              >
                Iniciar Sesión
              </Button>
            </form>

            <p className="text-center mt-4 sm:mt-6 text-sm">
              ¿No tienes cuenta?{" "}
              <button
                onClick={() => setCurrentSection("register")}
                className="text-purple-600 hover:underline font-medium hover:text-teal-600 transition-colors"
              >
                Regístrate aquí
              </button>
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Componente de Registro
  if (currentSection === "register") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-600 via-purple-700 to-orange-600 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Rosarios animados en las esquinas */}
        <div className="absolute top-4 left-4 opacity-20">
          <div className="flex flex-col items-center animate-pulse">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-white rounded-full mb-1 animate-bounce"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
            <div className="w-4 h-6 bg-white rounded-full mt-2">✝</div>
          </div>
        </div>

        <div className="absolute top-4 right-4 opacity-20">
          <div className="flex flex-col items-center animate-pulse">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-white rounded-full mb-1 animate-bounce"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
            <div className="w-4 h-6 bg-white rounded-full mt-2">✝</div>
          </div>
        </div>

        <div className="absolute bottom-4 left-4 opacity-20">
          <div className="flex flex-col items-center animate-pulse">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-white rounded-full mb-1 animate-bounce"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
            <div className="w-4 h-6 bg-white rounded-full mt-2">✝</div>
          </div>
        </div>

        <div className="absolute bottom-4 right-4 opacity-20">
          <div className="flex flex-col items-center animate-pulse">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-white rounded-full mb-1 animate-bounce"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
            <div className="w-4 h-6 bg-white rounded-full mt-2">✝</div>
          </div>
        </div>

        {/* Onda animada */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full">
            <div
              className="w-full h-full bg-gradient-to-r from-white/10 to-transparent rounded-full animate-pulse transform rotate-12"
              style={{ animation: "wave 4s ease-in-out infinite" }}
            />
          </div>
        </div>
        <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-2xl border-0 rounded-2xl">
          <CardContent className="p-6 sm:p-8">
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-teal-600 via-purple-600 to-orange-600 bg-clip-text text-transparent mb-4">
                Apocalipsis ✝
              </h1>
              <div className="text-center mb-4">
                <p className="text-sm text-gray-600">(The Revelation)</p>
              </div>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Es ver por fin lo que siempre estuvo ahí. Cuando Dios llega a nuestra vida, todo cobra sentido: el miedo
                se convierte en{" "}
                <span className="font-bold bg-gradient-to-r from-teal-500 to-purple-500 bg-clip-text text-transparent inline-block min-w-[120px] transition-all duration-500">
                  {dynamicTexts[currentDynamicText]}
                </span>
                .
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-purple-700">Nombre</label>
                <Input
                  value={registerForm.name}
                  onChange={(e) => setRegisterForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Tu nombre completo"
                  required
                  className="border-2 border-teal-300 focus:border-purple-500 transition-all duration-300 bg-white/80 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-purple-700">Correo</label>
                <Input
                  type="email"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="tu.correo@ejemplo.com"
                  required
                  className="border-2 border-teal-300 focus:border-purple-500 transition-all duration-300 bg-white/80 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-purple-700">Contraseña</label>
                <Input
                  type="password"
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm((prev) => ({ ...prev, password: e.target.value }))}
                  placeholder="Tu contraseña"
                  required
                  className="border-2 border-teal-300 focus:border-purple-500 transition-all duration-300 bg-white/80 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-purple-700">Confirmar Contraseña</label>
                <Input
                  type="password"
                  value={registerForm.confirmPassword}
                  onChange={(e) => setRegisterForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Confirma tu contraseña"
                  required
                  className="border-2 border-teal-300 focus:border-purple-500 transition-all duration-300 bg-white/80 rounded-xl"
                />
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-base sm:text-lg font-semibold text-purple-600 mb-6 text-center">
                Elige tu personaje bíblico
              </h3>

              <div className="flex items-center justify-center gap-4 mb-4">
                <Button
                  onClick={prevCharacter}
                  variant="ghost"
                  size="sm"
                  className="w-10 h-10 rounded-full bg-teal-500 text-white hover:bg-teal-600 transition-all duration-300"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>

                <div className="flex gap-4">
                  {[-1, 0, 1].map((offset) => {
                    const index =
                      (currentCharacterIndex + offset + biblicalCharacters.length) % biblicalCharacters.length
                    const character = biblicalCharacters[index]
                    const isCenter = offset === 0
                    const isSelected = selectedCharacter?.name === character.name

                    return (
                      <div
                        key={character.name}
                        className={`relative transition-all duration-500 ${isCenter ? "scale-110" : "scale-90 opacity-70"}`}
                      >
                        <button
                          onClick={() => {
                            setSelectedCharacter(character)
                            setCurrentCharacterIndex(index)
                          }}
                          className={`relative bg-white rounded-2xl p-4 shadow-lg transition-all duration-300 hover:scale-105 ${
                            isSelected
                              ? "ring-4 ring-purple-400 shadow-purple-200 shadow-2xl"
                              : "hover:shadow-xl hover:shadow-teal-200"
                          }`}
                          style={{
                            background: isSelected
                              ? "linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(20, 184, 166, 0.1) 100%)"
                              : "white",
                            boxShadow: isSelected
                              ? "0 0 30px rgba(168, 85, 247, 0.3), 0 0 60px rgba(20, 184, 166, 0.2)"
                              : undefined,
                          }}
                        >
                          <div className="w-16 h-16 rounded-full bg-purple-500 flex items-center justify-center text-2xl mb-2 mx-auto">
                            {character.emoji}
                          </div>
                          <div className="text-sm font-medium text-gray-700 text-center">{character.name}</div>
                        </button>
                      </div>
                    )
                  })}
                </div>

                <Button
                  onClick={nextCharacter}
                  variant="ghost"
                  size="sm"
                  className="w-10 h-10 rounded-full bg-teal-500 text-white hover:bg-teal-600 transition-all duration-300"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <Button
              onClick={handleRegister}
              className="w-full bg-gradient-to-r from-teal-500 via-purple-500 to-orange-500 hover:from-teal-600 hover:via-purple-600 hover:to-orange-600 text-white hover:scale-105 transition-all duration-300 rounded-xl py-3 mb-4"
            >
              Crear Cuenta
            </Button>

            <p className="text-center text-sm">
              ¿Ya tienes cuenta?{" "}
              <button
                onClick={() => setCurrentSection("login")}
                className="text-purple-600 hover:underline font-medium hover:text-teal-600 transition-colors"
              >
                Inicia sesión
              </button>
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Componente principal de la aplicación
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-teal-400 via-purple-500 to-orange-500 relative overflow-hidden">
        {/* Rosarios animados en las esquinas */}
        <div className="absolute top-4 left-4 opacity-10 z-0">
          <div className="flex flex-col items-center animate-pulse">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-white rounded-full mb-1 animate-bounce"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
            <div className="w-4 h-6 bg-white rounded-full mt-2">✝</div>
          </div>
        </div>

        <div className="absolute top-4 right-4 opacity-10 z-0">
          <div className="flex flex-col items-center animate-pulse">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-white rounded-full mb-1 animate-bounce"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
            <div className="w-4 h-6 bg-white rounded-full mt-2">✝</div>
          </div>
        </div>

        <div className="absolute bottom-4 left-4 opacity-10 z-0">
          <div className="flex flex-col items-center animate-pulse">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-white rounded-full mb-1 animate-bounce"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
            <div className="w-4 h-6 bg-white rounded-full mt-2">✝</div>
          </div>
        </div>

        <div className="absolute bottom-4 right-4 opacity-10 z-0">
          <div className="flex flex-col items-center animate-pulse">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-white rounded-full mb-1 animate-bounce"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
            <div className="w-4 h-6 bg-white rounded-full mt-2">✝</div>
          </div>
        </div>

        {/* Animación de fondo - elementos celestiales */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Partículas de luz divina */}
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/30 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}

          {/* Ondas de pureza */}
          <div className="absolute inset-0">
            <div
              className="absolute w-96 h-96 border border-white/10 rounded-full animate-ping"
              style={{ left: "10%", top: "20%", animationDuration: "4s" }}
            />
            <div
              className="absolute w-64 h-64 border border-white/10 rounded-full animate-ping"
              style={{ right: "15%", bottom: "30%", animationDuration: "6s" }}
            />
            <div
              className="absolute w-48 h-48 border border-white/10 rounded-full animate-ping"
              style={{ left: "60%", top: "60%", animationDuration: "5s" }}
            />
          </div>

          {/* Cruz sutil en el fondo */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5">
            <div className="text-white text-9xl">✝</div>
          </div>
        </div>
        {/* Botón flotante de notas */}
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
          <Button
            onClick={() => setShowNotebook(true)}
            className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-orange-500 to-purple-500 hover:from-orange-600 hover:to-purple-600 text-white shadow-2xl hover:scale-110 transition-all duration-300 border-0 p-2 ${
              notebookPulse ? "animate-bounce scale-110" : ""
            }`}
          >
            <img src="/images/notebook-icon-new.png" alt="Notas" className="w-full h-full object-contain" />
          </Button>
        </div>

        {/* Header */}
        <header className="bg-white sticky top-0 z-50 border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentView("home")}
                className="flex flex-col items-start gap-1 hover:scale-105 transition-transform duration-300"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl">✝</span>
                  <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-teal-600 via-purple-600 to-orange-600 bg-clip-text text-transparent">
                    Apocalipsis
                  </h1>
                </div>
                <p className="text-xs text-gray-600 ml-6">(The Revelation)</p>
              </button>

              {/* Barra de búsqueda en header */}
              {currentView === "home" && (
                <div className="flex-1 max-w-md mx-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Buscar..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 py-2 text-sm border-2 border-gray-300 rounded-lg bg-white"
                      onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                      onFocus={() => setCurrentView("search")}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 sm:gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentView("saved")}
                  className="bg-white border-gray-300 text-purple-700 hover:bg-gray-50 flex items-center gap-1 sm:gap-2 hover:scale-105 transition-all duration-300 rounded-full px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm"
                >
                  <Bookmark className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Guardados</span>
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setShowMenu(!showMenu)} className="relative">
                  <Menu className="h-5 w-5" />
                </Button>

                {showMenu && (
                  <div className="absolute top-16 right-4 bg-white border border-gray-200 rounded-lg shadow-lg py-2 w-48 z-50">
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
                      onClick={() => {
                        setShowShareAppModal(true)
                        setShowMenu(false)
                      }}
                    >
                      Compartir app
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
                      onClick={() => {
                        setShowHowItWorksModal(true)
                        setShowMenu(false)
                      }}
                    >
                      Cómo funciona
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
                      onClick={() => {
                        setCurrentView("profile")
                        setShowMenu(false)
                      }}
                    >
                      Mi perfil
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
                      onClick={() => {
                        setShowUserParticipationsModal(true)
                        setShowMenu(false)
                      }}
                    >
                      Mis participaciones
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
                      onClick={() => {
                        setShowVerseNotesModal(true)
                        setShowMenu(false)
                      }}
                    >
                      Apuntes de versículos
                    </button>
                    <hr className="my-2" />
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 transition-colors"
                      onClick={() => {
                        setUser(null)
                        setCurrentSection("login")
                      }}
                    >
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="pb-8">
          {/* Vista de Inicio */}
          {currentView === "home" && (
            <div className="max-w-4xl mx-auto p-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">Versículos Destacados</h2>
                <p className="text-white/80">Únete a las conversaciones más profundas</p>
              </div>

              <div className="space-y-6">
                {featuredVerses.map((verse) => (
                  <Card
                    key={verse.id}
                    className="cursor-pointer hover:shadow-lg transition-all duration-300 bg-white hover:scale-[1.02]"
                    onClick={() => handleVerseClick(verse)}
                  >
                    <CardContent className="p-6">
                      <div className="mb-4">
                        <h3 className="font-bold text-lg text-gray-800 mb-2">{verse.reference}</h3>
                        <p className="text-gray-700 italic">"{verse.text}"</p>
                      </div>

                      {/* Mostrar proverbios si existen */}
                      {verse.proverbios.length > 0 && (
                        <div className="mb-4">
                          {verse.proverbios.map((proverbio) => (
                            <div
                              key={proverbio.id}
                              className="p-4 rounded-lg text-center mb-2"
                              style={{
                                background: proverbio.background,
                                color: proverbio.textColor,
                                fontSize: `${proverbio.fontSize}px`,
                                fontFamily: proverbio.fontFamily,
                              }}
                            >
                              <p className="mb-2">"{proverbio.content}"</p>
                              <p className="text-xs opacity-75">- {proverbio.user}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <MessageCircle className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600">{verse.comments.length} participaciones</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600">{verse.participations} participaciones</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-800">
                          Participar →
                        </Button>
                      </div>

                      {/* Mostrar algunos comentarios */}
                      {verse.comments.slice(0, 2).map((comment) => (
                        <div key={comment.id} className="bg-gray-50 rounded-lg p-3 mb-2">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm text-purple-700">{comment.user}</span>
                            <span className="text-xs text-gray-500">{comment.timestamp}</span>
                          </div>
                          <p className="text-sm text-gray-700">{comment.content}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Vista de Búsqueda */}
          {currentView === "search" && (
            <div className="max-w-4xl mx-auto p-6">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Apocalipsis</h1>
                <p className="text-white/80">(The revelation)</p>
                {selectedBook && (
                  <p className="text-white/90 mt-2 text-lg">
                    Filtrando en: <span className="font-bold">{selectedBook.name}</span>
                  </p>
                )}
              </div>

              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    placeholder={selectedBook ? `Buscar en ${selectedBook.name}...` : "Buscar..."}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 py-3 text-lg border-2 border-gray-300 rounded-lg bg-white"
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  />
                </div>
              </div>

              <div className="flex justify-center gap-2 mb-6 flex-wrap">
                {["TODO", "AT", "NT", "LIBRO"].map((filter) => (
                  <Button
                    key={filter}
                    onClick={() => toggleFilter(filter)}
                    className={`rounded-full px-4 py-2 font-medium transition-all duration-300 text-sm hover:scale-105 ${
                      selectedFilters.includes(filter) || (filter === "LIBRO" && selectedBook)
                        ? "bg-orange-500 text-white hover:bg-orange-600 scale-105 shadow-lg"
                        : "bg-orange-100 text-orange-700 hover:bg-orange-200"
                    }`}
                  >
                    {filter === "LIBRO" && selectedBook ? selectedBook.abbreviation : filter}
                  </Button>
                ))}
                {selectedBook && (
                  <Button
                    onClick={() => {
                      setSelectedBook(null)
                      setSelectedFilters(["TODO"])
                      setSearchResults([])
                    }}
                    className="rounded-full px-4 py-2 font-medium transition-all duration-300 text-sm bg-red-100 text-red-700 hover:bg-red-200"
                  >
                    Limpiar libro
                  </Button>
                )}
              </div>

              <div className="flex justify-center gap-6 mb-8">
                {[
                  { key: "partial", label: "Palabra parcial" },
                  { key: "exact", label: "Palabra exacta" },
                  { key: "consecutive", label: "Frase consecutiva" },
                ].map((option) => (
                  <label key={option.key} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={searchType === option.key}
                      onCheckedChange={() => setSearchType(option.key as any)}
                      className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                    />
                    <span className="text-white">{option.label}</span>
                  </label>
                ))}
              </div>

              <div className="text-center">
                <Button
                  onClick={handleSearch}
                  className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 hover:scale-105 transition-all duration-300"
                >
                  Buscar{selectedBook ? ` en ${selectedBook.name}` : ""}
                </Button>
              </div>

              {searchResults.length > 0 && (
                <div className="mt-8 text-center">
                  <p className="text-teal-200 font-medium">
                    {searchResults.length} resultados{selectedBook ? ` en ${selectedBook.name}` : ""}...
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Vista de Libros */}
          {currentView === "books" && (
            <div className="max-w-4xl mx-auto p-6">
              <div className="mb-6">
                <Button onClick={() => setCurrentView("search")} variant="ghost" className="mb-4 text-white">
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Volver a búsqueda
                </Button>
                <h2 className="text-2xl font-bold text-center mb-6 text-white">Seleccionar Libro</h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {biblicalBooks.map((book) => (
                  <Card
                    key={book.id}
                    className="cursor-pointer hover:shadow-lg transition-all duration-300 bg-white hover:scale-105"
                    onClick={() => handleBookSelection(book)}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="text-xs text-gray-500 mb-1">{book.testament}</div>
                      <div className="font-bold text-gray-800">{book.name}</div>
                      <div className="text-xs text-gray-600">{book.chapters} capítulos</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Vista de Capítulos */}
          {currentView === "chapters" && selectedBook && (
            <div className="max-w-4xl mx-auto p-6">
              <div className="mb-6">
                <Button onClick={() => setCurrentView("books")} variant="ghost" className="mb-4 text-white">
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Volver a libros
                </Button>
                <h2 className="text-2xl font-bold text-center mb-6 text-white">
                  {selectedBook.name} - Seleccionar Capítulo
                </h2>
              </div>

              <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
                {Array.from({ length: selectedBook.chapters }, (_, i) => i + 1).map((chapter) => (
                  <Card
                    key={chapter}
                    className="cursor-pointer hover:shadow-lg transition-all duration-300 bg-white hover:scale-105"
                    onClick={() => {
                      setSelectedChapter(chapter)
                      setCurrentView("verses")
                    }}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="font-bold text-gray-800 text-lg">{chapter}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Vista de Versículos */}
          {currentView === "verses" && selectedBook && selectedChapter && (
            <div className="max-w-4xl mx-auto p-6">
              <div className="mb-6">
                <Button onClick={() => setCurrentView("chapters")} variant="ghost" className="mb-4 text-white">
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Volver a capítulos
                </Button>
                <h2 className="text-2xl font-bold text-center mb-6 text-white">
                  {selectedBook.name} {selectedChapter} - Versículos
                </h2>
              </div>

              <div className="bg-white rounded-lg p-4">
                {sampleBookVerses.map((verse, index) => (
                  <div key={index}>
                    <div
                      className="cursor-pointer hover:bg-gray-50 p-4 transition-colors"
                      onClick={() => handleVerseClick(verse)}
                    >
                      <div className="mb-2">
                        <div className="flex items-start gap-3">
                          <span className="font-bold text-purple-600 min-w-[30px]">{verse.verse}.</span>
                          <div className="flex-1">
                            <p className="text-gray-700">{verse.text}</p>
                            <div className="flex items-center gap-4 mt-2">
                              <div className="flex items-center gap-1">
                                <Users className="h-3 w-3 text-gray-400" />
                                <span className="text-xs text-gray-500">{verse.participations} participaciones</span>
                              </div>
                              <span className="text-xs text-gray-400">{verse.reference}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {index < sampleBookVerses.length - 1 && <hr className="border-gray-200" />}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Vista de Resultados */}
          {currentView === "results" && (
            <div className="max-w-4xl mx-auto p-6">
              <div className="mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <Button onClick={() => setCurrentView("search")} variant="ghost" className="text-white">
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Volver a búsqueda
                  </Button>
                  <Button onClick={() => setCurrentView("home")} variant="ghost" className="text-white">
                    <Home className="h-4 w-4 mr-2" />
                    Inicio
                  </Button>
                  {selectedBook && (
                    <div className="text-white bg-white/20 px-3 py-1 rounded-full text-sm">
                      Filtrando en: {selectedBook.name}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    placeholder={selectedBook ? `Buscar en ${selectedBook.name}` : searchQuery}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 py-3 text-lg border-2 border-gray-300 rounded-lg bg-white"
                  />
                </div>
              </div>

              <div className="bg-white rounded-lg p-4">
                <div className="mb-4 text-center">
                  <h3 className="text-lg font-bold text-gray-800">
                    {searchResults.length} resultados{selectedBook ? ` en ${selectedBook.name}` : ""}
                  </h3>
                </div>
                {searchResults.map((result, index) => (
                  <div key={index}>
                    <div
                      className="cursor-pointer hover:bg-gray-50 p-4 transition-colors"
                      onClick={() => handleVerseClick(result.verse)}
                    >
                      <div className="mb-2">
                        <div className="text-gray-700" dangerouslySetInnerHTML={{ __html: result.highlighted }} />
                      </div>
                      <div className="text-sm font-medium text-gray-600">{result.verse.reference}</div>
                    </div>
                    {index < searchResults.length - 1 && <hr className="border-gray-200" />}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Vista de Versículo Individual */}
          {currentView === "verse" && selectedVerse && (
            <div className="max-w-4xl mx-auto p-6">
              <div className="mb-6">
                <Button onClick={() => setCurrentView("results")} variant="ghost" className="mb-4 text-white">
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Volver
                </Button>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                {/* Barra de herramientas superior */}
                <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedVerse(translationVerse)
                        setShowTranslation(true)
                      }}
                      title="Abrir traducción"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (selectedText) {
                          highlightSelectedText()
                        } else {
                          alert("Primero selecciona el texto que deseas subrayar")
                        }
                      }}
                      title="Subrayar texto seleccionado"
                    >
                      <Highlighter className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentView("bible-reading")}
                      title="Ver como biblia"
                    >
                      <Crown className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowTextFormatModal(true)}
                      title="Formato de texto"
                    >
                      <Type className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="text-lg font-bold text-gray-800">{selectedVerse.reference}</div>

                  <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={copyToClipboard} title="Copiar">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setShowShareModal(true)} title="Compartir">
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setVerseNotes(selectedVerse.userNotes || "")
                        setShowNotesModal(true)
                      }}
                      title="Notas del versículo"
                    >
                      <StickyNote className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={toggleFavorite} title="Favorito">
                      <Heart
                        className={`h-5 w-5 ${
                          selectedVerse.isFavorite ? "text-yellow-500 fill-yellow-500" : "text-gray-400"
                        }`}
                      />
                    </Button>
                  </div>
                </div>

                {/* Texto del versículo */}
                <div className="text-center mb-8" onMouseUp={handleTextSelection}>
                  <p
                    className="text-xl text-gray-800 mb-4"
                    style={{
                      fontSize: `${selectedVerse.textFormat?.fontSize || 18}px`,
                      fontWeight: selectedVerse.textFormat?.isBold ? "bold" : "normal",
                      fontStyle: selectedVerse.textFormat?.isItalic ? "italic" : "normal",
                    }}
                    dangerouslySetInnerHTML={{
                      __html: selectedVerse.highlightedText || `"${selectedVerse.text}"`,
                    }}
                  />
                  {selectedVerse.userNotes && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                      <p className="text-sm text-blue-800">
                        <strong>Mis notas:</strong> {selectedVerse.userNotes}
                      </p>
                    </div>
                  )}
                </div>

                {/* Botones de acción */}
                <div className="flex justify-center gap-6 mb-8">
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 bg-transparent border-2 border-gray-300 hover:bg-gray-50"
                  >
                    <StickyNote className="h-4 w-4" />
                    Apuntes
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 bg-transparent border-2 border-gray-300 hover:bg-gray-50"
                    onClick={() => setShowProverbioModal(true)}
                  >
                    <Scroll className="h-4 w-4" />
                    Proverbios
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 bg-transparent border-2 border-gray-300 hover:bg-gray-50"
                    onClick={() => setShowShareModal(true)}
                  >
                    <Share2 className="h-4 w-4" />
                    Compartir
                  </Button>
                </div>

                {/* Proverbios existentes */}
                {selectedVerse.proverbios.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-bold text-gray-800 mb-4">Proverbios Inspiradores</h3>
                    <div className="space-y-4">
                      {selectedVerse.proverbios.map((proverbio) => (
                        <div
                          key={proverbio.id}
                          className="p-4 rounded-lg text-center"
                          style={{
                            background: proverbio.background,
                            color: proverbio.textColor,
                            fontSize: `${proverbio.fontSize}px`,
                            fontFamily: proverbio.fontFamily,
                          }}
                        >
                          <p className="mb-2">"{proverbio.content}"</p>
                          <p className="text-xs opacity-75">
                            - {proverbio.user} • {proverbio.timestamp}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Campo de participación */}
                <div className="mb-6">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Participar"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="flex-1 p-3 border-2 border-gray-300 rounded-lg"
                    />
                    <Button onClick={addComment} className="bg-teal-500 hover:bg-teal-600 text-white px-4">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Reflexiones y Interpretaciones */}
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-800">Reflexiones e Interpretaciones</h3>
                  {selectedVerse.comments.map((comment) => (
                    <div key={comment.id}>
                      <Card
                        className="bg-black text-white cursor-pointer hover:bg-gray-800 transition-colors"
                        onClick={() => toggleCommentExpansion(comment.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-medium">{comment.user}</span>
                                <span className="text-xs text-gray-400">{comment.timestamp}</span>
                              </div>
                              <p>{comment.content}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-white hover:text-yellow-400"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setShowTagModal(true)
                                }}
                              >
                                <Tag className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-white hover:text-blue-400"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setShowMessageModal(true)
                                }}
                              >
                                <MessageCircle className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Subcomentarios */}
                      {expandedComments.has(comment.id) && comment.subComments.length > 0 && (
                        <div className="ml-6 mt-2 space-y-2">
                          {comment.subComments.map((subComment) => (
                            <Card key={subComment.id} className="bg-gray-100">
                              <CardContent className="p-3">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="font-medium text-sm">{subComment.user}</span>
                                      <span className="text-xs text-gray-500">{subComment.timestamp}</span>
                                    </div>
                                    <p className="text-sm">{subComment.content}</p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                          <div className="flex gap-2">
                            <Input placeholder="Responder..." className="flex-1 text-sm" />
                            <Button size="sm" className="bg-teal-500 hover:bg-teal-600 text-white">
                              <Send className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Vista de Lectura de Biblia */}
          {currentView === "bible-reading" && selectedVerse && (
            <div className="max-w-4xl mx-auto p-6">
              <div className="mb-6">
                <Button onClick={() => setCurrentView("verse")} variant="ghost" className="mb-4 text-white">
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Volver al versículo
                </Button>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
                  {selectedVerse.book} {selectedVerse.chapter}
                </h2>

                <div className="space-y-4">
                  {/* Versículos anteriores */}
                  <div className="text-gray-600 text-sm p-4 bg-gray-50 rounded-lg">
                    <p>
                      <strong>{selectedVerse.verse - 1}.</strong> Texto del versículo anterior para contexto...
                    </p>
                  </div>

                  {/* Versículo actual */}
                  <div className="bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-400">
                    <p className="text-lg text-gray-800">
                      <strong>{selectedVerse.verse}.</strong> {selectedVerse.text}
                    </p>
                  </div>

                  {/* Versículos posteriores */}
                  <div className="text-gray-600 text-sm p-4 bg-gray-50 rounded-lg">
                    <p>
                      <strong>{selectedVerse.verse + 1}.</strong> Texto del versículo siguiente para contexto...
                    </p>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <Button
                    onClick={() => setCurrentView("verse")}
                    className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2"
                  >
                    Volver a Vista de Versículo
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Vista de Perfil */}
          {currentView === "profile" && user && (
            <div className="max-w-4xl mx-auto p-6">
              <div className="mb-6">
                <Button onClick={() => setCurrentView("home")} variant="ghost" className="mb-4 text-white">
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Volver
                </Button>
              </div>

              <div className="bg-white rounded-lg p-6">
                <div className="flex items-start gap-6 mb-8">
                  <div className="text-6xl">{user.emoji}</div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">{user.biblicalName}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Fecha de Ingreso: {user.joinDate}</div>
                        <div className="text-sm text-gray-600 mb-1">Notas Creadas: {user.notesCount}</div>
                        <div className="text-sm text-gray-600">Participaciones: {user.participationsCount}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Bio: {user.bio}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Secciones de contenido guardado */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Mis Apuntes</h3>
                    <div className="space-y-2">
                      {user.apuntes.length > 0 ? (
                        user.apuntes.map((apunte, index) => (
                          <div key={index} className="bg-blue-50 p-3 rounded-lg text-sm border-l-4 border-blue-400">
                            {apunte}
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm">No hay apuntes guardados</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Ilustraciones</h3>
                    <div className="space-y-2">
                      {user.ilustraciones.length > 0 ? (
                        user.ilustraciones.map((ilustracion, index) => (
                          <div key={index} className="bg-green-50 p-3 rounded-lg text-sm border-l-4 border-green-400">
                            {ilustracion}
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm">No hay ilustraciones guardadas</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Traducciones</h3>
                    <div className="space-y-2">
                      {user.traducciones.length > 0 ? (
                        user.traducciones.map((traduccion, index) => (
                          <div key={index} className="bg-yellow-50 p-3 rounded-lg text-sm border-l-4 border-yellow-400">
                            {traduccion}
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm">No hay traducciones guardadas</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Vista de Guardados */}
          {currentView === "saved" && (
            <div className="max-w-4xl mx-auto p-6">
              <div className="mb-6">
                <Button onClick={() => setCurrentView("home")} variant="ghost" className="mb-4 text-white">
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Volver
                </Button>
                <h2 className="text-2xl font-bold text-center mb-6 text-white">Versículos Guardados</h2>
              </div>

              <div className="text-center py-12">
                <Bookmark className="h-16 w-16 text-white/50 mx-auto mb-4" />
                <p className="text-white text-lg">No tienes versículos guardados aún.</p>
                <Button
                  onClick={() => setCurrentView("home")}
                  className="mt-4 bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600 text-white rounded-full px-6 py-3"
                >
                  Explorar Versículos
                </Button>
              </div>
            </div>
          )}
        </main>

        {/* Modal de Traducción */}
        <Dialog open={showTranslation} onOpenChange={setShowTranslation}>
          <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto p-0">
            <DialogHeader className="p-6 pb-0 relative">
              <DialogTitle className="text-center text-xl font-bold">
                {translationVerse.reference} - Traducción Completa
              </DialogTitle>
              <button
                onClick={() => setShowTranslation(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </DialogHeader>

            <div className="p-6">
              {/* Texto en español arriba */}
              <div className="text-center mb-6 p-6 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-bold mb-4">{translationVerse.reference}</h3>
                <p className="text-xl italic text-gray-800 mb-4">"{translationVerse.text}"</p>
                <div className="flex items-center justify-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Volume2 className="h-4 w-4 mr-2" />
                    Español
                  </Button>
                </div>
              </div>

              {/* Barras de búsqueda en el medio */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 p-6 bg-white border-2 border-gray-200 rounded-lg">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Búsqueda por Palabra</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar en español o hebreo..."
                      value={wordSearch}
                      onChange={(e) => setWordSearch(e.target.value)}
                      className="pl-10 border-2 border-blue-200 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Búsqueda por Guematría</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-lg font-bold text-purple-600">
                      Σ
                    </span>
                    <Input
                      placeholder="Ingresa valor numérico (ej: 913)"
                      value={gematriaSearch}
                      onChange={(e) => {
                        const value = e.target.value
                        if (/^\d*$/.test(value)) {
                          setGematriaSearch(value)
                        }
                      }}
                      className="pl-10 border-2 border-purple-200 focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>

              {/* Texto hebreo y transliteración */}
              <div className="space-y-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <h3 className="font-bold mb-2">Texto Hebreo (Masorético)</h3>
                  <p className="text-xl text-right mb-2" dir="rtl">
                    {translationVerse.hebrewText}
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Volume2 className="h-4 w-4 mr-2" />
                      Original
                    </Button>
                  </div>
                </div>

                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <h3 className="font-bold mb-2">Transliteración</h3>
                  <p className="text-lg italic text-gray-800">{translationVerse.transliteration}</p>
                </div>

                {/* Traducción palabra por palabra completa */}
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h3 className="font-bold mb-4 text-center">Traducción Palabra por Palabra</h3>

                  {/* Mostrar todas las palabras del versículo completo */}
                  <div className="space-y-6">
                    {/* Fila de palabras en español */}
                    <div>
                      <h4 className="font-medium text-center mb-3 text-blue-600">Español</h4>
                      <div className="flex flex-wrap justify-center gap-2">
                        {["En", "el", "principio", "creó", "Dios", "los", "cielos", "y", "la", "tierra"].map(
                          (word, index) => (
                            <div key={index} className="text-center">
                              <div className="p-2 bg-blue-50 rounded border min-w-[60px]">
                                <span className="text-sm font-medium">{word}</span>
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </div>

                    {/* Fila de palabras en hebreo */}
                    <div>
                      <h4 className="font-medium text-center mb-3 text-green-600">Hebreo</h4>
                      <div className="flex flex-wrap justify-center gap-2" dir="rtl">
                        {["בְּרֵאשִׁית", "בָּרָא", "אֱלֹהִים", "אֵת", "הַשָּׁמַיִם", "וְאֵת", "הָאָרֶץ"].map((word, index) => (
                          <Tooltip key={index}>
                            <TooltipTrigger asChild>
                              <div
                                className="text-center cursor-pointer"
                                onClick={() => {
                                  const wordData = translationVerse.gematria?.find((g) => g.hebrew === word) || {
                                    spanish: ["En", "el", "principio", "creó", "Dios", "los", "cielos"][index] || word,
                                    hebrew: word,
                                    transliteration: ["Be", "re", "shit", "ba", "ra", "E", "lo"][index] || word,
                                    value: Math.floor(Math.random() * 500) + 50,
                                    meaning: "Significado de la palabra hebrea",
                                    letterValues: [],
                                  }
                                  setSelectedWordForComment(wordData)
                                }}
                              >
                                <div className="p-2 bg-green-50 rounded border min-w-[60px] hover:bg-green-100 transition-colors">
                                  <span className="text-sm font-medium">{word}</span>
                                </div>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <div className="space-y-2">
                                <div className="font-bold">
                                  Significado: {translationVerse.gematria?.find((g) => g.hebrew === word)?.meaning}
                                </div>
                                <div className="text-sm">
                                  Guematría: {translationVerse.gematria?.find((g) => g.hebrew === word)?.value}
                                </div>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        ))}
                      </div>
                    </div>

                    {/* Fila de transliteración */}
                    <div>
                      <h4 className="font-medium text-center mb-3 text-orange-600">Pronunciación</h4>
                      <div className="flex flex-wrap justify-center gap-2">
                        {["Be-re-shit", "ba-ra", "E-lo-him", "et", "ha-sha-ma-yim", "ve-et", "ha-a-retz"].map(
                          (word, index) => (
                            <div key={index} className="text-center">
                              <div className="p-2 bg-orange-50 rounded border min-w-[60px]">
                                <span className="text-sm font-medium">{word}</span>
                                <Button variant="ghost" size="sm" className="ml-1 p-0 h-auto">
                                  <Volume2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Campos para agregar contenido */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-bold text-sm mb-2 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Mis Apuntes
                    </h4>
                    <Textarea
                      placeholder="Escribe tus apuntes privados aquí..."
                      className="min-h-[80px] text-xs mb-2"
                    />
                    <Button size="sm" className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                      Guardar Apunte
                    </Button>

                    {/* Mostrar apuntes guardados */}
                    <div className="mt-3 space-y-2">
                      {user?.apuntes.slice(0, 2).map((apunte, index) => (
                        <div
                          key={index}
                          className="p-2 bg-white rounded text-xs text-gray-700 border-l-2 border-blue-400"
                        >
                          {apunte}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-bold text-sm mb-2 flex items-center gap-2">
                      <MessageCircle className="h-4 w-4" />
                      Ilustraciones
                    </h4>
                    <Textarea
                      placeholder="Comparte enseñanzas e ilustraciones..."
                      className="min-h-[80px] text-xs mb-2"
                    />
                    <Button size="sm" className="w-full bg-green-500 hover:bg-green-600 text-white">
                      Guardar Ilustración
                    </Button>

                    {/* Mostrar ilustraciones guardadas */}
                    <div className="mt-3 space-y-2">
                      {user?.ilustraciones.slice(0, 2).map((ilustracion, index) => (
                        <div
                          key={index}
                          className="p-2 bg-white rounded text-xs text-gray-700 border-l-2 border-green-400"
                        >
                          {ilustracion}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <h4 className="font-bold text-sm mb-2 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Traducciones
                    </h4>
                    <Textarea
                      placeholder="Agrega tu interpretación y traducción..."
                      className="min-h-[80px] text-xs mb-2"
                    />
                    <Button size="sm" className="w-full bg-yellow-500 hover:bg-yellow-600 text-white">
                      Guardar Traducción
                    </Button>

                    {/* Mostrar traducciones guardadas */}
                    <div className="mt-3 space-y-2">
                      {user?.traducciones.slice(0, 2).map((traduccion, index) => (
                        <div
                          key={index}
                          className="p-2 bg-white rounded text-xs text-gray-700 border-l-2 border-yellow-400"
                        >
                          {traduccion}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Comentarios por palabra */}
                {selectedWordForComment && (
                  <div className="p-4 bg-gray-50 rounded-lg border-2 border-blue-200">
                    <h4 className="font-bold mb-4">
                      Participar palabra: {selectedWordForComment.spanish} ({selectedWordForComment.hebrew})
                    </h4>

                    <div className="space-y-4">
                      <Textarea
                        placeholder={
                          commentType === "apuntes"
                            ? "Escribe tus notas privadas sobre esta palabra..."
                            : commentType === "ilustra"
                              ? "Comparte enseñanzas sobre el significado original..."
                              : "Agrega tu interpretación y traducción..."
                        }
                        value={wordComment}
                        onChange={(e) => setWordComment(e.target.value)}
                        className="min-h-[100px]"
                      />

                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSelectedWordForComment(null)
                            setWordComment("")
                          }}
                        >
                          Cancelar
                        </Button>
                        <Button onClick={addWordComment} className="bg-purple-500 hover:bg-purple-600 text-white">
                          Guardar en{" "}
                          {commentType === "apuntes"
                            ? "Apuntes"
                            : commentType === "ilustra"
                              ? "Ilustraciones"
                              : "Traducciones"}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal de Formato de Texto */}
        <Dialog open={showTextFormatModal} onOpenChange={setShowTextFormatModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Formato de Texto</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Tamaño de fuente: {selectedVerse?.textFormat?.fontSize || 18}px
                </label>
                <Slider
                  value={[selectedVerse?.textFormat?.fontSize || 18]}
                  onValueChange={(value) =>
                    updateTextFormat(
                      value[0],
                      selectedVerse?.textFormat?.isBold || false,
                      selectedVerse?.textFormat?.isItalic || false,
                    )
                  }
                  min={12}
                  max={32}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="flex gap-4">
                <Button
                  variant={selectedVerse?.textFormat?.isBold ? "default" : "outline"}
                  onClick={() =>
                    updateTextFormat(
                      selectedVerse?.textFormat?.fontSize || 18,
                      !selectedVerse?.textFormat?.isBold,
                      selectedVerse?.textFormat?.isItalic || false,
                    )
                  }
                  className="flex items-center gap-2"
                >
                  <Bold className="h-4 w-4" />
                  Negrita
                </Button>
                <Button
                  variant={selectedVerse?.textFormat?.isItalic ? "default" : "outline"}
                  onClick={() =>
                    updateTextFormat(
                      selectedVerse?.textFormat?.fontSize || 18,
                      selectedVerse?.textFormat?.isBold || false,
                      !selectedVerse?.textFormat?.isItalic,
                    )
                  }
                  className="flex items-center gap-2"
                >
                  <Italic className="h-4 w-4" />
                  Cursiva
                </Button>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Vista previa:</h4>
                <p
                  style={{
                    fontSize: `${selectedVerse?.textFormat?.fontSize || 18}px`,
                    fontWeight: selectedVerse?.textFormat?.isBold ? "bold" : "normal",
                    fontStyle: selectedVerse?.textFormat?.isItalic ? "italic" : "normal",
                  }}
                >
                  "{selectedVerse?.text}"
                </p>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => setShowTextFormatModal(false)}>Aplicar</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal de Notas del Versículo */}
        <Dialog open={showNotesModal} onOpenChange={setShowNotesModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Notas del Versículo - {selectedVerse?.reference}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Textarea
                placeholder="Escribe tus notas privadas sobre este versículo..."
                value={verseNotes}
                onChange={(e) => setVerseNotes(e.target.value)}
                className="min-h-[200px]"
              />

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowNotesModal(false)}>
                  Cancelar
                </Button>
                <Button onClick={saveVerseNotes} className="bg-blue-500 hover:bg-blue-600 text-white">
                  Guardar Notas
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal de Compartir */}
        <Dialog open={showShareModal} onOpenChange={setShowShareModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Compartir Versículo</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm italic">"{selectedVerse?.text}"</p>
                <p className="text-sm font-medium mt-2">- {selectedVerse?.reference}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={() => shareToSocialMedia("whatsapp")}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  WhatsApp
                </Button>
                <Button
                  onClick={() => shareToSocialMedia("facebook")}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Facebook
                </Button>
                <Button
                  onClick={() => shareToSocialMedia("twitter")}
                  className="bg-sky-500 hover:bg-sky-600 text-white"
                >
                  Twitter
                </Button>
                <Button
                  onClick={() => shareToSocialMedia("instagram")}
                  className="bg-pink-500 hover:bg-pink-600 text-white"
                >
                  Instagram
                </Button>
              </div>

              <Button variant="outline" className="w-full bg-transparent">
                <Copy className="h-4 w-4 mr-2" />
                Copiar al Portapapeles
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal de Proverbio */}
        <Dialog open={showProverbioModal} onOpenChange={setShowProverbioModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Inspira tu Proverbio</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Textarea
                placeholder="Escribe tu proverbio inspirador..."
                value={newProverbio}
                onChange={(e) => setNewProverbio(e.target.value)}
                className="min-h-[100px]"
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Color de fondo</label>
                  <Input
                    type="color"
                    value={proverbioBackground}
                    onChange={(e) => setProverbioBackground(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Color de texto</label>
                  <Input
                    type="color"
                    value={proverbioTextColor}
                    onChange={(e) => setProverbioTextColor(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tamaño de fuente: {proverbioFontSize}px</label>
                <Slider
                  value={[proverbioFontSize]}
                  onValueChange={(value) => setProverbioFontSize(value[0])}
                  min={12}
                  max={24}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Vista previa:</h4>
                <div
                  className="p-4 rounded-lg text-center"
                  style={{
                    background: proverbioBackground,
                    color: proverbioTextColor,
                    fontSize: `${proverbioFontSize}px`,
                  }}
                >
                  {newProverbio || "Tu proverbio aparecerá aquí..."}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowProverbioModal(false)}>
                  Cancelar
                </Button>
                <Button className="bg-purple-500 hover:bg-purple-600 text-white">Publicar Proverbio</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal de Mensaje Privado */}
        <Dialog open={showMessageModal} onOpenChange={setShowMessageModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Mensaje Privado</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Los usuarios mantienen su identidad privada. Solo puedes ver sus nombres bíblicos.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg max-h-60 overflow-y-auto">
                <div className="space-y-3">
                  <div className="bg-white p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">David</span>
                      <span className="text-xs text-gray-500">hace 2 min</span>
                    </div>
                    <p className="text-sm">Hola, me gustó mucho tu comentario sobre este versículo</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg ml-6">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">Tú</span>
                      <span className="text-xs text-gray-500">hace 1 min</span>
                    </div>
                    <p className="text-sm">¡Gracias! Es un versículo muy poderoso</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Input placeholder="Escribe tu mensaje..." className="flex-1" />
                <Button className="bg-teal-500 hover:bg-teal-600 text-white">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal de Etiquetado */}
        <Dialog open={showTagModal} onOpenChange={setShowTagModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Etiquetar Versículo</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {tagStep === "book" && (
                <div>
                  <h4 className="font-medium mb-4">Paso 1: Selecciona el libro</h4>
                  <div className="grid grid-cols-4 gap-2 max-h-60 overflow-y-auto">
                    {biblicalBooks.map((book) => (
                      <Button
                        key={book.id}
                        variant="outline"
                        className="text-xs p-2 bg-transparent"
                        onClick={() => {
                          setTaggedBook(book)
                          setTagStep("chapter")
                        }}
                      >
                        {book.abbreviation}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {tagStep === "chapter" && taggedBook && (
                <div>
                  <h4 className="font-medium mb-4">Paso 2: Selecciona el capítulo de {taggedBook.name}</h4>
                  <div className="grid grid-cols-8 gap-2 max-h-60 overflow-y-auto">
                    {Array.from({ length: taggedBook.chapters }, (_, i) => i + 1).map((chapter) => (
                      <Button
                        key={chapter}
                        variant="outline"
                        className="text-xs p-2 bg-transparent"
                        onClick={() => {
                          setTaggedChapter(chapter)
                          setTagStep("verse")
                        }}
                      >
                        {chapter}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {tagStep === "verse" && taggedBook && taggedChapter && (
                <div>
                  <h4 className="font-medium mb-4">
                    Paso 3: Selecciona el versículo de {taggedBook.name} {taggedChapter}
                  </h4>
                  <div className="grid grid-cols-8 gap-2 max-h-60 overflow-y-auto">
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((verse) => (
                      <Button
                        key={verse}
                        variant="outline"
                        className="text-xs p-2 bg-transparent"
                        onClick={() => {
                          setTaggedVerse(verse)
                          setTagStep("comment")
                        }}
                      >
                        {verse}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {tagStep === "comment" && taggedBook && taggedChapter && taggedVerse && (
                <div>
                  <h4 className="font-medium mb-4">
                    Participar sobre la relación con {taggedBook.name} {taggedChapter}:{taggedVerse}
                  </h4>
                  <Textarea
                    placeholder="Explica la relación entre estos versículos..."
                    value={tagComment}
                    onChange={(e) => setTagComment(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <div className="flex justify-end gap-2 mt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setTagStep("book")
                        setTaggedBook(null)
                        setTaggedChapter(null)
                        setTaggedVerse(null)
                        setTagComment("")
                        setShowTagModal(false)
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={() => {
                        setTagStep("book")
                        setTaggedBook(null)
                        setTaggedChapter(null)
                        setTaggedVerse(null)
                        setTagComment("")
                        setShowTagModal(false)
                      }}
                      className="bg-purple-500 hover:bg-purple-600 text-white"
                    >
                      Etiquetar
                    </Button>
                  </div>
                </div>
              )}

              {tagStep !== "comment" && (
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setTagStep("book")
                      setTaggedBook(null)
                      setTaggedChapter(null)
                      setTaggedVerse(null)
                      setShowTagModal(false)
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal de Notas */}
        <Dialog open={showNotebook} onOpenChange={setShowNotebook}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Mi Cuaderno de Notas</DialogTitle>
            </DialogHeader>
            <div className="p-6">
              {/* Formulario para nueva nota */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-bold mb-4">{editingNote ? "Editar Nota" : "Nueva Nota"}</h3>
                <div className="space-y-4">
                  <Input
                    placeholder="Título de la nota..."
                    value={newNoteTitle}
                    onChange={(e) => setNewNoteTitle(e.target.value)}
                    className="w-full"
                  />
                  <Textarea
                    placeholder="Contenido de la nota..."
                    value={newNoteContent}
                    onChange={(e) => setNewNoteContent(e.target.value)}
                    className="min-h-[120px] w-full"
                  />
                  <div className="flex justify-end gap-2">
                    {editingNote && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setEditingNote(null)
                          setNewNoteTitle("")
                          setNewNoteContent("")
                        }}
                      >
                        Cancelar
                      </Button>
                    )}
                    <Button
                      onClick={editingNote ? updateNote : saveNote}
                      className="bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600 text-white"
                    >
                      {editingNote ? "Actualizar Nota" : "Guardar Nota"}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Lista de notas guardadas */}
              <div className="space-y-4">
                {user?.savedNotes && user.savedNotes.length > 0 ? (
                  user.savedNotes.map((note) => (
                    <Card key={note.id} className="bg-white">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-bold text-lg">{note.title}</h4>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => editNote(note)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              Editar
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteNote(note.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Eliminar
                            </Button>
                          </div>
                        </div>
                        <p className="text-gray-700 mb-2">{note.content}</p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>{note.date}</span>
                          {note.verseReference && (
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{note.verseReference}</span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <img src="/images/notebook-icon.png" alt="Notas" className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-gray-500 text-lg">Tu cuaderno de notas está vacío.</p>
                    <p className="text-gray-400 text-sm">Crea tu primera nota usando el formulario de arriba.</p>
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal de Compartir App */}
        <Dialog open={showShareAppModal} onOpenChange={setShowShareAppModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Compartir la App</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Comparte esta app con tus amigos y familiares para que juntos podamos explorar la palabra de Dios.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <Button className="bg-green-500 hover:bg-green-600 text-white">WhatsApp</Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">Facebook</Button>
                <Button className="bg-sky-500 hover:bg-sky-600 text-white">Twitter</Button>
                <Button className="bg-pink-500 hover:bg-pink-600 text-white">Instagram</Button>
              </div>
              <Button variant="outline" className="w-full bg-transparent">
                <Copy className="h-4 w-4 mr-2" />
                Copiar enlace
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal de Cómo Funciona */}
        <Dialog open={showHowItWorksModal} onOpenChange={setShowHowItWorksModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Cómo Funciona la App</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Esta app te permite explorar la Biblia de una manera interactiva y social. Aquí te explicamos cómo
                funciona:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  <strong>Explorar versículos:</strong> Navega por los diferentes libros y capítulos de la Biblia.
                </li>
                <li>
                  <strong>Participar:</strong> Comparte tus reflexiones y comentarios sobre los versículos.
                </li>
                <li>
                  <strong>Guardar:</strong> Guarda tus versículos favoritos para acceder a ellos fácilmente.
                </li>
                <li>
                  <strong>Compartir:</strong> Comparte versículos con tus amigos y familiares en las redes sociales.
                </li>
              </ul>
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal de Mis Participaciones */}
        <Dialog open={showUserParticipationsModal} onOpenChange={setShowUserParticipationsModal}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Mis Participaciones</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">Aquí puedes ver todas tus participaciones en la app.</p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">No tienes participaciones aún.</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal de Apuntes de Versículos */}
        <Dialog open={showVerseNotesModal} onOpenChange={setShowVerseNotesModal}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Apuntes de Versículos</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">Aquí puedes ver todos tus apuntes de versículos.</p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">No tienes apuntes aún.</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  )
}
