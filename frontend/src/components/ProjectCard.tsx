
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Timeline } from '@/components/Timeline';
import { ReleaseDialog } from '@/components/ReleaseDialog';
import { Calendar, Clock, Target } from 'lucide-react';
import { format } from 'date-fns';

export interface Release {
  id: string;
  version: string;
  date: Date;
  title: string;
  notes: string;
  attachments: Array<{
    name: string;
    size: string;
    type: 'document' | 'design' | 'code' | 'image' | 'video';
    url: string;
    contentType: string;
  }>;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'completed' | 'planned';
  releases: Release[];
}

interface ProjectCardProps {
  project: Project;
}

export const getAttachmentType = (contentType: string): Release['attachments'][0]['type'] => {
  if (contentType.startsWith('image/')) return 'image';
  if (contentType.startsWith('video/')) return 'video';
  if (contentType === 'application/pdf') return 'document';
  // Add more types if needed
  return 'document';
};

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const [selectedRelease, setSelectedRelease] = useState<Release | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'planned': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Clock className="h-3 w-3" />;
      case 'completed': return <Target className="h-3 w-3" />;
      case 'planned': return <Calendar className="h-3 w-3" />;
      default: return null;
    }
  };

  return (
    <>
      <Card className="w-full hover:shadow-lg transition-all duration-300 border-slate-200 bg-white">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-xl font-semibold text-slate-900 mb-2">
                {project.name}
              </CardTitle>
              <p className="text-slate-600 mb-4">{project.description}</p>
              
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{format(project.startDate, 'MMM d, yyyy')}</span>
                  <span>-</span>
                  <span>{format(project.endDate, 'MMM d, yyyy')}</span>
                </div>
                <Badge 
                  variant="outline" 
                  className={`${getStatusColor(project.status)} flex items-center gap-1`}
                >
                  {getStatusIcon(project.status)}
                  {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                </Badge>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-sm text-slate-500 mb-1">Releases</div>
              <div className="text-2xl font-bold text-slate-900">
                {project.releases.length}
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <Timeline 
            project={project}
            onReleaseClick={setSelectedRelease}
          />
        </CardContent>
      </Card>

      <ReleaseDialog 
        release={selectedRelease}
        open={!!selectedRelease}
        onOpenChange={(open) => !open && setSelectedRelease(null)}
      />
    </>
  );
};
