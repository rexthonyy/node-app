import type { GetServerSideProps, NextPage } from "next"
import React from "react"
import CategoryForm from "../../../../components/forms/CategoryForm"
import Layout from "../../../../components/layouts/Layout"
import { LANGUAGES } from "../../../../constants/languages"

const CategoryDetailPage: NextPage = () => {
  return (
    <Layout baseUrl={{ link: `/knowledge-base/kb`, label: "Knowledge Base" }}>
      <div className={`language-tabs mb-3`}>
        {[1, 2].map((item, index) => (
          <span
            className={`language-tab bg-gray-200`}
            key={index}
          >
            {LANGUAGES[index]}
          </span>
        ))}
      </div>
      <CategoryForm />
    </Layout>
  )
}

export default CategoryDetailPage

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {}
  }
}
