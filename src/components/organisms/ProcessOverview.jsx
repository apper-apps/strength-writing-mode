import React from "react";
import StepCard from "@/components/molecules/StepCard";

const ProcessOverview = () => {
  const steps = [
    {
      step: 1,
      title: "강점 찾기",
      description: "나만의 독특한 강점과 전문성을 발견하고 분석하여 글쓰기의 기반을 만듭니다.",
      icon: "Target"
    },
    {
      step: 2,
      title: "콘셉트 설계",
      description: "발견한 강점을 바탕으로 독자들에게 가치를 전달할 수 있는 콘셉트를 설계합니다.",
      icon: "Lightbulb"
    },
    {
      step: 3,
      title: "글 시나리오",
      description: "체계적인 글쓰기 구조와 시나리오를 통해 영향력 있는 콘텐츠를 제작합니다.",
      icon: "FileText"
    },
    {
      step: 4,
      title: "수익화 실행",
      description: "완성된 콘텐츠를 다양한 채널을 통해 수익으로 연결하는 실전 전략을 실행합니다.",
      icon: "TrendingUp"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-800 rounded-full text-sm font-medium mb-6">
            <span>4단계 체계적 학습</span>
          </div>
          
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6 korean-text">
            강점글쓰기 <span className="gradient-text">학습 과정</span>
          </h2>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto korean-text leading-relaxed">
            체계적인 4단계 과정을 통해 나만의 강점을 발견하고, 
            글쓰기로 지속 가능한 수익을 만드는 방법을 배워보세요.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.step} className="relative">
              <StepCard {...step} />
              
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary-300 to-primary-200 dark:from-primary-600 dark:to-primary-700 transform -translate-y-1/2 z-10">
                  <div className="absolute right-0 top-1/2 w-2 h-2 bg-primary-400 rounded-full transform -translate-y-1/2 translate-x-1" />
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-8 lg:p-12 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent" />
            <div className="relative z-10">
              <h3 className="text-2xl lg:text-3xl font-bold mb-4 korean-text">
                지금 시작해서 첫 번째 수익글을 완성해보세요
              </h3>
              <p className="text-blue-100 mb-8 text-lg korean-text">
                체계적인 4단계 과정으로 안전하고 확실한 수익화를 경험하세요
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-accent-500 hover:bg-accent-600 text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg">
                  무료로 시작하기
                </button>
                <button className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200">
                  성공 사례 보기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessOverview;