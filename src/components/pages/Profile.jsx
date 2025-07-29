import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { userService } from '@/services/api/dashboardService';
import { coursesService } from '@/services/api/coursesService';

// Bookmarked Courses Component
const BookmarkedCourses = () => {
  const [bookmarkedCourses, setBookmarkedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadBookmarkedCourses = async () => {
    try {
      setLoading(true);
      const courses = await coursesService.getBookmarks();
      setBookmarkedCourses(courses);
    } catch (error) {
      toast.error('북마크된 강의를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBookmark = async (courseId) => {
    try {
      await coursesService.removeBookmark(courseId);
      setBookmarkedCourses(prev => prev.filter(course => course.Id !== courseId));
      toast.success('북마크에서 제거되었습니다');
    } catch (error) {
      toast.error('북마크 제거에 실패했습니다');
    }
  };

  const handleViewCourse = (courseId) => {
    navigate(`/courses/${courseId}`);
  };

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

  useEffect(() => {
    loadBookmarkedCourses();
  }, []);

  return (
    <motion.div variants={{
      hidden: { opacity: 0, y: 20 },
      show: { opacity: 1, y: 0 }
    }}>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white korean-text flex items-center gap-2">
            <ApperIcon name="Heart" className="w-5 h-5 text-red-500" />
            북마크한 강의
          </h3>
          <Badge variant="primary" size="sm">
            {bookmarkedCourses.length}개 저장
          </Badge>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loading />
          </div>
        ) : bookmarkedCourses.length === 0 ? (
          <div className="text-center py-8">
            <ApperIcon name="Heart" className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 korean-text">
              아직 북마크한 강의가 없습니다
            </p>
            <Button 
              variant="outline" 
              onClick={() => navigate('/courses')}
              className="mt-3"
            >
              강의 둘러보기
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {bookmarkedCourses.map((course) => (
              <div key={course.Id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 dark:text-white korean-text mb-1">
                      {course.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 korean-text mb-2 line-clamp-2">
                      {course.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge variant={getRoleBadgeVariant(course.requiredRole)} size="sm">
                        {getRoleText(course.requiredRole)}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {course.duration}분
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewCourse(course.Id)}
                    >
                      <ApperIcon name="Play" className="w-4 h-4 mr-1" />
                      학습하기
                    </Button>
                    <button
                      onClick={() => handleRemoveBookmark(course.Id)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="북마크 제거"
                    >
                      <ApperIcon name="Heart" className="w-4 h-4 fill-current" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </motion.div>
  );
};
const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await userService.getUserProfile();
      setProfileData(data);
    } catch (error) {
      console.error('프로필 로딩 실패:', error);
      setError('프로필을 불러오는데 실패했습니다.');
      toast.error('프로필을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      await userService.updateProfile(profileData.user);
      setIsEditing(false);
      toast.success('프로필이 성공적으로 업데이트되었습니다.');
    } catch (error) {
      console.error('프로필 업데이트 실패:', error);
      toast.error('프로필 업데이트에 실패했습니다.');
    }
  };

  const getBadgeColor = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-800 border-blue-200',
      orange: 'bg-orange-100 text-orange-800 border-orange-200',
      gold: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      green: 'bg-green-100 text-green-800 border-green-200',
      purple: 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return colors[color] || colors.blue;
  };

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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (isLoading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadProfileData} />;
  if (!profileData) return <Error message="프로필 데이터를 찾을 수 없습니다." onRetry={loadProfileData} />;

  const { user, stats, completedCourses, inProgressCourses, badges, achievements } = profileData;

  return (
    <motion.div 
      className="space-y-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.div variants={item}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white korean-text">
              프로필
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              학습 진행 상황과 성취를 확인하세요
            </p>
          </div>
          <Button
            onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
            className="px-6"
          >
            <ApperIcon name={isEditing ? "Save" : "Edit"} size={16} className="mr-2" />
            {isEditing ? '저장' : '편집'}
          </Button>
        </div>
      </motion.div>

      {/* User Profile Card */}
      <motion.div variants={item}>
        <Card className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-6 space-y-4 lg:space-y-0">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
              <ApperIcon name="User" className="w-12 h-12 text-white" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {user.name}
                </h2>
                <Badge variant={getRoleBadgeVariant(user.role)}>
                  {getRoleText(user.role)}
                </Badge>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 mb-3">
                {user.email}
              </p>
              
              {user.bio && (
                <p className="text-gray-700 dark:text-gray-300 mb-4 korean-text">
                  {user.bio}
                </p>
              )}
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center space-x-2">
                  <ApperIcon name="MapPin" size={16} />
                  <span>{user.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Calendar" size={16} />
                  <span>가입일: {new Date(user.joinDate).toLocaleDateString('ko-KR')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Clock" size={16} />
                  <span>총 학습시간: {user.totalStudyHours}시간</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={item}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <ApperIcon name="BookOpen" className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.completedCourses}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">완료한 강의</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                <ApperIcon name="Award" className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.badgesEarned}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">획득한 배지</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                <ApperIcon name="Flame" className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.studyStreak}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">연속 학습일</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <ApperIcon name="Users" className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.communityPoints}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">커뮤니티 포인트</p>
              </div>
            </div>
          </Card>
        </div>
      </motion.div>

      {/* Progress Overview */}
      <motion.div variants={item}>
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 korean-text">
            전체 학습 진도
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">전체 진도</span>
              <span className="font-semibold text-primary-600 dark:text-primary-400">
                {stats.progressPercentage}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${stats.progressPercentage}%` }}
              />
            </div>
          </div>
        </Card>
      </motion.div>

<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Completed Courses */}
        <motion.div variants={item}>
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white korean-text">
                완료한 강의
              </h3>
              <Badge variant="success" size="sm">
                {completedCourses.length}개 완료
              </Badge>
            </div>
            
            <div className="space-y-3">
              {completedCourses.map((course) => (
                <div key={course.Id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white korean-text">
                      {course.title}
                    </h4>
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="Award" className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                        {course.score}점
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>완료일: {new Date(course.completedDate).toLocaleDateString('ko-KR')}</span>
                    <span>소요시간: {course.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* In Progress Courses */}
        <motion.div variants={item}>
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white korean-text">
                진행 중인 강의
              </h3>
              <Badge variant="warning" size="sm">
                {inProgressCourses.length}개 진행중
              </Badge>
            </div>
            
            <div className="space-y-3">
              {inProgressCourses.map((course) => (
                <div key={course.Id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2 korean-text">
                    {course.title}
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">진도</span>
                      <span className="font-medium text-primary-600 dark:text-primary-400">
                        {course.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      예상 완료일: {new Date(course.estimatedCompletion).toLocaleDateString('ko-KR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Bookmarked Courses */}
        <BookmarkedCourses />
      </div>

      {/* Badges Section */}
      <motion.div variants={item}>
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white korean-text">
              획득한 배지
            </h3>
            <Badge variant="primary" size="sm">
              {badges.length}/{stats.totalBadges}개 획득
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {badges.map((badge) => (
              <div key={badge.Id} className="group relative">
                <div className={`p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${getBadgeColor(badge.color)}`}>
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-white bg-opacity-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <ApperIcon name={badge.icon} className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm mb-1 korean-text">
                        {badge.name}
                      </h4>
                      <p className="text-xs opacity-80 leading-tight korean-text">
                        {badge.description}
                      </p>
                      <p className="text-xs opacity-60 mt-2">
                        {new Date(badge.earnedDate).toLocaleDateString('ko-KR')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Achievements Section */}
      <motion.div variants={item}>
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 korean-text">
            도전 과제
          </h3>
          
          <div className="space-y-4">
            {achievements.map((achievement) => (
              <div key={achievement.Id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white korean-text">
                      {achievement.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 korean-text">
                      {achievement.description}
                    </p>
                  </div>
                  <Badge 
                    variant={achievement.completed ? "success" : "secondary"} 
                    size="sm"
                  >
                    {achievement.completed ? "완료" : "진행중"}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">진행률</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {achievement.progress}/{achievement.total}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>보상: {achievement.reward}</span>
                    <span>{Math.round((achievement.progress / achievement.total) * 100)}% 완료</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default Profile;