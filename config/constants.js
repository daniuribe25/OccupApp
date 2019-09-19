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
    SENT: 'Sent',
    ANSWERED: 'Answered',
    ON_WALLET: 'OnWallet',
};

module.exports = {
    quoteStatus,
    paymentStatus,
    pushActions,
}