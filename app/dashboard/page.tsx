"use client";

import {TabBar} from "@/app/components/tab-bar/tab-bar";
import {useState} from "react";
import {AccountDetails} from "@/app/dashboard/components/account-details";
import {Dashboard} from "@/app/dashboard/components/dashboard";
import Transactions from "@/app/dashboard/components/transactions";

const tabs = [
    {name: "Dashboard"},
    {name: "Transactions"},
    {name: "Account details"},
];

export default function Player() {
    const [activeTab, setActiveTab] = useState("Dashboard");

    return (
        <div className="w-full bg-[url(/assets/images/bg/general-bg-2.jpg)] bg-cover bg-no-repeat">
            <div
                className={"max-w-[1800px] w-full px-[25px] lg:px-[100px] relative z-10 py-[150px] min-h-[calc(100vh-556px)] mx-auto"}>
                <h2
                    className="text-[40px] text-center pb-10 text-white w-full muted-gray">Dashboard</h2>
                <div className={"w-full"}>
                    <TabBar
                        tabs={tabs}
                        initialActiveTab="Dashboard"
                        onTabChange={(tabName) => setActiveTab(tabName)}
                    />
                    <div className={"w-full pt-6 pb-[100px]"}>
                        {activeTab === "Dashboard" && <Dashboard/>}
                        {activeTab === "Transactions" && <Transactions/>}
                        {activeTab === "Account details" && <AccountDetails/>}
                    </div>
                </div>
            </div>
        </div>
    )
}