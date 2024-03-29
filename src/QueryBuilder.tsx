import React, { useState } from "react";
import { Query, Builder, Utils as QbUtils } from "react-awesome-query-builder";
// types
import {
    JsonGroup,
    Config,
    ImmutableTree,
    BuilderProps,
    BasicConfig
} from "react-awesome-query-builder";

import "react-awesome-query-builder/lib/css/styles.css";
import "react-awesome-query-builder/lib/css/compact_styles.css"; //optional, for more compact styles

// Choose your skin (ant/material/vanilla):
const InitialConfig = BasicConfig; // or MaterialConfig or BasicConfig

// You need to provide your own config. See below 'Config format'
const config: Config = {
    ...InitialConfig,
    fields: {
        qty: {
            label: "Qty",
            type: "number",
            fieldSettings: {
                min: 0
            },
            valueSources: ["value"],
            preferWidgets: ["number"]
        },
        price: {
            label: "Price",
            type: "number",
            valueSources: ["value"],
            fieldSettings: {
                min: 10,
                max: 100
            },
            preferWidgets: ["slider", "rangeslider"]
        },
        color: {
            label: "Color",
            type: "select",
            valueSources: ["value"],
            fieldSettings: {
                listValues: [
                    { value: "yellow", title: "Yellow" },
                    { value: "green", title: "Green" },
                    { value: "orange", title: "Orange" }
                ]
            }
        },
        is_promotion: {
            label: "Promo?",
            type: "boolean",
            operators: ["equal"],
            valueSources: ["value"]
        }
    }
};

// You can load query value from your backend storage (for saving see `Query.onChange()`)
const queryValue: JsonGroup = { id: QbUtils.uuid(), type: "group" };

export const Demo: React.FC = () => {
    const [state, setState] = useState({
        tree: QbUtils.checkTree(QbUtils.loadTree(queryValue), config),
        config: config
    });

    const onChange = (immutableTree: ImmutableTree, config: Config) => {
        // Tip: for better performance you can apply `throttle` - see `examples/demo`
        setState({ tree: immutableTree, config: config });

        const jsonTree = QbUtils.getTree(immutableTree);
        console.log(jsonTree);
        // `jsonTree` can be saved to backend, and later loaded to `queryValue`
    };

    const renderBuilder = (props: BuilderProps) => (
        <div className="query-builder-container" style={{ padding: "10px" }}>
            <div className="query-builder qb-lite">
                <Builder {...props} />
            </div>
        </div>
    );

    return (
        <div>
            <Query
                {...config}
                value={state.tree}
                onChange={onChange}
                renderBuilder={renderBuilder}
            />
            <div className="query-builder-result">
                <div>
                    Query string:{" "}
                    <pre>
            {JSON.stringify(QbUtils.queryString(state.tree, state.config))}
          </pre>
                </div>
                <div>
                    MongoDb query:{" "}
                    <pre>
            {JSON.stringify(QbUtils.mongodbFormat(state.tree, state.config))}
          </pre>
                </div>
                <div>
                    SQL where:{" "}
                    <pre>
            {JSON.stringify(QbUtils.sqlFormat(state.tree, state.config))}
          </pre>
                </div>
                <div>
                    JsonLogic:{" "}
                    <pre>
            {JSON.stringify(QbUtils.jsonLogicFormat(state.tree, state.config))}
          </pre>
                </div>
            </div>
        </div>
    );
};
