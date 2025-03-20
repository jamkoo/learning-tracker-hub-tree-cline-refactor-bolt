import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Book, Clock, CheckCircle, ChevronRight } from 'lucide-react';
import { getEmployeeById, getEmployeeCourses, Course } from '@/utils/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CourseCard } from '@/components/ui/CourseCard';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getCookie } from '@/lib/utils';
import LearnerCourseProgress from '@/components/learner/LearnerCourseProgress';

const LearnerPage: React.FC = () => {
  const { employeeId } = useParams<{ employeeId: string }>();
  const [employee, setEmployee] = useState(getEmployeeById(employeeId || getCookie('employeeId') || ''));
  const [courses, setCourses] = useState<(Course & { progress: number })[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  
  useEffect(() => {
    const id = employeeId || getCookie('employeeId');
    if (id) {
      const employeeData = getEmployeeById(id);
      setEmployee(employeeData);
      if (employeeData) {
        const employeeCourses = getEmployeeCourses(employeeData.id);
        setCourses(employeeCourses);
        
        // Select the first course by default
        if (employeeCourses.length > 0 && !selectedCourseId) {
          setSelectedCourseId(employeeCourses[0].id);
        }
      }
    }
  }, [employeeId]);

  if (!employee) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle>Access Error</CardTitle>
            <CardDescription>
              We couldn't find your learning profile.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Please make sure you're using the correct access link.</p>
            <Button asChild>
              <Link to="/">Return to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const overallProgress = courses.length 
    ? Math.round(courses.reduce((sum, course) => sum + course.progress, 0) / courses.length) 
    : 0;
  
  const completedCourses = courses.filter(course => course.progress === 100).length;

  const selectedCourse = courses.find(course => course.id === selectedCourseId);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Learning Portal</h1>
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={employee.imageUrl} alt={employee.name} />
                <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{employee.name}</p>
                <p className="text-sm text-muted-foreground">{employee.position}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Learning</CardTitle>
                <CardDescription>Track your progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Overall Progress</p>
                    <ProgressBar 
                      value={overallProgress} 
                      color="accent" 
                      label="Overall Progress"
                      showStatus
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <p className="text-2xl font-bold">{courses.length}</p>
                      <p className="text-xs text-muted-foreground">Enrolled Courses</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <p className="text-2xl font-bold">{completedCourses}</p>
                      <p className="text-xs text-muted-foreground">Completed</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>My Courses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {courses.length > 0 ? (
                    courses.map(course => (
                      <div 
                        key={course.id} 
                        className={`p-3 rounded-md cursor-pointer transition-colors ${
                          selectedCourseId === course.id ? 'bg-accent text-accent-foreground' : 'hover:bg-gray-100'
                        }`}
                        onClick={() => setSelectedCourseId(course.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <Book className="h-5 w-5 mt-0.5" />
                            <div>
                              <p className="font-medium line-clamp-1">{course.title}</p>
                              <div className="flex items-center text-xs text-muted-foreground mt-1">
                                <Clock className="h-3 w-3 mr-1" />
                                <span>{course.duration}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            {course.progress === 100 ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                              <div className="text-xs font-medium">{course.progress}%</div>
                            )}
                          </div>
                        </div>
                        <div className="mt-2">
                          <ProgressBar value={course.progress} size="sm" color={course.progress === 100 ? "success" : "accent"} showValue={false} />
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-4">
                      No courses assigned yet.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main content */}
          <div className="md:col-span-2">
            {selectedCourse ? (
              <LearnerCourseProgress 
                course={selectedCourse} 
                employeeId={employee.id} 
              />
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Book className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">No Course Selected</h3>
                  <p className="text-muted-foreground text-center mb-6">
                    Select a course from your list to view its content and track your progress.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default LearnerPage;
