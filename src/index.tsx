import '@m78/admin/style/index.scss';
import M78Admin from './m78-admin-impl';
import FuncItem from './widget/unit/func-item';
import Badge from './widget/unit/badge';
import Login from './widget/login/login';
import WindowLayout from './widget/window-layout/window-layout';
import Link from './task/link';
import taskGlobal from './task/task-global';

export { taskGlobal, Link, M78Admin };
export { FuncItem, Badge, Login, WindowLayout };
export * from './types/types';
