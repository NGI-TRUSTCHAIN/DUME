import {IconButton} from "@mui/material";
import React from "react";
import {signIn} from "next-auth/react";
import {GoogleAccountIcon} from "@/components/svg";

// export default function GoogleSignIn(props: ComponentProperties) {
//     const handleClick = () => {
//         signIn(("google"))
//     }
//     return (
//         <IconButton sx={props.sx} onClick={handleClick}>
//             <GoogleAccountIcon/>
//         </IconButton>
//     )
// }

export default function GoogleSignIn() {
    const handleClick = () => {
        signIn(("google"))
    }
    return (
        <IconButton onClick={handleClick}>
            <GoogleAccountIcon/>
        </IconButton>
    )
}