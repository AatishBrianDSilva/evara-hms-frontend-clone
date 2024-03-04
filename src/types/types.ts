export interface IPaginateOptions {
  page?: number;
  limit?: number;
  sort?: { [key: string]: any };
  select?: string;
  lean?: boolean;
  leanWithId?: boolean;
}
