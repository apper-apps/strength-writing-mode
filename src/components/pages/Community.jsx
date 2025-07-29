import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { communityZoneService } from "@/services/api/communityZoneService";
import { communitySettingService } from "@/services/api/communitySettingService";
import { toast } from "react-toastify";
import { communityService } from "@/services/api/communityService";
import ApperIcon from "@/components/ApperIcon";
import CommunityPostCard from "@/components/molecules/CommunityPostCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

function Community() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  // Data states
  const [posts, setPosts] = useState([]);
  const [zones, setZones] = useState([]);
  const [settings, setSettings] = useState(null);
  const [selectedZone, setSelectedZone] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPost, setCurrentPost] = useState(null);
// New post modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostCategory, setNewPostCategory] = useState("질문");
  const [createLoading, setCreateLoading] = useState(false);
  
  // Comment states
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [commentLoading, setCommentLoading] = useState(false);

  const loadPosts = async () => {
    try {
      setError("");
      setLoading(true);
      
      await new Promise(resolve => setTimeout(resolve, 800));
      const data = await communityService.getAll();
      setPosts(data);
    } catch (err) {
      setError("커뮤니티 게시글을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const loadPost = async (id) => {
    try {
      setError("");
      setLoading(true);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      const post = await communityService.getById(parseInt(id));
      setCurrentPost(post);
    } catch (err) {
      setError("게시글을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

const createPost = async () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      toast.error("제목과 내용을 모두 입력해주세요.");
      return;
    }

    try {
      setCreateLoading(true);
      const postData = {
        title: newPostTitle.trim(),
content: newPostContent.trim(),
        category: newPostCategory,
        authorId: user?.userId || "current_user",
        authorName: user?.firstName || "현재사용자", 
        authorRole: user?.role || "Free_User",
        views: 0,
        zone: selectedZone !== "all" ? selectedZone : null
      };

      const newPost = await communityService.create(postData);
      setPosts(prev => [newPost, ...prev]);
      
      // Reset form
      setNewPostTitle("");
      setNewPostContent("");
      setNewPostCategory("질문");
      setShowCreateModal(false);
      
      toast.success("게시글이 성공적으로 작성되었습니다!");
    } catch (err) {
      toast.error("게시글 작성에 실패했습니다.");
    } finally {
      setCreateLoading(false);
    }
  };

  const addComment = async () => {
    if (!newComment.trim()) {
      toast.error("댓글 내용을 입력해주세요.");
      return;
    }

    try {
      setCommentLoading(true);
      const commentData = {
        authorName: "현재사용자",
        content: newComment.trim(),
        timestamp: new Date().toISOString(),
        replyTo: replyTo
      };

      const updatedPost = await communityService.addComment(currentPost.Id, commentData);
      setCurrentPost(updatedPost);
      
      // Update posts list as well
      setPosts(prev => prev.map(post => 
        post.Id === currentPost.Id ? updatedPost : post
      ));
      
      setNewComment("");
      setReplyTo(null);
      toast.success("댓글이 성공적으로 작성되었습니다!");
    } catch (err) {
      toast.error("댓글 작성에 실패했습니다.");
    } finally {
      setCommentLoading(false);
    }
  };

  useEffect(() => {
    if (postId) {
      loadPost(postId);
    } else {
      loadPosts();
    }
  }, [postId]);
// Load zones and settings
  useEffect(() => {
    loadZonesAndSettings();
  }, [user]);
  if (loading) {
    return <Loading className="p-8" />;
  }

  if (error) {
    return (
      <Error 
        message={error} 
        onRetry={postId ? () => loadPost(postId) : loadPosts} 
        className="p-8" 
      />
    );
  }

  // Individual Post View
  if (postId && currentPost) {
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

    const formatDate = (dateString) => {
      try {
        return format(new Date(dateString), "PPP p", { locale: ko });
      } catch {
        return "방금 전";
      }
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
            onClick={() => navigate("/community")}
            className="mb-4"
          >
            <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
            커뮤니티로 돌아가기
          </Button>
        </div>

        {/* Post Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Post Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                  <ApperIcon name="User" className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {currentPost.authorName}
                    </span>
                    <Badge variant={getRoleBadgeVariant(currentPost.authorRole)} size="sm">
                      {getRoleText(currentPost.authorRole)}
                    </Badge>
                  </div>
                  <span className="text-sm text-gray-500">
                    {formatDate(currentPost.timestamp)}
                  </span>
                </div>
              </div>
              
              {currentPost.category && (
                <Badge variant="default">
                  {currentPost.category}
                </Badge>
              )}
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white korean-text mb-4">
              {currentPost.title}
            </h1>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center text-gray-500">
                <ApperIcon name="Heart" className="w-5 h-5 mr-1" />
                {currentPost.likes || 0}
              </div>
              <div className="flex items-center text-gray-500">
                <ApperIcon name="MessageCircle" className="w-5 h-5 mr-1" />
                {currentPost.replies?.length || 0}
              </div>
              <div className="flex items-center text-gray-500">
                <ApperIcon name="Eye" className="w-5 h-5 mr-1" />
                {currentPost.views || 0}
              </div>
            </div>
          </div>
          
          {/* Post Body */}
          <div className="p-6">
            <div className="prose prose-gray dark:prose-invert max-w-none korean-text">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                {currentPost.content}
              </p>
            </div>
          </div>
          
          {/* Engagement Buttons */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <ApperIcon name="Heart" className="w-4 h-4 mr-2" />
                좋아요
              </Button>
              <Button variant="ghost" size="sm">
                <ApperIcon name="MessageCircle" className="w-4 h-4 mr-2" />
                댓글
              </Button>
              <Button variant="ghost" size="sm">
                <ApperIcon name="Share" className="w-4 h-4 mr-2" />
                공유
              </Button>
            </div>
          </div>
        </div>

{/* Comment Input Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-semibold text-lg mb-4 korean-text">
            댓글 작성
          </h3>
          
          {replyTo && (
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-600 dark:text-blue-400">
                  {replyTo.authorName}님에게 답글
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setReplyTo(null)}
                >
                  <ApperIcon name="X" className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 korean-text">
                {replyTo.content.substring(0, 100)}...
              </p>
            </div>
          )}
          
          <div className="space-y-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="댓글을 입력하세요..."
              className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none korean-text"
              rows="3"
            />
            
            <div className="flex justify-end">
              <Button
                onClick={addComment}
                disabled={commentLoading || !newComment.trim()}
                className="korean-text"
              >
                {commentLoading ? (
                  <>
                    <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                    작성 중...
                  </>
                ) : (
                  <>
                    <ApperIcon name="Send" className="w-4 h-4 mr-2" />
                    {replyTo ? "답글 작성" : "댓글 작성"}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Replies Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-semibold text-lg mb-6 korean-text">
            댓글 {currentPost.replies?.length || 0}개
          </h3>
          
          {currentPost.replies && currentPost.replies.length > 0 ? (
            <div className="space-y-6">
              {currentPost.replies.map((reply, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <ApperIcon name="User" className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {reply.authorName}
                          </span>
                          <span className="text-sm text-gray-500">
                            {formatDate(reply.timestamp)}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setReplyTo(reply)}
                          className="text-sm text-gray-500 hover:text-primary-600"
                        >
                          <ApperIcon name="Reply" className="w-4 h-4 mr-1" />
                          답글
                        </Button>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 korean-text">
                        {reply.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Empty 
              title="댓글이 없습니다"
              description="첫 번째 댓글을 작성해보세요"
              iconName="MessageCircle"
            />
          )}
        </div>
      </motion.div>
    );
  }

  // Community Posts List View
const categories = selectedZone === "all" ? 
    ["all", "질문", "후기", "자유", "수익인증"] : 
    ["all", "질문", "후기", "자유"];


  const loadZonesAndSettings = async () => {
    try {
      const userRole = user?.role || "Free_User";
      const [zonesData, settingsData] = await Promise.all([
        communityZoneService.getByRole(userRole),
        communitySettingService.getAll()
      ]);
      
      setZones(zonesData);
      setSettings(settingsData);
    } catch (error) {
      console.error("Error loading zones and settings:", error);
    }
  };

  // Check if user can post in selected zone
  const canPostInZone = () => {
    if (selectedZone === "all") return false;
    const zone = zones.find(z => z.slug === selectedZone);
    return zone?.can_post && zone.roles?.includes(user?.role || "Free_User");
  };

  // Filter posts by zone
  const filterPostsByZone = (posts) => {
    if (selectedZone === "all") return posts;
    return posts.filter(post => post.zone === selectedZone || (!post.zone && selectedZone === "free"));
  };
  
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white korean-text">
            커뮤니티
          </h1>
          <p className="text-gray-600 dark:text-gray-300 korean-text">
            동료들과 함께 성장하고 경험을 나누세요
          </p>
        </div>
        
{canPostInZone() && (
          <Button onClick={() => setShowCreateModal(true)}>
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            새 글 작성
          </Button>
        )}
      </motion.div>

      {/* Create Post Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white korean-text">
                  새 글 작성
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCreateModal(false)}
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </Button>
              </div>
            </div>
            
            <div className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-8rem)]">
              <div>
<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 korean-text">
                  커뮤니티 구역
                </label>
                <select
                  value={selectedZone}
                  onChange={(e) => setSelectedZone(e.target.value)}
                  className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white korean-text mb-4"
                >
                  {zones.map(zone => (
                    <option key={zone.slug} value={zone.slug}>
                      {zone.label}
                    </option>
                  ))}
                </select>

                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 korean-text">
                  카테고리
                </label>
                <select
                  value={newPostCategory}
                  onChange={(e) => setNewPostCategory(e.target.value)}
                  className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white korean-text"
                >
                  {categories.filter(cat => cat !== "all").map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 korean-text">
                  제목
                </label>
                <Input
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  placeholder="게시글 제목을 입력하세요..."
                  className="w-full korean-text"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 korean-text">
                  내용
                </label>
                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="게시글 내용을 입력하세요..."
                  className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none korean-text"
                  rows="8"
                />
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-end space-x-3">
                <Button
                  variant="secondary"
                  onClick={() => setShowCreateModal(false)}
                >
                  취소
                </Button>
                <Button
                  onClick={createPost}
                  disabled={createLoading}
                >
                  {createLoading ? (
                    <>
                      <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                      작성 중...
                    </>
                  ) : (
                    <>
                      <ApperIcon name="Send" className="w-4 h-4 mr-2" />
                      게시글 작성
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Filters */}
      <motion.div variants={item} className="space-y-4">
        <Input
          placeholder="제목이나 내용으로 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
        
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "primary" : "secondary"}
              onClick={() => setSelectedCategory(category)}
              size="sm"
              className="korean-text"
            >
              {category === "all" ? "전체" : category}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">전체 게시글</p>
              <p className="text-2xl font-bold">{posts.length}</p>
            </div>
            <ApperIcon name="FileText" className="w-8 h-8 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">활성 멤버</p>
              <p className="text-2xl font-bold">1,200+</p>
            </div>
            <ApperIcon name="Users" className="w-8 h-8 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-accent-500 to-accent-600 rounded-xl p-6 text-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-700 text-sm">이번 주 댓글</p>
              <p className="text-2xl font-bold">240</p>
            </div>
            <ApperIcon name="MessageCircle" className="w-8 h-8 text-gray-700" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">수익 인증</p>
              <p className="text-2xl font-bold">85</p>
            </div>
            <ApperIcon name="TrendingUp" className="w-8 h-8 text-purple-200" />
          </div>
        </div>
      </motion.div>

      {/* Posts List */}
      {filteredPosts.length === 0 ? (
        <Empty 
          title="게시글이 없습니다"
          description="검색 조건에 맞는 게시글을 찾을 수 없습니다"
          iconName="MessageCircle"
          actionText="새 글 작성하기"
          onAction={() => {}}
        />
      ) : (
        <motion.div 
          variants={container}
          className="space-y-4"
        >
          {filteredPosts.map((post) => (
            <motion.div key={post.Id} variants={item}>
              <CommunityPostCard post={post} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default Community;