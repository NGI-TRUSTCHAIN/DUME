import {Button, Card, CardContent, CardHeader, Typography} from "@mui/material"
import React from "react";

export const CustomerDeleteAccountCard = () => {
    return (
        <Card>
            <CardHeader title="Data Management"/>
            <CardContent>
                <Button variant="outlined" color="error">
                    Delete Account
                </Button>
                <Typography variant="body2" sx={{mt:1}}>
                    Remove this customer’s chart if he requested that, if not please be aware that what has been deleted can never brought back
                </Typography>
            </CardContent>
        </Card>

    )
}