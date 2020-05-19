import React from 'react';
import Typography from '@material-ui/core/Typography';
import useStyles from './Privacy';

const defintitions = [
  ['Access Credentials', 'means any user name, identification number, password, license or security key, security token, PIN or other security code, method, technology or device used, alone or in combination, to verify an individual’s identity and authorization to access and use the Hosted Services.'],
  ['Additional Features', 'means any additional features or tools that can be optionally added upon Client’s request to the Subscription Plan.'],
  ['Additional Features Fees', 'means any fees for any Additional Features as listed on the pricing page on the Muiditor Prices site at https://muiditor.com/prices'],
  ['Affiliates', 'means any person, corporation, or other legal entity that, directly or indirectly, controls, is controlled by, or is under common control with Muiditor. For this purpose, “control” shall mean (i) possession, direct or indirect, of the power to direct or cause direction of the management and policies of a party, whether through voting securities, by contract or other means; and/or (ii) ownership, directly or indirectly, of more than fifty percent (50%) of the outstanding equity or voting shares of a party.'],
  ['Agreement', 'means these terms and conditions.'],
  ['Authorized User', 'means each of the professional users authorized to use the Services pursuant to Section 2.1 and the other terms and conditions of this Agreement, and solely in connection with Authorized User professional business and for purposes related thereto.'],
  ['Billing Period', 'Means the interval of time selected by Client from the end of one billing statement date to the next billing statement date.'],
  ['Client Data', 'means, other than Resultant Data, information, data and other content, in any form or medium, that is collected, downloaded or otherwise received, directly or indirectly from Client or an Authorized User by or through the Services.'],
  ['Client Systems', 'means the Client’s information technology infrastructure, including computers, software, hardware, databases, electronic systems (including database management systems) and networks, whether operated directly by Client or through the use of third-party services.'],
  ['Documentation', 'means documentation provided by Muiditor in electronic format to the Client.'],
  ['Effective Date', 'means the date this Agreement comes into effect, as notified by Muiditor to the Client with an email sent to the email address provided by the Client in the Registration Form and that the Client declares to periodically check.'],
  ['Fees', 'A periodic fee equal to the sum of Subscription Fees, Hosting Fees and Additional Features Fees, computed and charged to the Client’s payment account at the time of Renewal or pro rata at the time of purchase.'],
  ['Harmful Code', 'means any software, hardware or other technology, device or means, including any virus, worm, malware or other malicious computer code, the purpose or effect of which is to (a) permit unauthorized access to, or to destroy, disrupt, disable, distort, or otherwise harm or impede in any manner any (i) computer, software, firmware, hardware, system or network or (ii) any application or function of any of the foregoing or the security, integrity, confidentiality or use of any data Processed thereby, or (b) prevent Client or any Authorized User from accessing or using the Services or Muiditor Systems as intended by this Agreement. Harmful Code does not include any Muiditor Disabling Device.'],
  ['Intellectual Property', 'means all current and future worldwide copyright, patents, utility models industrial designs, trademarks, domain names, database right and other intellectual property rights, whether or not capable of registration, whether or not registered, and applications of any of the foregoing and all intellectual property rights whether now known or created in the future.'],
  ['Local Images', 'images that are included in the content created with the Service and that are not hosted by the Service, but rather included in a compressed file when the content is downloaded by the User, and then hosted by the User.'],
  ['Losses', 'means any and all losses, damages, liabilities, deficiencies, claims, actions, judgments, settlements, interest, awards, penalties, fines, costs or expenses of whatever kind, including reasonable attorneys’ fees and the costs of enforcing any right to indemnification hereunder and the cost of pursuing any insurance providers.'],
  ['Muiditor Materials', 'means the Service Software, Specifications, Documentation and Muiditor Systems and any and all other information, data, documents, materials, works and other content, devices, methods, processes, hardware, software and other technologies and inventions, including any deliverables, technical or functional descriptions, requirements, plans or reports, that are provided or used by Muiditor or any Subcontractor in connection with the Services, including any third party materials licensed to Muiditor, or otherwise comprise or relate to the Services or Muiditor Systems. For the avoidance of doubt, Muiditor Materials include Resultant Data and any information, data or other content derived from Muiditor’s monitoring of Client’s access to or use of the Services, but do not include Client Data.'],
  ['Muiditor Systems', 'means the information technology infrastructure used by or on behalf of Muiditor in performing the Services, including all computers, software, hardware, databases, electronic systems (including database management systems) and networks, whether operated directly by Muiditor or through the use of third-party services.'],
  ['Permitted Use', 'means any use of the Services by an Authorized User for the benefit of Client solely in or for Client’s internal business operations / solely for the purpose of digital marketing or digital communications.'],
  ['Subscription Plan', 'means the specific Software subscription plan chosen by the Client among the different subscription plans available at https://muiditor.com.'],
  ['Registration Form', 'means the registration form available at https://muiditor.com/sign-up'],
  ['Renewal', 'Is defined in Section 7.2.'],
  ['Resultant Data', 'is defined in Section 21.'],
  ['Services', 'has the meaning set forth in Section 2.1.'],
  ['Service Software', 'including new versions, modifications, enhancements, improvements, updates, revisions, additions, derivative works, documentation and related material, that Muiditor provides remote access to and use of as part of the Services.'],
  ['Subscription Fees', 'the per-Authorized User amount for the selected Subscription Plan, as listed on the pricing page on the Muiditor Prices page at https://muiditor.com/prices, times the number of Authorized Users active during the Billing Period immediately prior to Renewal.'],
  ['Term', 'is defined in Section 7.1.'],
  ['Website', 'means https://muiditor.com, including any third-level-domain and sub-domains.']
]

const Terms = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Typography>
        This agreement (the “Agreement”) is entered into between Muiditor inc., (“Muiditor”), acting for and on behalf
        of itself and each of its Affiliates, and the Client identified with the information provided by completing the
        Registration Form as below defined (the “Client”).
        Muiditor and the Client individually also the “Party”, and collectively, the “Parties”.
      </Typography>
      <Typography align="center" variant="h6" className={classes.section}>WHEREAS</Typography>
      <ol type="i">
        {
          [
            'Muiditor is a company specialized in the digital marketing and digital communications sector;',
            'Client wishes to procure from Muiditor the software services described herein, and Muiditor wishes to provide such services to Client, each on the terms and conditions set forth in this Agreement.'
          ].map((prop, i) => (
            <Typography key={i.toString()} component="li">{prop}</Typography>
          ))
        }
      </ol>
      <Typography align="center" variant="h6" className={classes.section}>NOW THEREFORE, <br />THE PARTIES AGREE AS
        FOLLOWS</Typography>
      <Typography variant="subtitle1">1. Definitions</Typography>
      <Typography>When used in this Agreement, the following terms in capital letters shall have the meaning stated in
        this section.</Typography>
      {
        defintitions.map((prop, i) => (
          <React.Fragment key={i.toString()}>
            <Typography variant="subtitle2" className={classes.subsection}>{prop[0]}</Typography>
            <Typography>{prop[1]}</Typography>
          </React.Fragment>
        ))
      }
      <Typography variant="subtitle1" className={classes.subsection}>2. Services</Typography>
      <Typography variant="subtitle2" className={classes.subsection}>2.1. Services</Typography>
      {
        [
          'Subject to and conditioned on Client’s and its Authorized Users’ compliance with the terms and conditions of this Agreement, during the Term, Muiditor shall use commercially reasonable efforts to provide to Client and its Authorized Users the services identified in the Subscription Form and this Agreement (collectively, the “Services”) in accordance with the specifications set forth therein (“Specifications”) and the terms and conditions hereof, including to host, manage, operate and maintain the Service Software for remote electronic access and use by Client and its Authorized Users (“Hosted Services”) in substantial conformity with the Specifications 24 hours per day, seven days per week every day of the year, except for:',
          'a) Scheduled Downtime in accordance with Section 9.2;',
          'b) any other circumstances beyond Muiditor’s reasonable control, including Client’s or any Authorized User’s use of Third Party Materials, misuse of the Hosted Services, use of the Services other than in compliance with the express terms of this Agreement and the Specifications, or unavailability of cloud or network services; and',
          'c) any suspension or termination of Client’s or any Authorized Users’ access to or use of the Hosted Services as permitted by this Agreement.'
        ].map((content, i) => (
          <Typography key={i.toString()}>{content}</Typography>
        ))
      }
      <Typography variant="subtitle2" className={classes.subsection}>2.2. Service and System Control</Typography>
      <Typography>Except as otherwise expressly provided in this Agreement, as between the Parties: (a) Muiditor has and
        will retain sole control over the operation, provision, maintenance and management of the Services and Muiditor
        Materials, including the: (i) Muiditor Systems; (ii) location(s) where any of the Services are performed; (iii)
        selection, deployment, modification and replacement of the Service Software; and (iv) performance of Service
        maintenance, upgrades, corrections and repairs; and (b) Client has and will retain sole responsibility for all
        access to and use of the Services and Muiditor Materials by any Person, including any: (i) information,
        instructions or materials provided by any of them to the Services or Muiditor; (ii) results obtained from any
        use of the Services or Muiditor Materials; and (iii) conclusions, decisions or actions based on such
        use.</Typography>
      <Typography variant="subtitle2" className={classes.subsection}>2.3. Changes.</Typography>
      <Typography>Muiditor reserves the right, in its sole discretion, to make any changes to the Services and Muiditor
        Materials that it deems necessary or useful to: (a) maintain or enhance (i) the quality or delivery of
        Muiditor’s services to its Clients, (ii) the competitive strength of or market for Muiditor’s services or (iii)
        the Services’ cost efficiency or performance; or (b) to comply with applicable Law.</Typography>
      <Typography variant="subtitle2" className={classes.subsection}>2.4. Suspension or Termination of
        Services.</Typography>
      <Typography>Muiditor may, directly or indirectly, and by use of any Muiditor Disabling Device or any other lawful
        means, suspend, terminate or otherwise deny Client’s, any Authorized User’s or any other Person’s access to or
        use of all or any part of the Services or Muiditor Materials, without incurring any resulting obligation or
        liability, if: (a) Muiditor receives a judicial or other governmental demand or order, subpoena or law
        enforcement request that expressly or by reasonable implication requires Muiditor to do so; or (b) Muiditor
        believes, in its sole discretion, that: (i) Client or any Authorized User has failed to comply with, any term of
        this Agreement, or accessed or used the Services beyond the scope of the rights granted or for a purpose not
        authorized under this Agreement or in any manner that does not comply with any instruction or requirement of the
        Specifications; (ii) Client or any Authorized User is, has been, or is likely to be involved in any fraudulent,
        misleading or unlawful activities; or (iii) this Agreement expires or is terminated. This Section 3.5 does not
        limit any of Muiditor’s other rights or remedies, whether at law, in equity or under this
        Agreement.</Typography>
      <Typography variant="subtitle1" className={classes.subsection}>3. Authorization</Typography>
      <Typography variant="subtitle2" className={classes.subsection}>3.1. Authorization</Typography>
      <Typography>Subject to and conditioned on Client’s payment of the Fees and compliance and performance in
        accordance with all other terms and conditions of this Agreement, Muiditor hereby authorizes Client to access
        and use, during the Term, the Services and such Muiditor Materials as Muiditor may supply or make available to
        Client solely for the Permitted Use by and through Authorized Users in accordance with the Specifications and
        the conditions and limitations set forth in this Agreement. This authorization is non-exclusive and
        non-transferable.</Typography>
      <Typography variant="subtitle2" className={classes.subsection}>3.2. Reservation of Rights.</Typography>
      <Typography>Nothing in this Agreement grants any right, title or interest in or to (including any license under)
        any Intellectual Property Rights in or relating to, the Services, or Muiditor Materials, whether expressly, by
        implication, estoppel or otherwise. All right, title and interest in and to the Services and the Muiditor
        Materials are and will remain with Muiditor and its licensors.</Typography>
      <Typography variant="subtitle1" className={classes.subsection}>4. Client Obligations.</Typography>
      <Typography variant="subtitle2" className={classes.subsection}>4.1. Client Systems and Cooperation.</Typography>
      <Typography>Client shall at all times during the Term: (a) set up, maintain and operate in good repair and in
        accordance with the Specifications all Client Systems on or through which the Services are accessed or used; (b)
        provide Muiditor personnel with such access to Client Systems as is necessary for Muiditor for troubleshooting
        and to perform the Services in accordance with the Availability Requirement and Specifications; and (c) provide
        all cooperation and assistance as Muiditor may reasonably request to enable Muiditor to exercise its rights and
        perform its obligations under and in connection with this Agreement.</Typography>
      <Typography variant="subtitle2" className={classes.subsection}>4.2. Effect of Client Failure or
        Delay.</Typography>
      <Typography>Muiditor is not responsible or liable for any delay or failure of performance caused in whole or in
        part by Client’s delay in performing, or failure to perform, any of its obligations under this
        Agreement.</Typography>
      <Typography variant="subtitle2" className={classes.subsection}>4.3. Corrective Action and Notice.</Typography>
      <Typography>If Client becomes aware of any actual or threatened activity prohibited by Section 5, Client shall,
        and shall cause its Authorized Users to, immediately: (a) take all reasonable and lawful measures within their
        respective control that are necessary to stop the activity or threatened activity and to mitigate its effects
        (including, where applicable, by discontinuing and preventing any unauthorized access to the Services and
        Muiditor Materials and permanently erasing from their systems and destroying any data to which any of them have
        gained unauthorized access); and (b) notify Muiditor of any such actual or threatened activity.</Typography>
      <Typography variant="subtitle1" className={classes.subsection}>5. Use Policy.</Typography>
      <ol type="a">
        {
          [
            'The Client shall not, and shall not permit any other person to, access or use the Services or Muiditor Materials except as expressly permitted by this Agreement. For purposes of clarity and without limiting the generality of the foregoing, Client shall not, except as this Agreement expressly permits: Directly or indirectly: reverse engineer, decompile, disassemble, or otherwise attempt to access the source code of the Muiditor Services or Materials, or underlying structure, ideas, or algorithms of the Software or any software, documentation, or data related to the Software; modify, translate, or create derivative works based on the Software, except and only to the extent that such activity is expressly permitted by this Agreement; or copy, distribute, pledge, assign, or otherwise transfer or encumber rights to the Software; rent, lease, lend, sell, sublicense, assign, distribute, publish, transfer or otherwise make available the Software to any person, including on or in connection with the use of Software for timesharing or service bureau purposes, software as a service, cloud or other technology or service; or otherwise for the benefit of a third party unless specifically authorized by Muiditor;',
            'Bypass or breach any security device or protection used by the Services or Muiditor Materials or access or use the Services or Muiditor Materials other than by an Authorized User through the use of his or her own then valid Access Credentials;',
            'Remove or alter the Muiditor’s trademarks, or any trademark, copyright or other proprietary notices, legends, symbols or labels in the Software;',
            'Display or integrate any advertisements on the Software;',
            'Use the Software in connection with sending unsolicited email messages, also known as spamming. Use of the Services for sending bulk or transactional email is prohibited. The email sending feature included in the Services is intended strictly and only for the purpose of sending a test message. Test sending is limited in the number of messages that can be sent at the same time and within a period of time (such limits may change). Any attempt to use the Services for the purpose of sending solicited or unsolicited bulk or transactional email will result in immediate termination of this Agreement;',
            'Defame, abuse, harass, stalk, threaten or otherwise violate the legal rights of others;',
            'Distribute or disseminate any information or materials that are inappropriate, profane, defamatory, obscene, indecent unlawful or injurious unlawful or injurious, or contain, transmit or activate any Harmful Code;',
            'Use the Software to upload, or otherwise make available, files that contain images, photographs, software or other material protected by intellectual property laws, including, by way of example, and not as limitation, copyright, trademark or privacy laws unless the Client owns or controls the rights thereto or has received all necessary consent to do the same;',
            'Use any material of information, including images or photographs, which are made available through the Software in any manner that infringes any copyright, trademark, patent, trade secret, or other proprietary right of any third party;',
            'input, upload, transmit or otherwise provide to or through the Services or Muiditor Systems, any information or materials that are unlawful or injurious, or contain, transmit or activate any Harmful Code;',
            'damage, destroy, disrupt, disable, impair, interfere with or otherwise impede or harm in any manner the Services, Muiditor Systems or Muiditor’s provision of services to any third party, in whole or in part;',
            'Falsify or delete any copyright management information, such as author attributions, legal or other proper notices or proprietary designations or labels of the origin or source of the Software or other material contained in a file that is uploaded;',
            'Violate any applicable laws or regulations; or',
            'otherwise access or use the Services or Muiditor Materials beyond the scope of the authorization granted under Section 3.1.'
          ].map((prop, i) => (
            <Typography key={i.toString()} component="li">{prop}</Typography>
          ))
        }
      </ol>
      <Typography variant="subtitle1" className={classes.subsection}>6. Security. Payment.</Typography>
      <Typography>Muiditor does not process any order payments through the website. All payments are processed securely through 2Checkout, a third party online payment provider.</Typography>
      <Typography variant="subtitle1" className={classes.subsection}>7. Termination.</Typography>
      <Typography>In addition to any other express termination right set forth elsewhere in this Agreement,</Typography>
      <ol type="a">
        {
          [
            'Muiditor may terminate this Agreement by giving written notice to the Client prior to, and effective as of, the expiration of the current Billing Period;',
            'Muiditor may terminate this Agreement, effective on written notice to Client, if Client: (i) fails to pay;',
            'either Party may terminate this Agreement, effective on written notice to the other Party, if the other Party materially breaches this Agreement, and such breach: (i) is incapable of cure; or (ii) being capable of cure, remains uncured thirty (30) days after the non-breaching party provides the breaching party with written notice of such breach; and',
            'either Party may terminate this Agreement, effective immediately upon written notice to the other Party, if the other Party: (i) becomes insolvent or is generally unable to pay, or fails to pay, its debts as they become due; (ii) files or has filed against it, a petition for voluntary or involuntary bankruptcy or otherwise becomes subject, voluntarily or involuntarily, to any proceeding under any domestic or foreign bankruptcy or insolvency law; (iii) makes or seeks to make a general assignment for the benefit of its creditors; or (iv) applies for or has appointed a receiver, trustee, custodian or similar agent appointed by order of any court of competent jurisdiction to take charge of or sell any material portion of its property or business.',
            'all rights, licenses, consents and authorizations granted by either Party to the other hereunder will immediately terminate;',
            'Muiditor shall immediately cease all use of any Client Data or Client’s Confidential Information and (i) at Client’s written request destroy all documents and tangible materials containing, reflecting, incorporating or based on Client Data or Client’s Confidential Information; and (ii) upon the Client’s written request, permanently erase all Client Data and Client’s Confidential Information from all systems Muiditor directly or indirectly controls, provided that, for clarity, Muiditor’s obligations under this Section 7 do not apply to any Resultant Data;',
            'Client shall immediately cease all use of any Services or Muiditor Materials and (i) at Muiditor’s written request destroy all documents and tangible materials containing, reflecting, incorporating or based on Muiditor’s Confidential Information; and (ii) permanently erase Muiditor’s Confidential Information from all systems Client directly or indirectly controls;',
            'notwithstanding anything to the contrary in this Agreement, with respect to information and materials then in its possession or control: (i) the Receiving Party may retain the Disclosing Party’s Confidential Information solely to the extent and for so long as required by applicable law; (ii) Muiditor may also retain Client Data in its backups, archives and disaster recovery systems until such Client Data is deleted in the ordinary course; and (ii) all information and materials described in this Section will remain subject to all confidentiality, security and other applicable requirements of this Agreement;',
            'Muiditor may disable all Client and Authorized User access to the Hosted Services and Muiditor Materials;',
            'if Muiditor terminates this Agreement, all Fees that would have become payable had the Agreement remained in effect until expiration of the Term will become immediately due and payable, and Client shall pay such Fees, together with all previously-accrued but not yet paid Fees, on receipt of Muiditor’s invoice therefor.'
          ].map((prop, i) => (
            <Typography key={i.toString()} component="li">{prop}</Typography>
          ))
        }
      </ol>
      <Typography variant="subtitle1" className={classes.subsection}>8. Service Levels and Support</Typography>
      <Typography variant="subtitle2" className={classes.subsection}>8.1. Scheduled Downtime.</Typography>
      <Typography>Muiditor will use commercially reasonable efforts to give Client at least five (5) days prior notice of all scheduled outages of the Hosted Services (“Scheduled Downtime”).</Typography>
      <Typography variant="subtitle2" className={classes.subsection}>8.2. Service Support.</Typography>
      <Typography>Muiditor will use its best efforts to provide standard support services to the Client (“Support Services”) in accordance with the Muiditor best practices in effect from time to time through: a) online manuals and other documentation available at https://muiditor.com/docs; Muiditor may amend such manuals and other documentation from time to time in its sole discretion;</Typography>
      <Typography>8.3. Data Backup. The Services do not replace the need for Client to maintain regular data backups or redundant data archives. <b>MUIDITOR HAS NO OBLIGATION OR LIABILITY FOR ANY LOSS, ALTERATION, DESTRUCTION, DAMAGE, CORRUPTION OR RECOVERY OF CLIENT DATA.</b></Typography>
      <Typography variant="subtitle1" className={classes.subsection}>9. Representations and Warranties</Typography>
      <Typography variant="subtitle2" className={classes.subsection}>9.1. Warranties by the Client. The Client represents and warrants that:</Typography>
      <ol type="i">
        {
          [
            'It has the full power to enter into and fully perform this Agreement.',
            'Client’s services, products, materials, contents of the messages, data, and information used by Client in connection with this Agreement and the Software does not as of the Effective Date, and will not during the Term of this Agreement, operate in any manner that would violate any applicable law or regulation. In the event of any breach, or reasonably anticipated breach, of any of Client’s warranties herein, in addition to any other remedies available at law or in equity, Muiditor will have the right to immediately, in Muiditor’s sole discretion, suspend the access and use of the Software if deemed reasonably necessary by Muiditor to prevent any harm to Muiditor or its business.'
          ].map((prop, i) => (
            <Typography key={i.toString()} component="li">{prop}</Typography>
          ))
        }
      </ol>
      <Typography variant="subtitle2" className={classes.subsection}>9.2. Warranties by Muiditor. Muiditor represents and warrants that:</Typography>
      <ol type="i">
        {
          [
            'it is has the full power and authority to enter into and fully perform this Agreement.',
            'it owns or controls all right, title, and interest in and to all Intellectual Property rights therein, necessary to carry out its obligations hereunder and to grant and assign any rights and licenses granted to Client herein.'
          ].map((prop, i) => (
            <Typography key={i.toString()} component="li">{prop}</Typography>
          ))
        }
      </ol>
      <Typography variant="subtitle2" className={classes.subsection}><b>{'9.3. EXCEPT FOR THE FOREGOING, THE SOFTWARE IS PROVIDED ON AN “AS IS” BASIS, AND CLIENT’S USE OF THE SOFTWARE IS AT ITS OWN RISK. MAILUP DOES NOT MAKE, AND HEREBY DISCLAIMS, ANY AND ALL OTHER EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NONINFRINGEMENT AND TITLE, AND ANY WARRANTIES ARISING FROM A COURSE OF DEALING, USAGE, OR TRADE PRACTICE. MAILUP DOES NOT WARRANT THAT THE SERVICES WILL BE UNINTERRUPTED, ERROR-FREE, OR COMPLETELY SECURE. WITHOUT LIMITING THE FOREGOING, MAILUP MAKES NO WARRANTY OF ANY KIND THAT THE SERVICES OR MAILUP MATERIALS, OR ANY PRODUCTS OR RESULTS OF THE USE THEREOF, WILL MEET CLIENT’S OR ANY OTHER PERSON’S REQUIREMENTS, ACHIEVE ANY INTENDED RESULT, BE COMPATIBLE OR WORK WITH ANY SOFTWARE, SYSTEM OR OTHER SERVICES EXCEPT IF AND TO THE EXTENT EXPRESSLY SET FORTH IN THE SPECIFICATIONS, OR BE SECURE, ACCURATE, COMPLETE, FREE OF HARMFUL CODE OR ERROR FREE. ALL THIRD-PARTY MATERIALS ARE PROVIDED “AS IS” AND ANY REPRESENTATION OR WARRANTY OF OR CONCERNING ANY THIRD PARTY MATERIALS IS STRICTLY BETWEEN CLIENT AND THE THIRD-PARTY OWNER OR DISTRIBUTOR OF THE THIRD-PARTY MATERIALS.'.toUpperCase()}</b></Typography>
      <Typography variant="subtitle1" className={classes.subsection}>10. Limitation of Liability; Indemnification; Release.</Typography>
      <Typography>{'10.1. IN NO EVENT SHALL MUIDITOR OR ITS AFFILIATES BE LIABLE FOR ANY SPECIAL, PUNITIVE, EXEMPLARY, DIRECT, INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES (INCLUDING, WITHOUT LIMITATION, DAMAGES FOR LOSS OF BUSINESS, LOSS OF REVENUE OR PROFITS, BUSINESS INTERRUPTION, OR LOSS OF DATA) ARISING OUT OF OR IN CONNECTION WITH THIS AGREEMENT OR THE SUBJECT MATTER HEREOF EVEN IF MUIDITOR HAS BEEN PREVIOUSLY ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. IN ANY EVENT, IF MUIDITOR SHOULD BE HELD LIABLE FOR ANY DAMAGES NOTWITHSTANDING THE TERMS AND CONDITIONS OF THIS AGREEMENT, THE ENTIRE LIABILITY OF MUIDITOR (INCLUDING ITS AFFILIATES) WITH RESPECT TO ITS OBLIGATIONS UNDER THIS AGREEMENT OR OTHERWISE, FOR ANY REASON AND UPON ANY CAUSE OF ACTION, REGARDLESS OF THE NUMBER OF ACTIONS OR NUMBER OF LICENSED COPIES OF THE PRODUCTS (AND WHETHER BASED IN CONTRACT, STRICT LIABILITY, NEGLIGENCE OR OTHERWISE) SHALL NOT EXCEED, IN THE AGGREGATE, ONE HUNDRED DOLLARS ($100.00 USD). NO CAUSE OF ACTION WHICH ACCRUED MORE THAN ONE (1) YEAR PRIOR TO THE FILING OF A SUIT ALLEGING SUCH CAUSE OF ACTION MAY BE ASSERTED AGAINST MUIDITOR OR ITS AFFILIATES. SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OR LIMITATION OF IMPLIED WARRANTIES OR LIABILITY FOR INCIDENTAL OR CONSEQUENTIAL DAMAGES, SO CERTAIN OF THE ABOVE LIMITATIONS OR EXCLUSIONS MAY NOT APPLY TO YOU. NO OTHER LIMITATION CONTAINED IN THIS AGREEMENT SHALL LIMIT MUIDITOR\'S LIABILITY TO YOU, TO THE EXTENT SUCH LIMITATION IS PROHIBITED BY APPLICABLE LAW. THE LIMITATIONS OF LIABILITY IN THIS AGREEMENT SHALL SURVIVE EVEN IF ANY EXCLUSIVE OR LIMITED REMEDIES PROVIDED IN THIS AGREEMENT SHOULD FAIL OF THEIR ESSENTIAL PURPOSE.'.toUpperCase()}</Typography>
      <Typography>10.2 You shall indemnify, defend and hold harmless 2Checkout and its affiliates, and each of their officers, directors, shareholders, agents, representatives, licensees and employees (each, an {'"'}Indemnified Party{'"'}), from and against any and all claims, losses, liabilities, damages, actions, lawsuits and other proceedings, judgments and awards, and costs and expenses (including, without limitation, court costs and reasonable attorneys{'\''} and consultancy fees), arising directly or indirectly, in whole or in part, out of: (a) any breach or threatened breach of this Agreement by You; (b) Your use of the Products; or (c) Your negligence, gross negligence or willful misconduct. An Indemnified Party may participate in the defense by counsel of its own choosing, at its own cost and expense. You shall not settle any claim that adversely affects an Indemnified Party or imposes any obligation or liability on an Indemnified Party without the Indemnified Party{'\''}s prior written consent.</Typography>
      <Typography>{'10.3 TO THE MAXIMUM EXTENT PERMITTED BY LAW, YOU HEREBY RELEASE EACH INDEMNIFIED PARTY FROM ALL DAMAGES (WHETHER DIRECT, INDIRECT, INCIDENTAL, CONSEQUENTIAL OR OTHERWISE), LOSSES, LIABILITIES, COSTS AND EXPENSES OF EVERY KIND AND NATURE, KNOWN AND UNKNOWN, ARISING OUT OF OR IN CONNECTION WITH DISPUTES BETWEEN YOU AND THIRD PARTIES (INCLUDING MERCHANTS) CONCERNING THE PRODUCTS, THE WEBSITE OR THIS AGREEMENT. IN CONNECTION WITH THE FOREGOING RELEASE, YOU HEREBY WAIVE CALIFORNIA CIVIL CODE 1542 (AND ANY OTHER APPLICABLE LAW OR STATUTE) WHICH SUBSTANTIALLY STATES:'.toUpperCase()}</Typography>
      <br/>
      <Typography>{'"A GENERAL RELEASE DOES NOT EXTEND TO CLAIMS WHICH THE CREDITOR DOES NOT KNOW OR SUSPECT TO EXIST IN HIS OR HER FAVOR AT THE TIME OF EXECUTING THE RELEASE, WHICH IF KNOWN BY HIM OR HER MUST HAVE MATERIALLY AFFECTED HIS SETTLEMENT WITH THE DEBTOR.'.toUpperCase()}</Typography>
      <Typography variant="subtitle1" className={classes.subsection}>11. Advertising</Typography>
      <Typography>The Client hereby acknowledges and accepts that Muiditor can use its name and logo in presentations, marketing materials, client lists and financial reports.</Typography>
    </div>
  )
}

export default Terms;
