type CustomerProps = {
    id: string,
    PricingPlan: string,
    avatar: string,
    createdAt: number,
    email: string,
    name: string,
    phone: string
}

export function applyPagination(documents: CustomerProps[], page: number, rowsPerPage: number) {
    return documents.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}