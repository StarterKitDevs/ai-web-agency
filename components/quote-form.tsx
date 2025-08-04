"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, CreditCard, CheckCircle, Calculator, Upload, X, Image as ImageIcon, Download, Mail, Share2 } from 'lucide-react'
import { showError, showSuccess } from '@/lib/toast'
import { cn } from '@/lib/utils'
import React from 'react'

const formSchema = z.object({
  businessName: z.string().min(1, 'Business name is required'),
  email: z.string().email('Valid email is required'),
  websiteType: z.enum(['business', 'portfolio', 'blog']),
  features: z.array(z.string()),
  designStyle: z.enum(['modern', 'classic', 'minimalist']),
  budget: z.number().min(150).max(500),
  projectDescription: z.string().optional(),
  images: z.array(z.string()).max(4, 'Maximum 4 images allowed')
})

type FormData = z.infer<typeof formSchema>

const websiteTypes = [
  { value: 'business', label: 'Business Website', price: 150 },
  { value: 'portfolio', label: 'Portfolio/Personal', price: 100 },
  { value: 'blog', label: 'Blog/News Site', price: 125 }
]

const features = [
  { id: 'analytics', label: 'Analytics Setup', price: 30 },
  { id: 'responsive', label: 'Mobile Responsive', price: 0 },
  { id: 'ssl', label: 'SSL Security', price: 0 },
  { id: 'cms', label: 'Content Management', price: 75 }
]

const designStyles = [
  { value: 'modern', label: 'Modern', description: 'Clean, minimalist with bold typography' },
  { value: 'classic', label: 'Classic', description: 'Traditional, professional layout' },
  { value: 'minimalist', label: 'Minimalist', description: 'Simple, focused on content' }
]

export default function QuoteForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [estimatedPrice, setEstimatedPrice] = useState(0)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [generationStep, setGenerationStep] = useState('')
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  
  // State for additional text boxes
  const [businessGoals, setBusinessGoals] = useState('')
  const [targetAudience, setTargetAudience] = useState('')
  const [competitors, setCompetitors] = useState('')
  const [specialRequirements, setSpecialRequirements] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      budget: 250,
      features: ['responsive'],
      images: []
    }
  })

  const watchedFeatures = watch('features')
  const watchedBudget = watch('budget')
  const watchedWebsiteType = watch('websiteType')
  const watchedDesignStyle = watch('designStyle')
  const watchedBusinessName = watch('businessName')
  const watchedEmail = watch('email')
  const watchedProjectDescription = watch('projectDescription')

  // Calculate estimated price based on selections
  const calculatePrice = () => {
    let totalPrice = 0

    // Base website type price
    const selectedWebsiteType = websiteTypes.find(type => type.value === watchedWebsiteType)
    if (selectedWebsiteType) {
      totalPrice += selectedWebsiteType.price
    }

    // Add feature prices
    watchedFeatures?.forEach(featureId => {
      const feature = features.find(f => f.id === featureId)
      if (feature) {
        totalPrice += feature.price
      }
    })

    return totalPrice
  }

  const updatePrice = () => {
    const price = calculatePrice()
    setEstimatedPrice(price)
  }

  // Watch for changes and update price
  React.useEffect(() => {
    updatePrice()
  }, [watchedFeatures, watchedWebsiteType])

  // Get selected website type details
  const getSelectedWebsiteType = () => {
    return websiteTypes.find(type => type.value === watchedWebsiteType)
  }

  // Get selected features with prices
  const getSelectedFeatures = () => {
    return watchedFeatures?.map(featureId => {
      const feature = features.find(f => f.id === featureId)
      return feature
    }).filter((feature): feature is NonNullable<typeof feature> => feature !== undefined) || []
  }

  // Get selected design style
  const getSelectedDesignStyle = () => {
    return designStyles.find(style => style.value === watchedDesignStyle)
  }

  // Generate PDF content
  const generatePDFContent = () => {
    const selectedWebsiteType = getSelectedWebsiteType()
    const selectedFeatures = getSelectedFeatures()
    const selectedDesignStyle = getSelectedDesignStyle()
    
    return `
      PROJECT ESTIMATE
      ================
      
      Business: ${watchedBusinessName || 'N/A'}
      Email: ${watchedEmail || 'N/A'}
      
      WEBSITE DETAILS
      ---------------
      Type: ${selectedWebsiteType?.label || 'N/A'}
      Design Style: ${selectedDesignStyle?.label || 'N/A'}
      Budget: $${watchedBudget}
      
      FEATURES
      --------
      ${selectedFeatures.map(f => `• ${f.label}: +$${f.price}`).join('\n')}
      
      PROJECT DETAILS
      --------------
      Description: ${watchedProjectDescription ? '✓ Added' : 'Not provided'}
      Business Goals: ${businessGoals ? '✓ Added' : 'Not provided'}
      Target Audience: ${targetAudience ? '✓ Added' : 'Not provided'}
      Competitors: ${competitors ? '✓ Added' : 'Not provided'}
      Special Requirements: ${specialRequirements ? '✓ Added' : 'Not provided'}
      Images: ${uploadedImages.length}/4
      
      PRICING BREAKDOWN
      ----------------
      Base Website: $${selectedWebsiteType?.price || 0}
      ${selectedFeatures.map(f => `${f.label}: +$${f.price}`).join('\n')}
      
      TOTAL ESTIMATE: $${estimatedPrice}
      
      Generated on: ${new Date().toLocaleDateString()}
    `
  }

  // Download PDF
  const downloadPDF = () => {
    const content = generatePDFContent()
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `project-estimate-${watchedBusinessName || 'website'}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showSuccess('Estimate Downloaded! 📄', 'Your project estimate has been saved.')
  }

  // Share via email
  const shareViaEmail = () => {
    const subject = encodeURIComponent(`Project Estimate - ${watchedBusinessName || 'Website Project'}`)
    const body = encodeURIComponent(generatePDFContent())
    const mailtoLink = `mailto:?subject=${subject}&body=${body}`
    window.open(mailtoLink)
    showSuccess('Email Opened! 📧', 'Your default email client should open with the estimate.')
  }

  // Share estimate
  const shareEstimate = () => {
    if (navigator.share) {
      navigator.share({
        title: `Project Estimate - ${watchedBusinessName || 'Website Project'}`,
        text: generatePDFContent(),
        url: window.location.href
      }).then(() => {
        showSuccess('Estimate Shared! 📤', 'Your estimate has been shared successfully.')
      }).catch(() => {
        showError('Share Failed', 'Unable to share estimate. Please try downloading instead.')
      })
    } else {
      // Fallback to copy to clipboard
      navigator.clipboard.writeText(generatePDFContent()).then(() => {
        showSuccess('Estimate Copied! 📋', 'Your estimate has been copied to clipboard.')
      }).catch(() => {
        showError('Copy Failed', 'Unable to copy estimate. Please try downloading instead.')
      })
    }
  }

  // Handle image upload
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    if (uploadedImages.length >= 4) {
      showError('Upload Limit Reached', 'Maximum 4 images allowed')
      return
    }

    setIsUploading(true)

    try {
      const newImages: string[] = []
      
      for (let i = 0; i < files.length && uploadedImages.length + newImages.length < 4; i++) {
        const file = files[i]
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
          showError('Invalid File Type', 'Please upload only image files')
          continue
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          showError('File Too Large', 'Please upload images smaller than 5MB')
          continue
        }

        // Convert to base64 for preview
        const reader = new FileReader()
        reader.onload = (e) => {
          const result = e.target?.result as string
          if (result) {
            newImages.push(result)
            if (newImages.length === Math.min(files.length, 4 - uploadedImages.length)) {
              setUploadedImages(prev => [...prev, ...newImages])
              setValue('images', [...uploadedImages, ...newImages])
              setIsUploading(false)
            }
          }
        }
        reader.readAsDataURL(file)
      }
    } catch (error) {
      console.error('Image upload error:', error)
      showError('Upload Failed', 'Failed to upload images. Please try again.')
      setIsUploading(false)
    }
  }

  // Remove image
  const removeImage = (index: number) => {
    const newImages = uploadedImages.filter((_, i) => i !== index)
    setUploadedImages(newImages)
    setValue('images', newImages)
  }

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    setShowPaymentModal(true)
    
    try {
      // Step 1: Create project with comprehensive data
      setGenerationStep('Creating your project...')
      const projectResponse = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          business_name: data.businessName,
          email: data.email,
          website_type: data.websiteType,
          features: data.features,
          design_style: data.designStyle,
          budget: data.budget,
          estimated_price: estimatedPrice,
          project_description: data.projectDescription,
          business_goals: businessGoals,
          target_audience: targetAudience,
          competitors: competitors,
          special_requirements: specialRequirements,
          images: data.images
        })
      })

      if (!projectResponse.ok) {
        throw new Error('Failed to create project')
      }

      const project = await projectResponse.json()

      // Step 2: Create payment intent
      setGenerationStep('Setting up payment...')
      const paymentResponse = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          project_id: project.id,
          amount: estimatedPrice * 100 // Convert to cents
        })
      })

      if (!paymentResponse.ok) {
        throw new Error('Failed to create payment intent')
      }

      const paymentData = await paymentResponse.json()

      // Step 3: Process payment
      setGenerationStep('Processing payment...')
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Step 4: Start enhanced website generation
      setGenerationStep('Starting AI website generation...')
      const generationResponse = await fetch('/api/projects/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          project_id: project.id
        })
      })

      if (generationResponse.ok) {
        setGenerationStep('Website generation in progress...')
        showSuccess('Payment Successful! 🎉', 'Your project has been created and will automatically progress through our AI workflow!')
        
        // Get enhanced generation steps from backend
        const generationData = await generationResponse.json()
        const steps = generationData.steps || [
          'Project Manager analyzing requirements...',
          'Design Agent creating mockups...',
          'Development Agent building features...',
          'QA Agent testing functionality...',
          'Deploy Agent launching website...',
          'Final quality assurance...',
          'Website ready for launch!'
        ]

        for (let i = 0; i < steps.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 1000))
          setGenerationStep(steps[i])
        }

        setPaymentSuccess(true)
        
        // Redirect to dashboard after a delay
        setTimeout(() => {
          window.location.href = `/dashboard/${project.id}`
        }, 2000)
      }

    } catch (error) {
      console.error('Form submission error:', error)
      showError('Submission Failed', error instanceof Error ? error.message : 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
      setShowPaymentModal(false)
    }
  }

  const handleFeatureToggle = (featureId: string) => {
    const currentFeatures = watchedFeatures || []
    const newFeatures = currentFeatures.includes(featureId)
      ? currentFeatures.filter(f => f !== featureId)
      : [...currentFeatures, featureId]
    
    setValue('features', newFeatures)
  }

  if (paymentSuccess) {
    return (
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Payment Successful!</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Your project has been created and is being processed. You'll be redirected to your dashboard shortly.
            </p>
            <div className="animate-pulse">
              <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="quote-form-section" className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Get Your Custom Quote</h2>
            <p className="text-lg text-muted-foreground">
              Tell us about your project and get an instant price estimate
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form */}
            <Card>
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Business Name */}
                  <div>
                    <Label htmlFor="businessName">Business Name *</Label>
                    <Input
                      id="businessName"
                      {...register('businessName')}
                      placeholder="Your Business Name"
                      className={cn(errors.businessName && 'border-red-500')}
                    />
                    {errors.businessName && (
                      <p className="text-red-500 text-sm mt-1">{errors.businessName.message}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register('email')}
                      placeholder="your@email.com"
                      className={cn(errors.email && 'border-red-500')}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  {/* Budget - Moved to top */}
                  <div>
                    <Label>Budget Range: ${watchedBudget}</Label>
                    <Slider
                      value={[watchedBudget || 250]}
                      onValueChange={(value) => setValue('budget', value[0])}
                      max={500}
                      min={150}
                      step={50}
                      className="mt-2"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground mt-1">
                      <span>$150</span>
                      <span>$500</span>
                    </div>
                  </div>

                  {/* Website Type */}
                  <div>
                    <Label htmlFor="websiteType">Website Type *</Label>
                    <Select onValueChange={(value) => setValue('websiteType', value as any)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select website type" />
                      </SelectTrigger>
                      <SelectContent>
                        {websiteTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex justify-between items-center w-full">
                              <span>{type.label}</span>
                              <Badge variant="secondary" className="ml-2">${type.price}</Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.websiteType && (
                      <p className="text-red-500 text-sm mt-1">{errors.websiteType.message}</p>
                    )}
                  </div>

                  {/* Project Description */}
                  <div>
                    <Label htmlFor="projectDescription">Project Description</Label>
                    <div className="relative">
                      <textarea
                        id="projectDescription"
                        {...register('projectDescription')}
                        placeholder="Tell us about your project, goals, target audience, and any specific requirements. Be as detailed as possible to help us create the perfect website for your business..."
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
                        rows={4}
                        maxLength={2000}
                        onInput={(e) => {
                          const target = e.target as HTMLTextAreaElement;
                          // Auto-resize based on content
                          target.style.height = 'auto';
                          target.style.height = Math.min(target.scrollHeight, 200) + 'px';
                        }}
                      />
                      <div className="flex justify-between items-center mt-1">
                        <div className="text-xs text-muted-foreground">
                          <span className="font-medium">💡 Tips:</span> Include your business goals, target audience, and any specific features you need
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {watch('projectDescription')?.length || 0}/2000
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Project Details - Scalable for Future Growth */}
                  <div className="space-y-4">
                    <Label>Additional Project Details (Optional)</Label>
                    
                    {/* Business Goals */}
                    <div>
                      <Label htmlFor="businessGoals" className="text-sm font-medium">Business Goals</Label>
                      <textarea
                        id="businessGoals"
                        value={businessGoals}
                        onChange={(e) => setBusinessGoals(e.target.value)}
                        placeholder="What are your main business objectives? (e.g., increase sales, build brand awareness, generate leads)"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                        rows={2}
                        maxLength={500}
                      />
                    </div>

                    {/* Target Audience */}
                    <div>
                      <Label htmlFor="targetAudience" className="text-sm font-medium">Target Audience</Label>
                      <textarea
                        id="targetAudience"
                        value={targetAudience}
                        onChange={(e) => setTargetAudience(e.target.value)}
                        placeholder="Describe your ideal customers or target audience..."
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                        rows={2}
                        maxLength={500}
                      />
                    </div>

                    {/* Competitors */}
                    <div>
                      <Label htmlFor="competitors" className="text-sm font-medium">Competitors (Optional)</Label>
                      <textarea
                        id="competitors"
                        value={competitors}
                        onChange={(e) => setCompetitors(e.target.value)}
                        placeholder="List any competitor websites you like or want to differentiate from..."
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                        rows={2}
                        maxLength={500}
                      />
                    </div>

                    {/* Special Requirements */}
                    <div>
                      <Label htmlFor="specialRequirements" className="text-sm font-medium">Special Requirements</Label>
                      <textarea
                        id="specialRequirements"
                        value={specialRequirements}
                        onChange={(e) => setSpecialRequirements(e.target.value)}
                        placeholder="Any specific features, integrations, or requirements not covered above..."
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                        rows={2}
                        maxLength={500}
                      />
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div>
                    <Label>Project Images (Optional)</Label>
                    <div className="mt-2">
                      {/* Upload Area */}
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                          disabled={uploadedImages.length >= 4 || isUploading}
                        />
                        <label
                          htmlFor="image-upload"
                          className={cn(
                            "cursor-pointer flex flex-col items-center space-y-2",
                            (uploadedImages.length >= 4 || isUploading) && "opacity-50 cursor-not-allowed"
                          )}
                        >
                          <Upload className="h-8 w-8 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">
                              {isUploading ? 'Uploading...' : 'Click to upload images'}
                            </p>
                            <p className="text-xs text-gray-500">
                              {uploadedImages.length}/4 images • Max 5MB each
                            </p>
                          </div>
                        </label>
                      </div>

                      {/* Image Previews */}
                      {uploadedImages.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 gap-3">
                          {uploadedImages.map((image, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={image}
                                alt={`Project image ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <Label>Features & Add-ons</Label>
                    <div className="space-y-3 mt-2">
                      {features.map((feature) => (
                        <div key={feature.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={feature.id}
                              checked={watchedFeatures?.includes(feature.id) || false}
                              onCheckedChange={() => handleFeatureToggle(feature.id)}
                            />
                            <Label htmlFor={feature.id} className="text-sm">
                              {feature.label}
                            </Label>
                          </div>
                          {feature.price > 0 && (
                            <Badge variant="outline" className="text-xs">
                              +${feature.price}
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Design Style */}
                  <div>
                    <Label>Design Style *</Label>
                    <div className="grid grid-cols-1 gap-3 mt-2">
                      {designStyles.map((style) => (
                        <div
                          key={style.value}
                          className={cn(
                            "p-3 border rounded-lg cursor-pointer transition-all",
                            watchedDesignStyle === style.value
                              ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                              : "border-gray-200 hover:border-gray-300"
                          )}
                          onClick={() => setValue('designStyle', style.value as any)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium">{style.label}</div>
                              <div className="text-sm text-muted-foreground">{style.description}</div>
                            </div>
                            {watchedDesignStyle === style.value && (
                              <CheckCircle className="h-5 w-5 text-blue-500" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    {errors.designStyle && (
                      <p className="text-red-500 text-sm mt-1">{errors.designStyle.message}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4 mr-2" />
                        Pay & Start Project - ${estimatedPrice}
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Project Estimate */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calculator className="h-5 w-5 mr-2" />
                  Project Estimate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Estimated Price */}
                  <div className="text-right">
                    <div className="text-4xl font-bold text-foreground">${estimatedPrice}</div>
                    <div className="text-sm text-muted-foreground">One-time payment</div>
                  </div>

                  {/* Download & Share Buttons */}
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={downloadPDF}
                      className="flex-1"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={shareViaEmail}
                      className="flex-1"
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </Button>
                  </div>

                  {/* Base Website */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Base website</span>
                    <span className="text-sm">${getSelectedWebsiteType()?.price || 0}</span>
                  </div>

                  {/* Selected Features */}
                  {getSelectedFeatures().map((feature) => (
                    <div key={feature.id} className="flex justify-between items-center">
                      <span className="text-sm">{feature.label}</span>
                      <span className="text-sm">+${feature.price}</span>
                    </div>
                  ))}

                  {/* Design Style */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Design Style</span>
                    <span className="text-sm">{getSelectedDesignStyle()?.label || 'N/A'}</span>
                  </div>

                  {/* Budget */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Budget</span>
                    <span className="text-sm">${watchedBudget}</span>
                  </div>

                  {/* Project Details Summary */}
                  {watchedBusinessName && (
                    <div className="pt-4 border-t">
                      <h4 className="font-semibold mb-3 text-sm">Project Details:</h4>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Business:</span>
                          <span className="font-medium truncate max-w-[120px]">{watchedBusinessName}</span>
                        </div>
                        {watchedEmail && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Email:</span>
                            <span className="font-medium truncate max-w-[120px]">{watchedEmail}</span>
                          </div>
                        )}
                        {watchedProjectDescription && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Description:</span>
                            <span className="font-medium text-green-600">✓ Added</span>
                          </div>
                        )}
                        {uploadedImages.length > 0 && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Images:</span>
                            <span className="font-medium text-green-600">{uploadedImages.length}/4</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Additional Project Details */}
                  <div className="pt-4 border-t">
                    <h4 className="font-semibold mb-3 text-sm">Additional Project Details:</h4>
                    <div className="space-y-2 text-xs">
                      {businessGoals && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Business Goals:</span>
                          <span className="font-medium text-green-600">✓ Added</span>
                        </div>
                      )}
                      {targetAudience && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Target Audience:</span>
                          <span className="font-medium text-green-600">✓ Added</span>
                        </div>
                      )}
                      {competitors && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Competitors:</span>
                          <span className="font-medium text-green-600">✓ Added</span>
                        </div>
                      )}
                      {specialRequirements && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Special Requirements:</span>
                          <span className="font-medium text-green-600">✓ Added</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* What's Included */}
                  <div className="pt-4 border-t">
                    <h4 className="font-semibold mb-3">What's Included:</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Professional Design</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Responsive Layout</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">SEO Optimization</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Hosting & SSL</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">1 Year Support</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Image Processing</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-background p-8 rounded-lg max-w-md w-full mx-4">
            <div className="text-center">
              <CreditCard className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Processing Payment</h3>
              <p className="text-muted-foreground mb-4">
                {generationStep}
              </p>
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                <span className="text-sm text-muted-foreground">Please wait...</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
} 