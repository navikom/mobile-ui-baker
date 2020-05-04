// @material-ui/icons
import {
  Dashboard,
  Person,
  CastForEducation,
  People,
  Build as BuildIcon,
  SupervisedUserCircle,
  LinearScaleOutlined,
  DeviceHub,
  Mail,
  PermPhoneMsg,
  ViewCompact,
  ConfirmationNumber,
  PieChart, Apps
} from '@material-ui/icons';

import { lazy } from 'utils';
import {
  LAYOUT_MAIN,
  LAYOUT_PANEL,
  SIDEBAR_ENGAGE,
  SIDEBAR_MAIN,
  SIDEBAR_OTHER,
  SIDEBAR_USER,
  ROLE_SUPER_ADMIN,
  ROLE_ADMIN,
  LAYOUT_EMPTY,
  LAYOUT_EDITOR,
  LAYOUT_DOCS,
  SIDEBAR_DOCS_GET_STARTED,
  SIDEBAR_DOCS_EDITOR,
  SIDEBAR_DOCS_VIEWER
} from 'models/Constants';

const DashboardPage = lazy(() => import('views/Dashboard/Dashboard'));
const EventsList = lazy(() => import('views/Events/EventsList'));
const EventsUsersItem = lazy(() => import('views/Events/EventsUsersItem'));
const UserProfile = lazy(() => import('views/UserProfile/UserProfile'));
const UsersList = lazy(() => import('views/Users/UsersList'));
const UsersItem = lazy(() => import('views/Users/UsersItem'));
const RolesList = lazy(() => import('views/Roles/RolesList'));
const Login = lazy(() => import('views/Login/Login'));
const SignUp = lazy(() => import('views/SignUp/SignUp'));
const Reminder = lazy(() => import('views/Reminder/Reminder'));
const ResetPassword = lazy(() => import('views/ResetPassword/ResetPassword'));
const StartPage = lazy(() => import('views/StartPage/StartPage'));
const ProjectsList = lazy(() => import('views/Projects/ProjectsList'));
const ProjectItem = lazy(() => import('views/Projects/ProjectItem'));

const Guide = lazy(() => import('views/Guide/Guide'));
const CampaignsList = lazy(() => import('views/Campaigns/CampaignsList'));
const CampaignsItem = lazy(() => import('views/Campaigns/CampaignsItem'));
const SegmentsList = lazy(() => import('views/Segments/SegmentsList'));
const SegmentsItem = lazy(() => import('views/Segments/SegmentsItem'));

const Editor = lazy(() => import('views/Editor/EditorView'));
const Projects = lazy(() => import('views/Projects/ProjectsView'));
const Prices = lazy(() => import('views/Prices/PricesView'));

const DocContent = lazy(() => import('views/Docs/DocContent'));

const dashboardRoutesMap = {
  guide: {
    path: '/guide',
    name: 'Guide',
    rtlName: 'يرشد',
    icon: CastForEducation,
    component: Guide,
    layout: LAYOUT_PANEL,
    auth: true,
    category: SIDEBAR_OTHER,
    role: ROLE_SUPER_ADMIN
  },
  dashboard: {
    path: '/dashboard',
    name: 'Dashboard',
    rtlName: 'لوحة القيادة',
    icon: Dashboard,
    component: DashboardPage,
    layout: LAYOUT_PANEL,
    auth: true,
    category: SIDEBAR_MAIN,
    role: ROLE_ADMIN
  },
  eventsUsers: {
    path: '/events-users',
    name: 'Events',
    rtlName: 'لوحة القيادة',
    icon: LinearScaleOutlined,
    component: EventsList,
    layout: LAYOUT_PANEL,
    auth: true,
    category: SIDEBAR_MAIN,
    role: ROLE_ADMIN
  },
  eventsUser: {
    url: '/events-users',
    params: '/:userId',
    name: 'Events',
    rtlName: 'لوحة القيادة',
    icon: SupervisedUserCircle,
    component: EventsUsersItem,
    layout: LAYOUT_PANEL,
    category: SIDEBAR_MAIN,
    role: ROLE_ADMIN
  },
  users: {
    path: '/users',
    name: 'Users',
    icon: People,
    rtlName: 'ملف تعريفي للمستخدم',
    component: UsersList,
    layout: LAYOUT_PANEL,
    auth: true,
    role: ROLE_ADMIN,
    category: SIDEBAR_MAIN
  },
  user: {
    url: '/users',
    params: '/:userId',
    name: 'User',
    rtlName: 'ملف تعريفي للمستخدم',
    component: UsersItem,
    layout: LAYOUT_PANEL,
    role: ROLE_ADMIN,
    category: SIDEBAR_MAIN
  },
  roles: {
    path: '/roles',
    name: 'Roles',
    rtlName: 'ملف تعريفي للمستخدم',
    icon: DeviceHub,
    component: RolesList,
    layout: LAYOUT_PANEL,
    auth: true,
    category: SIDEBAR_MAIN,
    role: ROLE_SUPER_ADMIN
  },
  segments: {
    path: '/segments',
    name: 'Segments',
    rtlName: 'ملف تعريفي للمستخدم',
    icon: PieChart,
    component: SegmentsList,
    layout: LAYOUT_PANEL,
    auth: true,
    category: SIDEBAR_MAIN,
    role: ROLE_ADMIN
  },
  segment: {
    url: '/segments',
    params: '/:segmentId',
    name: 'Segment',
    rtlName: 'ملف تعريفي للمستخدم',
    component: SegmentsItem,
    layout: LAYOUT_PANEL,
    role: ROLE_ADMIN,
    category: SIDEBAR_MAIN
  },
  userProfile: {
    path: '/user-profile',
    name: 'Profile',
    rtlName: 'ملف تعريفي للمستخدم',
    icon: Person,
    component: UserProfile,
    layout: LAYOUT_PANEL,
    auth: true,
    category: SIDEBAR_USER
  },
  projectList: {
    path: '/projects',
    name: 'Projects',
    rtlName: 'ملف تعريفي للمستخدم',
    icon: Apps,
    component: ProjectsList,
    layout: LAYOUT_PANEL,
    auth: true,
    category: SIDEBAR_USER
  },
  projectItem: {
    path: '/projects',
    params: '/:id',
    name: 'Project item',
    rtlName: 'ملف تعريفي للمستخدم',
    icon: Person,
    component: ProjectItem,
    layout: LAYOUT_PANEL,
    category: SIDEBAR_USER
  },
  login: {
    path: '/login',
    name: 'login',
    rtlName: 'لوحة الادارة',
    component: Login,
    layout: LAYOUT_EMPTY
  },
  signup: {
    path: '/sign-up',
    name: 'Sign up',
    rtlName: 'لوحة الادارة',
    component: SignUp,
    layout: LAYOUT_EMPTY
  },
  prices: {
    path: '/prices',
    name: 'Prices',
    rtlName: 'لوحة الادارة',
    component: Prices,
    layout: LAYOUT_MAIN
  },
  recovery: {
    path: '/recovery',
    name: 'recovery',
    rtlName: 'لوحة الادارة',
    component: Reminder,
    layout: LAYOUT_MAIN
  },
  resetPassword: {
    path: '/reset',
    params: '/:token',
    name: 'recovery',
    rtlName: 'لوحة الادارة',
    component: ResetPassword,
    layout: LAYOUT_EMPTY,
  },
  editor: {
    path: '/editor',
    name: 'editor',
    rtlName: 'لوحة الادارة',
    component: Editor,
    layout: LAYOUT_EDITOR
  },
  editorProject: {
    path: '/editor',
    params: '/:projectId',
    name: 'editor',
    rtlName: 'لوحة الادارة',
    component: Editor,
    layout: LAYOUT_MAIN
  },
  projects: {
    path: '/projects',
    name: 'projects',
    rtlName: 'لوحة الادارة',
    component: Projects,
    layout: LAYOUT_MAIN
  },
  startPage: {
    path: '/start-page',
    name: 'Start Page',
    rtlName: 'لوحة الادارة',
    component: StartPage,
    layout: LAYOUT_MAIN
  },
  startPageMain: {
    path: '/',
    name: 'Start Page',
    rtlName: 'لوحة الادارة',
    component: StartPage,
    layout: LAYOUT_MAIN
  },
  emailEngage: {
    path: '/campaigns/email',
    name: 'Email',
    rtlName: 'ملف تعريفي للمستخدم',
    icon: Mail,
    component: CampaignsList,
    layout: LAYOUT_PANEL,
    auth: true,
    role: ROLE_ADMIN,
    category: SIDEBAR_ENGAGE
  },
  emailEngageItem: {
    url: '/campaigns/email',
    params: '/:campaignId',
    name: 'Email campaign',
    rtlName: 'لوحة القيادة',
    component: CampaignsItem,
    layout: LAYOUT_PANEL,
    role: ROLE_ADMIN,
    category: SIDEBAR_MAIN
  },
  smsEngage: {
    path: '/campaigns/sms',
    name: 'SMS',
    rtlName: 'ملف تعريفي للمستخدم',
    icon: PermPhoneMsg,
    component: CampaignsList,
    auth: true,
    layout: LAYOUT_PANEL,
    role: ROLE_ADMIN,
    category: SIDEBAR_ENGAGE
  },
  smsEngageItem: {
    url: '/campaigns/sms',
    params: '/:campaignId',
    name: 'SMS campaign',
    rtlName: 'لوحة القيادة',
    component: CampaignsItem,
    layout: LAYOUT_PANEL,
    role: ROLE_ADMIN,
    category: SIDEBAR_MAIN
  },
  inAppEngage: {
    path: '/campaigns/in-app',
    name: 'In-App',
    rtlName: 'ملف تعريفي للمستخدم',
    icon: ViewCompact,
    component: CampaignsList,
    auth: true,
    layout: LAYOUT_PANEL,
    role: ROLE_ADMIN,
    category: SIDEBAR_ENGAGE
  },
  inAppEngageItem: {
    url: '/campaigns/in-app',
    params: '/:campaignId',
    name: 'In-App campaign',
    rtlName: 'لوحة القيادة',
    component: CampaignsItem,
    layout: LAYOUT_PANEL,
    role: ROLE_ADMIN,
    category: SIDEBAR_MAIN
  },
  pushEngage: {
    path: '/campaigns/push',
    name: 'Push',
    rtlName: 'ملف تعريفي للمستخدم',
    icon: ConfirmationNumber,
    component: CampaignsList,
    auth: true,
    layout: LAYOUT_PANEL,
    role: ROLE_ADMIN,
    category: SIDEBAR_ENGAGE
  },
  pushEngageItem: {
    url: '/campaigns/push',
    params: '/:campaignId',
    name: 'Push campaign',
    rtlName: 'لوحة القيادة',
    component: CampaignsItem,
    layout: LAYOUT_PANEL,
    role: ROLE_ADMIN,
    category: SIDEBAR_MAIN
  }
};

export const documentationRoutes = [
  {
    path: '/get-started',
    name: 'Getting started',
    component: DocContent,
    layout: LAYOUT_DOCS,
    category: SIDEBAR_DOCS_GET_STARTED,
    docs: true
  },
  {
    path: '/editor-overview',
    name: 'Editor overview',
    component: DocContent,
    layout: LAYOUT_DOCS,
    category: SIDEBAR_DOCS_EDITOR,
    docs: true
  },
  {
    path: '/viewer-overview',
    name: 'Viewer overview',
    component: DocContent,
    layout: LAYOUT_DOCS,
    category: SIDEBAR_DOCS_VIEWER,
    docs: true
  }
];

export const mainNavRoutes =
  [dashboardRoutesMap.projects, dashboardRoutesMap.prices, dashboardRoutesMap.editor, dashboardRoutesMap.login];
export const mainNavRoutesLoggedIn = [
  dashboardRoutesMap.projects, dashboardRoutesMap.prices, dashboardRoutesMap.editor, dashboardRoutesMap.userProfile];

export default Object.values(dashboardRoutesMap);
