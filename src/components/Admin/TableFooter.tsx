import  { TablePaginationProps,Pagination } from '@mui/material';
import { GridPagination, gridPageCountSelector, useGridApiContext, useGridSelector } from '@mui/x-data-grid';
import React, { useEffect } from 'react';




function PaginationComponent({
    page,
    onPageChange,
    className,
}: Pick<TablePaginationProps, 'page' | 'onPageChange' | 'className'>) {
    const apiRef = useGridApiContext();
    const pageCount = useGridSelector(apiRef, gridPageCountSelector);


    return (

        <Pagination
            className={className}
            count={pageCount}
            page={page + 1}
            sx={{
                '& .MuiPaginationItem-root.Mui-selected': {
                    backgroundColor: "#58694B",
                    color: "#fff"
                },
                '& .MuiPaginationItem-root.Mui-selected:hover': {
                    backgroundColor: "rgba(88, 105, 75, 0.8)"
                }
            }}
            onChange={(event, newPage) => {
                onPageChange(event as any, newPage - 1);
            }}
        />

    );
}

const TableFooter = (props: any) => {
    return (
        <GridPagination ActionsComponent={PaginationComponent} {...props} />
    );
};

export default TableFooter;