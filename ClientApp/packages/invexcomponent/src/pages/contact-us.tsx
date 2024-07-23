//@ts-nocheck
import React from "react";
import Layout from "../layouts";
import Content from "../layouts/content";
import ContactUsContainer from "../containers/contact-us";
import SEO from "../components/seo";

const ErrorNotFound: React.FC = () => {
    return (
        <Layout>
            <SEO />
            <Content fullHeight align="top">
                <ContactUsContainer />
            </Content>
        </Layout>
    );
};

export default ErrorNotFound;
