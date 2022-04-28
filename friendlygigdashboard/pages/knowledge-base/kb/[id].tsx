import type { GetServerSideProps, NextPage } from "next";
import KnowledgeBaseForm from "../../../components/forms/KnowledgeBaseForm";
import Layout from "../../../components/layouts/Layout";
import { usePage } from "../../../context/PageContext";

const EditKnowledgeBasePage: NextPage = () => {
  const { formData } = usePage();

  return (
    <Layout baseUrl={{ link: `/knowledge-base/kb`, label: "Knowledge Base" }}>
      <div className={`p-6 thinBorderBottom`}>
        <span>{`Knowledge Base`}</span>
      </div>
      {!formData ? (
        <div>{`Loading...`}</div>
      ) : (
        <KnowledgeBaseForm formData={formData} />
      )}
    </Layout>
  );
};

export default EditKnowledgeBasePage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {},
  };
};
