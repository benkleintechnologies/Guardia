import { Collection, Db } from "mongodb";

//This location object and everything related to it is a placeholder for the actual data model that will be used in the application.
interface Location {
    vesselterms: string;
    feature_type: string;
    chart: string;
    latdec: number;
    londec: number;
    gp_quality: string;
    depth: number;
    sounding_type: string;
    history: string;
    quasou: string;
    watlev: string;
    coordinates: number[];
}

export interface LocationFilter {
    feature_type?: string;
    latdec?: number;
    londec?: number;
}

let locations: Collection<Location> | null = null;

export default class LocationsDAO {
    static async injectDB(conn: Db): Promise<void> {
        if (locations) {
            return;
        }
        try {
            locations = await conn.collection<Location>("shipwrecks");
        } catch (e) {
            console.error(`Unable to establish collection handles in locationsDAO: ${e}`);
        }
    }

    static async getLocations({
        filters = null,
        page = 0,
        locationsPerPage = 20,
    }: {
        filters?: LocationFilter | null;
        page?: number;
        locationsPerPage?: number;
    } = {}): Promise<{ locationsList: Location[]; totalNumLocations: number }> {
        let query: Record<string, any> = {};
        if (filters) {
            if ("feature_type" in filters) {
                query = { "feature_type": filters.feature_type };
            } else if ("latdec" in filters) {
                query = { "latdec": filters.latdec };
            } else if ("londec" in filters) {
                query = { "londec": filters.londec };
            }
        }

        try {
            if (!locations) {
                throw new Error("Database not initialized. Call injectDB first.");
            }

            const cursor = locations.find(query);
            const displayCursor = cursor.limit(locationsPerPage).skip(locationsPerPage * page);

            const [locationsList, totalNumLocations] = await Promise.all([
                displayCursor.toArray(),
                locations.countDocuments(query)
            ]);

            return { locationsList, totalNumLocations };
        } catch (e) {
            console.error(`Unable to fetch locations: ${e}`);
            return { locationsList: [], totalNumLocations: 0 };
        }
    }
}