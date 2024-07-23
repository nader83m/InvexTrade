# This package contains main invex component

## If you want to serve bundle file import default app from your package
```
import ReactDOM from "react-dom";
import App from 'invexcomponent'

ReactDOM.render(<App/>,
    document.getElementById("invexchart")
);
```

## If you want to get only component you have to import InvexComponentImmediate
```
import {InvexComponentImmediate} from "invexcomponent";

function dashboardInvexTrade(){
    return(
        <Layout hideFooter>
            <InvexComponentImmediate />
        </Layout>
    )
}
```