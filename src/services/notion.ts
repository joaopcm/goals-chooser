import { Client } from '@notionhq/client'

export const notion = new Client({ auth: process.env.NOTION_API_KEY });

export type Title = {
  title: {
    plain_text: string;
  }[];
};

export type MultiSelect = {
  multi_select: {
    id: string;
    name: string;
  }[]
};

export type Select = {
  select: {
    name: string;
  }
}