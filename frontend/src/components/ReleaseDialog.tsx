import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Tag, 
  Calendar, 
  FileText, 
  Download, 
  Image,
  Video,
  ExternalLink 
} from 'lucide-react';
import { format } from 'date-fns';
import { Release } from '@/components/ProjectCard';

interface ReleaseDialogProps {
  release: Release | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ReleaseDialog = ({ release, open, onOpenChange }: ReleaseDialogProps) => {
  if (!release) return null;

  const getAttachmentIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getAttachmentColor = (type: string) => {
    switch (type) {
      case 'image': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'video': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Tag className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="font-semibold">{release.title}</div>
              <div className="text-sm font-normal text-slate-600">
                Version {release.version}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-6">
            {/* Release Info */}
            <div className="flex items-center gap-4 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Released on {format(release.date, 'MMMM d, yyyy')}</span>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <Tag className="h-3 w-3 mr-1" />
                {release.version}
              </Badge>
            </div>

            <Separator />

            {/* Release Notes */}
            <div>
              <h3 className="font-semibold text-lg mb-3 text-slate-900">Release Notes</h3>
              <div className="prose prose-sm max-w-none">
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {release.notes}
                </p>
              </div>
            </div>

            {/* Attachments */}
            {release.attachments.length > 0 && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold text-lg mb-4 text-slate-900">
                    Attachments ({release.attachments.length})
                  </h3>
                  <div className="space-y-3">
                    {release.attachments.map((attachment, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${getAttachmentColor(attachment.type)}`}>
                            {getAttachmentIcon(attachment.type)}
                          </div>
                          <div>
                            <div className="font-medium text-slate-900">
                              {attachment.name}
                            </div>
                            <div className="text-sm text-slate-500">
                              {attachment.size} • {attachment.type}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">

                          <a href={attachment.url} target="_blank" rel="noopener noreferrer">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </a>

                          <a href={attachment.url} download>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Download className="h-4 w-4" />
                            </Button>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </ScrollArea>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
