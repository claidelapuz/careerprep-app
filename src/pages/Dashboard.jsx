import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../lib/supabase';

// Hardcoded departments with courses and careers
const DEPARTMENTS = [
  {
    id: 'ccs',
    code: 'CCS',
    name: 'College of Computer Studies',
    description: 'Information Technology and Computer Science',
    logo_url: '/ccs-logo.png',
    courses: [
      {
        id: 'bsit',
        title: 'Bachelor of Science in Information Technology',
        code: 'BSIT',
        careers: [
          { id: 'web-dev', title: 'Web Developer', description: 'Build and maintain websites', tipLink: '' },
          { id: 'sys-admin', title: 'System Administrator', description: 'Manage IT infrastructure', tipLink: '' },
          { id: 'db-admin', title: 'Database Administrator', description: 'Manage databases', tipLink: '' }
        ]
      },
      {
        id: 'bscs',
        title: 'Bachelor of Science in Computer Science',
        code: 'BSCS',
        careers: [
          { id: 'software-eng', title: 'Software Engineer', description: 'Design and develop software', tipLink: '' },
          { id: 'data-scientist', title: 'Data Scientist', description: 'Analyze and interpret data', tipLink: '' },
          { id: 'ai-engineer', title: 'AI Engineer', description: 'Develop AI solutions', tipLink: '' }
        ]
      }
    ]
  },
  {
    id: 'coe',
    code: 'COE',
    name: 'College of Engineering',
    description: 'Engineering Programs',
    logo_url: '/coe-logo.png',
    courses: [
      {
        id: 'bsce',
        title: 'Bachelor of Science in Civil Engineering',
        code: 'BSCE',
        careers: [
          { id: 'civil-eng', title: 'Civil Engineer', description: 'Design infrastructure projects', tipLink: '' },
          { id: 'structural-eng', title: 'Structural Engineer', description: 'Design building structures', tipLink: '' }
        ]
      },
      {
        id: 'bsee',
        title: 'Bachelor of Science in Electrical Engineering',
        code: 'BSEE',
        careers: [
          { id: 'electrical-eng', title: 'Electrical Engineer', description: 'Design electrical systems', tipLink: '' },
          { id: 'power-eng', title: 'Power Systems Engineer', description: 'Work with power distribution', tipLink: '' }
        ]
      }
    ]
  },
  {
    id: 'cba',
    code: 'CBA',
    name: 'College of Business Administration',
    description: 'Business and Management',
    logo_url: '/cba-logo.png',
    courses: [
      {
        id: 'bsba',
        title: 'Bachelor of Science in Business Administration',
        code: 'BSBA',
        careers: [
          { id: 'manager', title: 'Business Manager', description: 'Oversee business operations', tipLink: '' },
          { id: 'marketing', title: 'Marketing Specialist', description: 'Develop marketing strategies', tipLink: '' }
        ]
      },
      {
        id: 'bsa',
        title: 'Bachelor of Science in Accountancy',
        code: 'BSA',
        careers: [
          { id: 'accountant', title: 'Accountant', description: 'Manage financial records', tipLink: '' },
          { id: 'auditor', title: 'Auditor', description: 'Review financial statements', tipLink: '' }
        ]
      }
    ]
  },
  {
    id: 'coed',
    code: 'COED',
    name: 'College of Education',
    description: 'Teacher Education Programs',
    logo_url: '/ced-logo.png',
    courses: [
      {
        id: 'beed',
        title: 'Bachelor of Elementary Education',
        code: 'BEED',
        careers: [
          { id: 'elem-teacher', title: 'Elementary Teacher', description: 'Teach primary students', tipLink: '' },
          { id: 'curriculum-dev', title: 'Curriculum Developer', description: 'Design educational materials', tipLink: '' }
        ]
      },
      {
        id: 'bsed',
        title: 'Bachelor of Secondary Education',
        code: 'BSED',
        careers: [
          { id: 'hs-teacher', title: 'High School Teacher', description: 'Teach secondary students', tipLink: '' },
          { id: 'guidance', title: 'Guidance Counselor', description: 'Provide student counseling', tipLink: '' }
        ]
      }
    ]
  },
  {
    id: 'ccrim',
    code: 'CCrim',
    name: 'College of Criminology',
    description: 'Criminology and Law Enforcement',
    logo_url: '/coc-logo.png',
    courses: [
      {
        id: 'bscrim',
        title: 'Bachelor of Science in Criminology',
        code: 'BS Criminology',
        careers: [
          { id: 'police-officer', title: 'Police Officer', description: 'Law enforcement and public safety', tipLink: '' },
          { id: 'forensic-investigator', title: 'Forensic Investigator', description: 'Crime scene investigation', tipLink: '' },
          { id: 'security-manager', title: 'Security Manager', description: 'Corporate security management', tipLink: '' }
        ]
      }
    ]
  },
  {
    id: 'cas',
    code: 'CAS',
    name: 'College of Arts and Sciences',
    description: 'Liberal Arts and Sciences',
    logo_url: '/cas-logo.png',
    courses: [
      {
        id: 'bspsych',
        title: 'Bachelor of Science in Psychology',
        code: 'BS Psychology',
        careers: [
          { id: 'psychologist', title: 'Psychologist', description: 'Provide mental health services', tipLink: '' },
          { id: 'hr-specialist', title: 'HR Specialist', description: 'Human resource management', tipLink: '' }
        ]
      },
      {
        id: 'bsbio',
        title: 'Bachelor of Science in Biology',
        code: 'BS Biology',
        careers: [
          { id: 'biologist', title: 'Biologist', description: 'Research living organisms', tipLink: '' },
          { id: 'lab-tech', title: 'Laboratory Technician', description: 'Conduct lab analyses', tipLink: '' }
        ]
      }
    ]
  }
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [careerTipLinks, setCareerTipLinks] = useState({});

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/');
    } else {
      setUser(user);
    }
  };

  const handleDepartmentClick = (department) => {
    setSelectedDepartment(department);
    setSelectedCourse(null);
  };

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
  };

  const handleTipLinkChange = (careerId, value) => {
    setCareerTipLinks(prev => ({
      ...prev,
      [careerId]: value
    }));
  };

  const handleViewTips = (career) => {
    const tipLink = careerTipLinks[career.id] || career.tipLink;
    if (tipLink) {
      window.open(tipLink, '_blank');
    } else {
      alert('Please add a tip link for this career first!');
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleCreateResume = () => {
    navigate('/resume-builder');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-100 to-green-50">
      {/* Header */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
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

            {/* Desktop Menu */}
            <div className="hidden sm:flex items-center space-x-4">
              <span className="text-gray-600 text-sm">
                {user?.email}
              </span>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition shadow-lg"
              >
                <span>🚪</span>
                <span>Sign Out</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden p-2 text-gray-700"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="sm:hidden mt-4 pb-4 space-y-3 border-t pt-4">
              <div className="text-gray-600 text-sm px-4">{user?.email}</div>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 w-full px-4 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition"
              >
                <span>🚪</span>
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Welcome back! 👋
          </h1>
          <p className="text-gray-600">Build your professional resume and prepare for interviews</p>
        </div>

        {/* Sample Resume Preview - Professional Bond Paper Style */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Sample Resume Preview</h2>
            <span className="text-sm text-gray-500 bg-yellow-50 px-4 py-2 rounded-full border border-yellow-200">
              📄Format Guide
            </span>
          </div>
          
          {/* Resume Paper Container */}
          <div className="bg-gray-800 shadow-2xl rounded-lg overflow-hidden border border-gray-700 max-w-4xl mx-auto">
            {/* A4 Paper Size Simulation */}
            <div className="bg-gray-800" style={{ aspectRatio: '210/297' }}>
              {/* Two Column Layout */}
              <div className="flex h-full">
                {/* Left Sidebar - Dark Gray */}
                <div className="w-1/3 bg-gray-800 text-white p-8">
                  {/* Profile Photo */}
                  <div className="mb-6">
                    <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-gray-500 shadow-lg bg-gray-800 flex items-center justify-center">
                      <span className="text-6xl">👤</span>
                    </div>
                  </div>

                  {/* Contact Section */}
                  <div className="mb-8">
                    <h3 className="text-lg font-bold mb-4 pb-2 border-b-2 border-gray-500">CONTACT</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-2">
                        <span className="text-gray-400 mt-1">📧</span>
                        <span className="break-all">john.doe@email.com</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-gray-400 mt-1">📱</span>
                        <span>+63 9912 345 6789</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-gray-400 mt-1">📍</span>
                        <span>Iligan City, Philippines 9200</span>
                      </div>
                    </div>
                  </div>

                  {/* Skills Section */}
                  <div className="mb-8">
                    <h3 className="text-lg font-bold mb-4 pb-2 border-b-2 border-gray-500">SKILLS</h3>
                    <div className="space-y-3">
                      {['JavaScript', 'React', 'Node.js', 'Python', 'SQL'].map((skill) => (
                        <div key={skill}>
                          <div className="text-sm mb-1">{skill}</div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div className="bg-gray-400 h-2 rounded-full" style={{ width: '85%' }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Education Section */}
                  <div className="mb-6">
                    <h3 className="text-lg font-bold mb-4 pb-2 border-b-2 border-gray-500">EDUCATION</h3>
                    <div className="space-y-4 text-sm">
                      <div>
                        <p className="font-bold text-gray-300">2014-2018</p>
                        <p className="font-semibold">Bachelor of Science in Information Technology (BSIT)</p>
                        <p className="text-xs text-gray-500 mt-1">St. Peter's College</p>
                      </div>
                    </div>
                  </div>

                  {/* Interests */}
                  <div>
                    <h3 className="text-lg font-bold mb-3 pb-2 border-b-2 border-gray-500">INTERESTS</h3>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="bg-gray-700 px-2 py-1 rounded">🎨 Design</span>
                      <span className="bg-gray-700 px-2 py-1 rounded">📚 Reading</span>
                      <span className="bg-gray-700 px-2 py-1 rounded">🏃 Running</span>
                      <span className="bg-gray-700 px-2 py-1 rounded">📷 Photography</span>
                    </div>
                  </div>
                </div>

                {/* Right Main Content */}
                <div className="flex-1 p-8 bg-white">
                  {/* Header */}
                  <div className="mb-6">
                    <h1 className="text-4xl font-bold text-gray-900 mb-1">JOHN MICHAEL</h1>
                    <h2 className="text-2xl font-bold text-gray-700">DOE</h2>
                  </div>

                  {/* Professional Summary */}
                  <div className="mb-6">
                    <div className="flex items-center mb-3">
                      <div className="bg-gray-200 text-gray-900 px-4 py-1 rounded-sm text-sm font-bold uppercase">
                        PROFESSIONAL SUMMARY
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      Highly creative and multi-talented Graphic Designer with extensive experience in print design, multimedia design. Exceptional collaborative and interpersonal skills with proven ability to work with diverse teams.
                    </p>
                  </div>

                  {/* Work Experience */}
                  <div className="mb-6">
                    <div className="flex items-center mb-3">
                      <div className="bg-gray-200 text-gray-900 px-4 py-1 rounded-sm text-sm font-bold uppercase">
                        WORK EXPERIENCE
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-start mb-1">
                          <div>
                            <h3 className="font-bold text-gray-900">Senior Software Developer</h3>
                            <p className="text-sm text-gray-600">Tech Corp Inc.</p>
                          </div>
                          <span className="text-xs font-semibold text-white bg-gray-700 px-3 py-1 rounded-sm">
                            2020 - Present
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed mt-2">
                          Led development of cloud-based applications serving 100K+ users. Managed team of 5 developers and implemented CI/CD pipelines. Improved application performance by 40%.
                        </p>
                      </div>

                      <div>
                        <div className="flex justify-between items-start mb-1">
                          <div>
                            <h3 className="font-bold text-gray-900">Software Developer</h3>
                            <p className="text-sm text-gray-600">StartUp Solutions</p>
                          </div>
                          <span className="text-xs font-semibold text-white bg-gray-700 px-3 py-1 rounded-sm">
                            2018 - 2020
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed mt-2">
                          Developed and maintained web applications using React and Node.js. Collaborated with designers to implement responsive UI components.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* References */}
                  <div>
                    <div className="flex items-center mb-3">
                      <div className="bg-gray-200 text-gray-900 px-4 py-1 rounded-sm text-sm font-bold uppercase">
                        REFERENCES
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <p className="font-bold text-gray-900">Dr. Sarah Johnson</p>
                        <p className="text-gray-600">Professor</p>
                        <p className="text-gray-700">sarah.j@university.edu</p>
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">Mark Williams</p>
                        <p className="text-gray-600">Senior Manager</p>
                        <p className="text-gray-700">m.williams@techcorp.com</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-8 text-center bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-3">Ready to Build Your Own?</h3>
            <p className="text-green-50 mb-6">Create your professional resume using this format with your own information</p>
            <button
              onClick={handleCreateResume}
              className="px-8 py-4 bg-white text-green-600 text-lg rounded-xl font-semibold hover:bg-green-50 transition shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5"
            >
              Create Your Own Resume
            </button>
          </div>
        </div>

        {/* Departments Section */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            Interview Tips by Department
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {DEPARTMENTS.map((dept) => (
              <button
                key={dept.id}
                onClick={() => handleDepartmentClick(dept)}
                className={`bg-white rounded-2xl shadow-lg p-4 hover:shadow-xl transition transform hover:-translate-y-1 border-2 ${
                  selectedDepartment?.id === dept.id
                    ? 'border-green-500 ring-2 ring-green-200'
                    : 'border-transparent'
                }`}
              >
                <div className="flex items-center justify-center mb-3">
                  <img 
                    src={dept.logo_url} 
                    alt={dept.name}
                    className="w-20 h-20 object-contain"
                    onError={(e) => {
                      e.target.src = '/logo.jpg';
                    }}
                  />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1 text-center">{dept.code}</h3>
                <p className="text-xs text-gray-600 text-center line-clamp-2">{dept.name}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Courses Section */}
        {selectedDepartment && (
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-8">
            <div className="flex items-center mb-6">
              <img 
                src={selectedDepartment.logo_url} 
                alt={selectedDepartment.name}
                className="w-16 h-16 object-contain mr-4"
                onError={(e) => {
                  e.target.src = '/logo.jpg';
                }}
              />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedDepartment.code} - Courses
                </h2>
                <p className="text-gray-600 text-sm">{selectedDepartment.name}</p>
              </div>
            </div>

            <p className="text-gray-600 mb-6">
              Select a course to view career interview tips:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {selectedDepartment.courses.map((course) => (
                <button
                  key={course.id}
                  onClick={() => handleCourseClick(course)}
                  className={`text-left bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 hover:from-blue-100 hover:to-blue-200 transition shadow-md hover:shadow-lg border-2 ${
                    selectedCourse?.id === course.id
                      ? 'border-blue-500 ring-2 ring-blue-200'
                      : 'border-blue-200'
                  }`}
                >
                  <h3 className="font-bold text-gray-900 text-lg mb-2">
                    {course.code}
                  </h3>
                  <p className="text-sm text-gray-600">{course.title}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Careers Section */}
        {selectedCourse && (
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {selectedCourse.code} - Career Interview Tips
            </h2>
            <p className="text-gray-600 mb-6">
              Add tip links for each career and click "View Tips" to open them:
            </p>

            <div className="space-y-4">
              {selectedCourse.careers.map((career, index) => (
                <div
                  key={career.id}
                  className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border border-green-200"
                >
                  <div className="flex items-start gap-4 mb-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-1">
                        {career.title}
                      </h3>
                      <p className="text-sm text-gray-600">{career.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 ml-14">
                    <input
                      type="url"
                      placeholder="Enter tip link (e.g., https://example.com/tips)"
                      value={careerTipLinks[career.id] || career.tipLink}
                      onChange={(e) => handleTipLinkChange(career.id, e.target.value)}
                      className="flex-1 px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                    />
                    <button
                      onClick={() => handleViewTips(career)}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition shadow-md"
                    >
                      View Tips →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
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