import {TablePagination} from "@mui/material";
import {TablePaginationProps} from "@/utils/components";

export function GenericTablePagination(props: TablePaginationProps) {
    const { count, rowsPerPage, currentPage, onPageChange, onRowsPerPageChange } = props;

    return (
        <TablePagination
            rowsPerPageOptions={[5, 10, 25, 100]}
            component="div"
            count={count}
            page={currentPage}
            onPageChange={(event, newPage) => onPageChange(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(event) => onRowsPerPageChange(parseInt(event.target.value, 10))}
        />
    );
}