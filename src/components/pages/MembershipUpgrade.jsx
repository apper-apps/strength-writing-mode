import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { stripePlanService } from '@/services/api/stripePlanService';
import { setUserRole } from '@/store/userSlice';

const MembershipUpgrade = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(null);
  
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redirect if not Free_User
  useEffect(() => {
    if (isAuthenticated && user?.role && user.role !== 'Free_User') {
      navigate('/dashboard');
      return;
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await stripePlanService.getAll();
      setPlans(data);
    } catch (err) {
      setError('플랜을 불러오는데 실패했습니다.');
      console.error('Error loading plans:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (planId) => {
    if (!isAuthenticated) {
      toast.error('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    setProcessingPayment(planId);
    try {
      const result = await stripePlanService.subscribeToPlan(planId, user.userId);
      
      if (result.success) {
        // Update user role in Redux
        const selectedPlan = plans.find(p => p.planId === planId);
        if (selectedPlan) {
          dispatch(setUserRole(selectedPlan.grantRole));
        }
        
        toast.success('멤버십 업그레이드가 완료되었습니다!');
        navigate('/dashboard');
      } else {
        toast.error(result.message || '결제 처리 중 오류가 발생했습니다.');
      }
    } catch (error) {
      toast.error('결제 처리 중 오류가 발생했습니다.');
      console.error('Payment error:', error);
    } finally {
      setProcessingPayment(null);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  const getPlanBadgeVariant = (role) => {
    switch (role) {
      case 'Premium': return 'premium';
      case 'Master': return 'master';
      default: return 'default';
    }
  };

  const getPlanFeatures = (role) => {
    switch (role) {
      case 'Premium':
        return [
          '모든 기본 강의 접근',
          '프리미엄 콘텐츠 이용',
          '우선 고객 지원',
          '월간 진도 리포트'
        ];
      case 'Master':
        return [
          '모든 프리미엄 기능',
          '1:1 멘토링 세션',
          '마스터 전용 콘텐츠',
          '무제한 강의 다운로드',
          '커뮤니티 우선 답변'
        ];
      default:
        return [];
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <ApperIcon name="Lock" className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-xl font-bold mb-2">로그인이 필요합니다</h2>
          <p className="text-gray-600 mb-4">멤버십 업그레이드를 위해 로그인해주세요.</p>
          <Button onClick={() => navigate('/login')}>로그인하기</Button>
        </Card>
      </div>
    );
  }

  if (user?.role !== 'Free_User') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <ApperIcon name="CheckCircle" className="w-16 h-16 mx-auto mb-4 text-green-500" />
          <h2 className="text-xl font-bold mb-2">이미 프리미엄 멤버입니다</h2>
          <p className="text-gray-600 mb-4">현재 {user.role} 플랜을 이용 중입니다.</p>
          <Button onClick={() => navigate('/dashboard')}>대시보드로 이동</Button>
        </Card>
      </div>
    );
  }

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadPlans} />;

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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 korean-text">
            멤버십 업그레이드
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            더 많은 콘텐츠와 기능을 이용하세요. 당신의 글쓰기 여정을 한 단계 발전시켜보세요.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
        >
          {plans.map((plan) => (
            <motion.div key={plan.Id} variants={item}>
              <Card className="relative overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-primary-200">
                {plan.grantRole === 'Master' && (
                  <div className="absolute top-4 right-4">
                    <Badge variant="master" size="sm">인기</Badge>
                  </div>
                )}
                
                <div className="p-8">
                  <div className="text-center mb-6">
                    <Badge variant={getPlanBadgeVariant(plan.grantRole)} size="lg" className="mb-4">
                      {plan.grantRole === 'Premium' ? '프리미엄' : '마스터'}
                    </Badge>
                    
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-gray-900 dark:text-white">
                        ₩{formatPrice(plan.price)}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400 ml-1">
                        /{plan.currency1 === 'KRW' ? '월' : 'month'}
                      </span>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">포함된 기능:</h3>
                    <ul className="space-y-3">
                      {getPlanFeatures(plan.grantRole).map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <ApperIcon name="Check" className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                          <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    onClick={() => handleUpgrade(plan.planId)}
                    disabled={processingPayment === plan.planId}
                    className="w-full"
                    variant={plan.grantRole === 'Master' ? 'primary' : 'secondary'}
                  >
                    {processingPayment === plan.planId ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        처리 중...
                      </div>
                    ) : (
                      <>
                        <ApperIcon name="CreditCard" className="w-4 h-4 mr-2" />
                        {plan.grantRole === 'Premium' ? '프리미엄 시작하기' : '마스터 시작하기'}
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            언제든지 취소할 수 있으며, 모든 결제는 안전하게 처리됩니다.
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center">
              <ApperIcon name="Shield" className="w-4 h-4 mr-1" />
              안전한 결제
            </div>
            <div className="flex items-center">
              <ApperIcon name="RefreshCw" className="w-4 h-4 mr-1" />
              언제든 해지 가능
            </div>
            <div className="flex items-center">
              <ApperIcon name="HeadphonesIcon" className="w-4 h-4 mr-1" />
              24/7 고객지원
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MembershipUpgrade;