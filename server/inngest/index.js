import { Inngest } from "inngest";
import userModel from "../models/user.model";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "postly" });

// Inngest function to save user of clerk data to a database
const syncUserCreation = inngest.createFunction(
    {id: "sync-user-from-clerk"},
    {event: "clerk/user.created"},
    async ({event})=> {
        const {id, first_name, last_name, email_addresses, image_url} = event.data
        const email = email_addresses[0].email_address
        let username = email.split("@")[0]
        const user = await userModel.findOne({username})

        if(user) username = username + Math.floor(Math.random() * 10000)
        
        const userData = {
            _id:id,
            email,
            username,
            full_name: first_name + ' ' + last_name,
            profile_picture: image_url
        }
        await user.create(userData)
    }
)

// Inngest function to update user of clerk data to a database
const syncUserUpdation = inngest.createFunction(
    {id: "update-user-from-clerk"},
    {event: "clerk/user.update"},
    async ({event})=> {
        const {id, first_name, last_name, email_addresses, image_url} = event.data
        const email = email_addresses[0].email_address

        const updatedUserData = {
            email,
            username,
            full_name: first_name + ' ' + last_name,
            profile_picture: image_url
        }
        await user.findByIdAndUpdate(id, updatedUserData)
    }
)

// Inngest function to update user of clerk data to a database
const syncUserDeletion = inngest.createFunction(
    {id: "delete-user-from-clerk"},
    {event: "clerk/user.deleted"},
    async ({event})=> {
        await user.findByIdAndDelete(event.data.id)
    }
)

export const functions = [
    syncUserCreation,
    syncUserUpdation,
    syncUserDeletion,
];