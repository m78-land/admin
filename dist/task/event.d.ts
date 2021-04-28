/**
 * 某个任务改变时，通过key来通知相关组件更新
 * */
export declare const updateByKeyEvent: {
    useEvent: (listener: (key: string) => void) => void;
    on: (listener: (key: string) => void) => void;
    off: (listener: (key: string) => void) => void;
    emit: (...args: any) => void;
};
