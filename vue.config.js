module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
        ? '/products-table/dist/'
        : '/'
}