import type { NextPage, GetServerSideProps } from "next"
import Layout from "../components/layouts/Layout"
import KnowledgeBaseTable from "../components/tables/KnowledgeBaseTable"

const Home: NextPage = () => {
  return (
    <Layout baseUrl={{ link: `/knowledge-base/kb`, label: "Knowledge Base" }}>
      <KnowledgeBaseTable />
    </Layout>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {}
  }
}
