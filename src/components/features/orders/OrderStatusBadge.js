import React from 'react';
import { getStatusDisplayInfo } from './ordersUtils.js';

const OrderStatusBadge = ({ statusKey }) => {
    const statusInfo = getStatusDisplayInfo(statusKey);
    return (
        React.createElement("span", { 
            className: `text-xs font-medium px-2.5 py-1 rounded-full border ${statusInfo.colorClass}`
        }, statusInfo.text)
    );
};

export { OrderStatusBadge };