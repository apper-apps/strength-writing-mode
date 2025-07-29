import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { dashboardService } from "@/services/api/dashboardService";

const Dashboard = () => {
const [dashboardData, setDashboardData] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const loadDashboardData = async () => {
    try {
      setError("");
      setLoading(true);
      
      await new Promise(resolve => setTimeout(resolve, 800));
      const data = await dashboardService.getDashboardData();
      setDashboardData(data);
    } catch (err) {
      setError("대시보드 데이터를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
    loadDashboardData();
    loadBanners();
  }, []);

  const loadBanners = async () => {
    try {
      const { coursesService } = await import('@/services/api/coursesService');
      const bannerData = await coursesService.getBanners('dashboard_top');
      setBanners(bannerData);
    } catch (error) {
      console.error("Error loading banners:", error.message);
    }
  };

  if (loading) {
    return <Loading className="p-8" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadDashboardData} className="p-8" />;
  }

  const user = dashboardData.user || {};
  const stats = dashboardData.stats || {};
  const recentCourses = dashboardData.recentCourses || [];
  const communityHighlights = dashboardData.communityHighlights || [];

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
      {/* P4 Auto-Next Banners */}
      {banners.length > 0 && (
        <motion.div variants={item} className="space-y-4">
          {banners.map((banner) => (
            <div
              key={banner.Id}
              className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-4 rounded-lg shadow-lg border border-primary-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <ApperIcon name="ArrowRight" className="w-4 h-4 text-white" />
                  </div>
                  <p className="font-medium korean-text">{banner.text}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                  onClick={() => navigate("/courses")}
                >
                  이동하기
                  <ApperIcon name="ChevronRight" className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Header */}
      <motion.div variants={item} className="space-y-2">
        <div className="flex items-center space-x-3">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white korean-text">
            대시보드
          </h1>
          <Badge variant={getRoleBadgeVariant(user.role)}>
            {getRoleText(user.role)}
          </Badge>
        </div>
        <p className="text-gray-600 dark:text-gray-300 korean-text">
          안녕하세요, {user.name}님! 오늘도 강점글쓰기로 성장해보세요.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-gradient-to-br from-primary-50 to-blue-50 border-primary-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-primary-600">전체 진도</p>
              <p className="text-3xl font-bold text-primary-900">{stats.overallProgress}%</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="TrendingUp" className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-primary-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${stats.overallProgress}%` }}
              />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-accent-50 to-yellow-50 border-accent-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-accent-700">완료한 강의</p>
              <p className="text-3xl font-bold text-accent-900">{stats.completedCourses}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="BookOpen" className="w-6 h-6 text-gray-900" />
            </div>
          </div>
          <p className="text-sm text-accent-600 mt-2">
            총 {stats.totalCourses}개 강의 중
          </p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">작성한 글</p>
              <p className="text-3xl font-bold text-green-900">{stats.postsWritten}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="PenTool" className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-sm text-green-600 mt-2">
            지난 주 대비 +{stats.postsGrowth}개
          </p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">커뮤니티 활동</p>
              <p className="text-3xl font-bold text-purple-900">{stats.communityPoints}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="Users" className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-sm text-purple-600 mt-2">포인트</p>
        </Card>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Courses */}
        <motion.div variants={item}>
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white korean-text">
                최근 강의
              </h2>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate("/courses")}
              >
                전체 보기
                <ApperIcon name="ArrowRight" className="w-4 h-4 ml-1" />
              </Button>
            </div>
            
            <div className="space-y-4">
              {recentCourses.map((course) => (
                <div key={course.Id} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ApperIcon name="Play" className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 dark:text-white korean-text truncate">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {course.progress}% 완료
                    </p>
                  </div>
                  <div className="w-16">
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Community Highlights */}
        <motion.div variants={item}>
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white korean-text">
                커뮤니티 하이라이트
              </h2>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate("/community")}
              >
                전체 보기
                <ApperIcon name="ArrowRight" className="w-4 h-4 ml-1" />
              </Button>
            </div>
            
            <div className="space-y-4">
              {communityHighlights.map((post) => (
                <div key={post.Id} className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <ApperIcon name="User" className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {post.authorName}
                        </span>
                        <Badge variant={getRoleBadgeVariant(post.authorRole)} size="xs">
                          {getRoleText(post.authorRole)}
                        </Badge>
                      </div>
                      <h4 className="font-medium text-gray-900 dark:text-white korean-text truncate">
                        {post.title}
                      </h4>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <div className="flex items-center">
                          <ApperIcon name="Heart" className="w-4 h-4 mr-1" />
                          {post.likes}
                        </div>
                        <div className="flex items-center">
                          <ApperIcon name="MessageCircle" className="w-4 h-4 mr-1" />
                          {post.replies}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Learning Progress Section */}
      <motion.div variants={item}>
        <Card className="p-6 bg-gradient-to-r from-primary-500 to-primary-600 text-white">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold korean-text">4단계 학습 여정</h2>
              <p className="text-blue-100 korean-text">
                체계적인 과정으로 글쓰기 수익화를 완성해보세요
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <ApperIcon name="Target" className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            {[
              { step: 1, title: "강점 찾기", progress: 100, icon: "Target" },
              { step: 2, title: "콘셉트 설계", progress: 75, icon: "Lightbulb" },
              { step: 3, title: "글 시나리오", progress: 50, icon: "FileText" },
              { step: 4, title: "수익화 실행", progress: 25, icon: "TrendingUp" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <ApperIcon name={item.icon} className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2 korean-text">{item.title}</h3>
                <div className="w-full bg-white/20 rounded-full h-2 mb-2">
                  <div 
                    className="bg-gradient-to-r from-accent-400 to-accent-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
                <span className="text-sm text-blue-100">{item.progress}% 완료</span>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;