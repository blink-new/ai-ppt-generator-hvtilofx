import { useState, useEffect, useCallback } from 'react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { Progress } from './ui/progress'
import { ArrowLeft, Download, Eye, Edit3, Plus } from 'lucide-react'
import { blink } from '../blink/client'
import SlideEditor from './SlideEditor'
import PresentationViewer from './PresentationViewer'

interface GeneratorInterfaceProps {
  onBackToLanding: () => void
}

interface Slide {
  id: string
  type: 'title' | 'content' | 'image' | 'chart'
  title: string
  content: string[]
  notes?: string
}

export default function GeneratorInterface({ onBackToLanding }: GeneratorInterfaceProps) {
  const [isGenerating, setIsGenerating] = useState(true)
  const [progress, setProgress] = useState(0)
  const [slides, setSlides] = useState<Slide[]>([])
  const [currentView, setCurrentView] = useState<'editor' | 'viewer'>('editor')
  const [selectedSlide, setSelectedSlide] = useState<string | null>(null)

  const generatePresentation = useCallback(async () => {
    setIsGenerating(true)
    setProgress(0)

    // Simulate AI generation with progress updates
    const progressSteps = [
      { progress: 20, message: 'Analyzing your topic...' },
      { progress: 40, message: 'Creating slide structure...' },
      { progress: 60, message: 'Generating content...' },
      { progress: 80, message: 'Applying design...' },
      { progress: 100, message: 'Finalizing presentation...' }
    ]

    for (const step of progressSteps) {
      await new Promise(resolve => setTimeout(resolve, 800))
      setProgress(step.progress)
    }

    // Generate sample slides using AI
    try {
      const { object: presentationData } = await blink.ai.generateObject({
        prompt: 'Create a professional presentation about "Marketing Strategy for Q1 2024" with 5-7 slides. Include a title slide, overview, key strategies, implementation timeline, and conclusion.',
        schema: {
          type: 'object',
          properties: {
            slides: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  type: { type: 'string', enum: ['title', 'content', 'image', 'chart'] },
                  title: { type: 'string' },
                  content: {
                    type: 'array',
                    items: { type: 'string' }
                  },
                  notes: { type: 'string' }
                },
                required: ['id', 'type', 'title', 'content']
              }
            }
          },
          required: ['slides']
        }
      })

      setSlides(presentationData.slides)
      setSelectedSlide(presentationData.slides[0]?.id || null)
    } catch (error) {
      console.error('Error generating presentation:', error)
      // Fallback to sample data
      const sampleSlides: Slide[] = [
        {
          id: '1',
          type: 'title',
          title: 'Marketing Strategy Q1 2024',
          content: ['Driving Growth Through Innovation', 'Prepared by Marketing Team'],
          notes: 'Welcome everyone to our Q1 marketing strategy presentation.'
        },
        {
          id: '2',
          type: 'content',
          title: 'Executive Summary',
          content: [
            'Focus on digital transformation',
            'Expand into new market segments',
            'Increase brand awareness by 40%',
            'Launch 3 major campaigns'
          ],
          notes: 'This slide covers our main objectives for the quarter.'
        },
        {
          id: '3',
          type: 'content',
          title: 'Key Strategies',
          content: [
            'Social Media Amplification',
            'Content Marketing Excellence',
            'Influencer Partnerships',
            'Data-Driven Optimization'
          ],
          notes: 'These are our four pillars for success this quarter.'
        },
        {
          id: '4',
          type: 'content',
          title: 'Implementation Timeline',
          content: [
            'January: Campaign planning and setup',
            'February: Launch major initiatives',
            'March: Optimization and scaling',
            'April: Results analysis and planning'
          ],
          notes: 'Timeline shows our phased approach to execution.'
        },
        {
          id: '5',
          type: 'content',
          title: 'Expected Outcomes',
          content: [
            '40% increase in brand awareness',
            '25% growth in lead generation',
            '15% improvement in conversion rates',
            'ROI target of 300%'
          ],
          notes: 'These metrics will define our success.'
        }
      ]
      setSlides(sampleSlides)
      setSelectedSlide(sampleSlides[0].id)
    }

    setIsGenerating(false)
  }, [])

  useEffect(() => {
    generatePresentation()
  }, [generatePresentation])

  const addSlide = () => {
    const newSlide: Slide = {
      id: Date.now().toString(),
      type: 'content',
      title: 'New Slide',
      content: ['Add your content here'],
      notes: ''
    }
    setSlides([...slides, newSlide])
    setSelectedSlide(newSlide.id)
  }

  const updateSlide = (slideId: string, updates: Partial<Slide>) => {
    setSlides(slides.map(slide => 
      slide.id === slideId ? { ...slide, ...updates } : slide
    ))
  }

  const deleteSlide = (slideId: string) => {
    const newSlides = slides.filter(slide => slide.id !== slideId)
    setSlides(newSlides)
    if (selectedSlide === slideId) {
      setSelectedSlide(newSlides[0]?.id || null)
    }
  }

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-md w-full mx-auto text-center">
          <div className="mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
            <h2 className="text-2xl font-semibold mb-2">Creating your presentation</h2>
            <p className="text-muted-foreground">AI is working its magic...</p>
          </div>
          
          <div className="space-y-4">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-muted-foreground">
              {progress < 20 && 'Analyzing your topic...'}
              {progress >= 20 && progress < 40 && 'Creating slide structure...'}
              {progress >= 40 && progress < 60 && 'Generating content...'}
              {progress >= 60 && progress < 80 && 'Applying design...'}
              {progress >= 80 && 'Finalizing presentation...'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={onBackToLanding}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <h1 className="text-lg font-semibold">Marketing Strategy Q1 2024</h1>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant={currentView === 'editor' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentView('editor')}
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button
                variant={currentView === 'viewer' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentView('viewer')}
              >
                <Eye className="w-4 h-4 mr-2" />
                Present
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </header>

      {currentView === 'editor' ? (
        <div className="flex h-[calc(100vh-64px)]">
          {/* Slide Navigation */}
          <div className="w-64 border-r bg-muted/30 p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Slides ({slides.length})</h3>
              <Button size="sm" variant="outline" onClick={addSlide}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-2">
              {slides.map((slide, index) => (
                <Card
                  key={slide.id}
                  className={`cursor-pointer transition-colors ${
                    selectedSlide === slide.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedSlide(slide.id)}
                >
                  <CardContent className="p-3">
                    <div className="text-xs text-muted-foreground mb-1">
                      Slide {index + 1}
                    </div>
                    <div className="text-sm font-medium truncate">
                      {slide.title}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {slide.type}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Slide Editor */}
          <div className="flex-1">
            {selectedSlide && (
              <SlideEditor
                slide={slides.find(s => s.id === selectedSlide)!}
                onUpdate={(updates) => updateSlide(selectedSlide, updates)}
                onDelete={() => deleteSlide(selectedSlide)}
              />
            )}
          </div>
        </div>
      ) : (
        <PresentationViewer slides={slides} />
      )}
    </div>
  )
}