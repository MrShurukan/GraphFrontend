// type FilterValue<T> = { value: T | null };
// type FilterObject = { [key: string]: FilterValue<any> };
type FilterInput<T> = {
    filters: Partial<Record<keyof T, any>>;
    pageNumber?: number;
    pageSize?: number;
};

/**
 * Создаёт объект фильтра для API, учитывая правила:
 * - не включать поле вообще → фильтр по нему не используется
 * - value: null → поиск по пустым значениям
 * - value: задан → обычный поиск
 */
export function buildApiFilter<T extends object>(input: FilterInput<T>) {
    const filter: any = {};

    Object.entries(input.filters).forEach(([key, val]) => {
        if (val !== undefined) {
            filter[key] = { value: val };
        }
    });

    if (input.pageNumber !== undefined) {
        filter.pageNumber = input.pageNumber;
    }

    if (input.pageSize !== undefined) {
        filter.pageSize = input.pageSize;
    }

    return filter;
}