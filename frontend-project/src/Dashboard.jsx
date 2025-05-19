import React from 'react'
import Nav from './components/Nav'
import { Outlet } from 'react-router-dom'
import Footer from './components/Footer'

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EEAECA] to-[#94BBE9] flex flex-col">
      <Nav/>
      <main className="flex-grow">
        <Outlet/>
      </main>
      <Footer/>
    </div>
  )
}

export default Dashboard
