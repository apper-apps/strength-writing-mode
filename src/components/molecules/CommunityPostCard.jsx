import React from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const CommunityPostCard = ({ post }) => {
  const navigate = useNavigate();

  const handlePostClick = () => {
    navigate(`/community/post/${post.Id}`);
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "M월 d일", { locale: ko });
    } catch {
      return "방금 전";
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

  const getRoleText = (role) => {
    switch (role) {
      case "Free_User": return "무료";
      case "Premium": return "프리미엄";
      case "Master": return "마스터";
      default: return role;
    }
  };

  return (
    <Card 
      className="p-6 cursor-pointer" 
      hover
      onClick={handlePostClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
            <ApperIcon name="User" className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-900">{post.authorName}</span>
              <Badge variant={getRoleBadgeVariant(post.authorRole)} size="xs">
                {getRoleText(post.authorRole)}
              </Badge>
            </div>
            <span className="text-sm text-gray-500">
              {formatDate(post.timestamp)}
            </span>
          </div>
        </div>
      </div>
      
      <h3 className="font-semibold text-lg text-gray-900 mb-2 korean-text leading-tight">
        {post.title}
      </h3>
      
      <p className="text-gray-600 korean-text leading-relaxed mb-4 line-clamp-3">
        {post.content}
      </p>
      
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <ApperIcon name="Heart" className="w-4 h-4 mr-1" />
            {post.likes || 0}
          </div>
          <div className="flex items-center">
            <ApperIcon name="MessageCircle" className="w-4 h-4 mr-1" />
            {post.replies?.length || 0}
          </div>
        </div>
        
        {post.category && (
          <Badge variant="default" size="xs">
            {post.category}
          </Badge>
        )}
      </div>
    </Card>
  );
};

export default CommunityPostCard;