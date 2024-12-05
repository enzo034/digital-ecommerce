



export function getNextPageUrl(page: number, limit: number, total: number, urlParameter: string): string | null {
    return page * limit < total ? `/api/package${urlParameter}?page=${page + 1}&limit=${limit}` : null;
}

export function getPreviousPageUrl(page: number, limit: number, urlParameter: string): string | null {
    return page - 1 > 0 ? `/api/package${urlParameter}?page=${page - 1}&limit=${limit}` : null;
}