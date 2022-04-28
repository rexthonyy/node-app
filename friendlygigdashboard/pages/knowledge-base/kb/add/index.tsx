import type { GetServerSideProps, NextPage } from "next"
import KnowledgeBaseForm from "../../../../components/forms/KnowledgeBaseForm"
import Layout from "../../../../components/layouts/Layout"

const KnowledgeBasePage: NextPage = () => {
  return (
    <Layout baseUrl={{ link: `/knowledge-base/kb`, label: "Knowledge Base" }}>
      <div className={`thinBorderBottom p-4`}>
        <span className={`text-base`}>{`Knowledge Base`}</span>
      </div>
      <KnowledgeBaseForm />
    </Layout>
  )
}

export default KnowledgeBasePage

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {}
  }
}
