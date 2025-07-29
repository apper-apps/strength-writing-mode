import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { coursesService } from "@/services/api/coursesService";

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

const [isBookmarked, setIsBookmarked] = useState(false);
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);

  useEffect(() => {
    setIsBookmarked(coursesService.isBookmarked(course.Id));
  }, [course.Id]);

  const handleBookmarkToggle = async (e) => {
    e.stopPropagation();
    setIsBookmarkLoading(true);
    
    try {
      if (isBookmarked) {
        await coursesService.removeBookmark(course.Id);
        setIsBookmarked(false);
        toast.success('북마크에서 제거되었습니다');
      } else {
        await coursesService.addBookmark(course.Id);
        setIsBookmarked(true);
        toast.success('북마크에 추가되었습니다');
      }
    } catch (error) {
      toast.error('북마크 처리 중 오류가 발생했습니다');
    } finally {
      setIsBookmarkLoading(false);
    }
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
        <div className="absolute top-4 right-4">
          <button
            onClick={handleBookmarkToggle}
            disabled={isBookmarkLoading}
            className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
              isBookmarked 
                ? 'bg-red-500 bg-opacity-80 text-white hover:bg-red-600' 
                : 'bg-white bg-opacity-20 text-white hover:bg-white hover:bg-opacity-30'
            } ${isBookmarkLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}`}
            title={isBookmarked ? '북마크 제거' : '북마크 추가'}
          >
            <ApperIcon 
              name={isBookmarked ? "Heart" : "Heart"} 
              className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`}
            />
          </button>
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
        
        {/* Progress Bar Section */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              진도율
            </span>
            <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
              {course.progress || 0}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-primary-500 to-primary-600 h-2.5 rounded-full transition-all duration-500 ease-out shadow-sm"
              style={{ width: `${course.progress || 0}%` }}
              role="progressbar"
              aria-valuenow={course.progress || 0}
              aria-valuemin="0"
              aria-valuemax="100"
              aria-label={`강의 진도율 ${course.progress || 0}%`}
            />
          </div>
          {course.progress > 0 && (
            <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
              <ApperIcon name="CheckCircle" className="w-3 h-3 mr-1 text-green-500" />
              학습 중
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm text-gray-500">
              <ApperIcon name="Users" className="w-4 h-4 mr-1" />
              {course.enrolledCount || 0}명 수강
            </div>
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