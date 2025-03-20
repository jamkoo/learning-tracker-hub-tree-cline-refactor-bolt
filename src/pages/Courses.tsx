import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CourseCard } from '@/components/ui/CourseCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AddCourseDialog } from '@/components/dialogs/AddCourseDialog';
import { Course, courses as initialCourses, addCourse, updateCourse, deleteCourse } from '@/utils/data';
import { Search } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


const CoursesPage: React.FC = () => {
  const [courses, setCourses] = useState(initialCourses);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const { toast } = useToast()

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCourseAdded = (newCourse: Course) => {
    setCourses([...courses, newCourse]);
    setIsDialogOpen(false);
  };

  const handleCourseUpdated = (updatedCourse: Course) => {
    const updatedCoursesList = courses.map(c => c.id === updatedCourse.id ? updatedCourse : c);
    setCourses(updatedCoursesList);
    setEditingCourse(null);
    setIsDialogOpen(false); // Ensure dialog is closed after update
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setIsDialogOpen(true); // Open dialog in edit mode
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingCourse(null); // Clear editing course when dialog is closed
  };

  const handleDeleteCourse = async (courseId: string) => {
    try {
      await deleteCourse(courseId);
      setCourses(courses.filter(course => course.id !== courseId));
      toast({
        title: "Course deleted.",
        description: "The course has been deleted successfully.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error deleting course.",
        description: "Failed to delete the course. Please try again.",
      })
      console.error("Error deleting course:", error);
    }
  };


  return (
    <div className="animate-slide-in">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Courses</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          Add Course
        </Button>
      </div>

      <div className="mb-4 flex items-center space-x-2">
        <Input
          type="search"
          placeholder="Search courses..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full md:w-auto"
        />
        <Search className="h-5 w-5 text-muted-foreground" />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredCourses.map(course => (
          <div key={course.id}>
            <CourseCard course={course} />
          </div>
        ))}
      </div>

      <AddCourseDialog
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        onCourseAdded={handleCourseAdded}
        onCourseUpdated={handleCourseUpdated}
        existingCourse={editingCourse}
      />
    </div>
  );
};

export default CoursesPage;
