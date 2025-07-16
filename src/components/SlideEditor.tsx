import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Trash2, Plus, Minus } from 'lucide-react'

interface Slide {
  id: string
  type: 'title' | 'content' | 'image' | 'chart'
  title: string
  content: string[]
  notes?: string
}

interface SlideEditorProps {
  slide: Slide
  onUpdate: (updates: Partial<Slide>) => void
  onDelete: () => void
}

export default function SlideEditor({ slide, onUpdate, onDelete }: SlideEditorProps) {
  const [localSlide, setLocalSlide] = useState(slide)

  const updateField = (field: keyof Slide, value: any) => {
    const updated = { ...localSlide, [field]: value }
    setLocalSlide(updated)
    onUpdate({ [field]: value })
  }

  const addContentItem = () => {
    const newContent = [...localSlide.content, 'New point']
    updateField('content', newContent)
  }

  const removeContentItem = (index: number) => {
    const newContent = localSlide.content.filter((_, i) => i !== index)
    updateField('content', newContent)
  }

  const updateContentItem = (index: number, value: string) => {
    const newContent = [...localSlide.content]
    newContent[index] = value
    updateField('content', newContent)
  }

  return (
    <div className="h-full flex">
      {/* Slide Preview */}
      <div className="flex-1 p-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <Card className="aspect-[16/9] bg-white shadow-lg">
            <CardContent className="p-12 h-full flex flex-col">
              {localSlide.type === 'title' ? (
                <div className="flex-1 flex flex-col justify-center text-center">
                  <h1 className="text-5xl font-bold mb-6 text-gray-900">
                    {localSlide.title}
                  </h1>
                  {localSlide.content.map((line, index) => (
                    <p key={index} className="text-xl text-gray-600 mb-2">
                      {line}
                    </p>
                  ))}
                </div>
              ) : (
                <div className="h-full">
                  <h2 className="text-3xl font-bold mb-8 text-gray-900">
                    {localSlide.title}
                  </h2>
                  <div className="text-lg text-gray-700 space-y-4">
                    {localSlide.content.map((item, index) => (
                      <div key={index} className="flex items-start">
                        <span className="text-primary mr-3 mt-1">•</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Editor Panel */}
      <div className="w-96 border-l bg-white p-6 overflow-y-auto">
        <div className="space-y-6">
          {/* Slide Actions */}
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Edit Slide</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={onDelete}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          {/* Slide Type */}
          <div>
            <label className="block text-sm font-medium mb-2">Slide Type</label>
            <Select
              value={localSlide.type}
              onValueChange={(value: 'title' | 'content' | 'image' | 'chart') => 
                updateField('type', value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="title">Title Slide</SelectItem>
                <SelectItem value="content">Content Slide</SelectItem>
                <SelectItem value="image">Image Slide</SelectItem>
                <SelectItem value="chart">Chart Slide</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Slide Title */}
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <Input
              value={localSlide.title}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="Enter slide title"
            />
          </div>

          {/* Content Items */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium">Content</label>
              <Button
                variant="outline"
                size="sm"
                onClick={addContentItem}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-2">
              {localSlide.content.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={item}
                    onChange={(e) => updateContentItem(index, e.target.value)}
                    placeholder={`${localSlide.type === 'title' ? 'Subtitle' : 'Bullet point'} ${index + 1}`}
                    className="flex-1"
                  />
                  {localSlide.content.length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeContentItem(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Speaker Notes */}
          <div>
            <label className="block text-sm font-medium mb-2">Speaker Notes</label>
            <Textarea
              value={localSlide.notes || ''}
              onChange={(e) => updateField('notes', e.target.value)}
              placeholder="Add notes for this slide..."
              rows={4}
            />
          </div>
        </div>
      </div>
    </div>
  )
}