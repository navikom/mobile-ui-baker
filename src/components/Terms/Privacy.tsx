import React from 'react';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import useStyles from './privacyStyles';

const Privacy = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Typography>Your privacy is critically important to us.</Typography>
      <br />
      <Typography>
        It is FacetsUI{'\''}s policy to respect your privacy regarding any information we may
        collect while operating our website. This Privacy Policy applies to
        <Link href="https://facetsui.com"> https://facetsui.com </Link>
        (hereinafter, {'"'}us{'"'}, {'"'}we{'"'}, or {'"'}https://facetsui.com{'"'}).
        We respect your privacy and are committed to protecting personally identifiable information you may
        provide us through the Website. We have adopted this privacy policy ({'"'}Privacy Policy{'"'}) to explain
        what information may be collected on our Website, how we use this information, and under what
        circumstances we may disclose the information to third parties. This Privacy Policy applies only to
        information we collect through the Website and does not apply to our collection of information from other sources.
      </Typography>
      <br />
      <Typography>
        This Privacy Policy, together with the Terms and conditions posted on our Website, set forth the general
        rules and policies governing your use of our Website. Depending on your activities when visiting our Website,
        you may be required to agree to additional terms and conditions.
      </Typography>

      {
        [
          ['Website Visitors', [
            'Like most website operators, FacetsUI collects non-personally-identifying information of the sort that web browsers and servers typically make available, such as the browser type, language preference, referring site, and the date and time of each visitor request. FacetsUI\'s purpose in collecting non-personally identifying information is to better understand how FacetsUI\'s visitors use its website. From time to time, FacetsUI may release non-personally-identifying information in the aggregate, e.g., by publishing a report on trends in the usage of its website.',
            'FacetsUI also collects potentially personally-identifying information like Internet Protocol (IP) addresses for logged in users and for users leaving comments on https://facetsui.com blog posts. FacetsUI only discloses logged in user and commenter IP addresses under the same circumstances that it uses and discloses personally-identifying information as described below.',
          ]],
          ['Gathering of Personally-Identifying Information', [
            'Certain visitors to FacetsUI\'s websites choose to interact with FacetsUI in ways that require FacetsUI to gather personally-identifying information. The amount and type of information that FacetsUI gathers depends on the nature of the interaction. For example, we ask visitors who sign up for a blog at https://facetsui.com to provide a username and email address.'
          ]],
          ['Security', [
            'The security of your Personal Information is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Information, we cannot guarantee its absolute security.'
          ]],
          ['Advertisements', [
            'Ads appearing on our website may be delivered to users by advertising partners, who may set cookies. These cookies allow the ad server to recognize your computer each time they send you an online advertisement to compile information about you or others who use your computer. This information allows ad networks to, among other things, deliver targeted advertisements that they believe will be of most interest to you. This Privacy Policy covers the use of cookies by FacetsUI and does not cover the use of cookies by any advertisers.'
          ]],
          ['Links To External Sites', [
            'Our Service may contain links to external sites that are not operated by us. If you click on a third party link, you will be directed to that third party\'s site. We strongly advise you to review the Privacy Policy and terms and conditions of every site you visit.',
            'We have no control over, and assume no responsibility for the content, privacy policies or practices of any third party sites, products or services.'
          ]],
          ['https://facetsui.com uses Google AdWords for remarketing', [
            'https://facetsui.com uses the remarketing services to advertise on third party websites (including Google) to previous visitors to our site. It could mean that we advertise to previous visitors who haven\'t completed a task on our site, for example using the contact form to make an enquiry. This could be in the form of an advertisement on the Google search results page, or a site in the Google Display Network. Third-party vendors, including Google, use cookies to serve ads based on someone\'s past visits. Of course, any data collected will be used in accordance with our own privacy policy and Google\'s privacy policy.',
            'You can set preferences for how Google advertises to you using the Google Ad Preferences page, and if you want to you can opt out of interest-based advertising entirely by cookie settings or permanently using a browser plugin.'
          ]],
          ['Aggregated Statistics', [
            'FacetsUI may collect statistics about the behavior of visitors to its website. FacetsUI may display this information publicly or provide it to others. However, FacetsUI does not disclose your personally-identifying information.'
          ]],
          ['Cookies', [
            'To enrich and perfect your online experience, FacetsUI uses "Cookies", similar technologies and services provided by others to display personalized content, appropriate advertising and store your preferences on your computer.',
            'A cookie is a string of information that a website stores on a visitor\'s computer, and that the visitor\'s browser provides to the website each time the visitor returns. FacetsUI uses cookies to help FacetsUI identify and track visitors, their usage of https://facetsui.com, and their website access preferences. FacetsUI visitors who do not wish to have cookies placed on their computers should set their browsers to refuse cookies before using FacetsUI\'s websites, with the drawback that certain features of FacetsUI\'s websites may not function properly without the aid of cookies.',
            'By continuing to navigate our website without changing your cookie settings, you hereby acknowledge and agree to FacetsUI\'s use of cookies.'
          ]],
          ['Privacy Policy Changes', [
            'Although most changes are likely to be minor, FacetsUI may change its Privacy Policy from time to time, and in FacetsUI\'s sole discretion. FacetsUI encourages visitors to frequently check this page for any changes to its Privacy Policy. Your continued use of this site after any change in this Privacy Policy will constitute your acceptance of such change.'
          ]]
        ].map((prop, i) => (
          <div key={i.toString()}>
            <br />
            <br />
            <Typography  variant="subtitle1">{prop[0]}</Typography>
            <br />
            {
              (prop[1] as string[]).map((item, j) => (
                <Typography key={i + '' + j}>{item}</Typography>
              ))
            }
          </div>
        ))
      }
    </div>
  )
}

export default Privacy;
