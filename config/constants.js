const quoteStatus = {
    SENT: 'Sent',
    ANSWERED: 'Answered',
    REJECTED: 'Rejected',
    ARCHIVED: 'Archived',
};

const paymentStatus = {
    ON_WALLET: 'OnWallet',
    PAY_PENDING: 'PayPending',
    DISBURSED: 'Disbursed',
};

const pushActions = {
    SENT: 'Sent',
    ANSWERED: 'Answered',
    ON_WALLET: 'OnWallet'
};

module.exports = {
    quoteStatus,
    paymentStatus,
    pushActions,
}