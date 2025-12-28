import React from "react";
import MainLayout from "../components/Layout/MainLayout";

const PrivacyPolicyPage = () => {
  return (
    <MainLayout>
      <div className="w-full flex items-center justify-center p-6 md:p-12">
        <div className="w-full bg-gray-900 rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold">Privacy Policy</h2>
          </div>

          <p>
            This Privacy Policy covers xmate.com.au's treatment of personally identifiable
            information that xmate.com.au collects when you are on the xmate.com.au website,
            and when you use xmate.com.au's services. This policy also covers xmate.com.au's
            treatment of any personally identifiable information that xmate.com.au's business
            partners share with xmate.com.au.
          </p>

          <p>
            This Privacy Policy does not apply to the practices of companies that xmate.com.au
            does not own or control, or to people that xmate.com.au does not employ or manage.
          </p>

          <p>
            xmate.com.au collects personally identifiable information when you register for an
            account, when you use certain products or services, when you visit pages, and when
            you enter promotions or sweepstakes. We may also receive personally identifiable
            information from our business partners.
          </p>

          <p>
            When you register, we ask for your name, address, phone number, email address and,
            if you choose to pay by credit card, necessary credit card information. Once you
            register and sign in, you are not anonymous to us.
          </p>

          <p>
            We also automatically receive and record information on our server logs from your
            browser including your IP address, cookie information, and the pages you requested.
          </p>

          <p>
            xmate.com.au uses information for four general purposes:
          </p>
          <ul className="list-decimal ml-6 space-y-1 text-gray-300">
            <li>To customise the advertising and content you see</li>
            <li>To fulfill your requests for certain products and services</li>
            <li>To contact you about specials and new products</li>
            <li>To inform you about important equine-related health, safety and/or welfare matters</li>
          </ul>

          <p>xmate.com.au will not sell or rent your personally identifiable information to anyone.</p>

          <p>xmate.com.au will send personally identifiable information about you to other companies or people when:</p>
          <ul className="list-disc ml-6 space-y-1 text-gray-300">
            <li>We have your consent to share the information</li>
            <li>We need to share your information to provide the product or service you requested</li>
            <li>
              We need to send the information to companies who work on behalf of xmate.com.au
              to provide a product or service to you (these companies do not have any right to
              use the information beyond what is necessary to assist us)
            </li>
            <li>We respond to subpoenas, court orders or legal process</li>
            <li>Your actions violate the xmate.com.au agreement or usage guidelines</li>
            <li>We determine it is important to inform you about equine-related health, safety and/or welfare matters</li>
          </ul>

          <p>xmate.com.au may set and access cookies on your computer.</p>

          <p>
            We may allow other companies presenting advertisements on some of our pages to set
            and access their cookies. Other companies' use of their cookies is subject to their
            own privacy policies, not this one. Advertisers or other companies do not have access
            to xmate.com.au's cookies.
          </p>

          <p>
            We may use web beacons to access our cookies within our network of websites and in
            connection with xmate.com.au products and services.
          </p>

          <p>
            You can edit your account information and preferences at any time, including whether
            you want xmate.com.au to contact you about specials and new products.
          </p>

          <p>Your account information is password-protected for your privacy and security.</p>

          <p>In certain areas we use industry-standard SSL-encryption to protect data transmissions.</p>

          <p>
            xmate.com.au may amend this policy from time to time. If we make substantial changes
            in the way we use your personal information we will notify you by posting a prominent
            announcement on our pages.
          </p>

          <p>
            If you have questions or suggestions send an e-mail to{" "}
            <span className="text-[#e23e44] font-semibold">team@xmate.com.au</span>.
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default PrivacyPolicyPage;
