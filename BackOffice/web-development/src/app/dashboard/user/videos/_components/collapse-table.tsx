'use client'

import {Box, Chip, Collapse, IconButton, Paper, Stack, Table, TableContainer, Typography} from "@mui/material";
import React from "react";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import NextLink from "next/link";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ReactPlayer from "react-player";

export type VideosTableProps = {
    sx: object,
    head: string,
    content: string,
}


// function Row(props: { row: ReturnType<typeof createData> }) {
//     const {row} = props;
//     const [open, setOpen] = React.useState(false);
//
//     return (
//         <>
//             <TableRow sx={{'& > *': {borderBottom: 'unset'}}}>
//                 <TableCell>
//                     <IconButton
//                         aria-label="expand row"
//                         size="small"
//                         onClick={() => setOpen(!open)}
//                     >
//                         {open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
//                     </IconButton>
//                 </TableCell>
//                 <TableCell component="th" scope="row">
//                     {row.name}
//                 </TableCell>
//                 <TableCell align="right">{row.calories}</TableCell>
//                 <TableCell align="right">{row.fat}</TableCell>
//                 <TableCell align="right">{row.carbs}</TableCell>
//                 <TableCell align="right">{row.protein}</TableCell>
//             </TableRow>
//             <TableRow>
//                 <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={6}>
//                     <Collapse in={open} timeout="auto" unmountOnExit>
//                         <Box sx={{margin: 1}}>
//                             <Typography variant="h6" gutterBottom component="div">
//                                 History
//                             </Typography>
//                             <Table size="small" aria-label="purchases">
//                                 <TableHead>
//                                     <TableRow>
//                                         <TableCell>Date</TableCell>
//                                         <TableCell>Customer</TableCell>
//                                         <TableCell align="right">Amount</TableCell>
//                                         <TableCell align="right">Total price ($)</TableCell>
//                                     </TableRow>
//                                 </TableHead>
//                                 <TableBody>
//                                     {row.history.map((historyRow) => (
//                                         <TableRow key={historyRow.date}>
//                                             <TableCell component="th" scope="row">
//                                                 {historyRow.date}
//                                             </TableCell>
//                                             <TableCell>{historyRow.customerId}</TableCell>
//                                             <TableCell align="right">{historyRow.amount}</TableCell>
//                                             <TableCell align="right">
//                                                 {Math.round(historyRow.amount * row.price * 100) / 100}
//                                             </TableCell>
//                                         </TableRow>
//                                     ))}
//                                 </TableBody>
//                             </Table>
//                         </Box>
//                     </Collapse>
//                 </TableCell>
//             </TableRow>
//         </>
//     );
// }


export function VideosTable(): React.JSX.Element {

    const [open, setOpen] = React.useState(false);

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell/>
                        <TableCell>Video</TableCell>
                        <TableCell>Date Start</TableCell>
                        <TableCell>Date End</TableCell>
                        <TableCell>Captured By</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell>
                            <IconButton
                                aria-label="expand row"
                                size="small"
                                onClick={() => setOpen(!open)}
                            >
                                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                            </IconButton>
                        </TableCell>
                        <TableCell component="th" scope="row">
                            <video
                                autoPlay
                                loop
                                muted
                                poster="https://assets.codepen.io/6093409/river.jpg"
                                width={'100px'}
                                height={'100px'}
                            >
                                <source
                                    src="https://assets.codepen.io/6093409/river.mp4"
                                    type="video/mp4"
                                />
                            </video>
                        </TableCell>

                        <TableCell>
                            21-05-23<br/>12:56:45
                        </TableCell>
                        <TableCell>
                            21-05-23<br/>13:56:45
                        </TableCell>
                        <TableCell>
                            Alcides
                        </TableCell>
                        <TableCell>
                            <Chip color={'warning'} label={"Partial Uploaded"}/>
                        </TableCell>
                        <TableCell>
                            <Stack direction={'row'} spacing={1}
                                   alignItems={'center'}>
                                <IconButton component={NextLink}
                                            href="/admin/customerEdit">
                                    <EditIcon/>
                                </IconButton>

                                <IconButton aria-label="delete" color={'error'}>
                                    <DeleteIcon/>
                                </IconButton>

                                <IconButton component={NextLink}
                                            href={"/users/videos/:videoId"}>
                                    <VisibilityIcon/>
                                </IconButton>
                            </Stack>
                        </TableCell>
                    </TableRow>
                        <TableRow>
                            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                <Collapse in={open} timeout="auto" unmountOnExit>
                                    <Box sx={{ margin: 1 }}>
                                        <Typography variant="h6" gutterBottom component="div">
                                            Details
                                        </Typography>
                                        <Table size="small" aria-label="purchases">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Duration</TableCell>
                                                    <TableCell>Total Frames</TableCell>
                                                    <TableCell align="right">FPS</TableCell>
                                                    <TableCell align="right">Frames Received</TableCell>
                                                    <TableCell align="right">total distance</TableCell>
                                                    <TableCell align="right">Started at</TableCell>
                                                    <TableCell align="right">Finished at</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell>21 min</TableCell>
                                                    <TableCell>56</TableCell>
                                                    <TableCell align="right">3</TableCell>
                                                    <TableCell align="right">42</TableCell>
                                                    <TableCell align="right">23.5 km</TableCell>
                                                    <TableCell align="right">rua x </TableCell>
                                                    <TableCell align="right">rua y</TableCell>
                                                </TableRow>
                                            {/*    {row.history.map((historyRow) => (*/}
                                            {/*        <TableRow key={historyRow.date}>*/}
                                            {/*            <TableCell component="th" scope="row">*/}
                                            {/*                {historyRow.date}*/}
                                            {/*            </TableCell>*/}
                                            {/*            <TableCell>{historyRow.customerId}</TableCell>*/}
                                            {/*            <TableCell align="right">{historyRow.amount}</TableCell>*/}
                                            {/*            <TableCell align="right">*/}
                                            {/*                {Math.round(historyRow.amount * row.price * 100) / 100}*/}
                                            {/*            </TableCell>*/}
                                            {/*        </TableRow>*/}
                                            {/*    ))}*/}
                                            {/*    <ReactPlayer width={'100%'} height='100%' playing={true}*/}
                                            {/*                 muted={true} url="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"/>*/}
                                            </TableBody>
                                        </Table>
                                    </Box>
                                </Collapse>
                            </TableCell>
                        </TableRow>

                </TableBody>
            </Table>
        </TableContainer>
    )
}