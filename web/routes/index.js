var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

    var hue = req.app.get("hue");
    
    res.render('index', {
        connectionStatus: hue.connectionStatus,
        lightCount: hue.lightCount,
        currentShow: hue.currentShow,
        selectedGroup: hue.lightGroup,
        lightGroups: hue.fullState.groups,
        lightShows: Object.keys(hue.lightShows)
    });
});

module.exports = router;