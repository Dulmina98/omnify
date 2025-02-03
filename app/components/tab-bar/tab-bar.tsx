import {useState} from "react";

type Tab = {
    name: string;
};

type TabBarProps = {
    tabs: Tab[];
    initialActiveTab: string;
    onTabChange: (tabName: string) => void;
    vertical?: boolean
};

export function TabBar({tabs, initialActiveTab, onTabChange, vertical = false}: TabBarProps) {
    const [activeTab, setActiveTab] = useState(initialActiveTab);

    const handleTabClick = (tabName: string) => {
        setActiveTab(tabName);
        onTabChange(tabName);
    };

    return (
        <>
            <div className={`w-full flex relative z-10 ${vertical ? "flex-col" : "justify-center"}`}>
                <div
                    className={`flex  w-full shadow-md  overflow-x-auto scrollbar-hide ${vertical ? "flex-col space-y-5" : "flex-row space-x-[10px] h-[35px]"}`}>
                    {tabs.map((tab) => (
                        <div
                            key={tab.name}
                            onClick={() => handleTabClick(tab.name)}
                            className={`cursor-pointer ${vertical ? "text-left pb-5" : "text-center px-4 "} font-[16px] leading-[16px] transition ease-in-out ${
                                activeTab === tab.name
                                    ? 'text-theme-crimson font-bold border-b-2 border-theme-crimson'
                                    : 'text-[#C1C1C1] font-normal'
                            }`}
                        >
                            {tab.name}
                        </div>
                    ))}
                </div>
            </div>

            {!vertical && <div className="w-full flex justify-center relative z-0">
                <div className="w-full border-t border-[#212121] mt-[-2px]"></div>
            </div>}
        </>
    );
}