exports.getLogin = (req, res, next) => {
    res.render('pages/login', {
        currentCart: 0,
        total: 0,
        isAuthenticated: req.session.isLoggenIn
    });
};
exports.postLogin = (req, res, next) => {
    console.log('form => ', req.body);
    req.session.isLoggenIn = true;
    res.redirect('/login');
};
