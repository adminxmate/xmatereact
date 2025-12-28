import React from "react";
import MainLayout from "../components/Layout/MainLayout";
import { MapPin, Mail, Phone } from "lucide-react";

const ContactPage = () => {
  return (
    <MainLayout>
      <div className="flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-lg bg-gray-900 rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold">Contact Us</h2>
            <p className="text-gray-400">Contact us to get started</p>
          </div>

          <div className="flex items-start gap-4 mb-6">
            <MapPin className="text-[#e23e44] w-6 h-6" />
            <div>
              <h4 className="font-semibold">Location:</h4>
              <p className="text-gray-300">
                Mamre Rd. Kemps Creek,<br /> NSW 2178
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 mb-6">
            <Mail className="text-[#e23e44] w-6 h-6" />
            <div>
              <h4 className="font-semibold">Email:</h4>
              <p className="text-gray-300">team@xmate.com.au</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Phone className="text-[#e23e44] w-6 h-6" />
            <div>
              <h4 className="font-semibold">Phone:</h4>
              <p className="text-gray-300">1300 078 237</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ContactPage;
