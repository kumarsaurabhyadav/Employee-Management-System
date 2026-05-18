import React, { Suspense, lazy } from 'react'
import { Toaster } from "react-hot-toast"
import { Routes, Route, Navigate } from "react-router-dom"

import HomePage from './pages/HomePage'
import LoginLanding from './pages/LoginLanding'

const Layout = lazy(() => import('./pages/Layout'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Employees = lazy(() => import('./pages/Employees'))
const Leave = lazy(() => import('./pages/Leave'))
const PaySlips = lazy(() => import('./pages/PaySlips'))
const Setting = lazy(() => import('./pages/Settings'))
const PrintPayslip = lazy(() => import('./pages/PrintPayslip'))
const LoginForm = lazy(() => import('./components/LoginForm'))
const Attendance = lazy(() => import('./pages/Attendance'))
const Approvals = lazy(() => import('./pages/Approvals'))
const Overtime = lazy(() => import('./pages/Overtime'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const ResetPassword = lazy(() => import('./pages/ResetPassword'))

const App = () => {
  return (
    <>
      <Toaster />
      {/* Fallback ko black rakha hai taaki agar load ho bhi toh jhatka na lage */}
      <Suspense fallback={<div className="min-h-screen bg-black" />}>
        <Routes>
          {/* Landing Pages */}
          <Route path='/' element={<HomePage/>} />
          <Route path='/landing' element={<HomePage/>} />
          <Route path='/login' element={<LoginLanding/>}/>

          {/* Auth Routes */}
          <Route path='/login/admin' element={<LoginForm role='admin' title='Admin Portal' subtitle='Sign in to manage the organization'/>}/>
          <Route path='/login/employee' element={<LoginForm role='employee' title='Employee Portal' subtitle='Sign in to access your account'/>}/>
          <Route path='/login/manager' element={<LoginForm role='manager' title='Manager Portal' subtitle='Sign in to manage your team approvals'/>}/>

          <Route path='/forgot-password' element={<ForgotPassword/>}/>
          <Route path='/reset-password' element={<ResetPassword/>}/>

          {/* Protected Dashboard Routes */}
          <Route element={<Layout/>}>
            <Route path='/dashboard' element={<Dashboard/>}/>
            <Route path='/employees' element={<Employees/>}/>
            <Route path='/attendence' element={<Attendance/>}/>
            <Route path='/leave' element={<Leave/>}/>
            <Route path='/payslips' element={<PaySlips/>}/>
            <Route path='/approvals' element={<Approvals/>}/>
            <Route path='/overtime' element={<Overtime/>}/>
            <Route path='/settings' element={<Setting/>}/>
          </Route>

          <Route path='/print/payslips/:id' element={<PrintPayslip/>}/>
          <Route path='/*' element={<Navigate to='/' replace/>}/>
        </Routes>
      </Suspense>
    </>
  )
}

export default App