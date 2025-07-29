import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const CourseCard = ({ course }) => {
  const navigate = useNavigate();

  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case "Free_User": return "free";
      case "Premium": return "premium";
      case "Master": return "master";
      default: return "default";
    }
  };

  const getRoleText = (role) => {
    switch (role) {
      case "Free_User": return "무료";
      case "Premium": return "프리미엄";
      case "Master": return "마스터";
      default: return role;
    }
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours === 0) return `${mins}분`;
    if (mins === 0) return `${hours}시간`;
    return `${hours}시간 ${mins}분`;
  };

  const handleStartCourse = () => {
    navigate(`/courses/${course.Id}`);
  };

  return (
    <Card className="overflow-hidden" hover>
      <div className="aspect-video bg-gradient-to-br from-primary-500 to-primary-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <ApperIcon name="Play" className="w-8 h-8 text-white ml-1" />
          </div>
        </div>
        <div className="absolute top-4 left-4">
          <Badge variant={getRoleBadgeVariant(course.requiredRole)}>
            {getRoleText(course.requiredRole)}
          </Badge>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-lg text-gray-900 korean-text leading-tight">
            {course.title}
          </h3>
          <div className="flex items-center text-sm text-gray-500 ml-4 flex-shrink-0">
            <ApperIcon name="Clock" className="w-4 h-4 mr-1" />
            {formatDuration(course.duration)}
          </div>
        </div>
        
        <p className="text-gray-600 text-sm korean-text leading-relaxed mb-4 line-clamp-3">
          {course.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm text-gray-500">
              <ApperIcon name="Users" className="w-4 h-4 mr-1" />
              {course.enrolledCount || 0}명 수강
            </div>
            {course.progress && (
              <div className="flex items-center text-sm text-primary-600">
                <ApperIcon name="CheckCircle" className="w-4 h-4 mr-1" />
                {course.progress}% 완료
              </div>
            )}
          </div>
          
          <Button 
            size="sm" 
            onClick={handleStartCourse}
            className="flex-shrink-0"
          >
            {course.progress > 0 ? "계속하기" : "시작하기"}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default CourseCard;