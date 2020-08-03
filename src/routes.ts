// @material-ui/icons
import {
  Dashboard,
  Person,
  CastForEducation,
  People,
  SupervisedUserCircle,
  LinearScaleOutlined,
  DeviceHub,
  Mail,
  PermPhoneMsg,
  ViewCompact,
  ConfirmationNumber,
  PieChart,
  Apps,
  Store,
  Web,
  MenuBook, AccountBalance, AccountBalanceWallet
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
  LAYOUT_EDITOR,
  LAYOUT_DOCS,
  SIDEBAR_DOCS_GET_STARTED,
  SIDEBAR_DOCS_EDITOR,
  SIDEBAR_DOCS_VIEWER, LAYOUT_EMPTY, SIDEBAR_DOCS_PLUGIN
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
const StartPage = lazy(() => import('views/LandingPage/LandingPage'));
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

const Overview = lazy(() => import('views/Docs/Overview'));
const EditorOverview = lazy(() => import('views/Docs/EditorOverview'));
const FigmaConvert = lazy(() => import('views/Docs/FigmaConvert'));
const MuiditorPlugin = lazy(() => import('views/Docs/MuiditorPlugin'));
const EditorPlugin = lazy(() => import('views/Docs/EditorPlugin'));
const EditorSample = lazy(() => import('views/Docs/ProjectSample'));
const ViewerOverview = lazy(() => import('views/Docs/ViewerOverview'));
const ViewerPlugin = lazy(() => import('views/Docs/ViewerPlugin'));
const ProPlanOverview = lazy(() => import('views/Docs/ProPlanOverview'));
const PluginConfigurationParameters = lazy(() => import('views/Docs/PluginConfigurationParameters'));
const PluginMethods = lazy(() => import('views/Docs/PluginMethods'));
const GenerateReactNative = lazy(() => import('views/Docs/GenerateReactNative'));
const SubscriptionsList = lazy(() => import('views/Subscriptions/SubscriptionsList'));
const SubscriptionDetails = lazy(() => import('views/Subscriptions/SubscriptionDetails'));
const TermsAndConditions = lazy(() => import('views/terms/TermsAndConditions'));
const ContactUs = lazy(() => import('views/ContactUs/ContactUs'));

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
  billing: {
    path: '/subscriptions',
    name: 'Billing',
    icon: AccountBalanceWallet,
    component: SubscriptionsList,
    layout: LAYOUT_PANEL,
    category: SIDEBAR_USER,
    auth: true,
  },
  subscriptionDetails: {
    path: '/subscriptions/details',
    params: '/:id',
    name: 'Subscription Details',
    icon: AccountBalance,
    component: SubscriptionDetails,
    layout: LAYOUT_PANEL,
    category: SIDEBAR_USER
  },
  login: {
    path: '/login',
    name: 'login',
    component: Login,
    layout: LAYOUT_EMPTY
  },
  signup: {
    path: '/sign-up',
    name: 'Sign up',
    component: SignUp,
    layout: LAYOUT_EMPTY
  },
  prices: {
    path: '/prices',
    name: 'Prices',
    icon: Store,
    component: Prices,
    layout: LAYOUT_MAIN
  },
  recovery: {
    path: '/recovery',
    name: 'recovery',
    component: Reminder,
    layout: LAYOUT_EMPTY
  },
  resetPassword: {
    path: '/reset',
    params: '/:token',
    name: 'recovery',
    component: ResetPassword,
    layout: LAYOUT_EMPTY,
  },
  editor: {
    path: '/editor',
    name: 'editor',
    icon: Web,
    component: Editor,
    layout: LAYOUT_EDITOR
  },
  editorProject: {
    path: '/editor',
    params: '/:projectId',
    name: 'editor',
    component: Editor,
    layout: LAYOUT_MAIN
  },
  projects: {
    path: '/projects',
    name: 'projects',
    icon: Apps,
    component: Projects,
    layout: LAYOUT_MAIN
  },
  terms: {
    path: '/terms-and-conditions',
    name: 'Terms',
    component: TermsAndConditions,
    layout: LAYOUT_MAIN
  },
  contactUs: {
    path: '/contact-us',
    name: 'Contact Us',
    component: ContactUs,
    layout: LAYOUT_MAIN
  },
  startPageMain: {
    path: '/',
    icon: Apps,
    name: 'Start Page',
    component: StartPage,
    layout: LAYOUT_EMPTY
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
  },
  docs: {
    path: '/',
    name: 'Docs',
    component: Overview,
    layout: LAYOUT_DOCS,
    icon: MenuBook,
    docs: true,
  }
};

export const documentationRoutes = [
  {
    path: '/overview',
    name: 'Overview',
    component: Overview,
    layout: LAYOUT_DOCS,
    category: SIDEBAR_DOCS_GET_STARTED,
    docs: true
  },
  {
    path: '/plugin-overview',
    name: 'FacetsUI Plugin',
    component: MuiditorPlugin,
    layout: LAYOUT_DOCS,
    category: SIDEBAR_DOCS_PLUGIN,
    docs: true
  },
  {
    path: '/plugin-properties',
    name: 'Plugin Properties',
    component: PluginConfigurationParameters,
    layout: LAYOUT_DOCS,
    category: SIDEBAR_DOCS_PLUGIN,
    docs: true
  },
  {
    path: '/plugin-methods',
    name: 'Methods & Events',
    component: PluginMethods,
    layout: LAYOUT_DOCS,
    category: SIDEBAR_DOCS_PLUGIN,
    docs: true
  },
  {
    path: '/pro-plan-overview',
    name: 'Pro Plan',
    component: ProPlanOverview,
    layout: LAYOUT_DOCS,
    category: SIDEBAR_DOCS_PLUGIN,
    docs: true
  },
  {
    path: '/editor-overview',
    name: 'Overview',
    component: EditorOverview,
    layout: LAYOUT_DOCS,
    category: SIDEBAR_DOCS_EDITOR,
    docs: true
  },
  {
    path: '/import-figma',
    name: 'Import from Figma',
    component: FigmaConvert,
    layout: LAYOUT_DOCS,
    category: SIDEBAR_DOCS_EDITOR,
    docs: true
  },
  {
    path: '/editor-sample',
    name: 'Project Example',
    component: EditorSample,
    layout: LAYOUT_DOCS,
    category: SIDEBAR_DOCS_EDITOR,
    docs: true
  },
  {
    path: '/editor-plugin',
    name: 'Editor Plugin',
    component: EditorPlugin,
    layout: LAYOUT_DOCS,
    category: SIDEBAR_DOCS_EDITOR,
    docs: true
  },
  {
    path: '/viewer-overview',
    name: 'Overview',
    component: ViewerOverview,
    layout: LAYOUT_DOCS,
    category: SIDEBAR_DOCS_VIEWER,
    docs: true
  },
  {
    path: '/viewer-plugin',
    name: 'Viewer Plugin',
    component: ViewerPlugin,
    layout: LAYOUT_DOCS,
    category: SIDEBAR_DOCS_VIEWER,
    docs: true
  },
  {
    path: '/generate-rn-code',
    name: 'Generate React Native',
    component: GenerateReactNative,
    layout: LAYOUT_DOCS,
    category: SIDEBAR_DOCS_EDITOR,
    docs: true
  }
];

export const mainNavRoutes =
  [dashboardRoutesMap.projects, dashboardRoutesMap.prices, dashboardRoutesMap.editor, dashboardRoutesMap.docs];

export default Object.values(dashboardRoutesMap);
