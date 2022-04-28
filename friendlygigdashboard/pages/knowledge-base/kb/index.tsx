import type { NextPage, GetServerSideProps } from "next";
import Layout from "../../../components/layouts/Layout";
import KnowledgeBaseTable from "../../../components/tables/KnowledgeBaseTable";

const KnowledgeBasePage: NextPage = () => {
  return (
    <Layout baseUrl={{ link: `/knowledge-base/kb`, label: "Knowledge Base" }}>
      <KnowledgeBaseTable />
    </Layout>
  );
};

export default KnowledgeBasePage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {},
  };
};
