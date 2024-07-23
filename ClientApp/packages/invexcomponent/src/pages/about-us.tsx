//@ts-nocheck
import React from "react";
import Layout from "../layouts";
import Content from "../layouts/content";
import AboutUsContainer from "../containers/about-us";
import SEO from "../components/seo";

const ErrorNotFound: React.FC = () => {
    return (
        <Layout>
            <SEO />
            <Content fullHeight align="top">
                <AboutUsContainer />
            </Content>
        </Layout>
    );
};

export default ErrorNotFound;
