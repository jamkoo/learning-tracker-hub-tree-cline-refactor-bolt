import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEmployeeByAccessToken, getEmployeeCourses } from '@/utils/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { setCookie } from '@/lib/utils';

const DirectAccess: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (token) {
      const employee = getEmployeeByAccessToken(token);
      
      if (employee) {
        // Set a cookie to remember the employee ID
        setCookie('employeeId', employee.id, 30); // 30 days expiry
        
        // Redirect to the learner page after a short delay
        setTimeout(() => {
          navigate(`/learner/${employee.id}`);
        }, 2000);
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [token, navigate]);
  
  const employee = token ? getEmployeeByAccessToken(token) : null;
  const courses = employee ? getEmployeeCourses(employee.id) : [];
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <Card className="w-[400px]">
          <CardHeader className="text-center">
            <CardTitle>Accessing Learning Portal</CardTitle>
            <CardDescription>
              Please wait while we prepare your learning environment...
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            {employee && (
              <>
                <Avatar className="h-20 w-20 mb-4">
                  <AvatarImage src={employee.imageUrl} alt={employee.name} />
                  <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-medium">{employee.name}</h3>
                <p className="text-muted-foreground">{employee.position}</p>
                <p className="mt-4 text-center">
                  You have {courses.length} course{courses.length !== 1 ? 's' : ''} available.
                </p>
              </>
            )}
            <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-accent h-2.5 rounded-full animate-progress-pulse" style={{ width: '100%' }}></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (!employee) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle>Invalid Access Link</CardTitle>
            <CardDescription>
              The access link you used is not valid or has expired.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Please contact your administrator to get a new access link.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => navigate('/')} className="w-full">
              Return to Homepage
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  return null; // This shouldn't render as we're redirecting
};

export default DirectAccess;
