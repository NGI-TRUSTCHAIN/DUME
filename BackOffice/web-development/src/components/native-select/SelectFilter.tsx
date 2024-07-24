import {FormControl, InputLabel, NativeSelect} from "@mui/material";

export const SelectFilter = () => {
    return (
        <FormControl>
            <InputLabel variant="standard" htmlFor="uncontrolled-native">
                Sort By
            </InputLabel>
            <NativeSelect
                defaultValue={30}
                inputProps={{
                    name: 'Sort By',
                    id: 'uncontrolled-native',
                }}
            >
                <option value={10}>Last Update (newest)</option>
                <option value={20}>Last Update (oldest)</option>
                <option value={30}>Total orders (highest)</option>
                <option value={30}>Total orders (lowest)</option>
            </NativeSelect>
        </FormControl>)
}