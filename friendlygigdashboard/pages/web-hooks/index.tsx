import type { NextPage } from "next";
import Layout from "../../components/layouts/Layout";
import WebHooksTable from "../../components/tables/WebHooksTable";

const GroupPage: NextPage = () => {
  return (
    <Layout baseUrl={{ link: `/web-hooks`, label: "Web Hooks" }}>
      <WebHooksTable />
    </Layout>
  );
};

export default GroupPage;
