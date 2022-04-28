import type { NextPage } from "next";
import UserForm from "../../components/forms/UserForm";
import Layout from "../../components/layouts/Layout";
import { usePage } from "../../context/PageContext";

const AddUserPage: NextPage = () => {
  const { formData } = usePage();

  return (
    <Layout baseUrl={{ link: `/users`, label: "Users" }}>
      <UserForm formData={formData} />
    </Layout>
  );
};

export default AddUserPage;
