import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import supabase from '../lib/supabase';
import { ArrowLeft, Lightbulb, FileEdit } from 'lucide-react';

export default function InterviewTips() {
  const navigate = useNavigate();
  const location = useLocation();
  const { career, department } = location.state || {};
  
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!career) {
      navigate('/dashboard');
      return;
    }
    fetchInterviewTips();
  }, [career]);

  const fetchInterviewTips = async () => {
    try {
      const { data, error } = await supabase
        .from('interview_tips')
        .select('*')
        .eq('career_id', career.id)
        .order('order_index');
      
      if (error) throw error;
      setTips(data || []);
    } catch (error) {
      console.error('Error fetching interview tips:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateResume = () => {
    navigate('/resume-builder', { state: { career, department } });
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-100 to-green-50">
      {/* Header */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center space-x-2">
            <img
              src="/logo.jpg"
              alt="CareerPrep Logo"
              className="w-10 h-10 sm:w-12 sm:h-12 object-contain rounded-xl shadow-lg"
            />
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-800 to-green-700 bg-clip-text text-transparent">
              CareerPrep
            </span>
          </div>
        </div>
      </nav>  

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-8 max-w-4xl">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition mb-6"
        >
          <ArrowLeft size={20} />
          <span>Back to Dashboard</span>
        </button>

        {/* Career Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-8 border border-green-100">
          <div className="flex items-start space-x-4">
            <div className="text-4xl">{department?.logo_url || '💼'}</div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-green-600 mb-1">
                {department?.code} - {department?.name}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                {career?.title}
              </h1>
              <p className="text-gray-600">{career?.description}</p>
            </div>
          </div>
        </div>

        {/* Interview Tips */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <Lightbulb className="text-yellow-500" size={32} />
            <h2 className="text-2xl font-bold text-gray-900">Interview Tips</h2>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
              <p className="mt-4 text-gray-600">Loading interview tips...</p>
            </div>
          ) : tips.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No interview tips available yet for this career.</p>
              <p className="text-sm mt-2">Check back later for updates!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {tips.map((tip, index) => (
                <div
                  key={tip.id}
                  className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200 hover:shadow-md transition"
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      {tip.category && (
                        <span className="inline-block px-3 py-1 bg-green-600 text-white text-xs font-semibold rounded-full mb-2">
                          {tip.category}
                        </span>
                      )}
                      <p className="text-gray-800 leading-relaxed">{tip.tip}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* General Tips (Fallback) */}
          {tips.length === 0 && !loading && (
            <div className="space-y-4 mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">General Interview Tips:</h3>
              {[
                { category: 'Preparation', tip: 'Research the company and role thoroughly before your interview' },
                { category: 'Practice', tip: 'Prepare answers to common interview questions and practice with a friend' },
                { category: 'Professional', tip: 'Dress appropriately and arrive 10-15 minutes early' },
                { category: 'Communication', tip: 'Maintain eye contact and speak clearly and confidently' },
                { category: 'Questions', tip: 'Prepare thoughtful questions to ask the interviewer' }
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200"
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <span className="inline-block px-3 py-1 bg-green-600 text-white text-xs font-semibold rounded-full mb-2">
                        {item.category}
                      </span>
                      <p className="text-gray-800 leading-relaxed">{item.tip}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl shadow-2xl p-8 text-center text-white">
          <FileEdit className="mx-auto mb-4" size={48} />
          <h3 className="text-2xl font-bold mb-3">Ready to Create Your Resume?</h3>
          <p className="mb-6 text-green-50">
            Now that you know what to expect, build a professional resume tailored for {career?.title}
          </p>
          <button
            onClick={handleCreateResume}
            className="px-8 py-4 bg-white text-green-600 text-lg rounded-xl font-semibold hover:bg-green-50 transition shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5"
          >
            Create Resume Now
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 border-t border-gray-200 mt-12">
        <div className="text-center text-gray-600 text-sm sm:text-base">
          <p>&copy; 2025 CareerPrep. Build your future with confidence.</p>
        </div>
      </footer>
    </div>
  );
}