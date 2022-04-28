import type { GetServerSideProps, NextPage } from "next"
import React from "react"
import PostReplayForm from "../../../components/forms/PostReplayForm"
import Layout from "../../../components/layouts/Layout"

const ForumPage: NextPage = () => {
  return (
    <Layout baseUrl={{ link: `/forums/add`, label: "Forum" }}>
      <PostReplayForm />
    </Layout>
  )
}

export default ForumPage

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {}
  }
}
