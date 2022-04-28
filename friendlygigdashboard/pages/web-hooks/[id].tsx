import type { NextPage } from "next";
import WebHooksForm from "../../components/forms/WebHooksForm";
import Layout from "../../components/layouts/Layout";

const GroupPage: NextPage = () => {
  return (
    <Layout baseUrl={{ link: `/web-hooks`, label: "Web Hooks" }}>
      <WebHooksForm />
    </Layout>
  );
};

export default GroupPage;
