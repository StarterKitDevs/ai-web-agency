'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Filter, 
  Eye, 
  Download,
  CheckCircle,
  ArrowLeft,
  Calendar,
  DollarSign,
  Users,
  Globe,
  FileText,
  ExternalLink
} from 'lucide-react';
import { showSuccess, showError } from '@/lib/toast';
import { useRouter } from 'next/navigation';

interface CompletedProject {
  id: string;
  businessName: string;
  email: string;
  status: 'completed';
  progress: number;
  estimatedPrice: number;
  createdAt: string;
  completedAt: string;
  agent: string;
  description: string;
  websiteType: string;
  features: string[];
  designStyle: string;
  budget: number;
  liveSiteUrl?: string;
}

export default function CompletedProjects() {
  const [completedProjects, setCompletedProjects] = useState<CompletedProject[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState<CompletedProject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Fetch completed projects from API
  const fetchCompletedProjects = async () => {
    try {
      const response = await fetch('/api/projects?admin=true');
      const data = await response.json();
      
      if (data.success) {
        // Filter only completed projects and add completion date
        const completed = data.projects
          .filter((p: any) => p.status === 'completed')
          .map((p: any) => ({
            ...p,
            completedAt: p.completedAt || new Date().toISOString().split('T')[0] // Use current date if not set
          }));
        
        setCompletedProjects(completed);
      }
    } catch (error) {
      console.error('Error fetching completed projects:', error);
      showError('Failed to load completed projects', 'Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Load completed projects on component mount
  useEffect(() => {
    fetchCompletedProjects();
  }, []);

  // Auto-refresh completed projects every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchCompletedProjects();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const filteredProjects = completedProjects.filter(project => {
    const matchesSearch = project.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleDownloadProject = (project: CompletedProject) => {
    const content = `COMPLETED PROJECT REPORT
=======================

Project: ${project.businessName}
Email: ${project.email}
Status: ${project.status}
Progress: ${project.progress}%
Agent: ${project.agent}
Price: $${project.estimatedPrice}
Created: ${project.createdAt}
Completed: ${project.completedAt}
Description: ${project.description}
Website Type: ${project.websiteType}
Design Style: ${project.designStyle}
Budget: $${project.budget}
Features: ${project.features.join(', ')}

PROJECT DETAILS
==============
This project was successfully completed and deployed.
All features have been implemented and tested.
Website is live and ready for use.

Generated on: ${new Date().toLocaleDateString()}
    `;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.businessName.replace(/\s+/g, '_')}_completed_project.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showSuccess('Download Started', 'Completed project report is downloading.');
  };

  const handleViewProject = (project: CompletedProject) => {
    setSelectedProject(project);
  };

  const handleViewLiveSite = async (project: CompletedProject) => {
    try {
      const response = await fetch(`/api/projects/live-site?id=${project.id}`);
      const data = await response.json();
      
      if (data.success) {
        // Open live site in new tab
        window.open(data.liveSiteUrl, '_blank');
        showSuccess('Live Site Opened', 'Opening the live website in a new tab.');
      } else {
        showError('Site Not Found', 'Live site URL not available for this project.');
      }
    } catch (error) {
      console.error('Error fetching live site:', error);
      showError('Connection Error', 'Unable to fetch live site information.');
    }
  };

  const handleViewDocumentation = async (project: CompletedProject) => {
    try {
      const response = await fetch(`/api/projects/live-site?id=${project.id}`);
      const data = await response.json();
      
      if (data.success) {
        // Open documentation in new tab
        window.open(data.documentation.documentation, '_blank');
        showSuccess('Documentation Opened', 'Opening project documentation in a new tab.');
      } else {
        showError('Docs Not Found', 'Documentation not available for this project.');
      }
    } catch (error) {
      console.error('Error fetching documentation:', error);
      showError('Connection Error', 'Unable to fetch documentation information.');
    }
  };

  const handleViewDeployment = async (project: CompletedProject) => {
    try {
      const response = await fetch(`/api/projects/live-site?id=${project.id}`);
      const data = await response.json();
      
      if (data.success) {
        // Open deployment dashboard in new tab
        window.open(data.documentation.deployment, '_blank');
        showSuccess('Deployment Dashboard', 'Opening deployment dashboard in a new tab.');
      } else {
        showError('Dashboard Not Found', 'Deployment dashboard not available.');
      }
    } catch (error) {
      console.error('Error fetching deployment:', error);
      showError('Connection Error', 'Unable to fetch deployment information.');
    }
  };

  // Calculate analytics
  const totalRevenue = completedProjects.reduce((sum, p) => sum + p.estimatedPrice, 0);
  const averagePrice = completedProjects.length > 0 ? totalRevenue / completedProjects.length : 0;
  const thisMonth = completedProjects.filter(p => {
    const completedDate = new Date(p.completedAt);
    const now = new Date();
    return completedDate.getMonth() === now.getMonth() && completedDate.getFullYear() === now.getFullYear();
  }).length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Completed Projects
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              View all successfully completed projects
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="text-green-600">
            <CheckCircle className="mr-1 h-3 w-3" />
            {completedProjects.length} Completed
          </Badge>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Completed
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedProjects.length}</div>
            <p className="text-xs text-green-600">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-green-600">From completed projects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Average Price
            </CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${averagePrice.toFixed(0)}</div>
            <p className="text-xs text-blue-600">Per project</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              This Month
            </CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{thisMonth}</div>
            <p className="text-xs text-purple-600">Completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search Completed Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by business name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Completed Projects Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Completed Projects ({filteredProjects.length})
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export All
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-medium">Project</th>
                  <th className="text-left py-3 px-4 font-medium">Completion Date</th>
                  <th className="text-left py-3 px-4 font-medium">Agent</th>
                  <th className="text-left py-3 px-4 font-medium">Revenue</th>
                  <th className="text-left py-3 px-4 font-medium">Type</th>
                  <th className="text-left py-3 px-4 font-medium">Live Site</th>
                  <th className="text-left py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project) => (
                  <tr key={project.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium">{project.businessName}</div>
                        <div className="text-sm text-gray-500">{project.email}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{project.completedAt}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm">{project.agent}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-medium text-green-600">${project.estimatedPrice}</span>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="outline" className="capitalize">
                        {project.websiteType}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      {project.liveSiteUrl ? (
                        <Badge variant="default" className="text-green-600">
                          <Globe className="mr-1 h-3 w-3" /> Live
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-gray-600 dark:text-gray-400">
                          <Eye className="mr-1 h-3 w-3" /> No Live Site
                        </Badge>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewProject(project)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownloadProject(project)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewLiveSite(project)}
                          className="text-green-600"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Project Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <h2 className="text-2xl font-bold">{selectedProject.businessName}</h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedProject(null)}
                >
                  ×
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p>{selectedProject.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Completed
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Revenue</label>
                    <p className="text-green-600 font-medium">${selectedProject.estimatedPrice}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Agent</label>
                    <p>{selectedProject.agent}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Created</label>
                    <p>{selectedProject.createdAt}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Completed</label>
                    <p>{selectedProject.completedAt}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Website Type</label>
                    <p className="capitalize">{selectedProject.websiteType}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Design Style</label>
                    <p className="capitalize">{selectedProject.designStyle}</p>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Description</label>
                  <p className="mt-1">{selectedProject.description}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Features</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedProject.features.map((feature, index) => (
                      <Badge key={index} variant="outline">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-2 pt-4">
                  <Button onClick={() => handleDownloadProject(selectedProject)}>
                    <Download className="mr-2 h-4 w-4" />
                    Download Report
                  </Button>
                  <Button variant="outline" onClick={() => handleViewLiveSite(selectedProject)}>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Live Site
                  </Button>
                  <Button variant="outline" onClick={() => handleViewDocumentation(selectedProject)}>
                    <FileText className="mr-2 h-4 w-4" />
                    View Documentation
                  </Button>
                  <Button variant="outline" onClick={() => handleViewDeployment(selectedProject)}>
                    <Globe className="mr-2 h-4 w-4" />
                    Deployment Dashboard
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 