'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  Trash2,
  Download,
  Play,
  Pause,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { showSuccess, showError } from '@/lib/toast';
import { Loader2, X } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface Project {
  id: string;
  businessName: string;
  email: string;
  status: 'pending' | 'in-development' | 'in-review' | 'completed' | 'failed';
  progress: number;
  estimatedPrice: number;
  createdAt: string;
  agent: string;
  description: string;
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  'in-development': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  'in-review': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
};

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    businessName: '',
    email: '',
    description: '',
    status: 'pending',
    progress: 0,
    agent: 'Project Manager',
    estimatedPrice: 150
  });

  // Fetch projects from API
  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects?admin=true');
      const data = await response.json();
      if (data.success) {
        setProjects(data.projects);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      showError('Failed to load projects', 'Please try again later.');
    }
  };

  // Load projects on component mount
  useEffect(() => {
    fetchProjects();
  }, []);

  // Auto-refresh projects every 3 seconds to show real-time progress
  useEffect(() => {
    const interval = setInterval(() => {
      fetchProjects();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'in-development':
        return <Play className="h-4 w-4" />;
      case 'in-review':
        return <Clock className="h-4 w-4" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const handleResumeProject = async (projectId: string) => {
    // This function is now deprecated - projects progress automatically
    showSuccess('Auto Progress', 'Projects now progress automatically through the workflow!');
  };

  const handleEditProject = (project: Project) => {
    setEditingProject({ ...project });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingProject) return;
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProject)
      });

      if (response.ok) {
        await fetchProjects(); // Refresh projects
        setIsEditModalOpen(false);
        setEditingProject(null);
        showSuccess('Project Updated', 'Project details saved!');
      } else {
        showError('Save Failed', 'Failed to save project changes.');
      }
    } catch (error) {
      console.error('Error saving project:', error);
      showError('Save Failed', 'An error occurred while saving.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    
    try {
      const response = await fetch(`/api/projects?id=${projectId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchProjects(); // Refresh projects
        setSelectedProject(null);
        showSuccess('Project Deleted', 'Project has been removed.');
      } else {
        showError('Delete Failed', 'Failed to delete project.');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      showError('Delete Failed', 'An error occurred while deleting.');
    }
  };

  const handleDownloadProject = (project: Project) => {
    const content = `Project: ${project.businessName}\nEmail: ${project.email}\nStatus: ${project.status}\nProgress: ${project.progress}%\nAgent: ${project.agent}\nPrice: $${project.estimatedPrice}\nCreated: ${project.createdAt}\nDescription: ${project.description}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.businessName.replace(/\s+/g, '_')}_project.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showSuccess('Download Started', 'Project file is downloading.');
  };

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setNewProject({
      businessName: '',
      email: '',
      description: '',
      status: 'pending',
      progress: 0,
      agent: 'Project Manager',
      estimatedPrice: 150
    });
  };

  const handleCreateProject = async () => {
    if (!newProject.businessName || !newProject.email) {
      showError('Missing Info', 'Business name and email are required.');
      return;
    }
    
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          ...newProject
        })
      });

      if (response.ok) {
        await fetchProjects(); // Refresh projects
        handleCloseCreateModal();
        showSuccess('Project Created', 'New project has been added and will progress automatically!');
      } else {
        showError('Creation Failed', 'Failed to create project.');
      }
    } catch (error) {
      console.error('Error creating project:', error);
      showError('Creation Failed', 'An error occurred while creating the project.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Projects Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor and manage all client projects
          </p>
          <div className="flex items-center space-x-2 mt-2">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-600">Auto-progress enabled - Projects move through workflow automatically</span>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => window.location.href = '/admin/completed-projects'}>
            <CheckCircle className="mr-2 h-4 w-4" />
            View Completed
          </Button>
          <Button onClick={handleOpenCreateModal}>
            <Plus className="mr-2 h-4 w-4" />
            Create Project
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-development">In Development</SelectItem>
                  <SelectItem value="in-review">In Review</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projects Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Projects ({filteredProjects.length})
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
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
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">Progress</th>
                  <th className="text-left py-3 px-4 font-medium">Agent</th>
                  <th className="text-left py-3 px-4 font-medium">Price</th>
                  <th className="text-left py-3 px-4 font-medium">Created</th>
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
                      <Badge className={statusColors[project.status]}>
                        {getStatusIcon(project.status)}
                        <span className="ml-1 capitalize">{project.status.replace('-', ' ')}</span>
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{project.progress}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm">{project.agent}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-medium">${project.estimatedPrice}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-500">{project.createdAt}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedProject(project)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleEditProject(project)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleDeleteProject(project.id)}>
                          <Trash2 className="h-4 w-4" />
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
                <h2 className="text-2xl font-bold">{selectedProject.businessName}</h2>
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
                    <Badge className={statusColors[selectedProject.status]}>
                      {getStatusIcon(selectedProject.status)}
                      <span className="ml-1 capitalize">{selectedProject.status.replace('-', ' ')}</span>
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Progress</label>
                    <p>{selectedProject.progress}%</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Price</label>
                    <p>${selectedProject.estimatedPrice}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Agent</label>
                    <p>{selectedProject.agent}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Created</label>
                    <p>{selectedProject.createdAt}</p>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Description</label>
                  <p className="mt-1">{selectedProject.description}</p>
                </div>

                <div className="flex space-x-2 pt-4">
                  <Button variant="outline" onClick={() => handleEditProject(selectedProject)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Project
                  </Button>
                  <Button variant="outline" onClick={() => handleDownloadProject(selectedProject)}>
                    <Download className="mr-2 h-4 w-4" />
                    Download Files
                  </Button>
                  <Button variant="outline" className="text-red-600" onClick={() => handleDeleteProject(selectedProject.id)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Project
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {isEditModalOpen && editingProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Edit Project</h3>
              <Button variant="ghost" onClick={() => setIsEditModalOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Business Name</label>
                <Input
                  value={editingProject.businessName}
                  onChange={(e) => setEditingProject(prev => prev ? { ...prev, businessName: e.target.value } : null)}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <Input
                  value={editingProject.email}
                  onChange={(e) => setEditingProject(prev => prev ? { ...prev, email: e.target.value } : null)}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <Select value={editingProject.status} onValueChange={(value) => setEditingProject(prev => prev ? { ...prev, status: value as Project['status'] } : null)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-development">In Development</SelectItem>
                    <SelectItem value="in-review">In Review</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Progress</label>
                <Input
                  type="number"
                  value={editingProject.progress}
                  onChange={(e) => setEditingProject(prev => prev ? { ...prev, progress: parseInt(e.target.value) || 0 } : null)}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Estimated Price</label>
                <Input
                  type="number"
                  value={editingProject.estimatedPrice}
                  onChange={(e) => setEditingProject(prev => prev ? { ...prev, estimatedPrice: parseInt(e.target.value) || 0 } : null)}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Agent</label>
                <Input
                  value={editingProject.agent}
                  onChange={(e) => setEditingProject(prev => prev ? { ...prev, agent: e.target.value } : null)}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Description</label>
                <Textarea
                  value={editingProject.description}
                  onChange={(e) => setEditingProject(prev => prev ? { ...prev, description: e.target.value } : null)}
                  className="mt-1"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit} disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Create Project Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Create Project</h3>
              <Button variant="ghost" onClick={handleCloseCreateModal}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Business Name *</label>
                <Input
                  value={newProject.businessName}
                  onChange={e => setNewProject(prev => ({ ...prev, businessName: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email *</label>
                <Input
                  value={newProject.email}
                  onChange={e => setNewProject(prev => ({ ...prev, email: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Description</label>
                <Textarea
                  value={newProject.description}
                  onChange={e => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <Select value={newProject.status} onValueChange={value => setNewProject(prev => ({ ...prev, status: value as Project['status'] }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-development">In Development</SelectItem>
                    <SelectItem value="in-review">In Review</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Progress</label>
                <Input
                  type="number"
                  value={newProject.progress}
                  onChange={e => setNewProject(prev => ({ ...prev, progress: parseInt(e.target.value) || 0 }))}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Agent</label>
                <Input
                  value={newProject.agent}
                  onChange={e => setNewProject(prev => ({ ...prev, agent: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Estimated Price</label>
                <Input
                  type="number"
                  value={newProject.estimatedPrice}
                  onChange={e => setNewProject(prev => ({ ...prev, estimatedPrice: parseInt(e.target.value) || 0 }))}
                  className="mt-1"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={handleCloseCreateModal}>
                Cancel
              </Button>
              <Button onClick={handleCreateProject}>
                Create Project
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 