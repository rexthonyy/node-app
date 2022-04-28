import type { NextPage } from "next";
import OrganizationForm from "../../components/forms/OrganizationForm";
import Layout from "../../components/layouts/Layout";
import { usePage } from "../../context/PageContext";

const AddUserPage: NextPage = () => {
  const { formData } = usePage();

  return (
    <Layout baseUrl={{ link: `/Organizations/add`, label: "Add Organization" }}>
      <OrganizationForm formData={formData} />
    </Layout>
  );
};

export default AddUserPage;
