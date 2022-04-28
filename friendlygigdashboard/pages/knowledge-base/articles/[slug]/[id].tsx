import type { GetServerSideProps, NextPage } from "next";
import ArticleForm from "../../../../components/forms/ArticleForm";
import Layout from "../../../../components/layouts/Layout";
import { LANGUAGES } from "../../../../constants/languages";
import { usePage } from "../../../../context/PageContext";

const CategoryDetailPage: NextPage = () => {
  const { formData } = usePage();
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
      <ArticleForm />
    </Layout>
  );
};

export default CategoryDetailPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {},
  };
};
