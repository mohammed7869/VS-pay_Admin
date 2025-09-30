import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
    {
        id: 1,
        label: 'MENUITEMS.MENU.TEXT',
        isTitle: true
    },
    {
        id: 2,
        label: 'MENUITEMS.DASHBOARDS.TEXT',
        icon: 'ri-dashboard-line',
        badge: {
            variant: 'success',
            text: 'MENUITEMS.DASHBOARDS.BADGE',
        },
        link: '/'
    },
    {
        id: 3,
        label: 'MENUITEMS.CALENDAR.TEXT',
        icon: 'ri-calendar-2-line',
        link: '/calendar'
    },
    {
        id: 4,
        label: 'MENUITEMS.CHAT.TEXT',
        icon: 'ri-chat-1-line',
        link: '/chat'
    },
    {
        id: 5,
        label: 'MENUITEMS.ECOMMERCE.TEXT',
        icon: 'ri-store-2-line',
        subItems: [
            {
                id: 6,
                label: 'MENUITEMS.ECOMMERCE.LIST.PRODUCTS',
                link: '/ecommerce/products',
                parentId: 5
            },
            {
                id: 8,
                label: 'MENUITEMS.ECOMMERCE.LIST.ORDERS',
                link: '/ecommerce/orders',
                parentId: 5
            },
            {
                id: 9,
                label: 'MENUITEMS.ECOMMERCE.LIST.CUSTOMERS',
                link: '/ecommerce/customers',
                parentId: 5
            },
            {
                id: 10,
                label: 'MENUITEMS.ECOMMERCE.LIST.CART',
                link: '/ecommerce/cart',
                parentId: 5
            },
            {
                id: 11,
                label: 'MENUITEMS.ECOMMERCE.LIST.CHECKOUT',
                link: '/ecommerce/checkout',
                parentId: 5
            },
            {
                id: 12,
                label: 'MENUITEMS.ECOMMERCE.LIST.SHOPS',
                link: '/ecommerce/shops',
                parentId: 5
            },
            {
                id: 13,
                label: 'MENUITEMS.ECOMMERCE.LIST.ADDPRODUCT',
                link: '/ecommerce/add-product',
                parentId: 5
            },
        ]
    }
];
