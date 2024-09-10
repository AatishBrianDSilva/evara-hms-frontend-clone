import { IQueryOptions } from "../types/global";

function generateQueryParams(options: IQueryOptions = {}): string {
  const queryParams = new URLSearchParams();

  // Utility function to add parameter if it's not undefined
  const addParam = (key: string, value: any) => {
    if (value !== undefined) queryParams.append(key, value.toString());
  };

  addParam("page", options.page);
  addParam("limit", options.limit);
  addParam("sort", options.sort ? JSON.stringify(options.sort) : undefined);
  addParam("select", options.select);
  addParam("lean", options.lean);
  addParam("leanWithId", options.leanWithId);
  addParam("paginate", options.paginate);
  addParam("searchQuery", options.searchQuery);

  // Loop through filters and add them to queryParams
  Object.entries(options.filters || {}).forEach(([key, value]) => {
    addParam(key, value);
  });

  Object.entries(options.conditions || {}).forEach(([key, value]) => {
    addParam(key, value);
  });

  Object.entries(options.populate || {}).forEach(([key, value]) => {
    addParam(key, value);
  });
  Object.entries(options.dateRange || {}).forEach(([key, value]) => {
    addParam(key, value);
  });

  console.log({ queryParams });

  return queryParams.toString();
}

export default generateQueryParams;
