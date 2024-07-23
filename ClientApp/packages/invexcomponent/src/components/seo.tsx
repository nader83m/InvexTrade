//@ts-nocheck
import { FC } from "react";
import { Helmet } from "react-helmet";

interface IProps {
    title?: string;
    description?: string;
}

const SEO: FC<IProps> = ({ title, description }) => {
    return (
        <Helmet>
            <meta charSet="utf-8" />
            <title>
                {title}
            </title>
            <meta name="description" content={description} />
        </Helmet>
    );
};

SEO.defaultProps = {
    title: "Invex Trade",
    description: "Invex Trade",
};

export default SEO;
