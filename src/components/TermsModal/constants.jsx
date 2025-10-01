export const sectionsArray = [
  {
    secId: "AGREEMENT_TO_TERMS",
    secName: "Agreement to Terms",
  },
  {
    secId: "ARBITRATION_NOTICE",
    secName: "Arbitration Notice",
  },
  {
    secId: "LIMITED_LICENSE",
    secName: "Limited License",
  },
  {
    secId: "LICENSE_RESTRICTIONS",
    secName: "License Restrictions",
  },
  {
    secId: "INTELLECTUAL_PROPERTY",
    secName: "Intellectual Property",
  },
  {
    secId: "THIRD_PARTY_SERVICES",
    secName: "Third-Party Services",
  },
  {
    secId: "COPYRIGHT_TAKEDOWN_POLICY",
    secName: "Copyright Takedown Policy",
  },
  {
    secId: "COMMUNICATIONS",
    secName: "Communications",
  },
  {
    secId: "COOPERATION_WITH_LAW",
    secName: "Termination; Cooperation with Law Enforcement",
  },
  {
    secId: "WARRANTY_DISCLAIMER",
    secName: "Warranty Disclaimer",
  },
  {
    secId: "LIABILITY_AND_DAMAGES",
    secName: "Limitation of Liability and Damages",
  },
  {
    secId: "INDEMNITY",
    secName: "Indemnity",
  },
  {
    secId: "GOVERNMENT_END_USERS",
    secName: "For U.S. Government End Users",
  },
  {
    secId: "CHANGES_TO_TERMS_OF_USE",
    secName: "Changes to these Terms of Use",
  },
  {
    secId: "CLASS_ACTION_WAIVER",
    secName: "Arbitration Agreement and Class Action Waiver",
  },
  {
    secId: "GOVERNING_LAW",
    secName: "Governing Law",
  },
  {
    secId: "MISCELLANEOUS",
    secName: "Miscellaneous",
  },
  {
    secId: "CONTACT_INFORMATION",
    secName: "Contact Information",
  },
];

export const sectionType = {
  SECTION: "section",
  LIST: "list",
  SECTION_LIST: "section-list",
};

export const sectionArray = [
  {
    type: "AGREEMENT_TO_TERMS",
    secName: "Agreement to Terms",
    sectionList: [
      {
        sectionType: sectionType.SECTION,
       
        sectionText: `Please read these Terms of Use ("Terms") carefully before clicking the "I Agree" button or using Metolius® (the "Application"). By accessing the Application, you signify that you have read, understand, and agree to be bound by these Terms of Use, whether or not you are a registered user of the Application. If you do not agree to these Terms of Use, please do not use the Application.`,
      },
      {
        sectionType: sectionType.SECTION,
        sectionText: `These Terms are a legal agreement between you (either an individual or a single entity) and Metolius Technologies INC. (Metolius) that governs your use of the Application. If you do not agree to these Terms, do not click on the "I Agree" button, and do not use the Application.`,
      },
      {
        sectionType: sectionType.SECTION,
        sectionText: `You agree to our use of your personal information in accordance with our Privacy Policy, which is available at here. Your use of the Application is subject to the Privacy Policy`,
      },
    ],
  },
  {
    type: "ARBITRATION_NOTICE",
    secName: "Arbitration Notice",
    sectionList: [
      {
        sectionType: sectionType.SECTION,
        sectionText: `Unless you opt out of arbitration within 30 days of the date you first agree to these terms by following the opt-out procedure specified in the "Arbitration Agreement and Class Action Waiver" section below, you agree that most disputes between you and Metolius will be resolved by binding, individual arbitration, and you are waiving your right to a trial by jury or to participate as a plaintiff or class member in any purported class action or representative proceeding.`,
      },
    ],
  },
  {
    type: "LIMITED_LICENSE",
    secName: "Limited License",
    sectionList: [
      {
        sectionType: sectionType.SECTION,
        sectionText: `So long as you comply with these Terms of Use, you may access the Application and view the Materials for non-commercial purposes. You may download and print a reasonable number of the Materials for your personal use only. You may not use, download, print, copy, distribute, or modify Materials for any other purpose.`,
      },
    ],
  },
  {
    type: "LICENSE_RESTRICTIONS",
    secName: "License Restrictions",
    sectionList: [
      {
        sectionType: sectionType.SECTION,
        sectionText: `Your right to use the Application is conditioned on compliance with these Terms and applicable laws. You may not (and you may not permit anyone else to):`,
      },
      {
        sectionType: sectionType.LIST,
        sectionListArr: [
          `Use any manual process or robot, spider, scraper, or other automated means to collect information from the Application or from other Application users;`,
          `Use the Materials or other data or information from the Application for commercial purposes`,
          `Mirror any Materials contained on the Application or any Metolius server or use framing techniques to enclose the Application or any part of the Application;`,
          `Circumvent any of the technical limitations of the Application;`,
          `Interfere with or prevent access to the Application by other users, or impose an unreasonable service request or usage load on our infrastructure;`,
          `Change or remove any copyright, trademark, or other proprietary notices on the Materials or Application;`,
          `Impersonate any person or entity, misrepresent yourself or your entity, or attempt to use another user's account without the user's permission;`,
          `Use any metatags or any other hidden text incorporating Metolius' name or trademarks in any online site or posting;`,
          `Solicit, trace or otherwise collect any information from users or visitors of the Application;`,
          `Use the Application for commercial activities such as contests or advertising; or`,
          `Create a database by downloading and storing the Materials.`,
        ],
      },
    ],
  },
  {
    type: "INTELLECTUAL_PROPERTY",
    secName: "Intellectual Property",
    sectionList: [
      {
        sectionType: sectionType.SECTION,
        sectionText: `All materials included within the Application, such as information, videos, graphics, articles and reports, and the software powering the Application ("Materials"), are the property of Metolius or its licensors. The Materials are protected by copyright, trademark and other intellectual property laws.`,
      },
      {
        sectionType: sectionType.SECTION,
        sectionText: `The Metolius trademark and other trademarks and logos that we use are trademarks of Metolius. Any third-party trademarks that appear on the Application are the property of their respective owners. You may not use any of these trademarks without express written permission from Metolius or the third-party owners.`,
      },
    ],
  },
  {
    type: "THIRD_PARTY_SERVICES",
    secName: "Third-Party Services",
    sectionList: [
      {
        sectionType: sectionType.SECTION,
        sectionText: `The Application may display, include, or make available third-party content (including data, information, applications, and other products services) or provide links to third-party websites or services ("Third-Party Services").`,
      },
      {
        sectionType: sectionType.SECTION,
        sectionText: `You acknowledge and agree that Metolius shall not be responsible for any Third-Party Services, including their accuracy, completeness, timeliness, validity, copyright compliance, legality, decency, quality, or any other aspect thereof. Metolius does not assume and shall not have any liability or responsibility to you or any other person or entity for any Third-Party Services.`,
      },
      {
        sectionType: sectionType.SECTION,
        sectionText: `Third-Party Services and links thereto are provided solely as a convenience to you and you access and use them entirely at your own risk and subject to such third parties' terms and conditions.`,
      },
    ],
  },
  {
    type: "COPYRIGHT_TAKEDOWN_POLICY",
    secName: "Copyright Takedown Policy",
    sectionList: [
      {
        sectionType: sectionType.SECTION,
        sectionText: `Metolius respects intellectual property rights. If you believe your copyrighted work has been copied or posted on or through the Application in a way that constitutes copyright infringement, then please contact us at info@Metolius.com and provide the following information:`,
      },
      {
        sectionType: sectionType.LIST,
        sectionListArr: [
          `A description of the copyrighted work that you believe has been infringed;`,
          `A description of what the allegedly infringing work is;`,
          `A description of the location where the allegedly infringing work is located on the Application;`,
          `An address and telephone number where you can be contacted, including an email address if possible;`,
          `A statement that you have a good faith belief that the disputed use is not authorized by the copyright owner, its agent or the law;`,
          `A physical or electronic signature of a person authorized to act on behalf of the owner of the copyright; and`,
          `A statement, made under penalty of perjury, that the above information in the notice is accurate and that the signatory is the copyright owner or is authorized to act on behalf of the copyright owner.`,
        ],
      },
      {
        sectionType: sectionType.SECTION,
        sectionText: `Consult your legal advisor before filing an infringement notice because there can be penalties for false claims under the Digital Millennium Copyright Act.`,
      },
    ],
  },
  {
    type: "COMMUNICATIONS",
    secName: "Communications",
    sectionList: [
      {
        sectionType: sectionType.SECTION,
        sectionText: `By providing your contact information, you agree to receive certain electronic communications from us. You agree that any notice, agreement, disclosure or other communication that we send you electronically will satisfy any legal notice requirements, including that such communications be in writing. All calls, emails and other communications between you and Metolius may be recorded.`,
      },
    ],
  },
  {
    type: "COOPERATION_WITH_LAW",
    secName: "Termination; Cooperation with Law Enforcement",
    sectionList: [
      {
        sectionType: sectionType.SECTION,
        sectionText: `If we believe you have violated these Terms or any applicable law, we may terminate your account, block access to or use of the Application, and investigate and suspected violations of these Terms.`,
      },
    ],
  },
  {
    type: "WARRANTY_DISCLAIMER",
    secName: "Warranty Disclaimer",
    sectionList: [
      {
        sectionType: sectionType.SECTION,
        sectionText:
          'THE APPLICATION IS PROVIDED "AS IS," "AS AVAILABLE," AND WITHOUT WARRANTIES OF ANY KIND. YOU USE THE APPLICATION SOLELY AT YOUR OWN RISK. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES OF ANY KIND RELATED TO YOUR USE OF THE APPLICATION, WHETHER EXPRESS, IMPLIED OR STATUTORY, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF TITLE, QUALITY, PERFORMANCE, MERCHANTABILITY, SUITABILITY, FITNESS FOR A PARTICULAR PURPOSE, ACCURACY, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE APPLICATION WILL PROVIDE CONTINUOUS, PROMPT, SECURE, OR ERROR-FREE SERVICE.',
      },
    ],
  },
  {
    type: "LIABILITY_AND_DAMAGES",
    secName: "Limitation of Liability and Damages",
    sectionList: [
      {
        sectionType: sectionType.SECTION,
        sectionText: `TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, METOLIUS, ITS AFFILIATES, OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, SERVICES PROVIDERS AND LICENSORS WILL NOT BE LIABLE TO YOU OR ANYONE ELSE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL OR EXEMPLARY DAMAGES, INCLUDING BUT NOT LIMITED TO DAMAGES FOR LOST PROFITS, GOODWILL, USE, DATA OR OTHER INTANGIBLE LOSSES (REGARDLESS OF WHETHER WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES), HOWEVER CAUSED, WHETHER BASED ON UPON CONTRACT, NEGLIGENCE, STRICT LIABILITY IN TORT, WARRANTY OR ANY OTHER LEGAL THEORY.`,
      },
      {
        sectionType: sectionType.SECTION,
        sectionText: `IN NO EVENT WILL METOLIUS' TOTAL LIABILITY TO YOU ARISING OUT OF OR IN CONNECTION WITH THE APPLICATION OR MATERIALS EXCEED $100.`,
      },
      {
        sectionType: sectionType.SECTION,
        sectionText: `The exclusions and limitations of damages set forth above are fundamental elements of the basis of the bargain between Metolius and you. Some states do not allow the exclusion or limitation of incidental or consequential damages, so the above limitation or exclusion may not apply to you.`,
      },
    ],
  },
  {
    type: "INDEMNITY",
    secName: "Indemnity",
    sectionList: [
      {
        sectionType: sectionType.SECTION,
        sectionText: `You agree to defend and indemnify Metolius, its affiliates, licensors and service providers, and their respective officers, directors, employees, contractors, agents, licensors, suppliers, successors and assigns from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses or fees (including reasonable attorneys' fees) arising out of or relating to your violation of these Terms or your use of the Application.`,
      },
    ],
  },
  {
    type: "GOVERNMENT_END_USERS",
    secName: "For U.S. Government End Users",
    sectionList: [
      {
        sectionType: sectionType.SECTION,
        sectionText: `The Application and related documentation are "Commercial Items", as that term is defined under 48 C.F.R. $2.101, consisting of "Commercial Computer Software" and "Commercial Computer Software Documentation", as such terms are used under 48 C.F.R. $12.212 or 48 C.F.R. $227.7202, as applicable. In accordance with 48 C.F.R. $12.212 or 48 C.F.R.`,
      },
      {
        sectionType: sectionType.SECTION,
        sectionText: `$227.7202-1 through 227.7202-4, as applicable, the Commercial Computer Software and Commercial Computer Software Documentation are being licensed to U.S. Government end users (a) only as Commercial Items and (b) with only those rights as are granted to all other end users pursuant to the terms and conditions herein.`,
      },
    ],
  },
  {
    type: "CHANGES_TO_TERMS_OF_USE",
    secName: "Changes to these Terms of Use",
    sectionList: [
      {
        sectionType: sectionType.SECTION,
        sectionText: `Metolius reserves the right, in its sole discretion, to modify or replace these Terms at any time. If we change these Terms, we"ll let you know either by posting the modified Terms within the Application or by communicating with you directly. Your continued use of the Application will be considered your acceptance to the revised Terms.`,
      },
      {
        sectionType: sectionType.SECTION,
        sectionText: `Because we constantly improve the Application, we may change or discontinue any part of the Application, at any time and without notice.`,
      },
    ],
  },
  {
    type: "CLASS_ACTION_WAIVER",
    secName: "Arbitration Agreement and Class Action Waiver",
    sectionList: [
      {
        sectionType: sectionType.SECTION,
        sectionText: `Subject to the exceptions described below, all disputes arising out of or related to these Terms or any aspect of your relationship with Metolius, whether based in contract, tort, statute, fraud, misrepresentation, or any other legal theory, will be resolved through final and binding arbitration before a panel of three arbitrators instead of in a court by a judge or jury. Arbitration procedures are simpler and more limited than rules applicable in court.`,
      },
      {
        sectionType: sectionType.SECTION,
        sectionText: `Arbitration is mandatory for the claims covered under this arbitration agreement. You agree that Metolius and you are each waiving the right to trial by a jury, and that any arbitration will take place on an individual basis. You hereby waive the ability to participate in a class action. The parties agree that the panel will have exclusive authority to resolve any disputes relating to the interpretation, applicability, enforceability or formation of this arbitration agreement.`,
      },
      {
        sectionType: sectionType.SECTION,
        sectionText: `You and Metolius each retain the right to: (i) bring an individual action in small claims court and (ii) seek injunctive or other equitable relief in a court of competent jurisdiction to prevent the actual or threatened infringement or misappropriation of a party's trade secrets or intellectual property rights.`,
      },
      {
        sectionType: sectionType.SECTION,
        sectionText: `You will also have the right to litigate any other dispute that would otherwise be subject to this arbitration agreement if you opt out of the arbitration agreement by sending an email to info@metoliusaa.com or a letter to 12725 SW Millikan Way, Suite 300 Beaverton, OR 97005within 30 days after the date you first agree to these Terms. If you don't provide Metolius with a timely opt-out notice, this arbitration agreement applies.`,
      },
      {
        sectionType: sectionType.SECTION,
        sectionText: `The arbitration will be administered by the American Arbitration Association ("AAA") under its Consumer Arbitration Rules (currently available at https://www.adr.org/Rules or by calling the AAA at 1-800-778-7879). The panel will conduct hearings, if any, by teleconference or videoconference, rather than by personal appearances, unless the panel determines that an in-person hearing is appropriate. Any in-person appearances will be held at a location that is reasonably convenient to both parties. If the parties are unable to agree on a location, the panel will determine the location. If you demonstrate that the costs of arbitration will be prohibitive as compared to the costs of litigation, Metolius will contribute to your filing and hearing fees as the panel deems necessary to prevent the arbitration from being cost-prohibitive. The panel's decision will follow these Terms (including the Limitation of Liability provision) and will be final and binding. The panel will have authority to award temporary, interim or permanent injunctive relief or relief providing for specific performance of this Agreement, but only to the extent necessary to provide relief warranted by the individual claim before the panel. The award rendered by the panel may be confirmed and enforced in any court having jurisdiction.`,
      },
    ],
  },
  {
    type: "GOVERNING_LAW",
    secName: "Governing Law",
    sectionList: [
      {
        sectionType: sectionType.SECTION,
        sectionText: `The laws of Oregon, United States, excluding its conflicts of law rules, shall govern these Terms and your use of the Application. Your use of the Application may also be subject to other local, state, national, or international laws. These Terms shall not be governed by the United Nations Convention on Contracts for the International Sale of Good.`,
      },
    ],
  },
  {
    type: "MISCELLANEOUS",
    secName: "Miscellaneous",
    sectionList: [
      {
        sectionType: sectionType.SECTION_LIST,
        sectionText: [
          {
            listHeading: "Survival",
            listText:
              "The terms that by their nature may survive termination shall remain in effect and survive the termination of these Terms of Use, including without limitation, Content Submitted, Ownership, Indemnity, Warranty Disclaimer, Limitation of Liabilities and Damages and Miscellaneous.",
          },
          {
            listHeading: "Assignment",
            listText: `These Terms are personal to you, the user. You may not assign these Terms or any rights and licenses in these Terms to another party. These Terms may be assigned by Metolius without restriction`,
          },
          {
            listHeading: "Limitations on Claims",
            listText: `Any cause of action or claim you may have with respect to Metolius or the Application (including without limitation the purchase of products and services) must be commenced within one year after the claim or cause of action arises`,
          },
          {
            listHeading: "No Waiver",
            listText: `Our failure to exercise or enforce any right or provision of the Terms will not constitute a waiver of that or any other right or provision. Neither the course of conduct between the parties nor trade practice shall modify any of the terms in these Terms.`,
          },
          {
            listHeading: "Entire Agreement",
            listText: `These Terms and the Privacy Notice constitute the entire agreement between you and us and govern your use of the Application. These Terms supersede any prior agreements, communications, representations, or understandings between you and us, including without limitation any prior versions of these Terms. Additional terms and conditions may apply when you use or purchase other Metolius products or services, which will be provided to you at the time of such use or purchase.`,
          },
        ],
      },
    ],
  },
  {
    type: "CONTACT_INFORMATION",
    secName: "Contact Information",
    sectionList: [
      {
        sectionType: sectionType.SECTION,
        sectionText: `If you have any questions about these Terms, please contact us at info@metoliusaa.com.`,
      },
    ],
  },
];
