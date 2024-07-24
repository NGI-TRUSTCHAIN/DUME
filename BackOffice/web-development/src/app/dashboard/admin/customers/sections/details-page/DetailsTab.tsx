import Grid from "@mui/system/Unstable_Grid";
import {
    CustomerDeleteAccountCard,
    CustomerDetailsCard,
    CustomerEmailCard,
    CustomerPaymentCard
} from "@/sections/customers-page";
import {Stack} from "@mui/material";
import React from "react";
import {subDays, subHours} from "date-fns";

const now = new Date();

const products = [
    {
        id: '5ece2c077e39da27658aa8a9',
        image: '/assets/products/product-1.png',
        name: 'Plan A',
        updatedAt: subHours(now, 6).getTime()
    },
    {
        id: '5ece2c0d16f70bff2cf86cd8',
        image: '/assets/products/product-2.png',
        name: 'Plan B',
        updatedAt: subDays(subHours(now, 8), 2).getTime()
    },
    {
        id: 'b393ce1b09c1254c3a92c827',
        image: '/assets/products/product-5.png',
        name: 'Plan C',
        updatedAt: subDays(subHours(now, 1), 1).getTime()
    },
    {
        id: 'a6ede15670da63f49f752c89',
        image: '/assets/products/product-6.png',
        name: 'Plan D',
        updatedAt: subDays(subHours(now, 3), 3).getTime()
    },
    {
        id: 'bcad5524fe3a2f8f8620ceda',
        image: '/assets/products/product-7.png',
        name: 'Plan E',
        updatedAt: subDays(subHours(now, 5), 6).getTime()
    }
]
export const DetailsTab = () => {
    return (
        <Grid container spacing={2}>
            <Grid xs={12} lg={4}>
                <CustomerDetailsCard
                    products={products}
                    sx={{ minWidth: 275 }}
                />
            </Grid>
            <Grid xs={12} lg={8}>
                <Stack spacing={2}>
                    <CustomerPaymentCard products={products}
                                         sx={{ height: '100%' }}/>

                    <CustomerEmailCard products={products}
                                       sx={{ height: '100%' }}/>

                    <CustomerDeleteAccountCard/>
                </Stack>

            </Grid>
        </Grid>
    )
}