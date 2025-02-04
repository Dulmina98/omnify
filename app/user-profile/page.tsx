"use client";

import {TabBar} from "@/app/components/tab-bar/tab-bar";
import {useState} from "react";
import {AccountDetails} from "@/app/user-profile/components/account-details";
import {Dashboard} from "@/app/user-profile/components/dashboard";

const tabs = [
    {name: "Dashboard"},
    {name: "Account details"},
];

export default function Player() {
    const [activeTab, setActiveTab] = useState("Dashboard");

    return (
        <div
            className={"max-w-[1800px] w-full px-[25px] lg:px-[100px] relative z-10 py-[150px] min-h-[calc(100vh-556px)] mx-auto"}>
            <div className={"w-full flex gap-x-8"}>
                <div className={"w-[250px] border-r-2 border-r-muted-gray pr-5"}>
                    <TabBar
                        tabs={tabs}
                        initialActiveTab="Dashboard"
                        onTabChange={(tabName) => setActiveTab(tabName)}
                        vertical={true}
                    />
                </div>
                <div className={"w-full"}>
                    {activeTab === "Dashboard" && <><h2
                        className="text-[40px] mb-6 text-white w-full pb-2 border-b-2 border-b-muted-gray">Dashboard</h2>
                        <Dashboard/>
                    </>
                    }
                    {activeTab === "Account details" && <><h2
                        className="text-[40px] mb-6 text-white w-full pb-2 border-b-2 border-b-muted-gray">Account
                        Details</h2>
                        <AccountDetails/></>}
                </div>
            </div>
        </div>
    )
}