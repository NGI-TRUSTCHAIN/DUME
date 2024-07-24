import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import {Avatar, AvatarGroup, IconButton, Stack, Typography} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import Grid from "@mui/material/Unstable_Grid2";
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';

type Anchor = 'top' | 'left' | 'bottom' | 'right';

export default function TemporaryDrawer() {
    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });

    const toggleDrawer =
        (anchor: Anchor, open: boolean) =>
            (event: React.KeyboardEvent | React.MouseEvent) => {
                if (
                    event.type === 'keydown' &&
                    ((event as React.KeyboardEvent).key === 'Tab' ||
                        (event as React.KeyboardEvent).key === 'Shift')
                ) {
                    return;
                }

                setState({ ...state, [anchor]: open });
            };

    const list = (anchor: Anchor) => (
        <Box
            sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 350 }}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <Stack direction={'row'} justifyContent={'flex-end'}  spacing={1} padding={3}>
                <IconButton aria-label="delete">
                    <StarOutlineIcon />
                </IconButton>
                <IconButton aria-label="delete">
                    <DeleteIcon />
                </IconButton>
            </Stack>
            <Divider/>
            <Box paddingY={3} paddingX={2}>
                <Box mb={2} padding={3} sx={{borderColor:'rgb(210, 214, 219)',
                borderRadius:'8px', borderStyle:'dashed', borderWidth:'1px', justifyContent:'center'}}>
                    <img src={'assets/icons/icon-folder.svg'} alt={''}/>
                </Box>
                <Stack alignItems={'center'} justifyContent={'space-between'} direction={'row'} mb={2}>
                    <Typography component={'h6'}>Video Details</Typography>
                    <IconButton aria-label="delete">
                        <EditIcon />
                    </IconButton>
                </Stack>
                <Grid container spacing={3}>
                    <Grid xs={12} md={4}>
                        <Typography component={'span'}>Created by</Typography>
                    </Grid>
                    <Grid xs={12} md={8}>
                        <Avatar alt="Remy Sharp" src={"assets/avatars/avatar-alcides-antonio.png"} />
                    </Grid>

                    <Grid xs={12} md={4}>
                        <Typography component={'span'}>Created At</Typography>
                    </Grid>
                    <Grid xs={12} md={8}>
                        <Typography component={'p'}>Sep 07, 2023 11:58</Typography>
                    </Grid>

                    <Grid xs={12} md={4}>
                        <Typography component={'span'}>Modified At</Typography>
                    </Grid>
                    <Grid xs={12} md={8}>
                        <Typography component={'p'}></Typography>
                    </Grid>

                    <Grid xs={12} md={4}>
                        <Typography component={'span'}>Tags</Typography>
                    </Grid>
                    <Grid xs={12} md={8}>
                        <Stack alignItems={'center'} gap={1}>
                            <Button variant="contained" endIcon={<ClearIcon/>}>
                                Trash
                            </Button>
                        </Stack>
                    </Grid>

                    <Grid xs={12} md={4}>
                        <Typography component={'span'}>Shared with</Typography>
                    </Grid>
                    <Grid xs={12} md={8}>
                        <AvatarGroup max={4}>
                            <Avatar alt="Remy Sharp" src={"assets/avatars/avatar-alcides-antonio.png"} />
                            <Avatar alt="Travis Howard" src={"assets/avatars/avatar-alcides-antonio.png"} />
                            <Avatar alt="Cindy Baker" src={"assets/avatars/avatar-alcides-antonio.png"} />
                        </AvatarGroup>
                    </Grid>

                    <Grid xs={12} md={4}>
                        <Typography component={'span'}>Status</Typography>
                    </Grid>
                    <Grid xs={12} md={8}>
                        <Stack spacing={1}>
                        <Typography component={'span'}>Not Uploaded</Typography>
                            {/*<LinearProgressWithLabel value={50}/>*/}
                        </Stack>
                    </Grid>

                    <Grid xs={12} md={4}>
                        <Typography component={'span'}>Actions</Typography>
                    </Grid>
                    <Grid xs={12} md={8}>
                        <Button variant="text" startIcon={<DeleteIcon />}>
                            Delete
                        </Button>
                    </Grid>

                </Grid>

            </Box>

        </Box>
    );

    return (
        <div>
            {(['left', 'right', 'top', 'bottom'] as const).map((anchor) => (
                <React.Fragment key={anchor}>
                    <Button onClick={toggleDrawer(anchor, true)}>{anchor}</Button>
                    <Drawer
                        anchor={anchor}
                        open={state[anchor]}
                        onClose={toggleDrawer(anchor, false)}
                    >
                        {list(anchor)}
                    </Drawer>
                </React.Fragment>
            ))}
        </div>
    );
}