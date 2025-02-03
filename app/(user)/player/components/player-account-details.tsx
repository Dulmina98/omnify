"use client";

import {useCurrentUser} from "@/services/user-service";
import {isPlayer} from "@/utils/user-util";
import {Input} from "@/components/ui/input";

export const PlayerAccountDetails = () => {
    const {user} = useCurrentUser();

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="text-white shadow-md rounded-lg mt-5">
            <div className="space-y-5">
                <InfoField label="User ID" value={user.userId}/>
                <div className={"flex gap-x-5 w-full"}>
                    <div className={"flex-1"}>
                        <InfoField label="First Name" value={user.firstName}/>
                    </div>
                    <div className={"flex-1"}>
                        <InfoField label="Last Name" value={user.lastName}/>
                    </div>

                </div>
                <InfoField label="Mobile Number" value={user.mobileNum}/>
                <InfoField label="Email" value={user.email}/>

                {isPlayer(user) && (
                    <>
                        <div className={"flex gap-x-5 w-full"}>
                            <div className={"flex-1"}>
                                <InfoField label="In-Game Name (IGN)" value={user.ign}/>
                            </div>
                            <div className={"flex-1"}>
                                <InfoField label="Level" value={user.level}/>
                            </div>
                        </div>
                        <div className={"flex gap-x-5 w-full"}>
                            <div className={"flex-1"}>
                                <InfoField label="Game" value={user.game}/>
                            </div>
                            <div className={"flex-1"}>
                                <InfoField label="Platform" value={user.platform}/>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

// Reusable InfoField component
const InfoField = ({label, value}: { label: string; value?: string | number }) => (
    <div>
        <label className="block text-[16px] font-semibold w-full">{label}</label>
        <Input className={"h-[46px] mt-3 w-full"} defaultValue={value} disabled={true}/>
    </div>
);
