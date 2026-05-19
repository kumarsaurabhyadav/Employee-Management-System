import { Settings, PlayCircle } from 'lucide-react' // 🚀 PlayCircle add kiya
import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import CourseStats from '../components/learning/CourseStats'
import Courses from '../components/learning/Courses'
import CompleteCourses from '../components/learning/CompleteCourses'

const MyLearnings = () => {
  const { user } = useAuth();
  const role = user?.role ? user.role.toLowerCase() : 'employee';
  const pageTitle = role === 'manager' ? 'Team Learning' : 'My Learning';
  const settingsPath = role === 'manager' ? '/manager/courses/settings' : '/my-learning/settings';

  return (
    <div className="min-h-screen animate-fade-in">

            {/* 🚀 Header Section: Title and Settings aligned in one row */}
            <div className="flex items-start justify-between mb-8">
                <div>
                    <h1 className="page-title">
                        {pageTitle}
                    </h1>
                    <p className="page-subtitle mt-1">
                        Continue your professional development journey
                    </p>
                </div>

                {/* 🚀 Settings Button */}
                <Link
                    to={settingsPath}
                    className="btn-secondary flex items-center gap-2 px-4 py-2.5 mr-8"
                >
                    <Settings className="h-4 w-4  text-zinc-700" />
                    <span className="text-sm font-medium text-zinc-700">
                        Settings
                    </span>
                </Link>
            </div>
            
            <div className="min-h-screen animate-fade-in">
                {/* 🚀 Stats Cards Section uses real role from session */}
                <div className="mt-10">
                    <CourseStats role={role} />
                </div>

                {/* 🚀 Continue Learning Section: Fixed CSS */}
                <div className="mt-14">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 rounded-xl bg-zinc-900 text-white shadow-md">
                            <PlayCircle size={20} />
                        </div>
                        <h2 className="text-xl font-extrabold text-zinc-900 tracking-tight">
                            Continue Learning
                        </h2>
                    </div>
                    
                    {/* Horizontal Progress Cards */}
                    <div className="pr-8">
                        <Courses />
                    </div>
                </div>

                <div>
                    <CompleteCourses />
                </div>
            </div>
    </div>
  )
}

export default MyLearnings