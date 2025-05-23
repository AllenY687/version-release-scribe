
import { useState } from 'react';
import { ProjectCard } from '@/components/ProjectCard';
import { CreateProjectDialog } from '@/components/CreateProjectDialog';
import { Button } from '@/components/ui/button';
import { Plus, FolderOpen } from 'lucide-react';

// Mock data for demonstration
const mockProjects = [
  {
    id: '1',
    name: 'Web Platform Redesign',
    description: 'Complete overhaul of the customer-facing web platform with modern UI/UX',
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-06-30'),
    status: 'active' as const,
    releases: [
      {
        id: 'r1',
        version: 'v1.0.0-alpha',
        date: new Date('2024-02-15'),
        title: 'Initial Alpha Release',
        notes: 'First working prototype with basic functionality including user authentication, dashboard layout, and core navigation.',
        attachments: [
          { name: 'Design Mockups.figma', size: '2.4 MB', type: 'design' },
          { name: 'Technical Specs.pdf', size: '1.2 MB', type: 'document' }
        ]
      },
      {
        id: 'r2',
        version: 'v1.0.0-beta',
        date: new Date('2024-04-01'),
        title: 'Beta Release',
        notes: 'Feature-complete beta with user testing feedback incorporated. Includes advanced search, real-time notifications, and mobile responsiveness.',
        attachments: [
          { name: 'Beta Test Results.xlsx', size: '850 KB', type: 'document' },
          { name: 'Performance Report.pdf', size: '1.8 MB', type: 'document' }
        ]
      },
      {
        id: 'r3',
        version: 'v1.0.0',
        date: new Date('2024-06-30'),
        title: 'Production Release',
        notes: 'Final production release with all features implemented and thoroughly tested. Ready for public launch.',
        attachments: [
          { name: 'Release Checklist.pdf', size: '500 KB', type: 'document' },
          { name: 'Deployment Guide.md', size: '45 KB', type: 'document' }
        ]
      }
    ]
  },
  {
    id: '2',
    name: 'Mobile App Development',
    description: 'Native iOS and Android applications for customer engagement',
    startDate: new Date('2024-03-01'),
    endDate: new Date('2024-10-15'),
    status: 'active' as const,
    releases: [
      {
        id: 'r4',
        version: 'v0.5.0',
        date: new Date('2024-05-15'),
        title: 'MVP Release',
        notes: 'Minimum viable product with core features: user registration, basic dashboard, and push notifications.',
        attachments: [
          { name: 'App Store Screenshots.zip', size: '15.2 MB', type: 'design' },
          { name: 'MVP Requirements.docx', size: '2.1 MB', type: 'document' }
        ]
      },
      {
        id: 'r5',
        version: 'v1.0.0',
        date: new Date('2024-10-15'),
        title: 'Full Release',
        notes: 'Complete mobile application with all planned features including offline mode, advanced analytics, and social features.',
        attachments: [
          { name: 'App Store Listing.pdf', size: '3.2 MB', type: 'document' }
        ]
      }
    ]
  },
  {
    id: '3',
    name: 'API Infrastructure',
    description: 'Scalable backend API architecture for all client applications',
    startDate: new Date('2023-11-01'),
    endDate: new Date('2024-05-30'),
    status: 'completed' as const,
    releases: [
      {
        id: 'r6',
        version: 'v2.0.0',
        date: new Date('2024-01-30'),
        title: 'Architecture Overhaul',
        notes: 'Complete rewrite of the API using microservices architecture. Improved performance by 300% and added comprehensive monitoring.',
        attachments: [
          { name: 'Architecture Diagram.png', size: '1.8 MB', type: 'design' },
          { name: 'Migration Guide.pdf', size: '4.5 MB', type: 'document' },
          { name: 'Performance Benchmarks.xlsx', size: '1.1 MB', type: 'document' }
        ]
      },
      {
        id: 'r7',
        version: 'v2.1.0',
        date: new Date('2024-05-30'),
        title: 'Feature Enhancement',
        notes: 'Added advanced caching, real-time WebSocket support, and comprehensive API documentation.',
        attachments: [
          { name: 'API Documentation.pdf', size: '6.8 MB', type: 'document' },
          { name: 'WebSocket Guide.md', size: '125 KB', type: 'document' }
        ]
      }
    ]
  }
];

const Index = () => {
  const [projects, setProjects] = useState(mockProjects);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleCreateProject = (projectData: any) => {
    const newProject = {
      id: Date.now().toString(),
      ...projectData,
      releases: []
    };
    setProjects([...projects, newProject]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <FolderOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Project Dashboard</h1>
                <p className="text-slate-600">Track your projects and releases</p>
              </div>
            </div>
            <Button 
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="text-2xl font-bold text-slate-900">{projects.length}</div>
              <div className="text-slate-600">Total Projects</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="text-2xl font-bold text-blue-600">
                {projects.filter(p => p.status === 'active').length}
              </div>
              <div className="text-slate-600">Active Projects</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="text-2xl font-bold text-green-600">
                {projects.reduce((acc, p) => acc + p.releases.length, 0)}
              </div>
              <div className="text-slate-600">Total Releases</div>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="space-y-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
          
          {projects.length === 0 && (
            <div className="text-center py-16">
              <FolderOpen className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No projects yet</h3>
              <p className="text-slate-600 mb-6">Create your first project to get started</p>
              <Button 
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Project
              </Button>
            </div>
          )}
        </div>
      </div>

      <CreateProjectDialog 
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreateProject={handleCreateProject}
      />
    </div>
  );
};

export default Index;
