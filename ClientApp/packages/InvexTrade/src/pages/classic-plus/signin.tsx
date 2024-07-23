//@ts-nocheck
import React from "react";
import Layout from "../../layouts/layout-02";
import Content from "../../layouts/layout-02/content";
import ContentHeader from "../../layouts/layout-02/content-header";
import ContentBody from "../../layouts/layout-02/content-body";
import AuthContainer from "../../containers/signin";
import SEO from "../../components/seo";

const SignIn: React.FC = () => {
    return (
        <Layout>
            <SEO />
            <Content fullHeight>
                <ContentHeader />
                <ContentBody>
                    <AuthContainer />
                </ContentBody>
            </Content>
        </Layout>
    );
};

export default SignIn;
