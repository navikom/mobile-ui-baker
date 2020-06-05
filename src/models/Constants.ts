//******** Routes *********//

import {
  DateExpressionTypesArray,
  ExpressionValueType,
  IncludingExpressionTypesArray,
  NumberExpressionTypesArray,
  StringExpressionTypesArray
} from 'types/expressions';
import {
  EmailType,
  GenderExpressionTypesArray,
  InAppType,
  PushType,
  SmsType
} from 'types/commonTypes';
import { TestSegmentPropertyType } from 'interfaces/ITestStep';

//********* Main *************//
export const TITLE = 'Muiditor';
export const MODE_DEVELOPMENT = 'development';

//********* Routes ***********//
export const ROUTE_ROOT = '/';
export const LAYOUT_PANEL = '/panel';
export const LAYOUT_DOCS = '/docs';
export const ROUTE_DOCS_GET_STARTED = '/docs/overview';
export const ROUTE_DOCS_PLUGIN = '/docs/plugin-overview';
export const ROUTE_DOCS_PRO_PLAN = '/docs/pro-plan-overview';
export const ROUTE_DOCS_PLUGIN_PROPERTIES = '/docs/plugin-properties';
export const ROUTE_DOCS_PLUGIN_METHODS = '/docs/plugin-methods';
export const ROUTE_DOCS_PLUGIN_EDITOR = '/docs/plugin-editor';
export const ROUTE_DOCS_PLUGIN_VIEWER = '/docs/plugin-viewer';
export const ROUTE_DOCS_EDITOR_OVERVIEW = '/docs/editor-overview';
export const ROUTE_DOCS_VIEWER_OVERVIEW = '/docs/viewer-overview';
export const LAYOUT_MAIN = '/main';
export const LAYOUT_EDITOR = '/editor';
export const LAYOUT_EMPTY = '/empty';
export const ROUTE_DASHBOARD = '/panel/dashboard';
export const ROUTE_USER_PROFILE = '/panel/user-profile';
export const ROUTE_BILLING = '/panel/subscriptions';
export const ROUTE_SUBSCRIPTION_DETAILS = '/panel/subscriptions/details';
export const ROUTE_TERMS = '/terms-and-conditions';
export const ROUTE_CONTACT_US = '/contact-us';
export const ROUTE_EVENTS_USERS_LIST = '/panel/events-users';
export const ROUTE_USERS_LIST = '/panel/users';
export const ROUTE_PROJECTS_LIST = '/panel/projects';
export const ROUTE_LOGIN = '/login';
export const ROUTE_SIGN_UP = '/sign-up';
export const ROUTE_EMAIL_CAMPAIGNS = '/panel/campaigns/email';
export const ROUTE_SMS_CAMPAIGNS = '/panel/campaigns/sms';
export const ROUTE_IN_APP_CAMPAIGNS = '/panel/campaigns/in-app';
export const ROUTE_PUSH_CAMPAIGNS = '/panel/campaigns/push';
export const ROUTE_EDITOR = '/editor';
export const ROUTE_VIEWER = '/viewer';
export const ROUTE_SCREENS = '/screens';
export const ROUTE_PROJECTS = '/projects';
export const ROUTE_PRICES = '/prices';
export const ROUTE_RECOVERY = '/recovery';
export const ROUTE_RESET = '/reset';
export const ROUTE_CHECKOUT = '/subscribeToPlan';

//********* Roles **********//
export const ROLE_USER = 3;
export const ROLE_ADMIN = 2;
export const ROLE_SUPER_ADMIN = 1;

//********* Sidebar Categories *********//
export const SIDEBAR_MAIN = 'Main';
export const SIDEBAR_OTHER = 'Other';
export const SIDEBAR_USER = 'User';
export const SIDEBAR_ENGAGE = 'Campaign';

//********** Sidebar Documentation Categories *******//
export const SIDEBAR_DOCS_GET_STARTED = 'Getting Started';
export const SIDEBAR_DOCS_PLUGIN = 'Plugin';
export const SIDEBAR_DOCS_EDITOR = 'Editor';
export const SIDEBAR_DOCS_VIEWER = 'Viewer';

//********* Campaign Channels **********//
export const SMS_CAMPAIGN = 'SMS';
export const EMAIL_CAMPAIGN = 'Email';
export const IN_APP_CAMPAIGN = 'In App';
export const PUSH_CAMPAIGN = 'Push';
export const EMAIL_CHANNEL: EmailType = 1;
export const SMS_CHANNEL: SmsType = 2;
export const IN_APP_CHANNEL: InAppType = 3;
export const PUSH_CHANNEL: PushType = 4;
export const CHANNEL_LIST = [
  [EMAIL_CHANNEL, EMAIL_CAMPAIGN],
  [SMS_CHANNEL, SMS_CAMPAIGN],
  [IN_APP_CHANNEL, IN_APP_CAMPAIGN],
  [PUSH_CHANNEL, PUSH_CAMPAIGN]
];

//********* Campaign Run Type *****//
export const ONE_TIME_RUN_TYPE = 1;
export const TRIGGER_RUN_TYPE = 2;
export const RECURRING_RUN_TYPE = 3;
export const ONE_TIME_RUN = 'One Time Run';
export const TRIGGER_RUN = 'Trigger Run';
export const RECURRING_RUN = 'Recurring Run';

//********* Campaign Steps ********//
export const AUDIENCE_CAMPAIGN_STEP = 'Audience';
export const WHEN_TO_SEND_CAMPAIGN_STEP = 'When to send';
export const CONTENT_CAMPAIGN_STEP = 'Content';
export const CONVERSION_CAMPAIGN_STEP = 'Conversion';
export const TEST_CAMPAIGN_STEP = 'Test';
export const LAUNCH_CAMPAIGN_STEP = 'Launch';

//######### Campaign Time Zones ****//
export const USERS_TIME_ZONE = 'Users Time Zone';
export const APP_TIME_ZONE = 'App Time Zone';

//********** Others ************//
export const ALL = 'All';
export const VARIABLES = 'VARIABLES';
export const ANDROID = 'Android';
export const IOS = 'IOS';
export const TABS_HEIGHT = 77;
export const CSS_VALUE_STRING = 'string';
export const CSS_VALUE_NUMBER = 'number';
export const CSS_VALUE_COLOR = 'color';
export const CSS_VALUE_SELECT = 'select';

//********** Expressions *********//
export const AND = 'and';
export const OR = 'or';

//********** Errors ************//
export const ERROR_USER_DID_NOT_LOGIN = 'user-did-not-login';
export const ERROR_ACCESS_DENIED = 'access-denied';
export const ERROR_PROJECT_DOES_NOT_EXIST = 'project-does-not-exist';
export const ERROR_DATA_IS_INCOMPATIBLE = 'data-is-incompatible';
export const ERROR_ELEMENT_DOES_NOT_EXIST = 'element-does-not-exist';
export const ERROR_PAYMENT_FAILED = 'payment-failed';

//********** Days **************//
export const DaysOfWeek = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
];

//********** Time Periods ***********//
export const ConversionTimePeriods = ['Hours', 'Days'];
export const TimePeriods = ['Minutes', 'Days', 'Weeks', 'Months'];
export const OccurrenceTimePeriods = ['Day', 'Week', 'Month'];

//********** Period Amount *********//
export const PeriodAmount = {
  [TimePeriods[0]]: 1000 * 60,
  [TimePeriods[1]]: 1000 * 60 * 60,
  [TimePeriods[2]]: 1000 * 60 * 60 * 24,
  [TimePeriods[3]]: 1000 * 60 * 60 * 24 * 30
};

//********** Visitor Type *******//
export const VisitorTypeList = [
  'All Users',
  'New Users',
  'Returning',
  'No. of Sessions'
];

//********* User Attributes Events **********//
export const UserOptions = [
  'User Attributes',
  'User System Events',
  'User Custom Events'
];

//********* Test Property Names *****//
export const TestPropertyNames: TestSegmentPropertyType[] = [
  'userId',
  'email',
  'phone'
];

//********* System Events Main Properties ******//
export const SystemEventsMainProperties = ['Date', 'App', 'Device', 'Region'];

//********** Expressions ********//
export const NumberExpressions: NumberExpressionTypesArray = [
  'greater than',
  'less than',
  'equal to',
  'does not equal to',
  'is greater than or equal to',
  'is less than or equal to',
  'between',
  'not between',
  'one of',
  'none one of',
  'is empty',
  'is not empty'
];
export const StringExpressions: StringExpressionTypesArray = [
  'equal to',
  'does not equal to',
  'one of',
  'none one of',
  'ends with',
  'does not end with',
  'starts with',
  'does not start with',
  'contains',
  'is empty',
  'is not empty'
];
export const ContainsExpressions: IncludingExpressionTypesArray = [
  'include',
  'exclude'
];
export const DateExpressions: DateExpressionTypesArray = [
  'before',
  'after',
  'withing'
];
export const GenderExpressions: GenderExpressionTypesArray = ['Male', 'Female'];
export const OccurExpressions = ['at least once', 'not once', 'amount'];

//********** User Attributes ******//
export const UserAttributes = [
  'userId',
  'createdAt',
  'updatedAt',
  'deletedAt',
  'lastEvent',
  'email',
  'referrer',
  'firstName',
  'lastName',
  'phone',
  'gender',
  'birthday',
  'emailVerified',
  'phoneVerified',
  'notificationEmail',
  'notificationSms',
  'subscription',
  'anonymous',
  'eventsCount',
  'lastLogin'
];

//********** Reachability Expressions ******//
export const ReachabilityExpressions = ['reachableOn', 'notReachableOn'];

//********** Device Properties **********//
export const DeviceProperties = [
  'appInstallationDate',
  'lastSeen',
  'totalTimeSpent',
  'appVersionName',
  'appId',
  'appVersionCode',
  'advertisingId',
  'apiVersion',
  'sdkVersion',
  'model',
  'locale'
];
export const AndroidDeviceProperties = ['androidId', 'manufacturer', 'brand'];
export const IOSDeviceProperties = ['vendorId'];

//********** Expressions Map ********//
export const DateExpressionsMap = new Map<string, ExpressionValueType>([
  [DateExpressions[0], { key: 'date', defaultValue: new Date() }],
  [DateExpressions[1], { key: 'date', defaultValue: new Date() }],
  [
    DateExpressions[2],
    { keys: ['from', 'to'], defaultValues: [new Date(), new Date()] }
  ]
]);
export const NumberExpressionsMap: Map<string,
  ExpressionValueType | undefined> = new Map<string, ExpressionValueType | undefined>([
  [NumberExpressions[0], { key: 'value', defaultValue: 0 }],
  [NumberExpressions[1], { key: 'value', defaultValue: 1 }],
  [NumberExpressions[2], { key: 'value', defaultValue: 1 }],
  [NumberExpressions[3], { key: 'value', defaultValue: 1 }],
  [NumberExpressions[4], { key: 'value', defaultValue: 1 }],
  [NumberExpressions[5], { key: 'value', defaultValue: 1 }],
  [NumberExpressions[6], { keys: ['min', 'max'], defaultValues: [0, 2] }],
  [NumberExpressions[7], { keys: ['min', 'max'], defaultValues: [0, 2] }],
  [NumberExpressions[8], { key: 'values', defaultValues: [1] }],
  [NumberExpressions[9], { key: 'values', defaultValues: [1] }],
  [NumberExpressions[10], undefined],
  [NumberExpressions[11], undefined]
]);
export const StringExpressionsMap: Map<string,
  ExpressionValueType | undefined> = new Map<string, ExpressionValueType | undefined>([
  [StringExpressions[0], { key: 'value', defaultValue: '' }],
  [StringExpressions[1], { key: 'value', defaultValue: '' }],
  [StringExpressions[2], { key: 'values', defaultValues: [] }],
  [StringExpressions[3], { key: 'value', defaultValues: [] }],
  [StringExpressions[4], { key: 'value', defaultValue: '' }],
  [StringExpressions[5], { key: 'value', defaultValue: '' }],
  [StringExpressions[6], { key: 'value', defaultValue: '' }],
  [StringExpressions[7], { key: 'value', defaultValue: '' }],
  [StringExpressions[8], { key: 'value', defaultValue: '' }],
  [StringExpressions[9], undefined],
  [StringExpressions[10], undefined]
]);
export const GenderExpressionsMap = new Map<string, undefined>([
  [GenderExpressions[0], undefined],
  [GenderExpressions[1], undefined]
]);

export const UserAttributeMap: Map<string,
  Map<string, ExpressionValueType | undefined> | undefined> = new Map([
  [UserAttributes[0], NumberExpressionsMap],
  [UserAttributes[1], DateExpressionsMap],
  [UserAttributes[2], DateExpressionsMap],
  [UserAttributes[3], DateExpressionsMap],
  [UserAttributes[4], DateExpressionsMap],
  [UserAttributes[5], StringExpressionsMap],
  [UserAttributes[6], NumberExpressionsMap],
  [UserAttributes[7], StringExpressionsMap],
  [UserAttributes[8], StringExpressionsMap],
  [UserAttributes[9], StringExpressionsMap],
  [UserAttributes[10], GenderExpressionsMap],
  [UserAttributes[11], DateExpressionsMap],
  [UserAttributes[12], undefined],
  [UserAttributes[13], undefined],
  [UserAttributes[14], undefined],
  [UserAttributes[15], undefined],
  [UserAttributes[16], undefined],
  [UserAttributes[17], undefined],
  [UserAttributes[18], NumberExpressionsMap],
  [UserAttributes[19], DateExpressionsMap]
]);

export const OccurExpressionsMap: Map<string,
  Map<string, ExpressionValueType | undefined> | undefined> = new Map([
  [OccurExpressions[0], undefined],
  [OccurExpressions[1], undefined],
  [OccurExpressions[2], NumberExpressionsMap]
]);

const DevicePropertiesArray: [
  string,
  Map<string, ExpressionValueType | undefined> | undefined
][] = [
  [DeviceProperties[0], DateExpressionsMap],
  [DeviceProperties[1], DateExpressionsMap],
  [DeviceProperties[2], NumberExpressionsMap],
  [DeviceProperties[3], StringExpressionsMap],
  [DeviceProperties[4], StringExpressionsMap],
  [DeviceProperties[5], NumberExpressionsMap],
  [DeviceProperties[6], NumberExpressionsMap],
  [DeviceProperties[7], NumberExpressionsMap],
  [DeviceProperties[8], NumberExpressionsMap],
  [DeviceProperties[9], StringExpressionsMap],
  [DeviceProperties[10], StringExpressionsMap]
];

export const AndroidPropertiesMap: Map<string,
  Map<string, ExpressionValueType | undefined> | undefined> = new Map([
  ...DevicePropertiesArray,
  [AndroidDeviceProperties[0], NumberExpressionsMap],
  [AndroidDeviceProperties[1], StringExpressionsMap],
  [AndroidDeviceProperties[2], StringExpressionsMap]
]);

export const IOSPropertiesMap: Map<string,
  Map<string, ExpressionValueType | undefined> | undefined> = new Map([
  ...DevicePropertiesArray,
  [IOSDeviceProperties[0], NumberExpressionsMap]
]);

//********** CSS EDITOR ******//
export const CSS_CAT_BACKGROUND = 'background';
export const CSS_CAT_BORDERS = 'borders';
export const CSS_CAT_DIMENSIONS = 'dimensions';
export const CSS_CAT_FONT = 'font';
export const CSS_CAT_ALIGN = 'align';
export const CSS_CAT_ALIGN_CHILDREN = 'alignChildren';
export const CSS_CAT_ANIMATIONS = 'animations';
export const CSS_CATEGORIES = [CSS_CAT_BACKGROUND, CSS_CAT_BORDERS, CSS_CAT_DIMENSIONS, CSS_CAT_FONT, CSS_CAT_ALIGN,
  CSS_CAT_ALIGN_CHILDREN, CSS_CAT_ANIMATIONS];
export const ACTION_NAVIGATE_TO = 'navigateTo';
export const ACTION_ENABLE_STYLE = 'enableStyle';
export const ACTION_DISABLE_STYLE = 'disableStyle';
export const ACTION_TOGGLE_STYLE = 'toggleStyle';
export const EDITOR_ACTIONS = [ACTION_NAVIGATE_TO, ACTION_ENABLE_STYLE, ACTION_DISABLE_STYLE, ACTION_TOGGLE_STYLE];

//********** PAYMENT *********//
export const PAYMENT_TITLE_UPGRADE = 'Upgrade plan';

//********** EDITOR ***********//
export const FIRST_CONTAINER = 'first-container';
export const SECOND_CONTAINER = 'second-container';

//********** SUBSCRIPTION PADDLE STATUS *****//
export const SUBSCRIPTION_PADDLE_STATUS_ACTIVE = 'active';
export const SUBSCRIPTION_PADDLE_STATUS_PAST_DUE = 'past_due';
export const SUBSCRIPTION_PADDLE_STATUS_DELETED = 'deleted';

//********** TERMS AND CONDITIONS **********//
export const TERMS_OF_SERVICE = 'terms-of-service';
export const PRIVACY_POLICY = 'privacy-policy';
export const TERMS_OF_SUPPORT = 'terms-of-support';
export const EULA = 'eula'
