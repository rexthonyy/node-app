import type { NextPage } from "next";
import Layout from "../../components/layouts/Layout";
import OrganizationTable from "../../components/tables/OrganizationTable";

const OrganizationPage: NextPage = () => {
  return (
    <Layout baseUrl={{ link: `/roles`, label: "Roles" }}>
      <OrganizationTable />
    </Layout>
  );
};

export default OrganizationPage;
