import React from 'react'
import { Toaster } from "react-hot-toast"
import { Routes, Route, Navigate } from "react-router-dom"
import LoginLanding from './pages/LoginLanding'
import Layout from './pages/Layout'
import Dashboard from './pages/Dashboard'
import Employees from './pages/Employees'
import Leave from './pages/Leave'
import PaySlips from './pages/PaySlips'
import Setting from './pages/Settings'
import PrintPayslip from './pages/PrintPayslip'
import LoginForm from './components/LoginForm'
import Attendance from './pages/Attendance'
import Approvals from './pages/Approvals'
import Overtime from './pages/Overtime'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'

const App = () => {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path='/login' element = {<LoginLanding/>}/>

        <Route path='/login/admin' element={<LoginForm role='admin' title='Admin Portal' subtitle='Sign in to manage the organization'/>}/>

        <Route path='/login/employee' element={<LoginForm role='employee' title='Employee Portal' subtitle='Sign in to access your account'/>}/>

        <Route path='/login/manager' element={<LoginForm role='manager' title='Manager Portal' subtitle='Sign in to manage your team approvals'/>}/>

        <Route path='/forgot-password' element={<ForgotPassword/>}/>
        <Route path='/reset-password' element={<ResetPassword/>}/>


        <Route element={<Layout/>}>
          <Route path='/dashboard' element = {<Dashboard/>}/>
          <Route path='/employees' element = {<Employees/>}/>
          <Route path='/attendence' element = {<Attendance/>}/>
          <Route path='/leave' element = {<Leave/>}/>
          <Route path='/payslips' element = {<PaySlips/>}/>
          <Route path='/approvals' element = {<Approvals/>}/>
          <Route path='/overtime' element = {<Overtime/>}/>
          <Route path='/settings' element = {<Setting/>}/>
        </Route>
        <Route path='/print/payslips/:id' element = {<PrintPayslip/>}/>
        <Route path='/*' element = {<Navigate to='/dashboard' replace/>}/>
      </Routes>
    </>
  )
}

export default App