import {InputAdornment, SvgIcon, TextField} from "@mui/material";
import MagnifyingGlassIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon";
import React from "react";
import {SearchBarProps} from "@/utils/generic";

export const SearchBar: React.FC<SearchBarProps> = (props) => {

    return (
            <TextField
                id="input-with-icon-textfield"
                hiddenLabel
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SvgIcon fontSize="small">
                                <MagnifyingGlassIcon/>
                            </SvgIcon>
                        </InputAdornment>
                    ),
                }}
                variant="outlined"
                placeholder={props.placeholderText}
                sx={props.sx}
            />
    )
}
