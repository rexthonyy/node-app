const db = {
    assigned_shift_activities: "assigned_shift_activities",
    assigned_shifts: "assigned_shifts",
    day_notes: "day_notes",
    open_shift_activities: "open_shift_activities",
    open_shifts: "open_shifts",
    request_offer: "request_offer",
    request_swap: "request_swap",
    request_time_off: "request_time_off",
    requests: "requests",
    settings: "settings",
    shift_activities: "shift_activities",
    shift_group_members: "shift_group_members",
    shift_groups: "shift_groups",
    user_time_offs: "user_time_offs",

    account_user: "account_user",
    account_address: "account_address",
    account_user_addresses: "account_user_addresses",
    channel_channel: "channel_channel",

    auth_group: "auth_group",
    auth_permissions: "auth_permission",
    auth_group_permissions: "auth_group_permissions",
    account_user_groups: "account_user_groups",
    account_user_user_permissions: "account_user_user_permissions",


    attribute_assignedproductattribute: "attribute_assignedproductattribute",
    attribute_assignedproductattributevalue: "attribute_assignedproductattributevalue",
    attribute_assignedvariantattribute: "attribute_assignedvariantattribute",
    attribute_assignedvariantattributevalue: "attribute_assignedvariantattributevalue",
    attribute_attribute: "attribute_attribute",
    attribute_attributeproduct: "attribute_attributeproduct",
    attribute_attributetranslation: "attribute_attributetranslation",
    attribute_attributevalue: "attribute_attributevalue",
    attribute_attributevaluetranslation: "attribute_attributevaluetranslation",
    attribute_attributevariant: "attribute_attributevariant",
    attribute_assignedpageattributevalue: "attribute_assignedpageattributevalue",
    checkout_checkout: "checkout_checkout",
    checkout_checkout_gift_cards: "checkout_checkout_gift_cards",
    discount_voucher_products: "discount_voucher_products",
    discount_sale_products: "discount_sale_products",
    discount_sale_variants: "discount_sale_variants",
    discount_sale: "discount_sale",
    discount_salechannellisting: "discount_salechannellisting",
    giftcard_giftcard: "giftcard_giftcard",
    giftcard_giftcard_tags: "giftcard_giftcard_tags",
    giftcard_giftcardevent: "giftcard_giftcardevent",
    giftcard_giftcardtag: "giftcard_giftcardtag",
    order_order: "order_order",
    order_orderline: "order_orderline",
    order_fulfillment: "order_fulfillment",
    order_fulfillmentline: "order_fulfillmentline",
    order_orderline: "order_orderline",
    payment_payment: "payment_payment",
    payment_transaction: "payment_transaction",
    product_category: "product_category",
    product_categorytranslation: "product_categorytranslation",
    product_collection: "product_collection",
    product_collectionproduct: "product_collectionproduct",
    product_collectiontranslation: "product_collectiontranslation",
    product_digitalcontent: "product_digitalcontent",
    product_digitalcontenturl: "product_digitalcontenturl",
    product_product: "product_product",
    product_productmedia: "product_productmedia",
    product_producttranslation: "product_producttranslation",
    product_producttype: "product_producttype",
    product_productvariant: "product_productvariant",
    product_productvariantchannellisting: "product_productvariantchannellisting",
    product_productvarianttranslation: "product_productvarianttranslation",
    product_variantmedia: "product_variantmedia",
    shipping_shippingmethod: "shipping_shippingmethod",
    shipping_shippingmethodtranslation: "shipping_shippingmethodtranslation",
    warehouse_warehouse: "warehouse_warehouse",
    app_app: "app_app",
    app_app_permissions: "app_app_permissions",
    app_appextension: "app_appextension",
};

const colorValue = {
    WHITE: "#fbf3a0",
    BLUE: "#cce4f7",
    GREEN: "#e8f2d1",
    PURPLE: "#e6e4f8",
    PINK: "#ffd9d9",
    YELLOW: "#fbf3a0",
    GRAY: "#f3f2f1",
    DARK_BLUE: "#cce4f7",
    DARK_GREEN: "#e8f2d1",
    DARK_PURPLE: "#e6e4f8",
    DARK_PINK: "#ffd9d9",
    DARK_YELLOW: "#fbf3a0",
}

const unpaidBreakValue = {
    MIN_0: 0,
    MIN_15: 15,
    MIN_30: 30,
    MIN_45: 45,
    MIN_60: 60,
    MIN_75: 75,
    MIN_90: 90
}

const requestType = {
    requestTimeOff: "requestTimeoff",
    requestOffer: "requestOffer",
    requestSwap: "requestSwap"
}

const requestStatus = {
    pending: "pending",
    approved: "approved",
    rejected: "rejected",
    cancelled: "cancelled"
}

const settingsType = {
    start_of_week: "start_of_week",
    open_shifts: "open_shifts",
    requests: "requests",
    copying_shifts: "copying_shifts"
}

module.exports = {
    db,
    colorValue,
    unpaidBreakValue,
    requestType,
    requestStatus,
    settingsType
};