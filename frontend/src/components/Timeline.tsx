
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format, differenceInDays } from 'date-fns';
import { Tag, Clock, FileText } from 'lucide-react';
import { Project, Release } from '@/components/ProjectCard';

interface TimelineProps {
  project: Project;
  onReleaseClick: (release: Release) => void;
}

export const Timeline = ({ project, onReleaseClick }: TimelineProps) => {
  const totalDays = differenceInDays(project.endDate, project.startDate);
  const today = new Date();
  

  // flagged for change
  const getRelativePosition = (date: Date) => {
    const daysFromStart = differenceInDays(date, project.startDate);
    return Math.max(0, Math.min(100, (daysFromStart / totalDays) * 100));
  };

  const getCurrentPosition = () => {
    if (today < project.startDate) return 0;
    if (today > project.endDate) return 100;
    return getRelativePosition(today);
  };

  // end of flagged for change

  const isReleaseInPast = (date: Date) => date <= today;

  return (
    <div className="overflow-x-auto w-full p-4">
      {/* Timeline Header */}
      <div className="flex space-x-8 min-w-max">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-slate-300 rounded-full"></div>
          <span>Start: {format(project.startDate, 'MMM d, yyyy')}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>End: {format(project.endDate, 'MMM d, yyyy')}</span>
          <div className="w-3 h-3 bg-slate-300 rounded-full"></div>
        </div>
      </div>

      {/* Main Timeline */}
      <div className="relative">
        {/* Timeline Track */}
        <div className="h-2 bg-slate-200 rounded-full relative">
          {/* Progress Bar */}
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500 ease-out"
            style={{ width: `${getCurrentPosition()}%` }}
          />
          
          {/* Current Time Indicator */}
          {project.status === 'active' && (
            <div 
              className="absolute top-0 w-1 h-2 bg-blue-700 transition-all duration-500"
              style={{ left: `${getCurrentPosition()}%` }}
            />
          )}
        </div>

        {/* Release Markers & Boxes */}
        <div className="relative mt-4 pb-40"> 
          {project.releases.map((release) => {
            const position = getRelativePosition(release.date);
            const isPast = isReleaseInPast(release.date);
            
            // Adjust position to prevent boxes from going off-screen
            const adjustedPosition = Math.min(Math.max(position, 15), 85);
            
            return (
              <div
                key={release.id}
                className="absolute transform -translate-x-1/2"
                style={{ left: `${adjustedPosition}%` }}
              >
                {/* Release Marker */}
                <div 
                  className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                    isPast 
                      ? 'bg-green-500 border-green-600 shadow-lg' 
                      : 'bg-white border-blue-400 hover:border-blue-600'
                  }`}
                />
                
                {/* Release Info Box */}
                <div className="mt-3">
                  <div 
                    className={`
                      p-3 rounded-lg shadow-md border bg-white max-w-[220px]
                      ${isPast ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-blue-400'}
                    `}
                  >
                    <Badge 
                      variant={isPast ? "default" : "outline"}
                      className={`mb-2 ${isPast ? 'bg-green-100 text-green-800 border-green-200' : 'border-blue-200'} inline-flex`}
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {release.version}
                    </Badge>
                    
                    <div className="space-y-1">
                      <div className="font-medium text-sm text-slate-900 line-clamp-2">
                        {release.title}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{format(release.date, 'MMM d, yyyy')}</span>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onReleaseClick(release)}
                        className="mt-2 text-xs h-7 w-full hover:bg-blue-50 hover:border-blue-300"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Progress Information */}
      <div className="flex justify-between items-center text-sm text-slate-600 pt-4 border-t border-slate-100">
        <div>
          Progress: <span className="font-medium">{Math.round(getCurrentPosition())}%</span>
        </div>
        <div>
          {project.status === 'completed' ? (
            <span className="text-green-600 font-medium">✓ Completed</span>
          ) : project.status === 'active' ? (
            <span className="text-blue-600 font-medium">🔄 In Progress</span>
          ) : (
            <span className="text-amber-600 font-medium">📅 Planned</span>
          )}
        </div>
      </div>
    </div>
  );
};
