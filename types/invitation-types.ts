import {Id} from "@/convex/_generated/dataModel";

export interface InvitationTypes {
    _id: Id<"tournamentEntries">
    _creationTime
        :
        number
    status: string
    userId: string
    tournamentId: string
}