import {useState} from "react";

type Tab = {
    name: string;
};

type TabBarProps = {
    tabs: Tab[];
    initialActiveTab: string;
};

function TabBar({tabs, initialActiveTab}: TabBarProps) {
    const [activeTab, setActiveTab] = useState(initialActiveTab);

    return (
        <>
            <div className="w-full flex justify-center mt-[65px] relative z-10">
                <div className="flex space-x-[10px] w-full shadow-md h-[35px] overflow-x-auto scrollbar-hide">
                    {tabs.map((tab) => (
                        <div
                            key={tab.name}
                            onClick={() => setActiveTab(tab.name)}
                            className={`cursor-pointer text-center px-4 font-[16px] leading-[16px] transition ease-in-out ${
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

            <div className="w-full flex justify-center relative z-0">
                <div className="w-full border-t border-[#212121] mt-[-2px]"></div>
            </div>
        </>
    );
}

export default TabBar;