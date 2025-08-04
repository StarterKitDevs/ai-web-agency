'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { 
  Globe, 
  Palette, 
  Code, 
  Zap, 
  Sparkles, 
  ArrowRight, 
  Play,
  Settings,
  Eye,
  Download,
  Share2,
  Plus,
  X,
  CheckCircle,
  Clock,
  Star
} from 'lucide-react';
import { showSuccess, showError } from '@/lib/toast';

interface WebsiteTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  features: string[];
  price: number;
  image: string;
  popular?: boolean;
}

const websiteTemplates: WebsiteTemplate[] = [
  {
    id: 'freestyle',
    name: 'Freestyle Custom',
    category: 'Custom',
    description: 'Start from scratch and build your dream website with complete creative freedom',
    features: ['Complete Customization', 'Unique Design', 'Flexible Layout', 'Custom Features'],
    price: 399,
    image: '/templates/freestyle.jpg',
    popular: true
  },
  {
    id: 'modern-landing',
    name: 'Modern Landing Page',
    category: 'Landing',
    description: 'Clean, conversion-focused landing page with modern design',
    features: ['Responsive Design', 'Contact Forms', 'SEO Optimized', 'Analytics'],
    price: 299,
    image: '/templates/modern-landing.jpg',
    popular: true
  },
  {
    id: 'ecommerce-store',
    name: 'E-commerce Store',
    category: 'E-commerce',
    description: 'Full-featured online store with payment integration',
    features: ['Product Catalog', 'Shopping Cart', 'Payment Gateway', 'Inventory Management'],
    price: 599,
    image: '/templates/ecommerce.jpg'
  },
  {
    id: 'portfolio-showcase',
    name: 'Portfolio Showcase',
    category: 'Portfolio',
    description: 'Professional portfolio to showcase your work',
    features: ['Project Gallery', 'About Section', 'Contact Form', 'Social Links'],
    price: 199,
    image: '/templates/portfolio.jpg'
  },
  {
    id: 'blog-platform',
    name: 'Blog Platform',
    category: 'Blog',
    description: 'Content-focused blog with rich features',
    features: ['Rich Editor', 'Categories', 'Comments', 'Newsletter'],
    price: 249,
    image: '/templates/blog.jpg'
  },
  {
    id: 'saas-dashboard',
    name: 'SaaS Dashboard',
    category: 'SaaS',
    description: 'Modern SaaS application with user management',
    features: ['User Authentication', 'Dashboard', 'API Integration', 'Analytics'],
    price: 799,
    image: '/templates/saas.jpg',
    popular: true
  },
  {
    id: 'restaurant-site',
    name: 'Restaurant Website',
    category: 'Business',
    description: 'Complete restaurant website with online ordering',
    features: ['Menu Display', 'Online Ordering', 'Reservations', 'Reviews'],
    price: 349,
    image: '/templates/restaurant.jpg'
  }
];

const designStyles = [
  { id: 'minimal', name: 'Minimal', description: 'Clean and simple design' },
  { id: 'modern', name: 'Modern', description: 'Contemporary with bold elements' },
  { id: 'classic', name: 'Classic', description: 'Timeless and professional' },
  { id: 'creative', name: 'Creative', description: 'Artistic and unique' },
  { id: 'corporate', name: 'Corporate', description: 'Professional and trustworthy' }
];

const layoutOptions = [
  { id: 'single-page', name: 'Single Page', description: 'All content on one page' },
  { id: 'multi-page', name: 'Multi Page', description: 'Multiple pages with navigation' },
  { id: 'landing-funnel', name: 'Landing Funnel', description: 'Conversion-focused flow' },
  { id: 'dashboard', name: 'Dashboard', description: 'Admin panel style' },
  { id: 'portfolio-grid', name: 'Portfolio Grid', description: 'Showcase items in grid' }
];

const pageSections = [
  'Hero Section',
  'About Us',
  'Services/Products',
  'Portfolio/Gallery',
  'Team Members',
  'Testimonials',
  'Contact Form',
  'Blog/News',
  'FAQ Section',
  'Pricing Tables',
  'Features List',
  'Call-to-Action',
  'Footer'
];

const advancedFeatures = [
  'Custom Animations',
  'Interactive Elements',
  'Advanced Forms',
  'Payment Integration',
  'User Authentication',
  'Content Management',
  'E-commerce Features',
  'Booking System',
  'Live Chat',
  'Analytics Dashboard',
  'SEO Optimization',
  'Performance Optimization',
  'Mobile App Integration',
  'API Integration',
  'Third-party Services'
];

const colorSchemes = [
  { id: 'blue', name: 'Ocean Blue', color: '#3B82F6' },
  { id: 'green', name: 'Forest Green', color: '#10B981' },
  { id: 'purple', name: 'Royal Purple', color: '#8B5CF6' },
  { id: 'orange', name: 'Sunset Orange', color: '#F59E0B' },
  { id: 'pink', name: 'Rose Pink', color: '#EC4899' },
  { id: 'gray', name: 'Modern Gray', color: '#6B7280' }
];

export default function BoltDIY() {
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<WebsiteTemplate | null>(null);
  const [websiteName, setWebsiteName] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [budget, setBudget] = useState([500]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  
  // Freestyle-specific state
  const [selectedLayout, setSelectedLayout] = useState('');
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [selectedAdvancedFeatures, setSelectedAdvancedFeatures] = useState<string[]>([]);
  const [customRequirements, setCustomRequirements] = useState('');
  const [additionalInput, setAdditionalInput] = useState('');

  const handleTemplateSelect = (template: WebsiteTemplate) => {
    setSelectedTemplate(template);
    
    if (template.id === 'freestyle') {
      // Initialize Freestyle with default sections
      setSelectedSections(['Hero Section', 'About Us', 'Contact Form']);
      setSelectedLayout('single-page');
      setSelectedFeatures(['Complete Customization', 'Unique Design', 'Flexible Layout', 'Custom Features']);
    } else {
      setSelectedFeatures(template.features);
      // Reset Freestyle-specific options
      setSelectedSections([]);
      setSelectedLayout('');
      setSelectedAdvancedFeatures([]);
      setCustomRequirements('');
    }
    
    setStep(2);
  };

  const handleFeatureToggle = (feature: string) => {
    setSelectedFeatures(prev => 
      prev.includes(feature) 
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };

  const handleSectionToggle = (section: string) => {
    setSelectedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const handleAdvancedFeatureToggle = (feature: string) => {
    setSelectedAdvancedFeatures(prev => 
      prev.includes(feature) 
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };

  const calculatePrice = () => {
    if (!selectedTemplate) return 0;
    
    let basePrice = selectedTemplate.price;
    
    if (selectedTemplate.id === 'freestyle') {
      // Freestyle pricing: base + sections + advanced features
      const sectionPrice = selectedSections.length * 25;
      const advancedFeaturePrice = selectedAdvancedFeatures.length * 50;
      return basePrice + sectionPrice + advancedFeaturePrice;
    } else {
      // Standard template pricing
      const additionalFeatures = selectedFeatures.length - selectedTemplate.features.length;
      return basePrice + (additionalFeatures * 50);
    }
  };

  const handleGenerate = async () => {
    if (!selectedTemplate || !websiteName) {
      showError('Please fill in all required fields');
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      // Call the API to start generation
      const response = await fetch('/api/bolt-diy/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          template: selectedTemplate,
          websiteName,
          businessDescription,
          designStyle: selectedStyle,
          colorScheme: selectedColor,
          features: selectedFeatures,
          budget: budget[0],
          // Freestyle-specific data
          layout: selectedLayout,
          sections: selectedSections,
          advancedFeatures: selectedAdvancedFeatures,
          customRequirements: customRequirements,
          additionalInput: additionalInput // Include additional input
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to start generation');
      }

      const data = await response.json();
      
      if (data.success) {
        // Simulate generation progress with real steps
        const steps = data.generationSteps || [
          'Analyzing requirements...',
          'Designing layout...',
          'Building components...',
          'Optimizing performance...',
          'Finalizing website...'
        ];

        for (let i = 0; i < steps.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          setGenerationProgress(((i + 1) / steps.length) * 100);
        }

        showSuccess('Website Generated!', `Your ${selectedTemplate.name} is ready for launch!`);
        setStep(4);
      } else {
        throw new Error(data.error || 'Generation failed');
      }
    } catch (error) {
      console.error('Generation error:', error);
      showError('Generation Failed', 'There was an error generating your website. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    showSuccess('Download Started', 'Your website files are being prepared...');
  };

  const handleDeploy = () => {
    showSuccess('Deployment Started', 'Your website is being deployed to production...');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Zap className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">Bolt DIY</span>
              </div>
              <Badge variant="outline" className="text-blue-600">
                <Sparkles className="mr-1 h-3 w-3" />
                AI-Powered
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
              <Button size="sm">
                <Play className="mr-2 h-4 w-4" />
                Preview
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  step >= stepNumber ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {step > stepNumber ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-medium">{stepNumber}</span>
                  )}
                </div>
                {stepNumber < 4 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4 space-x-8 text-sm">
            <span className={step >= 1 ? 'text-blue-600 font-medium' : 'text-gray-500'}>
              Choose Template
            </span>
            <span className={step >= 2 ? 'text-blue-600 font-medium' : 'text-gray-500'}>
              Customize
            </span>
            <span className={step >= 3 ? 'text-blue-600 font-medium' : 'text-gray-500'}>
              Generate
            </span>
            <span className={step >= 4 ? 'text-blue-600 font-medium' : 'text-gray-500'}>
              Launch
            </span>
          </div>
        </div>

        {/* Step 1: Template Selection */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Choose Your Website Template
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Select from our curated collection of professional templates, 
                each designed to convert and engage your audience.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {websiteTemplates.map((template) => (
                <Card 
                  key={template.id} 
                  className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                    selectedTemplate?.id === template.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => handleTemplateSelect(template)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      {template.popular && (
                        <Badge className="bg-orange-100 text-orange-800">
                          <Star className="mr-1 h-3 w-3" />
                          Popular
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{template.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                        <Globe className="h-8 w-8 text-gray-400" />
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {template.features.slice(0, 3).map((feature) => (
                          <Badge key={feature} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                        {template.features.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{template.features.length - 3} more
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold text-gray-900">
                          ${template.price}
                        </span>
                        <Button size="sm">
                          <ArrowRight className="mr-1 h-4 w-4" />
                          Select
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Customization */}
        {step === 2 && selectedTemplate && (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Customize Your Website
              </h1>
              <p className="text-gray-600">
                Personalize your {selectedTemplate.name} to match your brand and requirements.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Customization Options */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Globe className="mr-2 h-5 w-5" />
                      Basic Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Website Name
                      </label>
                      <Input
                        placeholder="Enter your website name"
                        value={websiteName}
                        onChange={(e) => setWebsiteName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Business Description
                      </label>
                      <Textarea
                        placeholder="Describe your business and what you do..."
                        value={businessDescription}
                        onChange={(e) => setBusinessDescription(e.target.value)}
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Palette className="mr-2 h-5 w-5" />
                      Design & Style
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Design Style
                      </label>
                      <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a design style" />
                        </SelectTrigger>
                        <SelectContent>
                          {designStyles.map((style) => (
                            <SelectItem key={style.id} value={style.id}>
                              <div>
                                <div className="font-medium">{style.name}</div>
                                <div className="text-sm text-gray-500">{style.description}</div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Color Scheme
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {colorSchemes.map((color) => (
                          <div
                            key={color.id}
                            className={`p-3 rounded-lg cursor-pointer border-2 transition-all ${
                              selectedColor === color.id ? 'border-blue-500' : 'border-gray-200'
                            }`}
                            onClick={() => setSelectedColor(color.id)}
                          >
                            <div
                              className="w-full h-8 rounded"
                              style={{ backgroundColor: color.color }}
                            />
                            <div className="text-xs text-center mt-1">{color.name}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Code className="mr-2 h-5 w-5" />
                      Features & Add-ons
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        'Contact Forms',
                        'Newsletter Signup',
                        'Social Media Integration',
                        'Blog Section',
                        'Portfolio Gallery',
                        'Testimonials',
                        'FAQ Section',
                        'Live Chat',
                        'Analytics Dashboard',
                        'SEO Optimization'
                      ].map((feature) => (
                        <div key={feature} className="flex items-center space-x-3">
                          <Checkbox
                            id={feature}
                            checked={selectedFeatures.includes(feature)}
                            onCheckedChange={() => handleFeatureToggle(feature)}
                          />
                          <label htmlFor={feature} className="text-sm font-medium text-gray-700">
                            {feature}
                          </label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Freestyle-specific options */}
                {selectedTemplate?.id === 'freestyle' && (
                  <>
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Globe className="mr-2 h-5 w-5" />
                          Layout & Structure
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Website Layout
                          </label>
                          <Select value={selectedLayout} onValueChange={setSelectedLayout}>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose your layout" />
                            </SelectTrigger>
                            <SelectContent>
                              {layoutOptions.map((layout) => (
                                <SelectItem key={layout.id} value={layout.id}>
                                  <div>
                                    <div className="font-medium">{layout.name}</div>
                                    <div className="text-sm text-gray-500">{layout.description}</div>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Palette className="mr-2 h-5 w-5" />
                          Page Sections
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-3">
                          {pageSections.map((section) => (
                            <div key={section} className="flex items-center space-x-3">
                              <Checkbox
                                id={section}
                                checked={selectedSections.includes(section)}
                                onCheckedChange={() => handleSectionToggle(section)}
                              />
                              <label htmlFor={section} className="text-sm font-medium text-gray-700">
                                {section}
                              </label>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Zap className="mr-2 h-5 w-5" />
                          Advanced Features
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-3">
                          {advancedFeatures.map((feature) => (
                            <div key={feature} className="flex items-center space-x-3">
                              <Checkbox
                                id={feature}
                                checked={selectedAdvancedFeatures.includes(feature)}
                                onCheckedChange={() => handleAdvancedFeatureToggle(feature)}
                              />
                              <label htmlFor={feature} className="text-sm font-medium text-gray-700">
                                {feature}
                              </label>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Sparkles className="mr-2 h-5 w-5" />
                          Custom Requirements
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Special Requirements
                          </label>
                          <Textarea
                            placeholder="Describe any special features, integrations, or requirements for your custom website..."
                            value={customRequirements}
                            onChange={(e) => setCustomRequirements(e.target.value)}
                            rows={4}
                          />
                          <p className="text-xs text-gray-500 mt-2">
                            Tell us about any specific functionality, integrations, or unique features you need.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Zap className="mr-2 h-5 w-5" />
                      Budget Range
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span>${budget[0]}</span>
                        <span>Maximum Budget</span>
                      </div>
                      <Slider
                        value={budget}
                        onValueChange={setBudget}
                        max={2000}
                        min={100}
                        step={50}
                        className="w-full"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Preview & Summary */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Website Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">Preview will appear here</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Project Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Template:</span>
                        <span className="font-medium">{selectedTemplate.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Features:</span>
                        <span className="font-medium">{selectedFeatures.length}</span>
                      </div>
                      {selectedTemplate?.id === 'freestyle' && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Layout:</span>
                            <span className="font-medium">{selectedLayout || 'Not selected'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Sections:</span>
                            <span className="font-medium">{selectedSections.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Advanced Features:</span>
                            <span className="font-medium">{selectedAdvancedFeatures.length}</span>
                          </div>
                        </>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Style:</span>
                        <span className="font-medium">{selectedStyle || 'Not selected'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Budget:</span>
                        <span className="font-medium">${budget[0]}</span>
                      </div>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between text-lg font-semibold">
                        <span>Total Price:</span>
                        <span className="text-blue-600">${calculatePrice()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex space-x-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setStep(1)}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button 
                    onClick={() => setStep(3)}
                    className="flex-1"
                    disabled={!websiteName}
                  >
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Generation */}
        {step === 3 && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                What do you want to build?
              </h1>
              <p className="text-gray-600">
                Create stunning apps & websites by chatting with AI.
              </p>
            </div>

            <Card className="max-w-2xl mx-auto">
              <CardContent className="pt-6">
                {isGenerating ? (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Sparkles className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-600">
                          AI is building your website...
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${generationProgress}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {Math.round(generationProgress)}% Complete
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Chat-like interface */}
                    <div className="space-y-4">
                      <div className="flex items-start space-x-4">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-medium text-gray-600">AI</span>
                        </div>
                        <div className="flex-1 bg-gray-50 rounded-lg p-4">
                          <p className="text-gray-700">
                            Hi! I'm ready to help you build your website. Here's what I understand about your project:
                          </p>
                        </div>
                      </div>

                      {selectedTemplate && (
                        <div className="flex items-start space-x-4">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-medium text-blue-600">You</span>
                          </div>
                          <div className="flex-1 bg-blue-50 rounded-lg p-4">
                            <div className="space-y-3">
                              <div className="font-medium text-gray-900">Project Requirements:</div>
                              
                              <div className="space-y-2 text-sm">
                                <div><strong>Template:</strong> {selectedTemplate.name}</div>
                                <div><strong>Website Name:</strong> {websiteName}</div>
                                {businessDescription && (
                                  <div><strong>Business Description:</strong> {businessDescription}</div>
                                )}
                                {selectedStyle && (
                                  <div><strong>Design Style:</strong> {selectedStyle}</div>
                                )}
                                {selectedColor && (
                                  <div><strong>Color Scheme:</strong> {selectedColor}</div>
                                )}
                                <div><strong>Budget Range:</strong> ${budget[0]}</div>
                                <div><strong>Selected Features:</strong> {selectedFeatures.join(', ')}</div>
                              </div>

                              {selectedTemplate?.id === 'freestyle' && (
                                <div className="space-y-2 text-sm border-t pt-2">
                                  <div className="font-medium text-gray-900">Freestyle Customization:</div>
                                  <div><strong>Layout Type:</strong> {selectedLayout}</div>
                                  <div><strong>Page Sections:</strong> {selectedSections.join(', ')}</div>
                                  <div><strong>Advanced Features:</strong> {selectedAdvancedFeatures.join(', ')}</div>
                                  {customRequirements && (
                                    <div><strong>Custom Requirements:</strong> {customRequirements}</div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex items-start space-x-4">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-medium text-gray-600">AI</span>
                        </div>
                        <div className="flex-1 bg-gray-50 rounded-lg p-4">
                          <p className="text-gray-700">
                            Perfect! I have all the details. Now, please add any additional requirements or specific features you'd like me to include in your website.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Input area */}
                    <div className="border-t pt-4">
                      <div className="flex space-x-3">
                        <div className="flex-1">
                          <Textarea
                            placeholder="Describe what you want to build... (e.g., 'I want a modern restaurant website with online ordering and a menu gallery')"
                            className="resize-none"
                            rows={3}
                            value={additionalInput}
                            onChange={(e) => setAdditionalInput(e.target.value)}
                          />
                        </div>
                        <Button 
                          onClick={handleGenerate}
                          className="px-6"
                          size="lg"
                        >
                          <Sparkles className="mr-2 h-4 w-4" />
                          Generate
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Be specific about features, design preferences, and functionality you need.
                      </p>
                    </div>

                    {/* Quick suggestions */}
                    <div className="border-t pt-4">
                      <p className="text-sm font-medium text-gray-700 mb-3">Quick suggestions:</p>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "Add a contact form",
                          "Include a blog section",
                          "Make it mobile-friendly",
                          "Add animations",
                          "Include a portfolio",
                          "Add payment integration"
                        ].map((suggestion) => (
                          <Button
                            key={suggestion}
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            onClick={() => {
                              // Add suggestion to textarea
                              const textarea = document.querySelector('textarea');
                              if (textarea) {
                                textarea.value += ` ${suggestion}`;
                              }
                            }}
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 4: Launch */}
        {step === 4 && (
          <div className="text-center space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Your Website is Ready!
              </h1>
              <p className="text-gray-600">
                Congratulations! Your custom website has been generated successfully.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Eye className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Preview Website</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      See your website in action
                    </p>
                    <Button variant="outline" className="w-full">
                      <Eye className="mr-2 h-4 w-4" />
                      Preview
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Download className="h-8 w-8 text-green-600 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Download Files</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Get your website source code
                    </p>
                    <Button variant="outline" className="w-full" onClick={handleDownload}>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Globe className="h-8 w-8 text-purple-600 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Deploy Live</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Launch your website online
                    </p>
                    <Button className="w-full" onClick={handleDeploy}>
                      <Globe className="mr-2 h-4 w-4" />
                      Deploy
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-center space-x-4">
              <Button variant="outline" onClick={() => setStep(1)}>
                Create Another
              </Button>
              <Button>
                <Share2 className="mr-2 h-4 w-4" />
                Share Project
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 