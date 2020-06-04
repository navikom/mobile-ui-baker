import { ERROR_USER_DID_NOT_LOGIN } from 'models/Constants';

export default {
  'auth:wrong-password': 'The password is invalid.',
  'auth:user-not-found': 'User with that credentials does not exist.',
  'auth:invalid-email': 'The email address is badly formatted.',
  'auth:user-exists': 'User already exists with that email.',
  cantBeEmpty: '$ can\'t be empty',
  cantBeLessThan: '%0 can\'t be less than %1 chars',
  cantBeMoreThan: '%0 can\'t be more than %1 chars',
  mustBe: 'Length of %0 must be %1',
  cantBeMoreAndLessThan: '%0 can\'t be more than %1 and less than %2 chars',
  mustBeANumber: '$ must be a number',
  mustBeAnUrl: '$ must be URL',
  invalid: 'The $ is badly formatted.',
  guide1: 'Get Started',
  guide2: 'Guide',
  guide3: 'Make 3 steps to set up and run the application',
  guide4: 'Firebase instance',
  guide1_2: 'Install and run admin panel',
  guide1_3: 'Run admin panel application in dev mode',
  guide1_4: 'Open',
  guide1_5: 'in your favorite browser',
  guide5: 'Developer Environment for React Native',
  guide6: 'Run the application',
  guide7: 'Go to the Firebase console',
  guide8: 'and create a instance.',
  details: 'Details',
  step: 'Step $',
  Build: 'Build',
  openFirebaseConfig: 'Open Firebase config sample',
  occurs: 'occurs',
  custom: 'Custom',
  insertFBCredentials: 'Insert Firebase credentials to the',
  createDatabase: 'Create a database',
  guide9:
    'These are required dependencies to setup a local environment and further, to develop any type of application using it, on your machine.',
  guide10: 'Dependencies required:',
  guide11: 'Note: Note that you have a Node.js version >=10.0 to continue.',
  guide12: 'To setup Native SDKs for specific platforms:',
  guide13: '(install/have Xcode, it is free and most probably pre installed)',
  guide14: '(I’d recommend that you follow instructions',
  guide15: 'here',
  guide16: 'Last step is to install React Native CLI using this command',
  guide17: 'Open $ in your favorite IDE I recommend a ',
  guide18:
    'it has a terminal tab, press it to open a CLI tool or you can open any of CLI tool you are familiar with.',
  guide19: 'Install dependencies',
  guide20: 'Run IOS application',
  guide21:
    'To run the same application in an Android Emulator or device (if connected), you can use the command',
  guide22:
    'You will be prompted with a success message and in a new terminal window, Metro Bundler (developed by Facebook) will be running until the application closes.',
  guide23: 'Press the button to fill the database',
  guide6_1: 'Google map API',
  guide6_2: 'Follow',
  guide6_3: 'to create Google API key',
  guide6_4: 'Follow',
  guide6_5: 'and replace',
  on: 'on',
  runServer: 'Run server, please',
  build: 'Build',
  setUpApp: 'Set up mobile application',
  appName: 'Application name',
  canOnlyContain: '$ can only contain a-z and A-Z',
  users: 'Users',
  user: 'User',
  behavior: 'Behavior',
  technology: 'Technology',
  dashboard: 'Dashboard',
  usersDashboard: 'Users Dashboard',
  eventsDashboard: 'Events Dashboard',
  userDetails: 'User Details',
  userEvents: 'User Events',
  appDetails: '$ Details',
  pictures: 'Pictures',
  picturesDashboard: 'Pictures Dashboard',
  login: 'Login',
  logout: 'Logout',
  LogIn: 'Log in',
  SignUp: 'Sign up',
  doNotHaveAccount: 'Don\'t have an account? Sign Up',
  doYouHaveAccount: 'Do you already have an account? Log in',
  forgotPassword: 'Forgot Password?',
  rememberMe: 'Remember Me',
  repeatPasswordNotEqual: 'Confirm Password is not equal Password',
  repeatNewPasswordNotEqual: 'Confirm Password is not equal New Password',
  password: 'Password',
  newPassword: 'New Password',
  confirmPassword: 'Confirm Password',
  applicationsList: 'List of Applications',
  application: 'Application',
  availableApplications: 'Available Applications',
  campaigns: 'Campaigns',
  segments: 'Segments',
  segment: 'Segment',
  segmentDetails: 'Segment Details',
  total: 'Total',
  campaign: 'Campaign',
  rolesList: 'List of Roles',
  subscriptionsList: 'List of Subscriptions',
  anonymous: 'Anonymous',
  loggedOut: 'Logged Out',
  loggedIn: 'Logged In',
  overview: 'Overview',
  campaignList: 'List of Campaigns',
  segmentsList: 'List of Segments',
  list: 'List',
  analyze: 'Analyze',
  totalPeople: 'Total People',
  knownUsers: 'Known Users',
  monthlyActiveUsers: 'Monthly Active Users (MAU)',
  activity: 'Activity',
  inTodayActivity: '$ in today activity',
  today: 'Today',
  increase: 'Increase',
  decrease: 'Decrease',
  updatedMinutesAgo: 'updated $ minutes ago',
  rowsPerPage: '$ per page',
  rows: 'Rows',
  basicInfo: 'Basic Info',
  attributes: 'Attributes',
  at: 'at',
  devices: 'Devices',
  device: 'Device',
  events: 'Events',
  conversionEvent: 'Conversion Event',
  conversionDeadline: 'Conversion Deadline',
  contact: 'Contact',
  location: 'Location',
  name: 'Name',
  resetAll: 'Reset All',
  reset: 'Reset',
  runType: 'Run Type',
  type: 'Type',
  email: 'Email',
  phone: 'Phone',
  country: 'Country',
  region: 'Region',
  cities: 'Cities',
  state: 'State',
  city: 'City',
  locality: 'Locality',
  timezone: 'Timezone',
  firstSeen: 'First Seen',
  lastSeen: 'Last Seen',
  identified: 'Identified',
  totalEvents: 'Total Events',
  totalTime: 'Total Time',
  unknown: 'Unknown',
  known: 'Known',
  reachable: 'Reachable',
  reachability: 'Reachability',
  apps: 'Apps',
  cannotDetectForThatUser: 'Cannot detect any $ for that user',
  createdAt: 'Created at',
  updatedAt: 'Updated at',
  deletedAt: 'Deleted at',
  subscrExpires: 'Subscription expires',
  title: 'Title',
  action: 'Action',
  clickAction: 'Click Action',
  id: 'Id',
  description: 'Description',
  date: 'Date',
  data: 'Data',
  startDate: 'Start Date',
  nextShipping: 'Next Shipping',
  stopShipping: 'Stop Shipping',
  endDate: 'End Date',
  delivered: 'Delivered',
  deliveryTime: 'Delivery Time',
  uniqueOpens: 'Unique Opens',
  uniqueClicks: 'Unique Clicks',
  uniqueConversions: 'Unique Conversions',
  revenue: 'Revenue',
  status: 'Status',
  screenshots: 'Screenshots',
  preview: 'Preview',
  dragAndDrop: 'Drag and drop an image file here or click',
  uploadMore: 'Upload More',
  save: 'Save',
  enterDescription: 'Enter Description',
  dataSaveError: '%0 save error: %1',
  dataFetchError: '%0 fetch error: %1',
  dataSavedSuccessfully: '$ saved successfully',
  dataDeletedSuccessfully: '$ deleted successfully',
  dataDeleteError: '%0 delete error: %1',
  deepLink: 'Deep Link',
  copied: 'Copied',
  last: 'Last',
  lastChange: 'Last change $',
  nextDue: 'Next Due',
  newApp: 'New App',
  newRole: 'New Role',
  add: 'Add',
  'apps:title must be unique': 'Title must be unique',
  personalData: 'Personal Data',
  doNotHaveReferrals: 'Do not have referrals yet?',
  noReferrals: 'There are no referrals',
  learnMore: 'Learn more',
  credentials: 'Credentials',
  roles: 'Roles',
  referrals: 'Referrals',
  referral: 'Referral',
  firstName: 'First name',
  findUser: 'Find User',
  lastName: 'Last name',
  birthday: 'Birthday',
  webpage: 'Webpage',
  embeddedEditorViewer: 'Embedded Editor/Viewer',
  gender: 'Gender',
  notificationsEmail: 'Email notifications',
  notificationSms: 'SMS notifications',
  subscriptions: 'Subscriptions',
  subscription: 'Subscription',
  permissions: 'Permissions',
  Audience: 'Audience',
  'When to send': 'When to send',
  when: 'When',
  Content: 'Content',
  Conversion: 'Conversion',
  Test: 'Test',
  Launch: 'Launch',
  visitorType: 'Visitor Type',
  usersWhoDidEvents: 'Users who did events',
  usersWhoDidNotDoEvents: 'Users who did not do events',
  'All Users': 'All Users',
  'New Users': 'New Users',
  Returning: 'Returning',
  'No. of Sessions': 'No. of Sessions',
  from: 'from',
  to: 'to',
  min: 'min',
  max: 'max',
  geoLocation: 'Geo Location',
  is: 'is',
  All: 'All',
  userAttributes: 'User Attributes',
  more: 'more',
  and: 'And',
  or: 'Or',
  userId: 'User ID',
  lastEvent: 'Last Event',
  emailVerified: 'Email Verified',
  phoneVerified: 'Phone Verified',
  notificationEmail: 'Notification Email',
  eventsCount: 'Events Count',
  every: 'every',
  uponEventOccurs: 'Upon Event Occurs',
  lastLogin: 'Last Login',
  reachableOn: 'Reachable On',
  notReachableOn: 'Not Reachable On',
  thereIsNoEventsYet: 'There is no events yet',
  appInstallationDate: 'App Installation Date',
  totalTimeSpent: 'Total Time Spent',
  appVersionName: 'App Version Name',
  appId: 'App ID',
  appVersionCode: 'App Version Code',
  advertisingId: 'Advertising ID',
  apiVersion: 'Api Version',
  sdkVersion: 'Sdk Version',
  model: 'Model',
  locale: 'Locale',
  androidId: 'Android ID',
  manufacturer: 'manufacturer',
  brand: 'Brand',
  vendorId: 'Vendor ID',
  saveAndNextStep: 'Save & Next Step',
  usersInSingleSegment: 'Send to users in single segment',
  usersInMultipleSegments: 'Send to users in multiple segments',
  audience: 'Audience',
  sendTo: 'Send To',
  sendTestTo: 'Send Test Message To',
  sendTestLetter: 'Send Test Letter',
  useDataOfSegmentedUsers: 'Use data of segmented users',
  useDataOfChosenUser: 'Use data of another chosen user',
  doNotSentTo: 'Do not sent to',
  include: 'Include',
  exclude: 'Exclude',
  now: 'Now',
  never: 'Never',
  later: 'Later',
  until: 'Until',
  sendAsOccurs: 'Send As Occurs',
  waitFor: 'Wait For',
  andThenSend: 'and then send',
  message: 'Message',
  messages: 'Messages',
  attachments: 'Attachments',
  attach: 'Attach',
  layout: 'Layout',
  launchCampaign: 'Launch Campaign',
  theme: 'Theme',
  advanced: 'Advanced',
  keyValuePair: 'Key-Value Pair',
  keyValuePairs: 'Key-Value Pairs',
  variables: 'Variables',
  back: 'Back',
  subject: 'Subject',
  body: 'Body',
  editor: 'Editor',
  cancel: 'Cancel',
  sendTestEmailLetter:
    'To check how that letter looks in a real email box, enter the email address here. We will send the letter immediately',
  send: 'Send',
  sender: 'Sender',
  structure: 'Structure',
  templates: 'Templates',
  emailContentDidNotSave: 'Email content didn\'t save',
  discardAndClose: 'Discard & Close',
  saveAndClose: 'Save & Close',
  addAttachment: 'Add Attachment',
  conversionTracking: 'Conversion Tracking',
  fromDeliveryMessageToUser: 'from delivery message to user',
  variants: 'Variants',
  testSendMessageDescription:
    'Test your campaigns on an internal segment before you launch your campaign. Please ensure that you only add your own details or your team member’s details to create a test segment.',
  filter: 'Filter',
  textMessage: 'Text message',
  mobileUiEditor: 'Mobile UI Editor',
  getStarted: 'Get Started',
  projectStored: 'instance stored',
  emptyProject: 'empty instance',
  [ERROR_USER_DID_NOT_LOGIN]: 'Please, login to perform this',
  profile: 'Profile',
  iAgreeWithTerms: 'I agree to Terms & Conditions',
  mustAgreeToTerms: 'You must agree to the service terms!',
  viewTerms: 'Terms',
  termsAndConditions: 'Terms & Conditions',
  termsOfService: 'Terms of service',
  support: 'Support',
  iAgree: 'I agree',
  projects: 'Projects',
  access: 'Access',
  shared: 'Shared',
  price: 'Price',
  noProjects: 'There are no saved projects',
  'element-does-not-exist': 'Element does not exist',
  sendEmail: 'Send Email',
  passwordRecovery: 'Password recovery',
  checkYourEmailBox: 'We\'ve sent you an email to recover a password',
  newPasswordWasSaved: 'New password was saved successfully',
  resetPassword: 'Reset Password',
  embeddedToolsDetails: 'Embedded tools details',
  upgrade: 'Upgrade',
  upgraded: 'Upgraded',
  freePlan: 'Free plan',
  plan: 'Plan',
  nextPayment: 'Next Payment (Date)',
  startUpPlan: 'Startup Plan',
  silverPlan: 'Silver Plan',
  goldPlan: 'Gold Plan',
  fullControl: 'Full control',
  goBack: 'Go back',
  viewReceipt: 'View Receipt',
  paymentSuccessful: 'Payment Successful',
  paymentFailed: 'Payment Failed',
  yourAccountWillBeUpgradedToPro: 'Your account will be upgraded to PRO',
  amount: 'Amount',
  cardDetails: 'Card details',
  expirationDate: 'Expiration date',
  cardNumber: 'Card number',
  signUpForFree: 'Sign up for free',
  editorAndViewerInYourApp: 'Mobile Editor & Viewer in your web application',
  mobileDesignAvailableSamples: 'Mobile Design available samples',
  youCanEmbedNowEditorInto: 'You can embed now Editor and Viewer into your web application',
  forBetterExperience: 'for a better experience',
  weAreMuiditor: 'We are MUIDITOR',
  welcomeToBeautiful: 'Welcome to beautiful, fast Mobile UI creation',
  muiditorStandsForBest: 'MUIDITOR stands for "Best Mobile UI CSS based Editor".\n' +
    '            That\'s the ambitious goal that we set for this project.\n' +
    '            Made with lots of passion, MUIDITOR is used both online here\n' +
    '            at Editor and can be embedded in SaaS applications as Editor or/and Viewer',
  muiditorFree: 'MUIDITOR Free',
  noSignUpRequire: 'No signup required. Design a gorgeous Mobile UI instantly. Create, Edit, Save and share projects to attract people',
  muiditorEmbedPlugin: 'MUIDITOR Embed Plugin',
  embedMuiditorEditorAndOrViewer: 'Embed MUIDITOR Editor and/or Viewer to bring awesome Mobile UI creation and showing inside your Web app.',
  muiditorEmbedPluginPro: 'MUIDITOR Embed Plugin Pro',
  upgradeFromFreeToPro: 'Upgrade from Free to Pro to save, edit, copy, organize your Mobile Projects in embedded Editor and Viewer in own way.',
  active: 'Active',
  'data-is-incompatible': 'Data is incompatible to the $',
  project: 'Project',
  control: 'Control',
  component: 'Component',
  owner: 'Owner',
  'read by link': 'Read by link',
  'edit by link': 'Edit by link',
  copyLink: 'Copy link',
  copyKey: 'Copy $',
  copy: 'Copy',
  linkCopied: 'Copied: $',
  securedPaymentBy: 'Secured Payment by',
  with: 'with',
  ifYouAreARegisteredCompany: 'If you are a Registered Company inside the European Union you will be able to add your VAT ID after your Press',
  info: 'Info',
  account: 'Account',
  fullscreen: 'Fullscreen',
  os: 'OS',
  orientation: 'Orientation',
  screenshot: 'Screenshot',
  editorComesWithPrebuilt: 'The Editor comes with pre-built Mobile UI\'s to help you get started faster. You can change the text and images and you\'re good to go. More importantly, looking at them will give you a picture of what you can build with this powerful editor.',
  completedWithExamples: 'Completed with examples',
  dragNDrop: 'Drag & drop editor',
  shareProjects: 'Share projects',
  forReadOrEdit: 'For read or edit',
  youCanStartCollaborate: 'You can start collaborating in real-time. Sharing projects online makes it easier for users to work together, wherever they are. Give people browse your UI Screens with or without edit functionality.',
  embeddedViewer: 'Embedded Viewer',
  previewMobileUIInYour: 'Preview Mobile UI\'s in your we page',
  youNeedToPreviewAMobileInYourSite: 'You need to preview a Mobile design inside a web page on your site. Install an embedded Viewer to do it easily and give your users a rich experience using a Mobile UI that you offer them.',
  key: 'Key',
  secret: 'Secret',
  whatIsMuiditor: 'What\'s MUIDITOR?',
  aboutMuiditor: 'About MUIDITOR',
  isADragNDropEditor: 'MUIDITOR is a drag-n-drop CSS based editor and mobile screens viewer to build and view beautiful Mobile UI, fast.',
  amongBenefits: 'Among benefits:',
  itsFreeToUse: 'It\'s free to use: you don\'t even need to create an account of any kind.',
  itFeaturesADragNDrop: 'It features a drag-and-drop interface that enables anyone to create a nice-looking Mobile UI.',
  youCanChangeMobilePlatformAndOrientation: 'You can change platform, orientation and make screenshots.',
  youCanShareUIForView: 'You can share Mobile UI for view with or without edit access.',
  doYouWantMore: 'Do you want more?',
  youCanEmbedEditorOrViewerInsideWebPage: 'You can embed Editor or/and Viewer inside web page of your site to increase your web application user experience.',
  aboutTheEditor: 'About the Editor.',
  makesItEasyToCreateA: 'MUIDITOR makes it easy to create a Mobile UI that can be used to show pre designed Mobile interface, announce it, promote, etc. You can use it free of charge at',
  projectControlsHowItWorks: 'Project, and Controls: How do they work?',
  generalToolsAndSettingsOfProject: 'General tools and settings of the project.',
  viewElementsToolsAndSettings: 'View elements tools and settings.',
  rightSideToolbar: 'Right-side tool bar',
  leftSideToolbar: 'Left-side tool bar',
  projectTab: 'Project tab',
  inThisTabUsersCanManipulate: 'In this tab users can manipulate a project screens data (save, load, delete, clear), setup general UI settings',
  inControlTabUsersCanChoose: 'In controls tab users can choose Grid or Text element or pre stored component.',
  designFlexibility: 'Design Flexibility',
  oneOfTheBiggestStrength: 'One of the biggest strengths of the Muiditor editor is that it provides creative professionals with tremendous design flexibility.',
  thisIsAchievedBySeparating: 'This is achieved by known HTML elements tree structure and separating the concepts of Grid (which can be added, removed, copied, saved, moved and style edited with CSS property) and Text (individual text blocks: with Grid functionality plus text editing).',
  home: 'Home',
  documentation: 'Documentation',
  controlTab: 'Controls tab',
  grid: 'Grid',
  text: 'Text',
  toUseThemJust: 'To use them, just drag one inside a device view.',
  everyContentBlockHasItsOwn: 'Every Grid block has its owns style based on CSS property. The right-side panel automatically switches to a property panel for the selected Grid element. There element can be adjusted by specific style property, saved, copied or deleted.',
  frequentlyWhenTheMobileUINotSimple: 'Frequently when the Mobile UI is not simple, manipulation of elements inside the device view becomes to be not easy. In that case, the left-side panel is very helpful. It\'s allows manipulating items any of tree size',
  aboutViewer: 'About the Viewer.',
  thisIsAPreviewTool: 'This is a preview tool that consists pre designed in Editor style and actions.',
  whyYouNeedIt: 'Why do you need it?',
  theViewerAllowsShowMobileDesign: 'The Viewer allows show mobile design without access to editor tools.',
  whatIsMuiditorPlugin: 'What is MUIDITOR Plugin?',
  isEmbeddedVersionOfEditor: 'MUIDITOR Plugin is the embeddable version of the MUIDITOR editor and viewer. It was created so that you can take what you see on muiditor.com/editor or muiditor.com/viewer and embed it into an application that you have created, to enable great Mobile UI editing or preview for your users.',
  isAJavaScriptPackage: 'MUIDITOR Plugin is a JavaScript Package that allows you to easily embed the editor or/and viewer into your application. Installing and configuring MUIDITOR Plugin only takes a few minutes.',
  initializeThePlugin: 'Initialize the plugin.',
  getKeyAndSecret: 'Get "key" and "secret".',
  toUsePluginInYourWebPage: 'To initialize the plugin in your web page in order to maintain safety need to get "key" and "secret". Go to the',
  enterYourWebPageUrl: 'enter your web page url, press the "Save" button and after that you will receive "key" and "secret".',
  pluginNpmPackage: 'Plugin NPM package.',
  hereIsALinkToThe: 'Here is the link to the',
  configurationParameters: 'Configuration parameters',
  onceYouHaveInitialized: 'Once you have initialized MUIDITOR Plugin, you can pass a series of configuration parameters to it. The default configuration for MUIDITOR Plugin should be something like the following:',
  hereIsABrief: 'Here is a brief description of the parameters:',
  property: 'Property',
  identifiesTheIdOfTheHtmlElement: 'Identifies the id of the HTML element that contains MUIDITOR Plugin',
  required: 'Required',
  default: 'Default',
  yes: 'Yes',
  no: 'No',
  available: 'Available',
  anAlphanumericString: 'An alphanumeric string that identifies the user and allows the plugin to load resources for that user',
  titleLink: 'Custom title url',
  customTitle: 'Custom title',
  hideMuiditorHeader: 'Hide MUIDITOR header',
  customDictionaryTranslation: 'Custom dictionary translation',
  whatIsProPlan: 'What is Pro Plan?',
  goToGetStarted: 'Go to get started',
  goToPluginProperties: 'Go to Plugin Properties',
  goToPluginOverview: 'Go to the Plugin Overview',
  goToEditorOverview: 'Go to the Editor Overview',
  goToViewerOverview: 'Go to the Viewer Overview',
  goToPluginEditorUsage: 'Go to the plugin Editor usage',
  goToPluginViewerUsage: 'Go to the plugin Viewer usage',
  gotToMethodsAndEvents: 'Got to methods and events',
  gotToProPlan: 'Go to Pro Plan',
  methodsAndEvents: 'Methods & Events',
  instanceMethods: 'Instance Methods',
  instanceEvents: 'Instance Events',
  theseAreTheCallbacksThatAreTriggers: 'These are the callbacks that are triggered when the buttons are clicked.',
  availableProplan: 'Available Pro Plan',
  properties: 'properties',
  methods: 'methods',
  method: 'Method',
  assumingThat: 'Assuming that',
  isTheInstance: 'is the instance of your embedded MUIDITOR plugin, here are the methods you can call',
  methodReturns: 'Method returns promise with',
  by: 'by',
  jsonObjectWithTheProject: 'JSON object with the project structure',
  startsTheEditor: 'Starts the editor',
  startsTheViewer: 'Starts the viewer',
  unmountEventListeners: 'Unmount plugin event listeners',
  ifYouUse: 'If you use a',
  youCanHideTheTopToolbar: 'you can hide the top toolbar and control the editor from your application’s user interface. For example, it’s up to you at that point to have buttons above or below the editor. Here’s some useful parameters for this scenario',
  youCanTriggerTheTopToolbar: 'you can trigger the top toolbar actions and control the editor from your application’s user interface. For example, it’s up to you at that point to have buttons above or below the editor. Here’s some useful methods for this scenario',
  advancedInstanceMethodsAvailableIn: 'Advanced Instance Methods available in Pro Plan',
  advancedParametersAvailableIn: 'Advanced parameters available in Pro Plan',
  switchesDeviceOrientation: 'Switches device orientation',
  setIOSMode: 'Set IOS mode to',
  allowsToSwitchEditorAutoSaveFunctionality: 'Allows to switch editor auto save functionality',
  triggersMakeScreenshotAction: 'Triggers make screenshot action',
  allowsToSetProject: 'Allows to set the project',
  intoTheEditorOrViewer: '(JSON object) into the Editor or Viewer',
  returnedValues: 'Returned values',
  firedWhenJsonLoaded: 'Fired when the JSON is loaded in the editor',
  firedEveryTimeWhenUserMakeSomeChangeInTheProject: 'Fired every time when the user makes some change in the project',
  firedWhenSaveProject: 'Fired when the Save Project button is clicked. In Free Plan user should be logged in',
  firedWhenSaveComponent: 'Fired when the Save Component button is clicked. In Free Plan user should be logged in',
  firedEveryTimeWhenError: 'Fired every time an error occurs',
  firedEveryTimeWhenOrientation: 'Fired every time when a orientation switches',
  firedEveryTimeWhenIos: 'Fired every time when IOS switches',
  allTheFeatures: 'All the features & benefits of the MUIDITOR',
  viewer: 'Viewer',
  plus: 'plus',
  topToolbarCustomization: 'Top toolbar title and title link url customization',
  notRequireUsersToBeLoggedIn: 'Not require users to be logged in when they save project or components',
  theAbilityToHideTheTopToolbar: 'The ability to hide the top toolbar',
  extraUsefulEditorMethodsToHaveFullControl: 'Extra useful Editor methods that gives full control',
  viewerToolbarMethods: 'Viewer toolbar methods to build own custom Viewer management',
  advertisingFreeEditorForAllUsers: 'Advertising-free Editor for all users in your site',
  translateContentOnAnotherLanguage: 'Translate content on another language',
  allOfThisGivesFlexibilityAllowsToCreateOwnMarketplace: 'With Pro Plan you and your users will use editor without Advertising, also, you can customize Editor and Viewer toolbars, untie editor methods to parent muiditor.com database, override saving and switching between projects. All of this will add "Mobile UI creation" user experience into your site and even allows you to create your own Mobile UI\'s Marketplace.',
  grabBelowDictionaryObjectChangeValuesOnYoursAndPass: 'Grab below dictionary object, change values on yours and pass this object with',
  getStartedPluginForEditor: 'Get started plugin for the Editor',
  getStartedPluginForViewer: 'Get started plugin for the Viewer',
  runPluginWithReactJs: 'Run plugin with React.js',
  runPluginWithVanillaJavascript: 'Run plugin with vanilla Javascript',
  createPluginInstance: 'Create plugin instance',
  getTokenAndStartEditor: 'Get token and start editor',
  getTokenAndStartViewer: 'Get token and start viewer',
  completeExample: 'Complete example',
  fetchPluginInScriptTag: 'Fetch plugin in the header script tag',
  simpleRunPluginInsideHtmlFileInScriptTag: 'Simple run plugin inside HTML file in the script tag',
  theSameAsInEditorPlugin: 'The same as in editor plugin',
  goodForPersonalOrDev: 'Good for a personal or development purposes.',
  buildYourStartupOrClient: 'Build your mobile design startup or client app.',
  perfectForWebDesignPortals: 'Perfect for mobile design portals or SaaS projects.',
  deployLargeScaleMarketplaces: 'Deploy large-scale marketplaces with high traffic.',
  embedDragDropEditor: 'Embed Drag & drop editor',
  embedMobileUIViewer: 'Embed Mobile UI Viewer',
  adsFreeEditor: 'Ads-free Editor',
  editorCustomization: 'Editor customization',
  viewerCustomization: 'Viewer customization',
  possibleToHideHeaderWithReplacing: 'Possible to hide header with replacing your own solution to keep a consistent UX or provide custom functionalities.',
  possibleToHideHeaderWithReplacingOverride: 'Possible to hide header with replacing your own solution to keep a consistent UX or provide custom functionalities include override project saving method.',
  includedAPICalls: 'Included API calls',
  pricingIsBasedOnSuccessfulCallsTo: 'Pricing is based on successful calls to the API. A certain number of calls is included in the plan.',
  additionalAPICalls: 'Additional API calls',
  ifInAPreviousMonthYouExceedYour: 'If in a previous month you exceed your included calls, this is the amount you will pay, per call, for API calls in excess of the prepaid number.',
  update: 'Update',
  selectPlan: 'Select Plan',
  perMonth: 'Per Month',
  perUnit: 'Per Unit',
  thereIsNoSuchSubscription: 'There is no such subscription',
  payment: 'Payment',
  afterSubscriptionCancelExtendedWillBe: 'After subscription cancel extended Editor and Viewer functionality will be unavailable. Continue?',
  deleted: 'Deleted',
  past_due: 'Past due',
  receipt: 'Receipt',
  coupon: 'Coupon',
  payments: 'Payments',
  order: 'Order',
  view: 'View',
  totalSpent: 'Total Spent',
  choice: 'Choice',
  byUsingOurWebsite: 'By using our website you agree to our',
  accept: 'Accept',
  privacyPolicy: 'Privacy Policy'
};
