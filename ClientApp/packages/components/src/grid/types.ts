//@ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any */
export type End = "first" | "last";
export type Column = number | true | "auto";
export type Order = number | End;
export type Offset = number;
export type Align = "start" | "end" | "center" | "baseline" | "stretch";
export type AlignSelf = Align | "auto";
export type ColProps = {
    noGutter?: boolean;
    col?: Column;
    auto?: boolean;
    alignSelf?: AlignSelf;
    offset?: Offset;
    order?: Order;
    xs?: Column;
    xsOffset?: Offset;
    xsAuto?: boolean;
    xsAlignSelf?: AlignSelf;
    xsOrder?: Order;
    hiddenXsUp?: boolean;
    hiddenXsDown?: boolean;
    sm?: Column;
    smOffset?: Offset;
    smAuto?: boolean;
    smAlignSelf?: AlignSelf;
    smOrder?: Order;
    hiddenSmUp?: boolean;
    hiddenSmDown?: boolean;
    md?: Column;
    mdOffset?: Offset;
    mdAuto?: boolean;
    mdAlignSelf?: AlignSelf;
    mdOrder?: Order;
    hiddenMdUp?: boolean;
    hiddenMdDown?: boolean;
    lg?: Column;
    lgOffset?: Offset;
    lgAuto?: boolean;
    lgAlignSelf?: AlignSelf;
    lgOrder?: Order;
    hiddenLgUp?: boolean;
    hiddenLgDown?: boolean;
    xl?: Column;
    xlOffset?: Offset;
    xlAuto?: boolean;
    xlAlignSelf?: AlignSelf;
    xlOrder?: Order;
    xxl?: Column;
    xxlOffset?: Offset;
    xxlAuto?: boolean;
    xxlAlignSelf?: AlignSelf;
    xxlOrder?: Order;
    hiddenXlUp?: boolean;
    hiddenXlDown?: boolean;
};
export type ColCss = {
    col: any;
    offset: any;
    order: any;
    alignSelf: {
        [K in AlignSelf]: string;
    };
    display: {
        none: string;
    };
    noGutter: string;
};

export type Justify = "start" | "end" | "center" | "between" | "around";
export type RowProps = {
    alignItems?: Align;
    smAlignItems?: Align;
    mdAlignItems?: Align;
    lgAlignItems?: Align;
    xlAlignItems?: Align;
    justifyContent?: Justify;
    smJustifyContent?: Justify;
    mdJustifyContent?: Justify;
    lgJustifyContent?: Justify;
    xlJustifyContent?: Justify;
};
export type RowCss = {
    alignItems: {
        [K in Align]: string;
    };
    justifyContent: {
        [K in Justify]: string;
    };
};
