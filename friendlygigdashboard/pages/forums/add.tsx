import type { GetServerSideProps, NextPage } from "next"
import React from "react"
import ForumsForm from "../../components/forms/ForumsForm"
import Layout from "../../components/layouts/Layout"

const ForumPage: NextPage = () => {
  return (
    <Layout baseUrl={{ link: `/forums/add`, label: "Forum" }}>
      <div className={`thinBorderBottom p-4`}>
        <span className={`text-base`}>{`Forum`}</span>
      </div>
      <ForumsForm />
    </Layout>
  )
}

export default ForumPage

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {}
  }
}
