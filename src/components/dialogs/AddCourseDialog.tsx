import React from 'react';
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
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import CourseForm from '@/components/forms/CourseForm';
import { Course } from '@/utils/data';

interface AddCourseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  existingCourse?: Course;
  onCourseAdded?: (course: Course) => void;
  onCourseUpdated?: (course: Course) => void;
}

export const AddCourseDialog: React.FC<AddCourseDialogProps> = ({
  isOpen,
  onClose,
  existingCourse,
  onCourseAdded,
  onCourseUpdated,
}) => {
  const isEditing = !!existingCourse;
  const dialogTitle = isEditing ? 'Edit Course' : 'Add New Course';
  const actionButtonText = isEditing ? 'Update Course' : 'Create Course';

  const handleCourseFormSuccess = () => {
    onClose(); // Close the dialog on successful course creation/update
  };

  const handleCourseFormCancel = () => {
    onClose(); // Close the dialog when cancel is clicked in the form
  };


  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{dialogTitle}</AlertDialogTitle>
          <AlertDialogDescription>
            {isEditing ? 'Edit the details of your course.' : 'Enter the details for the new course.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <CourseForm
          existingCourse={existingCourse}
          onSuccess={handleCourseFormSuccess}
          onCancel={handleCourseFormCancel}
          onCourseAdded={onCourseAdded}
          onCourseUpdated={onCourseUpdated}
        />
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
