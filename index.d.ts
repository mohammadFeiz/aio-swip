import Geo from './../../npm/aio-geo';
export type I_Swip_mousePosition = {
    x: number;
    y: number;
    xp: number;
    yp: number;
    clientX: number;
    clientY: number;
    centerAngle: number;
};
export type I_Swip_change = {
    x: number;
    y: number;
    dx: number;
    dy: number;
    dist: number;
    angle: number;
    deltaCenterAngle: number;
};
export type I_Swip_parameter = {
    change: I_Swip_change;
    mousePosition: I_Swip_mousePosition;
    domLimit: I_Swip_domLimit;
    parentLimit: I_Swip_domLimit;
    event: any;
    selectRect?: I_Swip_selectRect;
    isInSelectRect?: I_Swip_isInSelectRect;
};
type I_Swip_selectRect_config = {
    color?: string;
    enable: () => boolean;
};
export type I_Swip = {
    dom: () => any;
    parent?: () => any;
    onClick?: (p: I_Swip_parameter) => void;
    page?: () => any;
    start?: (p: I_Swip_parameter) => number[];
    move?: (p: I_Swip_parameter) => void;
    end?: (p: I_Swip_parameter) => void;
    selectRect?: I_Swip_selectRect_config;
    speedX?: number;
    speedY?: number;
    stepX?: number | boolean;
    stepY?: number | boolean;
    reverseY?: boolean;
    reverseX?: boolean;
    minY?: number;
    maxY?: number;
    minX?: number;
    maxX?: number;
    insideX?: boolean;
    insideY?: boolean;
};
export type I_Swip_domLimit = {
    width: number;
    height: number;
    left: number;
    top: number;
    centerX: number;
    centerY: number;
    right: number;
    bottom: number;
};
type I_Swip_isInSelectRect = (x: number, y: number) => boolean;
type I_Swip_getIsInSelectrect = (selectRect: I_Swip_selectRect) => I_Swip_isInSelectRect;
export type I_Swip_selectRect = {
    left: number;
    top: number;
    width: number;
    height: number;
};
export type I_Swip_tempSelectRect = {
    left: number;
    top: number;
};
export default class Swip {
    p: I_Swip;
    geo: Geo;
    timeout: any;
    count: number;
    domLimit: I_Swip_domLimit;
    parentLimit: I_Swip_domLimit;
    getDom: () => any;
    getParent: () => any;
    init: () => void;
    dx: number;
    dy: number;
    cx: number;
    cy: number;
    dist: number;
    so: {
        client?: {
            x: number;
            y: number;
        };
        x?: number;
        y?: number;
        sr?: I_Swip_selectRect;
        tsr?: I_Swip_tempSelectRect;
    };
    getPercentByValue: (value: number, start: number, end: number) => number;
    getMousePosition: (e: any) => I_Swip_mousePosition;
    click: (e: any) => void;
    mouseDown: (e: any) => void;
    mouseMove: (e: any) => void;
    mouseUp: (e: any) => void;
    getDOMLimit: (type: 'dom' | 'parent') => I_Swip_domLimit;
    change: I_Swip_change;
    getPage: () => any;
    isMoving: boolean;
    centerAngle: number;
    defaultLimit: I_Swip_domLimit;
    addSelectRect: (x: number, y: number) => void;
    setSelectRect: (width: number, height: number) => void;
    removeSelectRect: () => void;
    selectRect?: I_Swip_selectRect_config;
    getIsInSelectRect: I_Swip_getIsInSelectrect;
    defaultChange: I_Swip_change;
    constructor(p: I_Swip);
}
export {};
