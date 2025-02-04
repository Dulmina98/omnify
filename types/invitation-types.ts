import {Id} from "@/convex/_generated/dataModel";

export interface InvitationTypes {
    _id: Id<"tournamentInvitations">
    _creationTime
        :
        number
    status: string
    userId: string
    tournamentId: string
}