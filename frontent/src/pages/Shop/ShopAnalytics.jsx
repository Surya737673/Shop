import React from "react";
import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";
import DashboardSideBar from "../../components/Shop/Layout/DashboardSideBar";
import Analytics from "../../components/Shop/Analytics";

const ShopAnalytics = () => {
    return (
        <div>
            <DashboardHeader />
            <div className="flex items-start justify-between w-full">
                <div className="w-[80px] 800px:w-[330px]">
                    <DashboardSideBar active={12} />
                </div>
                <div className="w-full justify-center flex">
                    <Analytics />
                </div>
            </div>
        </div>
    );
};

export default ShopAnalytics;
