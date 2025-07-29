import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const HeroSection = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/dashboard");
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-500 via-primary-600 to-blue-700 text-white">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-accent-500/10 to-transparent" />
      
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-accent-500/20 rounded-full blur-3xl" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm border border-white/20">
                  <ApperIcon name="Star" className="w-4 h-4 mr-2 text-accent-400" />
                  <span className="text-sm font-medium">4-Step Learning · Membership 기반</span>
                </div>
                
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight korean-text">
                  <span className="block">강점승부로,</span>
                  <span className="block gradient-text bg-gradient-to-r from-white to-accent-300 bg-clip-text text-transparent">
                    글 하나가 월수익이 된다
                  </span>
                </h1>
                
                <p className="text-xl lg:text-2xl text-blue-100 korean-text leading-relaxed max-w-lg">
                  체계적인 4단계 학습으로 나만의 강점을 찾고, 글쓰기로 지속 가능한 수익을 만들어보세요.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="xl"
                  variant="accent"
                  onClick={handleGetStarted}
                  className="font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <ApperIcon name="Play" className="w-5 h-5 mr-2" />
                  무료 시작하기
                </Button>
                
                <Button
                  size="xl"
                  variant="ghost"
                  className="text-white border-white/30 hover:bg-white/10 hover:border-white/50"
                >
                  <ApperIcon name="BookOpen" className="w-5 h-5 mr-2" />
                  더 알아보기
                </Button>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/20">
                <div className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold text-accent-400">1,200+</div>
                  <div className="text-sm text-blue-200">수강생</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold text-accent-400">95%</div>
                  <div className="text-sm text-blue-200">만족도</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold text-accent-400">4단계</div>
                  <div className="text-sm text-blue-200">체계적 학습</div>
                </div>
              </div>
            </div>
            
            {/* Visual */}
            <div className="relative">
              <div className="relative z-10 bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-lg flex items-center justify-center">
                      <ApperIcon name="PenTool" className="w-6 h-6 text-gray-900" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">강점글쓰기 플랫폼</h3>
                      <p className="text-blue-200 text-sm">체계적인 글쓰기 수익화</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      { icon: "Target", text: "강점 찾기", progress: 100 },
                      { icon: "Lightbulb", text: "콘셉트 설계", progress: 75 },
                      { icon: "FileText", text: "글 시나리오", progress: 50 },
                      { icon: "TrendingUp", text: "수익화 실행", progress: 25 }
                    ].map((step, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                          <ApperIcon name={step.icon} className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">{step.text}</span>
                            <span className="text-xs text-blue-200">{step.progress}%</span>
                          </div>
                          <div className="w-full bg-white/20 rounded-full h-1.5">
                            <div 
                              className="bg-gradient-to-r from-accent-400 to-accent-500 h-1.5 rounded-full transition-all duration-500"
                              style={{ width: `${step.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-accent-500/30 rounded-full blur-xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-white/10 rounded-full blur-xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;