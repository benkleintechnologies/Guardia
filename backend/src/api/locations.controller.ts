import LocationsDAO, { LocationFilter } from "../dao/locationsDAO";

export default class LocationsController {
    static async apiGetLocations(req: any, res: any, next: any) {
        const locationsPerPage = req.query.locationsPerPage ? parseInt(req.query.locationsPerPage, 10) : 20;
        const page = req.query.page ? parseInt(req.query.page, 10) : 0;

        let filters: LocationFilter = {};
        if (req.query.feature_type) {
            filters.feature_type = req.query.feature_type;
        } else if (req.query.latdec || req.query.londec) {
            filters.latdec = req.query.latdec;
            filters.londec = req.query.londec;
        }

        const { locationsList, totalNumLocations } = await LocationsDAO.getLocations({
            filters,
            page,
            locationsPerPage,
        });

        let response = {
            locations: locationsList,
            page: page,
            filters: filters,
            entries_per_page: locationsPerPage,
            total_results: totalNumLocations,
        };
        res.json(response);
    }
}