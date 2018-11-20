var PendingInvitation = require("../models/pending-invitation");
var express = require('express');
var router = express.Router();

var passport = require('passport');
require('../config/passport')(passport);
var validtoken = require('../middleware/valid-token')

router.post('/', [passport.authenticate(['basic', 'jwt'], { session: false }), validtoken], function (req, res) {

  console.log(req.body);
  var newPendingInvitation = new PendingInvitation({
    email: req.body.email,
    role: req.body.role,
    id_project: req.id_projectid,
    createdBy: req.user.id,
    updatedBy: req.user.id
  });

  newPendingInvitation.save(function (err, savedPendingInvitation) {
    if (err) {
      console.log('--- > ERROR ', err)
      return res.status(500).send({ success: false, msg: 'Error saving object.' });
    }
    res.json(savedPendingInvitation);
  });
});

router.put('/:pendinginvitationid', [passport.authenticate(['basic', 'jwt'], { session: false }), validtoken], function (req, res) {

  console.log('PENDING INVITATION UPDATE - BODY ', req.body);

  PendingInvitation
    .findByIdAndUpdate(req.params.pendinginvitationid, req.body, { new: true, upsert: true },
      function (err, updatedPendingInvitation) {
        if (err) {
          return res.status(500).send({ success: false, msg: 'Error updating object.' });
        }
        res.json(updatedPendingInvitation);
      });
});


router.delete('/:pendinginvitationid', [passport.authenticate(['basic', 'jwt'], { session: false }), validtoken], function (req, res) {

  console.log('PENDING INVITATION DELETE - BODY ', req.body);

  PendingInvitation.remove({ _id: req.params.pendinginvitationid }, function (err, pendinginvitation) {
    if (err) {
      return res.status(500).send({ success: false, msg: 'Error deleting object.' });
    }
    res.json(pendinginvitation);
  });
});


router.get('/:pendinginvitationid', [passport.authenticate(['basic', 'jwt'], { session: false }), validtoken], function (req, res) {

  console.log('PENDING INVITATION GET BY ID - BODY ', req.body);

  PendingInvitation.findById(req.params.pendinginvitationid, function (err, pendinginvitation) {
    if (err) {
      return res.status(500).send({ success: false, msg: 'Error getting object.' });
    }
    if (!pendinginvitation) {
      return res.status(404).send({ success: false, msg: 'Object not found.' });
    }
    res.json(pendinginvitation);
  });
});



router.get('/', [passport.authenticate(['basic', 'jwt'], { session: false }), validtoken], function (req, res) {

  console.log("GET PENDING INVITATION - req projectid", req.projectid);
 
  PendingInvitation.find({ "id_project": req.projectid }, function (err, pendinginvitation) {
    if (err) {
      console.log('GET PENDING INVITATION ERROR ', err);
      return (err);
    }
    if (!pendinginvitation) {
      return res.status(404).send({ success: false, msg: 'Object not found.' });
    }
    console.log('GET PENDING INVITATION ', pendinginvitation);
    
    res.json(pendinginvitation);
  });
});


module.exports = router;
