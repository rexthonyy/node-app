import type { GetServerSideProps, NextPage } from "next"
import Layout from "../../../../components/layouts/Layout"
import KnowledgeBaseTabPane from "../../../../components/tabPanes/KnowledgeBaseTabPane"
import { LANGUAGES } from "../../../../constants/languages"
import { usePage } from "../../../../context/PageContext"

const CategoryDetailPage: NextPage = () => {
  const { formData } = usePage()
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
      <div className={`flex flex-col`}>
        <KnowledgeBaseTabPane tabs={["All Categories", "Sub Categories", "Sub Category +1"]} />
      </div>
    </Layout>
  )
}

export default CategoryDetailPage

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {}
  }
}
