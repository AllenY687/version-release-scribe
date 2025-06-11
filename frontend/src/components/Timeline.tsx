import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format, differenceInDays } from 'date-fns';
import { Tag, Clock, FileText } from 'lucide-react';
import { Project, Release } from '@/components/ProjectCard';
import { useMemo } from 'react';

interface TimelineProps {
  project: Project;
  onReleaseClick: (release: Release) => void;
}

export const Timeline = ({ project, onReleaseClick }: TimelineProps) => {
  const today = useMemo(() => new Date(), []);

  const isReleaseInPast = useMemo(() => (date: Date) => date <= today, [today]);

  const getCurrentProgress = () => {
    const totalDays = differenceInDays(project.endDate, project.startDate);
    const daysFromStart = differenceInDays(today, project.startDate);
    return Math.max(0, Math.min(100, (daysFromStart / totalDays) * 100));
  };

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
      <div className="relative min-w-max">
        {/* Progress Track */}
        <div className="absolute top-[8px] left-0 h-2 w-full bg-slate-200 rounded-full -translate-y-1/2 z-0" />

        {/* Progress Fill */}
        <div
          className="absolute top-[8px] left-0 h-2 bg-blue-500 rounded-full -translate-y-1/2 z-10 transition-all duration-500 ease-out"
          style={{ width: `${getCurrentProgress()}%` }}
        />

        {/* Scrollable Releases */}
        <div className="flex gap-6 min-w-max overflow-x-auto pb-6">
          {project.releases.slice().reverse().map((release, index) => {
            const isPast = isReleaseInPast(release.date);

            return (
              <div
                key={release.id}
                className="z-20 w-60 shrink-0 flex flex-col items-center"
              >
                {/* Release Marker */}
                <div
                  className={`w-4 h-4 rounded-full border-2 mb-2 transition-all duration-200 ${
                    isPast
                      ? 'bg-green-500 border-green-600 shadow-lg'
                      : 'bg-white border-blue-400 hover:border-blue-600'
                  }`}
                />

                {/* Release Info Box */}
                <div
                  className={`p-3 rounded-lg shadow-md border bg-white max-w-[220px] ${
                    isPast
                      ? 'border-l-4 border-l-green-500'
                      : 'border-l-4 border-l-blue-400'
                  }`}
                >
                  <Badge
                    variant={isPast ? 'default' : 'outline'}
                    className={`mb-2 ${
                      isPast
                        ? 'bg-green-100 text-green-800 border-green-200'
                        : 'border-blue-200'
                    } inline-flex`}
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
                      <span className="truncate">
                        {format(release.date, 'MMM d, yyyy')}
                      </span>
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
            );
          })}
        </div>
      </div>

      {/* Progress Information */}
      <div className="flex justify-between items-center text-sm text-slate-600 pt-4 border-t border-slate-100">
        <div>
          Current Date: <span className="font-medium">{format(today, 'MMM d, yyyy')}</span>
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
