import { UserDetails } from "@/app/provider";
import { createContext } from "react";




export const UserDetailsContext = createContext<UserDetails>({
    name: "",
    email: "",
    credits: 0,
});