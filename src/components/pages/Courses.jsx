import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Badge from "@/components/atoms/Badge";
import CourseCard from "@/components/molecules/CourseCard";
import VideoPlayer from "@/components/molecules/VideoPlayer";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { motion } from "framer-motion";
import { coursesService } from "@/services/api/coursesService";

const Courses = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const loadCourses = async () => {
    try {
      setError("");
      setLoading(true);
      
      await new Promise(resolve => setTimeout(resolve, 800));
      const data = await coursesService.getAll();
      setCourses(data);
    } catch (err) {
      setError("강의 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const loadCourse = async (id) => {
    try {
      setError("");
      setLoading(true);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      const course = await coursesService.getById(parseInt(id));
      setCurrentCourse(course);
    } catch (err) {
      setError("강의를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) {
      loadCourse(courseId);
    } else {
      loadCourses();
    }
  }, [courseId]);

  if (loading) {
    return <Loading className="p-8" />;
  }

  if (error) {
    return (
      <Error 
        message={error} 
        onRetry={courseId ? () => loadCourse(courseId) : loadCourses} 
        className="p-8" 
      />
    );
  }

  // Individual Course View
  if (courseId && currentCourse) {
    const getRoleText = (role) => {
      switch (role) {
        case "Free_User": return "무료";
        case "Premium": return "프리미엄";
        case "Master": return "마스터";
        default: return role;
      }
    };

    const getRoleBadgeVariant = (role) => {
      switch (role) {
        case "Free_User": return "free";
        case "Premium": return "premium";
        case "Master": return "master";
        default: return "default";
      }
    };

    const formatDuration = (minutes) => {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      
      if (hours === 0) return `${mins}분`;
      if (mins === 0) return `${hours}시간`;
      return `${hours}시간 ${mins}분`;
    };

    return (
      <motion.div 
        className="space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Back Button */}
        <div>
          <Button 
            variant="ghost" 
            onClick={() => navigate("/courses")}
            className="mb-4"
          >
            <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
            강의 목록으로 돌아가기
          </Button>
        </div>

        {/* Course Header */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-8 text-white">
          <div className="flex items-start justify-between">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Badge variant={getRoleBadgeVariant(currentCourse.requiredRole)}>
                  {getRoleText(currentCourse.requiredRole)}
                </Badge>
                <div className="flex items-center text-blue-100">
                  <ApperIcon name="Clock" className="w-4 h-4 mr-1" />
                  {formatDuration(currentCourse.duration)}
                </div>
              </div>
              
              <h1 className="text-3xl font-bold korean-text">
                {currentCourse.title}
              </h1>
              
              <p className="text-blue-100 text-lg korean-text max-w-3xl">
                {currentCourse.description}
              </p>
              
              <div className="flex items-center space-x-6 pt-4">
                <div className="flex items-center text-blue-100">
                  <ApperIcon name="Users" className="w-5 h-5 mr-2" />
                  {currentCourse.enrolledCount || 0}명 수강
                </div>
                {currentCourse.progress && (
                  <div className="flex items-center text-accent-300">
                    <ApperIcon name="CheckCircle" className="w-5 h-5 mr-2" />
                    {currentCourse.progress}% 완료
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Video Player */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <VideoPlayer 
              videoId={currentCourse.videoId} 
              title={currentCourse.title}
              className="w-full h-[400px] lg:h-[500px]"
            />
          </div>
          
          {/* Course Info Sidebar */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-lg mb-4 korean-text">강의 정보</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">수강 레벨</span>
                  <Badge variant={getRoleBadgeVariant(currentCourse.requiredRole)}>
                    {getRoleText(currentCourse.requiredRole)}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">강의 시간</span>
                  <span className="font-medium">{formatDuration(currentCourse.duration)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">수강생</span>
                  <span className="font-medium">{currentCourse.enrolledCount || 0}명</span>
                </div>
                {currentCourse.progress && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600 dark:text-gray-400">진도율</span>
                      <span className="font-medium text-primary-600">{currentCourse.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${currentCourse.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-lg mb-4 korean-text">학습 목표</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-start">
                  <ApperIcon name="CheckCircle" className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="korean-text">체계적인 글쓰기 구조 이해</span>
                </li>
                <li className="flex items-start">
                  <ApperIcon name="CheckCircle" className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="korean-text">독자 중심의 콘텐츠 기획</span>
                </li>
                <li className="flex items-start">
                  <ApperIcon name="CheckCircle" className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="korean-text">수익화 전략 수립</span>
                </li>
                <li className="flex items-start">
                  <ApperIcon name="CheckCircle" className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="korean-text">실전 글쓰기 연습</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Courses List View
const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.level.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "all" || course.requiredRole === selectedRole;
    const matchesLevel = selectedLevel === "all" || course.level === selectedLevel;
    const matchesCategory = selectedCategory === "all" || course.category === selectedCategory;
    return matchesSearch && matchesRole && matchesLevel && matchesCategory;
  });

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedRole("all");
    setSelectedLevel("all");
    setSelectedCategory("all");
  };

  const hasActiveFilters = searchTerm || selectedRole !== "all" || selectedLevel !== "all" || selectedCategory !== "all";

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="space-y-8"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.div variants={item} className="space-y-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white korean-text">
          강의
        </h1>
        <p className="text-gray-600 dark:text-gray-300 korean-text">
          체계적인 4단계 과정으로 글쓰기 수익화를 배워보세요
        </p>
      </motion.div>

{/* Search Bar */}
      <motion.div variants={item} className="mb-6">
        <div className="relative">
          <ApperIcon 
            name="Search" 
            size={20} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <Input
            placeholder="강의 제목, 내용, 카테고리, 강사명으로 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 text-lg"
          />
        </div>
      </motion.div>

      {/* Filter Controls */}
      <motion.div variants={item} className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="secondary"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <ApperIcon name="Filter" size={16} />
              필터 {showFilters ? '숨기기' : '보기'}
            </Button>
            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={resetFilters}
                size="sm"
                className="flex items-center gap-1"
              >
                <ApperIcon name="X" size={14} />
                초기화
              </Button>
            )}
          </div>
          <div className="text-sm text-gray-600">
            총 {filteredCourses.length}개의 강의
          </div>
        </div>
      </motion.div>

      {/* Filter Sidebar */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-6 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Role Filter */}
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <ApperIcon name="Shield" size={16} />
                멤버십
              </h4>
              <div className="space-y-2">
                {[
                  { value: "all", label: "전체" },
                  { value: "Free_User", label: "무료" },
                  { value: "Premium", label: "프리미엄" },
                  { value: "Master", label: "마스터" }
                ].map((role) => (
                  <button
                    key={role.value}
                    onClick={() => setSelectedRole(role.value)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      selectedRole === role.value
                        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {role.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Level Filter */}
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <ApperIcon name="TrendingUp" size={16} />
                난이도
              </h4>
              <div className="space-y-2">
                {[
                  { value: "all", label: "전체" },
                  { value: "초급", label: "초급" },
                  { value: "중급", label: "중급" },
                  { value: "고급", label: "고급" }
                ].map((level) => (
                  <button
                    key={level.value}
                    onClick={() => setSelectedLevel(level.value)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      selectedLevel === level.value
                        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <ApperIcon name="Tag" size={16} />
                카테고리
              </h4>
              <div className="space-y-2">
                {[
                  { value: "all", label: "전체" },
                  { value: "기초", label: "기초" },
                  { value: "기획", label: "기획" },
                  { value: "글쓰기", label: "글쓰기" },
                  { value: "수익화", label: "수익화" },
                  { value: "마케팅", label: "마케팅" },
                  { value: "소셜미디어", label: "소셜미디어" },
                  { value: "뉴스레터", label: "뉴스레터" },
                  { value: "브랜딩", label: "브랜딩" }
                ].map((category) => (
                  <button
                    key={category.value}
                    onClick={() => setSelectedCategory(category.value)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      selectedCategory === category.value
                        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <ApperIcon name="BarChart3" size={16} />
                통계
              </h4>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex justify-between">
                  <span>전체 강의:</span>
                  <span className="font-medium">{courses.length}개</span>
                </div>
                <div className="flex justify-between">
                  <span>검색 결과:</span>
                  <span className="font-medium text-primary-600">{filteredCourses.length}개</span>
                </div>
                <div className="flex justify-between">
                  <span>무료 강의:</span>
                  <span className="font-medium">{courses.filter(c => c.requiredRole === "Free_User").length}개</span>
                </div>
                <div className="flex justify-between">
                  <span>프리미엄:</span>
                  <span className="font-medium">{courses.filter(c => c.requiredRole === "Premium").length}개</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <Empty 
          title="강의가 없습니다"
          description={hasActiveFilters ? "검색 조건에 맞는 강의를 찾을 수 없습니다" : "아직 등록된 강의가 없습니다"}
          iconName="BookOpen"
        />
      ) : (
        <motion.div 
          variants={container}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredCourses.map((course) => (
            <motion.div key={course.Id} variants={item}>
              <CourseCard course={course} />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Stats */}
      <motion.div variants={item} className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-8 text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 korean-text">학습 통계</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-3xl font-bold text-accent-300">{courses.length}</div>
              <div className="text-blue-100">총 강의 수</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent-300">1,200+</div>
              <div className="text-blue-100">총 수강생</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent-300">95%</div>
              <div className="text-blue-100">만족도</div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Courses;