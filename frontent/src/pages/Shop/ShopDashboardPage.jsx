import React from 'react'
import DashboardHeader from "../../components/Shop/Layout/DashboardHeader"
import DashboardSideBar from "../../components/Shop/Layout/DashboardSideBar"
import DashboardHero from '../../components/Shop/DashboardHero'

const ShopDashboardPage = () => {
  return (
    <div>
        <DashboardHeader />
        <div className="flex items-center justify-between w-full">
            <div className="w-[330px]">
                <DashboardSideBar active={1} />
            </div>
            <DashboardHero/>
        </div>
    </div>
  )
}

export default ShopDashboardPage