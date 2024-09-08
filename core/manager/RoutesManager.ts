


const home = '/';
const about = '/about';
const orders = '/user/orders';
const userOrderOffers = '/user/orders/';
const userOrderDetails= '/user/orders/__order_id__/details'


const categories = '/services'
const category = '/services/'
const createOrder = '/user/orders/create'
const DirectRequest = '/services/providers'
const introLogin = '/auth/intro'
const login = '/auth/login'
const logout = '/auth/logout'
const resetPassword = '/auth/forget-password'
const register = '/auth/register'

const notifications = '/notifications'
const notificationsOrder = '/notifications/order'
const notificationBubble='/notifications/bubble'
const profile='/auth/profile'
const tickets='/tickets'
const addTicket='/tickets/add'
const ticketDetails='/tickets/__ticket_id__'
const addcity='/auth/profile/address'


const editOrderForm='/user/orders/__order_id__/details/edit'

// const mainCategories = '/categories/main'
// const subCategories = '/categories/sub'




export default {
    home,
    about,
    orders,
    categories,
    category,
    introLogin,
    login,
    logout,
    resetPassword,
    register,
    userOrderOffers,
    notifications,
    createOrder,
    DirectRequest,
    userOrderDetails,
    notificationsOrder,
    notificationBubble,
    profile,
    editOrderForm,
    tickets,
    addTicket,
    ticketDetails,
    addcity
    // mainCategories,
    // subCategories,
}