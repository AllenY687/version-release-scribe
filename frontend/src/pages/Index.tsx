import { useState, useEffect } from 'react';
import { ProjectCard, Project } from '@/components/ProjectCard';
import { CreateProjectDialog } from '@/components/CreateProjectDialog';
import { Button } from '@/components/ui/button';
import { Plus, FolderOpen, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { addDays } from 'date-fns';

const Index = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/releases');
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        const releases = await response.json();
        console.log('Fetched releases:', releases);
        
        // Group releases by project (repository)
        const projectMap = new Map<string, Project>();
        
        releases.forEach((release: any) => {
          const projectId = release.repository?.id?.toString() || 'default';
          
          if (!projectMap.has(projectId)) {
            // Create new project if it doesn't exist
            projectMap.set(projectId, {
              id: projectId,
              name: release.repository?.name || 'Untitled Project',
              description: release.repository?.description || 'No description available',
              startDate: new Date(release.created_at),
              endDate: addDays(new Date(), 5),
              status: 'active',
              releases: []
            });
          }
          
          const project = projectMap.get(projectId)!;
          
          // Add release to project
          project.releases.push({
            id: release.id.toString(),
            version: release.tag_name || 'v1.0.0',
            date: new Date(release.published_at),
            title: release.name || 'Release',
            notes: release.body || 'No release notes available',
            attachments: release.assets?.map((asset: any) => ({
              name: asset.name,
              size: `${(asset.size / 1024 / 1024).toFixed(1)} MB`,
              type: 'document' as const
            })) || []
          });
        });

        setProjects(Array.from(projectMap.values()));
      } catch (error) {
        console.error('Error fetching projects:', error);
        toast({
          title: "Error",
          description: "Failed to fetch projects. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [toast]);

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
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
              <span className="ml-2 text-slate-600">Loading projects...</span>
            </div>
          ) : (
            <>
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
            </>
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
