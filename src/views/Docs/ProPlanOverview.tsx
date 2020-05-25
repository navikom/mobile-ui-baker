import React from 'react';
import { Dictionary, DictionaryService } from 'services/Dictionary/Dictionary';
import Typography from '@material-ui/core/Typography';
import { Link } from '@material-ui/core';
import {
  ROUTE_DOCS_EDITOR_OVERVIEW,
  ROUTE_DOCS_PLUGIN_EDITOR,
  ROUTE_DOCS_PLUGIN_METHODS,
  ROUTE_DOCS_PLUGIN_PROPERTIES,
  ROUTE_DOCS_VIEWER_OVERVIEW
} from '../../models/Constants';
import Button from '@material-ui/core/Button';
import { App } from 'models/App';
import Grid from '@material-ui/core/Grid';
import HighlightedCode from 'components/Code/HighlightedCode';
import Code from 'components/Code/Code';

const ProPlanOverview: React.FC = () => {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <React.Fragment>
      <Typography variant="h1">{Dictionary.defValue(DictionaryService.keys.whatIsProPlan)}</Typography>
      <br />
      <br />
      <Typography>
        {Dictionary.defValue(DictionaryService.keys.allTheFeatures)}{' '}
        <Link href={ROUTE_DOCS_EDITOR_OVERVIEW} target="_blank">{Dictionary.defValue(DictionaryService.keys.editor)}</Link>
        {' '}{Dictionary.defValue(DictionaryService.keys.and)}{' '}
        <Link href={ROUTE_DOCS_VIEWER_OVERVIEW} target="_blank">{Dictionary.defValue(DictionaryService.keys.viewer)}</Link>
        {' '}{Dictionary.defValue(DictionaryService.keys.plus)}...
      </Typography>
      <ul>
        <Typography component="li">{Dictionary.defValue(DictionaryService.keys.advertisingFreeEditorForAllUsers)}.</Typography>
        <Typography component="li">{Dictionary.defValue(DictionaryService.keys.topToolbarCustomization)}.</Typography>
        <Typography component="li">{Dictionary.defValue(DictionaryService.keys.theAbilityToHideTheTopToolbar)}.</Typography>
        <Typography component="li">{Dictionary.defValue(DictionaryService.keys.notRequireUsersToBeLoggedIn)}.</Typography>
        <Typography component="li">{Dictionary.defValue(DictionaryService.keys.extraUsefulEditorMethodsToHaveFullControl)}.</Typography>
        <Typography component="li">{Dictionary.defValue(DictionaryService.keys.viewerToolbarMethods)}.</Typography>
      </ul>
      <br />
      <Typography>
        {Dictionary.defValue(DictionaryService.keys.allOfThisGivesFlexibilityAllowsToCreateOwnMarketplace)}.
      </Typography>
      <br />
      <Typography>
        {Dictionary.defValue(DictionaryService.keys.availableProplan)}{' '}
        <Link href={`${ROUTE_DOCS_PLUGIN_PROPERTIES}#pro-plan-properties`}>
          {Dictionary.defValue(DictionaryService.keys.properties)}.
        </Link>
      </Typography>
      <Typography>
        {Dictionary.defValue(DictionaryService.keys.availableProplan)}{' '}
        <Link href={`${ROUTE_DOCS_PLUGIN_METHODS}#advanced-plugin-methods`}>
          {Dictionary.defValue(DictionaryService.keys.methods)}.
        </Link>
      </Typography>
      <br />
      <Typography variant="h2">{Dictionary.defValue(DictionaryService.keys.customDictionaryTranslation)}</Typography>
      <br />
      <Typography>
        {Dictionary.defValue(DictionaryService.keys.grabBelowDictionaryObjectChangeValuesOnYoursAndPass)}{' '}
        <Code>config.dictionary</Code>.
      </Typography>
      <br />
      <HighlightedCode
        content={
          `const dictionary = {
  controls: 'controls',
  components: 'components',
  sharedComponents: 'shared components',
  settings: 'settings',
  screen: 'screen',
  mode: 'mode',
  white: 'white',
  dark: 'dark',
  autoSave: 'auto save',
  save: 'save',
  import: 'import',
  export: 'export',
  background: 'background',
  statusBar: 'status bar',
  backgroundImageDescription: 'The background-image CSS property sets one or more background images on an element',
  displayDescription: 'The display CSS property sets whether an element is treated as a block or inline element and the layout used for its children, such as flow layout, grid or flex.',
  lineHeightDescription: 'The line-height CSS property sets the height of a line box. It\\'s commonly used to set the distance between lines of text. On block-level elements, it specifies the minimum height of line boxes within the element. On non-replaced inline elements, it specifies the height that is used to calculate line box height',
  flexWrapDescription: 'The flex-wrap CSS property sets whether flex items are forced onto one line or can wrap onto multiple lines. If wrapping is allowed, it sets the direction that lines are stacked.',
  textOverflowDescription: 'The text-overflow CSS property sets how hidden overflow content is signaled to users. It can be clipped, display an ellipsis (\\'…\\'), or display a custom string.',
  overflowDescription: 'The overflow shorthand CSS property sets what to do when an element\\'s content is too big to fit in its block formatting context. It is a shorthand for overflow-x and overflow-y.',
  whiteSpaceDescription: 'The white-space CSS property sets how white space inside an element is handled.',
  backgroundSizeDescription: 'The background-size CSS property sets the size of the element\\'s background image. The image can be left to its natural size, stretched, or constrained to fit the available space.',
  borderDescription: 'The border shorthand CSS property sets an element\\'s border. It sets the values of border-width, border-style, and border-color.',
  transformDescription: 'The transform CSS property lets you rotate, scale, skew, or translate an element. It modifies the coordinate space of the CSS visual formatting model.',
  transitionDescription: 'The transition CSS property is a shorthand property for transition-property, transition-duration, transition-timing-function, and transition-delay.',
  transitionPropertyDescription: 'The transition-property CSS property sets the CSS property to which a transition effect should be applied.',
  transitionDurationDescription: 'The transition-duration CSS property sets the length of time a transition animation should take to complete. By default, the value is 0s, meaning that no animation will occur.',
  transitionTimingDescription: 'The transition-timing-function CSS property sets how intermediate values are calculated for CSS property being affected by a transition effect.',
  transitionDelayDescription: 'The transition-delay CSS property specifies the duration to wait before starting a property\\'s transition effect when its value changes.',
  positionDescription: 'The position CSS property sets how an element is positioned in a document. The top, right, bottom, and left property determine the final location of positioned elements.',
  boxShadow: 'The box-shadow CSS property adds shadow effects around an element\\'s frame. You can set multiple effects separated by commas. A box shadow is described by X and Y offsets relative to the element, blur and spread radius, and color',
  flexDirectionDescription: 'The flex-direction CSS property sets how flex items are placed in the flex container defining the main axis and the direction (normal or reversed).',
  learnMore: 'Learn more',
  moreOptions: 'More Options',
  unit: 'unit',
  borders: 'borders',
  dimensions: 'dimensions',
  font: 'font',
  align: 'align',
  alignChildren: 'align children',
  animations: 'animations',
  lockChildren: 'Lock children',
  cloneControl: 'Clone control',
  styles: 'styles',
  actions: 'actions',
  style: 'style',
  action: 'action',
  add: 'add',
  delete: 'delete',
  generate: 'generate',
  switch: 'switch',
  goTo: 'go to',
  onPress: 'on press',
  navigateTo: 'navigate to',
  enableStyle: 'enable style',
  disableStyle: 'disable style',
  toggleStyle: 'toggle style',
  delay: 'delay',
  transition: 'transition',
  elements: 'elements',
  project: 'project',
  reactNativePackage: 'React Native package',
  control: 'control',
  component: 'component',
  makeScreenshot: 'make screenshot',
  deleteWarning: '$ will be deleted forever. Are you sure?',
  clearWarning: '$ data will be cleared forever if data did not save.',
  yes: 'Yes',
  no: 'No',
  toFile: 'to file',
  fromFile: 'from file',
  clear: 'Clear',
  share: 'Share',
  copy: 'Copy',
  usersCan: 'Users can',
  edit: 'Edit',
  read: 'Read',
  owner: 'Owner',
  'read by link': 'Read by link',
  'edit by link': 'Edit by link',
  copyLink: 'Copy link',
  linkTo: 'Link to the',
  copied: 'Copied!',
  fullscreen: 'Fullscreen',
  orientation: 'Orientation',
  current: 'Current',
  next: 'Next',
  navigationAnimations: 'Navigation Animations'
}`
        }
      />
      <br />
      <br />
      <Grid container justify="space-between">
        <Button
          color="primary"
          variant="text"
          onClick={() => App.navigationHistory && App.navigationHistory.push(ROUTE_DOCS_PLUGIN_METHODS)}>
          {Dictionary.defValue(DictionaryService.keys.goToPluginOverview)}
        </Button>
        <Button
          color="primary"
          variant="text"
          onClick={() => App.navigationHistory && App.navigationHistory.push(ROUTE_DOCS_PLUGIN_EDITOR)}>
          {Dictionary.defValue(DictionaryService.keys.goToPluginEditorUsage)}
        </Button>
      </Grid>
    </React.Fragment>
  )
}

export default ProPlanOverview;
