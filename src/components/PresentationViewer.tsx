import { useState, useEffect, useCallback } from 'react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react'

interface Slide {
  id: string
  type: 'title' | 'content' | 'image' | 'chart'
  title: string
  content: string[]
  notes?: string
}

interface PresentationViewerProps {
  slides: Slide[]
}

export default function PresentationViewer({ slides }: PresentationViewerProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isAutoPlay, setIsAutoPlay] = useState(false)

  const currentSlide = slides[currentSlideIndex]

  const nextSlide = useCallback(() => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1)
    }
  }, [currentSlideIndex, slides.length])

  const prevSlide = useCallback(() => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1)
    }
  }, [currentSlideIndex])

  const goToSlide = (index: number) => {
    setCurrentSlideIndex(index)
  }

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlay && !isFullscreen) {
      const interval = setInterval(() => {
        if (currentSlideIndex < slides.length - 1) {
          setCurrentSlideIndex(prev => prev + 1)
        } else {
          setIsAutoPlay(false)
        }
      }, 5000)

      return () => clearInterval(interval)
    }
  }, [isAutoPlay, currentSlideIndex, slides.length, isFullscreen])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
        nextSlide()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        prevSlide()
      } else if (e.key === 'Escape') {
        setIsFullscreen(false)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [nextSlide, prevSlide])

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen?.()
    } else {
      document.exitFullscreen?.()
    }
    setIsFullscreen(!isFullscreen)
  }

  if (!currentSlide) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-muted-foreground">No slides to display</p>
      </div>
    )
  }

  return (
    <div className={`h-full flex flex-col ${isFullscreen ? 'fixed inset-0 z-50 bg-black' : ''}`}>
      {/* Controls */}
      {!isFullscreen && (
        <div className="flex items-center justify-between p-4 border-b bg-white/80 backdrop-blur-sm">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={prevSlide}
              disabled={currentSlideIndex === 0}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-muted-foreground">
              {currentSlideIndex + 1} of {slides.length}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={nextSlide}
              disabled={currentSlideIndex === slides.length - 1}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAutoPlay(!isAutoPlay)}
            >
              {isAutoPlay ? (
                <Pause className="w-4 h-4 mr-2" />
              ) : (
                <Play className="w-4 h-4 mr-2" />
              )}
              {isAutoPlay ? 'Pause' : 'Auto Play'}
            </Button>
            <Button variant="outline" size="sm" onClick={toggleFullscreen}>
              Fullscreen
            </Button>
          </div>
        </div>
      )}

      {/* Main Slide Display */}
      <div className="flex-1 flex">
        {/* Slide Thumbnails */}
        {!isFullscreen && (
          <div className="w-48 border-r bg-muted/30 p-4 overflow-y-auto">
            <h3 className="font-medium mb-4">Slides</h3>
            <div className="space-y-2">
              {slides.map((slide, index) => (
                <Card
                  key={slide.id}
                  className={`cursor-pointer transition-colors ${
                    index === currentSlideIndex ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => goToSlide(index)}
                >
                  <CardContent className="p-2">
                    <div className="aspect-[16/9] bg-white rounded border mb-2 flex items-center justify-center text-xs">
                      <div className="text-center">
                        <div className="font-medium truncate">{slide.title}</div>
                        <div className="text-muted-foreground">{slide.type}</div>
                      </div>
                    </div>
                    <div className="text-xs text-center">
                      Slide {index + 1}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Main Slide */}
        <div className="flex-1 flex items-center justify-center p-8 bg-gray-100">
          <Card className={`bg-white shadow-2xl ${
            isFullscreen ? 'w-full h-full max-w-none' : 'w-full max-w-5xl aspect-[16/9]'
          }`}>
            <CardContent className="h-full p-12 flex flex-col">
              {currentSlide.type === 'title' ? (
                <div className="flex-1 flex flex-col justify-center text-center">
                  <h1 className="text-6xl font-bold mb-8 text-gray-900">
                    {currentSlide.title}
                  </h1>
                  {currentSlide.content.map((item, index) => (
                    <p key={index} className="text-2xl text-gray-600 mb-4">
                      {item}
                    </p>
                  ))}
                </div>
              ) : (
                <>
                  <div className="mb-12">
                    <h2 className="text-4xl font-bold text-gray-900">
                      {currentSlide.title}
                    </h2>
                  </div>
                  <div className="flex-1">
                    {currentSlide.type === 'content' && (
                      <ul className="space-y-6">
                        {currentSlide.content.map((item, index) => (
                          <li key={index} className="flex items-start">
                            <div className="w-3 h-3 bg-primary rounded-full mt-4 mr-6 flex-shrink-0"></div>
                            <span className="text-2xl text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {currentSlide.type === 'image' && (
                      <div className="h-full bg-gray-100 rounded-lg flex items-center justify-center">
                        <p className="text-gray-500 text-xl">Image placeholder</p>
                      </div>
                    )}
                    {currentSlide.type === 'chart' && (
                      <div className="h-full bg-gray-100 rounded-lg flex items-center justify-center">
                        <p className="text-gray-500 text-xl">Chart placeholder</p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Fullscreen Controls */}
      {isFullscreen && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 bg-black/50 rounded-lg px-4 py-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={prevSlide}
            disabled={currentSlideIndex === 0}
            className="text-white hover:bg-white/20"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-white text-sm">
            {currentSlideIndex + 1} / {slides.length}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={nextSlide}
            disabled={currentSlideIndex === slides.length - 1}
            className="text-white hover:bg-white/20"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFullscreen}
            className="text-white hover:bg-white/20"
          >
            Exit
          </Button>
        </div>
      )}

      {/* Speaker Notes */}
      {!isFullscreen && currentSlide.notes && (
        <div className="border-t bg-muted/30 p-4">
          <h4 className="font-medium mb-2">Speaker Notes</h4>
          <p className="text-sm text-muted-foreground">{currentSlide.notes}</p>
        </div>
      )}
    </div>
  )
}