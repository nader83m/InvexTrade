import React from "react";
import Layout from "../layouts";
import {InvexComponentImmediate} from "invexcomponent";

function dashboardInvexTrade(){
    return(
        <Layout hideFooter>
            <InvexComponentImmediate />
        </Layout>
    )
}

export default dashboardInvexTrade;
