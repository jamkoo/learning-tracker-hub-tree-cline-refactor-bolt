import React, { useState } from 'react';
import { CheckCircle, Circle, ArrowRight, Video, BookOpen, FileText, LayoutGrid, HelpCircle } from 'lucide-react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Course, Module, updateCourseProgress } from '@/utils/data';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { renderResourceIcon, contentTypeLabels, levelColorMap } from '@/utils/courseUtils';
import { toast } from 'sonner';

interface LearnerCourseProgressProps {
  course: Course & { progress: number };
  employeeId: string;
}

const LearnerCourseProgress: React.FC<LearnerCourseProgressProps> = ({ course, employeeId }) => {
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);
  
  const handleMarkModuleStatus = (moduleId: string, status: 'not_started' | 'in_progress' | 'completed') => {
    try {
      updateCourseProgress(employeeId, course.id, moduleId, status, 5); // Adding 5 minutes of time spent
      
      // Show success message
      if (status === 'completed') {
        toast.success('Module marked as completed');
      } else if (status === 'in_progress') {
        toast.success('Module marked as in progress');
      }
      
      // Reload page to update progress
      window.location.reload();
    } catch (error) {
      console.error('Error updating module status:', error);
      toast.error('Failed to update module status');
    }
  };
  
  // Helper function to get module status
  const getModuleStatus = (moduleId: string) => {
    const employeeCourse = course as any;
    const moduleProgress = employeeCourse?.modules?.find((m: any) => m.moduleId === moduleId);
    return moduleProgress?.status || 'not_started';
  };
  
  // Helper function to render content type icon
  const getContentTypeIcon = (type: string) => {
    switch(type) {
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'reading':
        return <BookOpen className="h-4 w-4" />;
      case 'quiz':
        return <HelpCircle className="h-4 w-4" />;
      case 'activity':
        return <LayoutGrid className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>{course.title}</CardTitle>
              <CardDescription>{course.description}</CardDescription>
            </div>
            <Badge variant="outline" className={cn("font-medium", levelColorMap[course.level])}>
              {course.level}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium">Course Progress</p>
            <p className="text-sm font-medium">{course.progress}%</p>
          </div>
          <Progress value={course.progress} className="h-2" />
          
          {course.resourceUrl && (
            <div className="mt-6 p-4 bg-muted rounded-md">
              <div className="flex items-center gap-2 mb-2">
                {renderResourceIcon(course.resourceType || 'file')}
                <p className="font-medium">Course Resource</p>
              </div>
              <Button variant="outline" size="sm" className="mt-2" asChild>
                <a href={course.resourceUrl} target="_blank" rel="noopener noreferrer">
                  View Resource
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Course Content</CardTitle>
          <CardDescription>
            {course.modules.length} modules • {course.duration} total
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="space-y-4">
            {course.modules.map((module, index) => {
              const moduleStatus = getModuleStatus(module.id);
              return (
                <AccordionItem key={module.id} value={module.id} className="border rounded-md px-4">
                  <div className="flex items-start py-2">
                    <div className="mr-4 mt-0.5">
                      {moduleStatus === 'completed' ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : moduleStatus === 'in_progress' ? (
                        <Circle className="h-5 w-5 text-amber-500 fill-amber-500" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <AccordionTrigger className="py-0 hover:no-underline">
                        <div className="flex items-center justify-between w-full text-left">
                          <div className="flex items-center">
                            <h3 className="font-medium">
                              {index + 1}. {module.title}
                            </h3>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {module.duration}
                          </span>
                        </div>
                      </AccordionTrigger>

                      <AccordionContent>
                        {module.content && module.content.length > 0 ? (
                          <div className="mt-2 ml-2 space-y-2">
                            {module.content.map((content, contentIndex) => (
                              <div key={content.id} className="flex items-center justify-between p-2 border rounded-md">
                                <div className="flex items-center">
                                  <span className="mr-2">
                                    {getContentTypeIcon(content.type)}
                                  </span>
                                  <div>
                                    <p className="text-sm font-medium">{content.title}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {contentTypeLabels[content.type]}{content.duration ? ` • ${content.duration}` : ''}
                                    </p>
                                  </div>
                                </div>
                                {content.resourceUrl && (
                                  <Button variant="ghost" size="sm" asChild>
                                    <a href={content.resourceUrl} target="_blank" rel="noopener noreferrer">
                                      <ArrowRight className="h-4 w-4" />
                                    </a>
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground mt-2 ml-2">
                            No detailed content available for this module.
                          </p>
                        )}

                        <div className="flex justify-end gap-2 mt-4">
                          {moduleStatus !== 'in_progress' && moduleStatus !== 'completed' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleMarkModuleStatus(module.id, 'in_progress')}
                            >
                              Start Module
                            </Button>
                          )}
                          
                          {moduleStatus === 'in_progress' && (
                            <Button
                              size="sm"
                              onClick={() => handleMarkModuleStatus(module.id, 'completed')}
                            >
                              Complete Module
                            </Button>
                          )}
                          
                          {moduleStatus === 'completed' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleMarkModuleStatus(module.id, 'in_progress')}
                            >
                              Mark as In Progress
                            </Button>
                          )}
                        </div>
                      </AccordionContent>
                    </div>
                  </div>
                </AccordionItem>
              );
            })}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

// Import the cn utility
import { cn } from "@/lib/utils";

export default LearnerCourseProgress;
