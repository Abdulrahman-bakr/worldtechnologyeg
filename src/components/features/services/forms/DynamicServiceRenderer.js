import React from "react";
import { GameTopupForm } from "./GameTopupForm.js";
import { InternetBillForm } from "./InternetBillForm.js";
import { MobileCardTopupForm } from "./MobileCardTopupForm.js";
import { MobileTopupForm } from "./MobileTopupForm.js";
import { MobileBillForm } from "./MobileBillForm.js";
import { LandlineBillForm } from "./LandlineBillForm.js";
import { FawryPayForm } from "./FawryPayForm.js";
import { TrainTicketForm } from "./TrainTicketForm.js";
import { InstaPayForm } from "./InstaPayForm.js";
import { CashToInstaPayForm } from "./CashToInstaPayForm.js";
import { VerificationPaymentForm } from './VerificationPaymentForm.js';

export const DynamicServiceRenderer = ({ product, onInitiateDirectCheckout, allDigitalPackages, allFeeRules }) => {
  const forms = {
    "game-topup": GameTopupForm,
    "internet-bill": InternetBillForm,
    "mobile-card-topup": MobileCardTopupForm,
    "mobile-credit": MobileTopupForm,
    "mobile-bill-payment": MobileBillForm,
    "landline-bill-payment": LandlineBillForm,
    "fawry-pay": FawryPayForm,
    "train-ticket-booking": TrainTicketForm,
    "instapay-transfer": InstaPayForm,
    "cash-to-instapay": CashToInstaPayForm,
    "meta_verified_payment": VerificationPaymentForm,
  };

  let componentKey = (product.dynamicServiceType || '').replace(/_/g, '-');
  if (forms[product.dynamicServiceId]) {
    componentKey = product.dynamicServiceId;
  }
  
  const ServiceComponent = forms[componentKey];

  if (!ServiceComponent) return React.createElement("p", null, "خدمة غير معروفة.");

  return (
    React.createElement("div", { className: "bg-white dark:bg-dark-800 p-4 sm:p-5 rounded-lg shadow-md border border-light-200 dark:border-dark-700" },
      React.createElement(ServiceComponent, {
        product: product,
        onInitiateDirectCheckout: onInitiateDirectCheckout,
        allDigitalPackages: allDigitalPackages,
        allFeeRules: allFeeRules
      })
    )
  );
};
