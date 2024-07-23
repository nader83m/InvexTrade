//@ts-nocheck
import React from "react";
import Layout from "../layouts";
import Content from "../layouts/content";
import ProfileEditContainer from "../containers/profile-edit";
import SEO from "../components/seo";

const ErrorNotFound: React.FC = () => {
    return (
        <Layout>
            <SEO />
            <Content fullHeight align="top">
                <ProfileEditContainer />
            </Content>
        </Layout>
    );
};

export default ErrorNotFound;
