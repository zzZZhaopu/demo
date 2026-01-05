import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";

// 自动导入 pages 目录下的所有页面
const modules = import.meta.glob("../views/**/index.vue");

console.log("modules=====", modules);

const routes: RouteRecordRaw[] = [];

Object.keys(modules).forEach((key) => {
  const match = key.match(/\.\.\/views\/(.+)\/index\.vue$/);
  console.log("match====", match)
  if (match && match[1]) {
    const pageName = match[1]; // 获取文件夹名称
    // 处理路径生成标题
    const title = pageName
      .split('/')                                    // 按斜杠分割
      .map(part => 
        part
          .replace(/([A-Z])/g, ' $1')               // 驼峰转空格
          .replace(/^./, str => str.toUpperCase())  // 首字母大写
          .trim()
      )
      .join(' ');                                    // 用空格连接
    const route: RouteRecordRaw = {
      path: `/${match[1]}`,
      name: pageName,
      component: modules[key],
      meta: {
        title,
      },
    } as RouteRecordRaw;
    routes.push(route);
  }
});

if (routes.length > 0 && routes[0]) {
  routes.unshift({
    path: "/",
    redirect: '/dashboard',
  });
}

console.log("routes=====", routes);
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export const pagesRouters = routes.filter((item) => item.path !== "/");

export default router;

// 路由守卫 - 设置页面标题
router.beforeEach((to, from, next) => {
  // 从路由元信息中获取 title
  const title = to.meta.title as string;
  
  // 设置浏览器标签页标题
  if (title) {
    document.title = title;
  } else {
    document.title = 'Vue3 Demo'; // 默认标题
  }
  
  console.log('路由切换:', from.path, '->', to.path, '标题:', title);
  next();
});
