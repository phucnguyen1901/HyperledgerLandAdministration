
const { getMessage } = require('../controller/saveUser');



module.exports.requireAuth = async (req, res, next) => {
  if (!req.session.user) {
    res.redirect("/login");
    return;
  }

  
  let ListMessages = await getMessage(req.session.user.userId);
  let countMessages = ListMessages.filter(e => e["Seen"] == false)
  console.log(`list MS: ${ListMessages}`)
  console.log(`Length: ${countMessages}`)
  req.session.noty = {"listMessages":ListMessages, "countMessages":countMessages.length}
  
  res.locals.user = req.session.user;
  res.locals.noty = req.session.noty;

  next();
};


