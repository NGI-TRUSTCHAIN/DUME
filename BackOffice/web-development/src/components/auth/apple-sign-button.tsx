import {signIn} from "next-auth/react";
import {IconButton} from "@mui/material";
import React from "react";
import {AppleAccountIcon} from "@/components/svg";

// export default function AppleSignIn(props: ComponentProperties) {
//     const handleClick = () => {
//         signIn(("apple"))
//     }
//     return (
//         <IconButton sx={props.sx} onClick={handleClick}>
//             <AppleAccountIcon/>
//         </IconButton>
//     )
// }

export default function AppleSignIn() {
    const handleClick = () => {
        signIn(("apple"))
    }
    return (
        <IconButton onClick={handleClick}>
            <AppleAccountIcon/>
        </IconButton>
    )
}