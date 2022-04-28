import type { GetServerSideProps, NextPage } from "next"
import React from "react"
import Layout from "../../../components/layouts/Layout"
import ForumsDiscussionTable from "../../../components/tables/ForumsDiscussionTable"

const ForumPage: NextPage = () => {
  return (
    <Layout baseUrl={{ link: `/forums`, label: "Forums" }}>
      <ForumsDiscussionTable />
    </Layout>
  )
}

export default ForumPage

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {}
  }
}
