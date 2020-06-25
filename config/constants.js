const quoteStatus = {
    SENT: 'Sent',
    ANSWERED: 'Answered',
    REJECTED: 'Rejected',
    ACCEPTED: 'Accepted',
    NO_ACCEPTED: 'NoAccepted',
    ARCHIVED: 'Finished',
};

const paymentStatus = {
    ON_WALLET: 'OnWallet',
    PAY_PENDING: 'PayPending',
    DISBURSED: 'Disbursed',
};

const pushActions = {
    QUOTE: 'quote',
    ANSWERED: 'Answered',
    ON_WALLET: 'OnWallet',
};

const appRoles = {
    BUYER: 'Buyer',
    SELLER: 'Seller',
    DELIVER: 'Deliver'
};

module.exports = {
    quoteStatus,
    paymentStatus,
    pushActions,
    appRoles,
}