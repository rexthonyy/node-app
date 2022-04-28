import type { GetServerSideProps, NextPage } from "next"
import React from "react"
import DiscussionForm from "../../../components/forms/DiscussionForm"
import Layout from "../../../components/layouts/Layout"

const ForumPage: NextPage = () => {
  return (
    <Layout baseUrl={{ link: `/forums`, label: "Forums" }}>
      <DiscussionForm />
    </Layout>
  )
}

export default ForumPage

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {}
  }
}
