'use client'

import {Avatar, Box, Container} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import React from "react";

export default function AuthLayout({children }: {children:React.ReactNode }) {
    return (
        <>
            <Box sx={{
                padding: 8,
                backgroundImage: `url(https://source.unsplash.com/random?wallpapers)`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundPosition: '50%',
                height: '100vh'
            }}>
                <Container component="main" maxWidth="xs"
                           sx={{
                               backgroundColor: '#fff',
                               borderStyle: 'solid',
                               borderWidth: '1px',
                               borderRadius: '8px',
                               borderColor: '#ddd #ddd #d8d8d8',
                               outline: 'none',
                               width: '400px'

                           }}>
                    <Box
                        sx={{
                            paddingX: 3,
                            paddingBottom: 1,
                            paddingTop: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'left',
                        }}
                    >
                        <Avatar sx={{m: 1, backgroundColor: 'secondary.main'}}>
                            <LockOutlinedIcon/>
                        </Avatar>
                    </Box>
                    {children}
                </Container>
            </Box>
        </>
    )
}