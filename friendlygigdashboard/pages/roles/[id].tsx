import type { NextPage } from "next";
import RoleForm from "../../components/forms/RoleForm";
import Layout from "../../components/layouts/Layout";
import { usePage } from "../../context/PageContext";

const AddUserPage: NextPage = () => {
  const { formData } = usePage();

  return (
    <Layout baseUrl={{ link: `/roles/add`, label: "Add Roles" }}>
      <RoleForm formData={formData} />
    </Layout>
  );
};

export default AddUserPage;
