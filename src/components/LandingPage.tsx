import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Card, CardContent } from './ui/card'
import { Sparkles, Zap, Download, Eye } from 'lucide-react'

interface LandingPageProps {
  onStartGenerating: () => void
}

export default function LandingPage({ onStartGenerating }: LandingPageProps) {
  const [topic, setTopic] = useState('')
  const [outline, setOutline] = useState('')

  const handleGenerate = () => {
    if (topic.trim()) {
      // Store the topic and outline for the generator to use
      localStorage.setItem('presentationTopic', topic)
      localStorage.setItem('presentationOutline', outline)
      onStartGenerating()
    }
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold">AI PowerPoint</span>
            </div>
            <Button variant="outline" size="sm">
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold tracking-tight mb-6">
            Create stunning presentations with{' '}
            <span className="text-primary">AI magic</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Transform your ideas into professional slide decks in seconds. 
            Just describe your topic and let AI do the heavy lifting.
          </p>

          {/* Input Section */}
          <Card className="max-w-2xl mx-auto mb-12">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-left">
                    What's your presentation about?
                  </label>
                  <Input
                    placeholder="e.g., Marketing strategy for Q1 2024"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="text-lg h-12"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-left">
                    Additional details (optional)
                  </label>
                  <Textarea
                    placeholder="Add any specific points, structure, or requirements..."
                    value={outline}
                    onChange={(e) => setOutline(e.target.value)}
                    className="min-h-[100px] resize-none"
                  />
                </div>
                <Button 
                  onClick={handleGenerate}
                  disabled={!topic.trim()}
                  size="lg"
                  className="w-full h-12 text-lg"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Presentation
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Lightning Fast</h3>
                <p className="text-muted-foreground">
                  Generate complete presentations in under 30 seconds
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Eye className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Professional Design</h3>
                <p className="text-muted-foreground">
                  Beautiful layouts and themes that impress your audience
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Download className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Export Ready</h3>
                <p className="text-muted-foreground">
                  Download as PowerPoint, PDF, or share online instantly
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Example Topics */}
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4">Try these examples:</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                'Product launch strategy',
                'Quarterly business review',
                'Team training workshop',
                'Investment pitch deck',
                'Project status update'
              ].map((example) => (
                <Button
                  key={example}
                  variant="outline"
                  size="sm"
                  onClick={() => setTopic(example)}
                  className="text-sm"
                >
                  {example}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}