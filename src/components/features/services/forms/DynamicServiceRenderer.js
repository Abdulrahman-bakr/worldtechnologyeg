import React from "react";
import {
    GameTopupForm,
    InternetBillForm,
    MobileCardTopupForm,
    MobileTopupForm,
    MobileBillForm,
    LandlineBillForm,
    FawryPayForm,
    TrainTicketForm,
    InstaPayForm,
    CashToInstaPayForm,
    VerificationPaymentForm,
    MilitaryTravelPermitForm,
    InteriorTravelPermitForm,
    FlightTicketForm,
    // 👇 هنا بنستورد النسخة الجديدة بدل القديمة
    DigitalCodeFormNew as DigitalCodeForm
} from "./index.js";


export const DynamicServiceRenderer = ({
  product,
  onInitiateDirectCheckout,
  allDigitalPackages,
  allFeeRules,
  onVariantChange
}) => {
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
    "military_travel_permit": MilitaryTravelPermitForm,
    "interior_travel_permit": InteriorTravelPermitForm,
    "flight_ticket_booking": FlightTicketForm,
    // ✅ استخدم النسخة الجديدة هنا أيضًا
    "digital_code_topup": DigitalCodeForm,
  };

  let componentKey;

  // تحديد المكون الصحيح
  if (product.dynamicServiceId && forms[product.dynamicServiceId]) {
    componentKey = product.dynamicServiceId;
  } else if (product.dynamicServiceType && forms[product.dynamicServiceType]) {
    componentKey = product.dynamicServiceType;
  } else if (product.dynamicServiceType) {
    componentKey = product.dynamicServiceType.replace(/_/g, "-");
  }

  const ServiceComponent = forms[componentKey];

  if (!ServiceComponent)
    return React.createElement("p", null, "خدمة غير معروفة.");

  const props = {
    product,
    onInitiateDirectCheckout,
    allDigitalPackages,
    allFeeRules,
  };

  if (
    ServiceComponent === VerificationPaymentForm ||
    ServiceComponent === MilitaryTravelPermitForm
  ) {
    props.onVariantChange = onVariantChange;
  }

  return React.createElement(
    "div",
    {
      className:
        "bg-white dark:bg-dark-800 p-4 sm:p-5 rounded-lg shadow-md border border-light-200 dark:border-dark-700",
    },
    React.createElement(ServiceComponent, props)
  );
};
