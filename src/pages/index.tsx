import { GetServerSideProps } from "next";

import { notion, Title, MultiSelect, Select } from '../services/notion'
import SEO from '../components/SEO'

type Type = {
  id: string;
  name: string;
}

type Goal = {
  id: string;
  name: string;
  types: Type[];
  status: 'pending' | 'done';
}

interface HomeProps {
  goals: Goal[];
}

export default function Home({ goals }: HomeProps) {
  return (
    <>
      <SEO title="Qual o próximo rolê?" />
      <h1>Hello world!</h1>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const { NOTION_API_DATABASE_ID } = process.env

  if (!NOTION_API_DATABASE_ID) {
    return {
      props: {}
    }
  }

  const response = await notion.databases.query({ database_id: NOTION_API_DATABASE_ID })
  const goals = response.results.map(page => {
    return {
      id: page.id,
      name: (page.properties.Name as Title).title[0]?.plain_text,
      types: (page.properties.Type as MultiSelect).multi_select,
      status: (page.properties.Status as Select).select.name,
    }
  })

  return {
    props: {
      goals: goals
    }
  }
}
