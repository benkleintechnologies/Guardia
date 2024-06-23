import express from "express";
import LocationsCtrl from "./locations.controller";

const router = express.Router();

router.route("/").get(LocationsCtrl.apiGetLocations);
    
export default router;