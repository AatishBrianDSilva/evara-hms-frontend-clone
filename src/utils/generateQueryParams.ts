import { IQueryOptions } from "../types/types";

function generateQueryParams(options: IQueryOptions = {}): string {
  const queryParams = new URLSearchParams();

  // Utility function to add parameter if it's not undefined
  const addParam = (key: string, value: any) => {
    if (value !== undefined) queryParams.append(key, value.toString());
  };

  // Add parameters to queryParams
  addParam("page", options.page);
  addParam("limit", options.limit);
  addParam("sort", options.sort ? JSON.stringify(options.sort) : undefined);
  addParam("select", options.select);
  addParam("lean", options.lean);
  addParam("leanWithId", options.leanWithId);
  addParam("paginate", options.paginate);

  // Loop through filters and add them to queryParams
  Object.entries(options.filters || {}).forEach(([key, value]) => {
    addParam(key, value);
  });

  return queryParams.toString();
}

export default generateQueryParams;
