import { AuthSeedState } from '../types';
/**
 * 管理权限相关状态，实现核心验证器
 * */
declare const authSeed: import("m78/seed/type").ExpandSeed<AuthSeedState, import("m78/seed").Validators<AuthSeedState>>;
export default authSeed;
