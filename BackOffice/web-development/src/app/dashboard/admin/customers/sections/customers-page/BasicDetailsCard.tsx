import React from "react";
import {Card, CardActions, CardHeader, Divider, List, ListItem, ListItemText} from "@mui/material";
import Button from "@mui/material/Button";
import {formatDistanceToNow} from "date-fns";

type ProductsProps = {
    id: string,
    image: string,
    name: string,
    updatedAt: number
}

type OverviewProductsProps = {
    products: ProductsProps[],
    sx: object
}
export const CustomerDetailsCard: React.FC<OverviewProductsProps> = (props) => {

    const {products = [], sx} = props;

    return (
        <Card sx={sx}>
            <CardHeader title="Latest Products"/>
            <List>
                {products.map((product, index) => {
                    const hasDivider = index < products.length - 1;
                    const ago = formatDistanceToNow(product.updatedAt);

                    return (
                        <ListItem
                            divider={hasDivider}
                            key={product.id}
                        >

                            <ListItemText
                                primary={product.name}
                                primaryTypographyProps={{variant: 'subtitle1'}}
                                secondary={`Updated ${ago} ago`}
                                secondaryTypographyProps={{variant: 'body2'}}
                            />
                        </ListItem>
                    );
                })}
            </List>
            <Divider/>
            <CardActions sx={{justifyContent: 'flex-start'}}>
                <Button
                    color="inherit"
                    size="small"
                    variant="text"
                >
                    Reset Password
                </Button>
            </CardActions>
        </Card>
    )
}