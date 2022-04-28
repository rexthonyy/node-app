import type { NextPage, GetServerSideProps } from "next"
import Layout from "../../components/layouts/Layout"
import UsersTable from "../../components/tables/UsersTable"

const Home: NextPage = () => {
  return (
    <Layout baseUrl={{ link: `/knowledge-base/kb`, label: "Knowledge Base" }}>
      <UsersTable />
    </Layout>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {}
  }
}
