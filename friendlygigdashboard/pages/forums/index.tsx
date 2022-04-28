import type { GetServerSideProps, NextPage } from "next"
import React from "react"
import Layout from "../../components/layouts/Layout"
import ForumsBaseTable from "../../components/tables/ForumsBaseTable"

const ForumPage: NextPage = () => {
  return (
    <Layout baseUrl={{ link: `/forums`, label: "Forums" }}>
      <ForumsBaseTable />
    </Layout>
  )
}

export default ForumPage

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {}
  }
}
