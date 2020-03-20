// @material-ui/icons
import {
  Dashboard,
  Person,
  CastForEducation,
  People,
  Image,
  Apps,
  Build as BuildIcon,
  ListAltOutlined,
  SupervisedUserCircle,
  LinearScaleOutlined,
  DeviceHub,
  Mail,
  PermPhoneMsg,
  ViewCompact,
  ConfirmationNumber,
  PieChart
} from "@material-ui/icons";

import { lazy } from "utils";
import {
  PANEL_ROUTE,
  SIDEBAR_APPLICATION,
  SIDEBAR_ENGAGE,
  SIDEBAR_MAIN,
  SIDEBAR_OTHER,
  SIDEBAR_USER,
  SUPER_ADMIN_ROLE
} from "models/Constants";
import { IRoute } from "interfaces/IRoute";

const DashboardPage = lazy(() => import("views/Dashboard/Dashboard"));
const EventsList = lazy(() => import("views/Events/EventsList.tsx"));
const EventsUsersItem = lazy(() => import("views/Events/EventsUsersItem.tsx"));
const UserProfile = lazy(() => import("views/UserProfile/UserProfile"));
const AppsList = lazy(() => import("views/AppsList/AppsList"));
const UsersList = lazy(() => import("views/Users/UsersList"));
const UsersItem = lazy(() => import("views/Users/UsersItem"));
const RolesList = lazy(() => import("views/Roles/RolesList"));
const AppsItem = lazy(() => import("views/AppsList/AppsItem"));
const Login = lazy(() => import("views/Login/Login"));
const SignUp = lazy(() => import("views/SignUp/SignUp"));
const StartPage = lazy(() => import("views/StartPage/StartPage"));

const Guide = lazy(() => import("views/Guide/Guide"));
const Build = lazy(() => import("views/Build/Build"));
const CampaignsList = lazy(() => import("views/Campaigns/CampaignsList"));
const CampaignsItem = lazy(() => import("views/Campaigns/CampaignsItem"));
const SegmentsList = lazy(() => import("views/Segments/SegmentsList"));
const SegmentsItem = lazy(() => import("views/Segments/SegmentsItem"));

const dashboardRoutesMap = {
  guide: {
    path: "/guide",
    name: "Guide",
    rtlName: "يرشد",
    icon: CastForEducation,
    component: Guide,
    layout: PANEL_ROUTE,
    auth: true,
    category: SIDEBAR_OTHER
  },
  build: {
    path: "/build",
    name: "Build",
    rtlName: "يرشد",
    icon: BuildIcon,
    component: Build,
    layout: PANEL_ROUTE,
    auth: true,
    category: SIDEBAR_OTHER
  },
  dashboard: {
    path: "/dashboard",
    name: "Dashboard",
    rtlName: "لوحة القيادة",
    icon: Dashboard,
    component: DashboardPage,
    layout: PANEL_ROUTE,
    auth: true,
    category: SIDEBAR_MAIN
  },
  eventsUsers: {
    path: "/events-users",
    name: "Events",
    rtlName: "لوحة القيادة",
    icon: LinearScaleOutlined,
    component: EventsList,
    layout: PANEL_ROUTE,
    auth: true,
    category: SIDEBAR_MAIN
  },
  eventsUser: {
    url: "/events-users",
    params: "/:userId",
    name: "Events",
    rtlName: "لوحة القيادة",
    icon: SupervisedUserCircle,
    component: EventsUsersItem,
    layout: PANEL_ROUTE,
    auth: true,
    category: SIDEBAR_MAIN
  },
  users: {
    path: "/users",
    name: "Users",
    icon: People,
    rtlName: "ملف تعريفي للمستخدم",
    component: UsersList,
    layout: PANEL_ROUTE,
    auth: true,
    category: SIDEBAR_MAIN
  },
  user: {
    url: "/users",
    params: "/:userId",
    name: "User",
    rtlName: "ملف تعريفي للمستخدم",
    component: UsersItem,
    layout: PANEL_ROUTE,
    auth: true,
    category: SIDEBAR_MAIN
  },
  roles: {
    path: "/roles",
    name: "Roles",
    rtlName: "ملف تعريفي للمستخدم",
    icon: DeviceHub,
    component: RolesList,
    layout: PANEL_ROUTE,
    auth: true,
    category: SIDEBAR_MAIN,
    role: SUPER_ADMIN_ROLE
  },
  segments: {
    path: "/segments",
    name: "Segments",
    rtlName: "ملف تعريفي للمستخدم",
    icon: PieChart,
    component: SegmentsList,
    layout: PANEL_ROUTE,
    auth: true,
    category: SIDEBAR_MAIN
  },
  segment: {
    url: "/segments",
    params: "/:segmentId",
    name: "Segment",
    rtlName: "ملف تعريفي للمستخدم",
    component: SegmentsItem,
    layout: PANEL_ROUTE,
    auth: true,
    category: SIDEBAR_MAIN
  },
  apps: {
    path: "/apps",
    name: "Applications",
    rtlName: "ملف تعريفي للمستخدم",
    icon: Apps,
    component: AppsList,
    layout: PANEL_ROUTE,
    auth: true,
    category: SIDEBAR_MAIN
  },
  userProfile: {
    path: "/user-profile",
    name: "User Profile",
    rtlName: "ملف تعريفي للمستخدم",
    icon: Person,
    component: UserProfile,
    layout: PANEL_ROUTE,
    auth: true,
    category: SIDEBAR_USER
  },
  // table: {
  //   path: "/table",
  //   name: "Table List",
  //   rtlName: "قائمة الجدول",
  //   icon: "content_paste",
  //   component: TableList,
  //   layout: PANEL_ROUTE,
  //   auth: true,
  //   category: SIDEBAR_OTHER
  // },
  // typography: {
  //   path: "/typography",
  //   name: "Typography",
  //   rtlName: "طباعة",
  //   icon: LibraryBooks,
  //   component: Typography,
  //   layout: PANEL_ROUTE,
  //   auth: true,
  //   category: SIDEBAR_OTHER
  // },
  // icons: {
  //   path: "/icons",
  //   name: "Icons",
  //   rtlName: "الرموز",
  //   icon: BubbleChart,
  //   component: Icons,
  //   layout: PANEL_ROUTE,
  //   auth: true,
  //   category: SIDEBAR_OTHER
  // },
  // maps: {
  //   path: "/maps",
  //   name: "Maps",
  //   rtlName: "خرائط",
  //   icon: LocationOn,
  //   component: Maps,
  //   layout: PANEL_ROUTE,
  //   auth: true,
  //   category: SIDEBAR_OTHER
  // },
  // notifications: {
  //   path: "/notifications",
  //   name: "Notifications",
  //   rtlName: "إخطارات",
  //   icon: Notifications,
  //   component: NotificationsPage,
  //   layout: PANEL_ROUTE,
  //   auth: true,
  //   category: SIDEBAR_OTHER
  // },
  login: {
    path: "/login",
    name: "login",
    rtlName: "لوحة الادارة",
    component: Login,
    layout: "/main"
  },
  signup: {
    path: "/sign-up",
    name: "Sign up",
    rtlName: "لوحة الادارة",
    component: SignUp,
    layout: "/main"
  },
  startPage: {
    path: "/start-page",
    name: "Start Page",
    rtlName: "لوحة الادارة",
    component: StartPage,
    layout: "/main"
  },
  startPageMain: {
    path: "/",
    name: "Start Page",
    rtlName: "لوحة الادارة",
    component: StartPage,
    layout: "/main"
  },
  emailEngage: {
    path: "/campaigns/email",
    name: "Email",
    rtlName: "ملف تعريفي للمستخدم",
    icon: Mail,
    component: CampaignsList,
    layout: PANEL_ROUTE,
    auth: true,
    category: SIDEBAR_ENGAGE
  },
  emailEngageItem: {
    url: "/campaigns/email",
    params: "/:campaignId",
    name: "Email campaign",
    rtlName: "لوحة القيادة",
    component: CampaignsItem,
    layout: PANEL_ROUTE,
    auth: true,
    category: SIDEBAR_MAIN
  },
  smsEngage: {
    path: "/campaigns/sms",
    name: "SMS",
    rtlName: "ملف تعريفي للمستخدم",
    icon: PermPhoneMsg,
    component: CampaignsList,
    layout: PANEL_ROUTE,
    auth: true,
    category: SIDEBAR_ENGAGE
  },
  smsEngageItem: {
    url: "/campaigns/sms",
    params: "/:campaignId",
    name: "SMS campaign",
    rtlName: "لوحة القيادة",
    component: CampaignsItem,
    layout: PANEL_ROUTE,
    auth: true,
    category: SIDEBAR_MAIN
  },
  inAppEngage: {
    path: "/campaigns/in-app",
    name: "In-App",
    rtlName: "ملف تعريفي للمستخدم",
    icon: ViewCompact,
    component: CampaignsList,
    layout: PANEL_ROUTE,
    auth: true,
    category: SIDEBAR_ENGAGE
  },
  inAppEngageItem: {
    url: "/campaigns/in-app",
    params: "/:campaignId",
    name: "In-App campaign",
    rtlName: "لوحة القيادة",
    component: CampaignsItem,
    layout: PANEL_ROUTE,
    auth: true,
    category: SIDEBAR_MAIN
  },
  pushEngage: {
    path: "/campaigns/push",
    name: "Push",
    rtlName: "ملف تعريفي للمستخدم",
    icon: ConfirmationNumber,
    component: CampaignsList,
    layout: PANEL_ROUTE,
    auth: true,
    category: SIDEBAR_ENGAGE
  },
  pushEngageItem: {
    url: "/campaigns/push",
    params: "/:campaignId",
    name: "Push campaign",
    rtlName: "لوحة القيادة",
    component: CampaignsItem,
    layout: PANEL_ROUTE,
    auth: true,
    category: SIDEBAR_MAIN
  }
  // rtl: {
  //   path: "/rtl-page",
  //   name: "RTL Support",
  //   rtlName: "پشتیبانی از راست به چپ",
  //   icon: Language,
  //   component: RTLPage,
  //   layout: "/rtl",
  //   auth: true,
  //   category: SIDEBAR_OTHER
  // }
};

const appItem = {
  url: "/app",
  params: "/:appId",
  name: "Common",
  rtlName: "لوحة القيادة",
  component: AppsItem,
  layout: PANEL_ROUTE,
  auth: true,
  category: SIDEBAR_APPLICATION
};

export const appRoutes: { [key: string]: IRoute[] } = {
  common: [
    appItem,
    {
      ...appItem,
      params: "/:appId/:pageName"
    }
  ],
  "1": [
    {
      ...appItem,
      path: "/app/1/overview",
      params: undefined,
      url: undefined,
      icon: ListAltOutlined
    },
    {
      ...appItem,
      path: "/app/1/pictures",
      params: undefined,
      url: undefined,
      name: "Pictures",
      rtlName: "لوحة القيادة",
      icon: Image
    }
  ]
};

export const mainNavRoutes = [dashboardRoutesMap.login];

export default Object.values(dashboardRoutesMap);
