const models = require('../models');
const response = require('../functions/serviceUtil.js');
const auth = require('../middlewares/auth.js');
const CustomError = require('../functions/CustomError');

module.exports = {
  name: 'usersController',

  login: async (req, res, next) => {
    try {
      // Start Transaction
      const result = await models.sequelize.transaction(async (transaction) => {
        if (!req.body.password) throw new CustomError('Please send a Password', 412);

        const user = await models.user.findOne({
          where: {
            name: req.body.name,
          },
          transaction,
        });

        if (!user) throw new CustomError('Incorrect User or Password', 401);
        if (!user.checkPassword(req.body.password)) throw new CustomError('Incorrect User or Password', 401);

        res.cookie('user_id', user.user_id)

        return {
          id: user.user_id,
          name: user.name,
          token: auth.generateAccessToken({
            user_id: user.user_id,
            name: user.name,
          }),
        };
      });
      // Transaction complete!
      res.status(200).send(response.getResponseCustom(200, result));
      res.end();
    } catch (error) {
      // Transaction Failed!
      next(error);
    }
  },
};
