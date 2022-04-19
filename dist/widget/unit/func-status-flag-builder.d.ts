/// <reference types="react" />
interface Props {
    /** 打开数量 */
    length: number;
}
/** 任务入口的数量和打开标记 */
declare const FuncStatusFlagBuilder: ({ length }: Props) => JSX.Element | null;
export default FuncStatusFlagBuilder;
